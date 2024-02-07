import { useEffect, useState } from "react";
import "devextreme/dist/css/dx.common.css";

import ProjectEmpCostSearchJson from "./ProjectEmpCostSearchJson.json";
import ApiRequest from "../../../utils/ApiRequest";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";
import PivotGrid, {
  FieldChooser,
  FieldPanel,
  Scrolling,
} from "devextreme-react/pivot-grid";

const ProjectEmpCostSearch = (prjctId) => {
  const [pivotGridConfig, setPivotGridConfig] = useState({
    fields: ProjectEmpCostSearchJson,
    store: [],
  });

  useEffect(() => {
    Cnsrtm();
  }, []);

  const param = {
    queryId: "projectMapper.retrieveprojectEmpCostSearch",
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

// const dataSource = new PivotGridDataSource({
//   fields: [
//     {
//       caption: "Region",
//       width: 120,
//       dataField: "name",
//       area: "row",
//       expanded: true,
//     },
//     {
//       caption: "Country",
//       dataField: "country",
//       width: 100,
//       area: "row",
//       expanded: true,
//       showTotals: false,
//     },
//     {
//       caption: "City",
//       dataField: "city",
//       width: 100,
//       area: "row",
//     },
//     {
//       dataField: "date",
//       dataType: "date",
//       groupInterval: "year",
//       area: "column",
//       showTotals: false,
//       expanded: true,
//     },
//     {
//       dataField: "date",
//       dataType: "date",
//       groupInterval: "month",
//       area: "column",
//       format: {
//         precision: "month",
//       },
//     },
//     {
//       caption: "Total",
//       dataField: "amount",
//       dataType: "number",
//       summaryType: "sum",
//       format: "currency",
//       area: "data",
//     },
//   ],
//   store: ProjectEmpCostSearchJson,
// });

export default ProjectEmpCostSearch;
