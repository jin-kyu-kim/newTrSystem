import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import  EmpTRCostTotalJson from "./EmpTRCostTotalJson.json";
import ApiRequest from "../../utils/ApiRequest";
import CustomTable from "components/unit/CustomTable";
import SearchPrjctCostSet from "../../components/composite/SearchPrjctCostSet";

const EmpTRCostTotal = () => {
    const [values, setValues] = useState([]);
    const [param, setParam] = useState({});
  
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    const { keyColumn, queryId, tableColumns, searchParams } = EmpTRCostTotalJson;

  return (


    <div className="container">
    <div
      className="title p-1"
      style={{ marginTop: "20px", marginBottom: "10px" }}
    >
      <h1 style={{ fontSize: "40px" }}>근무시간,경비 통합조회</h1>
    </div>
    <div className="col-md-10 mx-auto" style={{ marginBottom: "10px" }}>
      <span>* 근무시간, 경비 통합내역을 조회합니다.</span>
    </div>

    <div>
    <div style={{ marginBottom: "20px" }}>
      {/* <SearchPrjctCostSet callBack={searchHandle} props={searchParams} /> */}
      </div>

      <CustomTable
        keyColumn={keyColumn}
        pageSize={pageSize}
        columns={tableColumns}
        values={values}
        paging={true}
      />
 
        </div>
</div>
  );
};

export default EmpTRCostTotal;
