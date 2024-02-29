import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TextBox from "devextreme-react/text-box";
import Box, { Item } from "devextreme-react/box"
import { Button } from "devextreme-react/button";

import CustomCdComboBox from "../unit/CustomCdComboBox";

const SearchEmpSet = ({ callBack, props }) => {
  const navigate = useNavigate();

  const { searchParams, firstCd, textBoxItem, selectBoxItem } = props;
  const [initParam, setInitParam] = useState({
    searchCnd: firstCd ? firstCd : "",
    searchWrd: "",
    jbpsNm: "",
    deptNm: "",
    hodfSttsNm: "",
  });

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
    navigate("/infoInq/NoticeInput")
  };

  return (
    <div className="box_search" width="100%">
      <Box
        direction="row"
        width="100%"
        height={40}
      >
        {selectBoxItem.map((item) => {
          return(
            <Item ratio={1}>
              <CustomCdComboBox
                param={item.commonCd}
                name={item.name}
                placeholderText={item.placeholderText}
                onSelect={handleChgState}
                value={item.isSingleCnd ? initParam.searchCnd : initParam[item.name]}
              />
            </Item>
          )
        })}

        {textBoxItem.map((item) => {
            return(
              <Item className={item.className} ratio={1} >
                <TextBox
                  placeholder={item.placeholder}
                  stylingMode="underlined"
                  size="medium"
                  name={item.name}
                  showClearButton={true}
                  onValueChanged={(e) => handleChgState({ name: e.component.option('name'), value: e.value })}
                />
              </Item>
            )
        })}

        <Item className="searchBtnItem" ratio={1} >
          <Button onClick={handleSubmit} text="검색" />
        </Item>
        <Item ratio={1} visible={searchParams.insertButton}>
          <Button text="입력" onClick={onClickInsertBtn} />
        </Item>

      </Box>
    </div>
  );
};

export default SearchEmpSet;