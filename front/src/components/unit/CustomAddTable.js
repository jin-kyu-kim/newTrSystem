import DataGrid, { Column, Editing, Pager, Paging, ValidationRule, Lookup, RequiredRule} from "devextreme-react/data-grid";

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import ApiRequest from "utils/ApiRequest";

const CustomAddTable = ({ columns, values, pagerVisible, prjctId, json, bgtMngOdrTobe, cdValues, ctrtYmd, stbleEndYmd, deptId, targetOdr, bizSttsCd, atrzLnSn }) => {
  const navigate = useNavigate();
  const [param, setParam] = useState([]);
  const [value, setValue] = useState([]);
  const dataGridRef = useRef(null); // DataGrid 인스턴스에 접근하기 위한 ref

  //부모창에서 받아온 데이터를 상태에 담아주는 useEffect
  useEffect(() => {
    setValue(values);
  }, [values]);
  
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
      let order= 0;
    const result = getNumber().then((value) => {
      if(value != null){
        order = value[json.keyColumn];
      }
      order++

      //재료비, 외주업체에서 호출한 경우 차수 추가
      if(json.keyColumn === "matrlCtSn" || json.keyColumn === "outordEntrpsCtPrmpcSn"){ 
        e.data.bgtMngOdr = bgtMngOdrTobe;
      }
      e.data = {  
        ...e.data,
        "prjctId" : prjctId,
        [json.keyColumn] : order,  
      }

      setParam(currentParam => ({
        ...currentParam,
        ...e.data
      }));
    }); 
  }

  useEffect(() => {
    if(Object.keys(param).length > 0){
      onRowInserting();
    }
  }, [param]);


  //날짜 데이터 포맷팅
  const formatDate = (date) => {
    return `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
  };


  const onRowInserting = async() => {
    
    if(typeof(param.ctrtBgngYmd)==="object"){
      const formatCtrtBgngYmd = formatDate(param.ctrtBgngYmd);
      param.ctrtBgngYmd = formatCtrtBgngYmd;
    }
    if(typeof(param.ctrtEndYmd)=== "object"){
      const formatCtrtEndYmd = formatDate(param.ctrtEndYmd);
      param.ctrtEndYmd = formatCtrtEndYmd;
    }
    
     const paramInfo = [
        { tbNm: json.table },
        param,
      ];

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

  //데이터 그리드에 로우가 수정될 때마다 실행
  const onRowUpdated = async(e) => {

    const paramInfo = {...e.data};

    if(typeof(paramInfo.ctrtBgngYmd)==="object"){
      const formatCtrtBgngYmd = formatDate(paramInfo.ctrtBgngYmd);
      paramInfo.ctrtBgngYmd = formatCtrtBgngYmd;
    }
    if(typeof(paramInfo.ctrtEndYmd)=== "object"){
      const formatCtrtEndYmd = formatDate(paramInfo.ctrtEndYmd);
      paramInfo.ctrtEndYmd = formatCtrtEndYmd;
    }

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
    state: { prjctId: prjctId, 
             bgtMngOdrTobe: bgtMngOdrTobe,
             ctrtYmd: ctrtYmd, 
             stbleEndYmd: stbleEndYmd,
             deptId : deptId,  
             targetOdr : targetOdr,
             bizSttsCd : bizSttsCd,
             atrzLnSn : atrzLnSn},
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

      {columns.map((column,index) => (
        <Column 
          key={column.key} 
          dataField={column.key} 
          caption={column.value} 
          width={column.width} 
          alignment={column.alignment || 'center'}
          dataType={column.subType ==="NumberBox" ? "number" : 
                    column.subType ==="Date" ? "date" :
                     "string"}
          format={column.subType ==="NumberBox" ? column.format : 
                  column.subType ==="Date" ? column.format :
                   ""}
          min={column.subType ==="NumberBox" ? column.min : undefined}
          max={column.subType ==="NumberBox" ? column.max : undefined}
          validationRules={[
            ...(column.subType === "NumberBox" ? [{
              type: "range",
              min: column.min,
              max: column.max,
              message: `The value must be between ${column.min} and ${column.max}.` 
            }] : []),
            ...(column.required === "Y" ? [{ type: "required", message: "This field is required." }] : []),
            ...(column.type === "string" ? [{ type: "stringLength", min:column.min, max:column.max,  message: `The value must be between ${column.min} and ${column.max}.`  }] : [])
          ]}
        >
        {column.required === "Y" ? <RequiredRule /> : null}
        {column.type === "combo" ? <Lookup dataSource={cdValues} displayExpr={column.keyNm} valueExpr={column.key} />: 
         column.type === "comboYn" ? <Lookup dataSource={json.lookupInfo} displayExpr={column.keyNm} valueExpr={column.key} /> :
         null}
        </Column>
    ))}
    </DataGrid>
  </div>
  );
};

export default CustomAddTable;
