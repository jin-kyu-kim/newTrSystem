import { useEffect, useState } from "react";
import "devextreme/dist/css/dx.common.css";

import ProjectEmpCostSearchJson from "./ProjectEmpCostSearchJson.json";
import ApiRequest from "../../../utils/ApiRequest";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";
// import { Workbook } from "exceljs";
// import { saveAs } from "file-saver";
import PivotGrid, {
  Export,
  FieldChooser,
  FieldPanel,
  Scrolling,
} from "devextreme-react/pivot-grid";
import { exportPivotGrid } from "devextreme/excel_exporter";
import { Button } from "devextreme-react";

const ProjectEmpCostSearch = ({prjctId, bgtMngOdr}) => {
  const [pivotGridConfig, setPivotGridConfig] = useState({
    fields: ProjectEmpCostSearchJson,
    store: [],
  });

  useEffect(() => {
    Cnsrtm();                                                                                                                             
  }, []);
  console.log(prjctId)
  console.log(bgtMngOdr)
  const param = {
    queryId: "projectMapper.retrieveprojectEmpCostSearch",
    prjctId: prjctId,
    bgtMngOdr: bgtMngOdr
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
/*
  const onExporting = (e) => {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet("Sales");
    exportPivotGrid({
      component: e.component,
      worksheet,
    }).then(() => {
      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(
          new Blob([buffer], { type: "application/octet-stream" }),
          "Sales.xlsx"
        );
      });
    });
  };
*/
  const test = (e) => {
    console.log(e);
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
        // onExporting={onExporting}
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
        <Export enabled={true} />
        <Button onClick={test} />
      </PivotGrid>
    </div>
  );
};

export default ProjectEmpCostSearch;
