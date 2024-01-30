import DataGrid, { Column, Pager, Paging } from "devextreme-react/data-grid";
import { Button } from "devextreme-react/button";

const CustomTable = ({ keyColumn, pageSize, columns, values, onRowDblClick, paging }) => {

  const gridRows = () => {
    const result = [];
    for(let i = 0; i < columns.length; i++) {
        const { key, value, width, alignment, button } = columns[i];
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
      </DataGrid>
  </div>
  );
};

export default CustomTable;
