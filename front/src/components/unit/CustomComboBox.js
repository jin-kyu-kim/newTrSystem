import { Form } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import cdJson from "../unit/cd.json";
import ApiRequest from "../../utils/ApiRequest";

const CustomComboBox = ({ param, placeholderText, onSelect, name }) => {
  const [cdVal, setCdVal] = useState([]);

  useEffect(() => {
    setCdVal(cdJson);
    setCdVal((prevCdVal) => {
      const updatedCdVal = [...prevCdVal];
      updatedCdVal[1] = {
        upCdValue: param,
      };
      return updatedCdVal;
    });
  }, []);

  useEffect(() => {
    if (cdVal.length === cdJson.length) {
      getCode();
    }
  }, [cdVal]);

  const getCode = async () => {
    try {
      const response = await ApiRequest("/boot/common/commonSelect", cdVal);

      const updatedCdValues = response.map((item) => ({
        cdValue: item.cdValue,
        cdNm: item.cdNm,
      }));

      setCdVal(updatedCdValues);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form.Select size="lg" onChange={onSelect} name={name}>
      <option value="">{placeholderText}</option>
      {cdVal.map((option, index) => (
        <option key={index} value={option.cdValue}>
          {option.cdNm}
        </option>
      ))}
    </Form.Select>
  );
};

export default React.memo(CustomComboBox);
