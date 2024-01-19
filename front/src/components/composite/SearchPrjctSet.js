import { Form, Button, Stack } from "react-bootstrap";
import CustonDatePicker from "../unit/CustomDatePicker";
import React, { useState, useEffect } from "react";
import CustomComboBox from "../unit/CustomComboBox";
import AutoCompleteProject from "../unit/AutoCompleteProject";

const SearchPrjctSet = ({ callBack }) => {
  const [initParam, setInitParam] = useState({
    prjctStleCd: "",
    prjctId: "",
    ctmmnyNo: "",
    bizFlfmtTyCd: "",
    ctrtYmd: "",
    bizEndYmd: "",
  });

  useEffect(() => {
    callBack(initParam);
  }, []);

  const handleChgState = (e) => {
    setInitParam({
      ...initParam,
      [e.target.name]: e.target.value,
    });
  };

  const handleChgPrjct = (selectedOptions) => {
    setInitParam({
      ...initParam,
      prjctId: selectedOptions,
    });
  };

  const handleDateSelect = (date, placeholderText) => {
    if (placeholderText === "검색 시작일") {
      setInitParam({
        ...initParam,
        ctrtYmd: date,
      });
    } else if (placeholderText === "검색 종료일") {
      setInitParam({
        ...initParam,
        bizEndYmd: date,
      });
    }
  };

  const handleSubmit = () => {
    callBack(initParam);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Stack direction="horizontal" gap={1} className="col-md-10 mx-auto">
        <CustomComboBox
          param="VTW018"
          placeholderText="[형태]"
          name="prjctStleCd"
          onSelect={handleChgState}
        />
        <AutoCompleteProject
          placeholderText="프로젝트 명"
          onChangeFnc={handleChgPrjct}
        />
        <Form.Control
          placeholder="고객사"
          size="lg"
          name="ctmmnyNo"
          onChange={handleChgState}
        />
        <CustomComboBox
          param="VTW004"
          placeholderText="[상태]"
          name="Status"
          onSelect={handleChgState}
        />
        <CustonDatePicker
          onSelect={handleDateSelect}
          placeholderText="검색 시작일"
        />
        <CustonDatePicker
          onSelect={handleDateSelect}
          placeholderText="검색 종료일"
        />
        <Button
          variant="dark"
          size="lg"
          className="w-75"
          onClick={handleSubmit}
        >
          검색
        </Button>
        <Button variant="primary" size="lg" className="w-75">
          입력
        </Button>
      </Stack>
    </Form>
  );
};

export default SearchPrjctSet;
