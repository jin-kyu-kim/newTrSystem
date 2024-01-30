import { useCallback, useState, useEffect } from "react";
import { TabPanel } from "devextreme-react";
import { useLocation } from "react-router-dom";

import ProjectBaseInfo from "./ProjectBaseInfo.js"; //기본정보 탭 정보
import ProjectCostCalc from "./ProjectCostCalc.js"; //실행원가계산서
import ProjectCostTabs from "./ProjectCostTabs.js"; //실행원가계산서

import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.light.css";
import Button from "devextreme-react/button";
import LinkButton from "../../../components/unit/LinkButton.js";

import ProjectConsortium from "../etc/ProjectConsortium.js";

const ProjectDetail = () => {
  const location = useLocation();
  const projIdInfo = location.state.id;
  const [selectedIndex, setSelectedIndex] = useState(0);

  const TabName = [
    {
      TabName: "기본정보",
      projId: projIdInfo,
    },
    {
      TabName: "실행원가계산서",
    },
    {
      TabName: "실행원가집행현황",
    },
    {
      TabName: "결재정보",
    },
    {

      TabName: '설정', projId: projIdInfo, // 임시
    },
  ];

  const itemTitleRender = (a) => <span>{a.TabName}</span>;

  // 탭 변경시 인덱스 설정
  const onSelectionChanged = useCallback(
    //selectedIndex값이 변경될때마다 해당 함수를 새로 생성하지 않고 재사용 하기 위해 useCallback 사용
    (args) => {
      if (args.name === "selectedIndex") {
        setSelectedIndex(args.value); //Index 번호
      }
    },
    [setSelectedIndex]
  );

  //탭마다 다른 js 랜더링
  //TODO. 각각의 JS 생성 필요.
  const getTabItemComponent = (index) => {
    switch (index) {
      case 0:
        return ProjectCostCalc;
      case 1:
        return ProjectCostCalc;
      case 2:
        return ProjectCostTabs;
      case 3:
        return ProjectCostCalc;
      case 4:
        return ProjectConsortium; // 임시
      default:
        return ProjectCostCalc;
    }
  };

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
          // height={50}
          dataSource={TabName}
          selectedIndex={selectedIndex}
          onOptionChanged={onSelectionChanged}
          itemTitleRender={itemTitleRender}
          animationEnabled={true}
          itemComponent={({ data, index }) => {
            const TabItemComponent = getTabItemComponent(index, data);
            return <TabItemComponent prjctId={projIdInfo} />;
          }}
        />
      </div>
    </div>
  );
};

export default ProjectDetail;
