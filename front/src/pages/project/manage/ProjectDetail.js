import React, { useCallback, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { TabPanel } from "devextreme-react";
import { useLocation } from "react-router-dom";
import ApiRequest from "../../../utils/ApiRequest";
import { useCookies } from "react-cookie";

import ProjectDetailJson from "./ProjectDetailJson.json";

import Button from "devextreme-react/button";
//TODO. 프로젝트 리스트에서 프로젝트 상태?형태?코드 정보 받아와서 그 정보에따라 변경원가 클릭시 작동 다르게 하기.

const ProjectDetail = () => {
  const navigate = useNavigate ();
  const location = useLocation();
  const prjctId = location.state.prjctId;
  const totBgt = location.state.totBgt;
  const bgtMngOdr = location.state.bgtMngOdr;
  const ctrtYmd = location.state.ctrtYmd;
  const stbleEndYmd = location.state.stbleEndYmd;
  const bgtMngOdrTobe = location.state.bgtMngOdrTobe;
  const bizSttsCd = location.state.bizSttsCd;
  const deptId = location.state.deptId;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [atrzLnSn, setAtrzLnSn] = useState();
  const [cookies, setCookie] = useCookies(["userInfo", "userAuth"]);
  const atrzDmndSttsCd = "VTW03703";

  const ProjectDetail = ProjectDetailJson;

  const empId = cookies.userInfo.empId;

  console.log("bgtMngOdrTobe", bgtMngOdrTobe)
  console.log("bgtMngOdr", bgtMngOdr)
  console.log("atrzLnSn",   atrzLnSn)
  console.log("ctrtYmd",   ctrtYmd)
  console.log("stbleEndYmd",   stbleEndYmd)

  
  useEffect(() => {
  
    const param = { 
      queryId: "projectMapper.retrievePrjctAtrzLnSn",
      prjctId: prjctId,
    };

    const response = ApiRequest("/boot/common/queryIdSearch", param);

    response.then((value) => {
      if(value[0] !== null) {
        setAtrzLnSn(value[0].atrzLnSn);
      }
    });
  
  }, []);



  // 탭 변경시 인덱스 설정
  const onSelectionChanged = useCallback(
    (args) => {
      if (args.name === "selectedIndex") {
        setSelectedIndex(args.value);
      }
    },
    [setSelectedIndex]
  );
  
  const itemTitleRender = (a) => <span>{a.TabName}</span>;

  /**
   * 변경원가 버튼 클릭
   */
  const onClikcChngBgt = async () => {
    if(atrzLnSn === undefined) {
      // null이면 check 할 필요가 없다.
      const isconfirm = window.confirm("프로젝트 변경을 진행하시겠습니까?");
      if(isconfirm){
        await projectChgHandle();
      }
    } else {
      const result = await chkBgtOdr().then((value) => {
        return value;
      });

      if(result != null) {
        if(result === 'VTW03701') {
          // 임시저장인 경우
          const isconfirm = window.confirm("임시저장된 내역이 있습니다. 수정을 진행하시겠습니까?");
          if(isconfirm) {
            await projectChgHandle();
          }
        } else if (result === 'VTW03704' ) {
          // 반려인 경우
          const isconfirm = window.confirm("기존에 반려된 요청이 존재합니다. 반려된 요청을 수정하시겠습니까?");
          if(isconfirm) {
              const isconfirm = window.confirm("기존에 반려된 요청의 변경 사항을 초기화하여 수정하시겠습니까?");
              if(isconfirm) {
                await resetPrmpc();
              } else {
                const isconfirm = window.confirm("반려된 요청을 이어서 수정하시겠습니까?");
                if(isconfirm){
                  await projectChgHandle();
                }
              }
          } 
        } else {
          const isconfirm = window.confirm("프로젝트 변경을 진행하시겠습니까?");
          if(isconfirm){
            await projectChgHandle();
          }
        }
      }
    }
  };

  const projectChgHandle = async () => {

      let targetOdr;
      
      const result = await handleBgtPrmpc().then((value) => {

        if(value === -1) {
          alert("문제가 발생하였습니다. 괸리자에게 문의하세요.");
          return;
        }
          targetOdr = value;
      });
      navigate("../project/ProjectChange",
        {
        state: { prjctId: prjctId
               , ctrtYmd: ctrtYmd
               , stbleEndYmd: stbleEndYmd
               , bgtMngOdr:bgtMngOdr
               , bgtMngOdrTobe: bgtMngOdrTobe
               , targetOdr: targetOdr
               , bizSttsCd: bizSttsCd
               , atrzLnSn: atrzLnSn
               , deptId: deptId},
      })
  }

  /**
   * 승인이 반려된 차수일 때 이를 초기화 요청 시
   * 다음차수로 올린 뒤 최종 승인 완료된 값을 넣어준다.
   */
  const resetPrmpc = async () => {
    const date = new Date();
    
    const param = {
      prjctId: prjctId,
      totAltmntBgt: totBgt,
      bgtMngOdr: bgtMngOdr,
      bgtMngOdrTobe: bgtMngOdrTobe,
      atrzDmndSttsCd: "VTW03701",
      regDt : date.toISOString().split('T')[0]+' '+date.toTimeString().split(' ')[0],
      regEmpId: empId
    };

    try {
      const response = await ApiRequest("/boot/prjct/resetPrmpc", param);
      console.log(response);
      if(response > 0) {
        navigate("../project/ProjectChange",
        {
        state: { prjctId: prjctId
               , ctrtYmd: ctrtYmd
               , stbleEndYmd: stbleEndYmd
               , bgtMngOdr: bgtMngOdr
               , bgtMngOdrTobe: response
               , targetOdr: response
               , bizSttsCd: bizSttsCd
               , atrzLnSn: atrzLnSn
               , deptId: deptId},
        })
      }

    } catch (error) {
      console.error('Error fetching data', error);
    }

  };

  /**
   * 변경원가 차수가 반려되거나 임시저장인 차수인지 확인한다.
   * VTW03701: 임시저장
   * VTW03704: 반려
   * @returns 
   */
  const chkBgtOdr = async () => {
    console.log("반려/임시저장 여부 확인");

    const param = { 
      queryId: "projectMapper.retrieveTmprRjctBgtOdr",
      prjctId: prjctId,
      bgtMngOdr: bgtMngOdrTobe
    };

    const response = await ApiRequest("/boot/common/queryIdSearch", param);

    return response[0].atrzDmndSttsCd;
  };

  const handleBgtPrmpc = async () => {
    const date = new Date();

    const param = [ 
      { tbNm: "PRJCT_BGT_PRMPC" },
      { 
        prjctId: prjctId,
        totAltmntBgt: totBgt,
        bgtMngOdr: bgtMngOdr,
        bgtMngOdrTobe: bgtMngOdrTobe,
        atrzDmndSttsCd: "VTW03701",
        regDt : date.toISOString().split('T')[0]+' '+date.toTimeString().split(' ')[0],
        regEmpId: empId
      }, 
    ]; 
    try {
        const response = await ApiRequest("/boot/prjct/insertProjectCostChg", param);
        console.log("response", response);
        return response;
    } catch (error) {
        console.error('Error fetching data', error);
    }
  }

  return (
    <div>
      <div
        className="title p-1"
        style={{ marginTop: "20px", marginBottom: "10px" }}
      >
        <div style={{ marginRight: "20px", marginLeft: "20px" }}>
          <h1 style={{ fontSize: "30px" }}>프로젝트 관리</h1>
          <div>{location.state.prjctNm}</div>
        </div>
      </div>
      <div className="buttons" align="right" style={{ margin: "20px" }}>
        <Button
          width={110}
          text="Contained"
          type="default"
          stylingMode="contained"
          style={{ margin: "2px" }}
          onClick={onClikcChngBgt}
        >
          변경원가
        </Button>
        <Button
          width={110}
          text="Contained"
          type="default"
          stylingMode="contained"
          style={{ margin: "2px" }}
        >
          프로젝트종료
        </Button>
        <Button
          width={50}
          text="Contained"
          type="normal"
          stylingMode="outline"
          style={{ margin : '2px' }}
          onClick={() => navigate("../project/ProjectList")}
        >
          목록
        </Button>
      </div>
      <div
        style={{
          marginTop: "20px",
          marginBottom: "10px",
          width: "100%",
          height: "100%",
        }}
      >
        <TabPanel
          height="auto"
          width="auto"
          dataSource={ProjectDetail}
          selectedIndex={selectedIndex}
          onOptionChanged={onSelectionChanged}
          itemTitleRender={itemTitleRender}
          animationEnabled={true}
          itemComponent={({ data }) => {
          const Component = React.lazy(() => import(`${data.url}`));
          if(data.index === selectedIndex) {
              return (
                <React.Suspense fallback={<div>Loading...</div>}>
                <Component prjctId={prjctId} ctrtYmd={ctrtYmd} stbleEndYmd={stbleEndYmd} bgtMngOdr={bgtMngOdr} bgtMngOdrTobe={bgtMngOdrTobe} atrzDmndSttsCd={atrzDmndSttsCd}/>
              </React.Suspense>
            );
          }
        }}
        />
      </div>
    </div>
  );
};

export default ProjectDetail;
