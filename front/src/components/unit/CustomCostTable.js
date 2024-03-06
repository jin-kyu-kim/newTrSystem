import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "devextreme-react";
import { parse, format, addMonths } from 'date-fns';

import ApiRequest from "../../utils/ApiRequest";
import CustomPopup from "../unit/CustomPopup";
import ProjectChangePopup from "../../pages/project/manage/ProjectChangePopup";

import DataGrid, {
  Column,
  SearchPanel,
  Scrolling,
  Summary,
  TotalItem,
  ColumnFixing
} from "devextreme-react/data-grid";

const CustomCostTable = ({
  keyColumn,
  columns,
  values,
  summaryColumn,
  popup,
  labelValue,
  json,
  ctrtYmd,
  bizEndYmd,
  prjctId,
  bgtMngOdrTobe,
  onHide,
}) => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState([]); //사업시작일, 사업종료일을 받아와서 월별로 나눈 배열을 담을 상태
  const dataGridRef = useRef(null); // DataGrid 인스턴스에 접근하기 위한 ref
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [summaryColumns, setSummaryColumns] = useState(summaryColumn); 
  const [transformedData, setTransformedData] = useState([]);
  const editColumn = ["수정", "삭제"];
  // console.log("보라 values", values);

  useEffect(() => {
    const deleteArray = [...json.pkColumns, ...json.nomalColumns, ...json.CdComboboxColumnNm];
    deleteArray.push("total");

    // console.log("deleteArray", deleteArray);

    let temp = {...selectedItem};

    for (let i = 0; i < deleteArray.length; i++) {
      delete temp[deleteArray[i]];
    }

    const transformedData = Object.keys(temp).map((key) => {
        // 키에서 연도와 월을 분리하고 형식을 변경합니다.
        const formattedKey = key.replace('년 ', '-').replace('월', '');        
        console.log("formattedKey???머얄망", formattedKey);       
        return {
          id: formattedKey,
          value: temp[key]
        };
      });
      
      setTransformedData(transformedData);

  }, [selectedItem]);

  const showPopup = (data) => {
    // console.log("popup data!!", data);
    setIsPopupVisible(true);
    setSelectedItem(data); // 팝업에 표시할 데이터 설정
  };

  const hidePopup = () => {
    setIsPopupVisible(false);
    handleCancel();
  };
  
  const updateSummaryColumn = (periods) => {
    const newSummaryColumns = periods.map(period => ({
      key: period, value: period, type: "sum", format: json.format
    }));
    // 상태 업데이트 함수를 사용하여 summaryColumn 상태 업데이트
    setSummaryColumns(prevSummaryColumns => [...prevSummaryColumns, ...newSummaryColumns]);
  };

  //파라미터로 받아온 사업시작, 사업종료월을 파라미터로 포함된 월의 갯수를 배열로 반환
  useEffect(() => {
      const getPeriod = (startDate, endDate) => {
        const start = startDate ? parse(startDate, 'yyyy-MM-dd', new Date()) : new Date();
        const end = endDate ? parse(endDate, 'yyyy-MM-dd', new Date()) : addMonths(start, 15);
        let periods = [];
        let currentDate = start;
        while (currentDate  <= end) {
          periods.push(format(currentDate, 'yyyy년 MM월'));
          currentDate = addMonths(currentDate, 1); 
        }
        setPeriod(periods);
        updateSummaryColumn(periods);
    };
    getPeriod(ctrtYmd, bizEndYmd);
  }, []);

  //gridRows가 실행되는 시점 잡아주기.
  useEffect(() => {
    if(period){
      gridRows();
    }
  } ,[period]);

  
  const onCellRenderEdit = ({data}) => {
    // console.log("data",data);
    return (
      <Button
        onClick={() => showPopup(data)}
        text="수정"
        />
    );
  };

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

  //행 삭제
  const onCellRenderDelete = (cellInfo) => {
    const gridInstance = dataGridRef.current.instance;

    const rowIndex = gridInstance.getRowIndexByKey(cellInfo.data[json.keyColumn]); 
    return (
      <Button 
        onClick={ async () => { 
              if (rowIndex >= 0) {
                const paramInfo = cellInfo.data;
                const paramInfoNew = pick(paramInfo, json.pkColumns); 
                const param = [
                  { tbNm: json.table },
                  paramInfoNew
                ];
                
                try {
                  const response = await ApiRequest("/boot/common/commonDelete", param); 
                    if(response > 0) {
                      alert('데이터가 성공적으로 삭제되었습니다.');
                      handleCancel();
                      console.log(response)
                    }
                }catch (error) {
                  console.error(error);
                }               
              }
          }}
        text="삭제"
      />
    );
  };

  const handleAddRow = () => {
    showPopup();
  };

  //취소버튼 클릭시
  const handleCancel = () => {
    navigate("../project/ProjectChange",
        {
    state: { prjctId: prjctId, bgtMngOdrTobe: bgtMngOdrTobe, ctrtYmd: ctrtYmd, bizEndYmd: bizEndYmd},
    })
  };

  //TODO. fixed가 왜 동작하지 않는지...? 후...
  const gridRows = () => {
    const result = [];
    columns.map((column) => {
      result.push(
        <Column
          key={column.key}
          dataField={column.key}
          caption={column.value}
          alignment={"center"}
          fixed={true}
          dataType={column.subType ==="NumberBox" ? "number" : 
                    column.subType ==="Date" ? "date" :
                     "string"}
          format={column.subType === "Date" ? "yyyy-MM-dd" : ""}
        ></Column>     
      );
    });
    period.map((periodItem, index) => {
      result.push(
        <Column
          key={index}
          dataField={periodItem}
          caption={periodItem}
          alignment={"center"}
          // visibility={"hidden"}
          fixed={true}
          format={json.popupNumberBoxFormat}

        ></Column>
      );
    });
    editColumn.map((column) => {
      result.push(
        <Column
          key={column}
          dataField={column}
          caption={column}
          alignment={"center"}
          cellRender={
            column === "수정"
              ? (cellData) => onCellRenderEdit(cellData)
              : (cellData) => onCellRenderDelete(cellData)
          }
          fixed={true}
          fixedPosition="right"
        ></Column>  
      );
    });
    return result;
  };
  

  return (
    <div className="">
      <DataGrid
        ref={dataGridRef}
        keyExpr={keyColumn}
        id={"dataGrid"}
        className={"table"}
        dataSource={values}
        showBorders={true}
        showColumnLines={true}
        focusedRowEnabled={false}
        columnAutoWidth={true}
        width="100%"
        height="100%"
        sorting={{ mode: "none" }}
        noDataText="No data"
        columnWidth={"auto"}
        onCellPrepared={(e) => {
          if (e.rowType === "header") {
            e.cellElement.style.textAlign = "center";
            e.cellElement.style.fontWeight = "bold";
          }
        }}
      >
        {gridRows()}
        <SearchPanel
          visible={true}
          highlightCaseSensitive={true}
          placeholder="자유롭게 입력하세요"
          width="100%"
        />
        <Scrolling columnRenderingMode="standard" />
        <Summary>
          {summaryColumns.map((item) => (
            <TotalItem
              key={item.key}
              column={item.value}
              summaryType={item.type}
              displayFormat={item.format}
              valueFormat={{ type: "fixedPoint", precision: json.precision }} // 천 단위 구분자 설정
            />
          ))}
        </Summary>
        <ColumnFixing enabled={true} />
      </DataGrid>

      <CustomPopup props={popup} visible={isPopupVisible} handleClose={hidePopup} onHide={onHide}>
        <ProjectChangePopup 
          selectedItem={selectedItem} 
          period={period} 
          labelValue={labelValue} 
          popupInfo={json} 
          onHide={onHide} 
          prjctId={prjctId} 
          bgtMngOdrTobe={bgtMngOdrTobe}
          ctrtYmd={ctrtYmd}
          bizEndYmd={bizEndYmd}
          transformedData={transformedData}
          />
       </CustomPopup>   

      <div style={{ textAlign: "right" }}>
        <Button onClick={handleAddRow}>행 추가</Button>
      </div>
    </div>
  );
};

export default CustomCostTable;
