import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import CustomTable from "components/unit/CustomTable";
import EmpInfoJson from "./EmpInfoJson.json";
import TextBox from "devextreme-react/text-box";
import Box, { Item } from "devextreme-react/box";
import { Button } from "devextreme-react/button";
import ApiRequest from "utils/ApiRequest";
import { DateBox } from "devextreme-react";
import { useCookies } from "react-cookie";
import CustomEditTable from "components/unit/CustomEditTable";

const EmpLicense = () => {
  const [param, setParam] = useState({});
  const [tableKey, setTableKey] = useState(0);
  const { queryId,keyColumn, tableColumns, tbNm } = EmpInfoJson.EmpLicense;
  const [values, setValues] = useState([]);

  const [cookies] = useCookies(["userInfo", "userAuth"]);
  const date = new Date();
  const userEmpId = cookies.userInfo.empId;
  const doublePk = {nm: "empId", val: userEmpId};
  const [data, setData] = useState({
    empId: userEmpId,
    regEmpId: userEmpId,
    regDt: date.toISOString().split("T")[0] + " " + date.toTimeString().split(" ")[0],
  });

  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    pageHandle();
  setParam({
    ...param,
    queryId: queryId,
    empId : userEmpId,
  });
}, []);

useEffect(() => {
   
  getSn();
}, [param, isSuccess]);


  const getSn = async () => {
    const selectParams = {
      queryId: "infoInqMapper.selectLcnsSn",
      empId: data.empId
    };
  
    try {
      const response = await ApiRequest("/boot/common/queryIdSearch", selectParams);
      setData(() => ({
        ...data,
        qlfcLcnsSn: response[0].qlfcLcnsSn
      }));
  
    } catch (error) {
      console.log(error);
    }
  }

const pageHandle = async () => {
  try {
    const response =  await ApiRequest("/boot/common/queryIdSearch", param);
    setValues(response);
    if (response.length !== 0) {
    } else {
    }
  } catch (error) {
    console.log(error);
  }
};

useEffect(()=>{
  if (!Object.values(param).every((value) => value === "")) {
    pageHandle();
  }
 
},[param.empId,tableKey]);

  return (
    <div className="container" style={{ height: "100%" }}>
      <div className="title p-1" style={{ marginTop: "20px", marginBottom: "10px" }}>
        <h1 style={{ fontSize: "40px" }}>자격 면허</h1>
      </div>
      <div style={{ marginBottom: "20px" }}>
      <CustomEditTable
                    keyColumn={keyColumn}
                    columns={tableColumns}
                    values={values}
                    tbNm={tbNm}
                    doublePk={doublePk}
                    getKeyCol={data.qlfcLcnsSn}
                />
      </div>
     
    </div>
  );
};

export default EmpLicense;