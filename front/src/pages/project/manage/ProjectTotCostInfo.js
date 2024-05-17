import React from "react";

import { useState, useEffect } from "react";

import CustomTable from "components/unit/CustomTable";
import ProjectPrmpcBgtCmpr from "./ProjectPrmpcBgtCmpr";

import ProjectTotCostInfoJson from "./ProjectTotCostInfoJson.json";
import ApiRequest from "../../../utils/ApiRequest";

const ProjectTotCostInfo = ({prjctId, atrzDmndSttsCd, bgtMngOdr, nowAtrzStepCd}) => {
  const [data, setData] = useState([]);
  const { keyColumn, queryId, aprvQueryId, tableColumns, wordWrap, groupingColumn ,groupingData} = ProjectTotCostInfoJson;

  // 승인 목록에서 진입한 경우 사용
  const [aprvOdr, setAprvOdr] = useState("");
  const [endYn, setEndYn] = useState(false);

  useEffect(() => {

    // 프로젝트 목록에서 조회한 경우
    if(atrzDmndSttsCd === "VTW03703") {
      pageHandle();
    } else {
      // 프로젝트 승인에서 조회한 경우
      retrieveAprvBgtOdr();
    }
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

  const retrieveAprvBgtOdr = async () => {
    const param = {
      queryId: aprvQueryId,
      prjctId: prjctId
    }

    const response = await ApiRequest("/boot/common/queryIdSearch", param);

    // 종결이면 현재 보고 있는 화면은 승인이 완료된 것임. 따라서 bgtMngOdr보다 하나 작은 것을 가져와야 한다.
    if(nowAtrzStepCd === "VTW00708") {
      setAprvOdr(bgtMngOdr - 1);
      setEndYn(true)
    } else {
      setAprvOdr(response[0].aprvOdr);
    }
  }


  return (
    <div style={{ padding: "5%", height: "100%" }}>
      {
        atrzDmndSttsCd === "VTW03703" ?
        <CustomTable
        keyColumn={keyColumn}
        columns={tableColumns}
        values={data}
        paging={true}
        wordWrap={wordWrap}
        grouping={groupingColumn}
        groupingData={groupingData}
        />
        :
        <ProjectPrmpcBgtCmpr
          prjctId={prjctId}
          bgtMngOdr={aprvOdr}
          bgtMngOdrTobe={bgtMngOdr}
          atrzDmndSttsCd={endYn == true ? "VTW03703" : "VTW03702"}
          type="aprv"
        />
      }
    </div>
  );
};

export default ProjectTotCostInfo;
