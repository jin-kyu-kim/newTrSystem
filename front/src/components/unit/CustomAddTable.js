import DataGrid, { Column, Editing, Pager, Paging, ValidationRule } from "devextreme-react/data-grid";
import CustomCdComboBox from "./CustomCdComboBox";

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Lookup } from "devextreme-react";

import ApiRequest from "utils/ApiRequest";

const CustomAddTable = ({ columns, values, onRowDblClick, pagerVisible, prjctId, json, bgtMngOdr }) => {
  const navigate = useNavigate();
  const [param, setParam] = useState([]);
  const [value, setValue] = useState([]);
  const [gridColumns, setGridColumns] = useState([]);
  const dataGridRef = useRef(null); // DataGrid 인스턴스에 접근하기 위한 ref
  const [selectValue, setSelectValue] = useState([]);
  
  //useEffect를 사용하여 param이 변경될 때마다 실행 >> TODO.개발완료 후 삭제
  useEffect(() => {
    console.log("param 변경 !!",param);
    
  }, [param]);

  useEffect(() => {
    console.log("value 변경 !!",value);
  }, [value]);
  


  //부모창에서 받아온 데이터를 상태에 담아주는 useEffect
  useEffect(() => {
    setValue(values);
  }, [values]);

  useEffect(() => {
    // columns 상태 업데이트 로직 
    setGridColumns(columns);
  }, [columns]);


  // 콤보박스 셀 값 변경 이벤트
  const handleChgState = ({name, value}) => {
    setSelectValue(value);
  };
  
  // 콤보박스 셀 렌더 함수
  const onEditCellRender = (column) => {
      return (
          <CustomCdComboBox
              param={column.cd}
              placeholderText="[선택]"
              name={column.key}
              onSelect={handleChgState}
              value={selectValue}
          />
      );
    };
  
  const getNumber = async() => {
    const paramInfo = {
      queryId: "projectMapper.retrieveChgPrmpcOdr",
      prjctId: prjctId,
      bgtMngOdr: bgtMngOdr,
      [json.keyColumn] : json.keyColumn
    };

    try {
      const response = await ApiRequest("/boot/common/queryIdSearch", paramInfo);
          if(response.length > 0) {       
            return response[0];
          }    
    } catch (error) {
        console.error('Error ProjectChangePopup insert', error);
    }
  }

  //데이터 그리드에 로우가 추가될 때마다 실행
  const onRowInserted = (e) => {
      let order= 0;
    const result = getNumber().then((value) => {
      if(value != null){
        order = value[json.keyColumn];
      }
      order++

      e.data.prjctId = prjctId;
      e.data.bgtMngOdr = bgtMngOdr;
      e.data = {  
        ...e.data,
        [json.CdComboboxColumn] : selectValue,
        [json.keyColumn] : order,  
      }
      
      setParam(currentParam => {
        const newData = { ...e.data };
        delete newData.__KEY__; // __KEY__ 속성 삭제
        return {
          ...currentParam,
          ...newData,
        };
      });
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
            reLoad();
            console.log(response);
          }    
    } catch (error) {
        console.error('Error ProjectChangePopup insert', error);
    }
  }

  //데이터 그리드에 로우가 수정될 때마다 실행
  const onRowUpdated = async(e) => {
    
    const paramInfo = e.data;
    const paramKey = pick(paramInfo, json.pkColumns);
    delete paramInfo[json.CdComboboxColumnNm]; 

    const param = [
      { tbNm: json.table },
        paramInfo,              //수정할 컬럼값
        paramKey                //조건값
    ];

    try {
      const response = await ApiRequest("/boot/common/commonUpdate", param);
        if(response > 0) {
          alert('데이터가 성공적으로 수정되었습니다.');
          reload();
          console.log(response);
        }
    }catch (error) {
      console.error(error);
    } 

  }

  //데이터 그리드에 로우가 삭제될 때마다 실행
  const onRowRemoved = async(e) => {
    // const gridInstance = dataGridRef.current.instance;
    // const rowIndex = gridInstance.getRowIndexByKey(e.data[json.keyColumn]);
    //   if (rowIndex >= 0) {
        const paramInfo = e.data;
        const paramInfoNew = pick(paramInfo, json.pkColumns);

        const param = [
          { tbNm: json.table },
          
          paramInfoNew
        ];

        try {
          const response = await ApiRequest("/boot/common/commonDelete", param);
            if(response > 0) {
              alert('데이터가 성공적으로 삭제되었습니다.');
              reload();
              console.log(response);
            }
        }catch (error) {
          console.error(error);
        } 
      // }
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

const reload = () => {
    navigate("../project/ProjectChange",
        {
    state: { prjctId: prjctId, bgtMngOdr: bgtMngOdr },
    })
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

      {gridColumns.map((column,index) => (
        console.log("column",column),
        <Column 
          key={column.key} 
          dataField={column.key} 
          caption={column.value} 
          width={column.width} 
          alignment={column.alignment || 'center'}
          editCellRender={column.type === "ComboBox" ? () => onEditCellRender(column) : null}
          dataType={column.type ==="NumberBox" ? "number" : "string"}
        >
          {/* <ValidationRule type={column.validation ==="reauired" ? "required" : null} /> */}
        </Column>
    ))}
    {/* <Column
          dataField="StateID"
          caption="State"
          width={125}
        >
          <Lookup dataSource={test} displayExpr="Name" valueExpr="ID" />
        </Column> */}
    </DataGrid>
  </div>
  );
};

export default CustomAddTable;
