import { useState, useEffect } from "react";
import React from 'react';
import {useLocation} from "react-router-dom";
import PivotGrid, { Export, FieldChooser } from 'devextreme-react/pivot-grid';
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';
import  EmpTimeAprvListJson from "./EmpTimeAprvListJson.json";
import ApiRequest from "../../utils/ApiRequest";
import CustomPivotGrid from "components/unit/CustomPivotGrid";
import SearchInfoSet from "components/composite/SearchInfoSet";

const EmpTimeAprvList = () => {
  const [values, setValues] = useState([]);
  const [param, setParam] = useState({});
  const location = useLocation();
  const { keyColumn, queryId, tableColumns, searchParams ,searchInfo } = EmpTimeAprvListJson;
  const [ searchIsVal, setSearchIsVal] = useState(false);
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getDate() > 15 ? date.getMonth() + 1 : date.getMonth();
  const monthVal = month < 10 ? "0" + month : month;
  const admin = location.state ? location.state.admin : undefined;
  const aplyYm = admin != undefined ? admin.aplyYm : year + monthVal;
  const aplyOdr = admin != undefined ? admin.aplyOdr : date.getDate() > 15 ? "1" : "2";
  useEffect(() => {

  }, []); 
         

  useEffect(() => {
    if (searchIsVal) { // 검색 버튼을 클릭했을 때만 pageHandle 함수 호출
      pageHandle();
      setSearchIsVal(false); // 상태를 다시 false로 변경하여 다음 검색을 위해 준비
    }
  }, [searchIsVal]); // searchIsVal 상태가 변경될 때마다 실행

  // 검색으로 조회할 때
  const searchHandle = async (initParam) => {
    setParam({
      ...initParam,
      yearItem : initParam?.year,
      monthItem : initParam?.month,
      aplyOdr: initParam?.aplyOdr,
      queryId: queryId,
    });
    setSearchIsVal(true);
  };

  const pageHandle = async () => {
    try {
      const response = await ApiRequest("/boot/common/queryIdSearch", param);
      setValues(response);
      if (response.length !== 0) {
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };
  const dataSource = new PivotGridDataSource({
    
    fields: [
      {
        caption: '직원명',
        width: 120,
        dataField: 'empFlnm',
        area: 'row',
      },
    
      
      {
         caption: '날짜',
        dataField: 'aplyYmd',
        area: 'column',
      },   
       
      {
        groupName: 'date',
        groupInterval: 'month',
    },
    {
      groupName: 'date',
      groupInterval: 'day',
      expanded: true,
  },
   
      {
        caption: '프로젝트명',
       dataField: 'prjctNm',
       area: 'row',
     },
      {
        caption: 'Sales',
        dataField: 'md',
        format: {
          type: "fixedPoint", // 소수점으로 형식화
          precision: 1 // 소수점 이하 자리수
        },
        summaryType: 'sum',
        area: 'data',
      },
    ],
    store: values,
  
  })



return(
  <React.Fragment>

  <div className="container">
      <div
        className="title p-1"
        style={{ marginTop: "20px", marginBottom: "10px" }}
      >
        <h1 style={{ fontSize: "40px" }}>근무시간 승인내역 조회</h1>
      </div>
      <div className="col-md-10 mx-auto" style={{ marginBottom: "10px" }}>
        <span>* 근무시간 승인내역을 조회합니다.</span>
       
      </div>
      {/* <SearchPrjctCostSet callBack={searchHandle} props={searchParams} /> */}
      <div className="wrap_search" style={{marginBottom: "20px", width: 700}}>
                  <SearchInfoSet  callBack={searchHandle} props={searchInfo}/>
                  {/* <SearchOdrRange callBack={searchHandle} props={searchParams}/> */}
              </div>
              <CustomPivotGrid
                    weekendColor={true}
                    isExport={true}
                    sorting={true}
                    grandTotals={false}
                    values={dataSource}
                />
     </div>

     </React.Fragment>

)
}
 
export default EmpTimeAprvList;
