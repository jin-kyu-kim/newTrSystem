import React, { useState, useEffect } from "react";

import TextBox from "devextreme-react/text-box";
import Box, {Item} from "devextreme-react/box"
import { Button } from "devextreme-react/button";

import CustomDatePicker from "../unit/CustomDatePicker";
import CustomComboBox from "../unit/CustomComboBox";
import AutoCompleteProject from "../unit/AutoCompleteProject";

const SearchPrjctSet = ({ callBack, props }) => {
  const [initParam, setInitParam] = useState({
    prjctStleCd: "",
    prjctId: "",
    ctmmnyNo: "",
    bizFlfmtTyCd: "",
    ctrtYmd: "",
    bizEndYmd: "",
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
      prjctId: selectedOption,
    });
  };

  const handleStartDateChange = (newStartDate) => {
   
    // 시작일자가 변경될 때 수행할 로직 추가
    setInitParam({
      ...initParam,
      ctrtYmd: newStartDate,
    });
  };

  const handleEndDateChange = (newEndDate) => {

    // 종료일자가 변경될 때 수행할 로직 추가
    setInitParam({
      ...initParam,
      bizEndYmd: newEndDate
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
        <Item className="prjctStleCdItem" ratio={1} visible={props.prjctStleCdItem}>
          <CustomComboBox
            param="VTW018"
            placeholderText="[형태]"
            name="prjctStleCd"
            onSelect={handleChgState}
          />
        </Item>
        <Item className="prjctNameItem" ratio={1} visible={props.prjctNameItem}>
          <AutoCompleteProject
            placeholderText="프로젝트 명"
            onValueChange={handleChgPrjct}
          />
        </Item>
        <Item className="ctmmnyNameItem" ratio={1} visible={props.ctmmnyNameItem}>
          <TextBox
            placeholder="고객사"
            stylingMode="underlined"
            size="large"
            name="ctmmnyNo"
            onValueChanged={(e) => handleChgState({ name: e.component.option('name'), value: e.value })}
          />
        </Item>
        <Item className="prjctMngrEmpIdItem" ratio={1} visible={props.prjctMngrEmpIdItem}>
          <TextBox
            placeholder="기안자"
            stylingMode="underlined"
            size="large"
            name="prjctMngrEmpId"
            onValueChanged={(e) => handleChgState({ name: e.component.option('name'), value: e.value })}
          />
        </Item>
        <Item className="bizFlfmtTyCdItem" ratio={1} visible={props.bizFlfmtTyCdItem}>
          <CustomComboBox
            param="VTW004"
            placeholderText="[상태]"
            name="bizFlfmtTyCd"
            onSelect={handleChgState}
          />
        </Item>
        <Item className="prjctDatePickerItem" ratio={2} visible={props.prjctDatePickerItem}>
          <CustomDatePicker
            onStartDateChange={handleStartDateChange}
            onEndDateChange={handleEndDateChange}
          />
        </Item>
        <Item className="searchBtnItem" ratio={1} visible={props.searchBtnItem}>
          <Button
            onClick={handleSubmit} text="검색"
          />
        </Item>
        <Item ratio={1} visible={props.insertBtnItem}>
          <Button text="입력" />
        </Item>
      </Box>
    </div>
  );
};

export default SearchPrjctSet;
