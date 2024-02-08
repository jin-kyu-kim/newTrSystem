import React, { useEffect, useState, useRef  } from "react";
import { Button } from "devextreme-react";
import { Popup } from 'devextreme-react/popup';
import CustomPopup from "../unit/CustomPopup";
import ProjectChangePopup from "../../pages/project/manage/ProjectChangePopup";

import CustomLabelValue from "./CustomLabelValue";
import CustomCdComboBox from "./CustomCdComboBox";

import DataGrid, {
  Column,
  SearchPanel,
  Scrolling,
  Summary,
  TotalItem,
  Editing,
  ColumnFixing
} from "devextreme-react/data-grid";


//파람으로 받아와야 할 것 : 사업시작일, 사업종료일
const CustomCostTable = ({
  keyColumn,
  columns,
  values,
  summaryColumn,
  popup,
  labelValue,
  costTableInfoJson
}) => {
  const [data, setData] = useState([]);
  const [param, setParam] = useState([]);
  const [period, setPeriod] = useState([]); //사업시작일, 사업종료일을 받아와서 월별로 나눈 배열을 담을 상태
  const dataGridRef = useRef(null); // DataGrid 인스턴스에 접근하기 위한 ref
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [summaryColumns, setSummaryColumns] = useState(summaryColumn); //월별 합계를 담을 상태
  // console.log("costTableInfoJson",costTableInfoJson);
  
  const showPopup = (data) => {
    const gridInstance = dataGridRef.current.instance;
    setIsPopupVisible(true);
    setSelectedItem(data); // 팝업에 표시할 데이터 설정
    // console.log("selectedItem",selectedItem);
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
        const start = new Date(startDate);
        const end = new Date(endDate);
        let periods = [];
        while (start <= end) {
          periods.push(start.getFullYear() + "년 " + (start.getMonth() + 1 ) + "월");
          start.setMonth(start.getMonth() + 1);
        }
        setPeriod(periods);
        updateSummaryColumn(periods);
    };
    getPeriod("2021-09-01", "2022-03-31");
  }, []);

  //gridRows가 실행되는 시점 잡아주기.
  useEffect(() => {
    if(period){
      gridRows();
    }
  } ,[period]);




  const editColumn = ["수정", "삭제"];

  const onCellRenderEdit = ({data}) => {
    return (
      <Button
        onClick={() => showPopup(data)}
        style={{ height: "100%" }}
      >
        수정
      </Button>
    );
  };

  const onCellRenderDelete = (cellInfo) => {
    const gridInstance = dataGridRef.current.instance;
    return (
      <Button
        onClick={
          () => {
              const rowIndex = gridInstance.getRowIndexByKey(cellInfo.data.expensCd);
              if (rowIndex >= 0) {
                gridInstance.deleteRow(rowIndex);
              }
          }
        }
        style={{ height: "100%" }}
      >
        삭제
      </Button>
    );
  };

  const handleAddRow = (data) => {
    const gridInstance = dataGridRef.current.instance;
    // gridInstance.addRow();
    showPopup(data.data);
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
        {/* <Editing 
        mode="row"
        allowDeleting={true}
        allowAdding={true}
        allowUpdating={false} 
      /> */}
      <ColumnFixing enabled={true} />
      </DataGrid>
      <CustomPopup props={popup} visible={isPopupVisible} handleClose={hidePopup}>
        <ProjectChangePopup selectedItem={selectedItem} period={period} labelValue={labelValue} popupInfo={costTableInfoJson}/>
       </CustomPopup>   
      <div style={{ textAlign: "right" }}>
        <Button onClick={handleAddRow}>행 추가</Button>
      </div>
    </div>
  );
};

export default CustomCostTable;
