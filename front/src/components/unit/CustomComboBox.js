
import React, { useEffect, useState, } from "react";

import SelectBox from "devextreme-react/select-box";

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
        >
      </SelectBox>
    // </div>
  );
};

export default React.memo(CustomComboBox);
