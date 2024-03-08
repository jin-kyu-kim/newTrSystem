import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import CustomTable from "components/unit/CustomTable";
import EmpInfoJson from "./EmpInfoJson.json";
import TextBox from "devextreme-react/text-box";
import Box, { Item } from "devextreme-react/box";
import { Button } from "devextreme-react/button";
import CustomCdComboBox from "../../components/unit/CustomCdComboBox";
import ApiRequest from "utils/ApiRequest";
import CustomDateRangeBox from "components/unit/CustomDateRangeBox";
import { useCookies } from "react-cookie";
import { DateBox } from "devextreme-react";
import NumberBox from "devextreme-react/number-box";

const EmpDegree = ({  }) => {
  const [cookies] = useCookies(["userInfo", "userAuth"]);
  const date = new Date();
  const userEmpId = cookies.userInfo.empId;
  const [param, setParam] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [tableKey, setTableKey] = useState(0);
  const [data, setData] = useState({
    empId: userEmpId,
    regEmpId: userEmpId,
    regDt: date.toISOString().split("T")[0] + " " + date.toTimeString().split(" ")[0],
  });

  const { queryId, keyColumn, tableColumns } = EmpInfoJson.EmpDegree;
  const [values, setValues] = useState([]);

  const [initParam, setInitParam] = useState({
    acbgSeCd: "",
    schlNm: "",
    majorIntltshNm: "",
    grdtnSttsCd: "",
    pntPscoreSeCd: "",
    scre: "",
    mtcltnYr: "",
    grdtnYr: ""
  });

  const validateForm = () => {
    const errors = {};

    if (!initParam.acbgSeCd) {
      errors.acbgSeCd = '학교구분을 선택하세요.';
    }
    if (!initParam.schlNm.trim()) {
      errors.schlNm = '학교명을 입력하세요.';
    }
    if (!initParam.majorIntltshNm.trim()) {
      errors.majorIntltshNm = '전공(계열)을 입력하세요.';
    }
    if (!initParam.grdtnSttsCd) {
      errors.grdtnSttsCd = '졸업구분을 선택하세요.';
    }
    if (!initParam.pntPscoreSeCd) {
      errors.pntPscoreSeCd = '학점 만점을 선택하세요.';
    }
    if (!initParam.scre) {
      errors.scre = '성적을 입력하세요.';
    }
    if (!initParam.mtcltnYr || initParam.mtcltnYr < 1900 || initParam.mtcltnYr > new Date().getFullYear()) {
      errors.mtcltnYr = '올바른 입학년도를 입력하세요.';
    }
    if (!initParam.grdtnYr || initParam.grdtnYr < 1900 || initParam.grdtnYr > new Date().getFullYear()) {
      errors.grdtnYr = '올바른 졸업년도를 입력하세요.';
    }

    setValidationErrors(errors);

    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
      pageHandle();
     
    setParam({
      ...param,
      queryId: queryId,
      empId : userEmpId,
    });
  }, []);



  useEffect(() => {
    // if (!Object.values(param).every((value) => value === "")) {
    //   pageHandle();
    // }
    getSn();
  }, [param, isSuccess]);

  const handleChgState = ({ name, value }) => {
    setInitParam({
      ...initParam,
      [name]: value
    });
    setData({
      ...data,
      [name]: value
    });
    setParam({
      queryId: queryId,
      empId: userEmpId
    });
  };

  const pageHandle = async () => {
    try {
      const response = await ApiRequest("/boot/common/queryIdSearch", param);
      console.log(response)
      setValues(response);
      if (response.length !== 0) {
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getSn = async () => {
    const selectParams = {
      queryId: "infoInqMapper.selectAcbgSn",
      empId: data.empId
    };
    try {
      const response = await ApiRequest("/boot/common/queryIdSearch", selectParams);

      setData(() => ({
        ...data,
        acbgSn: response[0].acbgSn
      }));

    } catch (error) {
      console.log(error);
    }
  }

  const acbgInsert = async () => {
    const isValidForm = validateForm();
  
    if (!isValidForm) {
      window.alert("입력되지 않은 값이 있습니다.")
      console.log('폼 유효성 검사 실패');
      return;
    }else if (initParam.mtcltnYr >= initParam.grdtnYr){
      window.alert("입학년도가 졸업년도와 같거나 졸업년도가 더 큽니다.");
      return;
    }
  
    const acbgConfirmResult = window.confirm("학력을 등록하시겠습니까?");
    if (acbgConfirmResult) {
      const params = [{ tbNm: "EMP_ACBG" }, data];
      console.log(params);
      try {
        const response = await ApiRequest("/boot/common/commonInsert", params);
        console.log(response);
  
        if (response === 1) {
          window.alert("학력이 등록되었습니다.")
          setIsSuccess(!isSuccess);
          setTableKey((prevKey) => prevKey + 1);
          
        } else {
          // 저장 실패 시 처리
        }
      } catch (error) {
        console.log(error);
        // 저장 실패 시 처리
      }
    }
  };


  useEffect(()=>{
    pageHandle();
   
  },[param.empId,tableKey]);

  const onEditRow = async (editMode, e) => {
    const editParam = [{tbNm: "EMP_ACBG"}];
    let editInfo = {};
    switch (editMode){
        case 'update':
            editParam[1] = e.newData;
            editParam[2] = {acbgSn: e.key, empId: userEmpId};
            editInfo = {url:'commonUpdate', complete:'수정'}
        break;
        case 'delete':
            editParam[1] = {acbgSn: e.key, empId: userEmpId};
            editInfo = {url:'commonDelete', complete:'삭제'}
        break;
    }
    try{
        const response = await ApiRequest('/boot/common/' + editInfo.url, editParam);
        response === 1 ? alert(editInfo.complete + "되었습니다.") : alert(editInfo.complete + "에 실패했습니다.")
    } catch(error){
        console.log(error)
    }
}
  return (
    <div className="container" style={{ height: "1000px" }}>
      <div className="title p-1" style={{ marginTop: "20px", marginBottom: "10px" }}>
        <h1 style={{ fontSize: "40px" }}>학력</h1>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <CustomTable Button keyColumn={keyColumn} columns={tableColumns} values={values} editRow={true}  paging={true} queryId={queryId}  onEditRow={onEditRow} />
      </div>
      <div style={{ marginBottom: "20px", backgroundColor: "#eeeeee", width: "100%", height: "300px", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ width: "95%", height: "250px" }}>
          <h5>학력을 입력/수정 합니다.</h5>
          <Box direction="row" width="50%" height={40}>
            <Item className="prjctNameItem" ratio={1}>
              <CustomCdComboBox param="VTW025" placeholderText="[학교구분]" name="acbgSeCd" onSelect={handleChgState} value={initParam.acbgSeCd} />
              {validationErrors.acbgSeCd && (
                <div style={{ color: 'red' }}>{validationErrors.acbgSeCd}</div>
              )}
            </Item>
            <Item className="prjctNameItem" ratio={1}>
              <TextBox placeholder="학교명" stylingMode="filled" size="medium" name="schlNm" value={initParam.schlNm} onValueChanged={(e) => handleChgState({ name: e.component.option("name"), value: e.value })} />
              {validationErrors.schlNm && (
                <div style={{ color: 'red' }}>{validationErrors.schlNm}</div>
              )}
            </Item>
            <Item className="prjctNameItem" ratio={1}>
              <TextBox placeholder="전공(계열)" stylingMode="filled" size="large" name="majorIntltshNm" value={initParam.majorIntltshNm} onValueChanged={(e) => handleChgState({ name: e.component.option("name"), value: e.value })} />
              {validationErrors.majorIntltshNm && (
                <div style={{ color: 'red' }}>{validationErrors.majorIntltshNm}</div>
              )}
            </Item>
          </Box>
          <br />
          <Box direction="row" width="90%" height={40}>
            <Item className="prjctNameItem" ratio={1}>
              <CustomCdComboBox param="VTW026" placeholderText="[졸업구분]" name="grdtnSttsCd" onSelect={handleChgState} value={initParam.grdtnSttsCd} />
              {validationErrors.grdtnSttsCd && (
                <div style={{ color: 'red' }}>{validationErrors.grdtnSttsCd}</div>
              )}
            </Item>
            <Item className="prjctNameItem" ratio={1}>
              <CustomCdComboBox param="VTW027" placeholderText="[학점 만점]" name="pntPscoreSeCd" onSelect={handleChgState} value={initParam.pntPscoreSeCd} />
              {validationErrors.pntPscoreSeCd && (
                <div style={{ color: 'red' }}>{validationErrors.pntPscoreSeCd}</div>
              )}
            </Item>
            <Item className="prjctNameItem" ratio={1}>
              <NumberBox placeholder="성적" stylingMode="filled" size="large" name="scre" value={initParam.scre} onValueChanged={(e) => handleChgState({ name: e.component.option("name"), value: e.value })}   inputType="number" 
    maskChar=""
    format="0.##" />
              {validationErrors.scre && (
                <div style={{ color: 'red' }}>{validationErrors.scre}</div>
              )}
            </Item>
            <Item className="prjctDatePickerItem" ratio={1} >
              <NumberBox
                showSpinButtons={true}
                format="#"
                name="mtcltnYr"
                min={1900}
                max={9999}
                step={1}
                value={initParam.mtcltnYr}
                onValueChanged={(e) => handleChgState({ name: e.component.option("name"), value: e.value })}
                placeholder="입학년도"
              />
              {validationErrors.mtcltnYr && (
                <div style={{ color: 'red' }}>{validationErrors.mtcltnYr}</div>
              )}
            </Item>

            <Item className="prjctDatePickerItem" ratio={2} >
              <NumberBox
                showSpinButtons={true}
                format="#"
                name="grdtnYr"
                min={1950}
                max={9999}
                step={1}
                value={initParam.grdtnYr}
                onValueChanged={(e) => handleChgState({ name: e.component.option("name"), value: e.value })}
                placeholder="졸업년도"
                width="50%"
              />
              {validationErrors.grdtnYr && (
                <div style={{ color: 'red' }}>{validationErrors.grdtnYr}</div>
              )}
            </Item>
          </Box>
          <Box style={{ marginTop: "30px", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Item className="searchBtnItem" width="10%" ratio={1}  >
              <Button onClick={acbgInsert} text="저장" />
            </Item>
            <Item className="searchBtnItem" width="10%" ratio={1} >
              <Button text="초기화" />
            </Item>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default EmpDegree;