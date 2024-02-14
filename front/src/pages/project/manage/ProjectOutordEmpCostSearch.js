import { useEffect, useState } from "react";
import "devextreme/dist/css/dx.common.css";

import ProjectOutordEmpCostSearchJson from "./ProjectOutordEmpCostSearchJson.json";
import ApiRequest from "../../../utils/ApiRequest";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";
import PivotGrid, {
  FieldChooser,
  FieldPanel,
  Scrolling,
} from "devextreme-react/pivot-grid";

const ProjectOutordEmpCostSearch = (prjctId) => {
  const [pivotGridConfig, setPivotGridConfig] = useState({
    fields: ProjectOutordEmpCostSearchJson,
    store: [],
  });

  useEffect(() => {
    Cnsrtm();
  }, []);

  useEffect(() => {}, [pivotGridConfig]);

  const param = {
    queryId: "projectMapper.retrieveProjectOutordEmpCostSearch",
    prjctId: prjctId.prjctId,
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

export default ProjectOutordEmpCostSearch;
