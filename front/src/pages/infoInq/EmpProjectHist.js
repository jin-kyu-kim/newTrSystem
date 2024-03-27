import React, { useState, useEffect } from "react";
import EmpInfoJson from "./EmpInfoJson.json";
import ApiRequest from "utils/ApiRequest";
import { useCookies } from "react-cookie";
import CustomEditTable from "components/unit/CustomEditTable";

const EmpProjectHist = () => {
  const { queryId, keyColumn, tableColumns, tbNm } = EmpInfoJson.prjctHist;
  const [cookies] = useCookies(["userInfo", "userAuth"]);
  const userEmpId = cookies.userInfo.empId;
  const doublePk = { nm: "empId", val: userEmpId };
  const [values, setValues] = useState([]);

  useEffect(() => {
    pageHandle();
  }, []);

  const pageHandle = async () => {
    try {
      const response = await ApiRequest("/boot/common/queryIdSearch", {
        queryId: queryId, empId: userEmpId
      });
      if (response.length !== 0) setValues(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">
      <div className="title p-1" style={{ marginTop: "20px", marginBottom: "10px" }}>
        <h1 style={{ fontSize: "40px" }}>프로젝트 이력</h1>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <CustomEditTable
          tbNm={tbNm}
          values={values}
          keyColumn={keyColumn}
          columns={tableColumns}
          doublePk={doublePk}
          callback={pageHandle}
        />
      </div>
    </div>
  );
};
export default EmpProjectHist;