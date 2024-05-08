import DataGrid, { Column, Export, Pager, Paging, Summary, TotalItem, GroupItem, Grouping, MasterDetail } from "devextreme-react/data-grid";
import GridRows from "./GridRows";
import AllowedPageSize from "./AllowedPageSize";

const CustomTable = ({ keyColumn, pageSize, columns, values, onRowDblClick, paging, summary, summaryColumn, onClick,
                       wordWrap, onRowClick, excel, onExcel,onCellClick, grouping, groupingData, groupingCustomizeText,
                       masterDetail, handleExpanding, focusedRowIndex, handleCheckBoxChange, checkBoxValue, prjctCmpr }) => {
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
        onRowExpanding={handleExpanding}
        onRowDblClick={onRowDblClick}
        focusedRowIndex={focusedRowIndex}
        onRowClick={onRowClick}
        onExporting={onExcel}
        onCellClick={onCellClick}
        onCellPrepared={(e) => {

          if (e.rowType === 'header') {
            e.cellElement.style.textAlign = 'center';
            e.cellElement.style.fontWeight = 'bold';
          }

          // 프로젝트 변경원가 비교 시 사용
          if(prjctCmpr!= undefined && prjctCmpr == true) {
            if(e.rowType === 'data' && e.column.dataField === 'ajmtBgt' && e.data.ajmtBgt != 0) {
              e.cellElement.style.color = 'red'
            }
          }
        }}
        wordWrapEnabled={wordWrap}
        columnMinWidth={40}
      >
        {GridRows({columns, onClick, handleCheckBoxChange, checkBoxValue })}
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

        {grouping &&
          <Column
            dataField={groupingData.dataField}
            caption={groupingData.caption} 
            customizeText={groupingCustomizeText}
            groupIndex={0}
        />
        }

        {grouping &&
          <Grouping autoExpandAll={true} />
        }

        {grouping &&
          <Summary> 
          {grouping.map(item => (
            <GroupItem
              column={item.key}
              summaryType={item.summaryType}
              valueFormat={item.valueFormat}
              displayFormat={item.displayFormat}
              alignByColumn={true}
            />
            ))}
        
          <TotalItem
            column={groupingData.totalTextColumn}
            customizeText={() => {
              return "총 계";
            }}
          />
          {grouping.map(item => (
            <TotalItem
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
      </DataGrid>
    </div>
  );
};

export default CustomTable;