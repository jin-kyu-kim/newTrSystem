import { useState, useEffect } from "react";
import React from 'react';
import PivotGrid, { Export, FieldChooser } from 'devextreme-react/pivot-grid';
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';
import  EmpTimeAprvListJson from "./EmpTimeAprvListJson.json";
import ApiRequest from "../../utils/ApiRequest";
import SearchPrjctCostSet from "../../components/composite/SearchPrjctCostSet";
import CustomPivotGrid from "components/unit/CustomPivotGrid";
const styles = `
  .dx-button-content {
    width: 200px;
  
  }
  
`;


const EmpTimeAprvList = () => {
  const [values, setValues] = useState([]);
  const [param, setParam] = useState({});
  const { keyColumn, queryId, tableColumns, searchParams  } = EmpTimeAprvListJson;
  const [ searchIsVal, setSearchIsVal] = useState(false);

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
        caption: '프로젝트명',
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
        caption: '이름',
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
  <style>
  {styles}
</style>
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
      <div className="wrap_search" style={{marginBottom: "20px"}}>
                  <SearchPrjctCostSet callBack={searchHandle} props={searchParams}/>
                  {/* <SearchOdrRange callBack={searchHandle} props={searchParams}/> */}
              </div>
              <CustomPivotGrid
                    weekendColor={true}
                    values={dataSource}
                />
     </div>

     </React.Fragment>

)
}
 
export default EmpTimeAprvList;
