import { useState, useEffect } from "react";
import EmpListJson from "../infoInq/EmpListJson.json";
import ApiRequest from "../../utils/ApiRequest";
import SearchEmpSet from "components/composite/SearchInfoSet";
import CustomTable from "components/unit/CustomTable";

function EmpList() {
  const [ values, setValues ] = useState([]);
  const [ param, setParam ] = useState({});
  const [ totalItems, setTotalItems ] = useState(0);

  const { keyColumn, queryId, tableColumns, popup, searchInfo } = EmpListJson;

  useEffect(() => {
    if (!Object.values(param).every((value) => value === "")) {
      pageHandle();
    }
  }, [param]);

  const searchHandle = async (initParam) => {
    setParam({
      ...initParam,
      queryId: queryId
    });
  };

  const pageHandle = async () => {
    try {
      const response = await ApiRequest("/boot/common/queryIdSearch", param);
      if (response.length !== 0) {
        setValues(response);
        setTotalItems(response[0].totalItems);
      } else {
        setValues([]);
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
        columns={tableColumns}
        values={values}
        wordWrap={true}
        paging={true}
        pageSize={20}
      />
    </div>
  );
};
export default EmpList;