import React, { useState, useEffect } from "react";
 
import TextBox from "devextreme-react/text-box";
import Box, {Item} from "devextreme-react/box"
import { Button } from "devextreme-react/button";
 
import CustomDateRangeBox from "../unit/CustomDateRangeBox";
import CustomCdComboBox from "../unit/CustomCdComboBox";
import AutoCompleteProject from "../unit/AutoCompleteProject";
 
 
 
const SearchEmpSet = ({ callBack, props, popup }) => {
  const [initParam, setInitParam] = useState({
    empno: "",
    empFlnm: "",
    jbpsNm: "",
    deptNm: "",
    telNo: "",
    hodfSttsNm: "",
  });
 
 
  useEffect(() => {
    callBack(initParam);
  }, []);
 
  // SelectBox 변경
  const handleChgState = ({name, value}) => {
    setInitParam({
      ...initParam,
     [name] : value,
    });
  };
 
  // 프로젝트
  const handleChgPrjct = (selectedOption) => {
    setInitParam({
      ...initParam,
     
      jbpsNm: selectedOption,
     
    });
  };
 
 
 
  const handleSubmit = () => {
    callBack(initParam);
  };
 
 
 
  return (
    <div className="box_search" width="100%">
      <Box
        direction="row"
        width="100%"
 
        height={40}
      >
        <Item className="prjctMngrEmpIdItem" ratio={1} visible={props.prjctMngrEmpIdItem}>
          <TextBox
            placeholder="사번"
            stylingMode="underlined"
            size="medium"
            name="empno"
            onValueChanged={(e) => handleChgState({ name: e.component.option('name'), value: e.value })}
          />
        </Item>
        <Item className="bizFlfmtTyCdItem" ratio={1} visible={props.bizFlfmtTyCdItem}>
          <TextBox
                placeholder="성명"
                stylingMode="underlined"
                size="large"
                name="empFlnm"
                onValueChanged={(e) => handleChgState({ name: e.component.option('name'), value: e.value })}
          />
        </Item>
       
        <Item className="prjctNameItem" ratio={1}>
     
 
        <CustomCdComboBox
            param="VTW001"
            placeholderText="직위"
            name="jbpsNm"
            onSelect={handleChgState}
            value={initParam.jbpsNm}
          />
 
         
        </Item>
 
        <Item className="prjctNameItem" ratio={1} >
         <CustomCdComboBox
            param="VTW001"
            placeholderText="소속"
            name="deptNm"
            onSelect={handleChgState}
            value={initParam.deptNm}
          />
         
        </Item>
 
        <Item className="ctmmnyNameItem" ratio={1} >
          <TextBox
            placeholder="전화번호"
            stylingMode="underlined"
            size="large"
            name="telNo"
            onValueChanged={(e) => handleChgState({ name: e.component.option('name'), value: e.value })}
          />
        </Item>
 
        <Item className="prjctNameItem" ratio={1}>
         {/* <CustomCdComboBox
            param="VTW003"
            placeholderText="재직여부"
            name="hodfSttsNm"
            onSelect={handleChgState}
            value={initParam.prjctStleCd}
          /> */}
 
<CustomCdComboBox
            param="VTW003"
            placeholderText="재직여부"
            name="hodfSttsNm"
            onSelect={handleChgState}
            value={initParam.hodfSttsNm}
          />
         
        </Item>
       
       
        <Item className="searchBtnItem" ratio={1} >
          <Button
            onClick={handleSubmit} text="검색"
          />
        </Item>
       
      </Box>
    </div>
  );
};
 
export default SearchEmpSet;