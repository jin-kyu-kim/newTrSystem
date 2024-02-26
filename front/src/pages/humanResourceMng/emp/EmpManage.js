import { useState, useEffect, useCallback } from "react";
import ApiRequest from "../../../utils/ApiRequest";
import CustomTable from "../../../components/unit/CustomTable";
import EmpListJson from "../emp/EmpListJson.json";
import DeptDownListJson from "../dept/DeptDownListJson.json";
import DeptHnfListJson from "../dept/DeptHnfListJson.json";
import DeptDetailJson from "../dept/DeptDetailJson.json";
import SearchDeptSet from "components/composite/SearchDeptSet";
import CustomLabelValue from "components/unit/CustomLabelValue";
import { Button } from "devextreme-react";

const DeptManage = () => {
  const [values, setValues] = useState([]);
  const [values2, setValues2] = useState([]);
  const [values3, setValues3] = useState([]);
  const [param, setParam] = useState({});

  const { keyColumn, queryId, tableColumns, searchParams, popup } = EmpListJson;
  const { labelValue } = DeptDetailJson;
  const { keyColumn2, queryId2, tableColumns2 } = DeptDownListJson;
  const { keyColumn3, queryId3, tableColumns3 } = DeptHnfListJson;
  const [deptParam2, setDeptParam2] = useState({});
  const [deptParam3, setDeptParam3] = useState({});

  const [deptInfo, setDeptInfo] = useState([]);
  const [data, setData] = useState([]);

  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [hnfPageSize, setHnfPageSize] = useState(20);
  const [downDeptPageSize, setDownDeptPageSize] = useState(20);

  const [readOnly, setReadOnly] = useState(false);

  //========================테이블 배치
  const tableContainerStyle = {
    display: "flex",
  };
  const deptListContainerStyle = {
    width: "40%", // 왼쪽 영역의 너비를 설정
    marginTop: "20px",
  };

  const deptListStyle = {
    minWidth: "480px",
  };
  const deptDetailContainerStyle = {
    width: "60%", // 오른쪽 영역의 너비를 설정
    display: "flex",
    flexDirection: "column",
  };

  const deptDetailStyle = {
    flex: "1",
    marginLeft: "20px", // 각 div 사이의 간격을 조절합니다.
    marginTop: "20px",
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

  //========================부서 상세 정보

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

  const onRowDblClick = (e) => {
    for (const value of values) {
      if (value.deptId === e.data.deptId) {
        setDeptInfo(value);
        console.log(value);
        break;
      }
    }

    setDeptParam2({
      deptId: e.data.deptId,
      queryId: queryId2,
    });
    deptDownListHandle();

    setDeptParam3({
      deptId: e.data.deptId,
      queryId: queryId3,
    });
    deptHnfListHandle();
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
        <SearchDeptSet
          callBack={searchHandle}
          props={searchParams}
          popup={popup}
        />
      </div>
      <div>검색된 건 수 : {totalItems} 건</div>

      <div className="tableContainer" style={tableContainerStyle}>
        <div className="deptListContainer" style={deptListContainerStyle}>
          <div className="deptListTable" style={deptListStyle}>
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
        <div className="deptDetailContainer" style={deptDetailContainerStyle}>
          <div className="deptDetailTable" style={deptDetailStyle}>
            <p>
              <strong>* 기초정보 </strong>
            </p>
            <span style={{ fontSize: 12 }}>
            신규 직원정보를 입력하면 TRS 접속 권한이 생기게 됩니다.<br/>
            신규 직원 사번은 자동 입력됩니다.
            </span>
            <CustomLabelValue
              props={labelValue.deptNm}
              onSelect={handleChgState}
              value={deptInfo.deptNm}
              readOnly={readOnly}
            />
            <CustomLabelValue
              props={labelValue.upDeptNm}
              onSelect={handleChgState}
              value={deptInfo.upDeptNm}
              readOnly={readOnly}
            />
            <CustomLabelValue
              props={labelValue.deptMngrEmpFlnm}
              onSelect={handleChgState}
              value={deptInfo.deptMngrEmpFlnm}
              readOnly={true}
            />
            <CustomLabelValue
              props={labelValue.deptBgngYmd}
              onSelect={handleChgState}
              value={deptInfo.deptBgngYmd}
              readOnly={readOnly}
            />
            <CustomLabelValue
              props={labelValue.deptEndYmd}
              onSelect={handleChgState}
              value={deptInfo.deptEndYmd}
              readOnly={readOnly}
            />
            <div className="buttonContainer" style={buttonContainerStyle}>
              <Button style={buttonStyle}>직원신규입력</Button>
              <Button style={buttonStyle}>기초정보 저장</Button>
            </div>
          </div>
          <div className="deptDownListTable" style={deptDetailStyle}>
            <p>
              <strong>* 발령정보 </strong>
            </p>
            <span style={{ fontSize: 12 }}>
            주의!! 직위발령을 입력하지 않거나 잘못 입력 할 경우 '프로젝트관리'메뉴에 실행원가 집행현황 자사인력 누적<br/>
            사용금액이 제대로 계산되지 않습니다.
            </span>
            <CustomTable
              keyColumn={keyColumn2}
              pageSize={downDeptPageSize}
              columns={tableColumns2}
              values={values2}
              paging={true}
              style={deptTableStyle}
            />
          </div>
          <div className="deptHnfListTable" style={deptDetailStyle}>
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

export default DeptManage;
