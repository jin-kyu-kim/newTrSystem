import { useState, useEffect, useRef,useCallback} from "react";
import DataGrid, { Column,Export,Hide,Lookup,Selection,button } from 'devextreme-react/data-grid';
import TimeExpenseInsertSttusJson from "./TimeExpenseInsertSttusJson.json";
import Button from "devextreme-react/button";
import ApiRequest from "utils/ApiRequest";
import CustomTable from "components/unit/CustomTable";
import moment, { locale } from "moment";
import CustomHorizontalTable from "components/unit/CustomHorizontalTable";

import PivotGrid, { FieldChooser, FieldPanel, Scrolling } from 'devextreme-react/pivot-grid';
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';

const TimeExpenseInsertList = ({data}) => {
//====================선언구간====================================================
const { baseInfo, totAply } = TimeExpenseInsertSttusJson;
const nowDate = moment().format('YYYYMM') //현재 년월
const printRef = useRef(null);

  const [pivotGridConfig, setPivotGridConfig] = useState({
    fields: [
      {
        caption: "프로젝트 명(코드)",
        width: 80,
        dataField: "prjctNmCd",
        area: "row",
        expanded: true,
      },
      {
        caption: "지불수단",
        dataField: "ctAtrzSeCdNm",
        area: "row",
        showTotals: false,
        expanded: true,
      },
      {
        caption: "비용코드",
        dataField: "expensCdNm",
        area: "row",
        showTotals: true,
        expanded: true,
      },
      {
        caption: "상세내역(목적)",
        dataField: "ctPrpos",
        customizeText: function (cellInfo) {
          if(cellInfo.value != null) {
            return cellInfo.value.substring(2);
          }
        },
        area: "row",
        showTotals: false,
        expanded: true,
      },
      {
        caption: "용도(참석자명단)",
        dataField: "atdrn",
        width: 60,
        area: "row",
        showTotals: false,
        expanded: true,
      },
      {
        dataField: "day",
        area: "column",
      },
      {
        caption: "금액",
        dataField: "utztnAmt",
        dataType: "number",
        area: "data",
        format: "#,###",
        showValues: true,
        summaryType: "sum",
        calculateSummaryValue: function (e) {
          e.field("row")
          return e.value();
        }
      }
    ],
    store: [],
  });
//====================== 데이터 설정 ===============================================
useEffect(() => {

  retrieveCtData(data);

}, [data]);


const retrieveCtData = async (data) => {
  const param = {
    empId: data.empId,
    aplyYm: data.aplyYm,
    aplyOdr: data.aplyOdr,
  }

  try {
    const response = await ApiRequest("/boot/financialAffairMng/retrieveCtData", param);

    console.log(response);

    setPivotGridConfig({
      ...pivotGridConfig,
      store: response,
    });

  } catch (error) {
    console.error(error);
  }
}

//===========================테이블내 버튼 이벤트======================================
const print = useCallback(() => {
  printRef.current.instance.print();
}, []);

  const dataSource = new PivotGridDataSource(pivotGridConfig);

  const printf = () => {

    return(
    <div className="" ref ={printRef}>
        <div className="" style={{ marginTop: "20px", marginBottom: "10px" }}>
          <h1 style={{ fontSize: "30px" }}>근무시간비용 Report</h1>
        </div>
        <div style={{ marginBottom: "20px" }}>
          <Button icon="print" text="출력" onClick={print}/>
        </div>
        <div style={{ marginBottom: "20px" }}>
          <span>* 기본정보</span>
          <CustomHorizontalTable headers={baseInfo} column={data}/>
        </div>
        <div style={{ marginBottom: "20px" }}>
          <span>* 총계</span>
          <CustomHorizontalTable headers={totAply} column={data}/>
        </div>
        <div style={{ marginBottom: "20px" }}>
          <span>* 근무시간</span>
          <DataGrid>          
          </DataGrid>
          </div>
        <div style={{ marginBottom: "20px" }}>
          <span>* 현금 및 개인법인카드 사용비용</span>
          <PivotGrid
            id="sales"
            dataSource={dataSource}
            allowSortingBySummary={true}
            allowSorting={false}
            allowFiltering={false}
            allowExpandAll={false}
            height={"60%"}
            showBorders={true}
            showRowTotals={true}
            wordWrapEnabled={true}
          >
            <FieldPanel
              showRowFields={true}
              visible={true}
              showTotals={false}
              showColumnFields={false}
              showDataFields={false}
              showFilterFields={false}
              allowFieldDragging={false}
              allowSorting={false}
            />
            <FieldChooser enabled={false} />
            <Scrolling mode="virtual" />
          </PivotGrid>
        </div>
      </div>
    )
  }








//========================화면그리는 구간 ====================================================
    return(
      <div>
        {printf()}
      </div>
      
 );
};

export default TimeExpenseInsertList;
