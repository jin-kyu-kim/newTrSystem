
import React, { useEffect, useState, } from "react";

import SelectBox from "devextreme-react/select-box";

import cdJson from "./cd.json";
import ApiRequest from "../../utils/ApiRequest";

const CustomCdComboBox = ({ param, placeholderText, onSelect, name, value, readOnly }) => {
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
    if (cdVal[0] === cdJson[0]) {
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
    // <div className="dx-field-value">
      <SelectBox
        dataSource={cdVal}
        displayExpr="cdNm"
        valueExpr="cdValue"
        placeholder={placeholderText}
        onValueChanged={(e) => {
          onSelect({ name, value: e.value });
        }}
        searchEnabled={true}
        width="100%"
        value={value}
        readOnly={readOnly}
      >
      </SelectBox>
    // </div>
  );
};

export default React.memo(CustomCdComboBox);
