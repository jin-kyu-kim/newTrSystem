import React, { useEffect, useState } from "react";

import ApiRequest from "../../../utils/ApiRequest";
import CustomTable from "../../../components/unit/CustomTable";
import ProjectOutordCompanyCostSearchJson from "./ProjectOutordCompanyCostSearchJson.json";
import {useLocation} from "react-router-dom";

const ProjectOutordCompanyCostSearch = () => {
  const location = useLocation();
  const prjctId = location.state.prjctId;
  const bgtMngOdr = location.state.bgtMngOdr;

  const { keyColumn, queryId, tableColumns, summaryColumn } = ProjectOutordCompanyCostSearchJson;
  const [values, setValues] = useState([]);

  useEffect(() => {
    const param = {
      queryId: queryId,
      prjctId: prjctId,
      bgtMngOdr: bgtMngOdr
    };
    const SetData = async () => {
      try {
        const response = await ApiRequest("/boot/common/queryIdSearch", param);
        setValues(response);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    SetData();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <div className="container">
        <CustomTable
          keyColumn={keyColumn}
          columns={tableColumns}
          values={values}
          pagerVisible={false}
          summary={true}
          summaryColumn={summaryColumn}
        />
      </div>
    </div>
  );
};

export default ProjectOutordCompanyCostSearch;
