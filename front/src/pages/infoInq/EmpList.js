import { useState, useEffect } from "react";
import EmpListJson from "../infoInq/EmpListJson.json";
import ApiRequest from "../../utils/ApiRequest";
import SearchEmpSet from "components/composite/SearchInfoSet";
import CustomEditTable from "components/unit/CustomEditTable";

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
      queryId: queryId,
      hdofSttsCd : "VTW00301"
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
      <div className="title">직원 조회</div>
      <div className="title-desc">* 직원을 조회합니다.</div>
      <div style={{ marginBottom: "20px" }}>
        <SearchEmpSet
          callBack={searchHandle}
          props={searchInfo}
          popup={popup}
        />
      </div>

      <div>검색된 건 수 : {totalItems} 건</div>
      <CustomEditTable
        noEdit={true}
        values={values}
        columns={tableColumns}
        keyColumn={keyColumn}
      />
    </div>
  );
};
export default EmpList;