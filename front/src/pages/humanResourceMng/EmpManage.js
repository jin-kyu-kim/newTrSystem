import { useState, useEffect ,useRef,useCallback } from "react";
import ApiRequest from "utils/ApiRequest";
import { Button } from "devextreme-react";
import CustomTable from "components/unit/CustomTable";
import EmpManageJson from  "./EmpManageJson.json";
import CustomLabelValue from "components/unit/CustomLabelValue";
import SearchHumanResoureceMngSet from "components/composite/SearchEmpSet";
import EmpRegist from "./EmpRegist";
import { SelectBox } from "devextreme-react/select-box";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom"; 

const EmpManage = ({}) => {
  const [values, setValues] = useState([]);     //좌측 테이블 데이터 세팅용
  const [histValues, setHistValues] = useState([]);   //진급정보 세팅용
  const [param, setParam] = useState({});
  const { listQueryId, searchParams, listKeyColumn, listTableColumns,       //직원목록조회 
          ejhQueryId, ejhKeyColumn, ejhTableColumns,labelValue,            //직원발령정보목록,발령용컴포넌트
        } = EmpManageJson; 
  const [year, setYear] = useState([]);
  const [month, setMonth] = useState([]);
  const [readOnly, setReadOnly] = useState(false);
  const [empParam2, setEmpParam2] = useState({}); //발령정보 넣어보낼거
  const [empParam3, setEmpParam3] = useState({}); //발령정보 받아올거
  const [empInfo, setEmpInfo] = useState([]);       //클릭시 직원 기초정보 가지고올것
  const [totalItems, setTotalItems] = useState(0);
  const [cookies, setCookie] = useCookies(["userInfo", "userAuth"]);
  const empId = cookies.userInfo.empId;
  const navigate = useNavigate ();

  //======================================테이블 배치

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

  //=============================직원 목록 조회 
  useEffect(() => {
    if (!Object.values(param).every((value) => value === "")) {
      pageHandle();
    }
  }, [param]);

  const searchHandle = async (initParam) => {
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
      if (response.length !== 0) {
        setTotalItems(response[0].totalItems);
      } else {
        setTotalItems(0);
      }
    } catch (error) {
      console.log(error);
    }
  };
  //==========================발령년도 및 차수 설정
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
//============================직원목록에서 로우 클릭시 발생하는 이벤트
const onRowClick = (e) => {
  for (const value of values) {
    if (value.empId === e.data.empId) {
      setEmpInfo(value);  //기초정보로 넘겨줄값 세팅
      setEmpParam2(value); //발령정보 저장용값 세팅
      break;
    }
  }
  setEmpParam3({            //진급정보 조회용 정보 세팅
    empId: e.data.empId,
    queryId: ejhQueryId,
  });
};
 //==================================로우 클릭시 진급정보 셋팅
 useEffect(() => {
  if (empParam3.empId !== undefined) {
    empJbpsHistHandle();
  }
}, [empParam3]);
  //==================================진급정보 목록 조회
  const empJbpsHistHandle = async () => {
    try {
      const response3 = await ApiRequest("/boot/common/queryIdSearch",empParam3);
      setHistValues(response3);
    } catch (error) {
      console.log(error);
    }
  };

  //=================================진급정보 콤보박스 선택 변경시
  const handleChgState = (name,e) => {
      setEmpParam2({
        ...empParam2,
        [name]: e.value,
      });
  };
  const handleChgJbps = (e) => {
      setEmpParam2({
        ...empParam2,
        [e.name]: e.value,
      });
  };
  //=================================진급정보 저장
  const onClickHst = () => {
    if(empInfo.empId === undefined || empInfo.empId === "" ){
      alert("진급정보를 입력할 직원을 선택하십시요");
      return; 
    }
    else{
    const isconfirm = window.confirm("진급정보를 저장 하시겠습니까?"); 
    if (isconfirm) {
        insertEmpHist();
    } else{
      return;
     }
    }
  };
 //========================진급정보 입력 
  const insertEmpHist = async () => {
    
    const paramUpd =[
      { tbNm: "EMP" },
      {
         jbpsCd : empParam2.jbpsCd,
         mdfcnEmpId : empId,
         mdfcnDt: now,
      },
      {
         empId : empParam2.empId 
      }
  ]
    const paramHist =[
      { tbNm: "EMP_HIST", snColumn: "EMP_HIST_SN", snSearch: {empId : empParam2.empId}},
      {
      empId : empParam2.empId,
      empno : empParam2.empno,
      actno : empParam2.actno,
      bankCd : empParam2.bankCd,
      empTyCd : empParam2.empTyCd,
      eml : empParam2.eml,
      empFlnm : empParam2.empFlnm,
      hdofSttsCd : empParam2.hdofSttsCd,
      jbpsCd : empParam2.jbpsCd,
      telno : empParam2.telno,
      empInfoChgOdr: empParam2.year + empParam2.month + empParam2.aplyOdr,
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
        }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  //=============================삭제버튼클릭이벤트
  const onClickDel = (data) => {
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
//=============================삭제axios
const deleteEmpHist = async (paramDel) => {
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
//===========================ReadOnly 설정용
  useEffect(() => {
    if (empInfo.empId !== undefined && empInfo.empId !== "" && empInfo.empId !== null) {
      setReadOnly(true);
    }else {
      setReadOnly(false);
    }
  }, [empInfo.empId]);
 const setReadFalse =()=>{
    setReadOnly(false);
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
        <SearchHumanResoureceMngSet callBack={searchHandle} props={searchParams} />
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
            <CustomTable keyColumn={listKeyColumn}columns={listTableColumns} 
            values={values} paging={true} onRowClick={onRowClick} onRowDblClick={onRowDblClick} onClick={onClickRestPwd}/>
          </div>
        </div>
        <div className="empDetailContainer" style={empDetailContainerStyle}>
        <div className="empDetailTable" style={empDetailStyle}>
          <p> <strong>* 기초정보 </strong> </p>
          <span style={{ fontSize: 12 }}>
          신규 직원정보를 입력하면 TRS 접속 권한이 생기게 됩니다.<br/>
          신규 직원 사번은 자동 입력됩니다.
          </span>
          <EmpRegist empInfo={empInfo} read={readOnly} callBack={pageHandle} callBackR={setReadFalse}/>
        </div>
        <div className="empDownListTable" style={empDetailStyle}>
            <p> <strong>* 진급정보 </strong> </p>
            <span style={{ fontSize: 12 }}>
            신규 직원정보를 입력하면 TRS 접속 권한이 생기게 됩니다.<br/>
            신규 직원 사번은 자동 입력됩니다.
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
                  value={empParam2.year}
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
                  value={empParam2.month}
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
                  value={empParam2.aplyOdr}
              />
                </div>
              </div>
          <CustomLabelValue props={labelValue.jbpsCd} onSelect={handleChgJbps} value={empParam2.jbpsCd}/>
        <div className="buttonContainer" style={buttonContainerStyle}>
            <Button style={buttonStyle} onClick={empUpload}>발령정보업로드 </Button>
            <Button style={buttonStyle} onClick={onClickHst}>발령저장</Button>
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