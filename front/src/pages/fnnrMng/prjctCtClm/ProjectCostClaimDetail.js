import React, { useCallback, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { TabPanel } from "devextreme-react";
import { useLocation } from "react-router-dom";
import ApiRequest from "../../../utils/ApiRequest";

import ProjectCostClaimDetailJson from "./ProjectCostClaimDetailJson.json";

const ProjectCostClaimDetail = () => {
  const navigate = useNavigate ();
  const location = useLocation();
  const prjctId = location.state.prjctId;
  const totBgt = location.state.totBgt;
  const bgtMngOdr = location.state.bgtMngOdr;
  const ctrtYmd = location.state.ctrtYmd;
  const bizEndYmd = location.state.bizEndYmd;
  const bgtMngOdrTobe = location.state.bgtMngOdrTobe;
  const bizSttsCd = location.state.bizSttsCd;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [atrzLnSn, setAtrzLnSn] = useState();

  const ProjectCostClaimDetail = ProjectCostClaimDetailJson;
  
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
          dataSource={ProjectCostClaimDetail}
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

export default ProjectCostClaimDetail;
