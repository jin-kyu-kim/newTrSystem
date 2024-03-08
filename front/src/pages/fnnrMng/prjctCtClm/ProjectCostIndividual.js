import React, { useEffect, useState } from 'react';

import ApiRequest from '../../../utils/ApiRequest';
import CustomTable from "../../../components/unit/CustomTable";
import ProjectCostIndividualJson from '../prjctCtClm/ProjectCostIndividualJson.json';
import { useNavigate } from "react-router-dom";

const ProjectCostIndividual = ({prjctId}) => {
  const [baseInfoData, setBaseInfoData] = useState([]);
  const [picInfoData, setPicInfoData] = useState([]);
  const [values, setValues] = useState([]);
  const [param, setParam] = useState({});

  const navigate = useNavigate();

  const { keyColumn, queryId, tableColumns, searchParams } = ProjectCostIndividualJson;

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

  //picInfoData 데이터
  useEffect(() => {
    const param = [ 
      { tbNm: "PRJCT" }, 
      { 
       prjctId: prjctId, 
      }, 
   ]; 
    const PicInfoData = async () => {
      try {
        const response = await ApiRequest("/boot/common/commonSelect", param);
        setPicInfoData(response[0]);  
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };
    PicInfoData();
  }, []);

  const onClick = (data) => {
    navigate("/fnnrMng/prjctCtClm/ProjectCostClaimDetail", 
             {state: { prjctId: data.prjctId, prjctNm: data.prjctNm }})
  };

  return (
    <div style={{padding: '20px'}}>
      <div className='container'>
        <p><strong>* 수행인력</strong></p>
        <CustomTable
          keyColumn={keyColumn}
          columns={tableColumns}
          values={values}
          onClick={onClick}
          paging={true}
      />
        &nbsp;
        <p><strong>* 경비</strong></p>
        <CustomTable
          keyColumn={keyColumn}
          columns={tableColumns}
          values={values}
          onClick={onClick}
          paging={true}
      />
      </div>
    </div>
  );
};

export default ProjectCostIndividual;