import "devextreme-react/text-area";
import React, { useState } from "react";
import ApiRequest from "../../utils/ApiRequest";
import Button from "devextreme-react/button";
import { useNavigate } from "react-router-dom";
import { Item, Form, GroupItem, RequiredRule, PatternRule } from "devextreme-react/form";
import { TextBox, Validator } from "devextreme-react";
import { changePassword } from "utils/AuthMng";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useModal } from "../../components/unit/ModalContext";
import { signOut } from "../../utils/AuthMng";

const ModifyPwd = ({ naviEmpId }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [showPassword3, setShowPassword3] = useState(false);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const { handleOpen } = useModal();
  const navigate = useNavigate();
  const empId = naviEmpId.length !== 0 ? naviEmpId : userInfo.empId;

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

  const onClickChangePwd = async () => {

    if (empDtlData.oldPwd === null || empDtlData.oldPwd === "") {
      handleOpen("현재 비밀번호를 입력하세요");
      return;
    }
    if (empDtlData.newPwd.length < 8) {
      handleOpen("새 비밀번호 는 8자 이상부터 입력가능합니다.");
      return;
    }
    if (empDtlData.newPwdCheck.length < 8) {
      handleOpen("새 비밀번호 확인은 8자 이상부터 입력가능합니다.");
      return;
    }
    if (empDtlData.newPwd.length > 20) {
      handleOpen("새 비밀번호 는 20자 를 넘을수 없습니다.");
      return;
    }
    if (empDtlData.newPwdCheck.length > 20) {
      handleOpen("새 비밀번호 확인은 20자 를 넘을수 없습니다.");
      return;
    }
    if (!/^(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(empDtlData.newPwd)) {
      handleOpen("새 비밀번호는 숫자, 영문자, 특수문자가 모두 포함되어야 합니다.");
      return;
    }
    if (!/^(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(empDtlData.newPwdCheck)) {
      handleOpen("새 비밀번호 확인 은 숫자, 영문자, 특수문자가 모두 포함되어야 합니다.");
      return;
    }

    if (empDtlData.newPwd === null || empDtlData.newPwd === "") {
      handleOpen("새 비밀번호를 입력하세요");
      return;
    }
    if (empDtlData.newPwdCheck === null || empDtlData.newPwdCheck === "") {
      handleOpen(" 비밀번호 확인을 입력하세요");
      return;
    }
    if (empDtlData.newPwd != empDtlData.newPwdCheck) {
      handleOpen(" 비밀번호 확인이 일치하지 않습니다 ");
      return;
    }

    let empno;
    const params = [{ tbNm: "LGN_USER" }, { empId: empId }];
    try {
      const response = await ApiRequest("/boot/common/commonSelect", params);
      empno = response[0].empno
    }
    catch (error) {
      console.log(error);
    }
    const response = await changePassword(empno, empDtlData.oldPwd, empDtlData.newPwd);

    if (response === 'success') {
      handleOpen("비밀번호 변경이 완료되었습니다.");
      setTimeout(() => {
        signOut();
      }, 1000);
    } else if (response === 'incorrect') {
      handleOpen("기존 비밀번호를 확인하세요.");
    } else {
      handleOpen("비밀번호 변경에 실패했습니다.");
    }
  }
  return (
    <div style={{ padding: "20px" }}>
      <div className="container">
        <p><strong>* 비밀번호를 수정합니다. (8자리~20자리, 숫자/영문자/특수문자포함하여야 합니다.)</strong></p>
        <Form colCount={1}>
          <GroupItem>
            <Item dataField="현재 비밀번호" ratio={1}>
              <TextBox
                mode={showPassword ? 'text' : 'password'}
                width="100%" placeholder="현재 비밀번호" stylingMode="filled" validationMessageMode="always" size="large" name="oldPwd" onValueChanged={(e) =>
                  handleChgState({
                    name: e.component.option("name"),
                    value: e.value,
                  })}
                  onEnterKey={onClickChangePwd}
              >
                <Validator>
                  <RequiredRule message="현재 비밀번호를 입력해주세요." />
                </Validator>
                <FontAwesomeIcon style={{ position: 'absolute', right: '35px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', zIndex: 1 }}
                  icon={showPassword ? faEye : faEyeSlash}
                  onClick={togglePasswordVisibility}
                />
              </TextBox>
            </Item>
            <Item dataField="새 비밀번호" ratio={1} >
              <TextBox width="100%" mode={showPassword2 ? 'text' : 'password'} validationMessageMode="always" placeholder="새 비밀번호" stylingMode="filled" size="large" name="newPwd" onValueChanged={(e) =>
                handleChgState({
                  name: e.component.option("name"),
                  value: e.value,
                })}
                onEnterKey={onClickChangePwd}>
                <Validator>
                  <RequiredRule message="새 비밀번호를 입력해주세요." />
                  <PatternRule
                    message="8자리~20자리, 숫자/영문자/특수문자포함하여야 합니다."
                    pattern={/^(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,20}$/}
                  />
                </Validator>
                <FontAwesomeIcon style={{ position: 'absolute', right: '35px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', zIndex: 1 }}
                  icon={showPassword2 ? faEye : faEyeSlash}
                  onClick={togglePasswordVisibility2}
                />
              </TextBox>
            </Item>
            <Item dataField="비밀번호 확인" ratio={1} >
              <TextBox width="100%" mode={showPassword3 ? 'text' : 'password'} validationMessageMode="always" placeholder="비밀번호 확인" stylingMode="filled" size="large" name="newPwdCheck" onValueChanged={(e) =>
                handleChgState({
                  name: e.component.option("name"),
                  value: e.value,
                })}
                onEnterKey={onClickChangePwd}>
                <Validator>
                  <RequiredRule message="비밀번호 확인을 입력해주세요." />
                  <PatternRule
                    message="8자리~20자리, 숫자/영문자/특수문자포함하여야 합니다."
                    pattern={/^(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,20}$/}
                  />
                </Validator>
                <FontAwesomeIcon style={{ position: 'absolute', right: '35px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', zIndex: 1 }}
                  icon={showPassword3 ? faEye : faEyeSlash}
                  onClick={togglePasswordVisibility3}
                /></TextBox>
            </Item>
          </GroupItem>
        </Form>
        <div style={{ marginTop: "10px", textAlign: 'center' }}>
          <Button type="default" text="저장"
            onClick={() => handleOpen("비밀번호를 변경 하시겠습니까?", () => onClickChangePwd())} />
        </div>
      </div>
    </div>
  );
};
export default ModifyPwd;