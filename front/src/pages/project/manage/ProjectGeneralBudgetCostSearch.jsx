import React, { useEffect, useState } from "react";
import PivotGrid, {
  FieldChooser,
  FieldPanel,
  Scrolling,
} from "devextreme-react/pivot-grid";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";
import ApiRequest from "../../../utils/ApiRequest";

import ProjectGeneralBudgetCostSearchJson from "./ProjectGeneralBudgetCostSearchJson.json";
import {useLocation} from "react-router-dom";
import {add, format} from "date-fns";

const ProjectGeneralBudgetCostSearch = ({prjctId}) => {
  const location = useLocation();
  // const prjctId = location.state.prjctId;

  const ctrtYmd = location.state.ctrtYmd;
  const stbleEndYmd = location.state.stbleEndYmd;
  const bgtMngOdr = location.state.bgtMngOdr;

  const [pivotGridConfig, setPivotGridConfig] = useState({
    fields: ProjectGeneralBudgetCostSearchJson,
    store: [],
  });

  useEffect(() => {
      Cnsrtm();
  }, []);

  const param = {
    queryId: "projectMapper.retrieveProjectGeneralBudgetCostSearch",
    prjctId: prjctId,
    costFlag: "general",
    ctrtYmd:ctrtYmd,
    stbleEndYmd:stbleEndYmd,
    bgtMngOdr:bgtMngOdr
  };

  const Cnsrtm = async () => {
    try {
      const response = await ApiRequest("/boot/prjct/retrievePjrctCost", param);
      setPivotGridConfig({
        ...pivotGridConfig,
        store: response,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const dataSource = new PivotGridDataSource(pivotGridConfig);

  return (
    <div style={{ margin: "30px" }}>
      <PivotGrid
        dataSource={dataSource}
        allowSortingBySummary={true}
        height={560}
        showBorders={true}
        showColumnGrandTotals={true}
        allowFiltering={false}
        allowSorting={false}
        allowExpandAll={false}
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
