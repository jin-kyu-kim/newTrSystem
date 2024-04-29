import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TextBox from "devextreme-react/text-box";
import Box, { Item } from "devextreme-react/box"
import { Button } from "devextreme-react/button";
import CustomComboBox from 'components/unit/CustomComboBox';
import CustomDateRangeBox from "components/unit/CustomDateRangeBox";

const SearchInfoSet = ({ callBack, props, insertPage }) => {
  const navigate = useNavigate();
  const [initParam, setInitParam] = useState({});
  const { searchParams, textBoxItem, selectBoxItem } = props;

  useEffect(() => {
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
      state:{editMode:"create"}
    })
  };

  return (
    <div className="box_search" width="100%">
      <Box
        direction="row"
        width="100%"
        height={40}
      >
        {selectBoxItem && selectBoxItem.map((item, index) => {
          return(
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
            return(
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
          <Button onClick={handleSubmit} text="검색" />
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