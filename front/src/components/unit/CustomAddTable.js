import DataGrid, { Column, Editing, Pager, Paging, ValidationRule } from "devextreme-react/data-grid";
import { Button } from "devextreme-react/button";
import CustomCdComboBox from "./CustomCdComboBox";

import { useState, useEffect, useRef } from "react";
import { Lookup } from "devextreme-react";

import ApiRequest from "utils/ApiRequest";

const CustomAddTable = ({ menuName, columns, values, onRowDblClick, pagerVisible, prjctId, json, bgtMngOdr }) => {
  const [param, setParam] = useState([]);
  const [value, setValue] = useState([]);
  const [gridColumns, setGridColumns] = useState([]);
  const dataGridRef = useRef(null); // DataGrid 인스턴스에 접근하기 위한 ref
  
  //useEffect를 사용하여 param이 변경될 때마다 실행
  useEffect(() => {
    console.log("param",param);
    console.log("param",Object.keys(param).length);
    
  }, [param]);

  useEffect(() => {
    console.log("value",value);
  }, [value]);
  


  //부모창에서 받아온 데이터를 상태에 담아주는 useEffect
  useEffect(() => {
    setValue(values);
  }, [values]);

  useEffect(() => {
    // columns 상태 업데이트 로직 
    setGridColumns(columns);
  }, [columns]);



  const handleChgState = ({name, value}) => {

    setValue(currentValue =>({
      ...currentValue,
     [name] : value,
    }));
  };
  
  
  // 콤보박스 셀 렌더 함수
  const onEditCellRender = (column) => {
    const dynamicValue = value[column.key];
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
  
  // const btnOnclick = () => {

  //   console.log(value);
  // }

  //데이터 그리드에 로우가 추가될 때마다 실행
  const onRowInserted = (e) => {
    e.data.prjctId = prjctId;
    e.data = {  
      ...e.data,
      [json.keyColumn] : 1,  //데이터 순번  TODO. 데이터 순번은 어떻게 처리할지 고민해보기
    }
    //TODO. 컨소시엄은 예산관리 차수 빼고, 재료비에서는 예산관리 차수 추가
    e.data.bgtMngOdr = bgtMngOdr;

    setParam(currentParam => {
      const newData = { ...e.data, ...value};
      delete newData.__KEY__; // __KEY__ 속성을 삭제합니다.
      return {
        ...currentParam,
        ...newData,
      };
    });
  }

  useEffect(() => {
    if(Object.keys(param).length > 0){
      onRowInserting();
    }
  }, [param]);


  const onRowInserting = async() => {
    //api param 설정
    const paramInfo = [
      { tbNm: json.table },
      param,
    ];

    try {
      const response = await ApiRequest("/boot/common/commonInsert", paramInfo);
          if(response > 0) {
            alert('데이터가 성공적으로 저장되었습니다.');
            console.log(response);
          }    
    } catch (error) {
        console.error('Error ProjectChangePopup insert', error);
    }
  }



  //데이터 그리드에 로우가 수정될 때마다 실행
  const onRowUpdated = (e) => {
    console.log("e.data",e.data);
  }


  //데이터 그리드에 로우가 삭제될 때마다 실행
  const onRowRemoved = async(e) => {

    const gridInstance = dataGridRef.current.instance;
    const rowIndex = gridInstance.getRowIndexByKey(e.data[json.keyColumn]);
    console.log("e.data[json.keyColumn]",e.data[json.keyColumn]);
    console.log("gridInstance",gridInstance);
    console.log("rowIndex",rowIndex);
      if (rowIndex >= 0) {
        const paramInfo = e.data;
        const paramInfoNew = pick(paramInfo, ['prjctId', 'bgtMngOdr', 'matrlCtSn']);

        const param = [
          { tbNm: json.table },
          
          paramInfoNew
        ];

        try {
          const response = await ApiRequest("/boot/common/commonDelete", param);
            if(response > 0) {
              alert('데이터가 성공적으로 삭제되었습니다.');
              gridInstance.deleteRow(rowIndex);
              console.log(response);
            }
        }catch (error) {
          console.error(error);
        } 
      }
    console.log("dataGridRef",gridInstance);
    console.log("e.data",e.data);
  }

  //배열에서 특정 키만 추출
  const pick = (source, keys) => {
    const result = {};
    keys.forEach(key => {
      if (key in source) {
        result[key] = source[key];
      }
    });
    return result;
  };
 

  return (
    <div className="wrap_table">
    <DataGrid
      ref={dataGridRef}
      keyExpr={json.keyColumn}
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
          dataType={column.type ==="NumberBox" ? "number" : "string"}
        >
          {/* {column.type=="ComboBox"?   
            <Lookup dataSource={column.test} valueExpr={column.Name} displayExpr={column.ID} />
          :null}  */}

          {/* <ValidationRule type={column.validation ==="reauired" ? "required" : null} /> */}

        </Column>
    ))}




    </DataGrid>
    {/* <Button onClick={btnOnclick} text="저장"/> */}
  </div>
  );
};

export default CustomAddTable;
