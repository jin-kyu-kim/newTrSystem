import React, { useCallback, useState } from "react";
import { TabPanel } from "devextreme-react";
import { useLocation } from "react-router-dom";

import ProjectDetailJson from "./ProjectDetailJson.json";

import Button from "devextreme-react/button";
import LinkButton from "../../../components/unit/LinkButton.js";

const ProjectDetail = () => {
  const location = useLocation();
  const projIdInfo = location.state.id;
  const [selectedIndex, setSelectedIndex] = useState(0);

  const ProjectDetail = ProjectDetailJson;

  // 탭 변경시 인덱스 설정
  const onSelectionChanged = useCallback(
    //selectedIndex값이 변경될때마다 해당 함수를 새로 생성하지 않고 재사용 하기 위해 useCallback 사용
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
        <Button
          width={80}
          text="Contained"
          type="default"
          stylingMode="contained"
          style={{ margin: "2px" }}
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
        <LinkButton location={-1} name={"목록"} type={"normal"} />
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
              <Component projIdInfo={projIdInfo} />
            </React.Suspense>
          );
        }}
        />
      </div>
    </div>
  );
};

export default ProjectDetail;
