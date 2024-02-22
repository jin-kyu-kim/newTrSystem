import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import TextBox from "devextreme-react/text-box";
import Box, { Item } from "devextreme-react/box"
import { Button } from "devextreme-react/button";

import CustomCdComboBox from "../unit/CustomCdComboBox";

const SearchNtcSet = ({ callBack }) => {
  const [initParam, setInitParam] = useState({
    searchCnd: "VTW01701",
    searchWrd: ""
  });

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

  const handleSubmit = () => {
    callBack(initParam);
  };

  const onClickInsertBtn = () => {
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
        <Item className="commonCdItem" ratio={1}>
          <CustomCdComboBox
            param="VTW017"
            name="searchCnd"
            onSelect={handleChgState}
            value={initParam.searchCnd}
          />
        </Item>

        <Item className="searchWord" ratio={1} >
          <TextBox
            placeholder="검색어"
            stylingMode="underlined"
            size="large"
            name="searchWrd"
            onValueChanged={(e) => handleChgState({ name: e.component.option('name'), value: e.value })}
          />
        </Item>

        <Item className="searchBtnItem" ratio={1} >
          <Button onClick={handleSubmit} text="검색" />
        </Item>

        <Item ratio={1} >
          <Button text="입력" onClick={onClickInsertBtn} />
        </Item>

      </Box>
    </div>
  );
};

export default SearchNtcSet;
