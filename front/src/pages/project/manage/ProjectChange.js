import React, { useCallback, useState, Suspense, lazy } from "react";
import { TabPanel } from "devextreme-react";
import { useLocation } from "react-router-dom";
import { Button } from "devextreme-react/button";

import ProjectChangeJson from "./ProjectChangeJson.json";

import LinkButton from "../../../components/unit/LinkButton.js";

const ProjectChange = () => {
  const location = useLocation();
  const prjctId = location.state ? location.state.prjctId : null;
  const ctrtYmd = location.state ? location.state.ctrtYmd : null;
  const bizEndYmd = location.state ? location.state.bizEndYmd : null;
  const [selectedIndex, setSelectedIndex] = useState(0);

  const ProjectChange = ProjectChangeJson;

  // 탭 변경시 인덱스 설정
  const onSelectionChanged = useCallback(
    (args) => {
      if (args.name === "selectedIndex") {
        setSelectedIndex(args.value);
      }
    },[]
  );

  const itemTitleRender = (a) => <span>{a.TabName}</span>;
 

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
        <Button>승인요청</Button>
        <LinkButton location={-1} name={"이전"} type={"normal"} />
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
          dataSource={ProjectChange}
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
              revise={true}
              tabId={data.tabId}
              />
            </Suspense>
          );
          }
        }}
        />
      </div>
    </div>
  );
};

export default ProjectChange;
