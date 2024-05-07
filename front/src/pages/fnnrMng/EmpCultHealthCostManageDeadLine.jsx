import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import  EmpCultHealthCostManageJson from "./EmpCultHealthCostManageDeadLineJson.json";
import ApiRequest from "../../utils/ApiRequest";
import { Workbook } from "exceljs";
import { exportDataGrid } from "devextreme/excel_exporter";
import { saveAs } from 'file-saver';
import SearchInfoSet from "components/composite/SearchInfoSet";
import { Button } from "devextreme-react";
import CustomEditTable from "../../components/unit/CustomEditTable";
import { useNavigate } from "react-router-dom";

const EmpCultHealthCostManage = () => {
  const [values, setValues] = useState([]);
  const { keyColumn, queryId, tableColumns, summaryColumn , wordWrap, searchInfo } = EmpCultHealthCostManageJson;
  const navigate = useNavigate();
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
     navigate("/fnnrMng/EmpCultHealthCostManage");
  }

  const handleDeadLine = () => {
    const btnChk = window.confirm("마감을 취소하시겠습니까?")
    if (btnChk) {
      alert("마감이 취소 되었습니다.")
    }
  };

  const padNumber = (num) => {
    return num.toString().padStart(2, '0');
  };

  const currentDateTime = new Date();
        const formattedDateTime = `${currentDateTime.getFullYear()}_`+
            `${padNumber(currentDateTime.getMonth() + 1)}_`+
            `${padNumber(currentDateTime.getDate())}`

  const onExporting = (e) => {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Main sheet');
    exportDataGrid({
      component: e.component,
      worksheet,
      autoFilterEnabled: true,
    }).then(() => {
      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), '문화 체련비 마감목록'+formattedDateTime+'.xlsx');
      });
    });
  };

  return (
    <div className="container">
      <div
        className="title p-1"
        style={{ marginTop: "20px", marginBottom: "10px",  display: "flex"}}
      >
        <h1 style={{ fontSize: "40px" }}>문화체련비 마감 목록</h1>
        <div style={{marginTop: "7px", marginLeft: "20px"}}>
          <Button onClick={handleMove}>관리 목록</Button>
          <Button style = {{marginLeft: "10px", backgroundColor: "#B40404", color: "#fff"}}onClick={handleDeadLine}>마감 취소</Button>
        </div>
      </div>
      <div className="col-md-10 mx-auto" style={{ marginBottom: "10px" }}>
        <span>* 직원의 문화체련비 마감 목록을 조회 합니다.</span>
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
          noEdit={true}
          summary={true}
          summaryColumn={summaryColumn}
        />
    </div>
</div>
  );
};

export default EmpCultHealthCostManage;
