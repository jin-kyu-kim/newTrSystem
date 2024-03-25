import { useState, useEffect, useCallback } from "react";
import ApiRequest from "utils/ApiRequest";
import { Button } from "devextreme-react";
import CustomTable from "components/unit/CustomTable";
import SearchInfoSet from "../../components/composite/SearchInfoSet"
import DeptManagePopJson from "./DeptManagePopJson.json"
import CustomLabelValue from "components/unit/CustomLabelValue";
import moment from "moment";
import { useCookies } from "react-cookie";
const DeptManagePop = ({callBack,data,deptId,deptNm}) => {

  const [deptEmpParam, setDeptEmpParam] = useState({});   //좌측 부서인력정보 검색용
  const [param, setParam] = useState({});                 //우측 인력정보 검색용
  const [deptAptParam, setDeptAptParam] = useState({});   //발령정보 입력

  const [values, setValues] = useState([]);      //우측 발령할 사원정보 데이터
  const [values2, setValues2] = useState([]);   //좌측 부서인력정보 데이터
  const [valuesApt, setValuesApt] = useState([]);   //??????
  
  const [cookies, setCookie] = useCookies(["userInfo", "userAuth"]);
  const empId = cookies.userInfo.empId;     //현재 로그인중인 사원id
  const gnfdDate = moment().format('YYYYMM') //현재 년월
  const date = new Date();
  const now =  date.toISOString().split("T")[0] +" " +date.toTimeString().split(" ")[0]; //등록일시 (Timstamp)
  const {emplistQueryId,emplistTableColumns,emplistKeyColumn, //우측 목록
         hnfQueryId,hnfKeyColumn,hafTableColumns,
         searchInfo,labelValue}= DeptManagePopJson       

  //화면 전체 배치
  const tableContainerStyle = {
    display: "flex",
  };

  //전체 부서 목록 배치
  const deptEmpLeftContainerStyle = {
    width: "50%", // 왼쪽 영역의 너비를 반으로 설정
    marginTop: "20px",
  };

  const deptListStyle = {
    minWidth: "480px",
  };

  //우측 전체 배치
  const deptEmpRightContainerStyle = {
    width: "50%", // 오른쪽 영역의 너비를 반으로 설정
    display: "flex",
    flexDirection: "column",
    marginBottom: "20px",
  };

  //각 테이블 배치
  const deptDetailStyle = {
    flex: "1",
    marginLeft: "20px", // 각 div 사이의 간격을 조절합니다.
    marginTop: "40px",
  };

  //버튼 배치
  const buttonContainerStyle = {
    display: "flex",
    justifyContent: 'space-between',
    alignItems: 'center'
  };
  
  //부서 상세 버튼
  const editButtonStyle={
    marginRight:"10px",
    marginBottom:"10px",
  }

  const deleteButtonStyle ={
    marginRight:"20px",
    marginBottom:"10px",
  }

  //인력 추가 버튼
  const addButtonStyle ={
    marginRight:"10px",
    marginBottom:"10px",
  }

 
//========================초기 부서인력정보 조회=====================================
  useEffect(() => {
    setDeptEmpParam({
     ...deptEmpParam,
     deptId : deptId,
     query : hnfQueryId,
    })
    setDeptAptParam({});
   }, []);
//========================setParam 이후에 함수가 실행되도록 하는 useEffect=============
  useEffect(() => {
    if (deptEmpParam.deptId !== undefined) {
      deptHnfListHandle();
    }
  }, [deptEmpParam]);

  
  //========================부서인력 목록=====================================
  const deptHnfListHandle = async () => {
    try {
      const response = await ApiRequest( "/boot/common/queryIdSearch", deptEmpParam);
      setValues2(response);
    } catch (error) {
      console.log(error);
    }
  };
 
 //========================직원 목록 조회용===============================================
  const searchHandle = async (initParam) => {
    setParam({
      ...initParam,
      queryId: emplistQueryId,
      startVal: 0,
    });
  };

//========================직원목록 및 발령 테이블 조회=====================================
  useEffect(() => {
    if (!Object.values(param).every((value) => value === "")) {
      pageHandle();
    }
  }, [param]);

  const pageHandle = async () => {
    try {
      const response = await ApiRequest("/boot/common/queryIdSearch", param);
      setValues(response);
    } catch (error) {
      console.log(error);
    }
  };
//===================직원 목록 및 직책 변경시 이벤트===========================================
  const handleChgState = ({ name, value }) => {
    setDeptAptParam({
      ...deptAptParam,
      [name]: value,
    });
  };
  useEffect(() => {
    console.log("deeeeee",deptAptParam)
  }, [deptAptParam]);

//============================직원목록에서 로우 클릭시 발생하는 이벤트======================
  const onRowClick = (e) => {
    for (const value of values) {
      if (value.deptId === e.data.deptId) {
        setDeptAptParam(value);
        break;
      }
    }
  };
//============================발령버튼 클릭 이벤트==========================================
  const deptapt = () => {
    const InsertParam =[
      { tbNm: "DEPT_HNF" },
      {
         deptId : deptId,
         empId : deptAptParam.empId,
         jbttlCd : deptAptParam.jbttlCd,
         empno : deptAptParam.empno,
         deptGnfdYmd : gnfdDate,
         regDt : now,
         regEmpId: empId,        
      },
  ]
    insertDept(InsertParam);
  };
//===========================부서발령정보 인서트============================================
  const insertDept = async (InsertParam) => {
    try {
      const response = await ApiRequest("/boot/common/commonInsert", InsertParam);
      console.log(response);
        if (response > 0) {
          alert("발령되었습니다.");
          //setDeptAptParam({});
          pageHandle();
          callBack(deptEmpParam);
        }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };
//============================화면그리는부분===================================================
  return (
    <div className="container">
      <div className="title p-1" style={{ marginTop: "20px", marginBottom: "10px" }}>
        <h1 style={{ fontSize: "40px" }}>{deptNm} 인력 관리</h1>
      </div>
      <div className="col-md-10 mx-auto" style={{ marginBottom: "10px" }}>
        <span>* 부서의 인력을 관리합니다.</span>
      </div>
      <div style={{ marginBottom: "20px" }}>
      <SearchInfoSet callBack={searchHandle} props={searchInfo}/>
      </div>
      <div className="tableContainer" style={tableContainerStyle}>
        <div className="deptListContainer" style={deptEmpLeftContainerStyle}>
          <div className="deptListTable" style={deptListStyle}>
            <div><p><strong>* 부서인력정보 </strong></p></div>
            <CustomTable keyColumn={hnfKeyColumn} columns={hafTableColumns} values={data} paging={true} />
          </div>
        </div>
      <div className="deptDetailContainer" style={deptEmpRightContainerStyle}>
          <div className="deptHnfListTable" style={deptDetailStyle}>
              <p><strong>* 직원 목록 및 발령 </strong></p>
            <CustomLabelValue props={labelValue.empno} onSelect={handleChgState}  value={deptAptParam.empno} readOnly={true}/>
            <CustomLabelValue props={labelValue.empFlnm} onSelect={handleChgState} value={deptAptParam.empFlnm} readOnly={true}/>
            <CustomLabelValue props={labelValue.jbpsCd} onSelect={handleChgState} value={deptAptParam.jbpsCd} readOnly={true}/>
            <CustomLabelValue props={labelValue.jbttlCd} onSelect={handleChgState} value={deptAptParam.jbttlCd}/>
            {deptAptParam.empId != null ? (
              <div className="buttonContainer" style={buttonContainerStyle}>
                <Button style={editButtonStyle} onClick={deptapt} text="발령" />
              </div>
            ) : null}
            <CustomTable keyColumn={emplistKeyColumn} columns={emplistTableColumns} values={values} paging={true} onRowClick={onRowClick}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeptManagePop;
