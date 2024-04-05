import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import  EmpListJson from "../infoInq/EmpListJson.json";
import ApiRequest from "../../utils/ApiRequest";
import SearchEmpSet from "components/composite/SearchInfoSet";
import CustomTable from "components/unit/CustomTable";

function EmpList() {
  const [values, setValues] = useState([]);
  const [param, setParam] = useState({});

  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const { keyColumn, queryId, tableColumns, popup, searchInfo } = EmpListJson;

  useEffect(() => {
    if (!Object.values(param).every((value) => value === "")) {
      pageHandle();
    }
  }, [param]);

  // 검색으로 조회할 때
  const searchHandle = async (initParam) => {
    setParam({
      ...initParam,
      queryId: queryId,
    });
  };

  const pageHandle = async () => {
    try {
      const response = await ApiRequest("/boot/common/queryIdSearch", param);
      setValues(response);
      if (response.length !== 0) {
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">
      <div
        className="title p-1"
        style={{ marginTop: "20px", marginBottom: "10px" }}
      >
        <h1 style={{ fontSize: "40px" }}>직원 조회</h1>
      </div>
      <div className="col-md-10 mx-auto" style={{ marginBottom: "10px" }}>
        <span>* 직원을 조회합니다.</span>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <SearchEmpSet
          callBack={searchHandle}
          props={searchInfo}
          popup={popup}
        />
      </div>

      <div>검색된 건 수 : {totalItems} 건</div>
      <CustomTable
        keyColumn={keyColumn}
        pageSize={pageSize}
        columns={tableColumns}
        values={values}
        paging={true}
        wordWrap={true}
      />
    </div>
  );
};

export default EmpList;