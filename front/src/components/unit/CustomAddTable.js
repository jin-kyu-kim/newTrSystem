import DataGrid, { Column, Editing, Pager, Paging, } from "devextreme-react/data-grid";
import { Button } from "devextreme-react/button";
import CustomCdComboBox from "./CustomCdComboBox";

import { useState, useEffect } from "react";

const CustomAddTable = ({ keyColumn, menuName, columns, values, onRowDblClick, pagerVisible, prjctId }) => {

  const [initParam, setInitParam] = useState({
    cnsrtmSn: "",
    slsAmRfltYn: "",
    matrlCtIemCd: "",
  });

  //useEffect를 사용하여 initParam이 변경될 때마다 실행
  useEffect(() => {
    console.log("initParam",initParam);
  }, [initParam]);
  

  const handleChgState = ({name, value}) => {
    setInitParam({
      ...initParam,
     [name] : value,
    });
  };
  
  // 콤보박스 셀 렌더 함수
  //TODO :  한 로우에 콤보박스가 2개 이상일 때 axios에러가 뜸
  const onEditCellRender = (column) => {
    const dynamicValue = initParam[column.key];
      return (
        // console.log("column.cd",column.cd),
          <CustomCdComboBox
              param={column.cd}
              placeholderText="[선택]"
              name={column.key}
              onSelect={handleChgState}
              value={dynamicValue}
          />
      );
    };
  
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
                editCellRender={column.type=="ComboBox"?()=>onEditCellRender(column):null}
                >
            </Column>
        );
    })
    return result;
  }

  
  const btnOnclick = () => {

    console.log(values);
  }

  const onRowInserted = (e) => {
    e.data.prjctId = prjctId;

  }
 
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
