import DataGrid, { Column, Editing, Pager, Paging, } from "devextreme-react/data-grid";
import { Button } from "devextreme-react/button";

import { useState } from "react";

const CustomAddTable = ({ menuName, columns, values, onRowDblClick, pagerVisible, projId }) => {

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

	}
  
  const btnOnclick = () => {

    console.log(values);
  }

  const onRowInserted = (e) => {
    e.data.prjctId = projId;

  }

  return (
    <div className="wrap_table">
    <DataGrid
      keyExpr="cnsrtmSn"
      id={"dataGrid"}
      className={"table"}
      dataSource={values}
      showBorders={true}
      showColumnLines={true}
      focusedRowEnabled={false}
      columnAutoWidth={false}
      noDataText="No data"
      onRowDblClick={onRowDblClick}
      onCellPrepared={(e) => {
        if (e.rowType === 'header') {
          e.cellElement.style.textAlign = 'center';
          e.cellElement.style.fontWeight = 'bold';
        }
      }} 
      onRowInserted={onRowInserted}    
    >
      <Editing 
        mode="row"
        allowDeleting={true}
        allowAdding={true}
        allowUpdating={true}
      />
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
    <Button onClick={btnOnclick} text="저장"/>
  </div>
  );
};

export default CustomAddTable;
