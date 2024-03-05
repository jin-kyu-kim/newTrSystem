import { useState, useEffect, useCallback } from "react";
import ApiRequest from "utils/ApiRequest";
import { Button } from "devextreme-react";
import CustomTable from "components/unit/CustomTable";
import EmpManageJson from  "./EmpManageJson.json";
import CustomLabelValue from "components/unit/CustomLabelValue";
import SearchHumanResoureceMngSet from "components/composite/SearchEmpSet";
import EmpRegist from "./EmpRegist";
import Customf from "components/unit/CustomPopup";
import CustomComboBox from "../../components/unit/CustomComboBox";

const EmpManage = ({callBack}) => {
  const [values, setValues] = useState([]);
  const [values2, setValues2] = useState([]);
  const [values3, setValues3] = useState([]);
  const [param, setParam] = useState({});
  const { listQueryId, searchParams, listKeyColumn, listTableColumns,       //직원목록조회 
          ejhQueryId, ejhKeyColumn, ejhTableColumns,labelValue,            //직원발령정보목록,발령용컴포넌트
        } = EmpManageJson; 

  const [readOnly, setReadOnly] = useState(true);
  const [empParam2, setEmpParam2] = useState({}); //발령정보 넣어보낼거
  const [empParam3, setEmpParam3] = useState({}); //발령정보 받아올거
  const [empInfo, setEmpInfo] = useState([]);       //클릭시 직원 기초정보 가지고올것

  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [hnfPageSize, setHnfPageSize] = useState(20);

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

  //======================발령정보 콤보박스 선택 변경시
  const handleChgState = ({ name, value }) => {
    console.log("네임 " , name,"벨류",value);
      setEmpParam2({
        ...empParam2,
        [name]: value,
      });
    
  };
 //========================발령정보 입력 (수정예정)
  const deptDownListHandle = async () => {
    try {
      const response2 = await ApiRequest(
        "/boot/common/queryIdSearch",
        empParam2
      );
      setValues2(response2);
    } catch (error) {
      console.log(error);
    }
  };

   //========================발령정보 목록 (수정중)
  const empJbpsHistHandle = async () => {
    try {
      const response3 = await ApiRequest(
        "/boot/common/queryIdSearch",
        empParam3
      );
      setValues3(response3);
    } catch (error) {
      console.log(error);
    }
  };
  //===========================발령정보 저장
  const onClickHst = () => {
    if(empInfo.empno === undefined && empInfo.empno === "" ){
      const isconfirm = window.confirm("발령정보를 입력할 직원을 선택하십시요");
      return; 
    }
    else{
    const isconfirm = window.confirm("발령정보를 저장 하시겠습니까?"); 
    if (isconfirm) {
        //insertDept();
    } else{
      return;
     }
    }
  };

  //============================직원목록에서 로우 클릭시 발생하는 이벤트
  const onRowDblClick = (e) => {
    for (const value of values) {
      if (value.empno === e.data.empno) {
        setEmpInfo(value);
        console.log("데이터 세팅함1", value)
        break;
      }
    }
    
    setEmpParam2({ //발령정보 넣을때 쓸 예졍
      deptId: e.data.empno,
    });
    setEmpParam3({
      empno: e.data.empno,
      queryId: ejhQueryId,
    });
  };
  useEffect(() => {
    if (empInfo.empno !== undefined && empInfo.empno !== "") {
        setReadOnly(false);
    }else {
      setReadOnly(true);
    }
    setEmpParam2({

    })
  }, [empInfo.empno]);

  //==============================setParam 이후에 함수가 실행되도록 하는 useEffect  
  useEffect(() => {
    if (empParam2.empno !== undefined) {
      deptDownListHandle();
    }
  }, [empParam2]);

  useEffect(() => {
    if (empParam3.empno !== undefined) {
      empJbpsHistHandle();
    }
  }, [empParam3]);
  

  //=================================화면 그리는 부분 
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
          <p> <strong>* 기초정보 </strong> </p>
          <span style={{ fontSize: 12 }}>
          신규 직원정보를 입력하면 TRS 접속 권한이 생기게 됩니다.<br/>
          신규 직원 사번은 자동 입력됩니다.
          </span>
          <EmpRegist empInfo={empInfo} deptId={empInfo.empno} isNew={false} />
        </div>
        <div className="empDownListTable" style={empDetailStyle}>
            <p> <strong>* 발령정보 </strong> </p>
            <span style={{ fontSize: 12 }}>
            신규 직원정보를 입력하면 TRS 접속 권한이 생기게 됩니다.<br/>
            신규 직원 사번은 자동 입력됩니다.
            </span>
            <CustomLabelValue props={labelValue.deptGnfdYr} onSelect={handleChgState} value={empParam2.deptGnfdYr} readOnly={readOnly}/>
            <CustomLabelValue props={labelValue.deptGnfdMd} onSelect={handleChgState} value={empParam2.deptGnfdMd} readOnly={readOnly}/>
            <CustomLabelValue props={labelValue.jbpsCd} onSelect={handleChgState} value={empParam2.jbpsCd} readOnly={readOnly}/>
        <div className="buttonContainer" style={buttonContainerStyle}>
            <Button style={buttonStyle} onClick={onClickHst}>발령저장</Button>
        </div>    
        </div>
        <div className="empHnfListTable" style={empDetailStyle}>
          <CustomTable
            keyColumn={ejhKeyColumn}
            pageSize={hnfPageSize}
            columns={ejhTableColumns}
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
