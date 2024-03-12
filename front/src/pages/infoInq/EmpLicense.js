import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import CustomTable from "components/unit/CustomTable";
import EmpInfoJson from "./EmpInfoJson.json";
import TextBox from "devextreme-react/text-box";
import Box, { Item } from "devextreme-react/box";
import { Button } from "devextreme-react/button";
import ApiRequest from "utils/ApiRequest";
import { DateBox } from "devextreme-react";
import { useCookies } from "react-cookie";

const EmpLicense = () => {
  const [param, setParam] = useState({});
  const [tableKey, setTableKey] = useState(0);
  const { queryId,keyColumn, tableColumns } = EmpInfoJson.EmpLicense;
  const [values, setValues] = useState([]);

  const [cookies] = useCookies(["userInfo", "userAuth"]);
  const date = new Date();
  const userEmpId = cookies.userInfo.empId;

  const [data, setData] = useState({
    empId: userEmpId,
    regEmpId: userEmpId,
    regDt: date.toISOString().split("T")[0] + " " + date.toTimeString().split(" ")[0],
  });

  const formatDate = (value) => {
    const year = value.getFullYear();
    const month = (value.getMonth() + 1).toString().padStart(2, '0');
    const day = value.getDate().toString().padStart(2, '0');

    return `${year}${month}${day}`;
  };

  const [validationErrors, setValidationErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
   
  setParam({
    ...param,
    queryId: queryId,
    empId : userEmpId,
  });
}, []);

useEffect(() => {
   
  getSn();
}, [param, isSuccess]);

  const [initParam, setInitParam] = useState({
    qlfcLcnsNm: "",
    qlfcLcnsId: "",
    gradNm: "",
    acqsYmd: "",
  });

  const validateForm = () => {
    const errors = {};

    if (!initParam.qlfcLcnsNm.trim()) {
      errors.qlfcLcnsNm = '자격면허를 입력하세요.';
    }
    if (!initParam.qlfcLcnsId.trim()) {
      errors.qlfcLcnsId = '자격면허번호를  입력하세요.';
    }
    if (!initParam.gradNm.trim()) {
      errors.gradNm = '등급 을 입력하세요.';
    }
    if (!initParam.acqsYmd) {
      errors.acqsYmd = '취득일자를 선택하세요.';
    }
    

    setValidationErrors(errors);

    return Object.keys(errors).length === 0;
  };


  const getSn = async () => {
    const selectParams = {
      queryId: "infoInqMapper.selectLcnsSn",
      empId: data.empId
    };
  
    try {
      const response = await ApiRequest("/boot/common/queryIdSearch", selectParams);
      setData(() => ({
        ...data,
        qlfcLcnsSn: response[0].qlfcLcnsSn
      }));
  
    } catch (error) {
      console.log(error);
    }
  }

  const lcnsInsert = async() => {
    const isValidForm = validateForm();

    if (!isValidForm) {
      window.alert("입력되지 않은 값이 있습니다.")
      console.log('폼 유효성 검사 실패');
      return;
    }
  
    const lcnsConfirmResult = window.confirm("자격면허를 등록하시겠습니까?");
    if (lcnsConfirmResult) {
      const params = [{ tbNm: "EMP_QLFC_LCNS" }, data];
      try {
        const response = await ApiRequest("/boot/common/commonInsert", params);
        if (response === 1) {
          window.alert("자격면허 가 등록되었습니다.")
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
  

  const handleChgState = ({ name, value }) => {
    setInitParam({
      ...initParam,
      [name]: value,
    });
    setData({
      ...data,
      [name]: value
    });

    setParam({
      queryId: queryId,
      empId: userEmpId
    })
  };

  
const pageHandle = async () => {
  try {
    const response =  await ApiRequest("/boot/common/queryIdSearch", param);
    setValues(response);
    if (response.length !== 0) {
    } else {
    }
  } catch (error) {
    console.log(error);
  }
};

useEffect(()=>{
  if (!Object.values(param).every((value) => value === "")) {
    pageHandle();
  }
 
},[param.empId,tableKey]);

const onEditRow = async (editMode, e) => {
  const editParam = [{tbNm: "EMP_QLFC_LCNS"}];
  let editInfo = {};
  switch (editMode){
      case 'update':
          editParam[1] = e.newData;
          editParam[2] = {qlfcLcnsSn: e.key, empId: userEmpId};
          editInfo = {url:'commonUpdate', complete:'수정'}
      break;
      case 'delete':
          editParam[1] = {qlfcLcnsSn: e.key, empId: userEmpId};
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
    <div className="container" style={{ height: "700px" }}>
      <div className="title p-1" style={{ marginTop: "20px", marginBottom: "10px" }}>
        <h1 style={{ fontSize: "40px" }}>자격 면허</h1>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <CustomTable keyColumn={keyColumn} columns={tableColumns} values={values} paging={true} editRow={true} onEditRow={onEditRow}/>
      </div>
      <div style={{ marginBottom: "20px", backgroundColor: "#eeeeee", width: "100%", height: "300px", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ width: "95%", height: "180px"}}>
          <h5>자격 면허를 입력/수정 합니다.</h5>
          <Box direction="row" width="100%" height={40}>
            <Item className="prjctNameItem" ratio={1}>
            <TextBox placeholder="자격면허" stylingMode="filled" size="large" name="qlfcLcnsNm" onValueChanged={(e) => handleChgState({ name: e.component.option("name"), value: e.value })} />
            {validationErrors.qlfcLcnsNm && (
                <div style={{ color: 'red' }}>{validationErrors.qlfcLcnsNm}</div>
              )}
            </Item>
            <Item className="prjctNameItem" ratio={1}>
            <TextBox placeholder="자격면허번호" stylingMode="filled" size="large" name="qlfcLcnsId" onValueChanged={(e) => handleChgState({ name: e.component.option("name"), value: e.value })} />
            {validationErrors.qlfcLcnsId && (
                <div style={{ color: 'red' }}>{validationErrors.qlfcLcnsId}</div>
              )}
            </Item>
            <Item className="ctmmnyNameItem" ratio={1}>
              <TextBox placeholder="등급" stylingMode="filled" size="large" name="gradNm" onValueChanged={(e) => handleChgState({ name: e.component.option("name"), value: e.value })} />
              {validationErrors.gradNm && (
                <div style={{ color: 'red' }}>{validationErrors.gradNm}</div>
              )}
            </Item>
            <Item className="prjctNameItem" ratio={1}>
              <DateBox   type="date" displayFormat="yyyy-MM-dd"  placeholder="취득일"  name="acqsYmd"  onValueChanged={(e) => handleChgState({ name: e.component.option("name"), value : formatDate(e.value) })} />
              {validationErrors.acqsYmd && (
                <div style={{ color: 'red' }}>{validationErrors.acqsYmd}</div>
              )}
            </Item>
          </Box>
          <Box style={{ marginTop: "30px", width: "20%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Item className="searchBtnItem" ratio={1} style={{ width: "50px" }}>
              <Button onClick={lcnsInsert} text="저장" />
            </Item>
            <Item className="searchBtnItem" ratio={1} style={{ width: "50px" }}>
              <Button onClick={lcnsInsert} text="초기화" />
            </Item>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default EmpLicense;