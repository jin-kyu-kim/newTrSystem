import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import TextBox from "devextreme-react/text-box";
import Box, { Item } from "devextreme-react/box"
import { Button } from "devextreme-react/button";

import CustomCdComboBox from "../unit/CustomCdComboBox";

import ApiRequest from "utils/ApiRequest";

const SearchCustomersSet = ({ callBack, props, popup }) => {
  const [initParam, setInitParam] = useState({
    ctmmnyNm:"",
    ctmmnyId:""
  });
 
  const [popupVisible, setPopupVisible] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    callBack(initParam);
  }, []);

  // SelectBox 변경
  const handleChgState = ({ name, value }) => {
    setInitParam({
      ...initParam,
      [name]: value,
    });
  };

  // 공지 
  const handleChgCst = (selectedOption) => {
    setInitParam({
      ...initParam,
      ctmmnyId: selectedOption,
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
        <Item className="ctmmnyNameItem" ratio={1} visible={props.ctmmnyNameItem}>
          <TextBox
            placeholder={props.ctmmnyId}
            stylingMode="underlined"
            size="large"
            name="ctmmnyId"
            onValueChanged={(e) => handleChgState({ name: e.component.option('name'), value: e.value })}
          />
        </Item>

        <Item className="ctmmnyNameItem" ratio={1} visible={props.ctmmnyNameItem}>
          <TextBox
            placeholder=""
            placeholderText= {props.ctmmnyId}
            stylingMode="underlined"
            size="large"
            name={props.ctmmnyId}
            onValueChanged={(e) => handleChgState({ name: e.component.option('name'), value: e.value })}
          />
        </Item>
        <Item className="prjctStleCdItem" ratio={1} visible={props.prjctStleCdItem}>
          <CustomCdComboBox
            param="VTW016"
            placeholderText="[산업명]"
            name="prjctStleCd"
            onSelect={handleChgState}
            value={initParam.prjctStleCd}
          />
        </Item>

        <Item className="searchBtnItem" ratio={1} visible={props.searchBtnItem}>
          <Button onClick={handleSubmit} text="검색" />
        </Item>


      </Box>
    </div>
  );
};

export default SearchCustomersSet;
