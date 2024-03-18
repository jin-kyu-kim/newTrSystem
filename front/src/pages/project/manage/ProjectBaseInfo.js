import React, { useEffect, useState } from 'react';

import ApiRequest from '../../../utils/ApiRequest';
import CustomHorizontalTable from '../../../components/unit/CustomHorizontalTable';
import BaseInfo from './ProjectBaseInfo.json';

const ProjectBaseInfo = ({prjctId}) => {
  const [baseInfoData, setBaseInfoData] = useState([]);
  const [picInfoData, setPicInfoData] = useState([]);
  const [CnsrtmData, setCnsrtmData] = useState([]);

  /**
   * 기본정보 데이터 세팅
   * 담당자 정보 데이터 세팅
   */
  useEffect(() => {
    const BaseInfoData = async () => {

      const param = {
        queryId: "projectMapper.retrievePrjctBsisInfo",
        prjctId: prjctId
      };

      try {
        const response = await ApiRequest("/boot/common/queryIdSearch", param);
        setBaseInfoData(response[0]);
        setPicInfoData(response[0]);

      } catch (error) {
        console.error('Error fetching data', error);
      }
    };
    BaseInfoData();
  }, []);

  /**
   * 컨소시엄 데이터 세팅
   */ 
  useEffect(() => {
    const param = [ 
      { tbNm: "PRJCT_CNSRTM" }, 
      { 
       prjctId: prjctId, 
      }, 
   ];  
    const Cnsrtm = async () => {  
      try {
        const response = await ApiRequest("/boot/common/commonSelect", param);
        setCnsrtmData(response);  
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };
    Cnsrtm();
  }, []);

  return (
    <div style={{padding: '20px'}}>
      <div className='container'>
        <p><strong>* 기본정보</strong></p>
        <CustomHorizontalTable headers={BaseInfo.BaseInfo} column={baseInfoData}/>
        &nbsp;
        <p><strong>* 담당자 정보</strong></p>
        <CustomHorizontalTable headers={BaseInfo.PicInfo} column={picInfoData}/>
        &nbsp;
        <p><strong>* 컨소시엄</strong></p>
        {CnsrtmData.map((data, index) => {
           return <CustomHorizontalTable key={index} headers={BaseInfo.Cnsrtm} column={data}/>
        })}
      </div>
    </div>
  );
};

export default ProjectBaseInfo;