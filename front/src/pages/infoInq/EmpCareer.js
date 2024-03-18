import React, { useState, useEffect} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import CustomTable from "components/unit/CustomTable";
import EmpInfoJson from "./EmpInfoJson.json";
import TextBox from "devextreme-react/text-box";
import Box, { Item } from "devextreme-react/box";
import { Button } from "devextreme-react/button";
import CustomCdComboBox from "../../components/unit/CustomCdComboBox";
import ApiRequest from "utils/ApiRequest";
import { useCookies } from "react-cookie";
import { DateBox } from "devextreme-react";

const EmpCareer = ({ callBack, props }) => {

  const [param, setParam] = useState({});

  const { queryId, keyColumn, tableColumns } = EmpInfoJson.EmpCareer;
  const [values, setValues] = useState([]);
  const [tableKey, setTableKey] = useState(0);
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
    workBgngYmd: "",
    workEndYmd: "",
    wrkplcNm: "",
    mainCareerCn: "",
    lctnAddr: "",
    rm: "",
  });

  const validateForm = () => {
    const errors = {};
    if (!initParam.workBgngYmd) {
      errors.workBgngYmd = '근무시작일을 선택하세요.';
    }
    if (!initParam.workEndYmd) {
      errors.workEndYmd = '근무종료일을 선택하세요.';
    }
    if (!initParam.wrkplcNm.trim()) {
      errors.wrkplcNm = '근무처를 입력하세요.';
    }
    if (!initParam.mainCareerCn.trim()) {
      errors.mainCareerCn = '소재지를  입력하세요.';
    }
   
     if (!initParam.lctnAddr.trim()) {
      errors.lctnAddr = '주요경력사항을  입력하세요.';
    }
    if (!initParam.rm.trim()) {
      errors.rm = '특기사항을  입력하세요.';
    }
    
  
    setValidationErrors(errors);
  
    return Object.keys(errors).length === 0;
  };
  
  const getSn = async () => {
    const selectParams = {
      queryId: "infoInqMapper.selectCareerSn",
      empId: data.empId
    };
  
    try {
      const response = await ApiRequest("/boot/common/queryIdSearch", selectParams);
      setData(() => ({
        ...data,
        careerSn: response[0].careerSn
      }));
    
    } catch (error) {
      console.log(error);
    }
  }

  const careerInsert = async() => {
    const isValidForm = validateForm();
  
    if (!isValidForm) {
      window.alert("입력되지 않은 값이 있습니다.")
      console.log('폼 유효성 검사 실패');
      return;
    } else if (initParam.workBgngYmd >= initParam.workEndYmd){
      window.alert("근무시작일자가 근무종료일자와 같거나 종료일자가 더 큽니다.");
      return;
    }
  
    const careerConfirmResult = window.confirm("경력을 등록하시겠습니까?");
    if (careerConfirmResult) {
      const params = [{ tbNm: "EMP_CAREER" }, data];
      try {
        const response = await ApiRequest("/boot/common/commonInsert", params);
        if (response === 1) {
          window.alert("경력이 등록되었습니다.")
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
  const editParam = [{tbNm: "EMP_CAREER"}];
  let editInfo = {};
  switch (editMode){
      case 'update':
          editParam[1] = e.newData;
          editParam[2] = {careerSn: e.key, empId: userEmpId};
          editInfo = {url:'commonUpdate', complete:'수정'}
      break;
      case 'delete':
          editParam[1] = {careerSn: e.key, empId: userEmpId};
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
        <h1 style={{ fontSize: "40px" }}>경력</h1>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <CustomTable keyColumn={keyColumn} columns={tableColumns} values={values} paging={true} editRow={true} onEditRow={onEditRow}/>
      </div>
      <div style={{ marginBottom: "20px", backgroundColor: "#eeeeee", width: "100%", height: "300px", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ width: "95%", height: "250px" }}>
          <h5>경력을 입력/수정 합니다.</h5>
          <Box direction="row" width="70%" height={40}>
            <Item className="prjctNameItem" ratio={1}>
            <DateBox   type="date" displayFormat="yyyy-MM-dd"  placeholder="근무시작일"  name="workBgngYmd"  onValueChanged={(e) => handleChgState({ name: e.component.option("name"), value : formatDate(e.value) })} />
            {validationErrors.workBgngYmd && (
                <div style={{ color: 'red' }}>{validationErrors.workBgngYmd}</div>
              )}
            </Item>
            <Item className="prjctNameItem" ratio={1}>
            <DateBox   type="date" displayFormat="yyyy-MM-dd"  placeholder="근무종료일"  name="workEndYmd"  onValueChanged={(e) => handleChgState({ name: e.component.option("name"), value : formatDate(e.value) })} />
            {validationErrors.workEndYmd && (
                <div style={{ color: 'red' }}>{validationErrors.workEndYmd}</div>
              )}
            </Item>
            <Item className="prjctMngrEmpIdItem" ratio={1}>
              <TextBox placeholder="근무처" stylingMode="filled" size="medium" name="wrkplcNm" onValueChanged={(e) => handleChgState({ name: e.component.option("name"), value: e.value })} />
              {validationErrors.wrkplcNm && (
                <div style={{ color: 'red' }}>{validationErrors.wrkplcNm}</div>
              )}
            </Item>
            <Item className="bizFlfmtTyCdItem" ratio={1}>
              <TextBox placeholder="소재지" stylingMode="filled" size="large" name="lctnAddr" onValueChanged={(e) => handleChgState({ name: e.component.option("name"), value: e.value })} />
              {validationErrors.lctnAddr && (
                <div style={{ color: 'red' }}>{validationErrors.lctnAddr}</div>
              )}
            </Item>
          </Box>
          <br />
          <Box direction="row" width="70%" height={40}>
            <Item className="prjctNameItem" ratio={1}>
            <TextBox placeholder="주요경력사항" stylingMode="filled" size="medium" name="mainCareerCn" onValueChanged={(e) => handleChgState({ name: e.component.option("name"), value: e.value })} />
            {validationErrors.mainCareerCn && (
                <div style={{ color: 'red' }}>{validationErrors.mainCareerCn}</div>
              )}
            </Item>
            <Item className="prjctNameItem" ratio={1}>
            <TextBox placeholder="특기사항" stylingMode="filled" size="medium" name="rm" onValueChanged={(e) => handleChgState({ name: e.component.option("name"), value: e.value })} />
            {validationErrors.rm && (
                <div style={{ color: 'red' }}>{validationErrors.rm}</div>
              )}
            </Item>
           
          </Box>
          <Box style={{ marginTop: "30px", width: "20%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Item className="searchBtnItem" ratio={1} style={{ width: "50px" }}>
              <Button onClick={careerInsert} text="저장" />
            </Item>
            <Item className="searchBtnItem" ratio={1} style={{ width: "50px" }}>
              <Button text="초기화" />
            </Item>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default EmpCareer;