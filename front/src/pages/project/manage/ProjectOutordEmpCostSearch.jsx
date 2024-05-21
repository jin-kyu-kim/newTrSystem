import { useEffect, useState } from "react";
import "devextreme/dist/css/dx.common.css";
import { addMonths, subMonths } from 'date-fns';

import ProjectOutordEmpCostSearchJson from "./ProjectOutordEmpCostSearchJson.json";
import ApiRequest from "../../../utils/ApiRequest";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";
import PivotGrid, {
  FieldChooser,
  FieldPanel,
  Scrolling,
} from "devextreme-react/pivot-grid";

import {useLocation} from "react-router-dom";

const ProjectOutordEmpCostSearch = ({prjctId}) => {
  const location = useLocation();
  // const prjctId = location.state.prjctId;

  const ctrtYmdBefore= new Date(location.state.ctrtYmd);
  const stbleEndYmdBefore = new Date(location.state.stbleEndYmd);

  const ctrtYmd = subMonths(ctrtYmdBefore, 1);
  const stbleEndYmd = addMonths(stbleEndYmdBefore, 1);

  const bgtMngOdr = location.state.bgtMngOdr;

  const [pivotGridConfig, setPivotGridConfig] = useState({
    fields: ProjectOutordEmpCostSearchJson,
    store: [],
  });

  useEffect(() => {
    Cnsrtm();
  }, []);

  const param = {
    queryId: "projectMapper.retrieveProjectOutordEmpCostSearch",
    prjctId: prjctId,
    ctrtYmd: ctrtYmd,
    stbleEndYmd:stbleEndYmd,
    bgtMngOdr:bgtMngOdr
  };

  const Cnsrtm = async () => {
    try {
      const response = await ApiRequest("/boot/prjct/retrievePjrctOutordEmpCost", param);
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
          showFilterFields={true}
          allowFieldDragging={true}
        />

        <FieldChooser enabled={false} />
        <Scrolling mode="virtual" />
      </PivotGrid>
    </div>
  );
};

export default ProjectOutordEmpCostSearch;
