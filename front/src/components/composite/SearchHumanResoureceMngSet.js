import React, { useState, useEffect } from "react";
import TextBox from "devextreme-react/text-box";
import Box, {Item} from "devextreme-react/box"
import { Button } from "devextreme-react/button";
import CustomDateRangeBox from "../unit/CustomDateRangeBox";
import DeptRegist from "../../pages/humanResourceMng/DeptRegist";
import CustomPopup from "../unit/CustomPopup"

const SearchDeptSet = ({ callBack, props, popup }) => {
  const [initParam, setInitParam] = useState({});
  const [popupVisible, setPopupVisible] = useState(false);
  const [isPopup, setPopup] = useState(false);

  useEffect(() => {
    callBack(initParam);
  }, []);

  // SelectBox 변경
  const handleChgState = ({name, value}) => {
    setInitParam({
      ...initParam,
     [name] : value,
    });
  };

  // 부서 
  const handleChgDept = (selectedOption) => {
    setInitParam({
      ...initParam,
      deptId: selectedOption,
    });
  };

  const handleStartDateChange = (newStartDate) => {
   
    // 시작일자가 변경될 때 수행할 로직 추가
    setInitParam({
      ...initParam,
      deptBgngYmd: newStartDate,
    });
  };

  const handleEndDateChange = (newEndDate) => {

    // 종료일자가 변경될 때 수행할 로직 추가
    setInitParam({
      ...initParam,
      deptEndYmd: newEndDate
    });
  };

  const handleSubmit = () => {
    callBack(initParam);
  };

  
  const onClickInsertBtn = () => {
    setPopupVisible(true);
    setPopup(true);
  };

  const handleClose = () => {
    setPopupVisible(false);
  };

  const onHide = () => {
    callBack(initParam);
    setPopupVisible(false);
  }

  return (
    <div className="box_search" width="100%">
      <Box
        direction="row"
        width="100%"
        height={40}
      >
    
        <Item className="deptNameItem" ratio={1} visible={props.deptNameItem}>
          <TextBox
            placeholder="부서명"
            stylingMode="underlined"
            size="large"
            name="deptNm"
            onValueChanged={(e) => handleChgState({ name: e.component.option('name'), value: e.value })}
          />
        </Item>
        <Item className="deptMngrEmpIdItem" ratio={1} visible={props.deptMngrEmpIdItem}>
          <TextBox
            placeholder="부서장명"
            stylingMode="underlined"
            size="large"
            name="deptMngrEmpFlnm"
            onValueChanged={(e) => handleChgState({ name: e.component.option('name'), value: e.value })}
          />
        </Item>
    
        <Item className="deptDatePickerItem" ratio={2} visible={props.deptDatePickerItem}>
          <CustomDateRangeBox
            onStartDateChange={handleStartDateChange}
            onEndDateChange={handleEndDateChange}
          />
        </Item>
        <Item className="searchBtnItem" ratio={1} visible={props.searchBtnItem}>
          <Button
            onClick={handleSubmit} text="검색"
          />
        </Item>
        <Item ratio={1} visible={props.insertBtnItem}>
          <Button text="등록" onClick={onClickInsertBtn} />
        </Item>
      </Box>
      {isPopup ?
        <CustomPopup props={popup} visible={popupVisible} handleClose={handleClose} >
          <DeptRegist onHide={onHide} isNew={true}/> 
        </CustomPopup>
        : <></>
      }
    </div>
  );
};

export default SearchDeptSet;
