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
  const [deptAptParam, setDeptAptParam] = useState({});   //발령용 정보
  const [deptHnfParam, setDeptHnfParam] = useState({});   //직책변경 및 삭제용
  const [values, setValues] = useState([]);      //우측 발령할 사원정보 데이터
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
 
//========================초기 부서인력정보 조회=====================================
  useEffect(() => {
    setDeptEmpParam({
     ...deptEmpParam,
     deptId : deptId,
     query : hnfQueryId,
    })
    setDeptAptParam({});
   }, []);

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


//============================부서인력목록 로우 클릭시 발생하는 이벤트======================
  const onHnfRowClick = (e) => {
      if (e.data.empId !== null) {
      setDeptHnfParam(e.data);
      }
  };

//============================직원목록 로우 클릭시 발생하는 이벤트======================
  const onEmpRowClick = (e) => {
      if (e.data.empId !== null) {
        setDeptAptParam(e.data);
      }
  };

//====================인력 직책변경 이벤트=====================================================
  const handleHnfChgState = ({ name, value }) => {
    setDeptHnfParam({
      ...deptHnfParam,
      [name]: value,
    });
  };

//===================직원 목록 및 직책 변경시 이벤트===========================================
  const handleChgState = ({ name, value }) => {
    setDeptAptParam({
      ...deptAptParam,
      [name]: value,
    });
  };  

//============================발령버튼 클릭 이벤트==========================================
  const deptAptInst = () => {
    const isconfirm = window.confirm("발령하시겠습니까?");
    if (isconfirm) {
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
      const InsertHistParam=[ //히스토리 정보
        { tbNm: "DEPT_HNF_HIST", snColumn: "DEPT_HNF_HIST_SN", snSearch: {deptId : deptId, empId : deptAptParam.empId}},
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
      if(InsertParam[1].jbttlCd === null || InsertParam[1].jbttlCd === undefined){
        alert("직책을 선택해주세요");
        return;
      }else{
        if(deptAptParam.jbttlCd === "VTW01001"){
          for(const value of data){
            if(value.jbttlCd === "VTW01001"){
              alert("부서에 부서장은 한명만 발령 가능합니다.");
              return;
            }
          }
        }else{
          for(const value of data){
            if(value.empId === deptAptParam.empId){
              alert("이미 해당 직원이 부서에 존재합니다.");
              return;
            }
          }
        }
        insertDeptEmp(InsertParam,InsertHistParam);
      }
    }  
  };
//===========================부서발령정보 인서트============================================
const insertDeptEmp = async (InsertParam,InsertHistParam) => {
  try {
    const response = await ApiRequest("/boot/common/commonInsert", InsertParam); //발령인서트
    const histResponse = await ApiRequest("/boot/common/commonInsert", InsertHistParam); //발령 히스토리 인서트
      if (response > 0 && histResponse > 0) {
        alert("발령되었습니다.");
        setDeptAptParam({});
        pageHandle();
        callBack(deptEmpParam);
      }
  } catch (error) {
    console.error("Error fetching data", error);
  }
};

//============================직책변경버튼 클릭 이벤트==========================================
  const deptAptUpd = () => {
    console.log("직직직직책",deptHnfParam.jbttlCd)
    if(deptHnfParam.jbttlCd === undefined || deptHnfParam.jbttlCd === null){
      alert("직책을 선택해주세요");
      return;
    }
    const isconfirm = window.confirm("인력의 직책을 변경하시겠습니까?");
    if (isconfirm) {
      const updateParam =[
        { tbNm: "DEPT_HNF" },
        {jbttlCd:deptHnfParam.jbttlCd, mdfcnEmpId : empId, mdfcnDt: now,},
        { deptId: deptId,empId: deptHnfParam.empId}]

      const InsertHistParam=[     //히스토리 정보
        { tbNm: "DEPT_HNF_HIST", snColumn: "DEPT_HNF_HIST_SN", snSearch: {deptId : deptId, empId : deptHnfParam.empId}},
        {
           deptId : deptId,
           empId : deptHnfParam.empId,
           jbttlCd : deptHnfParam.jbttlCd,
           empno : deptHnfParam.empno,
           deptGnfdYmd : gnfdDate,
           regDt : now,
           regEmpId: empId,        
        },
      ]
        if(deptHnfParam.jbttlCd === "VTW01001"){
          for(const value of data){
            if(value.jbttlCd === "VTW01001"){
              alert("부서에 부서장은 한명만 발령 가능합니다.");
              return;
            }
          }
        }
      updateDeptEmp(updateParam,InsertHistParam);
    }  
  };
//===========================인력 직책 변경============================================
const updateDeptEmp = async (updateParam,InsertHistParam) => {
  try {
    const responseDelHnf = await ApiRequest("/boot/common/commonUpdate", updateParam);
    const histResponse = await ApiRequest("/boot/common/commonInsert", InsertHistParam); //발령 히스토리 인서트
    if (responseDelHnf > 0 && histResponse >0) {
      alert("변경되었습니다.");
      setDeptHnfParam({});
      pageHandle();
      callBack(deptEmpParam);    
    }
} catch (error) {
  console.error("Error fetching data", error);
}
};

//============================발령해제버튼 클릭 이벤트===========================================
  const deptAptDel = () => {
    const isconfirm = window.confirm("인력의 부서발령을 해제하시겠습니까?");
    if (isconfirm) {
      const deleteParam =[ { tbNm: "DEPT_HNF" },{ deptId: deptId, empId: deptHnfParam.empId}]
      const histUpdParam =[ //히스토리 발령해제 갱신
      { tbNm: "DEPT_HNF_HIST" },
      {deptGnfdRmvYmd:gnfdDate, mdfcnEmpId : empId, mdfcnDt: now,},
      { deptId: deptId ,empId: deptHnfParam.empId} 
      ] 
      deleteDeptEmp(deleteParam,histUpdParam);
    }  
  };

//===========================부서발령정보 삭제============================================
  const deleteDeptEmp = async (deleteParam,histUpdParam) => {
    try {
      const responseDelHnf = await ApiRequest("/boot/common/commonDelete", deleteParam);
      const responseUpdHnf = await ApiRequest("/boot/common/commonUpdate", histUpdParam);
      if (responseDelHnf > 0 && responseUpdHnf >0) {
        alert("해제되었습니다.");
        setDeptHnfParam({});
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
            <div>
                <p><strong>* 직원 부서발령</strong></p>
               
            </div>
            <CustomTable keyColumn={emplistKeyColumn} columns={emplistTableColumns} values={values} paging={true} onRowClick={onEmpRowClick}/>
          </div>
        </div>
      <div className="deptDetailContainer" style={deptEmpRightContainerStyle}>
          <div className="deptHnfListTable" style={deptDetailStyle}>
              <p><strong>* 부서인력정보 </strong></p>    
            <CustomLabelValue props={labelValue.empno} onSelect={handleChgState}  value={deptAptParam.empno} readOnly={true}/>
            <CustomLabelValue props={labelValue.empFlnm} onSelect={handleChgState} value={deptAptParam.empFlnm} readOnly={true}/>
            <CustomLabelValue props={labelValue.jbpsCd} onSelect={handleChgState} value={deptAptParam.jbpsCd} readOnly={true}/>
            <CustomLabelValue props={labelValue.jbttlCd} onSelect={handleChgState} value={deptAptParam.jbttlCd}/>

            {deptAptParam.empId != null ? (
              <div className="buttonContainer" style={buttonContainerStyle}>
                <Button style={editButtonStyle} onClick={deptAptInst} text="발령" />
              </div>
            ) : null}


            <CustomTable keyColumn={hnfKeyColumn} columns={hafTableColumns} values={data} paging={true} onRowClick={onHnfRowClick}/>

            {deptHnfParam.empId != null ? (
                <div className="buttonContainer" style={buttonContainerStyle}>
                <Button style={editButtonStyle} onClick={deptAptUpd} text="직책변경" />
                <Button style={editButtonStyle} onClick={deptAptDel} text="발령해제" />
                <CustomLabelValue props={labelValue.jbttlCd} onSelect={handleHnfChgState} value={deptHnfParam.jbttlCd}/>
                </div>
                 ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeptManagePop;
