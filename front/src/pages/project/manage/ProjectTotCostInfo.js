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
import ApiRequest from "../../../utils/ApiRequest";

const ProjectTotCostInfo = (projId) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    handelGetData();
  }, []);

  const handelGetData = async () => {
    try {
      await ProjectTotCostInfoJson.params.map(async (item) => {
        const modifiedItem = { ...item, prjctId: projId.projId };
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

  const gridRows = () => {
    const result = [];
    for (let i = 0; i < ProjectTotCostInfoJson.tableColumns.length; i++) {
      const { key, value } = ProjectTotCostInfoJson.tableColumns[i];
      result.push(
        <Column
          key={key}
          dataField={key}
          caption={value}
          alignment="right"
          format={"#,##0"}
        />
      );
    }
    return result;
  };

  return (
    <div style={{ padding: "5%", height: "100%" }}>
      <DataGrid
        dataSource={data}
        keyExpr="id"
        showBorders={true}
        showColumnLines={true}
        masterDetail={{
          enabled: false,
        }}
        onCellPrepared={(e) => {
          if (e.rowType === "header") {
            e.cellElement.style.textAlign = "center";
            e.cellElement.style.fontWeight = "bold";
          }
        }}
      >
        {gridRows()}

        <Column
          dataField="bind"
          caption="원가별집계"
          customizeText={(e) => {
            if (e.value === 1) {
              return "인건비";
            } else if (e.value === 2) {
              return "경비";
            } else {
              return "재료비";
            }
          }}
          groupIndex={0}
        />

        <Grouping autoExpandAll={true} />

        <Summary>
          <TotalItem
            column="costAmt"
            summaryType="sum"
            valueFormat="#,##0"
            displayFormat="{0}"
          />
          <TotalItem
            column="useAmt"
            summaryType="sum"
            valueFormat="#,##0"
            displayFormat="{0}"
          />
          <TotalItem
            column="availAmt"
            summaryType="sum"
            valueFormat="#,##0"
            displayFormat="{0}"
          />
          <TotalItem
            column="useRate"
            summaryType="avg"
            valueFormat="#,##0"
            displayFormat="{0}"
          />
        </Summary>
        <GroupItem
          column="bind"
          summaryType="sum"
          valueFormat="#,##0"
          displayFormat="{0}"
          showInGroupFooter={true}
        />
      </DataGrid>
    </div>
  );
};

export default ProjectTotCostInfo;
