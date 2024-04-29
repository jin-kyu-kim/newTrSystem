import React from "react";

import { useState, useEffect } from "react";

import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.light.css";
import "devextreme/dist/css/dx.material.blue.light.css";
import CustomTable from "components/unit/CustomTable";

import ProjectTotCostInfoJson from "./ProjectTotCostInfoJson.json";
import ApiRequest from "../../../utils/ApiRequest";

const ProjectTotCostInfo = ({prjctId, atrzDmndSttsCd}) => {
  const [data, setData] = useState([]);
  const { keyColumn, queryId, tableColumns, prjctColumns , summaryColumn , wordWrap, groupingColumn ,groupingData} = ProjectTotCostInfoJson;
  useEffect(() => {
    pageHandle();
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

  const pageHandle = async (item) => {
    try {
      const modifiedItem = { ...item,queryId:queryId, prjctId: prjctId, atrzDmndSttsCd: atrzDmndSttsCd};
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
