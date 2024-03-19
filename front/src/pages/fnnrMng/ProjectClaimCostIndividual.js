import React, { useEffect, useState } from 'react';

import ApiRequest from '../../utils/ApiRequest';
import CustomTable from "../../components/unit/CustomTable";
import ProjectClaimCostIndividual from './ProjectClaimCostIndividualJson.json';
import { useNavigate } from "react-router-dom";
import CustomPopup from "../../components/unit/CustomPopup";
import ProjectClaimCostIndividualCtPop from "./ProjectClaimCostIndividualCtPop";
import ProjectClaimCostIndividualMmPop from "./ProjectClaimCostIndividualMmPop";

const ProjectCostIndividual = ({ prjctId, prjctNm, year, monthVal, aplyOdr, empId }) => {
  const { keyColumn, queryId, mmColumns, ctColumns, mmSumColumns, ctSumColumns, popup } = ProjectClaimCostIndividual;
  const [mmData, setMMData] = useState([]);
  const [ctData, setCtData] = useState([]);
  const [data, setData] = useState([]);
  const [mmDetailValues, setMmDetailValues] = useState([]);
  const [ctDetailValues, setCtDetailValues] = useState([]);
  const [mmPopupVisible, setMmPopupVisible] = useState(false);
  const [ctPopupVisible, setCtPopupVisible] = useState(false);

  useEffect(() => {
      getMMData();
      getCtData();
  }, [year, monthVal, aplyOdr, empId]);

    const getMMData = async () => {

        const param = {
            queryId: queryId.empMMQueryId,
            prjctId: prjctId,
            aplyYm: year+monthVal,
            aplyOdr: aplyOdr,
            empId: empId
        };
        try{
            const response = await ApiRequest('/boot/common/queryIdSearch', param);
            setMMData(response);
        }catch (error){
            console.log(error)
        }
    };

    const getCtData = async () => {

        const param = {
            queryId: queryId.empCtQueryId,
            prjctId: prjctId,
            aplyYm: year+monthVal,
            aplyOdr: aplyOdr,
            empId: empId
        };
        try{
            const response = await ApiRequest('/boot/common/queryIdSearch', param);
            setCtData(response);
        }catch (error){
            console.log(error)
        }
    };

    const onMmBtnClick = async (data) => {
        setData(data);

        await retrievePrjctCtClmSttusIndvdlMMAcctoDetail(data);
        setMmPopupVisible(true);
    }

    const retrievePrjctCtClmSttusIndvdlMMAcctoDetail = async (data) => {

        const param = {
            queryId: queryId.mmPopupQueryId,
            prjctId: prjctId,
            aplyYm: year+monthVal,
            aplyOdr: aplyOdr,
            empId: data.empId
        }
        const response = await ApiRequest("/boot/common/queryIdSearch", param);
        setMmDetailValues(response);
    }

    const onCtBtnClick = async (data) => {
        setData(data);

        await retrievePrjctCtClmSttusIndvdlCtAcctoDetail(data);
        setCtPopupVisible(true);
    }

    const retrievePrjctCtClmSttusIndvdlCtAcctoDetail = async (data) => {

        const param = {
            queryId: queryId.ctPopupQueryId,
            prjctId: prjctId,
            aplyYm: year+monthVal,
            aplyOdr: aplyOdr,
            empId: data.empId
        }
        const response = await ApiRequest("/boot/common/queryIdSearch", param);
        setCtDetailValues(response);
    }

    const handleClose = () => {
        setCtPopupVisible(false);
        setMmPopupVisible(false);
    };

  return (
    <div style={{padding: '20px'}}>
      <div className='container'>
        <p><strong>* 수행인력</strong></p>
        <CustomTable
          keyColumn={keyColumn}
          values={mmData}
          columns={mmColumns}
          summary={true}
          summaryColumn={mmSumColumns}
          onClick={onMmBtnClick}
        />
        &nbsp;
        <p><strong>* 경비</strong></p>
        <CustomTable
          keyColumn={keyColumn}
          values={ctData}
          columns={ctColumns}
          summary={true}
          summaryColumn={ctSumColumns}
          onClick={onCtBtnClick}
        />
          <CustomPopup
              props={popup}
              visible={mmPopupVisible}
              handleClose={handleClose}>
              <ProjectClaimCostIndividualMmPop props={mmDetailValues} prjctNm={prjctNm} data={data}/>
          </CustomPopup>
          <CustomPopup
              props={popup}
              visible={ctPopupVisible}
              handleClose={handleClose}>
              <ProjectClaimCostIndividualCtPop props={ctDetailValues} prjctNm={prjctNm} data={data}/>
          </CustomPopup>
      </div>
    </div>
  );
};

export default ProjectCostIndividual;