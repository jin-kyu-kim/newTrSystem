import React, { useEffect, useState } from "react";
import ApiRequest from "../../utils/ApiRequest";
import "devextreme-react/text-area";
import Button from "devextreme-react/button";
import { useNavigate } from "react-router-dom";
import { Item,Form,GroupItem,} from "devextreme-react/form";
import { useCookies } from "react-cookie";
import CustomCdComboBox from "components/unit/CustomCdComboBox";
import { DateBox, NumberBox, TextBox } from "devextreme-react";
import { changePassword } from "utils/AuthMng";

const EmpBasicInfo = ({naviEmpId}) => {
  const [baseInfoData, setBaseInfoData] = useState([]);
  /*유저세션*/
  const [cookies, setCookie] = useCookies(["userInfo", "userAuth"]);
  const navigate = useNavigate();
   let empId;

    if(naviEmpId.length !== 0){
        empId = naviEmpId;
    } else {
        empId = cookies.userInfo.empId;
    }

  const [empDtlData, setEmpDtlData] = useState({
    oldPwd: "",
    newPwd: "",
    newPwdCheck: "",

});
  const handleChgState = ({ name, value }) => {
  
    setEmpDtlData({
      ...empDtlData,
      [name]: value
    });
  };

const onClickChangePwd  = async (e) => {

if (empDtlData.oldPwd === null || empDtlData.oldPwd === ""){
  window.alert ("현재 비밀번호를 입력하세요");
  return;
}
if (empDtlData.newPwd === null || empDtlData.newPwd === ""){
  window.alert ("새 비밀번호를 입력하세요");
  return;
}
if (empDtlData.newPwdCheck === null || empDtlData.newPwdCheck === ""){
  window.alert (" 비밀번호 확인을 입력하세요");
  return;
}
if (empDtlData.newPwd != empDtlData.newPwdCheck ){
  window.alert (" 비밀번호 확인이 일치하지 않습니다 ");
  return;
}
    const isconfirm = window.confirm("비밀번호를 변경 하시겠습니까?"); 
    let empno;
    if (isconfirm) {
      const params = [{ tbNm: "LGN_USER" }, {empId : empId}];
      try {
        console.log("params:", params);
        const response = await ApiRequest( "/boot/common/commonSelect", params);
        empno = response[0].empno  
      }
       catch (error) {
        console.log(error);
      }
      const response =  await changePassword(empno, empDtlData.oldPwd, empDtlData.newPwd);
      if(response.isOk){
        window.alert("비밀번호가 변경 되었습니다");
        navigate("/home");
      }else {
        window.alert("기존 비밀번호를 확인하세요.");
      }
    } else{
      return;
    }
  }
  return (
    <div style={{ padding: "20px" ,backgroundColor: "#b5c1c7" }}>
      <div className="container" style={{ width : "35%", padding: "20px" ,backgroundColor: "#fff" }}>
          <p >
            <strong>* 비밀번호 변경</strong>
          </p>
          <Form colCount={1}>
              <GroupItem>
                <Item dataField="현재 비밀번호" ratio={1}>
                  <TextBox width="100%" placeholder="현재 비밀번호"stylingMode="filled" size="large"  mode="password" name="oldPwd" onValueChanged={(e) =>
                      handleChgState({
                        name: e.component.option("name"),
                        value: e.value,
                      })}/>
                </Item>
                <Item dataField="새 비밀번호" ratio={1} >
                  <TextBox width="100%" mode="password" placeholder="새 비밀번호"  stylingMode="filled" size="large" name="newPwd" onValueChanged={(e) =>
                      handleChgState({
                        name: e.component.option("name"),
                        value: e.value,
                      })}/>
                </Item>
                <Item dataField="비밀번호 확인"  ratio={1} >
                  <TextBox width="100%" mode="password" placeholder="비밀번호 확인" stylingMode="filled"  size="large"  name="newPwdCheck" onValueChanged={(e) =>
                      handleChgState({
                        name: e.component.option("name"),
                        value: e.value,
                      })}/>
                </Item>
            </GroupItem>
          </Form>
          <div style={{ marginTop: "10px", marginLeft: "245px" }}>
            <Button   type="default" text="저장" onClick={onClickChangePwd} />
         
          </div>
        </div>
      </div>

    
  );
};
export default EmpBasicInfo;