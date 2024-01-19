import ApiRequest from "../../utils/ApiRequest";

import React, { useEffect, useState, useRef } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";

const AutoCompleteProject = ({ placeholderText, onChangeFnc }) => {
  const [suggestionsData, setSuggestionsData] = useState([]);
  const [valid, setValid] = useState(true);
  const typeaheadRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ApiRequest("/boot/common/commonSelect", [
          { tbNm: "PRJCT" },
          {},
        ]);
        const processedData = response.map(({ prjctId, prjctNm }) => ({
          key: prjctId,
          value: prjctNm,
        }));
        setSuggestionsData(processedData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (input) => {
    const filteredOptions = suggestionsData.filter((option) =>
      option.value.toLowerCase().includes(input.toLowerCase())
    );

    return filteredOptions;
  };

  const handleSelectChange = (selectedOptions) => {
    if (selectedOptions.length !== 0) {
      // console.log("Selected key:", option.key);
      onChangeFnc(selectedOptions[0].key);
      setValid(true);
    } else {
      onChangeFnc("");
      setValid(false);
      // typeaheadRef.current && typeaheadRef.current.clear();
    }
  };

  const handleValid = () => {
    if (!valid) {
      typeaheadRef.current && typeaheadRef.current.clear();
    }
  };

  return (
    <Typeahead
      id="input-typeahead"
      labelKey="value"
      options={suggestionsData}
      onChange={handleSelectChange}
      onBlur={handleValid}
      onInputChange={(input) => handleInputChange(input)}
      placeholder={placeholderText}
      size="lg"
      style={{ width: "3000px" }}
      ref={typeaheadRef}
    />
  );
};

export default AutoCompleteProject;
