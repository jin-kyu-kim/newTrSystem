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

const ProjectTotCostInfo = (projIdInfo) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    handelGetData();
    console.log(data);
  }, []);

  const handelGetData = () => {
    try {
      ProjectTotCostInfoJson.params.map(async (item) => {
        const modifiedItem = { ...item, prjctId: projIdInfo };
        const response = await ApiRequest(
          "/boot/common/queryIdSearch",
          modifiedItem
        );
        setData((prevData) => [...prevData, ...response]);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const test = () => {
    console.log("test");
  };

  const gridRows = () => {
    const result = [];
    for (let i = 0; i < ProjectTotCostInfoJson.tableColumns.length; i++) {
      const { key, value } = ProjectTotCostInfoJson.tableColumns[i];
      result.push(
        <Column
          key={key}
          dataField={key}
          caption={value}
          alignment="center"
        ></Column>
      );
    }
    return result;
  };

  return (
    <div style={{ padding: "5%", height: "100%" }}>
      <CustomTable
        keyColumn={ProjectTotCostInfoJson.keyColumn}
        columns={ProjectTotCostInfoJson.tableColumns}
        values={data}
        onRowDblClick={test}
        paging={null}
        summary={true}
        summaryColumn={data}
      />

      <DataGrid
        dataSource={data}
        keyExpr="id"
        showBorders={true}
        showColumnLines={true}
        masterDetail={{
          enabled: false,
        }}
      >
        <Grouping allowCollapsing={false} texts="테스트" />
        {gridRows()}

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
          summaryType="sum"
          valueFormat="#,##0"
          displayFormat={`Total data (version {0}): {1}`}
        />
      </DataGrid>
    </div>
  );
};

export default ProjectTotCostInfo;
