import React, { useEffect, useState } from "react";
import "devextreme/dist/css/dx.light.css";
import "devextreme/dist/css/dx.material.blue.light.css"; // Material 테마
import { Button, TextBox } from "devextreme-react";
import Vtw from "../../assets/img/logo.png";
import Slogan from "../../assets/img/slogan.png";
import ApiRequest from "../../utils/ApiRequest";
import { useCookies } from "react-cookie";

const LoginForm = ({ handleLogin }) => {
  const userInfo = {
    empId: "456498765sdf6sd54",
    empNm: "김진규",
    auth: "test",
  };
  const userAuth = {
    empId: "456498765sdf6sd54",
    empNm: "김진규11",
    auth: "test11",
  };

  const [cookies, setCookie] = useCookies(["userInfo", "userAuth"]);

  //   useEffect(() => {
  //     handleLogin();
  //   }, [cookies]);

  const handleSetCookie = () => {
    setCookie("userInfo", userInfo);
    setCookie("userAuth", userAuth);
  };

  const [empId, setEmpId] = useState("");
  const [pswd, setPassword] = useState("");

  const handleClick = async () => {
    try {
      const param = { empId, pswd };
      const response = await ApiRequest("/boot/trs/sysMng/lgnSkll", param);

      handleSetCookie();
      handleLogin();
    } catch (error) {
      console.log(error);
    }
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
              value={empId}
              onValueChanged={(e) => setEmpId(e.value)}
              placeholder="사번"
            />
          </div>
          <div className="input-container">
            <TextBox
              mode="password"
              value={pswd}
              onValueChanged={(e) => setPassword(e.value)}
              placeholder="비밀번호"
            />
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
