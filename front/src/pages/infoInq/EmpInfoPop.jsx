import React, { useState, useEffect , useRef} from "react";
import EmpInfoJson from "./EmpInfoJson.json";
import ApiRequest from "utils/ApiRequest";
import { useCookies } from "react-cookie";
import { Button } from "devextreme-react";
import ReactToPrint from "react-to-print";
import {Item,Form,GroupItem,} from "devextreme-react/form";
import CustomEditTable from "components/unit/CustomEditTable";
import styles from './EmpInfoStyles.module.css';
const EmpInfoPop = ({ naviEmpId }) => {
  const [baseInfoData, setBaseInfoData] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  /*유저세션*/
  const [cookies, setCookie] = useCookies(["userInfo", "userAuth"]);
  const [degree, setDegree] = useState([]);
  const {EmpDegree,EmpLanguage,EmpLicense,EmpEduHist,EmpCareer,prjctHist} = EmpInfoJson;

  const EmpDegreeData = { queryId: EmpDegree.queryId, keyColumn: EmpDegree.keyColumn, tableColumns: EmpDegree.tableColumns};
  const EmpLanguageData = { queryId: EmpLanguage.queryId, keyColumn: EmpLanguage.keyColumn, tableColumns: EmpLanguage.tableColumns};
  const EmpLicenseData = { queryId: EmpLicense.queryId, keyColumn: EmpLicense.keyColumn, tableColumns: EmpLicense.tableColumns};
  const EmpEduHistData = { queryId: EmpEduHist.queryId, keyColumn: EmpEduHist.keyColumn, tableColumns: EmpEduHist.tableColumns};
  const EmpCareerData = { queryId: EmpCareer.queryId, keyColumn: EmpCareer.keyColumn, tableColumns: EmpCareer.tableColumns};
  const prjctHistData = { queryId: prjctHist.queryId, keyColumn: prjctHist.keyColumn, tableColumns: prjctHist.tableColumns};

   let empId;

    if(naviEmpId.length !== 0){
        empId = naviEmpId;
    } else {
        empId = cookies.userInfo.empId;
    }

    /* 기본 정보 */
    useEffect(() => {
      baseData();
    }, []);

  const baseData = async () => {
    const param = {
      queryId: "infoInqMapper.retrieveEmpBassInfo",
      empId: empId,
    };
    
    try {
      const response = await ApiRequest("/boot/common/queryIdSearch", param);
      console.log("response",response)
      delete response[0].regDt;
      delete response[0].regEmpId;
      setBaseInfoData(response[0]);
      if(response.length > 0){
        pageDegree();
      }
    
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const pageDegree = async () => {
    const params = [
       {queryId: EmpDegreeData.queryId, empId: empId}
      ,{queryId: EmpLanguage.queryId, empId: empId}
      ,{queryId: EmpLicense.queryId, empId: empId}
      ,{queryId: EmpEduHist.queryId, empId: empId}
      ,{queryId: EmpCareer.queryId, empId: empId}
      ,{queryId: prjctHist.queryId, empId: empId}
    ]
    try {
      const response = await ApiRequest("/boot/informaiton/empInfo", params);
      if(response.length !== 0) setDegree(response);
    } catch (error) {
      console.log(error);
    }
  };


  const componentRef = useRef();
  return (
    <React.Fragment>
    <div style={{marginTop : "20px" , marginBottom: "20px" ,display: "flex", justifyContent: "flex-end"}}>
                  <ReactToPrint 
                   trigger={() => ( <Button text='출력' type='success' icon='print' /> )}
                   content={() => componentRef.current} 
                   pageStyle="@page { size: A4; ratio:100%; }" 
                  />
    </div>
    <div style={{padding: "20px" ,backgroundColor: "#b5c1c7", width : "100%" }} >
    <div className="container" style={{ padding: "20px" ,backgroundColor: "#fff" }}>
        <div ref ={componentRef} style={{padding: "20px" , width : "100%" }}>
          <p>
            <strong>* 직원 기본정보</strong>
          </p>
          <Form colCount={2}>
            <GroupItem>
              <GroupItem >
                <Item
                  dataField="성명"
                  editorOptions={{
                    value: baseInfoData.empFlnm,
                    readOnly: true,
                  }}
                />
                <Item
                  dataField="전화번호"
                  editorOptions={{ value: baseInfoData.telno, readOnly: true }}
                />
              </GroupItem>
            </GroupItem>

            <GroupItem>
              <GroupItem >
                <Item
              
                  dataField="소속"
                  editorOptions={{ value: baseInfoData.deptNm, readOnly: true }}
                />
                <Item
                  dataField="이메일"
                  editorOptions={{ value: baseInfoData.eml, readOnly: true }}
                />
              </GroupItem>
            </GroupItem>
          </Form>
          <p style={{marginTop : "20px" , marginBottom: "20px"}}>
            <strong >* 학력</strong>
          </p>
          <CustomEditTable values={degree.EmpDegree} keyColumn={EmpDegreeData.keyColumn} columns={EmpDegreeData.tableColumns} callback={pageDegree} noEdit={true} />     

          <p style={{marginTop : "20px" , marginBottom: "20px"}}>
            <strong >* 외국어능력</strong>
          </p>
          <CustomEditTable values={degree.EmpLanguage} keyColumn={EmpLanguageData.keyColumn} columns={EmpLanguageData.tableColumns} callback={pageDegree} noEdit={true} />     

          <p style={{marginTop : "20px" , marginBottom: "20px"}}>
            <strong >* 자격면허</strong>
          </p>
          <CustomEditTable values={degree.EmpLicense} keyColumn={EmpLicenseData.keyColumn} columns={EmpLicenseData.tableColumns} callback={pageDegree} noEdit={true} />     

          <p style={{marginTop : "20px" , marginBottom: "20px"}}>
            <strong >* 교육이력</strong>
          </p>
          <CustomEditTable values={degree.EmpEduHist} keyColumn={EmpEduHistData.keyColumn} columns={EmpEduHistData.tableColumns} callback={pageDegree} noEdit={true} />     

          <p style={{marginTop : "20px" , marginBottom: "20px"}}>
            <strong >* 경력</strong>
          </p>
          <CustomEditTable values={degree.EmpCareer} keyColumn={EmpCareerData.keyColumn} columns={EmpCareerData.tableColumns} callback={pageDegree} noEdit={true} />     

          <p style={{marginTop : "20px" , marginBottom: "20px"}}>
            <strong >* 프로젝트</strong>
          </p>
          <CustomEditTable values={degree.PrjctHist} keyColumn={prjctHistData.keyColumn} columns={prjctHistData.tableColumns} callback={pageDegree} noEdit={true} />  
          </div>
          &nbsp;
        </div>
      </div>
     
    </React.Fragment>
    
  );
};

export default EmpInfoPop;


