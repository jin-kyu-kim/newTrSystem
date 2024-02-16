import DataGrid, { Column, Editing, Pager, Paging, } from "devextreme-react/data-grid";
import { Button } from "devextreme-react/button";
import CustomCdComboBox from "./CustomCdComboBox";

import { useState, useEffect } from "react";
import { Lookup } from "devextreme-react";

const CustomAddTable = ({ keyColumn, menuName, columns, values, onRowDblClick, pagerVisible, prjctId, json }) => {
  const [param, setParam] = useState([]);
  const [value, setValue] = useState([]);
  const [gridColumns, setGridColumns] = useState([]);

  //useEffect를 사용하여 param이 변경될 때마다 실행
  useEffect(() => {
    console.log("param",param);
  }, [param]);

  useEffect(() => {
    console.log("value",value);
  }, [value]);
  


  //부모창에서 받아온 데이터를 상태에 담아주는 useEffect
  useEffect(() => {
    setValue(values);
  }, [values]);

  useEffect(() => {
    // columns 상태 업데이트 로직 (필요한 경우)
    setGridColumns(columns);
  }, [columns]);



  const handleChgState = ({name, value}) => {

    setParam(currentParam =>({
      ...currentParam,
     [name] : value,
    }));

    setValue(currentValue =>({
      ...currentValue,
     [name] : value,
    }));
  };
  
  
  // 콤보박스 셀 렌더 함수
  //TODO :  한 로우에 콤보박스가 2개 이상일 때 axios에러가 뜸
  const onEditCellRender = (column) => {
    // console.log("column",column);
    const dynamicValue = param[column.key];
      return (
          <CustomCdComboBox
              param={column.cd}
              placeholderText="[선택]"
              name={column.key}
              onSelect={handleChgState}
              value={dynamicValue}
          />
      );
    };
  
  const btnOnclick = () => {

    console.log(value);
  }

  //데이터 그리드에 로우가 추가될 때마다 실행
  const onRowInserted = (e) => {
    e.data.prjctId = prjctId;
    console.log("e.data",e.data);

  }

  //데이터 그리드에 로우가 수정될 때마다 실행
  const onRowUpdated = (e) => {
    console.log("e.data",e.data);
  }

  //데이터 그리드에 로우가 삭제될 때마다 실행
  const onRowRemoved = (e) => {
    console.log("e.data",e.data);
  }
 

  return (
    <div className="wrap_table">
    <DataGrid
      keyExpr={keyColumn}
      id={"dataGrid"}
      className={"table"}
      dataSource={value}
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
      onRowUpdated={onRowUpdated}  
      onRowRemoved={onRowRemoved}
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

      {gridColumns.map(column => (
        <Column 
          key={column.key} 
          dataField={column.key} 
          caption={column.value} 
          width={column.width} 
          alignment={column.alignment || 'center'}
          editCellRender={column.type === "ComboBox" ? () => onEditCellRender(column) : null}
        >
          {/* {column.type=="ComboBox"?   
            <Lookup dataSource={column.test} valueExpr={column.Name} displayExpr={column.ID} />
          :null}  */}


        </Column>
    ))}




    </DataGrid>
    <Button onClick={btnOnclick} text="저장"/>
  </div>
  );
};

export default CustomAddTable;
