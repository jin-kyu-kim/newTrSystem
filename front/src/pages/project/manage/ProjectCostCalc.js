import React, { useEffect, useState, useRef } from 'react';

import ApiRequest from '../../../utils/ApiRequest';
import CustomHorizontalTable from '../../../components/unit/CustomHorizontalTable';
import CostCalc from './ProjectCostCalcJson.json';
import CustombudgetTable from '../../../components/unit/CustombudgetTable';
import DataGrid, {
  Column,
  Summary,
  GroupItem,
  Grouping,
  TotalItem,
} from "devextreme-react/data-grid";
const ProjectCostCalc = ({prjctId, ctrtYmd, stbleEndYmd, bgtMngOdr, bgtMngOdrTobe, change}) => {
const [baseInfoData, setBaseInfoData] = useState([]);
const [cnsrtmData, setCnsrtmData] = useState([]);
const [data, setData] = useState([]);
const copyCtrtYmd = ctrtYmd ? JSON.parse(JSON.stringify(ctrtYmd)): "";
const copyStbleEndYmd = stbleEndYmd ? JSON.parse(JSON.stringify(stbleEndYmd)) : "";
const ctrtYmdPrarm = copyCtrtYmd.replace(/-(\d{2})-\d{2}/, '$1');
const stbleEndYmdPrarm = copyStbleEndYmd.replace(/-(\d{2})-\d{2}/, '$1');

useEffect(() => {
  BaseInfoData();
  CnsrtmData();
  handelGetData();
}, []);

//사업개요 정보
const BaseInfoData = async () => {
  const param = {
    queryId: "projectMapper.retrieveExcnPrmpcBizSumry",
    prjctId: prjctId,
  }

  try {
    const response = await ApiRequest("/boot/common/queryIdSearch", param);
    setBaseInfoData(response[0]);  
  } catch (error) {
    console.error('Error fetching data', error);
  }
};

//컨소시엄 정보  
const CnsrtmData = async () => {
  const param = [ 
    { tbNm: "PRJCT_CNSRTM" }, 
    { 
      prjctId: prjctId, 
    }, 
  ]; 
  try {
    const response = await ApiRequest("/boot/common/commonSelect", param);
    setCnsrtmData(response);  
  } catch (error) {
    console.error('Error fetching data', error);
  }
};

//원가 분석 정보
const handelGetData = async () => {
  try {
    await CostCalc.PrmpcAnls.params.map(async (item) => {
      let order; //detail에서 호출일때와 change에서 호출일때 차수 다르게 조회해옴.
      if(change){
        order = bgtMngOdrTobe
      }else{
        order = bgtMngOdr
      }
      const modifiedItem = { ...item, prjctId: prjctId, bgtMngOdr: order, ctrtYmd:ctrtYmdPrarm, stbleEndYmd:stbleEndYmdPrarm};   
      const response = await ApiRequest(
        "/boot/common/queryIdSearch",
        modifiedItem
      );
      setData((prevData) => [...prevData, ...response]);
    });
  } catch (error) {
    console.log(error);
  }
};


const gridRows = () => {
  const result = [];
  for (let i = 0; i < CostCalc.PrmpcAnls.tableColumns.length; i++) {
    const { key, value } = CostCalc.PrmpcAnls.tableColumns[i];
    result.push(
      <Column
        key={key}
        dataField={key}
        caption={value}
        alignment="right"
        format={key === "rate" ? "#,##0.00" : "#,##0"}
      />
    );
  }
  return result;
};


const calculateCustomSummary = (options) => {

  const storeInfo = options.component.getDataSource().store()._array
  let inComeAmt = 0, outComeAmt = 0, inComeRate = 0, outComeRate = 0;

  storeInfo.forEach((item) => {
    if (item.bind === 1) {
      inComeAmt += item.costAmt;
      inComeRate += item.rate;
    }else {
      outComeAmt += item.costAmt;
      outComeRate += item.rate;
    }
});

  const totalAmt = inComeAmt-outComeAmt;
  const totalRate = inComeRate-outComeRate;

  if (options.summaryProcess === "start") {
      if(options.name === "costAmtTotal"){
        options.totalValue = totalAmt;
      }
      if(options.name === "rateTotal"){
        options.totalValue = totalRate;
      } 
  }
}

  return (
    <div style={{padding: '5%'}}>
    <div className='container'>
      <div>
      <p><strong>* 사업개요</strong></p>
      <CustomHorizontalTable headers={CostCalc.BizSumry.BizSumry1} column={baseInfoData}/>
      <CustombudgetTable headers={CostCalc.BizSumry.BizSumry2} column={baseInfoData}/>
      <CustomHorizontalTable headers={CostCalc.BizSumry.BizSumry3} column={baseInfoData}/> 
      &nbsp;
      <p><strong>* 컨소시엄</strong></p>
      {cnsrtmData.map((data, index) => {
           return <CustomHorizontalTable key={index} headers={CostCalc.Cnsrtm} column={data}/>
        })}
      &nbsp;
      </div>
      <p><strong>* 원가 분석</strong></p>   
      
        <div>
          <DataGrid
              dataSource={data}
              keyExpr="id"
              showBorders={true}
              masterDetail={{
                enabled: false,
              }}
              onCellPrepared={(e) => {
                if (e.rowType === "header"|| e.rowType === "group") {  //totalFooter도?
                  e.cellElement.style.textAlign = "center";
                  e.cellElement.style.fontWeight = "bold";
                  e.cellElement.style.color ='black'
                  e.cellElement.style.backgroundColor = '#e9ecef'
                }
              }}
            >
              {gridRows()}

              <Column
                dataField="bind"
                caption="원가별집계"  //매출액/원가별집계로 나눠야함.
                customizeText={(e) => {
                  if (e.value === 1) {
                    return "매출액";
                  }else if (e.value === 2) {
                    return "인건비";
                  } else if (e.value === 3) {
                    return "외주비";
                  } else if (e.value === 4){
                    return "경비";
                  } 
                }}
                groupIndex={0}
              />

              <Grouping autoExpandAll={true} />

              <Summary calculateCustomSummary={calculateCustomSummary} >
                <GroupItem
                  column="costAmt"
                  summaryType="sum"
                  valueFormat="#,##0"
                  displayFormat="{0} 원"
                  alignByColumn={true}
                />
                <GroupItem
                  column="rate"
                  summaryType="sum"
                  valueFormat="#,##0.00"
                  displayFormat="{0} %"
                  alignByColumn={true}
                />
                <TotalItem
                  column="costKind"
                  customizeText={() => {
                    return "총 계 [매출액 - 원가별집계]";
                  }}
                />
                <TotalItem
                  name="costAmtTotal"
                  column="costAmt"
                  summaryType="custom"
                  valueFormat="#,##0"
                  displayFormat="{0} 원"
                />
                <TotalItem
                  name="rateTotal"
                  column="rate"
                  summaryType="custom"
                  valueFormat="#,##0.00"
                  displayFormat="{0} %"
                />
              </Summary>
            </DataGrid>
        </div>
     </div>
  </div>
  );
};

export default ProjectCostCalc;