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
import { DateBox } from "devextreme-react";

const EmpEduHist = ({ callBack, props }) => {

  const [param, setParam] = useState({});

  const {queryId, keyColumn, tableColumns } = EmpInfoJson.EmpEduHist;
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
  eduInstNm: "",
  eduNm: "",
  eduBgngYmd: "",
  eduEndYmd: "",
  eduCn: "",
});

const validateForm = () => {
  const errors = {};

  if (!initParam.eduInstNm.trim()) {
    errors.eduInstNm = '교육기관을 입력하세요.';
  }
  if (!initParam.eduNm.trim()) {
    errors.eduNm = '교육명을  입력하세요.';
  }
  if (!initParam.eduBgngYmd) {
    errors.eduBgngYmd = '교육시작일을 입력하세요.';
  }
  if (!initParam.eduEndYmd) {
    errors.eduEndYmd = '교육종료일을 선택하세요.';
  }
   if (!initParam.eduCn.trim()) {
    errors.eduCn = '교육내용을  입력하세요.';
  }
  

  setValidationErrors(errors);

  return Object.keys(errors).length === 0;
};

const getSn = async () => {
  const selectParams = {
    queryId: "infoInqMapper.selectEduSn",
    empId: data.empId
  };

  try {
    const response = await ApiRequest("/boot/common/queryIdSearch", selectParams);
    setData(() => ({
      ...data,
      eduSn: response[0].eduSn
    }));
  

  } catch (error) {
    console.log(error);
  }
}

const eduInsert = async() => {
  const isValidForm = validateForm();

  if (!isValidForm) {
    window.alert("입력되지 않은 값이 있습니다.")
    console.log('폼 유효성 검사 실패');
    return;
  } else if (initParam.eduBgngYmd >= initParam.eduEndYmd){
    window.alert("교육시작일자가 교육종료일자와 같거나 종료일자가 더 큽니다.");
    return;
  }

  const eduConfirmResult = window.confirm("교육이력을 등록하시겠습니까?");
  if (eduConfirmResult) {
    const params = [{ tbNm: "EMP_EDU" }, data];
    try {
      const response = await ApiRequest("/boot/common/commonInsert", params);
      if (response === 1) {
        window.alert("교육이력이 등록되었습니다.")
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
  const editParam = [{tbNm: "EMP_EDU"}];
  let editInfo = {};
  switch (editMode){
      case 'update':
          editParam[1] = e.newData;
          editParam[2] = {eduSn: e.key, empId: userEmpId};
          editInfo = {url:'commonUpdate', complete:'수정'}
      break;
      case 'delete':
          editParam[1] = {eduSn: e.key, empId: userEmpId};
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
        <h1 style={{ fontSize: "40px" }}>교육이력</h1>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <CustomTable keyColumn={keyColumn} columns={tableColumns} values={values} paging={true} editRow={true} onEditRow={onEditRow} />
      </div>
      <div style={{ marginBottom: "20px", backgroundColor: "#eeeeee", width: "100%", height: "300px", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ width: "95%", height: "180px"}}>
          <h5>교육이력을 입력/수정 합니다.</h5>
          <Box direction="row" width="100%" height={40}>
            <Item className="prjctNameItem" ratio={1}>
            <TextBox placeholder="교육기관" stylingMode="filled" size="large" name="eduInstNm" onValueChanged={(e) => handleChgState({ name: e.component.option("name"), value: e.value })} />
              {validationErrors.eduInstNm && (
                <div style={{ color: 'red' }}>{validationErrors.eduInstNm}</div>
              )}
            </Item>
            <Item className="prjctNameItem" ratio={1}>
            <TextBox placeholder="교육명" stylingMode="filled" size="large" name="eduNm" onValueChanged={(e) => handleChgState({ name: e.component.option("name"), value: e.value })} />
              {validationErrors.eduNm && (
                <div style={{ color: 'red' }}>{validationErrors.eduNm}</div>
              )}
            </Item>
            <Item className="ctmmnyNameItem" ratio={1}>
            <DateBox   type="date" displayFormat="yyyy-MM-dd"  placeholder="교육시작일"  name="eduBgngYmd"  onValueChanged={(e) => handleChgState({ name: e.component.option("name"), value : formatDate(e.value) })} />
              {validationErrors.eduBgngYmd && (
                <div style={{ color: 'red' }}>{validationErrors.eduBgngYmd}</div>
              )}
            </Item>
            <Item className="ctmmnyNameItem" ratio={1}>
            <DateBox   type="date" displayFormat="yyyy-MM-dd"  placeholder="교육종료일"  name="eduEndYmd"  onValueChanged={(e) => handleChgState({ name: e.component.option("name"), value : formatDate(e.value) })} />
              {validationErrors.eduEndYmd && (
                <div style={{ color: 'red' }}>{validationErrors.eduEndYmd}</div>
              )}
            </Item>
            <Item className="prjctNameItem" ratio={1}>
              <TextBox placeholder="교육내용" stylingMode="filled" size="large" name="eduCn" onValueChanged={(e) => handleChgState({ name: e.component.option("name"), value: e.value })} />
              {validationErrors.eduCn && (
                <div style={{ color: 'red' }}>{validationErrors.eduCn}</div>
              )}
            </Item>
          </Box>
          <Box style={{ marginTop: "30px", width: "20%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Item className="searchBtnItem" ratio={1} style={{ width: "50px" }}>
              <Button onClick={eduInsert} text="저장" />
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

export default EmpEduHist;