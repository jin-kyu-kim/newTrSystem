import React, { useEffect, useState } from 'react';

import ApiRequest from '../../../utils/ApiRequest';

const ProjectListDetailBaseInfo = () => {
  const [tabData, setTabData] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await ApiRequest("api-endpoint-for-tab-1", param);
//         setTabData(response.data);
//       } catch (error) {
//         console.error('Error fetching data for Tab 1:', error);
//       }
//     };

//     fetchData();
//   }, []);

  return (
    <div>
{/* 
      {tabData.map((data, index) => (
        <div key={index}>{data.someValue}</div>
      ))}
       */}
       기본정보
    </div>
  );
};

export default ProjectListDetailBaseInfo;