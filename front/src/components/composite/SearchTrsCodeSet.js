import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import TextBox from "devextreme-react/text-box";
import Box, { Item } from "devextreme-react/box"
import { Button } from "devextreme-react/button";

import CustomCdComboBox from "../unit/CustomCdComboBox";

import ApiRequest from "utils/ApiRequest";

const SearchTrsCodeSet = ({ callBack, props, popup }) => {
  const [initParam, setInitParam] = useState({
    ctmmnparenCdValueyNm:"",
    parentCdNm:"",
    childCdValue:"",
    childCdNm:""
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
  const handleChgTrsCode = (selectedOption) => {
    setInitParam({
      ...initParam,
      parenCdValue: selectedOption,
    });
  };

  const handleSubmit = () => {
    callBack(initParam);
  };

  const onClickInsertBtn = () => {
    // 입력버튼을 누르면 입력페이지로 이동
    navigate("/infoInq/NoticeInput",
      {
        state: {
        }
      })
  };

  return (
    <div className="box_search" width="100%">
      <Box
        direction="row"
        width="100%"
        height={40}
      >
        <Item className="prjctStleCdItem" ratio={1} visible={props.prjctStleCdItem}>
          <CustomCdComboBox
            param="VTW001"
            placeholderText="[분류명]"
            name="prjctStleCd"
            onSelect={handleChgState}
            value={initParam.prjctStleCd}
          />
        </Item>

        <Item className="ctmmnyNameItem" ratio={1} visible={props.ctmmnyNameItem}>
          <TextBox
            placeholder="코드"
            stylingMode="underlined"
            size="large"
            name=""
            onValueChanged={(e) => handleChgState({ name: e.component.option('name'), value: e.value })}
          />
        </Item>
        <Item className="ctmmnyNameItem" ratio={1} visible={props.ctmmnyNameItem}>
          <TextBox
            placeholder="코드명"
            stylingMode="underlined"
            size="large"
            name=""
            onValueChanged={(e) => handleChgState({ name: e.component.option('name'), value: e.value })}
          />
        </Item>

        <Item className="searchBtnItem" ratio={1} visible={props.searchBtnItem}>
          <Button onClick={handleSubmit} text="검색" />
        </Item>


      </Box>
    </div>
  );
};

export default SearchTrsCodeSet;
