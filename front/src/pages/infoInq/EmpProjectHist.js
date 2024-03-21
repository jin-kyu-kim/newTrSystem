import { useState, useEffect, useCallback } from "react";
import { useCookies } from "react-cookie";
import EmpInfoJson from "./EmpInfoJson.json";
import ApiRequest from "utils/ApiRequest";
import CustomEditTable from "components/unit/CustomEditTable";

const EmpProjectHist = (callBack) => {

  const [param, setParam] = useState({});
  const { queryId, keyColumn, tableColumns, tbNm } = EmpInfoJson.prjctHist;
  const [values, setValues] = useState([]);
  const [cookies] = useCookies(["userInfo", "userAuth"]);
  const date = new Date();
  const userEmpId = cookies.userInfo.empId;
  const [data, setData] = useState({
    empId: userEmpId,
    regEmpId: userEmpId,
    regDt: date.toISOString().split("T")[0] + " " + date.toTimeString().split(" ")[0],
  });
  const doublePk = {nm: "empId", val: userEmpId};

  useEffect(() => {
   
  setParam({
    ...param,
    queryId: queryId,
    empId : userEmpId,
  });
}, []);

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
 
},[param.empId]);
  
    return (
        <div className = "container">
            <div className="title p-1" style={{ marginTop: "20px", marginBottom: "10px" }}>
                <h1 style={{ fontSize: "40px" }}>프로젝트 이력</h1>
            </div>
            <div style = {{ marginBottom: "20px" }}>
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

export default EmpProjectHist;