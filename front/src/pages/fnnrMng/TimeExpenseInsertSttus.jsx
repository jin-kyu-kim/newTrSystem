import { useState, useEffect } from "react";
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

const TimeExpenseInsertSttus = ({}) => {
//====================선언구간====================================================
const [values, setValues] = useState([]);   //상단values
const [values2, setValues2] = useState([]); //하단values
const [paramtot, setParamtot] = useState({}); //상단 조회용 param
const [param, setParam] = useState({}); //하단 조회용 param
const { keyColumn, queryId, totTableColumns, tableColumns, searchParams, totQueryId } = TimeExpenseInsertSttusJson;
const [currentPhase, setCurrentPhase] = useState(''); //차수설정용
const navigate = useNavigate();
const nowDate = moment().format('YYYYMM') //현재 년월
const [popupVisible, setPopupVisible] = useState(false);
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
    setParamtot({
        ...paramtot,
        queryId: totQueryId,
        aplyYm: nowDate,
        aplyOdr: currentPhase,
        empId: initParam.empId,
        hdofSttsCd: initParam.hdofSttsCd
    })
    setParam({
        ...param,
        queryId: queryId,
        aplyYm: nowDate,
        aplyOdr: currentPhase,
        empId: initParam.empId,
        hdofSttsCd: initParam.hdofSttsCd
    })  
    return;
};
    setParamtot({
        ...paramtot,
        queryId: totQueryId,
        aplyYm: initParam.yearItem + initParam.monthItem,
        aplyOdr: initParam.aplyOdr,
        empId: initParam.empId,
        hdofSttsCd: initParam.hdofSttsCd
    })

    setParam({
        ...param,
        queryId: queryId,
        aplyYm: initParam.yearItem + initParam.monthItem,
        aplyOdr: initParam.aplyOdr,
        empId: initParam.empId,
        hdofSttsCd: initParam.hdofSttsCd
    })
};

const pageHandle = async () => {
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
//===========================테이블내 버튼 이벤트======================================
const onBtnClick = ({button,data}) => {      //
    if(button.name === "workHrMv"){
        alert("근무시간페이지이동");
        navigate("/fnnrMng/prjctCtClm/ProjectCostClaimDetail",          //경로 수정 예정
        {state: { empId: values2.empId }})
    }
    if(button.name === "hrRtrcn"){                                   //취소상태로 변경 -> 반려?
        alert("시간취소!"); 
    }
    if(button.name === "prjctScrnMv"){                                      //경로 수정 예정
        alert("프로젝트비용이동");
        navigate("/fnnrMng/prjctCtClm/ProjectCostClaimDetail",
        {state: { empId: values2.empId }})
    }
    if(button.name === "ctRtrcn"){                                    //취소상태로 변경 -> 반려?
        alert("비용취소");
    }
     if(button.name === "companyPrice"){                                 //경로 수정 예정
        alert("회사비용이동");
        navigate("/fnnrMng/prjctCtClm/ProjectCostClaimDetail",
        {state: { empId: values2.empId }})
    }
    if(button.name === "print"){                                        //팝업으로 띄울 예정
        setPopupVisible(true);
    }
  };
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
            <div style={{ marginBottom: "20px" }}>
                <CustomTable
                  keyColumn={keyColumn}
                  columns={totTableColumns}
                  values={values}
                  paging={false}
                />
            </div>
            <div style={{ marginBottom: "20px" }}>
                <CustomTable
                    keyColumn={keyColumn}
                    columns={tableColumns}
                    values={values2}
                    paging={true}
                    onClick={onBtnClick}
                    wordWrap={true}
                />
                <Popup
                      width="90%"
                      height="90%"
                      visible={popupVisible}
                      onHiding={handleClose}
                      showCloseButton={true}
                  >
                   <TimeExpenseInsertList data={values}/>
                </Popup>
            </div>
        </div>
 );
};

export default TimeExpenseInsertSttus;