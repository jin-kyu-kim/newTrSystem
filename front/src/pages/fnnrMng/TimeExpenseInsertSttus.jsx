import { useState, useEffect, useCallback } from "react";
import TimeExpenseInsertSttusJson from "./TimeExpenseInsertSttusJson.json";
import Button from "devextreme-react/button";
import ApiRequest from "utils/ApiRequest";
import CustomTable from "components/unit/CustomTable";
import SearchPrjctCostSet from "../../components/composite/SearchPrjctCostSet";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import "./FnnrMngStyle.css";

import ProjectExpensePopup from "../indvdlClm/ProjectExpensePopup";
import { useModal } from "../../components/unit/ModalContext";
import TimeExpenseCancelPopup from "./TimeExpenseCancelPopup"

const TimeExpenseInsertSttus = ({}) => {
//====================선언구간====================================================

const [totValues, setTotValues] = useState([]);   //상단values
const [dtlValues, setDtlValues] = useState([]); //하단values

const [totParam, setTotParam] = useState({}); //상단 조회용 param
const [dtlParam, setDtlParam] = useState({}); //하단 조회용 param

const [ ctAply, setCtAply ] = useState([]); // 차수 청구내역
const [ ctAtrzCmptnYn, setCtAtrzCmptnYn ] = useState(); // 비용결재완료여부

const { keyColumn, queryId, totTableColumns, tableColumns, searchParams, totQueryId } = TimeExpenseInsertSttusJson;
// const [currentPhase, setCurrentPhase] = useState(''); //차수설정용
const navigate = useNavigate();
const nowDate = moment().format('YYYYMM') //현재 년월
const [ printPopVisible, setPrintPopVisible ] = useState(false);  // 출력화면 팝업 컨트롤
const [ cancelPopVisible, setCancelPopVisible ] = useState(false);  // 취소화면 팝업 컨트롤
const [selectedData, setSelectedData] = useState({});
const [ atrzDmndSttsCnt, setAtrzDmndSttsCnt ] = useState({}); // 상태코드별 데이터 개수
const { handleOpen } = useModal();
const [ type, setType ] = useState(); // 시간 / 비용 구분자


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

const [ddlnYn, setDdlnYn] = useState('');

//======================초기차수 설정 ===============================================



//====================초기검색=====================================================
useEffect(() => {
    if (!Object.values(dtlParam).every((value) => value === "")) {
      pageHandle();
    }
  }, [dtlParam]);
//=================== 검색으로 조회할 때============================================
const searchHandle = async (initParam) => {
  
  if(initParam.yearItem == null || initParam.monthItem == null) {

    const date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    const day = date.getDate();

    const currentPhase = day <= 15 ? '2' : '1';

    if (month === 1) {
        if(day <= 15) {
            month = 12; // 1월인 경우 이전 연도 12월로 설정
            year--;
        }
    } else {
        if(day <= 15) {
            month--; // 2월 이상인 경우 이전 월로 설정
        } 
    }

    // 월을 두 자리 숫자로 표현
    const monthString = (month < 10 ? '0' : '') + month;
    let aplyYm = `${year}${monthString}`

    setTotParam({
        ...totParam,
        queryId: totQueryId,
        aplyYm: aplyYm,
        aplyOdr: currentPhase,
        empId: initParam.empId,
        hdofSttsCd: "VTW00301"
    })
    setDtlParam({
        ...dtlParam,
        queryId: queryId,
        aplyYm: aplyYm,
        aplyOdr: currentPhase,
        empId: initParam.empId,
        hdofSttsCd: "VTW00301"
    })  
    return;
  }
    setTotParam({
        ...totParam,
        queryId: totQueryId,
        aplyYm: initParam.yearItem + initParam.monthItem,
        aplyOdr: initParam.aplyOdr,
        empId: initParam.empId,
        hdofSttsCd: initParam.hdofSttsCd,

    })

    setDtlParam({
        ...dtlParam,
        queryId: queryId,
        aplyYm: initParam.yearItem + initParam.monthItem,
        aplyOdr: initParam.aplyOdr,
        empId: initParam.empId,
        hdofSttsCd: initParam.hdofSttsCd,
        ...checkBoxValue
    })
};

const pageHandle = async () => {

  const param = {
    queryId: "financialAffairMngMapper.retrieveDdlnYn",
    aplyYm: dtlParam.aplyYm,
    aplyOdr: dtlParam.aplyOdr
  }

  try {
    const responseDdln = await ApiRequest("/boot/common/queryIdSearch", param); // 현재 조회한 달-차수의 마감 여부 확인 검색
    const responseTot = await ApiRequest("/boot/common/queryIdSearch", totParam); //상단 total 검색
    const responseDtl = await ApiRequest("/boot/common/queryIdSearch", dtlParam); //하단 목록 검색

    setTotValues(responseTot);
    setDtlValues(responseDtl);
    if(responseDdln.length != 1) {

    } else {
      setDdlnYn(responseDdln[0].ddlnYn);
    }
  } catch (error) {
    console.log(error);
  }
};
//==========================현재 조회한 달-차수의 마감 여부 확인======================


//==========================팝업 관련 이벤트==========================================

const onPrintPopHiding = async () => { setPrintPopVisible(false); }
const onPrintPopAppear = async () => { setPrintPopVisible(true); }
const onCancelPopHiding = async () => { setCancelPopVisible(false); pageHandle();}
const onCancelPopAppear = async () => { setCancelPopVisible(true); }

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

  try {
    const response = await ApiRequest("/boot/common/commonSelect", param);
    setCtAtrzCmptnYn(response[0]?.ctAtrzCmptnYn);
  } catch(error) {
    console.error(error);
  }
}

const toEmpWorkTime = async (admin) => {
  const param = {
    queryId: "financialAffairMngMapper.getWorkDay",
    aplyYm: totParam.aplyYm,
    aplyOdr: totParam.aplyOdr
  }

  try {

    const response = await ApiRequest("/boot/common/queryIdSearch", param);
    
    let lastIndex = response.length - 1;
    
    const workTimeAdmin = {
      ...admin,
      orderWorkBgngYmd: response[0].crtrYmd,
      orderWorkEndYmd: response[lastIndex].crtrYmd
    }

    navigate("/indvdlClm/EmpWorkTime",
    {state: { admin: workTimeAdmin }})


  } catch (error) {
    console.error(error);
  }

}

//===========================테이블내 버튼 이벤트======================================
const onBtnClick = async (button, data) => {
    const admin = {
      empId: data.empId,
      jbpsCd: data.jbpsCd,
      deptNmAll: data.deptNmAll,
      aplyYm: totParam.aplyYm,
      aplyOdr: totParam.aplyOdr,
      empno: data.empno
    }

    if(button.name === "workHrMv"){
      
       await toEmpWorkTime(admin);
    }

    if(button.name === "hrRtrcn"){
        
        await onSetBasicInfo(data);
        await mmCancel(data);
        await onCancelPopAppear();
    }

    if(button.name === "prjctScrnMv"){                                      
      //handleOpen("프로젝트비용이동");
        navigate("/indvdlClm/ProjectExpense",
        {state: { admin: admin }})
    }


    if(button.name === "ctRtrcn"){
      if(ddlnYn != "Y") {
        await onSetBasicInfo(data);
        await ctCancel(data);
        await onCancelPopAppear();
      } else {
        alert("마감된 차수는 취소가 불가능합니다. 마감을 취소한 뒤 다시 시도해주세요.")
      }

    }

     if(button.name === "companyPrice"){                                 //경로 수정 예정
      //handleOpen("회사비용이동");
        navigate("/fnnrMng/prjctCtClm/ProjectCostClaimDetail",
        {state: { empId: data.empId }})
    }

    if(button.name === "print"){      
        await onSetBasicInfo(data);
        await getAtrzDmndSttsCnt(data);
        await getCtAply(data);
        await getCtAtrzCmptnYn(data);
        await onPrintPopAppear(true);
    }
};

/**
 * 시간 취소 로직 실행
 */
const mmCancel = async (data) => {
  setType("mm")
}

const ctCancel = async (data) => {
  setType("ct")
}

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
  const ddlnExcelDwn = async () => {
    const confirm = window.confirm("마감되지 않은 달 입니다. 마감 후 엑셀 파일을 로드하시겠습니까?"); 

    if(confirm) {

      // 마감하는 메소드
      const result = await closeAply();
      if(result > 0) {
        handleOpen("마감됐습니다.");
      } else {
        return;
      }

      // 후에
      const props = {
        aplyYm: dtlParam.aplyYm,
        aplyOdr: dtlParam.aplyOdr
      }
      
      // 화면 이동
      navigate("/fnnrMng/TimeExpenseClosingList",
      {state: { props: props }})
    }

  };

  const excelDwn = () => {
    //handleOpen("엑셀 다운로드"); //기능 개발 예정
    const props = {
      aplyYm: dtlParam.aplyYm,
      aplyOdr: dtlParam.aplyOdr
    }
    
    // 화면 이동
    navigate("/fnnrMng/TimeExpenseClosingList",
    {state: { props: props }})

  };

  const closeAply = async () => {
    const param = {
      queryId: "financialAffairMngMapper.updateDdlnYn",
      ddlnYn: "Y",
      aplyYm: dtlParam.aplyYm,
      aplyOdr: dtlParam.aplyOdr,
      state: "UPDATE"
    }

    try {
      const response = await ApiRequest("/boot/common/queryIdDataControl", param);

      return response
    } catch(error) {
      console.error(error);
    }
  }

//========================화면그리는 구간 ====================================================
  return(
      <div className="">
          <div className="" style={{ marginTop: "20px", marginBottom: "10px" }}>
                <h1 style={{ fontSize: "30px" }}>근무시간비용 입력 현황</h1>
          </div>
          <div className="" style={{ marginBottom: "10px" }}>
            <span>* 근무시간비용 입력 현황을 조회합니다.</span>
          </div>
          <div style={{ marginBottom: "20px" }}>
            <div>
              <SearchPrjctCostSet callBack={searchHandle} props={searchParams} />
            </div>
              <div align="right">
              {
                ddlnYn != 'Y' ? 
                  <Button 
                    text="Contained"
                    type="default"
                    stylingMode="contained"
                    style={{ margin: "2px" }}
                    onClick={ddlnExcelDwn}
                  >
                  마감 및 엑셀다운
                  </Button> :
                <Button 
                  text="Contained"
                  type="default"
                  stylingMode="contained"
                  style={{ margin: "2px" }} 
                  onClick={excelDwn}
                >
                  엑셀다운
                </Button>
              }
              </div>
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
                  paging={false}
                  onClick={onBtnClick}
                  wordWrap={true}
              />
              <ProjectExpensePopup
                  visible={printPopVisible}
                  onPopHiding={onPrintPopHiding}
                  aprvInfo={atrzDmndSttsCnt}
                  noDataCase={{cnt: ctAply.length, yn: ctAtrzCmptnYn}}
                  basicInfo={selectedData}
              />
              <TimeExpenseCancelPopup
                  visible={cancelPopVisible}
                  onPopHiding={onCancelPopHiding}
                  data={selectedData}
                  type={type}
              />
          </div>
      </div>
 );
};

export default TimeExpenseInsertSttus;