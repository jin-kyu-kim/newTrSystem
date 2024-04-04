import React from "react";

import { useState, useEffect } from "react";

import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.light.css";
import "devextreme/dist/css/dx.material.blue.light.css";
import CustomTable from "components/unit/CustomTable";

import ProjectTotCostInfoJson from "./ProjectTotCostInfoJson.json";
import ApiRequest from "../../../utils/ApiRequest";

const ProjectTotCostInfo = (prjctId) => {
  const [values, setValues] = useState([]);
  const [data, setData] = useState([]);
  const { keyColumn, queryId, tableColumns, prjctColumns , summaryColumn , wordWrap, searchInfo } = ProjectTotCostInfoJson;
  useEffect(() => {
    // handelGetData();
    console.log(1);
  }, []);

  // const handelGetData = async () => {
  //   try {
  //     await ProjectTotCostInfoJson.params.map(async (item) => {
  //       const modifiedItem = { ...item, prjctId: prjctId.prjctId };
  //       const response = await ApiRequest(
  //         "/boot/common/queryIdSearch",
  //         modifiedItem
  //       );
  //       setData((prevData) => [...prevData, ...response]);
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };


  return (
    <div style={{ padding: "5%", height: "100%" }}>
      <CustomTable
        keyColumn={keyColumn}
        columns={tableColumns}
        values={values}
        paging={true}
        wordWrap={wordWrap}
        excel={true}
        summary={true}
        summaryColumn={summaryColumn}
        
      />  
    </div>
  );
};

export default ProjectTotCostInfo;
