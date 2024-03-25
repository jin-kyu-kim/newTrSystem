import React, { useState } from 'react';
// import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
// import 'react-tabs/style/react-tabs.css';
import CustomCdComboBox from '../../components/unit/CustomCdComboBox';
import TextBox from "devextreme-react/text-box";
import { Button } from "devextreme-react/button";
import CustomTable from "components/unit/CustomTable";
import LawRulesJson from "./LawRulesJson.json";
<style>
  {`
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
const LawRulesDmndList = () => {
    const { keyColumn, queryId, tableColumns, searchParams, popup } = LawRulesJson;


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
        <>
        <div className ="tab_contents2" style={{display :'flex', width: '100%'}}>
            <div style={{ marginLeft: '650px', width: '200px' }}>
            < TextBox
                placeholder="검색어"
                stylingMode="underlined"
                size="medium"
                name="empno"
            />
            </div>
            <div style={{ margin: '10px', marginTop: '20px', marginLeft: '55px'}}>
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
    </>

    );
   


};

export default LawRulesDmndList;