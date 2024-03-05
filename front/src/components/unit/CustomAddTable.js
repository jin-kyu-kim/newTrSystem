import DataGrid, { Column, Editing, Pager, Paging, ValidationRule, Lookup} from "devextreme-react/data-grid";
import CustomCdComboBox from "./CustomCdComboBox";
import CustomComboBox from "./CustomComboBox";
import CustomDatePicker from "./CustomDatePicker";

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import ApiRequest from "utils/ApiRequest";

const CustomAddTable = ({ columns, values, onRowDblClick, pagerVisible, prjctId, json, bgtMngOdrTobe }) => {
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

  //부모창에서 받아온 데이터를 상태에 담아주는 useEffect
  useEffect(() => {
    setValue(values);
  }, [values]);

  useEffect(() => {
    // columns 상태 업데이트 로직 
    setGridColumns(columns);
  }, []);


  // 콤보박스 셀 값 변경 이벤트
  const handleChgState = ({name, value}) => {
    setSelectValue(prevState => ({
      ...prevState, 
      [name] : value
    }));
  };
  
  // 콤보박스 셀 렌더 함수
  const onEditCellRender = (column) => {
    if(column.subType === "ComboBox"){
      return (
        <CustomComboBox
          props={column.param}
          onSelect={handleChgState}
          placeholder={column.placeholder}        
          value={selectValue.outordEntrpsId}
        />
      );
    }else if(column.subType === "ComboCdBox"){
      return (
        <CustomCdComboBox
            param={column.cd}
            placeholderText={column.value}
            name={column.key2}
            onSelect={handleChgState}
            value={selectValue[column.key2]}  
        />
      );
    }};
  
  const getNumber = async() => {
    const paramInfo = {
      queryId: "projectMapper.retrieveChgPrmpcOdr",
      prjctId: prjctId,
      bgtMngOdr: bgtMngOdrTobe,
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
    //TODO. 코드정리 필요. 외주업체 부분.
    if(json.table === "OUTORD_ENTRPS_CT_PRMPC"){
        e.data.prjctId = prjctId;
        e.data.bgtMngOdr = bgtMngOdrTobe;
        
        e.data = {  
          ...e.data,
          ...selectValue
        }
      setParam(currentParam => {
        const newData = { ...e.data };
        delete newData.__KEY__; // __KEY__ 속성 삭제
        return {
          ...currentParam,
          ...newData,
        };
      });

    }else{

      let order= 0;
    const result = getNumber().then((value) => {
      if(value != null){
        order = value[json.keyColumn];
      }
      order++

      if(json.keyColumn === "matrlCtSn"){ //재료비에서 호출한 경우 차수 추가
        e.data.bgtMngOdr = bgtMngOdrTobe;
      }

      e.data.prjctId = prjctId;
      
      e.data = {  
        ...e.data,
        ...selectValue,
        [json.keyColumn] : order,  
      }
      
      setParam(currentParam => {
        const newData = { ...e.data };
        delete newData.__KEY__; // __KEY__ 속성 삭제
        delete newData[json.CdComboboxColumnNm]; // Nm 속성 삭제
        return {
          ...currentParam,
          ...newData,
        };
      });
    }); 
  }
  }

  useEffect(() => {
    if(Object.keys(param).length > 0){
      onRowInserting();
    }
  }, [param]);


  const onRowInserting = async() => {
    let paramInfo = [];
    if(json.subTable){
      param.giveYm = param.giveYm.slice(0,-3);
      paramInfo = [
        { tbNm: json.table, subTbNm: json.subTable},
        param,
      ];
      
    }else{
      paramInfo = [
        { tbNm: json.table },
        param,
      ];
    }
    //TODO. 외주업체부분 코드정리 필요,
    if(json.table === "OUTORD_ENTRPS_CT_PRMPC"){
      try {
        const response = await ApiRequest("/boot/prjct/saveOutordEntrpsPrmpc", paramInfo);
            if(response > 0) {
              alert('데이터가 성공적으로 저장되었습니다.');
              reload();
              console.log(response);
            }    
      } catch (error) {
          console.error('Error CustomAddTable insert', error);
      }

    }else{
      try {
        const response = await ApiRequest("/boot/common/commonInsert", paramInfo);
            if(response > 0) {
              alert('데이터가 성공적으로 저장되었습니다.');
              reload();
            }    
      } catch (error) {
          console.error('Error CustomAddTable insert', error);
      }
    }
  }

  //데이터 그리드에 로우가 수정될 때마다 실행
  const onRowUpdated = async(e) => {

    const paramInfo = {...e.data, ...selectValue};

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
        }
    }catch (error) {
      console.error(error);
    } 

  }

  //데이터 그리드에 로우가 삭제될 때마다 실행
  const onRowRemoved = async(e) => {
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
            }
        }catch (error) {
          console.error(error);
        } 
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
    state: { prjctId: prjctId, bgtMngOdrTobe: bgtMngOdrTobe },
    })
};

const lookupColumns = () => {
  if(json.table === "PRJCT_CNSRTM"){
    return (
      <Column
      dataField={json.lookupColumn.key}
      caption={json.lookupColumn.value}
      width={"13%"}
    >
      <Lookup dataSource={json.lookupInfo} displayExpr="Name" valueExpr="ID" />
    </Column>
    )
  }
}

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
        <Column 
          key={column.key} 
          dataField={column.key} 
          caption={column.value} 
          width={column.width} 
          alignment={column.alignment || 'center'}
          editCellRender={column.type === "special" ? () => onEditCellRender(column) : null}
          dataType={column.subType ==="NumberBox" ? "number" : 
                    column.subType ==="Date" ? "date" :
                     "string"}
        >
          {/* <ValidationRule type={column.validation ==="reauired" ? "required" : null} /> */}
        </Column>
    ))}
    {lookupColumns()}
    </DataGrid>
  </div>
  );
};

export default CustomAddTable;
