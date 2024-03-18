import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import  EmpTimeAprvListJson from "./EmpTimeAprvListJson.json";
import ApiRequest from "../../utils/ApiRequest";
import CustomTable from "components/unit/CustomTable";
import SearchPrjctCostSet from "../../components/composite/SearchPrjctCostSet";

function EmpTimeAprvList() {
  const [values, setValues] = useState([]);
  const [param, setParam] = useState({});

  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const { keyColumn, queryId, tableColumns, searchParams } = EmpTimeAprvListJson;

  useEffect(() => {
    if (!Object.values(param).every((value) => value === "")) {
      pageHandle();
    }
  }, [param]);

  // 검색으로 조회할 때
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
        setTotalPages(Math.ceil(response[0].totalItems / pageSize));
        setTotalItems(response[0].totalItems);
      } else {
        setTotalPages(1);
        setTotalItems(0);
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
        <h1 style={{ fontSize: "40px" }}>근무시간 승인내역 조회</h1>
      </div>
      <div className="col-md-10 mx-auto" style={{ marginBottom: "10px" }}>
        <span>* 근무시간 승인내역을 조회합니다.</span>
      </div>
      <div style={{ marginBottom: "20px" }}>
      <SearchPrjctCostSet callBack={searchHandle} props={searchParams} />
      </div>

      <CustomTable
        keyColumn={keyColumn}
        pageSize={pageSize}
        columns={tableColumns}
        values={values}
        paging={true}
      />
      
    </div>
  );
};

export default EmpTimeAprvList;