import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import CustomTable from "components/unit/CustomTable";
import EmpInfoJson from "./EmpInfoJson.json";
import TextBox from "devextreme-react/text-box";
import Box, { Item } from "devextreme-react/box";
import { Button } from "devextreme-react/button";
import CustomCdComboBox from "../../../components/unit/CustomCdComboBox";

const EmpCareer = ({ callBack, props }) => {
  const { keyColumn, tableColumns } = EmpInfoJson.EmpCareer;
  const [values, setValues] = useState([]);

  const [initParam, setInitParam] = useState({
    empno: "",
    empFlnm: "",
    jbpsNm: "",
    deptNm: "",
    telNo: "",
    hodfSttsNm: "",
  });

  const handleSubmit = () => {
    callBack(initParam);
  };

  const handleChgState = ({ name, value }) => {
    setInitParam({
      ...initParam,
      [name]: value,
    });
  };

  return (
    <div className="container" style={{ height: "700px" }}>
      <div className="title p-1" style={{ marginTop: "20px", marginBottom: "10px" }}>
        <h1 style={{ fontSize: "40px" }}>경력</h1>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <CustomTable keyColumn={keyColumn} columns={tableColumns} values={values} paging={true} />
      </div>
      <div style={{ marginBottom: "20px", backgroundColor: "#eeeeee", width: "100%", height: "300px", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ width: "95%", height: "250px", backgroundColor: "#fff" }}>
          <h5>경력을 입력/수정 합니다.</h5>
          <Box direction="row" width="50%" height={40}>
            <Item className="prjctNameItem" ratio={1}>
              <CustomCdComboBox param="VTW001" placeholderText="근무시작일" name="deptNm" onSelect={handleChgState} value={initParam.deptNm} />
            </Item>
            <Item className="prjctNameItem" ratio={1}>
              <CustomCdComboBox param="VTW001" placeholderText="근무종료일" name="deptNm" onSelect={handleChgState} value={initParam.deptNm} />
            </Item>
            <Item className="prjctMngrEmpIdItem" ratio={1}>
              <TextBox placeholder="근무처" stylingMode="filled" size="medium" name="empno" onValueChanged={(e) => handleChgState({ name: e.component.option("name"), value: e.value })} />
            </Item>
            <Item className="bizFlfmtTyCdItem" ratio={1}>
              <TextBox placeholder="소재지" stylingMode="filled" size="large" name="empFlnm" onValueChanged={(e) => handleChgState({ name: e.component.option("name"), value: e.value })} />
            </Item>
          </Box>
          <br />
          <Box direction="row" width="50%" height={40}>
            <Item className="prjctNameItem" ratio={1}>
              <CustomCdComboBox param="VTW001" placeholderText="주요경력사항" name="jbpsNm" onSelect={handleChgState} value={initParam.jbpsNm} />
            </Item>
            <Item className="prjctNameItem" ratio={1}>
              <CustomCdComboBox param="VTW001" placeholderText="특기사항" name="deptNm" onSelect={handleChgState} value={initParam.deptNm} />
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

export default EmpCareer;