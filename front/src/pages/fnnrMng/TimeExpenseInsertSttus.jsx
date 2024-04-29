import { useState, useEffect, useCallback } from "react";
import DataGrid, { Column,Export,Lookup,Selection,button } from 'devextreme-react/data-grid';
import TimeExpenseInsertSttusJson from "./TimeExpenseInsertSttusJson.json";
import Button from "devextreme-react/button";
import { useCookies } from "react-cookie";
import ApiRequest from "utils/ApiRequest";
import CustomTable from "components/unit/CustomTable";
import SearchPrjctCostSet from "../../components/composite/SearchPrjctCostSet";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { Popup } from "devextreme-react";
import TimeExpenseInsertList from "./TimeExpenseInsertList";
import "./FnnrMngStyle.css";

import ProjectExpensePopup from "../indvdlClm/ProjectExpensePopup";


const TimeExpenseInsertSttus = ({}) => {
//====================선언구간====================================================
const [values, setValues] = useState([]);   //상단values
const [values2, setValues2] = useState([]); //하단values
const [paramtot, setParamtot] = useState({}); //상단 조회용 param
const [param, setParam] = useState({}); //하단 조회용 param
const { keyColumn, queryId, totTableColumns, tableColumns, searchParams, totQueryId } = TimeExpenseInsertSttusJson;
// const [currentPhase, setCurrentPhase] = useState(''); //차수설정용
const navigate = useNavigate();
const nowDate = moment().format('YYYYMM') //현재 년월
const [popupVisible, setPopupVisible] = useState(false); // 지울것
const [ popVisible, setPopVisible ] = useState(false);
const [selectedData, setSelectedData] = useState({});
const [ test, setTest ] = useState("");

/*
const [checkBoxValue, setCheckBoxValue] = useState({
  "mm03701": "true",
  "mm03701Min": "true",
  "mm03702": "true",
  "mm03702Min": "true",
  "mm037034": "true",
  "mm037034Min": "true",
  "ct03701": "true",
  "ct03701Min": "true",
  "ct03702": "true",
  "ct03702Min": "true",
  "ct037034": "true",
  "ct037034Min": "true",
});
*/
const [checkBoxValue, setCheckBoxValue] = useState({
  "allVtw": false,
  "mm03701": false,
  "mm03701Min": false,
  "mm03702": false,
  "mm03702Min": false,
  "mm037034": false,
  "mm037034Min": false,
  "ct03701": false,
  "ct03701Min": false,
  "ct03702": false,
  "ct03702Min": false,
  "ct037034": false,
  "ct037034Min": false,
});
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
    // if (dayOfMonth <= 15) {
    //   setCurrentPhase('2');
    // } else {
    //   setCurrentPhase('1');
    // }
  }, []);

  const now = new Date();
  const dayOfMonth = now.getDate();
  const currentPhase = dayOfMonth <= 15 ? '2' : '1';

//====================초기검색=====================================================
useEffect(() => {
    if (!Object.values(param).every((value) => value === "")) {
      pageHandle();
    }
  }, [param]);
//=================== 검색으로 조회할 때============================================
const searchHandle = async (initParam) => {
  
  console.log(initParam);
  
  if(initParam.yearItem == null || initParam.monthItem == null) {

    setParamtot({
        ...paramtot,
        queryId: totQueryId,
        aplyYm: nowDate,
        aplyOdr: currentPhase,
        empId: initParam.empId,
        hdofSttsCd: "VTW00301"
    })
    setParam({
        ...param,
        queryId: queryId,
        aplyYm: nowDate,
        aplyOdr: currentPhase,
        empId: initParam.empId,
        hdofSttsCd: "VTW00301"
    })  
    return;
  }
    setParamtot({
        ...paramtot,
        queryId: totQueryId,
        aplyYm: initParam.yearItem + initParam.monthItem,
        aplyOdr: initParam.aplyOdr,
        empId: initParam.empId,
        hdofSttsCd: initParam.hdofSttsCd,

    })

    setParam({
        ...param,
        queryId: queryId,
        aplyYm: initParam.yearItem + initParam.monthItem,
        aplyOdr: initParam.aplyOdr,
        empId: initParam.empId,
        hdofSttsCd: initParam.hdofSttsCd,
        ...checkBoxValue
    })
};

const pageHandle = async () => {
  console.log(paramtot)
  console.log(param);

  try {
    const responsetot = await ApiRequest("/boot/common/queryIdSearch", paramtot); //상단 total 검색
    const response = await ApiRequest("/boot/common/queryIdSearch", param); //하단 목록 검색

    setValues(responsetot);
    setValues2(response);
  } catch (error) {
    console.log(error);
  }
};
//==========================팝업 관련 이벤트==========================================
const handleClose = () => {
  setPopupVisible(false);
};
const onPopHiding = async () => { setPopVisible(false); }
//===========================테이블내 버튼 이벤트======================================
const onBtnClick = async (button, data) => {      

    if(button.name === "workHrMv"){
        alert("근무시간페이지이동");
        navigate("/indvdlClm/EmpWorkTime",
        {state: { empId: data.empId, jbpsCd: data.jbpsCd, deptNmAll: data.deptNmAll}})
    }
    if(button.name === "hrRtrcn"){                                   //취소상태로 변경 -> 반려?
        alert("시간취소!"); 
    }
    if(button.name === "prjctScrnMv"){                                      
        alert("프로젝트비용이동");
        navigate("/indvdlClm/ProjectExpense",
        {state: { empId: data.empId }})
    }
    if(button.name === "ctRtrcn"){                                    //취소상태로 변경 -> 반려?
        alert("비용취소");
    }
     if(button.name === "companyPrice"){                                 //경로 수정 예정
        alert("회사비용이동");
        navigate("/fnnrMng/prjctCtClm/ProjectCostClaimDetail",
        {state: { empId: data.empId }})
    }
    if(button.name === "print"){      
        console.log(data);
        setSelectedData(data);
        // setPopupVisible(true);
        setPopVisible(true);
    }
  };
//==============================================================================================
// const handleCheckBoxChange = (e, key, data) => {
//   console.log(key);
//   console.log(e)

//   console.log(data)
//   handleCondition(key);
//   // setParamtot({
//   //   ...paramtot,
//   //   mm037034Min: key
//   // })
// };

const handleCheckBoxChange = useCallback((e, key) => {
  console.log(key, e.value)

  if(key === "allVtw") {
    setCheckBoxValue(checkBoxValue => ({
      ...checkBoxValue,
      "allVtw": e.value,
      "mm03701": e.value,
      "mm03701Min": e.value,
      "mm03702": e.value,
      "mm03702Min": e.value,
      "mm037034": e.value,
      "mm037034Min": e.value,
      "ct03701": e.value,
      "ct03701Min": e.value,
      "ct03702": e.value,
      "ct03702Min": e.value,
      "ct037034": e.value,
      "ct037034Min": e.value,
    }))
  } else {
    setCheckBoxValue(checkBoxValue => ({
      ...checkBoxValue,
      [key]: e.value
    }));
  }

}, []);

const handleCondition = async (data) => {
  // setTest("a");
}

//=============================마감 및 엑셀다운로드 이벤트======================================
    const ddlnExcelDwn = () => {
        alert("마감 및 엑셀 다운로드"); //기능 개발 예정
    };
//========================화면그리는 구간 ====================================================
    return(
        <div className="container">
            <div className="col-md-10 mx-auto" style={{ marginTop: "20px", marginBottom: "10px" }}>
                  <h1 style={{ fontSize: "30px" }}>근무시간비용 입력 현황</h1>
            </div>
            <div className="col-md-10 mx-auto" style={{ marginBottom: "10px" }}>
              <span>* 근무시간비용 입력 현황을 조회합니다.</span>
            </div>
            <div style={{ marginBottom: "20px" }}>
                <SearchPrjctCostSet callBack={searchHandle} props={searchParams} />
                <Button text="마감 및 엑셀다운"  onClick={ddlnExcelDwn}/>
            </div>
            <div className="TimeExpenseInsertSttus" style={{ marginBottom: "20px" }}>
                <CustomTable
                  keyColumn={keyColumn}
                  columns={totTableColumns}
                  values={values}
                  paging={false}
                  handleCheckBoxChange={handleCheckBoxChange}
                  checkBoxValue={checkBoxValue}
                />
            </div>
            <div className="TimeExpenseInsertSttus" style={{ marginBottom: "20px" }}>
                <CustomTable
                    keyColumn={keyColumn}
                    columns={tableColumns}
                    values={values2}
                    paging={true}
                    onClick={onBtnClick}
                    wordWrap={true}
                />
                <Popup
                      width="95%"
                      height="95%"
                      visible={popupVisible}
                      onHiding={handleClose}
                      showCloseButton={true}
                  >
                   <TimeExpenseInsertList data={selectedData}/>
                </Popup>
                {/* <ProjectExpensePopup
                    visible={popupVisible}
                    onPopHiding={onPopHiding}
                    basicInfo={selectedData}
                /> */}
            </div>
        </div>
 );
};

export default TimeExpenseInsertSttus;