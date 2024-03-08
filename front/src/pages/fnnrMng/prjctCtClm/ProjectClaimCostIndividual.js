import React, { useEffect, useState } from 'react';

import ApiRequest from '../../../utils/ApiRequest';
import CustomTable from "../../../components/unit/CustomTable";
import ProjectClaimCostIndividual from '../prjctCtClm/ProjectClaimCostIndividualJson.json';
import { useNavigate } from "react-router-dom";

const ProjectCostIndividual = () => {
  const [workHourData, setWorkHourData] = useState([]);
  const [expensData, setExpensData] = useState([]);

  const navigate = useNavigate();

  const { keyColumn, queryId, workHourColumns, expensColumns } = ProjectClaimCostIndividual;

  /* useEffect(() => {
    const WorkHourData = async () => {
      const param = [ 
        { tbNm: "PRJCT_MM_APLY" }, 
        { 
         prjctId: prjctId,
        }, 
     ]; 
      try {
        const response = await ApiRequest("/boot/common/commonSelect", param);
        setWorkHourData(response[0]);     
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };
    WorkHourData();
  }, []);

  useEffect(() => {
    const param = [ 
      { tbNm: "PRJCT_CT_APLY" }, 
      { 
       prjctId: prjctId, 
      }, 
   ]; 
    const ExpensData = async () => {
      try {
        const response = await ApiRequest("/boot/common/commonSelect", param);
        setExpensData(response[0]);  
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };
    ExpensData();
  }, []); */

  const onClick = (data) => {
    navigate("/fnnrMng/prjctCtClm/ProjectClaimCostDetail", 
             {state: { prjctId: data.prjctId, prjctNm: data.prjctNm }})
  };

  return (
    <div style={{padding: '20px'}}>
      <div className='container'>
        <p><strong>* 수행인력</strong></p>
        <CustomTable
          keyColumn={keyColumn}
          columns={workHourColumns}
          onClick={onClick}
      />
        &nbsp;
        <p><strong>* 경비</strong></p>
        <CustomTable
          keyColumn={keyColumn}
          columns={expensColumns}
          onClick={onClick}
      />
      </div>
    </div>
  );
};

export default ProjectCostIndividual;