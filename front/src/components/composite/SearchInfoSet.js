// SearchInfoSet.js

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SelectBox from "devextreme-react/select-box";
import TextBox from "devextreme-react/text-box";
import Button from "devextreme-react/button";
import Box, { Item } from "devextreme-react/box";
import CustomComboBox from 'components/unit/CustomComboBox';
import CustomDateRangeBox from "components/unit/CustomDateRangeBox";
import AutoCompleteProject from "components/unit/AutoCompleteProject";
import "./SearchSet.css"

const SearchInfoSet = ({ callBack, props, insertPage }) => {
  const navigate = useNavigate();
  const [initParam, setInitParam] = useState({});
  const [ymOdrData, setYmOdrData] = useState({});
  const { searchParams, textBoxItem, selectBoxItem } = props;
  let btnName = searchParams.btnName ? searchParams.btnName : '검색';

  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const getYmList = (startYear, endYear) => ({
    yearList: Array.from({ length: endYear - startYear + 1 }, (_, i) => ({ value: startYear + i })),
    monthList: Array.from({ length: 12 }, (_, i) => ({ value: (i < 9 ? "0" : "") + (i + 1) })),
  });

  useEffect(() => {
    const { yearList, monthList } = getYmList(year - 10, year + 1);
    const odrVal = day > 15 ? "1" : "2";
    let currentYear = year;
    let currentMonth = month;

    if (odrVal === "2") {
      currentMonth -= 1;
      if (currentMonth < 1) {
        currentMonth = 12;
        currentYear -= 1;
      }
    }
    const monthVal = currentMonth < 10 ? "0" + currentMonth : currentMonth.toString();

    if (searchParams.yearList) {
      setInitParam({
        year: year,
        month: monthVal,
        aplyOdr: odrVal
      });
    }
    setYmOdrData({
      year: yearList,
      month: monthList,
      aplyOdr: [{ "id": "1", "value": "1", "text": "1회차" }, { "id": "2", "value": "2", "text": "2회차" }]
    });
    callBack(initParam);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        callBack(initParam);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [initParam]);

  const handleChgState = ({ name, value }) => {
    setInitParam({
      ...initParam,
      [name]: value,
    });
  };

  const handleStartDateChange = (newStartDate) => {
    setInitParam({
      ...initParam,
      [searchParams.startDtNm]: newStartDate,
    });
  };
  const handleEndDateChange = (newEndDate) => {
    setInitParam({
      ...initParam,
      [searchParams.endDtNm]: newEndDate
    });
  };

  const handleChgPrjct = (selectedOption) => {
    setInitParam({
      ...initParam,
      prjctId: selectedOption[0].prjctId,
    });
  };

  const handleSubmit = () => {
    callBack(initParam);
  };

  const onClickInsertBtn = () => {
    navigate(insertPage, {
      state: { editMode: "create" }
    });
  };

  return (
    <div className="box_search">
      <Box className="searchSet"
           style={{width: "100%", display: "flex", flexDirection: "row"}}>
        {searchParams.yearList && searchParams.yearList.map((item) => (
          <Item key={item.name} ratio={0} baseSize={"15%"} visible={item.visible}>
            <SelectBox
              dataSource={ymOdrData[item.name]}
              name={item.name}
              displayExpr={item.displayExpr}
              valueExpr={item.valueExpr}
              onValueChanged={(e) => handleChgState({ name: e.component.option("name"), value: e.value })}
              placeholder={item.placeholder}
              value={initParam[item.name]}
            />
          </Item>
        ))}

        {selectBoxItem && selectBoxItem.map((item, index) => (
          <Item key={index} ratio={1}>
            <CustomComboBox
              props={item.param}
              onSelect={handleChgState}
              placeholder={item.placeholder}
              value={initParam[item.param.name]}
            />
          </Item>
        ))}

        {textBoxItem && textBoxItem.map((item, index) => (
          <Item key={index} ratio={1}>
            <TextBox
              placeholder={item.placeholder}
              stylingMode="underlined"
              size="medium"
              onEnterKey={handleSubmit}
              name={item.name}
              showClearButton={true}
              onValueChanged={(e) => handleChgState({ name: e.component.option('name'), value: e.value })}
            />
          </Item>
        ))}

        {searchParams.dateRange &&
          <Item ratio={2}>
            <CustomDateRangeBox
              onStartDateChange={handleStartDateChange}
              onEndDateChange={handleEndDateChange}
            />
          </Item>
        }
        {searchParams.project &&
          <Item ratio={2}>
            <AutoCompleteProject 
              placeholderText="프로젝트 명"
              onValueChange={handleChgPrjct}
            />
          </Item>
        }
        <Item ratio={1}>
          <Box>
            <Item ratio={1}>
              <Button onClick={handleSubmit} text={btnName} style={{ margin: "5px" }} />
            </Item>

            {searchParams.insertButton &&
              <Item ratio={1}>
                <Button type='default' text="입력" onClick={onClickInsertBtn} style={{ margin: "5px" }} />
              </Item>
            }
          </Box>
        </Item>
      </Box>
    </div>
  );
};

export default SearchInfoSet;
