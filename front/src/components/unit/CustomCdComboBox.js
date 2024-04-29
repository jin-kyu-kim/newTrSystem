
import React, { useEffect, useState, } from "react";

import SelectBox from "devextreme-react/select-box";
import { Validator, RequiredRule, } from "devextreme-react/validator";

import cdJson from "./cd.json";
import ApiRequest from "../../utils/ApiRequest";

const CustomCdComboBox = ({ param, placeholderText, onSelect, name, value, readOnly, between, label, required, showClearValue }) => {
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

    //코드값 between이 필요한 경우
    if(between){
      cdVal[1] = {
        ...cdVal[1],
        cdValue: between,
      };
    }

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

  const validate = () => {
    if(required) {
        return (
            <RequiredRule message={`${label}은(는) 필수 입력 값입니다.`}/>
        )
    }
}

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
        showClearButton={true}
      >
        <Validator>{validate()}</Validator>
      </SelectBox>
    // </div>
  );
};

export default React.memo(CustomCdComboBox);
