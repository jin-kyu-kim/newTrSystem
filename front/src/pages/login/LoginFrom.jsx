import React, { useState } from "react";
import "devextreme/dist/css/dx.light.css";
import "devextreme/dist/css/dx.material.blue.light.css"; // Material 테마
import { Button, TextBox } from "devextreme-react";
import Vtw from "../../assets/img/logo.png";
import Slogan from "../../assets/img/slogan.png";
import {signIn} from "../../utils/AuthMng"
import {useCookies} from "react-cookie";

const LoginForm = ({ handleLogin }) => {
  const [cookies, setCookie] = useCookies(["userInfo", "userAuth", "deptInfo"]);

  const [empno, setEmpno] = useState("");
  const [pswd, setPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const pwdRef =  React.createRef();

  // const userInfo = {
  //   empId: "20221064-bf25-11ee-b259-000c2956283f",
  //   empNm: "김진규",
  //   auth: "test",
  //   deptId: "9ec66846-3e7e-48be-aa84-3dc2307dc32b",
  // };
  //
  // // 기안자: "20221064-bf25-11ee-b259-000c2956283f",
  //
  // /*
  // 20221064-bf25-11ee-b259-000c2956283f 확인
  // 20218103-bf25-11ee-b259-000c2956283f 심사
  // 2021c1ed-bf25-11ee-b259-000c2956283f 승인
  // */
  // const userAuth = {
  //   userAuth: ["auth1", "auth2", "auth3"],
  //   empNm: "김진규11",
  //   auth: "test11",
  // };
  //
  // const handleSetCookie = () => {
  //   setCookie("userInfo", userInfo);
  //   setCookie("userAuth", userAuth);
  // };

  const validateForm = () => {
    const errors = {};
    if (!empno) {
      errors.empno = '사번을 입력하세요';
    }
    if (!pswd) {
      errors.pswd = '비밀번호를 입력하세요';
    }
    setValidationErrors(errors);

    return Object.keys(errors).length === 0;
  }

  const handleClick = async () => {
    const valid = validateForm()
    if(valid){
      const data = await signIn(empno, pswd);
      setCookie("userAuth", data.data.userAuth);
      setCookie("userInfo", data.data.userInfo);
      setCookie("deptInfo", data.data.deptInfo);
      if(data.isOk){
        handleLogin(data.isOk);
      }else {
        window.alert("비밀번호를 확인해주십시오");
        setPassword("");
      }
    }
    // try {
    //   // const param = { empId, pswd };
    //   // const response = await ApiRequest("/boot/trs/sysMng/lgnSkll", param);
    //
    //   handleSetCookie();
    //   handleLogin();
    // } catch (error) {
    //   console.log(error);
    // }

  };

  return (
      <div>
        <div className="login">
        <h1 className="login-header">
          <img src={Vtw} alt="VTW" />
        </h1>
        <div className="slogan">
          <img src={Slogan} alt="VTW" style={{ width: "50%" }} />
        </div>
        <div className="login-form">
          <div className="input-container">
            <TextBox
              value={empno}
              onValueChanged={(e) => setEmpno(e.value)}
              placeholder="사번"
            />
            {validationErrors.empno && (
                <div style={{ color: 'red' }}>{validationErrors.empno}</div>
            )}
          </div>
          <div className="input-container">
            <TextBox
              mode="password"
              value={pswd}
              onValueChanged={(e) => setPassword(e.value)}
              placeholder="비밀번호"
            />
            {validationErrors.pswd && (
                <div style={{ color: 'red' }}>{validationErrors.pswd}</div>
            )}
          </div>
          <div className="button-container">
            <Button text="Login" type="success" onClick={handleClick} />
          </div>
        </div>
        <div className="login-addInfo">
          <ul>
            <li>
              <a href="https://www.office.com">Office 365</a>
            </li>
            <li>
              <a href="https://outlook.office.com">Mail</a>
            </li>
            <li>
              <a href="http://kms.vtw.co.kr/wcommon/login.jsp">VSAM</a>
            </li>
          </ul>
          <h5>
            전략/기술 컨설팅을 기반으로 정보시스템 구축 및 운영에 이르는 Total
            IT Service의 미래 비전을 제시하는 기업, vtw
          </h5>
          <h5>copyright@2019 vtw.co.ltd all rights reserved</h5>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
