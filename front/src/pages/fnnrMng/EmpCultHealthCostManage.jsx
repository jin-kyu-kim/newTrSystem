import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import  EmpCultHealthCostManageJson from "./EmpCultHealthCostManageJson.json";
import ApiRequest from "../../utils/ApiRequest";
import { Workbook } from "exceljs";
import { exportDataGrid } from "devextreme/excel_exporter";
import { saveAs } from 'file-saver';
import SearchInfoSet from "components/composite/SearchInfoSet";
import { Button } from "devextreme-react";
import { useNavigate } from "react-router-dom";
import { Popup } from "devextreme-react";
import EmpCultHealthCostManagePop from "./EmpCultHealthCostManagePop";
import CustomEditTable from "components/unit/CustomEditTable";

const EmpCultHealthCostManage = () => {
  const [values, setValues] = useState([]);
  const { keyColumn, queryId, tableColumns, wordWrap, searchInfo } = EmpCultHealthCostManageJson;
  const navigate = useNavigate();
  const [isGroupPopupVisible, setIsGroupPopupVisible] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedRowData, setSelectedRowData] = useState(null);
  let now = new Date();
  const [param, setParam] = useState({
        "empFlnm": null,
        "empno": null,
        "clturPhstrnActMngYm": now.getFullYear()+('0' + (now.getMonth() + 1)).slice(-2),
        "queryId": queryId
  });

  useEffect(() => {
    if (!Object.values(param).every((value) => value === "")) {
      pageHandle();
    }
  }, [param]);

  const searchHandle = async (initParam) => {
    if(initParam.year){
      setParam({
        ...param,
        empFlnm: initParam.empFlnm !== undefined? initParam.empFlnm : null,
        empno: initParam.empno!== undefined? initParam.empno : null,
        clturPhstrnActMngYm: initParam.year + initParam.month,
      });
    }
  };

  const pageHandle = async () => {
    try {
      const response = await ApiRequest("/boot/common/queryIdSearch", param);
      setValues(response);
    } catch (error) {
      console.error(error);
    }
  };

  const handleMove = () => {
    navigate("/fnnrMng/EmpCultHealthCostManageDeadLine");
  }

  const handleDeadLine = () => {
    const btnChk = window.confirm("문화체련비를 마감하시겠습니까?")
    if (btnChk) {
      alert("마감되었습니다.")
      const currentDate = new Date(); // 현재 날짜와 시간을 나타내는 Date 객체 생성
      const year = currentDate.getFullYear(); // 연도를 가져옴
      const month = currentDate.getMonth() ; // 월을 가져오는데, 0부터 시작하므로 +1을 해줌
      const formattedDate = `${year}${month < 10 ? '0' : ''}${month}`; // 월이 한 자리 수인 경우 앞에 0을 붙여줌

    console.log(formattedDate); // YYYYMM 형식의 현재 날짜 출력
    }
  };

  const padNumber = (num) => {
    return num.toString().padStart(2, '0');
};

  const formattedDateTime = `${now.getFullYear()}_`+
      `${padNumber(now.getMonth() + 1)}_`+
      `${padNumber(now.getDate())}`

  const onExporting = (e) => {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Main sheet');
    exportDataGrid({
      component: e.component,
      worksheet,
      autoFilterEnabled: true,
    }).then(() => {
      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), '문화체련비 관리 목록'+formattedDateTime+'.xlsx');
      });
    });
  };

  const onRowClick = (e) => {   //직원목록 로우 클릭 이벤트
    if (e.rowType === 'group') {
      if (e.data && e.data.key) {
        const subStringResult = e.data.key.substring(1, 7);
        setSelectedRowData(subStringResult);
        setIsGroupPopupVisible(true); // 팝업 열기
      } else {
        console.log('e.data 또는 e.data.key가 null입니다.');
      }
    }
   
  };

  const closeGroupPopup = () => {
    setSelectedGroup(null); // 선택한 그룹 정보 초기화
    setIsGroupPopupVisible(false);
  };

  return (
  <div>
    <style>
      {`
        .dx-datagrid-group-opened {
          display: none !important;
        }
      `}
    </style>

    <div className="container">
      <div
        className="title p-1"
        style={{ marginTop: "20px", marginBottom: "10px",  display: "flex"}}
      >
        <h6 style={{ fontSize: "40px" }}>문화체련비 관리 목록</h6>
        <div style={{marginTop: "7px", marginLeft: "20px"}}>
          <Button onClick={handleMove}>마감 목록</Button>
          <Button onClick={handleDeadLine} style = {{marginLeft: "10px",backgroundColor: "#B40404", color: "#fff"}}>전체 마감</Button>
        </div>
      </div>
      <div className="col-md-10 mx-auto" style={{ marginBottom: "10px" }}>
        <span>* 직원의 문화체련비를 조회 합니다.</span>
      </div>

      <div>
        <div style={{ marginBottom: "20px" }}>
          <SearchInfoSet props={searchInfo} callBack={searchHandle}/>
        </div>

        <CustomEditTable
          keyColumn={keyColumn}
          columns={tableColumns}
          values={values}
          paging={true}
          excel={true}
          onExcel={onExporting}
          wordWrap={wordWrap}
          onRowClick={onRowClick}
          noEdit={true}

        />

      </div>
    </div>

    <Popup
      visible={isGroupPopupVisible}
      onHiding={closeGroupPopup}
      width={700}
      height={600}
    >
      <Button text="닫기" onClick={closeGroupPopup} />
      {isGroupPopupVisible && (
        <EmpCultHealthCostManagePop popEmpId={selectedRowData} closePopup={closeGroupPopup} />
      )}
    </Popup>
  </div>
  );
};

export default EmpCultHealthCostManage;
