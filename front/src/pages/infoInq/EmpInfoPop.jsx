import React, { useState, useEffect , useRef} from "react";
import EmpInfoJson from "./EmpInfoJson.json";
import ApiRequest from "utils/ApiRequest";
import { useCookies } from "react-cookie";
import CustomEditTable from "components/unit/CustomEditTable";
import { Button } from "devextreme-react";
import ReactToPrint from "react-to-print";

const EmpInfoPop = ({ naviEmpId }) => {
  const { queryId, keyColumn, tableColumns, tbNm } = EmpInfoJson.EmpDegree;
  const [cookies] = useCookies(["userInfo", "userAuth"]);
  const [values, setValues] = useState([]);

  let userEmpId;

  // if(naviEmpId.length !== 0){
  //   userEmpId = naviEmpId;
  // } else {
  //   userEmpId = cookies.userInfo.empId;
  // }

  const doublePk = { nm: "empId", val: userEmpId };



  useEffect(() => {
    pageHandle();
  }, []);

  const pageHandle = async () => {
    try {
      const response = await ApiRequest("/boot/common/queryIdSearch", {
        queryId: queryId, empId: userEmpId
      });
      if(response.length !== 0) setValues(response);
    } catch (error) {
      console.log(error);
    }
  };
  const infoPrint = () => {
    const printYn = window.confirm("직원정보를 출력 하시겠습니까?");
    if(printYn){
      window.print();
    }
   
  };
const componentRef = useRef();
  return (
    <div ref ={componentRef} style={{ padding: "20px" ,backgroundColor: "#b5c1c7" }}>
    <div className="container" style={{ padding: "20px" ,backgroundColor: "#fff" }}>
      <div className="title p-1" style={{ marginTop: "20px", marginBottom: "10px" }}>
        <h1 style={{ fontSize: "40px" }}>학력</h1>
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
      {/* <Button type="default" onClick={infoPrint}> 출력 테스트</Button> */}
      <ReactToPrint 
		trigger={() => <button type3="true">인쇄</button>} 
		content={() => componentRef.current} 
        pageStyle="@page { size: A4; ratio:60%; }" 
	/>
    </div>
 
    </div>
  
  );
};
export default EmpInfoPop;