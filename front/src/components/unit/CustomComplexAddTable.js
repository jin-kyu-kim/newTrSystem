import React, { useState } from "react";

import DataGrid, { Column, Editing, Grouping, GroupPanel, SearchPanel} from "devextreme-react/data-grid";

import CustomCdComboBox from "./CustomCdComboBox";

const CustomComplexAddTable = ({ keyColumn, manuName, columns, values, prjctId }) => {
    const [initParam, setInitParam] = useState({
        priceCd: "",
      });

  const gridRows = () => {
    const result = [];
    columns.map(column => {
        result.push(
            <Column 
                key={column.key} 
                dataField={column.key} 
                caption={column.value} 
                width={column.width} 
                alignment={column.alignment || 'center'}
                editCellRender={column.type=="ComboBox"?onEditCellRender:null}
                >
              </Column>
        );
    })
    return result;
  }

  const handleChgState = ({name, value}) => {
    setInitParam({
      ...initParam,
     [name] : value,
    });
  };

    // 콤보박스 셀 렌더 함수
    const onEditCellRender = (data) => {
        return (
            <CustomCdComboBox
                param="VTW045"
                placeholderText="[형태]"
                name="priceCd"
                onSelect={handleChgState}
                value={initParam.priceCd}
            />
        );
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
      noDataText="No data"
      onCellPrepared={(e) => {
        if (e.rowType === 'header') {
          e.cellElement.style.textAlign = 'center';
          e.cellElement.style.fontWeight = 'bold';
        }
      }} 
    //   onRowInserted={onRowInserted}    
    >
      <Editing 
        mode="row"
        allowDeleting={true}
        allowAdding={true}
        allowUpdating={true}
      />
      {gridRows()}
      {/* <GroupPanel visible={true} /> */}
      <SearchPanel visible={true} highlightCaseSensitive={true} />
      <Grouping autoExpandAll={false} />
    </DataGrid>
  </div>
  );
};

export default CustomComplexAddTable;
