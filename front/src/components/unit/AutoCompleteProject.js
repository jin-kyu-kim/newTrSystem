import ApiRequest from "../../utils/ApiRequest";

import React, { useEffect, useState } from "react";
import SelectBox from 'devextreme-react/select-box';
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';

// 2024.03.21(박지환)
// return값 추가 (prjctMngrEmpId)
// return값 추가됨에따라 배열로 반환받음

// 2024.04.08(박지환)
// sttsBoolean props 추가 
// 수행중인 프로젝트만 조회

const AutoCompleteProject = ({ placeholderText, onValueChange, sttsBoolean }) => {
  const [suggestionsData, setSuggestionsData] = useState([]);
  const [valid, setValid] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ApiRequest("/boot/common/commonSelect", [
          { tbNm: "PRJCT" },
          {},
        ]);

        const processedData = response.map(({ prjctId, prjctNm, prjctMngrEmpId, bizSttsCd }) => ({
          key: prjctId,
          value: prjctNm,
          prjctMngrEmpId: prjctMngrEmpId,
          bizSttsCd: bizSttsCd,
        }));

        if(sttsBoolean && sttsBoolean == true){
          setSuggestionsData(processedData.filter(item => item.bizSttsCd == "VTW00402"));
        } else {
          setSuggestionsData(processedData);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const handleSelectChange = (e) => {
    const selectedOption = e;

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
      // onValueChanged={handleSelectChange(e)}
      onValueChange={(e) => {
        const selectItemValue = [];
        const selectedItem = suggestionsData.find(item => item.key === e);
        if (selectedItem) {
          selectItemValue.push({
            prjctId: selectedItem.key,
            prjctNm: selectedItem.value,
            prjctMngrEmpId: selectedItem.prjctMngrEmpId,
          });
        } else {
          selectItemValue.push({
            prjctId: "",
            prjctNm: "",
            prjctMngrEmpId: ""
          });
        }
        handleSelectChange(selectItemValue)
      }}
      placeholder={placeholderText}
      searchEnabled={true}
      stylingMode="underlined"
      onBlur={handleBlur}
    />
  );
};

export default AutoCompleteProject;
