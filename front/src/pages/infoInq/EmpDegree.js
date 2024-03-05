import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import CustomTable from "components/unit/CustomTable";
import EmpInfoJson from "./EmpInfoJson.json";
import TextBox from "devextreme-react/text-box";
import Box, { Item } from "devextreme-react/box";
import { Button } from "devextreme-react/button";
import CustomCdComboBox from "../../components/unit/CustomCdComboBox";
import ApiRequest from "utils/ApiRequest";

const EmpDegree = () => {

const[param, setParam] = useState({});


  const {queryId, keyColumn, tableColumns } = EmpInfoJson.EmpDegree;
  const [values, setValues] = useState([]);

  useEffect(() => {
    // if (!Object.values(param).every((value) => value === "")) {
      // pageHandle();
    //  }
    setParam({
      ...param,
      queryId: queryId,
      empId : "202160c6-bf25-11ee-b259-000c2956283f",
    });
  }, []);



  const [initParam, setInitParam] = useState({
    empno: "",
    empFlnm: "",
    jbpsNm: "",
    deptNm: "",
    telNo: "",
    hodfSttsNm: "",
  });

  const handleSubmit = () => {
    //callBack(initParam);
  };

  const handleChgState = ({ name, value }) => {
    setInitParam({
      ...initParam,
    //  [name]: value,
    });
    
    setParam({
      queryId: queryId
    })
  };

  const pageHandle = async () => {
    try {
      const response =  await ApiRequest("/boot/common/queryIdSearch", param);
      setValues(response);
      if (response.length !== 0) {
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(()=>{
    pageHandle();
  },[param.empId]);

  return (
    <div className="container" style={{ height: "700px" }}>
      <div className="title p-1" style={{ marginTop: "20px", marginBottom: "10px" }}>
        <h1 style={{ fontSize: "40px" }}>학력</h1>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <CustomTable keyColumn={keyColumn} columns={tableColumns} values={values} paging={true} queryId={queryId}/>
      </div>
      <div style={{ marginBottom: "20px", backgroundColor: "#eeeeee", width: "100%", height: "300px", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ width: "95%", height: "250px", backgroundColor: "#fff" }}>
          <h5>학력을 입력/수정 합니다.</h5>
          <Box direction="row" width="50%" height={40}>
            <Item className="prjctNameItem" ratio={1}>
              <CustomCdComboBox param="VTW001" placeholderText="[학교구분]" name="deptNm" onSelect={handleChgState} value={initParam.deptNm} />
            </Item>
            <Item className="prjctMngrEmpIdItem" ratio={1}>
              <TextBox placeholder="학교명" stylingMode="filled" size="medium" name="empno" onValueChanged={(e) => handleChgState({ name: e.component.option("name"), value: e.value })} />
            </Item>
            <Item className="bizFlfmtTyCdItem" ratio={1}>
              <TextBox placeholder="전공(계열)" stylingMode="filled" size="large" name="empFlnm" onValueChanged={(e) => handleChgState({ name: e.component.option("name"), value: e.value })} />
            </Item>
          </Box>
          <br />
          <Box direction="row" width="100%" height={40}>
            <Item className="prjctNameItem" ratio={1}>
              <CustomCdComboBox param="VTW001" placeholderText="[졸업구분]" name="jbpsNm" onSelect={handleChgState} value={initParam.jbpsNm} />
            </Item>
            <Item className="prjctNameItem" ratio={1}>
              <CustomCdComboBox param="VTW001" placeholderText="[학점 만점]" name="deptNm" onSelect={handleChgState} value={initParam.deptNm} />
            </Item>
            <Item className="ctmmnyNameItem" ratio={1}>
              <TextBox placeholder="성적" stylingMode="filled" size="large" name="telNo" onValueChanged={(e) => handleChgState({ name: e.component.option("name"), value: e.value })} />
            </Item>
            <Item className="prjctNameItem" ratio={1}>
              <TextBox placeholder="입학년" stylingMode="filled" size="large" name="telNo" onValueChanged={(e) => handleChgState({ name: e.component.option("name"), value: e.value })} />
            </Item>
            <Item className="prjctNameItem" ratio={1}>
              <TextBox placeholder="졸업년" stylingMode="filled" size="large" name="telNo" onValueChanged={(e) => handleChgState({ name: e.component.option("name"), value: e.value })} />
            </Item>
          </Box>
          <Box style={{ marginTop: "30px", width: "20%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Item className="searchBtnItem" ratio={1} style={{ width: "50px" }}>
              <Button onClick={handleSubmit} text="저장" />
            </Item>
            <Item className="searchBtnItem" ratio={1} style={{ width: "50px" }}>
              <Button onClick={handleSubmit} text="초기화" />
            </Item>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default EmpDegree;