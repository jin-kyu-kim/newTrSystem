import React, { useState, useEffect } from "react";

import Box, {Item} from "devextreme-react/box"
import { Button } from "devextreme-react/button";
import CustomDateRangeBox from "../unit/CustomDateRangeBox";
import AutoCompleteName from "../unit/AutoCompleteName";
import ProjectRegist from "../../pages/project/manage/ProjectRegist";
import CustomPopup from "../unit/CustomPopup";
import notify from 'devextreme/ui/notify';



const SearchEmpVacSet = ({ callBack, props, popup }) => {
  const [initParam, setInitParam] = useState({
    vcatnBgngYmd: "", //시작일자
    vcatnEndYmd: "", //끝일자
    empno: "",  // 사번
  });

  const [popupVisible, setPopupVisible] = useState(false);

  useEffect(() => {
    callBack(initParam);
  }, []);

  

 

  const handleStartDateChange = (newStartDate) => {
   
    // 시작일자가 변경될 때 수행할 로직 추가
    setInitParam({ 
      ...initParam,
      vcatnBgngYmd: newStartDate,
    });
  };

  const handleEndDateChange = (newEndDate) => {

    // 종료일자가 변경될 때 수행할 로직 추가
    setInitParam({
      ...initParam,
      vcatnEndYmd: newEndDate
    });
  };

// 성명변환
const handleChgEmp = (selectedOption) => {
  setInitParam({
    ...initParam,
    empno: selectedOption,
  });
};

  const handleSubmit = () => {
    notify("검색이 되는걸지도??");
    callBack(initParam);
  };


  const handleClose = () => {
    setPopupVisible(false);
  };

  const onHide = () => {
    callBack(initParam);
    setPopupVisible(false);
  }
  
  

  const exelDwd = () => {
    notify("휴가사용내역을 다운로드합니다.");
  }  //엑셀다운로드 함수 수정중

  return (
    <div className="box_search" width="100%">
      <Box
        direction="row"
        width="100%"
        height={30}
      >
        <Item className="prjctDatePickerItem" ratio={2} visible={props.prjctDatePickerItem}>
          <CustomDateRangeBox
            onStartDateChange={handleStartDateChange}
            onEndDateChange={handleEndDateChange}
          />
        </Item>

        <Item className="empnoItem" ratio={1} visible={props.empnoItem}>
          <AutoCompleteName
            placeholderText="성명"
            onValueChange={handleChgEmp}    
          />
        </Item>
       
        <Item className="searchBtnItem" ratio={1} visible={props.searchBtnItem}>
          <Button
            onClick={handleSubmit} text="검색"
            
          />
        </Item>
        <Item className="exelBtnItem" ratio={1} visible={props.exelBtnItem}>
          <Button
            onClick={exelDwd} text="엑셀다운로드" 
          />
        </Item>
      </Box>
      {popup ?
        <CustomPopup props={popup} visible={popupVisible} handleClose={handleClose}>
          <ProjectRegist onHide={onHide}/> 
        </CustomPopup>
        : <></>
      }
    </div>
  );
};

export default SearchEmpVacSet;
