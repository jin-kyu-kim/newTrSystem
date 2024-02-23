import React, { useCallback, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { TabPanel } from "devextreme-react";
import { useLocation } from "react-router-dom";
import ApiRequest from "../../../utils/ApiRequest";

import ProjectDetailJson from "./ProjectDetailJson.json";

import Button from "devextreme-react/button";
import LinkButton from "../../../components/unit/LinkButton.js";

//TODO. 프로젝트 리스트에서 프로젝트 상태?형태?코드 정보 받아와서 그 정보에따라 변경원가 클릭시 작동 다르게 하기.

const ProjectDetail = () => {
  const navigate = useNavigate ();
  const location = useLocation();
  const prjctId = location.state.prjctId;
  const totBgt = location.state.totBgt;
  const bgtMngOdr = location.state.bgtMngOdr;
  const ctrtYmd = location.state.ctrtYmd;
  const bizEndYmd = location.state.bizEndYmd;
  const bgtMngOdrToBe = location.state.bgtMngOdrToBe;
  const [selectedIndex, setSelectedIndex] = useState(0);

  const ProjectDetail = ProjectDetailJson;

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

  const projectChgHandle = () => {
    console.log(bgtMngOdr)
    const isconfirm = window.confirm("프로젝트 변경을 진행하시겠습니까?");
    if(isconfirm){
      handleBgtPrmpc();

      navigate("../project/ProjectChange",
        {
        state: { prjctId: prjctId, ctrtYmd: ctrtYmd, bizEndYmd: bizEndYmd, bgtMngOdr:bgtMngOdr, bgtMngOdrToBe: bgtMngOdrToBe, },
        })
    }
  }

  const handleBgtPrmpc = async () => {
    const date = new Date();

    const param = [ 
      { tbNm: "PRJCT_BGT_PRMPC" },
      { 
        prjctId: prjctId,
        totAltmntBgt: totBgt,
        bgtMngOdr: bgtMngOdr,
        atrzDmndSttsCd: "VTW03301",
        regDt : date.toISOString().split('T')[0]+' '+date.toTimeString().split(' ')[0]
      }, 
    ]; 
    try {
        const response = await ApiRequest("/boot/prjct/insertProjectCostChg", param);
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
        {/* <LinkButton location={"../project/ProjectChange"} name={"변경원가"} type={"default"} stylingMode={"contained"} prjctId={prjctId}/> */}
        <Button
          width={110}
          text="Contained"
          type="default"
          stylingMode="contained"
          style={{ margin: "2px" }}
          onClick={projectChgHandle}
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
        <LinkButton location={"../project/ProjectList"} name={"목록"} type={"normal"} stylingMode={"outline"}/>
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
          return (
            <React.Suspense fallback={<div>Loading...</div>}>
              <Component prjctId={prjctId} ctrtYmd={ctrtYmd} bizEndYmd={bizEndYmd} bgtMngOdr={bgtMngOdr} />
            </React.Suspense>
          );
        }}
        />
      </div>
    </div>
  );
};

export default ProjectDetail;
