import React, { useCallback, useState, Suspense, lazy, useMemo, useEffect } from "react";
import { TabPanel } from "devextreme-react";
import { useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { Button } from "devextreme-react/button";
import TextArea from 'devextreme-react/text-area';
import ToolbarItem from "devextreme-react/popup";

import ProjectChangeJson from "./ProjectChangeJson.json";

import LinkButton from "../../../components/unit/LinkButton.js";
import CustomPopup from "../../../components/unit/CustomPopup";

import { useCookies } from "react-cookie";
import ApiRequest from "utils/ApiRequest";
import { set } from "date-fns";

const ProjectChange = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const prjctId = location.state ? location.state.prjctId : null;
  const ctrtYmd = location.state ? location.state.ctrtYmd : null;
  const bizEndYmd = location.state ? location.state.bizEndYmd : null;
  const bgtMngOdr = location.state ? location.state.bgtMngOdr : null;
  const bgtMngOdrTobe = location.state ? location.state.bgtMngOdrTobe : null;
  const targetOdr = location.state ? location.state.targetOdr : null;
  const bizSttsCd = location.state ? location.state.bizSttsCd : null;
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [atrzAplyPrvonshCn, setAtrzAplyPrvonshCn] = useState("");

  const ProjectChangeTab = ProjectChangeJson.tab;
  const popup = ProjectChangeJson.popup;

  const [popupVisible, setPopupVisible] = useState(false);

  const [cookies, setCookie] = useCookies(["userInfo", "userAuth"]);
  const empId = cookies.userInfo.empId;
  const deptId = cookies.userInfo.deptId;
  const buttonState = { prjctId: prjctId, ctrtYmd: ctrtYmd, bizEndYmd: bizEndYmd, bgtMngOdr:bgtMngOdr, };
  // console.log("buttonState?",buttonState);
  const [requestBtnVisible, setAprvBtnVisible] = useState(true);
  const [cancelBtnVisible, setCancelBtnVisible] = useState(false);

  console.log(bgtMngOdrTobe)
  useEffect(() => {

    // 해당 프로젝트에 승인요청중인 내역이 있는지 확인한다.
    // 확인 후 있을 경우 -> 승인요청 버튼을 비활성화한다. / 승인취소 버튼을 활성화한다.
    // 확인 후 없을 경우 -> 승인요청 버튼을 활성화한다. / 승인취소 버튼을 비활성화한다.
    const param = [
      { tbNm: "PRJCT_BGT_PRMPC" },
      {
        prjctId: prjctId,
        bgtMngOdr: bgtMngOdrTobe,
      }
    ]

    const response = ApiRequest("/boot/common/commonSelect", param);
    response.then((value) => {

      if(value[0].atrzDmndSttsCd === "VTW03302") {
        setAprvBtnVisible(false);
        setCancelBtnVisible(true);
      }
    });
  }, []);


  // 탭 변경시 인덱스 설정
  const onSelectionChanged = useCallback(
    (args) => {
      if (args.name === "selectedIndex") {
        setSelectedIndex(args.value);
      }
    },[]
  );

  const itemTitleRender = (a) => <span>{a.TabName}</span>;
 
  const onPopup = () => {
    setPopupVisible(true);
  }

  const handleClose = () => {
    setPopupVisible(false);
  };

  const onSubmit = () => {

    // 확인 로직
    const boolean = false;

    if(boolean) {
      alert("승인요청중인 내역이 있습니다. 승인요청을 취소하고 다시 요청해주세요.");
      return;
    } else {
      const isconfirm = window.confirm("승인요청을 진행합니다. 승인을 요청하시겠습니까?");
      if(isconfirm){
        handleAtrzLn();
      }
    }
  }

  const onTextAreaValueChanged = useCallback((e) => {
    setAtrzAplyPrvonshCn(e.value);
  }, []);
  

  const handleAtrzLn = async () => {
    const date = new Date();
    const param = [
      { tbNm: "PRJCT_ATRZ_LN"},
      { tbNm: "PRJCT_ATRZ_LN_DTL"},
      { 
        prjctId: prjctId,
        empId: empId,
        deptId: deptId,
        regDt : date.toISOString().split('T')[0]+' '+date.toTimeString().split(' ')[0],
        atrzAplyPrvonshCn: atrzAplyPrvonshCn,
      },
    ];
    try {
      const response = await ApiRequest("/boot/prjct/insertRegistProjectAprv", param);
      console.log(response)

      if(response > 0) {

        /**
         * VTW03301	임시저장
          VTW03302	결재요청
          VTW03303	결재완료
         */

        // 승인요청 되면 PRJCT 수정해주기
        // BIZ_STTS_CD 컬럼이 생성중(VTW00401) 이면 그대로 둔다
        // BIZ_STTS_CD 컬럼이 생성중(VTW00401)이 아니면 -> VTW00403(변경중)
        if(bizSttsCd !== "VTW00401") {
          handlePrjctBizStts();
        }

        // 승인요청 되면 PRJCT_BGT_PRMPC 수정해주기
        // ATRZ_DMND_STTS_CD 컬럼 -> VTW03302(결재요청)
        handleBgtPrmpc();

        alert("승인요청이 완료되었습니다.");
        setPopupVisible(false);
        navigate("../project/ProjectAprv");
      } else {
        alert("승인요청이 실패되었습니다.");
      }
    } catch (error) {
      console.error('Error fetching data', error);
    }
  }

  const handleBgtPrmpc = async () => {
    const mdfcnDt = new Date().toISOString().split('T')[0]+' '+new Date().toTimeString().split(' ')[0];

    const param = [
      { tbNm : "PRJCT_BGT_PRMPC" },
      {
        atrzDmndSttsCd: "VTW03302",
        mdfcnEmpId: empId,
        mdfcnDt: mdfcnDt,
      },
      {
        prjctId: prjctId,
        bgtMngOdr: targetOdr,
      }
    ]

    await ApiRequest("/boot/common/commonUpdate", param);
  }

  const handlePrjctBizStts = async () => {
    const mdfcnDt = new Date().toISOString().split('T')[0]+' '+new Date().toTimeString().split(' ')[0];

    const param = [
      { tbNm : "PRJCT" },
      {
        bizSttsCd: "VTW00403",
        mdfcnEmpId: empId,
        mdfcnDt: mdfcnDt,
      },
      {
        prjctId: prjctId,
      }
    ]

    await ApiRequest("/boot/common/commonUpdate", param);
  }
  // console.log("prjctId!! 변경! ", prjctId);
  const toDetail = () => {
    console.log("prjctId!! 변경! ", prjctId);
    navigate("../project/ProjectDetail",
        {
        state: { prjctId: prjctId, ctrtYmd: ctrtYmd, bizEndYmd: bizEndYmd, bgtMngOdr:bgtMngOdr },
        })
  };

  /**
   * 승인요청취소 버튼 클릭
   */
  const onAprvCancel = async () => {
    // 승인 요청 취소를 눌렀을 때 어떤 것이 동작해야하는가?
    /**
     * 1. 승인결재선 테이블을 취소로 다 바꾼다. or 삭제한다. 
     * 2. 변경중에서 이전꺼로 ( 수행 or 생성중 )
     *   변경중 -> 수행으로 수정
     *
     * 언제는 승인 취소가 안될 때가 있지않은가?
     * 
     */

    console.log("승인취소 버튼 클릭");
  }

  return (
    <div>
      <div
        className="title p-1"
        style={{ marginTop: "20px", marginBottom: "10px" }}
      >
        <div style={{ marginRight: "20px", marginLeft: "20px" }}>
          <h1 style={{ fontSize: "30px" }}>프로젝트 변경</h1>
        </div>
      </div>
      <div className="buttons" align="right" style={{ margin: "20px" }}>
        <Button text="승인요청" onClick={onPopup} visible={requestBtnVisible}></Button>
        <Button text="승인요청취소" onClick={onAprvCancel} visible={cancelBtnVisible}/>
        {/* <LinkButton location={-1} name={"이전"} type={"normal"} state={buttonState}/> */}
        <Button text="이전" onClick={toDetail}/>
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
          dataSource={ProjectChangeTab}
          selectedIndex={selectedIndex}
          onOptionChanged={onSelectionChanged}
          itemTitleRender={itemTitleRender}
          itemComponent={({ data }) => {
          const Component = lazy(() => import(`${data.url}`));
          if (data.index === selectedIndex){
          return (
            <Suspense fallback={<div>Loading...</div>}>
              <Component 
                prjctId={prjctId}
                ctrtYmd={ctrtYmd}
                bizEndYmd={bizEndYmd}
                bgtMngOdrTobe={bgtMngOdrTobe}
                revise={true}
                tabId={data.tabId}
              />
            </Suspense>
          );
          }
        }}
        />
      </div>
      <CustomPopup props={popup} visible={popupVisible} handleClose={handleClose}>
        <TextArea 
          height="50%"
          valueChangeEvent="change"
          onValueChanged={onTextAreaValueChanged}
          placeholder="승인 요청 사유를 입력해주세요."
        />
        <br/>
        <Button text="승인요청" onClick={onSubmit}/>
        <Button text="요청취소" onClick={handleClose}/>
      </CustomPopup>
    </div>
  );
};

export default ProjectChange;
