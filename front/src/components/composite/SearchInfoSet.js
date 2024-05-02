import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SelectBox from "devextreme-react/select-box";
import TextBox from "devextreme-react/text-box";
import Button from "devextreme-react/button";
import Box, { Item } from "devextreme-react/box"
import CustomComboBox from 'components/unit/CustomComboBox';
import CustomDateRangeBox from "components/unit/CustomDateRangeBox";

const SearchInfoSet = ({ callBack, props, insertPage }) => {
  const navigate = useNavigate();
  const [ initParam, setInitParam ] = useState({});
  const [ ymOdrData, setYmOdrData ] = useState({});
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

  const handleSubmit = () => {
    callBack(initParam);
  };

  const onClickInsertBtn = () => {
    navigate(insertPage, {
      state: { editMode: "create" }
    })
  };

  return (
    <div className="box_search" width="100%">
      <Box
        direction="row"
        width="100%"
        height={40}
      >
        {searchParams.yearList && searchParams.yearList.map((item) => (
          <Item ratio={0} baseSize={"120"} visible={item.visible}>
            <SelectBox
              dataSource={ymOdrData[item.name]}
              name={item.name}
              displayExpr={item.displayExpr}
              valueExpr={item.valueExpr}
              onValueChanged={(e) => handleChgState({ name: e.component.option("name"), value: e.value })}
              placeholder={item.placeholder}
              style={{ margin: "0px 5px 0px 5px" }}
              value={initParam[item.name]}
            />
          </Item>
        ))}

        {selectBoxItem && selectBoxItem.map((item, index) => {
          return (
            <Item key={index} ratio={1}>
              <CustomComboBox
                props={item.param}
                onSelect={handleChgState}
                placeholder={item.placeholder}
                value={initParam[item.param.name]}
              />
            </Item>
          )
        })}

        {textBoxItem && textBoxItem.map((item, index) => {
          return (
            <Item key={index} ratio={1} >
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

        {searchParams.dateRange &&
          <Item ratio={2}>
            <CustomDateRangeBox
              onStartDateChange={handleStartDateChange}
              onEndDateChange={handleEndDateChange}
            />
          </Item>
        }

        <Item ratio={1} >
          <Button type='default' onClick={handleSubmit} text={btnName} />
        </Item>

        {searchParams.insertButton &&
          <Item ratio={1}>
            <Button text="입력" onClick={onClickInsertBtn} />
          </Item>
        }
      </Box>
    </div>
  );
};
export default SearchInfoSet;