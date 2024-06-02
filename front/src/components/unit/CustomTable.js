import DataGrid, { Column, Export, Pager, Paging, Summary, TotalItem, GroupItem, Grouping, MasterDetail, Scrolling, ColumnFixing } from "devextreme-react/data-grid";
import AllowedPageSize from "./AllowedPageSize";
import GridRows from "./GridRows";

const CustomTable = ({ keyColumn, pageSize, columns, values, onRowDblClick, paging, summary, summaryColumn, onClick,
                       wordWrap, onRowClick, excel, onExcel,onCellClick, grouping, groupingData, groupingCustomizeText, onCellPrepared,
                       masterDetail, handleExpanding, focusedRowIndex, handleCheckBoxChange, checkBoxValue, prjctCmpr,
                       noDataText, calculateCustomSummary, scrolling, dataSource, pagination, onOptionChanged, remoteOperations }) => {

  const columnWidth = scrolling && { columnWidth: "auto" };
  return (
    <div className="wrap_table">
      <DataGrid
        keyExpr={keyColumn}
        id={"dataGrid"}
        dataSource={values != undefined ? values : dataSource}
        showBorders={true}
        showColumnLines={true}
        focusedRowEnabled={true}
        columnAutoWidth={false}
        noDataText={noDataText}
        onRowExpanding={handleExpanding}
        onRowDblClick={onRowDblClick}
        focusedRowIndex={focusedRowIndex}
        onRowClick={onRowClick}
        onExporting={onExcel}
        onCellClick={onCellClick}
        {...columnWidth}
        onCellPrepared={(e) => {
          onCellPrepared && onCellPrepared(e);

          if (e.rowType === 'header') {
            e.cellElement.style.textAlign = 'center';
            e.cellElement.style.fontWeight = 'bold';
          }

          // 프로젝트 변경원가 비교 시 사용
          if(prjctCmpr!= undefined && prjctCmpr == true) {
            if(e.rowType === 'data' && e.column.dataField === 'ajmtBgt' && e.data.ajmtBgt < 0) {
              e.cellElement.style.color = 'blue'
            }

            if(e.rowType === 'data' && e.column.dataField === 'ajmtBgt' && e.data.ajmtBgt > 0) {
              e.cellElement.style.color = 'red'
            }
          }
        }}
        wordWrapEnabled={wordWrap}
        scrolling={true}
        paging={paging ? pagination : paging}
        onOptionChanged={onOptionChanged}
        remoteOperations={remoteOperations}
      >
        {GridRows({columns, onClick, handleCheckBoxChange, checkBoxValue })}
        <Paging defaultPageSize={pageSize} enabled={paging} />
        <Pager
          displayMode="full"
          showNavigationButtons={true}
          showInfo={false}
          showPageSizeSelector={true}
          allowedPageSizes={AllowedPageSize(values != undefined ? values : [])}
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

        {grouping &&
          <Column 
            groupIndex={0}
            caption={groupingData.caption} 
            dataField={groupingData.dataField}
            customizeText={groupingCustomizeText}
        />
        }

        {grouping &&
          <Grouping autoExpandAll={true} />
        }

        {grouping &&
          <Summary calculateCustomSummary={calculateCustomSummary}> 
          {grouping.map(item => (
            <GroupItem
              key={item.key}
              column={item.key}
              name={item.name}
              summaryType={item.summaryType}
              valueFormat={item.valueFormat}
              displayFormat={item.displayFormat}
              alignByColumn={true}
              customizeText={item.totalText}
            />
          ))}
        
          <TotalItem
            key={groupingData.dataField}
            name={groupingData.name}
            column={groupingData.totalTextColumn}
            customizeText={() => {
              return "총 계";
            }}
          />
          {grouping.map(item => (
            <TotalItem
                key={item.key}
                name={item.key}
                column={item.key}
                summaryType={item.summaryType}
                valueFormat={item.valueFormat}
                displayFormat={item.displayFormat}
              />
          ))}
          </Summary>
        }
        
        {excel &&
        <Export enabled={true} >
        </Export>
        }
        {masterDetail &&
        <MasterDetail
            style={{backgroundColor: 'lightBlue'}}
            enabled={true}
            component={masterDetail}
        />}
        {scrolling &&
        <>
          <ColumnFixing enabled={true} />
          <Scrolling mode="virtual" />
        </> }

      </DataGrid>
    </div>
  );
};
export default CustomTable;