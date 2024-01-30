import React, { useEffect, useState } from 'react';

import ApiRequest from '../../../utils/ApiRequest';
import CustomHorizontalTable from '../../../components/unit/CustomHorizontalTable';
import CostCalc from './ProjectCostCalcJson.json';
import CustonbudgetTable from '../../../components/unit/CustonbudgetTable';
// import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';
// import PivotGrid, { FieldChooser } from 'devextreme-react/pivot-grid';
// import { sales } from './data.js';


const ProjectCostCalc = (prjctId) => {
  const [baseInfoData, setBaseInfoData] = useState([]);

useEffect(() => {
  const BaseInfoData = async () => {
    const param = [ 
      { tbNm: "PRJCT" }, 
      { 
       prjctId: prjctId.projId, 
      }, 
   ]; 
    try {
      const response = await ApiRequest("/boot/common/commonSelect", param);
      setBaseInfoData(response[0]);  
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };
  BaseInfoData();
}, []);



const pivotGridDataSource = {
  fields: [
      { dataField: 'yourRowField', area: 'row', expanded: true },
      // ... 기타 필드 구성 ...
  ],
  // ... dataSource의 나머지 구성 ...
};

  return (
    <div style={{padding: '20px'}}>
    <div className='container'>
      <p><strong>* 사업개요</strong></p>
      <CustomHorizontalTable headers={CostCalc.BizSumry.BizSumry1} column={baseInfoData}/>
      <CustonbudgetTable headers={CostCalc.BizSumry.BizSumry2} column={baseInfoData}/>
      <CustomHorizontalTable headers={CostCalc.BizSumry.BizSumry3} column={baseInfoData}/>
      &nbsp;
      <p><strong>* 컨소시엄</strong></p>
      <CustomHorizontalTable headers={CostCalc.Cnsrtm} column={baseInfoData}/>
      &nbsp;
      <p><strong>* 원가 분석</strong></p>
      {/* <PivotGrid
        id="pivotgrid"
        dataSource={dataSource}
        allowSortingBySummary={true}
        allowFiltering={false}
        showBorders={true}
        showColumnTotals={false}
        showColumnGrandTotals={false}
        showRowTotals={false}
        // showRowGrandTotals={true}
        // ref={pivotGridRef}
      ></PivotGrid> */}
    </div>
  </div>
  );
};

export default ProjectCostCalc;