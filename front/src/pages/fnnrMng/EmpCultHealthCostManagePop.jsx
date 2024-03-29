import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import EmpCultHealthCostManagePopJson from "./EmpCultHealthCostManagePopJson.json";
import ApiRequest from "../../utils/ApiRequest";
import SearchEmpSet from "components/composite/SearchInfoSet";
import CustomTable from "components/unit/CustomTable";

function EmpCultHealthCostManagePop( empId ) {
  const [values, setValues] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true); // 초기 로딩 여부 상태 변수 추가
  const [param, setParam] = useState({});

  const { keyColumn, queryId, tableColumns, popup, searchInfo } = EmpCultHealthCostManagePopJson;
  
  useEffect(() => {
    if (initialLoad) {
      // 초기 로딩 시에만 pageHandle 함수 실행
      pageHandle();
      setInitialLoad(false); // 초기 로딩 상태 업데이트
    }
  }, []); // 의존성 배열을 빈 배열로 설정하여 컴포넌트가 마운트될 때만 실행되도록 함

  const pageHandle = async () => {
    setParam({
        ...param, 
       queryId: queryId,
       empId: empId
    })
    console.log("나 탓어!!");

    try {
      const response = await ApiRequest("/boot/common/queryIdSearch", param);
      setValues(response);
    } catch (error) {
      console.log(error);
    }
  };
 
  return (
    <div className="container">
      <div className="title p-1" style={{  marginBottom: "10px" }}>
        <h1 style={{ fontSize: "30px" }}>개인 문화 체련비 현황</h1>
      </div>
      <div className="col-md-10 mx-auto" style={{ marginBottom: "10px" }}>
        <span>* 직원의 문화체련비를  조회합니다.</span>
      </div>
      
      <CustomTable
        keyColumn={keyColumn}
        columns={tableColumns}
        values={values}
        paging={true}
      />
    </div>
  );
};

export default EmpCultHealthCostManagePop;