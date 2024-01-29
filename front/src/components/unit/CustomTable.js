import DataGrid, { Column, Editing, Pager, Paging, } from "devextreme-react/data-grid";
import { Button } from "devextreme-react/button";

const CustomTable = ({ menuName, columns, values, onRowDblClick, pagerVisible  }) => {

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
              cellRender={(e) => buttonRender(e)}>
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

  const buttonRender = (e) => {
    if(menuName === "ProjectHrCtAprv") {
      return(
        <Button text="시간비용청구현황"/>
      )
    } 
	}

  return (
    <div className="wrap_table">
    <DataGrid
      keyExpr="prjctId"
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
      <Paging defaultPageSize={20} />
      <Pager
        displayMode="full"
        showNavigationButtons={true}
        showInfo={false}
        showPageSizeSelector={true}
        visible={pagerVisible}
        allowedPageSizes={[20, 50, 80, 100]}
      />

      {gridRows()}
    </DataGrid>
    
  </div>
  );
};

export default CustomTable;
