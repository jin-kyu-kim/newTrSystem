import { useState, useEffect } from "react";
import DataGrid, { Column,Export,Lookup,Selection,button } from 'devextreme-react/data-grid';
import TimeExpenseInsertSttusJson from "./TimeExpenseInsertSttusJson.json";
import Button from "devextreme-react/button";
import { useCookies } from "react-cookie";
import CustomLabelValue from "components/unit/CustomLabelValue";
import ApiRequest from "utils/ApiRequest";
import CustomTable from "components/unit/CustomTable";
import SearchPrjctSet from "../../components/composite/SearchPrjctSet";
import { useNavigate } from "react-router-dom";


const TimeExpenseInsertSttus = ({}) => {
//====================선언구간====================================================
const [values, setValues] = useState([]);
const [param, setParam] = useState({});
const [totalItems, setTotalItems] = useState(0);
const [currentPage, setCurrentPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const [pageSize, setPageSize] = useState(20);
const { keyColumn, queryId, tableColumns, searchParams } = TimeExpenseInsertSttusJson;
const navigate = useNavigate();
//====================초기검색=====================================================
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
    }
  } catch (error) {
    console.log(error);
  }
};
useEffect(()=> {
    console.log("벨류값입니다.", values)
},[values])
//=======================화면 이동버튼
const onClick = (e) => {
    console.log("여기 뭐가지고 오나요?",e)
    navigate("/fnnrMng/prjctCtClm/ProjectCostClaimDetail", 
             {state: { empId: values.empId }})
  };

    return(
        <div className="container">
        <div className="col-md-10 mx-auto" style={{ marginTop: "20px", marginBottom: "10px" }}>
              <h1 style={{ fontSize: "30px" }}>근무시간비용 입력 현황</h1>
        </div>
        <div className="col-md-10 mx-auto" style={{ marginBottom: "10px" }}>
          <span>* 근무시간비용 입력 현황을 조회합니다..</span>
        </div>
        <div style={{ marginBottom: "20px" }}>
        <SearchPrjctSet callBack={searchHandle} props={searchParams} />
      </div>
        <div style={{ marginBottom: "20px" }}>
        <DataGrid keyExpr="ID" showBorders={true}  >
        <Selection mode="multiple"/>
        <Column caption="전체" alignment="center"/>
        <Column caption="근무시간" alignment="center">
            <Column caption="입력여부" alignment="center"> 
                <Column caption="입력" alignment="center"/>
                <Column caption="미입력" alignment="center"/>
            </Column>
            <Column caption="승인요청여부" alignment="center"> 
                <Column caption="요청" alignment="center"/>
                <Column caption="미요청" alignment="center"/>
            </Column>
            <Column caption="승인여부" alignment="center"> 
                <Column caption="승인및반려" alignment="center"/>
                <Column caption="미승인" alignment="center"/>
            </Column>
        </Column>
        <Column caption="프로젝트비용" alignment="center">
            <Column caption="입력여부" alignment="center"> 
                <Column caption="입력" alignment="center"/>
                <Column caption="미입력" alignment="center"/>
            </Column>
            <Column caption="승인요청여부" alignment="center"> 
                <Column caption="요청" alignment="center"/>
                <Column caption="미요청" alignment="center"/>
            </Column>
            <Column caption="승인여부" alignment="center"> 
                <Column caption="승인및반려" alignment="center"/>
                <Column caption="미승인" alignment="center"/>
            </Column>
        </Column>
        </DataGrid>
        </div>
        {/* <div style={{ marginBottom: "20px" }}>
        <CustomTable
        keyColumn={keyColumn}
        pageSize={pageSize}
        columns={tableColumns}
        values={values}
        paging={true}
        onClick={onClick}
        />
        </div> */}
        <div style={{ marginBottom: "20px" }}>
        <DataGrid showBorders={true} dataSource={values} >
        <Column caption="사번" alignment="center" dataField="empno" dataType="string" />
        <Column caption="성명" alignment="center" dataField="empFlnm"/>
        <Column caption="직위" alignment="center" dataField="jbpsNm"/>
        <Column caption="소속" alignment="center" dataField="deptNm"/>
        <Column caption="전화번호" alignment="center" dataField="telno"/>
        <Column caption="재직상태" alignment="center" dataField="hdofSttsNm"/>
        <Column caption="근무시간" alignment="center ">
            <Column caption="입력화면" alignment="center" button={onClick}/> 
            <Column caption="입력" alignment="center"/> 
            <Column caption="반려" alignment="center"/> 
            <Column caption="승인" alignment="center"/> 
        </Column>
        <Column caption="프로젝트비용" alignment="center">
            <Column caption="입력화면" alignment="center"/>
            <Column caption="입력" alignment="center"/> 
            <Column caption="반려" alignment="center"/> 
            <Column caption="승인" alignment="center"/>  
        </Column>
        <Column caption="회사지불비용" alignment="center"/>
        <Column caption="출력" alignment="center"> </Column>
        </DataGrid>
        </div>
      </div>
 );
};

export default TimeExpenseInsertSttus;