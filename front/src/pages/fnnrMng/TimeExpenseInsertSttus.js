import { useState, useEffect } from "react";
import DataGrid, { Column,Export,Lookup,Selection,button } from 'devextreme-react/data-grid';
import TimeExpenseInsertSttusJson from "./TimeExpenseInsertSttusJson.json";
import Button from "devextreme-react/button";
import { useCookies } from "react-cookie";
import ApiRequest from "utils/ApiRequest";
import CustomTable from "components/unit/CustomTable";
import SearchPrjctSet from "../../components/composite/SearchPrjctSet";
import SearchPrjctCostSet from "../../components/composite/SearchPrjctCostSet";
import { useNavigate } from "react-router-dom";
import moment from "moment";


const TimeExpenseInsertSttus = ({}) => {
//====================선언구간====================================================
const [values, setValues] = useState([]);
const [param, setParam] = useState({});
const [totalItems, setTotalItems] = useState(0);
const { keyColumn, queryId, tableColumns, searchParams } = TimeExpenseInsertSttusJson;
const [currentPhase, setCurrentPhase] = useState(''); //차수설정용
const navigate = useNavigate();
const nowDate = moment().format('YYYYMM') //현재 년월
//======================초기차수 설정 ===============================================
useEffect(() => {
    // 현재 날짜를 가져오는 함수
    const getCurrentDate = () => {
      const now = new Date();
      const dayOfMonth = now.getDate();
      return dayOfMonth;
    };
    // 현재 날짜를 가져오기
    const dayOfMonth = getCurrentDate();
    // 15일을 기준으로 차수를 결정
    if (dayOfMonth <= 15) {
      setCurrentPhase('1');
    } else {
      setCurrentPhase('2');
    }
  }, []);
//====================초기검색=====================================================
useEffect(() => {
    if (!Object.values(param).every((value) => value === "")) {
      pageHandle();
    }
  }, [param]);
//=================== 검색으로 조회할 때============================================
const searchHandle = async (initParam) => {
  setParam({
    ...initParam,
    queryId: queryId,
    aplyYm: nowDate,
    aplyOdr : currentPhase,
  });
};

const pageHandle = async () => {
  try {
    const response = await ApiRequest("/boot/common/queryIdSearch", param);
    setValues(response);
    if (response.length !== 0) {
      setTotalItems(response[0].totalItems);
    }
  } catch (error) {
    console.log(error);
  }
};
useEffect(()=> {
    console.log("벨류값입니다.", values)
    console.log("현재입니다.", currentPhase)
},[values])

//===========================테이블내 버튼 이벤트======================================
const onClick = (button,data) => {
    if(button.name === "companyPrice"){
        alert("회사비용이동");
    }
    if(button.name === "print"){
        alert("출력!");
    }
    if(button.name === "geunmu"){
        alert("근무시간페이지이동");
    }
    if(button.name === "timeCancel"){
        alert("시간취소!");
    }
    if(button.name === "prjtPay"){
        alert("프로젝트비용이동");
    }
    if(button.name === "payCancel"){
        alert("비용취소");
    }
    // navigate("/fnnrMng/prjctCtClm/ProjectCostClaimDetail", 
    //          {state: { empId: values.empId }})
  };

  //========================화면그리는 구간 ====================================================
    return(
        <div className="container">
        <div className="col-md-10 mx-auto" style={{ marginTop: "20px", marginBottom: "10px" }}>
              <h1 style={{ fontSize: "30px" }}>근무시간비용 입력 현황</h1>
        </div>
        <div className="col-md-10 mx-auto" style={{ marginBottom: "10px" }}>
          <span>* 근무시간비용 입력 현황을 조회합니다..</span>
        </div>
        <div style={{ marginBottom: "20px" }}>
        {/* <SearchPrjctSet callBack={searchHandle} props={searchParams} /> */}
        <SearchPrjctCostSet callBack={searchHandle} props={searchParams} />
      </div>
        <div style={{ marginBottom: "20px" }}>
        <DataGrid keyExpr="ID" showBorders={true}  >
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
        <div style={{ marginBottom: "20px" }}>
        <CustomTable keyColumn={keyColumn}  columns={tableColumns} values={values} paging={true} onClick={onClick} />
        </div>
        <div style={{ marginBottom: "20px" }}>
        <DataGrid showBorders={true} dataSource={values} >
        <Column caption="사번" alignment="center" dataField="empno" dataType="string" />
        <Column caption="성명" alignment="center" dataField="empFlnm"/>
        <Column caption="직위" alignment="center" dataField="jbpsNm"/>
        <Column caption="소속" alignment="center" dataField="deptNm"/>
        <Column caption="전화번호" alignment="center" dataField="telno"/>
        <Column caption="재직상태" alignment="center" dataField="hdofSttsNm"/>
        <Column caption="근무시간" alignment="center ">
            <Column caption="입력화면" alignment="center"/> 
            <Column caption="입력" alignment="center" dataField="sumMm"/> 
            {
                values.cntCompanion === 0 && values.cntComplete !== undefined
                ? <Column caption="반려" alignment="center" dataField="0"/>     
                : <Column caption="반려" alignment="center" dataField="sumMm"/>
            }
            {
                values.cntComplete === 0 && values.cntComplete !== undefined
                ? <Column caption="승인" alignment="center" value="0"/>     
                : <Column caption="승인" alignment="center" value="sumMm"/>
            }
            <Column caption="취소" alignment="center"/>   
        </Column>
        <Column caption="프로젝트비용" alignment="center">
            <Column caption="입력화면" alignment="center"/>
            <Column caption="입력" alignment="center" dataField="sumAply"/>
            {
                values.cntCompanion === 0 && values.cntComplete !== undefined
                ? <Column caption="반려" alignment="center" dataField="0"/>     
                : <Column caption="반려" alignment="center" dataField="sumAply"/>
            }
            {
                values.cntComplete === 0 && values.cntComplete !== undefined
                ? <Column caption="승인" alignment="center" dataField="0"/>     
                : <Column caption="승인" alignment="center" dataField="sumAply"/>
            }
            {/* <Column caption="승인" alignment="center" dataField="cntComplete"/>  */}
            <Column caption="취소" alignment="center" button/>   
        </Column>
        <Column caption="회사지불비용" alignment="center"/>
        <Column caption="출력" alignment="center"> </Column>
        </DataGrid>
        </div>
      </div>
 );
};

export default TimeExpenseInsertSttus;