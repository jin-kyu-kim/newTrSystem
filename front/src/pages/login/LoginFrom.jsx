import React, { useState } from "react";
import { Button, TextBox } from "devextreme-react";
import Vtw from "../../assets/img/logo.png";
import Slogan from "../../assets/img/slogan.png";
import {useAuth} from "../../components/sidebar/contexts/auth";
import { useModal } from "../../components/unit/ModalContext";
import "../../App.css"

const LoginForm = () => {
  const [empno, setEmpno] = useState("");
  const [pswd, setPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const { signIn } = useAuth();
  const { handleOpen } = useModal();

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
        handleOpen(data.data)
        setPassword("");
      }
    }
  };

  const preventCopy = (e) => {
    e.event.preventDefault(); // DevExtreme의 이벤트 객체에서 원래의 이벤트를 참조
    handleOpen('복사는 허용되지 않습니다.');
  }

  const [showLoginForm, setShowLoginForm] = useState(false);
  const toggleLoginForm = () => {
    setShowLoginForm(!showLoginForm);
  }

  return (
      <div>
        <div className="login">
          <h1 className="login-header">
            <img src={Vtw} alt="VTW" style={{margin: "10px"}}/>
          </h1>
          <div className="slogan">
            <img src={Slogan} alt="VTW" style={{width: "593px", marginBottom: "5%"}}/>
          </div>
          <div className="login-form">
            <div style={{marginTop: '5%', marginBottom: '5%'}}>
              <div style={{color: 'red', fontWeight: 'bold', marginBottom: '5%', textDecoration: 'underline'}}>* 운영 전환 예정으로 인한 시스템 사용 제한</div>
              <div>사용 제한 일시 : 2024.06.28(금) 13:00 ~ 2024.07.01(월) 13:00</div>
            </div>

            {showLoginForm && (
              <>
                <div className="input-container">
                  <TextBox
                      value={empno}
                      onValueChanged={(e) => setEmpno(e.value)}
                      placeholder="사번"
                      onEnterKey={handleClick}
                  />
                  {validationErrors.empno && (
                      <div style={{color: 'red'}}>{validationErrors.empno}</div>
                  )}
                </div>
                <div className="input-container">
                  <TextBox
                      mode="password"
                      value={pswd}
                      onValueChanged={(e) => setPassword(e.value)}
                      placeholder="비밀번호"
                      onEnterKey={handleClick}
                      onCopy={preventCopy}
                  />
                  {validationErrors.pswd && (
                      <div style={{color: 'red'}}>{validationErrors.pswd}</div>
                  )}
                </div>
                <div className="button-container">
                  <Button text="Login" type="success" onClick={handleClick}/>
                </div>
              </>
            )}
          </div>
          
          <div className="link">
            <div className="image-group">
              <div className="image-container">
                <div className="image top-image1"></div>
                <div className="image bottom-image1"></div>
              </div>
              <div className="image-container">
                <div className="image top-image2"></div>
                <div className="image bottom-image2"></div>
              </div>
              <div className="image-container">
                <div className="image top-image3"></div>
                <div className="image bottom-image3"></div>
              </div>
            </div>
          </div>
          <div style={{alignSelf:"center", textAlign:"center", color:"white", marginTop:"20px"}}>
          <p>
            전략/기술 컨설팅을 기반으로 정보시스템 구축 및 운영에 이르는 Total
            IT Service의 미래 비전을 제시하는 기업, <span onClick={toggleLoginForm}>vtw</span>
          </p>
          <h6>copyright@2024 vtw.co.ltd all rights reserved</h6>
          </div>
        </div>
      </div>
  );
};
export default LoginForm;