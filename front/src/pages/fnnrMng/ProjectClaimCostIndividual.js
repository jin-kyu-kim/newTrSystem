import React, { useEffect, useState } from 'react';

import ApiRequest from '../../utils/ApiRequest';
import CustomTable from "../../components/unit/CustomTable";
import ProjectClaimCostIndividual from './ProjectClaimCostIndividualJson.json';
import { useNavigate } from "react-router-dom";

const ProjectCostIndividual = ({ prjctId, prjctNm, year, monthVal, aplyOdr, empId }) => {
  const { keyColumn, queryId, workHourColumns, expensColumns, workHourSumColumns, expensSumColumns } = ProjectClaimCostIndividual;
  const [workHourData, setWorkHourData] = useState([]);
  const [expensData, setExpensData] = useState([]);

  const navigate = useNavigate();



  useEffect(() => {
      getWorkHourData();
      getExpensData();
  }, [year, monthVal, aplyOdr, empId]);

    const getWorkHourData = async () => {

        const param = {
            queryId: queryId.empMMQueryId,
            prjctId: prjctId,
            aplyYm: year+monthVal,
            aplyOdr: aplyOdr,
            empId: empId
        };
        try{
            const response = await ApiRequest('/boot/common/queryIdSearch', param);
            setWorkHourData(response);
        }catch (error){
            console.log(error)
        }
    };

    const getExpensData = async () => {

        const param = {
            queryId: queryId.empCtQueryId,
            prjctId: prjctId,
            aplyYm: year+monthVal,
            aplyOdr: aplyOdr,
            empId: empId
        };
        try{
            const response = await ApiRequest('/boot/common/queryIdSearch', param);
            setExpensData(response);
        }catch (error){
            console.log(error)
        }
    };


  const onClick = (data) => {
    navigate("/fnnrMng/ProjectClaimCostDetail",
             {state: { prjctId: data.prjctId, prjctNm: data.prjctNm }})
  };

  return (
    <div style={{padding: '20px'}}>
      <div className='container'>
        <p><strong>* 수행인력</strong></p>
        <CustomTable
          keyColumn={keyColumn}
          values={workHourData}
          columns={workHourColumns}
          summary={true}
          summaryColumn={workHourSumColumns}
          onClick={onClick}
      />
        &nbsp;
        <p><strong>* 경비</strong></p>
        <CustomTable
          keyColumn={keyColumn}
          values={expensData}
          columns={expensColumns}
          summary={true}
          summaryColumn={expensSumColumns}
          onClick={onClick}
      />
      </div>
    </div>
  );
};

export default ProjectCostIndividual;