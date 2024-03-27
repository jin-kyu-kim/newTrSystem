import { useState, useEffect } from "react";
import PivotGrid, { Export, FieldChooser } from 'devextreme-react/pivot-grid';
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';
import  EmpTimeAprvListJson from "./EmpTimeAprvListJson.json";
import ApiRequest from "../../utils/ApiRequest";
import SearchPrjctCostSet from "../../components/composite/SearchPrjctCostSet";
import CustomPivotGrid from "components/unit/CustomPivotGrid";
<style>
        {`
         .dx-pivotgrid-total-cell {
          white-space: nowrap; 
        }
        `}
      </style>
       
const EmpTimeAprvList = () => {
  const [values, setValues] = useState([]);
  const [param, setParam] = useState({});
  const { keyColumn, queryId, tableColumns, searchParams  } = EmpTimeAprvListJson;
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(20);


  useEffect(() => {
    if (!Object.values(param).every((value) => value === "")) {
      pageHandle();
    }
  }, [param]);

  // 검색으로 조회할 때
  const searchHandle = async (initParam) => {
    setTotalPages(1);
    setCurrentPage(1);
    setParam({
      ...initParam,
      queryId: queryId,
      currentPage: currentPage,
      startVal: 0,
      pageSize: pageSize,
    });
  };

  const pageHandle = async () => {
    try {
      const response = await ApiRequest("/boot/common/queryIdSearch", param);
      setValues(response);
      if (response.length !== 0) {
        setTotalPages(Math.ceil(response[0].totalItems / pageSize));
        setTotalItems(response[0].totalItems);
      } else {
        setTotalPages(1);
        setTotalItems(0);
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
        dataType: 'date',
        area: 'column',
        groupInterval: 'day'
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
                    values={dataSource}
                />
     </div>



)
}
 
export default EmpTimeAprvList;
