import React, { useEffect, useState, useRef  } from "react";
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
  Editing,
  ColumnFixing
} from "devextreme-react/data-grid";

const CustomCostTable = ({
  keyColumn,
  columns,
  values,
  summaryColumn,
  popup,
  labelValue,
  costTableInfoJson,
  ctrtYmd,
  bizEndYmd,
  prjctId,
  bgtMngOdr,
  onHide,
}) => {
  const [period, setPeriod] = useState([]); //사업시작일, 사업종료일을 받아와서 월별로 나눈 배열을 담을 상태
  const dataGridRef = useRef(null); // DataGrid 인스턴스에 접근하기 위한 ref
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [summaryColumns, setSummaryColumns] = useState(summaryColumn); //월별 합계를 담을 상태

  const showPopup = (data) => {
    const gridInstance = dataGridRef.current.instance;
    setIsPopupVisible(true);
    setSelectedItem(data); // 팝업에 표시할 데이터 설정
    // console.log("data",data);
  };

  const hidePopup = () => {
    setIsPopupVisible(false);
  };
  
  const updateSummaryColumn = (periods) => {
    const newSummaryColumns = periods.map(period => ({
      key: period, value: period, type: "sum", format: "Total: {0}원"
    }));
    // 상태 업데이트 함수를 사용하여 summaryColumn 상태 업데이트
    setSummaryColumns(prevSummaryColumns => [...prevSummaryColumns, ...newSummaryColumns]);
  };

  //파라미터로 받아온 사업시작, 사업종료월을 파라미터로 포함된 월의 갯수를 배열로 반환
  useEffect(() => {
      const getPeriod = (startDate, endDate) => {
        const start = startDate ? parse(startDate, 'yyyyMMdd', new Date()) : new Date();
        const end = endDate ? parse(endDate, 'yyyyMMdd', new Date()) : addMonths(start, 15);
        let periods = [];
        let currentDate = start;
        while (currentDate  <= end) {
          periods.push(format(currentDate, 'yyyy년 M월'));
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

  const editColumn = ["수정", "삭제"];

   

  const onCellRenderEdit = ({data}) => {
    // console.log("data",data);
    return (
      <Button
        onClick={() => showPopup(data)}
        style={{ height: "100%" }}
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
    const rowIndex = gridInstance.getRowIndexByKey(cellInfo.data.expensCd);
    return (
      <Button 
        onClick={async () => { 
              if (rowIndex >= 0) {
                const paramInfo = cellInfo.data;
                const paramInfoNew = pick(paramInfo, ['prjctId', 'expensCd', 'bgtMngOdr']);
        
                const param = [
                  { tbNm: "EXPENS_PRMPC" },
                  
                  paramInfoNew
                ];
                
                try {
                  const response = await ApiRequest("/boot/common/commonDelete", param);
                    if(response > 0) {
                      gridInstance.deleteRow(rowIndex);
                      alert('데이터가 성공적으로 삭제되었습니다.');
                      console.log(response);
                    }
                }catch (error) {
                  console.error(error);
                }               
              }
          }}
        style={{ height: "100%" }}
        text="삭제"
      />
    );
  };

  const handleAddRow = () => {
    // console.log("data",data);
    const gridInstance = dataGridRef.current.instance;
    // gridInstance.addRow();
    showPopup();
    // console.log("data",data.event.data);
    // gridInstance.deselectAll();
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
              valueFormat={{ type: "fixedPoint", precision: 0 }} // 천 단위 구분자 설정
            />
          ))}
        </Summary>
        <ColumnFixing enabled={true} />
        {/* <Editing
          mode="popup"
          allowUpdating={true}
          popup={editPopupOptions}
        /> */}
      </DataGrid>

      <CustomPopup props={popup} visible={isPopupVisible} handleClose={hidePopup} onHide={onHide}>
        <ProjectChangePopup 
          selectedItem={selectedItem} 
          period={period} 
          labelValue={labelValue} 
          popupInfo={costTableInfoJson} 
          onHide={onHide} 
          prjctId={prjctId} 
          bgtMngOdr={bgtMngOdr}
          ctrtYmd={ctrtYmd}
          bizEndYmd={bizEndYmd}
          />
       </CustomPopup>   

      <div style={{ textAlign: "right" }}>
        <Button onClick={handleAddRow}>행 추가</Button>
      </div>
    </div>
  );
};

export default CustomCostTable;
