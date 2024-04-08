import { useEffect, useState } from "react";
import "devextreme/dist/css/dx.common.css";

import ProjectEmpCostSearchJson from "./ProjectEmpCostSearchJson.json";
import ApiRequest from "../../../utils/ApiRequest";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";
import PivotGrid, {
  Export,
  FieldChooser,
  FieldPanel,
  Scrolling,
} from "devextreme-react/pivot-grid";

import {useLocation} from "react-router-dom";

const ProjectEmpCostSearch = ({prjctId}) => {
  const location = useLocation();
  // const prjctId = location.state.prjctId;

  const ctrtYmd = location.state.ctrtYmd;
  const bgtMngOdr = location.state.bgtMngOdr;
  //TODO: const stbleEndYmd = location.state.stbleEndYmd;
  const stbleEndYmd = '2024-12-31'
  const [pivotGridConfig, setPivotGridConfig] = useState({
    fields: ProjectEmpCostSearchJson,
    store: [],
  });

  useEffect(() => {
    console.log(prjctId);
    console.log("bgtMngOdr",bgtMngOdr);
        Cnsrtm();
  }, []);

  const param = {
    queryId: "projectMapper.retrieveProjectEmpCostSearch",
    prjctId: prjctId,
    ctrtYmd:ctrtYmd,
    stbleEndYmd:stbleEndYmd,
    bgtMngOdr:bgtMngOdr
  };

  const Cnsrtm = async () => {
    try {
      const response = await ApiRequest("/boot/prjct/retrievePjrctEmpCost", param);
      console.log(response)
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
        showRowTotals={false}
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
      </PivotGrid>
    </div>
  );
};

export default ProjectEmpCostSearch;
