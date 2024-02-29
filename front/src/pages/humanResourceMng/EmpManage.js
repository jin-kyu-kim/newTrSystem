import { useState, useEffect, useCallback } from "react";
import ApiRequest from "utils/ApiRequest";
import { Button } from "devextreme-react";
import CustomTable from "components/unit/CustomTable";
import EmpManageJson from  "./EmpManageJson.json";
import CustomLabelValue from "components/unit/CustomLabelValue";
import SearchHumanResoureceMngSet from "components/composite/SearchEmpSet";
import EmpRegist from "./EmpRegist";
import Customf from "components/unit/CustomPopup";


const EmpManage = ({callBack}) => {
  const [values, setValues] = useState([]);
  const [values2, setValues2] = useState([]);
  const [values3, setValues3] = useState([]);
  const [param, setParam] = useState({});
  const { listQueryId, searchParams, listKeyColumn, listTableColumns,       //직원목록조회 
          downDeptQueryId, downDeptTableColumns,                            //하위부서목록
          hnfQueryId, hnfKeyColumn, hafTableColumns,labelValue,                        //직원발령정보목록,발령용컴포넌트
          popup } = EmpManageJson; 
  const [deptParam2, setDeptParam2] = useState({});
  const [deptParam3, setDeptParam3] = useState({});

  const [deptInfo, setDeptInfo] = useState([]);
  const [isPopup, setPopup] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [initParam, setInitParam] = useState({});

  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [hnfPageSize, setHnfPageSize] = useState(20);
  const [downDeptPageSize, setDownDeptPageSize] = useState(20);

  // const [readOnly, setReadOnly] = useState(true);

  //========================테이블 배치

  //화면 전체 배치
  const tableContainerStyle = {
    display: "flex",
  };

  //전체 부서 목록 배치
  const empListContainerStyle = {
    width: "45%", // 왼쪽 영역의 너비를 반으로 설정
    marginTop: "20px",
  };

  const empListStyle = {
    minWidth: "480px",
  };

  //우측 전체 배치
  const empDetailContainerStyle = {
    width: "55%", // 오른쪽 영역의 너비를 반으로 설정
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
  const buttonStyle = {
    marginLeft: "10px",
  };

  //========================직원 목록 조회
  useEffect(() => {
    if (!Object.values(param).every((value) => value === "")) {
      pageHandle();
    }
  }, [param]);

  const searchHandle = async (initParam) => {
    setTotalPages(1);
    setCurrentPage(1);
    setParam({
      ...initParam,
      queryId: listQueryId,
      currentPage: currentPage,
      startVal: 0,
      pageSize: pageSize,
    });
  };

  const pageHandle = async () => {
    try {
      const response = await ApiRequest("/boot/common/queryIdSearch", param);
      setValues(response);
      if (response.length !== 0) {
        console.log("건수: " + totalItems);
        setTotalPages(Math.ceil(response[0].totalItems / pageSize));
        setTotalItems(response[0].totalItems);
      } else {
        setTotalItems(0);
        setTotalPages(1);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //========================부서 상세 정보

  // useEffect(() => {
  //   callBack(initParam);
  // }, []);

  //부서 정보 수정 
  const editDept = () => {
    setPopup(true);
  };

  const handleClose = () => {
    setPopupVisible(false);
  };

  const onHide = () => {
    callBack(initParam);
    setPopupVisible(false);
  }
  
  //부서 삭제
  const deleteDept = async () => {
    const isconfirm = window.confirm("이 부서를 삭제하시겠습니까?");

    if (isconfirm) {
      console.log("부서 삭제 : " + deptInfo.deptId);
      // if (response > 0) {
        setDeptInfo([]);
      // }
    }
    
  };


 //========================발령정보 입력 (수정예정)

 
  const deptDownListHandle = async () => {
    try {
      const response2 = await ApiRequest(
        "/boot/common/queryIdSearch",
        deptParam2
      );
      setValues2(response2);
    } catch (error) {
      console.log(error);
    }
  };

   //========================발령정보 목록 (수정예정)
  const deptHnfListHandle = async () => {
    try {
      const response3 = await ApiRequest(
        "/boot/common/queryIdSearch",
        deptParam3
      );
      setValues3(response3);
    } catch (error) {
      console.log(error);
    }
  };


  //부서목록에서 로우 클릭시 발생하는 이벤트
  const onRowDblClick = (e) => {
    console.log("클릭이벤트 들어옴e 데이터값",e)
    for (const value of values) {
      if (value.empno === e.data.empno) {
        setDeptInfo(value);
        console.log("데이터 세팅함1", value)
        break;
      }
    }

    setDeptParam2({
      deptId: e.data.empno,
      queryId: downDeptQueryId,
    });
    console.log("데이터 세팅함1-1", deptInfo.empno)
    setDeptParam3({
      deptId: e.data.empno,
      queryId: hnfQueryId,
    });
    console.log("데이터 세팅함2", deptParam2)
    console.log("데이터 세팅함3", deptParam3)
  };

  //setParam 이후에 함수가 실행되도록 하는 useEffect  
  useEffect(() => {
    if (deptParam2.empno !== undefined) {
      deptDownListHandle();
    }
  }, [deptParam2]);

  useEffect(() => {
    if (deptParam3.empno !== undefined) {
      deptHnfListHandle();
    }
  }, [deptParam3]);
  
  return (
    <div className="container">
      <div
        className="title p-1"
        style={{ marginTop: "20px", marginBottom: "10px" }}
      >
        <h1 style={{ fontSize: "40px" }}>직원 관리</h1>
      </div>
      <div className="col-md-10 mx-auto" style={{ marginBottom: "10px" }}>
        <span>* 직원 정보를 조회합니다.</span>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <SearchHumanResoureceMngSet
          callBack={searchHandle}
          props={searchParams}
          popup={popup}
        />
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
              pageSize={pageSize}
              columns={listTableColumns}
              values={values}
              paging={true}
              onRowDblClick={onRowDblClick}
            />
          </div>
        </div>
        <div className="empDetailContainer" style={empDetailContainerStyle}>
          <div className="empDetailTable" style={empDetailStyle}>
            <p>
            <strong>* 기초정보 </strong>
            </p>
            <span style={{ fontSize: 12 }}>
            신규 직원정보를 입력하면 TRS 접속 권한이 생기게 됩니다.<br/>
            신규 직원 사번은 자동 입력됩니다.
            </span>
          <div className="detailButtonContainer" style={buttonContainerStyle}>            
            {deptInfo.deptId != null ? (
              <div className="buttonContainer" style={buttonContainerStyle}>
                <Button style={editButtonStyle} onClick={editDept} text="수정" />
                <Button style={deleteButtonStyle} onClick={deleteDept} text="삭제" />
              </div>
            ) : null}
            </div>
            <EmpRegist 
              deptInfo={deptInfo} 
              deptId={deptInfo.empno}
              isNew={false}
            />
          </div>
          <div className="empDownListTable" style={empDetailStyle}>
            <p>
              <strong>* 발령정보 </strong>
            </p>
            <span style={{ fontSize: 12 }}>
            신규 직원정보를 입력하면 TRS 접속 권한이 생기게 됩니다.<br/>
            신규 직원 사번은 자동 입력됩니다.
            </span>
            
            <CustomLabelValue
              props={labelValue.deptGnfdYr}
              onSelect={editDept}
              value={labelValue.deptGnfdYr}
            />
            <CustomLabelValue
              props={labelValue.deptGnfdMd}
              onSelect={editDept}
              value={labelValue.deptGnfdMd}            
            />
            <CustomLabelValue
              props={labelValue.jbpsCd}
              onSelect={editDept}
              value={labelValue.jbpsCd}
            />
             <div className="buttonContainer" style={buttonContainerStyle}>
             <Button style={buttonStyle}>발령저장</Button>
            </div>    
          </div>
          <div className="empHnfListTable" style={empDetailStyle}>
            <div className="empHnfButtonContainer" style={buttonContainerStyle}>           
            {deptInfo.deptId != null ? (
                <Button style={addButtonStyle} text="관리" />
            ) : null}
            </div>
            <CustomTable
              keyColumn={hnfKeyColumn}
              pageSize={hnfPageSize}
              columns={hafTableColumns}
              values={values3}
              paging={true}
            />
          </div>     
        </div>
      </div>
    </div>
  );
};

export default EmpManage;
