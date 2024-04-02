import DataGrid, { Column, Export, Pager, Paging, Summary, TotalItem } from "devextreme-react/data-grid";
import { Button } from "devextreme-react/button";

const CustomTable = ({ keyColumn, pageSize, columns, values, onRowDblClick, paging, summary, summaryColumn, onClick, wordWrap, onRowClick, excel, onExcel }) => {

  const gridRows = () => {
    const result = [];
    for (let i = 0; i < columns.length; i++) {
      const { key, value, width, alignment, button, visible, toggle, subColumns } = columns[i];

      if (button) {
        result.push(
          <Column
            key={key}
            dataField={key}
            caption={value}
            width={width}
            alignment={alignment || 'center'}
            cellRender={({ data }) => buttonRender(button, data)}>
          </Column>
        );
      } else {
        if (!visible) {
          if (subColumns && subColumns.length > 0) {
            result.push(
              <Column key={`${key}_subColumns`} caption={value} alignment={alignment || 'center'}>
                {subColumns.map(subCol => (
                  <Column
                    key={subCol.key}
                    dataField={subCol.key}
                    caption={subCol.value}
                    width={subCol.width}
                    alignment={subCol.alignment || 'center'}
                  />
                ))}
              </Column>
            );
          }else {
            result.push(
                <Column
                  key={key}
                  dataField={key}
                  caption={value}
                  width={width}
                  alignment={alignment || 'center'}>
                </Column>
              );

          }
        }
      }
    }
    return result;
  }

  const buttonRender = (button, data) => {
    let disabled = false;
    if(button.able != null && data != null && data[button.able.key] != button.able.value){
      disabled = true;
    }
    return(
      <Button name={button.name} text={button.text} onClick={(e) => {onClick(button, data)}} disabled={disabled}/>
    )
  }

  const allowedPageSize = () =>{
    let pageSizes=[];
    if(values != null) {
      if(values.length < 20){
        pageSizes = [5, 10, 'all']
      }else if(values.length  < 50 ){
        pageSizes =  [10, 20, 'all']
      }else if(values.length  < 80) {
        pageSizes =  [20, 50, 'all']
      }else if(values.length  < 100){
        pageSizes =  [20, 50, 80, 'all']
      }else{
        pageSizes =  [20, 50, 80, 100]
      }
    }
    return pageSizes;
  }

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
        onCellPrepared={(e) => {
          if (e.rowType === 'header') {
            e.cellElement.style.textAlign = 'center';
            e.cellElement.style.fontWeight = 'bold';
          }
        }}
        wordWrapEnabled={wordWrap}
      >
        <Paging defaultPageSize={pageSize} enabled={paging} />
        <Pager
          displayMode="full"
          showNavigationButtons={true}
          showInfo={false}
          showPageSizeSelector={true}
          allowedPageSizes={allowedPageSize()}
        />
        {gridRows()}

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