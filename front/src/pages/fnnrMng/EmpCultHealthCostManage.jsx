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
import EmpCultHealthCostDetailPop from "./EmpCultHealthCostDetailPop";
import CustomEditTable from "components/unit/CustomEditTable";

const EmpCultHealthCostManage = () => {
  const [values, setValues] = useState([]);
  const { keyColumn, queryId, tableColumns, wordWrap, searchInfo } = EmpCultHealthCostManageJson;
  const navigate = useNavigate();
  const [isManagePopupVisible, setIsManagePopupVisible] = useState(false);
  const [isDetailPopupVisible, setIsDetailPopupVisible] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState();
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

  const onRowClick = (e) => {
    if (e.rowType === 'group') {
      if (e.data && e.data.key) {
        setSelectedRowData({
          empId: e.data.items[0].empId,
          empFlnm: e.data.key.substring(9).trim()
        });
        setIsManagePopupVisible(true);
      } else {
        console.error('데이터가 존재하지 않습니다.');
      }
    }
  };

  const onBtnClick = (button, rowData) => {
    setSelectedRowData({
      empId: rowData.data.empId,
      empFlnm: rowData.data.empFlnm.substring(9).trim()
    });
    setIsDetailPopupVisible(true);
  }

  const closeManagePopup = () => {
    setIsManagePopupVisible(false);
  };

  const closeDetailPopup = () => {
    setIsDetailPopupVisible(false);
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
          onBtnClick={onBtnClick}
        />

      </div>
    </div>

    <Popup
        width={700}
        height={600}
        visible={isManagePopupVisible}
        onHiding={closeManagePopup}
        showCloseButton={true}
    >
      <EmpCultHealthCostManagePop value={selectedRowData} year={param.clturPhstrnActMngYm.substring(0,4)}/>
    </Popup>
    <Popup
        width={1000}
        height={700}
        visible={isDetailPopupVisible}
        onHiding={closeDetailPopup}
        showCloseButton={true}
    >
      <EmpCultHealthCostDetailPop value={selectedRowData} ym={param.clturPhstrnActMngYm}/>
    </Popup>
  </div>
  );
};

export default EmpCultHealthCostManage;
