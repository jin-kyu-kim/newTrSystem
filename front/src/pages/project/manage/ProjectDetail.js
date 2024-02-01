import React, { useCallback, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { TabPanel } from "devextreme-react";
import { useLocation } from "react-router-dom";

import ProjectDetailJson from "./ProjectDetailJson.json";

import Button from "devextreme-react/button";
import LinkButton from "../../../components/unit/LinkButton.js";

const ProjectDetail = () => {
  const navigate = useNavigate ();
  const location = useLocation();
  const projId = location.state.id;
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
        {/* <LinkButton location={"../project/ProjectChange"} name={"변경원가"} type={"default"} stylingMode={"contained"}/> */}
        <Button
          width={110}
          text="Contained"
          type="default"
          stylingMode="contained"
          style={{ margin: "2px" }}
          onClick={(e)=>
            navigate("../project/ProjectChange",
              {
            state: { projId: projId },
            })
          }
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
        <LinkButton location={-1} name={"목록"} type={"normal"} stylingMode={"outline"}/>
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
              <Component projId={projId} />
            </React.Suspense>
          );
        }}
        />
      </div>
    </div>
  );
};

export default ProjectDetail;
