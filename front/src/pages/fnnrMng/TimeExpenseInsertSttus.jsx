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
const [totValues, setTotValues] = useState([]);   //상단values
const [dtlValues, setDtlValues] = useState([]); //하단values

const [paramtot, setParamtot] = useState({}); //상단 조회용 param
const [param, setParam] = useState({}); //하단 조회용 param

const [ ctAply, setCtAply ] = useState([]); // 차수 청구내역
const [ ctAtrzCmptnYn, setCtAtrzCmptnYn ] = useState(); // 비용결재완료여부

const { keyColumn, queryId, totTableColumns, tableColumns, searchParams, totQueryId } = TimeExpenseInsertSttusJson;
// const [currentPhase, setCurrentPhase] = useState(''); //차수설정용
const navigate = useNavigate();
const nowDate = moment().format('YYYYMM') //현재 년월
const [ popVisible, setPopVisible ] = useState(false);
const [selectedData, setSelectedData] = useState({});
const [ atrzDmndSttsCnt, setAtrzDmndSttsCnt ] = useState({}); // 상태코드별 데이터 개수

const [checkBoxValue, setCheckBoxValue] = useState({
  "allVtw": true,
  "mm03701": true,
  "mm03701Min": true,
  "mm03702": true,
  "mm03702Min": true,
  "mm037034": true,
  "mm037034Min": true,
  "ct03701": true,
  "ct03701Min": true,
  "ct03702": true,
  "ct03702Min": true,
  "ct037034": true,
  "ct037034Min": true,
});
//======================초기차수 설정 ===============================================

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

  try {
    const responsetot = await ApiRequest("/boot/common/queryIdSearch", paramtot); //상단 total 검색
    const response = await ApiRequest("/boot/common/queryIdSearch", param); //하단 목록 검색

    setTotValues(responsetot);
    setDtlValues(response);
  } catch (error) {
    console.log(error);
  }
};
//==========================팝업 관련 이벤트==========================================

const onPopHiding = async () => { setPopVisible(false); }
const onPopAppear = async () => { setPopVisible(true); }
const onSetBasicInfo = async (data) => {
  setSelectedData(data);
}

const getAtrzDmndSttsCnt = async (data) => {
  const param = {
    queryId: "indvdlClmMapper.retrieveCtAtrzDmndStts",
    empId: data.empId,
    aplyYm: data.aplyYm,
    aplyOdr: data.aplyOdr
  }

  try {
    const response = await ApiRequest("/boot/common/queryIdSearch", param);
    setAtrzDmndSttsCnt(response[0])
  } catch (error) {
    console.error(error);
  }
}

const getCtAply = async (data) => {
  const param = {
    queryId: "projectExpenseMapper.retrievePrjctCtAplyList",
    empId: data.empId, 
    aplyYm: data.aplyYm, 
    aplyOdr: data.aplyOdr, 
    aply: 'aply'
  }
  
  try {
    const response = await ApiRequest("/boot/common/queryIdSearch", param);
    setCtAply(response);
  } catch(error) {
    console.error(error);
  }
}

const getCtAtrzCmptnYn = async(data) => {
  const param = [
    { tbNm: "PRJCT_INDVDL_CT_MM" }, 
    { 
      empId: data.empId, 
      aplyYm: data.empId, 
      aplyOdr: data.aplyOdr 
    }
  ]

  const response = await ApiRequest("/boot/common/commonSelect", param);
  setCtAtrzCmptnYn(data[0]?.ctAtrzCmptnYn);
}

//===========================테이블내 버튼 이벤트======================================
const onBtnClick = async (button, data) => {
    const admin = {
      empId: data.empId,
      jbpsCd: data.jbpsCd,
      deptNmAll: data.deptNmAll,
      aplyYm: data.aplyYm,
      aplyOdr: data.aplyOdr
    }

    if(button.name === "workHrMv"){
        alert("근무시간페이지이동");
        navigate("/indvdlClm/EmpWorkTime",
        {state: { admin: admin }})
    }
    if(button.name === "hrRtrcn"){                                   //취소상태로 변경 -> 반려?
        alert("시간취소!"); 
    }
    if(button.name === "prjctScrnMv"){                                      
        alert("프로젝트비용이동");
        navigate("/indvdlClm/ProjectExpense",
        {state: { admin: admin }})
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
        await onSetBasicInfo(data);
        await getAtrzDmndSttsCnt(data);
        await getCtAply(data);
        await getCtAtrzCmptnYn(data);
        // setPopupVisible(true);
        await onPopAppear(true);
    }
  };
//==============================================================================================

const handleCheckBoxChange = useCallback((e, key) => {

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
    if(!e.value) {
      setCheckBoxValue(checkBoxValue => ({
        ...checkBoxValue,
        "allVtw": e.value,
        [key]: e.value
      }));
    } else {

      setCheckBoxValue(checkBoxValue => ({
        ...checkBoxValue,
        [key]: e.value
      }));
    }
  }
}, []);

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
                  values={totValues}
                  paging={false}
                  handleCheckBoxChange={handleCheckBoxChange}
                  checkBoxValue={checkBoxValue}
                />
            </div>
            <div className="TimeExpenseInsertSttus" style={{ marginBottom: "20px" }}>
                <CustomTable
                    keyColumn={keyColumn}
                    columns={tableColumns}
                    values={dtlValues}
                    paging={true}
                    onClick={onBtnClick}
                    wordWrap={true}
                />
                <ProjectExpensePopup
                    visible={popVisible}
                    onPopHiding={onPopHiding}
                    aprvInfo={atrzDmndSttsCnt}
                    noDataCase={{cnt: ctAply.length, yn: ctAtrzCmptnYn}}
                    basicInfo={selectedData}
                />
            </div>
        </div>
 );
};

export default TimeExpenseInsertSttus;