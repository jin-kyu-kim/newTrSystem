import { useState, useEffect, useRef,useCallback} from "react";
import DataGrid, { Column,Export,Lookup,Selection,button } from 'devextreme-react/data-grid';
import TimeExpenseInsertSttusJson from "./TimeExpenseInsertSttusJson.json";
import Button from "devextreme-react/button";
import ApiRequest from "utils/ApiRequest";
import CustomTable from "components/unit/CustomTable";
import moment from "moment";

const TimeExpenseInsertList = ({}) => {
//====================선언구간====================================================
const [values, setValues] = useState([]);
const [param, setParam] = useState({});
const { keyColumn, queryId, tableColumns, searchParams,totQueryId } = TimeExpenseInsertSttusJson;
const [currentPhase, setCurrentPhase] = useState(''); //차수설정용
const nowDate = moment().format('YYYYMM') //현재 년월
const printRef = useRef(null);
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
  if(initParam.yearItem == null || initParam.monthItem == null) {
    setParam({
        ...param,
        queryId: queryId,
        aplyYm: nowDate,
        aplyOdr: currentPhase,
        empId: initParam.empId,
    })  
    return;
};
    setParam({
        ...param,
        queryId: queryId,
        aplyYm: initParam.yearItem + initParam.monthItem,
        aplyOdr: initParam.aplyOdr,
        empId: initParam.empId,
    })
};

const pageHandle = async () => {
  try {
    const response = await ApiRequest("/boot/common/queryIdSearch", param); //하단 목록 검색
    setValues(response);
  } catch (error) {
    console.log(error);
  }
};

//===========================테이블내 버튼 이벤트======================================
const print = useCallback(() => {
  printRef.current.instance.print();
}, []);


  const printf = () => {

    return(
    <div className="container" ref ={printRef}>
        <div className="col-md-10 mx-auto" style={{ marginTop: "20px", marginBottom: "10px" }}>
              <h1 style={{ fontSize: "30px" }}>근무시간비용 Report</h1>
        </div>
        <div style={{ marginBottom: "20px" }}>
        <Button icon="print" text="출력" onClick={print}/>
      </div>
        <div style={{ marginBottom: "20px" }}>
        <span>* 기본정보</span>
        <DataGrid showBorders={true} >
        <Column caption="전체" alignment="center" />
        </DataGrid>
        </div>
        <div style={{ marginBottom: "20px" }}>
        <span>* 총계</span>
        <DataGrid>          
        </DataGrid>
        </div>
        <div style={{ marginBottom: "20px" }}>
        <span>* 근무시간</span>
        <DataGrid>          
        </DataGrid>
        </div>
        <div style={{ marginBottom: "20px" }}>
        <span>* 현금 및 개인법인카드 사용비용</span>
        <DataGrid>          
        </DataGrid>
        </div>
      </div>
    )
  }

//========================화면그리는 구간 ====================================================
    return(
      <div>
        {printf()}
      </div>
      
 );
};

export default TimeExpenseInsertList;
