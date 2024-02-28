import DataGrid, { Column, Pager, Paging, Summary, TotalItem } from "devextreme-react/data-grid";
import { Button } from "devextreme-react/button";


const CustomTable = ({ keyColumn, pageSize, columns, values, onRowDblClick, paging, summary, summaryColumn}) => {

  const gridRows = () => {
    const result = [];
    for(let i = 0; i < columns.length; i++) {
        const { key, value, width, alignment, button, visible } = columns[i];
        if(button) {
          result.push(
            <Column 
              key={key} 
              dataField={key} 
              caption={value} 
              width={width} 
              alignment={alignment || 'center'}
              cellRender={() => buttonRender(button)}>
            </Column>


        );
        } else {
            if(!visible){
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
    return result;
  }

  const buttonRender = (button) => {
    return(
      <Button text={button}/>
    )
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
        onCellPrepared={(e) => {
          if (e.rowType === 'header') {
            e.cellElement.style.textAlign = 'center';
            e.cellElement.style.fontWeight = 'bold';
          }
        }}
      >
        <Paging defaultPageSize={pageSize} enabled={paging} />
        <Pager
          displayMode="full"
          showNavigationButtons={true}
          showInfo={false}
          showPageSizeSelector={true}
          allowedPageSizes={[20, 50, 80, 100]}
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
                        valueFormat={{ type: 'fixedPoint', precision: 0 }} // 천 단위 구분자 설정
                    />
                  ))}
          </Summary>
        }

      </DataGrid>
  </div>
  );
};

export default CustomTable;
