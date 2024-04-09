import React, { useEffect, useState } from 'react';
import { Popup } from "devextreme-react";
import { useNavigate } from "react-router-dom";

import ApiRequest from '../../utils/ApiRequest';
import CustomTable from "../../components/unit/CustomTable";
import ProjectClaimCostIndividualJson from './ProjectClaimCostIndividualJson.json';
import ProjectClaimCostIndividualCtPop from "./ProjectClaimCostIndividualCtPop";
import ProjectClaimCostIndividualMmPop from "./ProjectClaimCostIndividualMmPop";
import {Button} from "devextreme-react/button";

const ProjectClaimCostIndividual = ({ prjctId, prjctNm, startYmOdr, endYmOdr, empFlnm }) => {
  const { mmKeyColumn, ctKeyColumn, queryId, mmColumns, ctColumns, mmSumColumns, ctSumColumns } = ProjectClaimCostIndividualJson;
  const [mmData, setMMData] = useState([]);
  const [ctData, setCtData] = useState([]);
  const [data, setData] = useState([]);
  const [mmDetailValues, setMmDetailValues] = useState([]);
  const [ctDetailValues, setCtDetailValues] = useState([]);
  const [mmPopupVisible, setMmPopupVisible] = useState(false);
  const [ctPopupVisible, setCtPopupVisible] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
      getMMData();
      getCtData();
  }, [startYmOdr, endYmOdr, empFlnm]);

    const getMMData = async () => {

        const param = {
            queryId: queryId.empMMQueryId,
            prjctId: prjctId,
            startYmOdr: startYmOdr,
            endYmOdr: endYmOdr,
            empFlnm: empFlnm
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
            startYmOdr: startYmOdr,
            endYmOdr: endYmOdr
        };
        try{
            const response = await ApiRequest('/boot/common/queryIdSearch', param);
            setCtData(response);
        }catch (error){
            console.log(error)
        }
    };

    const mmButtonRender = (button, data) => {
        return(
            <Button name={button.name} text={button.text} onClick={(e) => onMmBtnClick(button, data)} />
        );
    }

    const onMmBtnClick = async (button, data) => {
        if (button.name === "empId") {
            setData(data);
        }
        await retrievePrjctCtClmSttusIndvdlMMAcctoDetail(data);
        setMmPopupVisible(true);
    }

    const retrievePrjctCtClmSttusIndvdlMMAcctoDetail = async (data) => {

        const param = {
            queryId: queryId.mmPopupQueryId,
            prjctId: prjctId,
            startYmOdr: startYmOdr,
            endYmOdr: endYmOdr,
            empId: data.empId
        }
        const response = await ApiRequest("/boot/common/queryIdSearch", param);
        setMmDetailValues(response);
    }

    const ctButtonRender = (button, data) => {
        return(
            <Button name={button.name} text={button.text} onClick={(e) => onCtBtnClick(button, data)} />
        );
    }

    const onCtBtnClick = async (button, data) => {
        if (button.name === "expenseAprv") {
            setData(data);
        }
        await retrievePrjctCtClmSttusIndvdlCtAcctoDetail(data);
        setCtPopupVisible(true);
    }

    const retrievePrjctCtClmSttusIndvdlCtAcctoDetail = async (data) => {

        const param = {
            queryId: queryId.ctPopupQueryId,
            prjctId: prjctId,
            startYmOdr: startYmOdr,
            endYmOdr: endYmOdr,
            expensCd: data.expensCd
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
          keyColumn={mmKeyColumn}
          values={mmData}
          columns={mmColumns}
          summary={true}
          summaryColumn={mmSumColumns}
          buttonRender={mmButtonRender}
          onClick={onMmBtnClick}
        />
        &nbsp;
        <p><strong>* 경비</strong></p>
        <CustomTable
          keyColumn={ctKeyColumn}
          values={ctData}
          columns={ctColumns}
          summary={true}
          summaryColumn={ctSumColumns}
          buttonRender={ctButtonRender}
          onClick={onCtBtnClick}
        />
          <Popup
              width="90%"
              height="90%"
              visible={mmPopupVisible}
              onHiding={handleClose}
              showCloseButton={true}
          >
              <ProjectClaimCostIndividualMmPop props={mmDetailValues} prjctNm={prjctNm} startYmOdr={startYmOdr} endYmOdr={endYmOdr} data={data}/>
          </Popup>
          <Popup
              width="90%"
              height="90%"
              visible={ctPopupVisible}
              onHiding={handleClose}
              showCloseButton={true}
          >
              <ProjectClaimCostIndividualCtPop props={ctDetailValues} prjctNm={prjctNm} startYmOdr={startYmOdr} endYmOdr={endYmOdr} data={data}/>
          </Popup>
      </div>
    </div>
  );
};

export default ProjectClaimCostIndividual;