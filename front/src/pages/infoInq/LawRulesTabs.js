// TabsComponent.js

import React, { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import CustomCdComboBox from '../../components/unit/CustomCdComboBox';
import TextBox from "devextreme-react/text-box";
import { Button } from "devextreme-react/button";
import CustomTable from "components/unit/CustomTable";
import LawRulesJson from "./LawRulesJson.json";
<style>
  {`-
    .tab_contents1 {
      width: 100%;
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
    .tab_contents2{
        marginLeft: '700px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill,
        minmax(150px, 1fr))',
        gap: '10px' 
    }
  `}
</style>
const LawRulesTabs = ({ tabIndex, handleTabChange }) => {
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
      const { keyColumn, queryId, tableColumns, searchParams, popup } = LawRulesJson;

  return (
    <Tabs selectedIndex={tabIndex} onSelect={handleTabChange}>
    <TabList>
      <Tab>법제도 투입현황</Tab>
      <Tab>법제도 요청 목록</Tab>
    </TabList>
    <TabPanel>
      {/* 탭 1 컨텐츠 */}
      <div class ="tab_contents">
        <div id = "content_1"></div>
        <div id = "content_2" ><div>법제도 선택</div>
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
              <div></div>
            </div>
        </div>
      </div>
    </TabPanel>
    <TabPanel>

      <div class ="tab_contents2">
        <div style={{ margin: '10px', width: '200px' }}>
          < TextBox
            placeholder="검색어"
            stylingMode="underlined"
            size="medium"
            name="empno"
          />
        </div>
        <div style={{ margin: '10px', marginTop: '20px', marginLeft: '55px',display: 'flex' }}>
          <Button  text="검색" />
           <Button text="작성" style={{backgroundColor : 'skyblue' , color: '#fff', marginLeft: '5px'}} />
        </div>
      </div>
      <CustomTable
        keyColumn={keyColumn}
        pageSize={pageSize}
        columns={tableColumns}
        values={values}
        paging={true}
      />
    </TabPanel>
  </Tabs>
  );
};
export default LawRulesTabs;