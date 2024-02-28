import React, { useEffect, useState } from "react";
import PivotGrid, {
  FieldChooser,
  FieldPanel,
  Scrolling,
  calculateCustomSummary,
} from "devextreme-react/pivot-grid";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";
import ApiRequest from "../../../utils/ApiRequest";

import ProjectGeneralBudgetCostSearchJson from "./ProjectGeneralBudgetCostSearchJson.json";

const ProjectControlBudgetCostSearch = (prjctId) => {
  const [pivotGridConfig, setPivotGridConfig] = useState({
    fields: [
      {
        caption: "비용코드",
        width: 120,
        dataField: "expensNm",
        area: "row",
        expanded: true,
        showTotals: false,
        showColumnGrandTotals: false,
      },
      {
        caption: "상세내용",
        dataField: "dtlDtls",
        width: 200,
        area: "row",
        expanded: true,
        showTotals: false,
      },
      {
        caption: " ",
        dataField: "flag",
        width: 200,
        area: "row",
        expanded: true,
        sortOrder: "desc",
      },
      {
        dataField: "useYm",
        dataType: "inptYm",
        groupInterval: "year",
        area: "column",
        showTotals: false,
        expanded: true,
      },
      {
        caption: "Total",
        dataField: "expensCt",
        dataType: "number",
        summaryType: "sum",
        area: "data",
        showColumnGrandTotals: true,
      },
      {
        caption: "Total (Custom)",
        dataField: "expensCt",
        dataType: "number",
        summaryType: "custom",
        calculateCustomSummary: (options) => {
          switch (options.summaryProcess) {
            case "start":
              // 초기화 로직
              options.totalValue = 0;
              break;
            case "calculate":
              // 각 행에 대한 사용자 정의 계산 로직
              options.totalValue += options.value * 2; // 예시로 2배로 계산
              break;
            case "finalize":
              // 최종 사용자 정의 결과 계산 로직
              options.totalValue = Math.round(options.totalValue * 100) / 100;
              break;
          }
        },
        area: "data",
      },
      // {
      //   dataField: "expensCt",
      //   dataType: "number",
      //   summaryType: "custom",
      //   area: "data",
      //   calculateCustomSummary: function (options) {
      //     if (options.summaryProcess == "calculate") {
      //       console.log(options);
      //       options.totalValue -= options.value;
      //       options.sum2 += Math.pow(options.value, 2);
      //       options.n++;
      //     }
      //   },
      // },
      // "flag"에 대한 행 추가
    ],
    store: [],
  });

  useEffect(() => {
    Cnsrtm();
  }, []);

  const param = {
    queryId: "projectMapper.retrieveProjectGeneralBudgetCostSearch",
    prjctId: prjctId.prjctId,
    costFlag: "control",
  };

  const Cnsrtm = async () => {
    try {
      const response = await ApiRequest("/boot/common/queryIdSearch", param);

      var test = [];
      response.map((item) => {
        item.flag = item.expensNm + item.dtlDtls;
      });

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

export default ProjectControlBudgetCostSearch;
