import React, { useState , useEffect} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import EmpInfoJson from "./EmpInfoJson.json";
import ApiRequest from "utils/ApiRequest";
import { useCookies } from "react-cookie";
import CustomEditTable from "components/unit/CustomEditTable";

const EmpLanguage = ({}) => {
  const [cookies] = useCookies(["userInfo", "userAuth"]);
  const date = new Date();
  const userEmpId = cookies.userInfo.empId;
 const [param, setParam] = useState({});
 const [isSuccess, setIsSuccess] = useState(false);
 const [tableKey, setTableKey] = useState(0);
 const [data, setData] = useState({
  empId: userEmpId,
  regEmpId: userEmpId,
  regDt: date.toISOString().split("T")[0] + " " + date.toTimeString().split(" ")[0],
});

  const doublePk = {nm: "empId", val: userEmpId};
 
  const {queryId, keyColumn, tableColumns, tbNm } = EmpInfoJson.EmpLanguage;
  const [values, setValues] = useState([]);
  useEffect(() => {
      pageHandle();
  setParam({
    ...param,
    queryId: queryId,
    empId : userEmpId,
  });
  console.log(data);
}, []);

useEffect(() => {
  console.log(data);
  getSn();
}, [ isSuccess]);

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

const getSn = async () => {
  const selectParams = {
    queryId: "infoInqMapper.selectFgggSn",
    empId: data.empId
  };

  try {
    const response = await ApiRequest("/boot/common/queryIdSearch", selectParams);
    setData(() => ({
      ...data,
      fgggAbltySn: response[0].fgggAbltySn
    }));


  } catch (error) {
    console.log(error);
  }
}

useEffect(()=>{
 
    pageHandle();
   console.log(data);
 
},[param.empId,tableKey]);

  return (
    <div className="container" style={{ height: "100%" }}>
      <div className="title p-1" style={{ marginTop: "20px", marginBottom: "10px" }}>
        <h1 style={{ fontSize: "40px" }}>외국어 능력</h1>
      </div>
      <div style={{ marginBottom: "20px" }}>
      <CustomEditTable
                    keyColumn={keyColumn}
                    columns={tableColumns}
                    values={values}
                    tbNm={tbNm}
                    doublePk={doublePk}
                />
      </div>
        
        
    </div>
  );
};

export default EmpLanguage;