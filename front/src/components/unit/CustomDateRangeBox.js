import React, { useState, useEffect } from "react";

import { DateBox } from "devextreme-react/date-box";
import Box, {Item} from "devextreme-react/box";

const CustomDateRangeBox = ({ onStartDateChange, onEndDateChange }) => {
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);

  const handleStartDateChange = (e) => {
    const newStartDate = e.value;

    // 시작일자가 종료일자보다 크다면 종료일자를 시작일자로 설정
    const newEndDate = selectedEndDate && newStartDate > selectedEndDate ? newStartDate : selectedEndDate;

    setSelectedStartDate(newStartDate);

    // 부모 컴포넌트로 시작일자 전달
    onStartDateChange(newStartDate);

    // 종료일자가 변경된 경우 부모 컴포넌트로 종료일자 전달
    if (newEndDate !== selectedEndDate) {
      onEndDateChange(newEndDate);
    }
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.value;

    // 종료일자가 시작일자보다 작다면 시작일자를 종료일자로 설정
    const newStartDate = selectedStartDate && newEndDate < selectedStartDate ? newEndDate : selectedStartDate;

    setSelectedEndDate(newEndDate);

    // 부모 컴포넌트로 종료일자 전달
    onEndDateChange(newEndDate);

    // 시작일자가 변경된 경우 부모 컴포넌트로 시작일자 전달
    if (newStartDate !== selectedStartDate) {
      onStartDateChange(newStartDate);
    }
  };

  return (
    <Box
      direction="row"
      width="100%"
    >
      <Item ratio={1}>
        <DateBox
          value={selectedStartDate}
          onValueChanged={handleStartDateChange}
          width="100%"
          dateSerializationFormat="yyyyMMdd"
          placeholder="시작 일자"
          displayFormat="yyyy-MM-dd"
          type="date"
        />
      </Item>
      <Item ratio={1}>
        <DateBox
          value={selectedEndDate}
          onValueChanged={handleEndDateChange}
          width="100%'"
          dateSerializationFormat="yyyyMMdd"
          placeholder="종료 일자"
          displayFormat="yyyy-MM-dd"
          type="date"
        />
      </Item>
    </Box>
  );
};

export default React.memo(CustomDateRangeBox);