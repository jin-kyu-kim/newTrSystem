import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button, DateBox } from "devextreme-react";
import { useCookies } from "react-cookie";
import EmpInfoJson from "./EmpInfoJson.json";
import CustomTable from "../../components/unit/CustomTable";
import TextBox from "devextreme-react/text-box";
import Box, { Item } from "devextreme-react/box";
import CustomCdComboBox from "../../components/unit/CustomCdComboBox";
import ApiRequest from "utils/ApiRequest";

const EmpProjectHist = (callBack) => {

  const [param, setParam] = useState({});

  const { queryId, keyColumn, tableColumns } = EmpInfoJson.prjctHist;
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
    prjctNm: "",
    prjctBgngYmd: "",
    prjctEndYmd: "",
    tkcgJobCn: "",
    orderInstNm: "",
    jobClCd: "",
    tchnlgyClCd: "",
    rm: "",
  });

  
  const validateForm = () => {
    const errors = {};
    if (!initParam.prjctNm.trim()) {
      errors.prjctNm = '프로젝트명을 입력하세요.';
    }
    if (!initParam.prjctBgngYmd) {
      errors.prjctBgngYmd = '시작일을 선택하세요.';
    }
    if (!initParam.prjctEndYmd) {
      errors.prjctEndYmd = '종료일을 선택하세요. ';
    }
    if (!initParam.tkcgJobCn.trim()) {
      errors.tkcgJobCn = '담당업무를  입력하세요.';
    }
   
     if (!initParam.orderInstNm.trim()) {
      errors.orderInstNm = '발주처를  입력하세요.';
    }
    if (!initParam.jobClCd) {
      errors.jobClCd = '업무분류를 선택하세요.';
    }
    if (!initParam.tchnlgyClCd) {
      errors.tchnlgyClCd = '기술분류를 선택하세요.';
    }
    if (!initParam.rm.trim()) {
      errors.rm = '비고를  입력하세요.';
    }
    
  
    setValidationErrors(errors);
  
    return Object.keys(errors).length === 0;
  };

  const getSn = async () => {
    const selectParams = {
      queryId: "infoInqMapper.selectPrjctHistSn",
      empId: data.empId
    };
  
    try {
      const response = await ApiRequest("/boot/common/queryIdSearch", selectParams);
      setData(() => ({
        ...data,
        prjctHistSn: response[0].prjctHistSn
      }));
    
  
    } catch (error) {
    }
  }

  const prjctHistInsert = async() => {
    const isValidForm = validateForm();
  
    if (!isValidForm) {
      window.alert("입력되지 않은 값이 있습니다.")
      console.log('폼 유효성 검사 실패');
      return;
    } else if (initParam.prjctBgngYmd >= initParam.prjctEndYmd){
      window.alert("시작일자가 종료일자와 같거나 종료일자가 더 큽니다.");
      return;
    }
  
    const prjctHistConfirmResult = window.confirm("프로젝트 이력을 등록하시겠습니까?");
    if (prjctHistConfirmResult) {
      const params = [{ tbNm: "EMP_PRJCT_HIST" }, data];
      try {
        const response = await ApiRequest("/boot/common/commonInsert", params);
  
        if (response === 1) {
          window.alert("프로젝트 이력이 등록되었습니다.")
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
 
},[param,tableKey]);
const onEditRow = async (editMode, e) => {
  const editParam = [{tbNm: "EMP_PRJCT_HIST"}];
  let editInfo = {};
  switch (editMode){
      case 'update':
          editParam[1] = e.newData;
          editParam[2] = {histSn: e.key, empId: userEmpId};
          editInfo = {url:'commonUpdate', complete:'수정'}
      break;
      case 'delete':
          editParam[1] = {histSn: e.key, empId: userEmpId};
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
        <div className = "container">
            <div className="title p-1" style={{ marginTop: "20px", marginBottom: "10px" }}>
                <h1 style={{ fontSize: "40px" }}>프로젝트 이력</h1>
            </div>
            <div style = {{ marginBottom: "20px" }}>
            <CustomTable
                keyColumn={keyColumn}
                columns={tableColumns}
                values={values}
                paging={true}
                editRow={true} 
                onEditRow={onEditRow}
               // onRowDbClick={onRowHistClick}
            />
            </div>
            <div style = {{ marginBottom: "20px" }}>
            </div>
            <div style={{ marginBottom: "20px", backgroundColor: "#eeeeee", width: "100%", height: "300px", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ width: "95%", height: "250px" }}>
          <h5>프로젝트 이력을 입력/수정 합니다.</h5>
          <Box direction="row" width="50%" height={40}>
            <Item className="prjctNameItem" ratio={1}>
            <TextBox placeholder="프로젝트명" stylingMode="filled" size="medium" name="prjctNm" onValueChanged={(e) => handleChgState({ name: e.component.option("name"), value: e.value })} />
            {validationErrors.prjctNm && (
                <div style={{ color: 'red' }}>{validationErrors.prjctNm}</div>
              )}
            </Item>
            <Item className="prjctNameItem" ratio={1}>
            <DateBox   type="date" displayFormat="yyyy-MM-dd"  placeholder="시작일"  name="prjctBgngYmd"  onValueChanged={(e) => handleChgState({ name: e.component.option("name"), value : formatDate(e.value) })} />
            {validationErrors.prjctBgngYmd && (
                <div style={{ color: 'red' }}>{validationErrors.prjctBgngYmd}</div>
              )}
            </Item>
            <Item className="prjctNameItem" ratio={1}>
            <DateBox   type="date" displayFormat="yyyy-MM-dd"  placeholder="종료일"  name="prjctEndYmd"  onValueChanged={(e) => handleChgState({ name: e.component.option("name"), value : formatDate(e.value) })} />
            {validationErrors.prjctEndYmd && (
                <div style={{ color: 'red' }}>{validationErrors.prjctEndYmd}</div>
              )}
            </Item>
            
          </Box>
          <br />
          <Box direction="row" width="100%" height={40}>
          <Item className="prjctNameItem" ratio={1}>
            <TextBox placeholder="담당업무" stylingMode="filled" size="medium" name="tkcgJobCn" onValueChanged={(e) => handleChgState({ name: e.component.option("name"), value: e.value })} />
            {validationErrors.tkcgJobCn && (
                <div style={{ color: 'red' }}>{validationErrors.tkcgJobCn}</div>
              )}
            </Item>
            <Item className="prjctNameItem" ratio={1}>
            <TextBox placeholder="발주처" stylingMode="filled" size="medium" name="orderInstNm" onValueChanged={(e) => handleChgState({ name: e.component.option("name"), value: e.value })} />
            {validationErrors.orderInstNm && (
                <div style={{ color: 'red' }}>{validationErrors.orderInstNm}</div>
              )}
            </Item>
            <Item className="prjctNameItem" ratio={1}>
              <CustomCdComboBox param="VTW030" placeholderText="[업무분류]" name="jobClCd" onSelect={handleChgState} value={initParam.jobClCd} />
              {validationErrors.jobClCd && (
                <div style={{ color: 'red' }}>{validationErrors.jobClCd}</div>
              )}
            </Item>
            <Item className="prjctNameItem" ratio={1}>
            <CustomCdComboBox param="VTW031" placeholderText="[기술분류]" name="tchnlgyClCd" onSelect={handleChgState} value={initParam.tchnlgyClCd} />
              {validationErrors.tchnlgyClCd && (
                <div style={{ color: 'red' }}>{validationErrors.tchnlgyClCd}</div>
              )}
            </Item>
            <Item className="prjctNameItem" ratio={1}>
            <TextBox placeholder="비고" stylingMode="filled" size="medium" name="rm" onValueChanged={(e) => handleChgState({ name: e.component.option("name"), value: e.value })} />
            {validationErrors.rm && (
                <div style={{ color: 'red' }}>{validationErrors.rm}</div>
              )}
            </Item>
          </Box>
          <Box style={{ marginTop: "30px", width: "20%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Item className="searchBtnItem" ratio={1} style={{ width: "50px" }}>
              <Button onClick={prjctHistInsert} text="저장" />
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

export default EmpProjectHist;


