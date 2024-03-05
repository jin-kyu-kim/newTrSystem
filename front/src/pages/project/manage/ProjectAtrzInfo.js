import React, { useEffect, useState, useCallback, } from 'react';
import { TreeView } from 'devextreme-react/tree-view';
import { useNavigate } from 'react-router-dom';

import ApiRequest from '../../../utils/ApiRequest';
import CustomHorizontalTable from '../../../components/unit/CustomHorizontalTable';
import AtrzInfo from './ProjectAtrzInfoJson.json';

const ProjectAtrzInfo = ({prjctId, atrzLnSn}) => {
const [atrzInfoData, setAtrzInfoData] = useState([]);
const [atrzDate, setAtrzDate] = useState([]);
const navigate = useNavigate();

useEffect(() => {
  let order = [];
  const result = AtrzDate(atrzLnSn).then((value) => {
    const order = JSON.parse(JSON.stringify(value));
    order.reverse();

    if(order.length === 0) {
      return;
    };

    AtrzInfoData(order[0].atrzLnSn);
  });
}, []);

const AtrzDate = async (atrzLnSn) => {

  const param = [
    { tbNm: "PRJCT_ATRZ_LN" },
    { 
      prjctId : prjctId,
      atrzLnSn : atrzLnSn
    }
  ]

  try {
    const response = await ApiRequest("/boot/common/commonSelect", param);
    setAtrzDate(response);
    return response;

  } catch (error) {
    console.error('Error fetching data', error);
  }
}

const AtrzInfoData = async (atrzLnSn) => {
    if(atrzLnSn === undefined) atrzLnSn = 1;
  const param =
    { 
      queryId: AtrzInfo.queryId,
      prjctId: prjctId,
      atrzLnSn: atrzLnSn 
    }
 ; 
  try {
    const response = await ApiRequest("/boot/common/queryIdSearch", param);
    setAtrzInfoData(response);
    console.log(response);
  } catch (error) {
    console.error('Error fetching data', error);
  }
};

const handleTreeViewSelectionChange = useCallback((e) => {
  AtrzInfoData(e.itemData.atrzLnSn);
});

  return (  
    <div style={{padding: '20px'}}>
      <div className='container'>
        <p><strong>* 결재정보 </strong></p>
        <div className='atrz-container'>
          <div className='left-content'>
            <TreeView
              items={atrzDate.reverse()}
              dataStructure="plain"
              selectionMode="single"
              selectByClick={true}
              displayExpr={(e) => e.regDt.substr(0,10)}
              keyExpr="atrzLnSn"
              onItemSelectionChanged={handleTreeViewSelectionChange}
              noDataText='결재정보가 없습니다.'
            />
          </div>
          <div className='right-content'>
            {atrzDate.length === 0 ? null : <>
            <CustomHorizontalTable headers={AtrzInfo.AtrzSumry.AtrzSumry1} column={atrzInfoData[0]}/>
            {
              atrzInfoData.map((item) => {
                if(item.atrzOpnnCn !== null) {
                  return (
                    <CustomHorizontalTable headers={AtrzInfo.AtrzSumry.AtrzSumry3} column={item}/>
                  );
                } else if(item.rjctPrvonsh !== null){
                  return (
                    <CustomHorizontalTable headers={AtrzInfo.AtrzSumry.AtrzSumry4} column={item}/>
                  )
                } else {
                  return (
                    <CustomHorizontalTable headers={AtrzInfo.AtrzSumry.AtrzSumry2} column={item}/>
                  )
                }
              })
            }
            </>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectAtrzInfo;