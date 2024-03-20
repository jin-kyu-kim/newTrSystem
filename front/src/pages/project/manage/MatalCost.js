import React, { useEffect, useState } from "react";

import ApiRequest from "../../../utils/ApiRequest";
import CustomTable from "../../../components/unit/CustomTable";
import MatalCostJson from "./MatalCostJson.json";

const MatalCost = ({ prjctId, bgtMngOdr }) => {
  const { keyColumn, queryId, tableColumns, summaryColumn } = MatalCostJson;
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

export default MatalCost;
