import React, { useEffect, useState } from "react";
import PivotGrid, {
  FieldChooser,
  FieldPanel,
  Scrolling,
} from "devextreme-react/pivot-grid";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";
import ApiRequest from "../../../utils/ApiRequest";

import ProjectGeneralBudgetCostSearchJson from "./ProjectGeneralBudgetCostSearchJson.json";

const ProjectGeneralBudgetCostSearch = (prjctId) => {
  const [pivotGridConfig, setPivotGridConfig] = useState({
    fields: ProjectGeneralBudgetCostSearchJson,
    store: [],
  });

  useEffect(() => {
    Cnsrtm();
  }, []);

  const param = {
    queryId: "projectMapper.retrieveProjectGeneralBudgetCostSearch",
    prjctId: prjctId.prjctId,
    costFlag: "general",
  };

  const Cnsrtm = async () => {
    try {
      const response = await ApiRequest("/boot/common/queryIdSearch", param);
      setPivotGridConfig({
        ...pivotGridConfig,
        store: response,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const test = (e) => {
    console.log(e);
    console.log(dataSource);
  };

  const dataSource = new PivotGridDataSource(pivotGridConfig);

  return (
    <div style={{ margin: "30px" }}>
      <PivotGrid
        dataSource={dataSource}
        allowSortingBySummary={true}
        height={560}
        showBorders={true}
        showColumnGrandTotals={false}
        allowFiltering={false}
        allowSorting={false}
        allowExpandAll={false}
        onCellClick={test}
      >
        <FieldPanel
          showRowFields={true}
          visible={true}
          showTotals={false}
          showColumnFields={false}
          showDataFields={false}
          showFilterFields={false}
          allowFieldDragging={false}
        />

        <FieldChooser enabled={false} />
        <Scrolling mode="virtual" />
      </PivotGrid>
    </div>
  );
};

export default ProjectGeneralBudgetCostSearch;
