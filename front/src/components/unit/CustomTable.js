import DataGrid, { Column, Export, Pager, Paging, Summary, TotalItem } from "devextreme-react/data-grid";
import GridRows from "./GridRows";
import AllowedPageSize from "./AllowedPageSize";

const CustomTable = ({ keyColumn, pageSize, columns, values, onRowDblClick, paging, summary, summaryColumn, onClick, wordWrap, onRowClick, excel, onExcel,onCellClick }) => {
  return (
    <div className="wrap_table">
      <DataGrid
        keyExpr={keyColumn}
        id={"dataGrid"}
        className={"table"}
        dataSource={values}
        showBorders={true}
        showColumnLines={false}
        focusedRowEnabled={true}
        columnAutoWidth={false}
        noDataText=""
        onRowDblClick={onRowDblClick}
        onRowClick={onRowClick}
        onExporting={onExcel}
        onCellClick={onCellClick}
        onCellPrepared={(e) => {
          if (e.rowType === 'header') {
            e.cellElement.style.textAlign = 'center';
            e.cellElement.style.fontWeight = 'bold';
          }
        }}
        wordWrapEnabled={wordWrap}
      >
        {GridRows({columns, onClick})}
        <Paging defaultPageSize={pageSize} enabled={paging} />
        <Pager
          displayMode="full"
          showNavigationButtons={true}
          showInfo={false}
          showPageSizeSelector={true}
          allowedPageSizes={AllowedPageSize(values)}
        />
        

        {summary&&
          <Summary>
            {summaryColumn.map(item => (
              <TotalItem
                key={item.key}
                column={item.value}
                summaryType={item.type}
                displayFormat={item.format}
                valueFormat={{ type: 'fixedPoint', precision: item.precision }} // 천 단위 구분자 설정
              />
            ))}
          </Summary>
        }
      {excel &&
      <Export enabled={true} >
      </Export>
      }
      </DataGrid>
    </div>
  );
};

export default CustomTable;