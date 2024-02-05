import React, { useEffect, useState, useRef } from 'react';

import ApiRequest from '../../../utils/ApiRequest';
import CustomHorizontalTable from '../../../components/unit/CustomHorizontalTable';
// import TableTest from '../../../components/unit/TableTest';
import CostCalc from './ProjectCostCalcJson.json';
import CustonbudgetTable from '../../../components/unit/CustonbudgetTable';
import CustomTable from 'components/unit/CustomTable';

const ProjectCostCalc = ({prjctId}) => {
const [baseInfoData, setBaseInfoData] = useState([]);
const [cnsrtmData, setCnsrtmData] = useState([]);

useEffect(() => {
  const BaseInfoData = async () => {
    const param = [ 
      { tbNm: "PRJCT" }, 
      { 
       prjctId: prjctId, 
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

useEffect(() => {
  const CnsrtmData = async () => {
    const param = [ 
      { tbNm: "PRJCT_CNSRTM" }, 
      { 
       prjctId: prjctId, 
      }, 
   ]; 
    try {
      const response = await ApiRequest("/boot/common/commonSelect", param);
      setCnsrtmData(response[0]);  
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };
  CnsrtmData();
}, []);


  return (
    <div style={{padding: '20px'}}>
    <div className='container'>
      <p><strong>* 사업개요</strong></p>
      <CustomHorizontalTable headers={CostCalc.BizSumry.BizSumry1} column={baseInfoData}/>
      {/* <CustomTable columns={CostCalc.BizSumry.BizSumry2} values={null}/> */}
      <CustonbudgetTable headers={CostCalc.BizSumry.BizSumry2} column={baseInfoData}/>
      <CustomHorizontalTable headers={CostCalc.BizSumry.BizSumry3} column={baseInfoData}/>
      
      &nbsp;
      <p><strong>* 컨소시엄</strong></p>
      <CustomHorizontalTable headers={CostCalc.Cnsrtm} column={cnsrtmData}/>
      &nbsp;
      <p><strong>* 원가 분석</strong></p>
      <CustonbudgetTable headers={CostCalc.PrmpcAnls} column={baseInfoData}/>
      {/* <TableTest headers={CostCalc.PrmpcAnls} column={baseInfoData}/> */}
    </div>
  </div>
  );
};

export default ProjectCostCalc;