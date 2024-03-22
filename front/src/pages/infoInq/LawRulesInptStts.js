import React, { useState } from 'react';
// import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
// import 'react-tabs/style/react-tabs.css';
import CustomCdComboBox from '../../components/unit/CustomCdComboBox';
import CustomScheduler from '../../components/unit/CustomScheduler';
import TextBox from "devextreme-react/text-box";
import { Button } from "devextreme-react/button";
// import CustomTable from "components/unit/CustomTable";
import LawRulesJson from "./LawRulesJson.json";
import Calandar from '../../components/unit/CustomScheduler';
// import koLocale from '@fullcalendar/locales/ko';

<style>
  {`
    .tab_contents1 {
      width: '100%';
      height: 100%;
      backgroundColor: #fff;
      borderRadius: 10px;
      border: 1px solid #dddddd;
    }

    #content_1{
        width: '100%',
        height: '20px',
        backgroundColor: '#f5f5f5',
        borderRadius: '10px 10px 0 0',  // 여기에도 borderRadius를 적용
        border: '1px solid #dddddd'
    }
    #content_2{
        width: '90%',
        height: '100px',
        backgroundColor: '#fff',
        border: '0px solid #dddddd',
        borderRadius: '0 0 10px 10px'  // 여기에도 borderRadius를 적용
        ,marginLeft: '15px'
    }

  `}
</style>
const LawRulesInptStts = () => {
  const handleDayRender = (info) => {
    // info.date로 현재 렌더링되는 날짜에 접근 가능
    // info.el로 현재 날짜의 HTML 요소에 접근 가능
    info.el.style.cursor = 'pointer'; // 마우스를 올렸을 때 커서 변경
  };



    const [values, setValues] = useState([]);
    const [initParam, setInitParam] = useState({
      empno: "",
      empFlnm: "",
      jbpsNm: "",
      deptNm: "",
      telNo: "",
      hodfSttsNm: "",
    });
    const [pageSize, setPageSize] = useState(20);
  
      const handleChgState = ({ name, value }) => {
          setInitParam({
            ...initParam,
            [name]: value,
          });
        };
    return (
        <div className ='tab_contents1' style={{borderRadius: '10px'}}>
        <div id = 'content_1'style={{ width: '100%', height: '30px', backgroundColor: '##f5f5f5', border: '1px solid #dddddd'}}></div>
        <div id = 'content_2' style={{Width:'90%', height:'200px'}}><div>법제도 인력 선택</div>
            <div>
              <div style={{ width : '300px',margin : '10px 0 0 0'}}>
              <CustomCdComboBox
            //param="VTW001"
            placeholderText="선택.."
            name="deptNm"
            onSelect={handleChgState}
            value={initParam.deptNm}
          />
              </div>
            </div>
        </div>
        <div className='cal'>
        <Calandar
       // values={calendarData}
        headerToolbar={{
          left : "today prev next",
          center: "title",
          right: "dayGridMonth,timeGridWeek",
          locale:"ko"
        }}
        initialView="timeGridWeek"
        initCssBoolean={true}
        locale="ko"
        dayRender={handleDayRender} 
        // locales={[koLocale]}
       // initCssMenu={/* your menu configuration */}
      />
        </div>
      </div>
    
    );
   


};

export default LawRulesInptStts;