import React, { useEffect, useState } from "react";
import { Button } from "devextreme-react";

import DataGrid, {
  Column,
  SearchPanel,
  Scrolling,
  Summary,
  TotalItem,
} from "devextreme-react/data-grid";

//파람으로 받아와야 할 것 : 사업시작일, 사업종료일
const CustomCostTable = ({
  keyColumn,
  columns,
  values,
  prjctId,
  summaryColumn,
}) => {
  const [period, setPeriod] = useState([]); //사업시작일, 사업종료일을 받아와서 월별로 나눈 배열을 담을 상태

  //period 랜더링 문제 해결 필요
  //파라미터로 받아온 사업시작, 사업종료월을 파라미터로 포함된 월의 갯수를 배열로 반환
  useEffect(() => {
    const getPeriod = (startDate, endDate) => {
      const start = new Date(startDate);
      const end = new Date(endDate);
      let periods = [];
      while (start <= end) {
        periods.push(start.getMonth() + 1 + "월");
        start.setMonth(start.getMonth() + 1);
      }
      setPeriod(periods);
      return period;
    };
    getPeriod("2021-09-01", "2022-03-31");
  }, []);

  const editColumn = ["수정", "삭제"];

  const onCellRenderEdit = (data) => {
    return (
      <Button
        // onClick={() => handleEdit(cellData.data)}
        style={{ height: "100%" }}
      >
        수정
      </Button>
    );
  };

  const onCellRenderDelete = (data) => {
    return (
      <Button
        // onClick={() => handleDelete(cellData.data)}
        style={{ height: "100%" }}
      >
        삭제
      </Button>
    );
  };

  const gridRows = () => {
    const result = [];
    columns.map((column) => {
      result.push(
        <Column
          key={column.key}
          dataField={column.key}
          caption={column.value}
          alignment={"center"}
          // fixed={true}
        ></Column>
      );
    });
    period.map((period) => {
      result.push(
        <Column
          key={period}
          dataField={period}
          caption={period}
          alignment={"center"}
          // fixed={false}
        ></Column>
      );
    });
    editColumn.map((column) => {
      result.push(
        <Column
          key={column}
          dataField={column}
          caption={column}
          alignment={"center"}
          cellRender={
            column === "수정"
              ? (cellData) => onCellRenderEdit(cellData)
              : (cellData) => onCellRenderDelete(cellData)
          }
          // fixed={true}
        ></Column>
      );
    });
    return result;
  };

  return (
    <div className="wrap_table">
      <DataGrid
        keyExpr={keyColumn}
        id={"dataGrid"}
        className={"table"}
        dataSource={values}
        showBorders={true}
        showColumnLines={true}
        focusedRowEnabled={false}
        columnAutoWidth={false}
        sorting={{ mode: "none" }}
        noDataText="No data"
        columnWidth={100}
        onCellPrepared={(e) => {
          if (e.rowType === "header") {
            e.cellElement.style.textAlign = "center";
            e.cellElement.style.fontWeight = "bold";
          }
        }}
      >
        {gridRows()}
        <SearchPanel
          visible={true}
          highlightCaseSensitive={true}
          placeholder="자유롭게 입력하세요"
          width="100%"
        />
        <Scrolling columnRenderingMode="virtual" />
        <Summary>
          {summaryColumn.map((item) => (
            <TotalItem
              key={item.key}
              column={item.value}
              summaryType={item.type}
              displayFormat={item.format}
              valueFormat={{ type: "fixedPoint", precision: 0 }} // 천 단위 구분자 설정
            />
          ))}
        </Summary>
      </DataGrid>
    </div>
  );
};

export default CustomCostTable;
