import React, { useState, useEffect } from "react";
import EmpInfoJson from "./EmpInfoJson.json";
import ApiRequest from "utils/ApiRequest";
import CustomEditTable from "components/unit/CustomEditTable";

const EmpDegree = ({ naviEmpId }) => {
  const { queryId, keyColumn, tableColumns, tbNm } = EmpInfoJson.EmpDegree;
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const userEmpId = naviEmpId.length !== 0 ? naviEmpId : userInfo.empId;
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
    <div style={{ padding: "20px" }}>
      <div className="container">
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
    </div>
  );
};
export default EmpDegree;