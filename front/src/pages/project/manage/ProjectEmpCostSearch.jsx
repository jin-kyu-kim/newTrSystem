import { useEffect, useState } from "react";
import "devextreme/dist/css/dx.common.css";
import { addMonths, subMonths } from 'date-fns';

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
  const bgtMngOdr = location.state.bgtMngOdr;
  const ctrtYmdBefore= new Date(location.state.ctrtYmd);
  const stbleEndYmdBefore = new Date(location.state.stbleEndYmd);
  const ctrtYmd = subMonths(ctrtYmdBefore, 1);
  const stbleEndYmd = addMonths(stbleEndYmdBefore, 1);

  const [pivotGridConfig, setPivotGridConfig] = useState({
    fields: ProjectEmpCostSearchJson,
    store: [],
  });

  useEffect(() => {
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
      <div style={{display: "inline-block", margin : "5px", padding: "5px 10px 5px 10px", color: "black", fontSize: "12px",  backgroundColor: "rgba(255, 182, 193, 0.5)", border: "1px solid red", borderRadius: "10px"}}>
        * 하단의 컬럼속성을 드래그 하여, 표 좌측에 넣으면 해당 컬럼이 표현됩니다. 
      </div>
      <PivotGrid
        dataSource={dataSource}
        allowSortingBySummary={true}
        height={620}
        showBorders={true}
        showColumnGrandTotals={true}
        allowFiltering={false}
        allowSorting={false}
        allowExpandAll={false}
        showRowTotals={false}
        showTotalsPrior={'columns'} // "none", "rows", "columns", "both" 중 하나를 선택
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
        <Export enabled={true} />
      </PivotGrid>
    </div>
  );
};

export default ProjectEmpCostSearch;
