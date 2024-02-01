import React from "react";

import { useState, useEffect } from "react";
import DataGrid, {
  Column,
  Summary,
  GroupItem,
  Grouping,
  TotalItem,
} from "devextreme-react/data-grid";
import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.light.css";
import "devextreme/dist/css/dx.material.blue.light.css";

import ProjectTotCostInfoJson from "./ProjectTotCostInfoJson";
import CustomTable from "components/unit/CustomTable";
import ApiRequest from "../../../utils/ApiRequest";

const ProjectTotCostInfo = ({projId}) => {
  const [data, setData] = useState([]);
  const params = [
    {
      id: 1,
      costKind: "자사인력",
      tbCostNm: "MMNY_INPT_MM",
      costCol: "EXPECT_MM",
      tbExcuteNm: "MMNY_LBRCO_EXCN",
      excuteCol: "MM",
      prjctId: projId,
      queryId: "projectMapper.retrievePrjctCostSummery",
    },
    {
      id: 2,
      costKind: "재료비",
      tbCostNm: "MATRL_CT_PRMPC",
      costCol: "UNTPC",
      tbExcuteNm: "MATRL_CT_EXCN",
      excuteCol: "USE_AMT",
      prjctId: projId,
      queryId: "projectMapper.retrievePrjctCostSummery",
    },
  ];

  // useEffect(() => {
  //   handelGetData();
  //   console.log(data);
  // }, []);

  // const handelGetData = () => {
  //   try {
  //     params.map(async (item) => {
  //       console.log(item);
  //       const response = await ApiRequest("/boot/common/queryIdSearch", item);
  //       setData((prevData) => [...prevData, ...response]);
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const customizeGroupHeaderText = (e) => {
    console.log(e);
  };

  return (
    <div style={{ padding: "5%", height: "100%" }}>
      <CustomTable
        keyColumn={ProjectTotCostInfoJson.keyColumn}
        columns={ProjectTotCostInfoJson.tableColumns}
        values={data}
        onRowDblClick={customizeGroupHeaderText}
        paging={null}
        summary={true}
        summaryColumn={data}
      />

      {/* <DataGrid
        dataSource={data}
        keyExpr="id"
        showBorders={true}
        showColumnLines={true}
        masterDetail={{
          enabled: false,
        }}
      >
        <Grouping allowCollapsing={false} texts="테스트" />
        <Column dataField="id" caption="ID" width={150} />
        <Column dataField="name" caption="Name" />
        <Column dataField="data" caption="Data" />
        <Column dataField="ver" groupIndex={0} allowGrouping={false} />

        <Summary>
          <TotalItem
            column="data"
            summaryType="sum"
            valueFormat="#,##0"
            displayFormat="Total: {0}"
            showInColumn="data"
          />
        </Summary>
        <Summary
          totalItems={[
            {
              column: "data",
              summaryType: "sum",
              valueFormat: "#,##0",
              displayFormat: "Total data: {0}",
            },
          ]}
        />
        <GroupItem
          column="ver"
          customizeText={customizeGroupHeaderText}
          summaryType="sum"
          valueFormat="#,##0"
          displayFormat={`Total data (version {0}): {1}`}
        />
      </DataGrid> */}
    </div>
  );
};

export default ProjectTotCostInfo;
