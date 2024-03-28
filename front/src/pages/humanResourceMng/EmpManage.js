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

const EmpManage = ({}) => {

//----------------------------------선언구간 --------------------------------
  const [values, setValues] = useState([]);     //좌측 테이블 데이터 세팅용
  const [histValues, setHistValues] = useState([]);   //진급정보 세팅용
  const [param, setParam] = useState({});
  const { listQueryId, searchParams, listKeyColumn, listTableColumns,       //직원목록조회 
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
    } catch (error) {
      console.log(error);
    }
  };
 
  const onRowClick = (e) => {   //직원목록 로우 클릭 이벤트
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

//=================================진급정보 콤보박스 선택 변경시
  const handleChgState = (name,e) => {
      setEmpDetailParam({
        ...empDetailParam,
        [name]: e.value,
      });
  };
  const handleChgJbps = (e) => {
    setEmpDetailParam({
        ...empDetailParam,
        [e.name]: e.value,
      });
  };


  const onClickHst = () => {    //발령저장 사용시 
   
    const isconfirm = window.confirm("진급정보를 저장 하시겠습니까?"); 
    if (isconfirm) {
        insertEmpHist();
    } else{
      return;
     }
  };
 //========================진급정보 입력 
  const insertEmpHist = async () => {
    
    const paramUpd =[
      { tbNm: "EMP" },
      {
         jbpsCd : empDetailParam.jbpsCd,
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
      empno : empDetailParam.empno,
      actno : empDetailParam.actno,
      bankCd : empDetailParam.bankCd,
      empTyCd : empDetailParam.empTyCd,
      eml : empDetailParam.eml,
      empFlnm : empDetailParam.empFlnm,
      hdofSttsCd : empDetailParam.hdofSttsCd,
      jbpsCd : empDetailParam.jbpsCd,
      telno : empDetailParam.telno,
      empInfoChgOdr: empDetailParam.year + empDetailParam.month + empDetailParam.aplyOdr,
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

  const onClickDel = (data) => {        //삭제버튼클릭이벤트
    const isconfirm = window.confirm("진급정보를 삭제 하시겠습니까?"); 
    if (isconfirm) {
      const paramDel =[
        { tbNm: "EMP_HIST" },
        {
           empId: data.empId,
           empHistSn: data.empHistSn,
        }
        ]
        deleteEmpHist(paramDel);
    } else{
      return;
     }
}


const deleteEmpHist = async (paramDel) => {       //삭제axios
  try {
    const responseDel = await ApiRequest("/boot/common/commonDelete", paramDel);

      if (responseDel > 0 ) {
        alert("삭제되었습니다.");
        empJbpsHistHandle();
      }
  } catch (error) {
    console.error("Error fetching data", error);
  }
};

//===========================더블클릭시 회원정보창으로 이동
    const onRowDblClick = (e) => {
      console.log(e);
      navigate("/infoInq/EmpDetailInfo", 
              { state: { 
                        empId: e.empId,
                      } 
              });
    }

//===========================reset(regist 콜백용)
 const setReset =()=>{
    setReadOnly(false);
    setEmpDetailParam({});
    setJbpsHistParam({});
    setHistValues([]);
 }

//================================비밀번호 초기화 (개발예정)
    const onClickRestPwd = (data) => {
      const isconfirm = window.confirm("비밀번호를 초기화 하시겠습니까?"); 
      if (isconfirm) {
        alert("초기화되었습니다."); //개발예정
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
                value={empDetailParam.year}
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
                  value={empDetailParam.month}
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
                  value={empDetailParam.aplyOdr}
              />
                </div>
              </div>
              <CustomLabelValue props={labelValue.jbpsCd} onSelect={handleChgJbps} value={empDetailParam.jbpsCd}/>
        <div className="buttonContainer" style={buttonContainerStyle}>
            <Button style={buttonStyle} onClick={empUpload}>발령정보업로드 </Button>
            {empDetailParam.empId != null ? ( 
            <Button style={buttonStyle} onClick={onClickHst}>발령저장</Button>
            ): null }    
        </div>
        
        </div>
         <div className="empHnfListTable" style={empDetailStyle}>
          <CustomTable keyColumn={ejhKeyColumn}  columns={ejhTableColumns} values={histValues} paging={true} onClick={onClickDel} />
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
