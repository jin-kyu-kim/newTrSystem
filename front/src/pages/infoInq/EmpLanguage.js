import React, { useState , useEffect} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import CustomTable from "components/unit/CustomTable";
import EmpInfoJson from "./EmpInfoJson.json";
import TextBox from "devextreme-react/text-box";
import Box, { Item } from "devextreme-react/box";
import { Button } from "devextreme-react/button";
import CustomCdComboBox from "../../components/unit/CustomCdComboBox";
import ApiRequest from "utils/ApiRequest";
import { useCookies } from "react-cookie";
import { NumberBox } from "devextreme-react";

const EmpLanguage = ({ callBack, props }) => {


 const [param, setParam] = useState({});
 const [tableKey, setTableKey] = useState(0);
  const {queryId, keyColumn, tableColumns } = EmpInfoJson.EmpLanguage;
  const [values, setValues] = useState([]);

  const [cookies] = useCookies(["userInfo", "userAuth"]);
  const date = new Date();
  const userEmpId = cookies.userInfo.empId;

  const [data, setData] = useState({
    empId: userEmpId,
    regEmpId: userEmpId,
    regDt: date.toISOString().split("T")[0] + " " + date.toTimeString().split(" ")[0],
  });

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
}, [ isSuccess]);


  const [initParam, setInitParam] = useState({
    fgggKndCd: "",
    pictrsLevelCd: "",
    athriTestNm: "",
    score: "",
   
  });

  const validateForm = () => {
    const errors = {};

    if (!initParam.fgggKndCd) {
      errors.fgggKndCd = '외국어 종류를 선택하세요.';
    }
    if (!initParam.pictrsLevelCd) {
      errors.pictrsLevelCd = '회화능력 을 선택하세요.';
    }
    if (!initParam.athriTestNm.trim()) {
      errors.athriTestNm = '공인시험명 을 입력하세요.';
    }
    if (!initParam.score) {
      errors.score = '점수를 입력하세요.';
    }
    

    setValidationErrors(errors);

    return Object.keys(errors).length === 0;
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
  pageHandle();
},[param.empId]);


const getSn = async () => {
  const selectParams = {
    queryId: "infoInqMapper.selectFgggSn",
    empId: data.empId
  };

  try {
    const response = await ApiRequest("/boot/common/queryIdSearch", selectParams);
    setData(() => ({
      ...data,
      fgggAbltySn: response[0].fgggAbltySn
    }));


  } catch (error) {
    console.log(error);
  }
}

const fgggInsert = async () => {
  const isValidForm = validateForm();

  if (!isValidForm) {
    window.alert("입력되지 않은 값이 있습니다.")
    console.log('폼 유효성 검사 실패');
    return;
  }

 

  const fgggConfirmResult = window.confirm("외국어 능력을 등록하시겠습니까?");
  if (fgggConfirmResult) {
    const params = [{ tbNm: "EMP_FGGG_ABLTY" }, data];
    try {
      const response = await ApiRequest("/boot/common/commonInsert", params);

      if (response === 1) {
        window.alert("외국어 능력이 등록되었습니다.")
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
  if (!Object.values(param).every((value) => value === "")) {
    pageHandle();
  }
 
},[param,tableKey]);

const onEditRow = async (editMode, e) => {
  const editParam = [{tbNm: "EMP_FGGG_ABLTY"}];
  let editInfo = {};
  switch (editMode){
      case 'update':
          editParam[1] = e.newData;
          editParam[2] = {fgggAbltySn: e.key, empId: userEmpId};
          editInfo = {url:'commonUpdate', complete:'수정'}
      break;
      case 'delete':
          editParam[1] = {fgggAbltySn: e.key, empId: userEmpId};
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
    <div className="container" style={{ height: "900px" }}>
      <div className="title p-1" style={{ marginTop: "20px", marginBottom: "10px" }}>
        <h1 style={{ fontSize: "40px" }}>외국어 능력</h1>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <CustomTable  keyColumn={keyColumn} columns={tableColumns} values={values} paging={true} editRow={true} onEditRow={onEditRow} />
      </div>
      <div style={{ marginBottom: "20px", backgroundColor: "#eeeeee", width: "100%", height: "300px", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ width: "95%", height: "180px" }}>
          <h5>외국어 능력을 입력 합니다.</h5>
          <Box direction="row" width="100%" height={40}>
            <Item className="prjctNameItem" ratio={1}>
              <CustomCdComboBox param="VTW028" placeholderText="[외국어]" name="fgggKndCd" onSelect={handleChgState} value={initParam.fgggKndCd} />
              {validationErrors.fgggKndNm && (
                <div style={{ color: 'red' }}>{validationErrors.fgggKndNm}</div>
              )}
            </Item>
            <Item className="prjctNameItem" ratio={1}>
              <CustomCdComboBox param="VTW029" placeholderText="[회화능력]" name="pictrsLevelCd" onSelect={handleChgState} value={initParam.pictrsLevelCd} />
              {validationErrors.pictrsLevelNm && (
                <div style={{ color: 'red' }}>{validationErrors.pictrsLevelNm}</div>
              )}
            </Item>
            <Item className="ctmmnyNameItem" ratio={1}>
              <TextBox placeholder="공인시험명" stylingMode="filled" size="large" name="athriTestNm" onValueChanged={(e) => handleChgState({ name: e.component.option("name"), value: e.value })} />
              {validationErrors.athriTestNm && (
                <div style={{ color: 'red' }}>{validationErrors.athriTestNm}</div>
              )}
            </Item>
            <Item className="prjctNameItem" ratio={1}>
              <NumberBox placeholder="점수" stylingMode="filled" size="large" name="score" value = {initParam.score} onValueChanged={(e) => handleChgState({ name: e.component.option("name"), value: e.value })} />
              {validationErrors.score && (
                <div style={{ color: 'red' }}>{validationErrors.score}</div>
              )}
            </Item>
          </Box>
          <Box style={{ marginTop: "30px", width: "20%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Item className="searchBtnItem" ratio={1} style={{ width: "50px" }}>
              <Button onClick={fgggInsert}  text="저장" />
            </Item>
            <Item className="searchBtnItem" ratio={1} style={{ width: "50px" }}>
              <Button  text="초기화" />
            </Item>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default EmpLanguage;