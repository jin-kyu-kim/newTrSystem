import React, { useState, useEffect, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import  EmpTRCostTotalJson from "./EmpTRCostTotalJson.json";
import ApiRequest from "../../utils/ApiRequest";
import CustomTable from "components/unit/CustomTable";
import SearchPrjctCostSet from "../../components/composite/SearchPrjctCostSet";
import { Workbook } from "exceljs";
import { exportDataGrid } from "devextreme/excel_exporter";
import { saveAs } from 'file-saver';
import SearchInfoSet from "components/composite/SearchInfoSet";
import { CheckBox, CheckBoxTypes } from 'devextreme-react/check-box';


const EmpTRCostTotal = () => {
  const [values, setValues] = useState([]);
  const [param, setParam] = useState({});
  const { keyColumn, queryId, tableColumns, searchParams, summaryColumn , searchInfo } = EmpTRCostTotalJson;
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const [searchByType, setSearchByType] = useState("");
  const handleProjectCheckboxChange = (type) => {
    setSearchByType(type);
  };



  useEffect(() => {
    if (!Object.values(param).every((value) => value === "")) {
      pageHandle();
    }
  }, [param]);

  // 검색으로 조회할 때
  const searchHandle = async (initParam) => {
    setParam({
      ...initParam,
      queryId: queryId,
      currentPage: currentPage,
      startVal: 0,
      pageSize: pageSize,
    });
    console.log(initParam);
  };








console.log(searchByType)
  const pageHandle = async () => {
    const paramInfo = {
      queryId: queryId
    }
    try {
      const response = await ApiRequest("/boot/common/queryIdSearch", paramInfo);
      setValues(response);
      if (response.length !== 0) {
        setValues(response);
      } else {
       
      }
    } catch (error) {
      console.log(error);
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
      style={{ marginTop: "20px", marginBottom: "10px" }}
    >
      <h1 style={{ fontSize: "40px" }}>근무시간,경비 통합조회</h1>
    </div>
    <div className="col-md-10 mx-auto" style={{ marginBottom: "10px" }}>
      <span>* 근무시간, 경비 통합내역을 조회합니다.</span>
    </div>

    <div>
    <div style={{ marginBottom: "20px" }}>
    <SearchInfoSet 
                    props={searchInfo}
                  callBack={searchHandle}
                /> 
                    
      </div>
      <div>
      <CheckBox
              text="프로젝트로 검색"
              value={searchByType==="project" ? true : false}
              onValueChanged= {()=> handleProjectCheckboxChange( "project") }
            />  
            
       <CheckBox style={{marginLeft :"30px"}}
           
              value={searchByType==="name" ? true : false}
              onValueChanged= {()=> handleProjectCheckboxChange( "name") }
              text="이름으로 검색"
            />   

      </div>
     

      <CustomTable
        keyColumn={keyColumn}
        pageSize={pageSize}
        columns={tableColumns}
        values={values}
        paging={true}
        summary={true}
        summaryColumn={summaryColumn}
        excel={true}
        onExcel={onExporting}
      />  
    
 
        </div>
</div>
  );
};

export default EmpTRCostTotal;
