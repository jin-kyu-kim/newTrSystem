import React, { useState, forwardRef } from "react";

import DatePicker from "react-datepicker";
import ko from "date-fns/locale/ko";

import { Form } from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";

const CustomDatePicker = ({ onSelect, placeholderText }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showPlaceholder, setShowPlaceholder] = useState(true);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setShowPlaceholder(false);
    onSelect(date, placeholderText);
  };

  const CustomInput = forwardRef(({ value, onClick }, ref) => (
    <Form.Control
      ref={ref}
      type="text"
      value={value}
      placeholder={showPlaceholder ? placeholderText : ""}
      onClick={() => {
        onClick();
        setShowPlaceholder(false);
      }}
      size="lg"
      style={{ width: "150px" }}
      readOnly
    />
  ));

  return (
    <DatePicker
      selected={selectedDate}
      onChange={handleDateChange}
      dateFormat="yyyy-MM-dd"
      locale={ko}
      customInput={<CustomInput />}
    />
  );
};
export default React.memo(CustomDatePicker);
