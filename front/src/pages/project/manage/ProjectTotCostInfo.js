import React from "react";

import { useState, useEffect } from "react";

import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.light.css";
import "devextreme/dist/css/dx.material.blue.light.css";
import CustomTable from "components/unit/CustomTable";

import ProjectTotCostInfoJson from "./ProjectTotCostInfoJson.json";
import ApiRequest from "../../../utils/ApiRequest";

const ProjectTotCostInfo = ({prjctId, atrzDmndSttsCd, bgtMngOdr}) => {
  const [data, setData] = useState([]);
  const { keyColumn, queryId, tableColumns, wordWrap, groupingColumn ,groupingData} = ProjectTotCostInfoJson;
  useEffect(() => {
    pageHandle();
    console.log(1);
  }, []);


  const pageHandle = async (item) => {
    try {
      const modifiedItem = { ...item,queryId:queryId, prjctId: prjctId, atrzDmndSttsCd: atrzDmndSttsCd, bgtMngOdr: bgtMngOdr};
      const response = await ApiRequest("/boot/common/queryIdSearch", modifiedItem);
      setData(response);
      if (response.length !== 0) {
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <div style={{ padding: "5%", height: "100%" }}>
      <CustomTable
        keyColumn={keyColumn}
        columns={tableColumns}
        values={data}
        paging={true}
        wordWrap={wordWrap}
        grouping={groupingColumn}
        groupingData={groupingData}
      
      />  
    </div>
  );
};

export default ProjectTotCostInfo;
