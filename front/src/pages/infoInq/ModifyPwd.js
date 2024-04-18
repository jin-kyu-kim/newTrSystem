import React, { useEffect, useState , useCallback, useRef} from "react";
import ApiRequest from "../../utils/ApiRequest";
import "devextreme-react/text-area";
import Button from "devextreme-react/button";
import { useNavigate } from "react-router-dom";
import { Item,Form,GroupItem, RequiredRule, PatternRule,} from "devextreme-react/form";
import { useCookies } from "react-cookie";
import { TextBox, Validator } from "devextreme-react";
import { changePassword } from "utils/AuthMng";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const ModifyPwd = ({naviEmpId}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [showPassword3, setShowPassword3] = useState(false);
  const formRef = useRef(null);
  const [baseInfoData, setBaseInfoData] = useState([]);
  /*유저세션*/
  const [cookies, setCookie] = useCookies(["userInfo", "userAuth"]);
  const navigate = useNavigate();
   let empId;

     // 패스워드 보이기/가리기 토글 함수
     const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };
    const togglePasswordVisibility2 = () => {
      setShowPassword2(!showPassword2);
    };
    const togglePasswordVisibility3 = () => {
      setShowPassword3(!showPassword3);
    };

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
  if (empDtlData.newPwd.length < 8) {
    window.alert("새 비밀번호 는 8자 이상부터 입력가능합니다.");
    return;
  }
  if (empDtlData.newPwdCheck.length < 8) {
    window.alert("새 비밀번호 확인은 8자 이상부터 입력가능합니다.");
    return;
  }
  if (empDtlData.newPwd.length > 20) {
    window.alert("새 비밀번호 는 20자 를 넘을수 없습니다.");
    return;
  }
  

  if (empDtlData.newPwdCheck.length > 20) {
    window.alert("새 비밀번호 확인은 20자 를 넘을수 없습니다.");
    return;
  }
  


  if (!/^(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(empDtlData.newPwd)) {
      window.alert("새 비밀번호는 숫자, 영문자, 특수문자가 모두 포함되어야 합니다.");
      return;
  }
  if (!/^(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(empDtlData.newPwdCheck)) {
    window.alert("새 비밀번호 확인 은 숫자, 영문자, 특수문자가 모두 포함되어야 합니다.");
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
      <div className="container" style={{ width : "43%", padding: "20px" ,backgroundColor: "#fff" }}>
          <p >
            <strong>* 비밀번호를 수정합니다. (8자리~20자리, 숫자/영문자/특수문자포함하여야 합니다.)</strong>
          </p>
          <Form colCount={1}>
              <GroupItem>
                <Item dataField="현재 비밀번호" ratio={1}>
                  <TextBox 
                   mode={showPassword ? 'text' : 'password'}
                  width="100%" placeholder="현재 비밀번호"stylingMode="filled"    validationMessageMode="always"  size="large"  name="oldPwd" onValueChanged={(e) =>
                      handleChgState({
                        name: e.component.option("name"),
                        value: e.value,
                      })}
                     
                      >
                <Validator>
                <RequiredRule message="현재 비밀번호를 입력해주세요." />
                </Validator>
                <FontAwesomeIcon  style={{ position: 'absolute', right: '35px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', zIndex:1 }}
                icon={showPassword ? faEye : faEyeSlash}
                onClick={togglePasswordVisibility}
              />
                      </TextBox>
                </Item>
                <Item dataField="새 비밀번호" ratio={1} >
                  <TextBox width="100%" mode={showPassword2 ? 'text' : 'password'} validationMessageMode="always" placeholder="새 비밀번호"  stylingMode="filled" size="large" name="newPwd" onValueChanged={(e) =>
                      handleChgState({
                        name: e.component.option("name"),
                        value: e.value,
                      })}>
                           <Validator>
                        <RequiredRule message="새 비밀번호를 입력해주세요." />
                            <PatternRule
                                message="8자리~20자리, 숫자/영문자/특수문자포함하여야 합니다."
                                pattern={/^(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,20}$/}
                            />
                        </Validator>
                        <FontAwesomeIcon    style={{ position: 'absolute', right: '35px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', zIndex: 1 }}
                      icon={showPassword2 ? faEye : faEyeSlash}
                      onClick={togglePasswordVisibility2}
                    />
                      </TextBox>
                </Item>
                <Item dataField="비밀번호 확인"  ratio={1} >
                  <TextBox width="100%" mode={showPassword3 ? 'text' : 'password'} validationMessageMode="always"placeholder="비밀번호 확인" stylingMode="filled"  size="large"  name="newPwdCheck" onValueChanged={(e) =>
                      handleChgState({
                        name: e.component.option("name"),
                        value: e.value,
                      })}>
                           <Validator>
                        <RequiredRule message="비밀번호 확인을  입력해주세요." />
                            <PatternRule
                                message="8자리~20자리, 숫자/영문자/특수문자포함하여야 합니다."
                                pattern={/^(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,20}$/}
                            />
                        </Validator>
                         <FontAwesomeIcon    style={{ position: 'absolute', right: '35px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', zIndex: 1 }}
                      icon={showPassword3 ? faEye : faEyeSlash}
                      onClick={togglePasswordVisibility3}
                    /></TextBox>
                      
                      
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
export default ModifyPwd;