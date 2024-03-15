import React, { useState , useEffect} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import EmpInfoJson from "./EmpInfoJson.json";
import ApiRequest from "utils/ApiRequest";
import { useCookies } from "react-cookie";
import CustomEditTable from "components/unit/CustomEditTable";

const EmpEduHist = ({  }) => {

  const [param, setParam] = useState({});

  const {queryId, keyColumn, tableColumns, tbNm } = EmpInfoJson.EmpEduHist;
  const [values, setValues] = useState([]);
  const [tableKey, setTableKey] = useState(0);
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
     getSn();
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
    queryId: "infoInqMapper.selectEduSn",
    empId: data.empId
  };

  try {
    const response = await ApiRequest("/boot/common/queryIdSearch", selectParams);
    setData(() => ({
      ...data,
      eduSn: response[0].eduSn
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
      setIsSuccess(!isSuccess);
    } else {
    }
  } catch (error) {
    console.log(error);
  }
};

useEffect(()=>{
    pageHandle();
 
},[param.empId,tableKey]);

  return (
    <div className="container" style={{ height: "700px" }}>
      <div className="title p-1" style={{ marginTop: "20px", marginBottom: "10px" }}>
        <h1 style={{ fontSize: "40px" }}>교육이력</h1>
      </div>
      <div style={{ marginBottom: "20px" }}>
      <CustomEditTable
                    keyColumn={keyColumn}
                    columns={tableColumns}
                    values={values}
                    tbNm={tbNm}
                    doublePk={doublePk}
                    getKeyCol={data.eduSn}
                />
      </div>
       
      
    </div>
  );
};

export default EmpEduHist;