import { useState, useEffect, useCallback } from "react";
import ApiRequest from "../../utils/ApiRequest";
import CustomTable from "../../components/unit/CustomTable";
import EmpManageJson from "./EmpManageJson.json";
import EmpManageDetailJson from "./EmpManageDetailJson.json";
import EmpDeptHnfListJson from "./EmpDeptHnfListJson.json";
import EmpDetailJson from "./EmpDetailJson.json";
import SearchHumanResoureceMngSet from "components/composite/SearchHumanResoureceMngSet";
import CustomLabelValue from "components/unit/CustomLabelValue";
import CustomCdComboBox from "components/unit/CustomCdComboBox";
import { Button } from "devextreme-react";

const EmpManage = () => {
  const [values, setValues] = useState([]);
  const [values2, setValues2] = useState([]);
  const [values3, setValues3] = useState([]);
  const [param, setParam] = useState({});

  const { keyColumn, queryId, tableColumns, searchParams } = EmpManageJson;
  const { labelValue } = EmpDetailJson;
  const { keyColumn2, queryId2, tableColumns2 } = EmpManageDetailJson;
  const { keyColumn3, queryId3, tableColumns3 } = EmpDeptHnfListJson;
  const [empParam2, setEmpParam2] = useState({});
  const [empParam3, setEmparam3] = useState({});

  const [empInfo, setEmpInfo] = useState([]);
  const [data, setData] = useState([]);

  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [hnfPageSize, setHnfPageSize] = useState(20);
  const [downDeptPageSize, setDownDeptPageSize] = useState(20);
  const [text, setText] = useState("");

  const [readOnly, setReadOnly] = useState(false);
  //========================테이블 배치
  const tableContainerStyle = {
    display: "flex",
  };
  const empListContainerStyle = {
    width: "45%", // 왼쪽 영역의 너비를 설정
    marginTop: "20px",
  };

  const empListStyle = {
    minWidth: "480px",
  };
  const empDetailContainerStyle = {
    width: "55%", // 오른쪽 영역의 너비를 설정
    display: "flex",
    flexDirection: "column",
  };

  const empDetailStyle = {
    flex: "1",
    marginLeft: "20px", // 각 div 사이의 간격을 조절합니다.
    marginTop: "20px",
  };
  const empDetailLeft = {
    width: "50%", // 기초정보의 왼쪽 영역의 너비를 설정
    float : "left",
    marginTop: "30px",
  };
  const empDetailRight = {
    width: "50%", //  기초정보의 오른쪽 영역의 너비를 설정
    display: "flex",
    flexDirection: "column",
    
  };
  const buttonContainerStyle = {
    display: "flex",
    justifyContent: "flex-end",
  };

  const buttonStyle = {
    marginLeft: "10px",
  };

  const deptTableStyle = {
    marginBottom: "30px",
  };

  //========================직원 목록 조회
  useEffect(() => {
    console.log("이거찍혀요 :ㅣ???" ,EmpManageJson);

  }, []);
 
  //========================직원 목록 조회
  useEffect(() => {
    console.log("직원목록조회용aa:  ", EmpManageJson)
    if (!Object.values(param).every((value) => value === "")) {
      pageHandle();
    }
  }, [param]);

  const searchHandle = async (initParam) => {
    setTotalPages(1);
    setCurrentPage(1);
    setParam({
      ...initParam,
      queryId: queryId,
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

  //========================직원 기초 정보

  const readOnlyChg = () => {
    if (readOnly) {
      setReadOnly(false);
    } else {
      setReadOnly(true);
    }
  };

  const handleChgState = ({ name, value }) => {
    if (!readOnly) {
      setData({
        ...data,
        [name]: value,
      });
    }
  };

  const empDetailListHandle = async () => {
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

  const empHnfListHandle = async () => {
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

  const onRowDblClick = (e) => {
    for (const value of values) {
      if (value.empno === e.data.empno) {
        setEmpInfo(value);
        console.log("더블클릭시 데이터 : " ,value);
        break;
      }
    }

    setEmpParam2({
      empno: e.data.empno,
      queryId: queryId2,
    });
    empDetailListHandle();

    setEmparam3({
      deptId: e.data.empno,
      queryId: queryId3,
    });
    empHnfListHandle();
  };
  const onReset = (e) => {
    setText("");
  };

  
  return (
    <div className="container">
      <div
        className="title p-1"
        style={{ marginTop: "20px", marginBottom: "10px" }}
      >
        <h1 style={{ fontSize: "40px" }}>직원 관리</h1>
      </div>
    
      <div style={{ marginBottom: "20px" }}>
        <SearchHumanResoureceMngSet
          callBack={searchHandle}
          props={searchParams}
          
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
              keyColumn={keyColumn}
              pageSize={pageSize}
              columns={tableColumns}
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
            <div className="empDetailLeft" style={empDetailLeft}>
            <CustomLabelValue
            props={labelValue.empFlnm}
            onSelect={handleChgState}
            value={empInfo.empFlnm}
            readOnly={readOnly}
            />            
            <CustomLabelValue
            props={labelValue.deptMngrEmpFlnm}
            onSelect={handleChgState}
            value={empInfo.deptMngrEmpFlnm}
            readOnly={readOnly}
            />
            <CustomLabelValue
              props={labelValue.telNo}
              onSelect={handleChgState}
              value={empInfo.telNo}
              readOnly={readOnly}
            />
            <CustomLabelValue
            props={labelValue.bankCd}
            onSelect={handleChgState}
            value={empInfo.bankCd}
            readOnly={readOnly}
            />              
              
          </div>

          <div className="empDetailRight" style={empDetailRight}>
            <CustomLabelValue
              props={labelValue.JbpsCd}
              onSelect={handleChgState}
              value={empInfo.JbpsCd}
              readOnly={readOnly}
              />
              <CustomLabelValue
              props={labelValue.hdofSttsCd}
              onSelect={handleChgState}
              value={empInfo.hdofSttsCd}
              readOnly={readOnly}
              />                         
             <CustomLabelValue
              props={labelValue.eml}
              onSelect={handleChgState}
              value={empInfo.eml}
              readOnly={readOnly}
            />                
             <CustomLabelValue
             props={labelValue.actNo}
            onSelect={handleChgState}
            value={empInfo.actNo}
            readOnly={readOnly}
              />
           </div>
            

            <div className="buttonContainer" style={buttonContainerStyle}>
              <Button style={buttonStyle} onClick={onReset}> 직원신규입력</Button>
              <Button style={buttonStyle}>기초정보 저장</Button>
            </div>
          </div>
          <div className="empDownListTable" style={empDetailStyle}>
            <p>
              <strong>* 발령정보 </strong>
            </p>
            <span style={{ fontSize: 12 }}>
            주의!! 직위발령을 입력하지 않거나 잘못 입력 할 경우 '프로젝트관리'메뉴에 실행원가 집행현황 자사인력 누적<br/>
            사용금액이 제대로 계산되지 않습니다.
            </span>
            <div className="empDetailLeft" style={empDetailLeft}>
            <CustomLabelValue
              props={labelValue.deptGnfdY}
              onSelect={handleChgState}
              value={empInfo.deptGnfdY}
              readOnly={readOnly}
            />
            <CustomLabelValue
              props={labelValue.jbttlCd}
              onSelect={handleChgState}
              value={empInfo.jbttlCd}
              readOnly={readOnly} 
            />
            </div>
            <div className="empDetailRight" style={empDetailRight}>         
            <CustomLabelValue
              props={labelValue.deptGnfdMd}
              onSelect={handleChgState}
              value={empInfo.deptGnfdMd}
              readOnly={readOnly}
            />
             <div className="buttonContainer" style={buttonContainerStyle}>
             <Button style={buttonStyle}>발령저장</Button>
            </div>           
            </div>
          </div>
          <div className="empHnfListTable" style={empDetailStyle}>
            <CustomTable
              keyColumn={keyColumn3}
              pageSize={hnfPageSize}
              columns={tableColumns3}
              values={values3}
              paging={true}
              style={deptTableStyle}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmpManage;
