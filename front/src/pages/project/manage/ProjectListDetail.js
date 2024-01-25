import { useCallback, useState, Suspense } from "react";
import { TabPanel } from 'devextreme-react';
import { useNavigate } from 'react-router-dom';

import ProjectListDetailBaseInfo from "./ProjectListDetailBaseInfo.js"; //기본정보 탭 정보
import ProjectListDetailExcnPrmpcBill from "./ProjectListDetailExcnPrmpcBill.js";

import 'devextreme/dist/css/dx.light.css';
import Button from 'devextreme-react/button';

const TabName = [
  {
    ID: 1,
    TabName: '기본정보',
  },
  {
    ID: 2,
    TabName: "실행원가계산서",
  },
  {
    ID: 3,
    TabName: '실행원가집행현황',
  },
  {
    ID: 4,
    TabName: '결재정보',
  },
  {
    ID: 5,
    TabName: '설정',
  },
];

const itemTitleRender = (company) => <span>{company.TabName}</span>;

const ProjectListDetail = () => {
  const navigate = useNavigate ();
  const [selectedIndex, setSelectedIndex] = useState(0);

  // 탭 변경시 인덱스 설정
  const onSelectionChanged = useCallback(    
    (args) => {
      if (args.name === 'selectedIndex') {
        setSelectedIndex(args.value); //Index 번호
      }
    },
    [setSelectedIndex],
  );

  //탭마다 다른 js 랜더링
  //TODO. 각각의 JS 생성 필요.
  const getTabItemComponent = (type) => {
    switch (type) {
      case 0:
        return ProjectListDetailBaseInfo;
      case 1:
        return ProjectListDetailExcnPrmpcBill;
      case 2:
        return ProjectListDetailExcnPrmpcBill;
      case 3:
        return ProjectListDetailExcnPrmpcBill;
      case 4:
        return ProjectListDetailExcnPrmpcBill;
      default:
        return ProjectListDetailExcnPrmpcBill;
    }
  };
  
  const handleClick = () => {
    // 이전 페이지로 이동
    navigate(-1);
  };


  return (
    <div>
      <div
        className="title p-1"
        style={{ marginTop: "20px", marginBottom: "10px" }}
      >
        <h1 style={{ fontSize: "30px" }}>프로젝트 관리</h1>
        <div>어떤 프로젝트 관리 11111</div>
      </div>
      <div align="right">
        <Button
          width={120}
          text="Contained"
          type="default"
          // stylingMode="contained"
        >
          변경원가
        </Button>
        <Button
          width={120}
          text="Contained"
          type="default"
          // stylingMode="contained"
        >
          프로젝트종료
        </Button>
        <Button
          width={120}
          text="Contained"
          type="normal"
          // stylingMode="contained"
          onClick={handleClick}
        >
          목록
        </Button>
      </div>
      <div>
      <TabPanel
          height={50}
          dataSource={TabName}
          selectedIndex={selectedIndex} 
          onOptionChanged={onSelectionChanged}
          itemTitleRender={itemTitleRender}
          animationEnabled={true}
          itemComponent={({ data, index }) => {
            const TabItemComponent = getTabItemComponent(index);
            return <TabItemComponent/>;
          }}
        />
      </div>
    </div>
  );
};

export default ProjectListDetail;
