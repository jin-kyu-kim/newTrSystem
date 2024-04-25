import React, { useState } from "react";
import "devextreme/dist/css/dx.light.css";
import "devextreme/dist/css/dx.material.blue.light.css"; // Material 테마
import { Button, TextBox } from "devextreme-react";
import Vtw from "../../assets/img/logo.png";
import Slogan from "../../assets/img/slogan.png";
import {useAuth} from "../../components/sidebar/contexts/auth";

const LoginForm = ({ handleLogin }) => {
  const [empno, setEmpno] = useState("");
  const [pswd, setPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const { signIn } = useAuth();

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
      if(!data.isOk){
        window.alert("비밀번호를 확인해주십시오");
        setPassword("");
      }
    }
  };

  return (
      <div>
        <div className="login" >
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
              onEnterKey={handleClick}
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
              onEnterKey={handleClick}
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
