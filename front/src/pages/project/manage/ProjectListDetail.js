import { useCallback, useState, useEffect } from "react";
import { TabPanel } from 'devextreme-react';
import { useNavigate, useLocation } from 'react-router-dom';

import ProjectListDetailBaseInfo from "./ProjectListDetailBaseInfo.js"; //기본정보 탭 정보
import ProjectListDetailExcnPrmpcBill from "./ProjectListDetailExcnPrmpcBill.js";

import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';
import Button from 'devextreme-react/button'; 

const ProjectListDetail = () => {
  const location = useLocation();
  const projIdInfo = location.state.id;
  const navigate = useNavigate ();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const TabName = [
    {
      TabName: '기본정보', projId: projIdInfo,
    },
    {
      TabName: '실행원가계산서',
    },
    {
      TabName: '실행원가집행현황',
    },
    {
      TabName: '결재정보',
    },
    {
      TabName: '설정',
    },
  ];

  const itemTitleRender = (a) => <span>{a.TabName}</span>;

  // 탭 변경시 인덱스 설정
  const onSelectionChanged = useCallback(     //selectedIndex값이 변경될때마다 해당 함수를 새로 생성하지 않고 재사용 하기 위해 useCallback 사용
    (args) => {
      if (args.name === 'selectedIndex') {
        setSelectedIndex(args.value); //Index 번호
      }
    },
    [setSelectedIndex],
  );

  //탭마다 다른 js 랜더링
  //TODO. 각각의 JS 생성 필요.
  const getTabItemComponent = (index) => {
    switch (index) {
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
        <div style={{ marginRight: "20px", marginLeft: "20px"}}>
          <h1 style={{ fontSize: "30px" }}>프로젝트 관리</h1>
          <div>{location.state.prjctNm}</div>
        </div>
      </div>
      <div className="buttons" align="right" style={{ margin: "20px"}}>
        <Button
          width={80}
          text="Contained"
          type="default"
          stylingMode="contained"
          style={{ margin : '2px' }} // 원하는 스타일 직접 지정
        >
          변경원가
        </Button>
        <Button
          width={110}
          text="Contained"
          type="default"
          stylingMode="contained"
          style={{ margin : '2px' }} // 원하는 스타일 직접 지정
        >
          프로젝트종료
        </Button>
        <Button
          width={50}
          text="Contained"
          type="normal"
          stylingMode="outlined"
          onClick={handleClick}
          style={{ margin : '2px' }} // 원하는 스타일 직접 지정
        >
          목록
        </Button>
      </div>
      <div style={{ marginTop: "20px", marginBottom: "10px" }}>
      <TabPanel
          height={50}
          dataSource={TabName}
          selectedIndex={selectedIndex} 
          onOptionChanged={onSelectionChanged}
          itemTitleRender={itemTitleRender}
          animationEnabled={true}
          itemComponent={({ data, index }) => {
            const TabItemComponent = getTabItemComponent(index, data);
            return <TabItemComponent data={data}/>;
          }}
        />
      </div>
    </div>
  );
};

export default ProjectListDetail;
