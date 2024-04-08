import { useState, useEffect} from "react";
import ApiRequest from "utils/ApiRequest";
import { Button } from "devextreme-react";
import CustomTable from "components/unit/CustomTable";
import EmpManageJson from  "./EmpManageJson.json";
import CustomLabelValue from "components/unit/CustomLabelValue";
import EmpRegist from "./EmpRegist";
import { SelectBox } from "devextreme-react/select-box";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom"; 
import SearchEmpSet from "components/composite/SearchInfoSet";
import { resetPassword } from "utils/AuthMng";

const EmpManage = ({}) => {

//----------------------------------선언구간 --------------------------------
  const [values, setValues] = useState([]);     //좌측 테이블 데이터 세팅용
  const [histValues, setHistValues] = useState([]);   //진급정보 세팅용
  const [param, setParam] = useState({});
  const [empFteParam,setEmpFteParam] = useState({}); //인턴->정규직 전환시 사번max값 조회용 param
  const [empMax,setEmpMax] =useState({});   //사번 MAX값
  const { listQueryId, listKeyColumn, listTableColumns,       //직원목록조회 
          ejhQueryId, ejhKeyColumn, ejhTableColumns,labelValue,searchInfo            //직원발령정보목록,발령용컴포넌트
        } = EmpManageJson; 
  const [year, setYear] = useState([]);
  const [month, setMonth] = useState([]);
  const [readOnly, setReadOnly] = useState(false);
  const [empDetailParam, setEmpDetailParam] = useState({}); //발령정보 넣어보낼거
  const [jbpsHistParam, setJbpsHistParam] = useState({}); //발령정보 받아올거
  const [empInfo, setEmpInfo] = useState([]);       //클릭시 직원 기초정보 가지고올것
  const [totalItems, setTotalItems] = useState(0);
  const [cookies, setCookie] = useCookies(["userInfo", "userAuth"]);
  const empId = cookies.userInfo.empId;
  const navigate = useNavigate ();
  const [empYear,setEmpYear] = useState();
  const [empMonth,setEmpMonth] = useState();
  const [empOdr, setEmpOdr] = useState();
  const [empJbps, setEmpJbps] = useState();
  const nowYear = new Date().getFullYear(); //현재년도
  const startYear = nowYear -10;
  const date = new Date();
  const now =  date.toISOString().split("T")[0] +" " +date.toTimeString().split(" ")[0];
  const yearList = [];
  const monthList = [];
  const odrList = 
        [
        { "id": "1","value": "1","text": "1회차" },
        { "id": "2","value": "2","text": "2회차" }
        ];  
//----------------------------------초기 셋팅 영역 --------------------------------
  useEffect(() => {
    if (!Object.values(param).every((value) => value === "")) {
      pageHandle();
    }
  }, [param]);


  useEffect(() => {
    for(let i = startYear; i <= nowYear; i++) {
        yearList.push({"id": i, "value": i,"text": i + "년"});
    }
    for(let i = 1; i <= 12; i++) {
      if(i < 10) {
          i = "0" + i;
      }
      else{
        i = String(i);
      }
      monthList.push({"id": i,"value": i,"text": i + "월"})
      } 
    setYear(yearList);
    setMonth(monthList);
    setEmpYear(null);
    setEmpMonth(null);
    setEmpOdr(null);
    setEmpJbps(null);
  }, []);


  useEffect(() => {
    if (jbpsHistParam.empId !== undefined) {
      empJbpsHistHandle();
    }
  }, [jbpsHistParam]);

  useEffect(() => {
    if (empInfo.empId !== undefined && empInfo.empId !== "" && empInfo.empId !== null) {
      setReadOnly(true);
    }else {
      setReadOnly(false);
    }
  }, [empInfo.empId]);


  useEffect(() => {     //사번 max값 세팅 후 조회쿼리 이동
    if (!Object.values(empFteParam).every((value) => value === "")) {
      empnoHandle();
    }
  }, [empFteParam]);

  useEffect(() => {   //사번 max값 조회후 세팅 시 인서트로 이동
    if (!Object.values(empMax).every((value) => value === "")) {
      console.log("empmaxax",empMax)
      const isconfirm = window.confirm(`정직원으로 발령시 사번이 ${empMax}으로 변경됩니다. \n발령하시겠습니까?`); 
      if (isconfirm) {
        insertEmpFte();
      } else{
        setEmpMax({});
        setEmpFteParam({});
       }
      
    }
  }, [empMax]);
//------------------------------이벤트영역--------------------------------------------

  const searchHandle = async (initParam) => { //검색이벤트
    setParam({
      ...initParam,
      queryId: listQueryId,
      startVal: 0,
    });
  };

  const pageHandle = async () => {
    try {
      const response = await ApiRequest("/boot/common/queryIdSearch", param);
      setValues(response);
      setTotalItems(response[0].totalItems);
      setReset();
    } catch (error) {
      console.log(error);
    }
  };
 
  const onRowClick = (e) => {   //직원목록 로우 클릭 이벤트
    setEmpYear(null);
    setEmpMonth(null);
    setEmpOdr(null);
    setEmpJbps(null);
    for (const value of values) {
      if (value.empId === e.data.empId) {
        setEmpInfo(value);  
        setEmpDetailParam(value);
        break;
      }
    }
    setJbpsHistParam({            //진급정보 조회용 정보 세팅
      empId: e.data.empId,
      queryId: ejhQueryId,
    });
  };
 
  const empJbpsHistHandle = async () => {   //진급정보 목록 조회
    try {
      const response3 = await ApiRequest("/boot/common/queryIdSearch",jbpsHistParam);
      setHistValues(response3);
    } catch (error) {
      console.log(error);
    }
  };

//==========================진급정보 콤보박스 선택 변경시===================
  const handleChgState = (name,e) => {
      // setEmpDetailParam({
      //   ...empDetailParam,
      //   [name]: e.value,
      // });
      if(name === "year") {
        setEmpYear(e.value);
    } else if(name === "month") {
      setEmpMonth(e.value);
    } else if(name === "aplyOdr") {
      setEmpOdr(e.value);
    } else if(name.name === "jbpsCd") {
      setEmpJbps(name.value);
    }
  };

//=========================발령저장 버튼 클릭 이벤트 ========================
  const onClickHst = () => {    
    if(empYear === null) {
      alert("발령년도를 선택해주세요");
        return;
    } else if(empMonth === null) {
      alert("발령 월을 선택해주세요");
      return;
    } else if(empOdr === null) {
      alert("발령 차수를 선택해주세요");
      return;
    }else if(empJbps === null) {
      alert("직위를 선택해주세요");
      return;
    }else{
      if(empDetailParam.jbpsCd === "VTW00119"){   //인턴 -> 사원 or 컨설턴트 진급시 
        setEmpFteParam({empnoChk : "VK" ,queryId : "humanResourceMngMapper.retrieveEmpnoMax", });
      } else{
        const isconfirm = window.confirm("진급정보를 저장 하시겠습니까?"); 
        if (isconfirm) {
            insertEmpHist();
        } else{
          return;
         }
        }
      }
   
  };
 //========================진급정보 인서트====================================== 
  const insertEmpHist = async () => {
    
    const paramUpd =[
      { tbNm: "EMP" },
      {
         jbpsCd : empJbps,
         mdfcnEmpId : empId,
         mdfcnDt: now,
      },
      {
         empId : empDetailParam.empId 
      }
    ]

    const paramHist =[
      { tbNm: "EMP_HIST", snColumn: "EMP_HIST_SN", snSearch: {empId : empDetailParam.empId}},
      {
      empId : empDetailParam.empId,
      hdofSttsCd : empDetailParam.hdofSttsCd,
      jbpsCd : empJbps,
      jncmpYmd : empDetailParam.jncmpYmd,
      empInfoChgOdr: empYear + empMonth + empOdr,
      regEmpId : empId,
      regDt: now,
    }
    ]
    try {
      const responseUpt = await ApiRequest("/boot/common/commonUpdate", paramUpd);
      const responseHist = await ApiRequest("/boot/common/commonInsert", paramHist);
        if (responseUpt > 0 && responseHist > 0) {
          alert("저장되었습니다.");
          empJbpsHistHandle();
          pageHandle();
          setReset();
        }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };
 //=================================사번 max값 조회용================================================
 const empnoHandle = async () => {
  try {
    const response = await ApiRequest("/boot/common/queryIdSearch", empFteParam);
    setEmpMax(response[0].empnoChk);    
  } catch (error) {
    console.log(error);
  }
}; 
//========================진급정보 인서트 (인턴->사원 발령 이벤트)====================================== 
const insertEmpFte = async () => {
    
  const paramUpd =[
    { tbNm: "EMP" },
    {  
       empno : empMax,
       empTyCd : "VTW00201",
       jbpsCd : empJbps,
       mdfcnEmpId : empId,
       mdfcnDt: now,
    },
    {
       empId : empDetailParam.empId 
    }
  ]
  const paramUpdUser =
    {  
       empno : empMax,
       empId:  empDetailParam.empId ,
    }
  const paramHist =[
    { tbNm: "EMP_HIST", snColumn: "EMP_HIST_SN", snSearch: {empId : empDetailParam.empId}},
    {
    empId : empDetailParam.empId,
    hdofSttsCd : empDetailParam.hdofSttsCd,
    jbpsCd : empJbps,
    jncmpYmd : empDetailParam.jncmpYmd,
    empInfoChgOdr: empYear + empMonth + empOdr,
    regEmpId : empId,
    regDt: now,
  }
  ]
  try {
    const responseUpt = await ApiRequest("/boot/common/commonUpdate", paramUpd);
    const responseUptUser = await ApiRequest("/boot/sysMng/resetPswd", paramUpdUser);
    const responseHist = await ApiRequest("/boot/common/commonInsert", paramHist);
      if (responseUpt > 0 && responseHist > 0 && responseUptUser === "성공")  {
        alert("저장되었습니다.");
        setEmpMax({});
        setEmpFteParam({});
        empJbpsHistHandle();
        pageHandle();
        setReset();
      
      }
  } catch (error) {
    console.error("Error fetching data", error);
  }
};


//====================발령취소 버튼 클릭 이벤트===============================
  const onClickDel = () => {        
    let maxSn=0;
    let maxJbpsCd;
    if(histValues.length === 0){
      alert("취소할 진급이력이 존재하지 않습니다.")
    }else{

      for(const value of histValues){
        if(maxSn < value.empHistSn){
          maxSn = value.empHistSn;
        }
      } 
      const isconfirm = window.confirm("진급을 취소 하시겠습니까?"); 

    if (isconfirm) {
      
      for(const value of histValues){
        if(value.empHistSn === maxSn){
          maxJbpsCd = value.jbpsCd;
          break;
        }
      } 
        const updParam=[
          {tbNm : "EMP"},
          {jbpsCd : maxJbpsCd},
          {empId : empDetailParam.empId}
         ]

        const ehdParam =[
          { tbNm: "EMP_HIST" },
          {
            empId:empDetailParam.empId,
            empHistSn: maxSn
          }
          ]

          cancelJbpsEmpHist(updParam,ehdParam,);
    } else{
      return;
     }
    }
}


const cancelJbpsEmpHist = async (updParam,ehdParam) => {       //삭제axios
  try {
    const responseUpd = await ApiRequest("/boot/common/commonUpdate", updParam);
    const responseDel = await ApiRequest("/boot/common/commonDelete", ehdParam);
      if (responseUpd > 0 && responseDel > 0 ) {
        alert("취소되었습니다.");
        pageHandle();
        empJbpsHistHandle();
      }
  } catch (error) {
    console.error("Error fetching data", error);
  }
};

//===========================더블클릭시 회원정보창으로 이동
    const onRowDblClick = (e) => {
      console.log("eee",e);
      navigate("/infoInq/EmpDetailInfo", 
              { state: { 
                empId: e.data.empId,
                 index: 1
                      } 
              });
    }

//===========================reset(regist 콜백용)
 const setReset =()=>{
    setReadOnly(false);
    setEmpDetailParam({});
    setJbpsHistParam({});
    setHistValues([]);
    setEmpYear(null);
    setEmpMonth(null);
    setEmpOdr(null);
    setEmpJbps(null);
 }

//================================비밀번호 초기화 (개발예정)
    const onClickRestPwd  = async (e,data) => {
      const isconfirm = window.confirm("비밀번호를 초기화 하시겠습니까?"); 
      if (isconfirm) {
        const response =  await resetPassword(data.empId,data.empno)
        console.log("datata",response)
        if(response.isOk){
          window.alert("비밀번호가 초기화되었습니다");
        }else {
          window.alert("초기화에 실패하였습니다.");
        }
      } else{
        return;
      }
    }
    
//===============================발령정보 업로드 (개발예정)
    const empUpload =()=>{
      alert("발령정보를 업로드 하시겠습니까?")
    }

//=================================화면 그리는 부분 
  return (
    <div className="container">
      <div className="title p-1" style={{ marginTop: "20px", marginBottom: "10px" }} >
        <h1 style={{ fontSize: "40px" }}>직원 관리</h1>
      </div>
      <div className="col-md-10 mx-auto" style={{ marginBottom: "10px" }}>
        <span>* 직원 정보를 조회합니다.</span>
      </div>
      <div style={{ marginBottom: "20px" }}>
       
        <SearchEmpSet callBack={searchHandle} props={searchInfo} />
      </div>
        <div>검색된 건 수 : {totalItems} 건</div>
      <div className="tableContainer" style={tableContainerStyle}>
        <div className="empListContainer" style={empListContainerStyle}>
          <div className="empListTable" style={empListStyle}>
          <p>
            <strong>* 직원목록 </strong>
            </p>
            <span style={{ fontSize: 12 }}>
            목록을 선택시 직원의 기초정보를 조회및 수정 할 수 있습니다.<br/>
            직원 성명을 선택시 상세내역 페이지로 이동합니다.<br/>
            아이콘 클릭시 비밀번호 사번으로 초기화<br/>
            </span>
            <CustomTable
             keyColumn={listKeyColumn}
             columns={listTableColumns} 
             values={values}
             paging={true} 
             onRowClick={onRowClick} 
             onRowDblClick={onRowDblClick} 
             onClick={onClickRestPwd}/>
          </div>
        </div>
        <div className="empDetailContainer" style={empDetailContainerStyle}>
        <div className="empDetailTable" style={empDetailStyle}>
          <p> <strong>* 기초정보 </strong> </p>
          <span style={{ fontSize: 12 }}>
          신규 직원정보를 입력하면 TRS 접속 권한이 생기게 됩니다.<br/>
          신규 직원 사번은 자동 입력됩니다.
          </span>
          <EmpRegist empInfo={empInfo} read={readOnly} callBack={pageHandle} callBackR={setReset}/>
        </div>
        <div className="empDownListTable" style={empDetailStyle}>
            <p> <strong>* 진급정보 </strong> </p>
            <span style={{ fontSize: 12 }}>
            주의!! 직위발령을 입력하지 않거나 잘못 입력 할 경우 '프로젝트관리'메뉴에 
            실행원가 집행현황 자사인력<br/> 누적사용금액이 제대로 계산되지 않습니다.
            </span>
            <div className="buttonContainer" style={{marginBottom: "10px" }}>
            <Button style={buttonStyle} onClick={empUpload}>발령정보업로드 </Button>
            </div>   
            <div className="dx-field">
            <div className="dx-field-label asterisk">진급발령년도</div>
            <div className="dx-field-value">
              <SelectBox
                dataSource={year}
                displayExpr="text"
                valueExpr="value"
                onValueChanged={(e) => { handleChgState("year", e) }}
                placeholder="연도"
                style={{margin: "0px 5px 0px 5px"}}
                required = {true}
                value={empYear}
              />
              </div>
              </div>

            <div className="dx-field">
            <div className="dx-field-label asterisk">진급발령차수</div>
            <div className="dx-field-value">
              <SelectBox
                  id="month"
                  dataSource={month}
                  displayExpr="text"
                  valueExpr="value"
                  onValueChanged={(e) => { handleChgState("month", e) }}
                  placeholder="월"
                  style={{margin: "0px 5px 0px 5px"}}
                  required = {true}
                  value={empMonth}
              />
              <SelectBox
                  id="odr"
                  dataSource={odrList}
                  displayExpr="text"
                  valueExpr="value"
                  onValueChanged={(e) => { handleChgState("aplyOdr", e) }}
                  placeholder="차수"
                  style={{margin: "0px 5px 0px 5px"}}
                  required = {true}
                  value={empOdr}
              />
                </div>
              </div>
              <CustomLabelValue props={labelValue.jbpsCd} onSelect={handleChgState} value={empJbps}/>
            
            {empDetailParam.empId != null ? ( 
            <div className="buttonContainer" style={buttonContainerStyle}>
            <Button style={buttonStyle} onClick={onClickHst}>발령저장</Button>
            <Button style={buttonStyle} onClick={onClickDel}>발령취소</Button>
            </div>
            ): null }    
        
        </div>
        
         <div className="empHnfListTable" style={empDetailStyle}>
         <p> <strong>* 진급이력 정보 </strong> </p>
          <CustomTable keyColumn={ejhKeyColumn}  columns={ejhTableColumns} values={histValues} paging={true} />
        </div>     
        </div>
      </div>
    </div>
  );
};

export default EmpManage;

  //화면 전체 배치
  const tableContainerStyle = {
    display: "flex",
  };

  //전체 부서 목록 배치
  const empListContainerStyle = {
    width: "50%", // 왼쪽 영역의 너비를 반으로 설정
    marginTop: "20px",
  };

  const empListStyle = {
    minWidth: "480px",
  };

  //우측 전체 배치
  const empDetailContainerStyle = {
    width: "50%", // 오른쪽 영역의 너비를 반으로 설정
    display: "flex",
    flexDirection: "column",
    marginBottom: "20px",
  };

  //각 테이블 배치
  const empDetailStyle = {
    flex: "1",
    marginLeft: "20px", // 각 div 사이의 간격을 조절합니다.
    marginTop: "20px",
  };

  //버튼 배치
  const buttonContainerStyle = {
    display: "flex",
    justifyContent: "flex-end",
  };
  
  const buttonStyle = {
    marginLeft: "10px",
  };
