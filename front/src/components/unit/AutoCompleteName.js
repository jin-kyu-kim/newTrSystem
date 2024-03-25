import ApiRequest from "../../utils/ApiRequest";

import React, { useEffect, useState } from "react";
import SelectBox from 'devextreme-react/select-box';
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';

const AutoCompleteName = ({ placeholderText, onValueChange, readOnlyValue, value}) => {
  const [suggestionsData, setSuggestionsData] = useState([]);
  const [valid, setValid] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ApiRequest("/boot/common/commonSelect", [
          { tbNm: "EMP" },
          {},
        ]);
        const processedData = response.map(({ empno, empFlnm }) => ({
          key: empno,
          value: empFlnm,
        }));
        setSuggestionsData(processedData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const handleSelectChange = (e) => {
    const selectedOption = e.value;
    // console.log(selectedOption)

    if (selectedOption) {
      onValueChange(selectedOption);
      setValid(true);
    } else {
      onValueChange("");
      setValid(false);
    }
  };

  const handleBlur = () => {
    setValid(true); // Ensure that the SelectBox is valid after blur
  };

  return (
    <SelectBox
      dataSource={suggestionsData}
      valueExpr="key"
      displayExpr="value"
      onValueChanged={handleSelectChange}
      placeholder={placeholderText}
      searchEnabled={true}
      stylingMode="underlined"
      onBlur={handleBlur}
      showClearButton={true}
      value={value}
      readOnly={readOnlyValue}
    />
  );
};

export default AutoCompleteName;
