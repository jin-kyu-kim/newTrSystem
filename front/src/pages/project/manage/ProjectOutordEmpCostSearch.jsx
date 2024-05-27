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

  const onCellPrepared = (e) => {
    // console.log("e", e);

    // if (e.area === 'data' && e.cell && (e.cell.rowType === 'GT' || e.cell.columnType === 'GT')) {
    //   e.cellElement.classList.add('grand-total');
    //   e.cellElement.style.order = -1;
    // }
    // if (e.area === 'column' && e.cell && e.cell.type === 'GT') {
    //   e.cellElement.classList.add('grand-total');
    //   e.cellElement.style.order = -1;
    // }


    // 필드 값을 숨깁니다.
  // if (e.area === "column" && (e.cell.text === '사용금액' || e.cell.text === '가용금액')) {
  //   if (!e.cellElement.classList.contains('grand-total')) {
  //     e.cellElement.style.display = 'none';
  //   }
  // }
  // if (e.area === "data" && (e.cell.dataIndex === 2 || e.cell.dataIndex === 3)) {
  //   if (!e.cellElement.classList.contains('grand-total')) {
  //     e.cellElement.style.display = 'none';
  //   }
  // }
  
  // if (e.area === "column" && (e.cell.columnIndex % 2 || e.cell.columnIndex % 3)) {
  //   if (!e.cellElement.classList.contains('grand-total')) {
  //     e.cellElement.style.display = 'none';
  //   }
  // }
  // if (e.area === "data" && (e.columnIndex % 2 || e.columnIndex & 3 )) {
  //   if (!e.cellElement.classList.contains('grand-total')) {
  //     e.cellElement.style.display = 'none';
  //   }
  // }
  };


    // useEffect(() => {
    //   // Grand Total 셀을 가장 왼쪽으로 이동
    //   const grandTotalCells = document.querySelectorAll('.dx-grandtotal, .dx-total');
    //   grandTotalCells.forEach(cell => {
    //     const parent = cell.parentNode;
    //     if (parent.firstChild !== cell) {
    //       parent.insertBefore(cell, parent.firstChild);
    //     }
    //   });
    // }, []);

  return (
    <div style={{ margin: "30px" }}>
      <div style={{display: "inline-block", margin : "5px", padding: "5px 10px 5px 10px", color: "black", fontSize: "12px",  backgroundColor: "rgba(255, 182, 193, 0.5)", border: "1px solid red", borderRadius: "10px"}}>
        * 하단의 컬럼속성을 드래그 하여, 표 좌측에 넣으면 해당 컬럼이 표현됩니다. 
      </div>
      <PivotGrid
        dataSource={dataSource}
        allowSortingBySummary={true}
        showBorders={true}
        showColumnGrandTotals={true}
        allowFiltering={false}
        allowSorting={false}
        allowExpandAll={false}
        showRowTotals={false}
        onCellPrepared={onCellPrepared}
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
