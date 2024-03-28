import React, { useState, useEffect, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import  EmpCultHealthCostManageJson from "./EmpCultHealthCostManageJson.json";
import ApiRequest from "../../utils/ApiRequest";
import CustomTable from "components/unit/CustomTable";
import { Workbook } from "exceljs";
import { exportDataGrid } from "devextreme/excel_exporter";
import { saveAs } from 'file-saver';
import SearchInfoSet from "components/composite/SearchInfoSet";
import { Button } from "devextreme-react";
import { Navigate, useNavigate } from "react-router-dom";

const EmpCultHealthCostManage = () => {
  const [values, setValues] = useState([]);
  const [param, setParam] = useState({});
  const { keyColumn, queryId, tableColumns, prjctColumns , summaryColumn , summaryColumn2, searchInfo } = EmpCultHealthCostManageJson;
  const [checkBox1Checked, setCheckBox1Checked] = useState(false);
  const [checkBox2Checked, setCheckBox2Checked] = useState(false);
  const navigate = useNavigate();
  const handleCheckBox1Change = (e) => {
    setCheckBox1Checked(e.value);
    if (e.value) {
      setCheckBox2Checked(false);
      setValues([])
    }
  };




  useEffect(() => {
    setCheckBox1Checked(true)
    setValues([])
  }, []);

 


  const pageHandle = async (initParam) => {
    console.log(initParam)
    

    const updateParam = {
      ...initParam,
      queryId: queryId,
    }
   
    
    try {
     
      const response = await ApiRequest("/boot/common/queryIdSearch", updateParam);
    
        setValues(response);
     
    } catch (error) {
      console.log(error);
    }
  };




 const handleMove=() => {
   
    navigate("/fnnrMng/EmpCultHealthCostManage");
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
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), '근무시간 경비 통합승인내역'+formattedDateTime+'.xlsx');
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
      <div style={{marginTop: "7px", marginLeft: "20px"}}><Button onClick={handleMove}>마감 목록</Button> <Button onClick={handleDeadLine}>  전체 마감</Button> </div>
    </div>
    <div className="col-md-10 mx-auto" style={{ marginBottom: "10px" }}>
      <span>* 직원의 문화체련비 마감 목록을 조회 합니다.</span>
    </div>

    <div>
    <div style={{ marginBottom: "20px" }}>
    <SearchInfoSet 
                    props={searchInfo}
                  callBack={pageHandle}
                /> 
      </div>
     

     
      <CustomTable
        keyColumn={keyColumn}
        columns={tableColumns}
        values={values}
        paging={true}
        excel={true}
        onExcel={onExporting}
       
      />  

    
     


        </div>
</div>
  );
};

export default EmpCultHealthCostManage;
