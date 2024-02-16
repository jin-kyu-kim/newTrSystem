import React, { useEffect, useState, } from 'react';

import ApiRequest from '../../../utils/ApiRequest';
import CustomHorizontalTable from '../../../components/unit/CustomHorizontalTable';
import AtrzInfo from './ProjectAtrzInfoJson.json';

const ProjectAtrzInfo = ({prjctId}) => {
const [atrzInfoData, setAtrzInfoData] = useState([]);

useEffect(() => {
  AtrzInfoData();
}, []);

const AtrzInfoData = async () => {
  const param =
    { queryId: AtrzInfo.queryId,
      prjctId: prjctId, 
    }
 ; 
  try {
    console.log(param)
    const response = await ApiRequest("/boot/common/queryIdSearch", param);
    setAtrzInfoData(response);
  } catch (error) {
    console.error('Error fetching data', error);
  }
};

  return (
    <div style={{padding: '20px'}}>
    <div className='container'>
      <p><strong>* 결재정보 </strong></p>
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
    </div>
  </div>
  );
};

export default ProjectAtrzInfo;