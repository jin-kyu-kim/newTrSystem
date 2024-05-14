import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import EmpCultHealthCostManagePopJson from "./EmpCultHealthCostManagePopJson.json";
import ApiRequest from "../../utils/ApiRequest";
import CustomEditTable from "../../components/unit/CustomEditTable";

function EmpCultHealthCostManagePop({value, year}) {
  const [values, setValues] = useState([]);
  const [param, setParam] = useState({});

  const { keyColumn, queryId, tableColumns } = EmpCultHealthCostManagePopJson;

  useEffect(() =>{
    setParam({
        ...param, 
       queryId: queryId,
       empId: value?.empId,
       year: year
    })

  }, [value])

  useEffect(() => {
    if (!Object.values(param).every((value) => value === "")) {
      pageHandle();
    }
  }, [param]);
  


  const pageHandle = async () => {
    try {
      const response = await ApiRequest("/boot/common/queryIdSearch", param);
      setValues(response);
    } catch (error) {
      console.error(error);
    }
  };
 
  return (
      <div className="container">
          <h3 style={{fontSize: "20px", marginBottom:"20px"}}>문화체련비 현황 ({value?.empFlnm})</h3>
          <CustomEditTable
              keyColumn={keyColumn}
              columns={tableColumns}
              values={values}
              paging={true}
              noEdit={true}
          />
      </div>
  );
};

export default EmpCultHealthCostManagePop;