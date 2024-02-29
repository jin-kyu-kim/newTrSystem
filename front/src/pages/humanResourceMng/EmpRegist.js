import { useMemo, useEffect, useState } from "react";
import uuid from "react-uuid";
import EmpRegistJson from "./EmpRegistJson.json";
import Button from "devextreme-react/button";

import { useCookies } from "react-cookie";
import CustomLabelValue from "components/unit/CustomLabelValue";
import ApiRequest from "utils/ApiRequest";
import { left, right } from "@popperjs/core";

const EmpRegist = ({ onHide,deptInfo, empno, isNew }) => {
  const {empDetailqueryId, labelValue, queryId } = EmpRegistJson;
  const [readOnly, setReadOnly] = useState(true);
  const [data, setData] = useState([]);
  const [param, setParam] = useState([]);
  const [showButton, setShowButton] = useState(false);
  const [cookies, setCookie] = useCookies(["userInfo", "userAuth"]);
  const empId = cookies.userInfo.empId;
  
  // 직원 기초정보 화면 스타일
  const popupContentInnerStyle = {
    overflow:"hidden",
    marginTop:"-20px"
  };

  const buttonContainerStyle = {
    display: "flex",
    justifyContent: "right",
    margin:"10px"
  };

  const buttonStyle = {
    marginLeft: "10px",
  };

  const empDetailLeftStyle = {
    width: "50%", // 왼쪽 영역의 너비를 설정
    float : left,

  };

  const empDetailRightStyle = {
    width: "50%", // 오른쪽 영역의 너비를 설정
    float : right,
    flexDirection: "column",
  };

  //deptId 파라미터에 변경이 있을 때 실행되는 함수
  useEffect(() => {
    const date = new Date();
    const now =  date.toISOString().split("T")[0] +" " +date.toTimeString().split(" ")[0];

    if(empno === undefined && isNew){
        setData({
        ...data,
        deptId: uuid(),
        endYn: "N",
        regEmpId : empId,
        regDt: now,
      });
    } else if(empno !=null && !isNew){
        // deptInfoHandle();
        console.log("확인용1 ",empno)
        console.log("확인용2 ",deptInfo);
      //setData(deptInfo);
    }
  }, [empno]);
  
  //deptInfo 값이 변경되고 나서 setData함수가 실행되게 하는 useEffect
  useEffect(() => {
    if (deptInfo.empno !== undefined) {
      setData(deptInfo);
    }
  }, [deptInfo.empno]);

  //신규 등록시 입력창 활성화+저장버튼 보이기
  //추후 부서 정보 수정시에도 설정해줘야함
  useEffect(()=>{
    console.log("isNew?"+isNew);
    setShowButton(isNew);
    setReadOnly(!isNew);
  },[isNew]);

  //input박스 데이터 변경시 data에 새로 저장됨
  const handleChgState = ({ name, value }) => {
    if(!readOnly){
      setData({
        ...data,
        [name]: value,
      });
    }
  };
  //커스텀라벨 초기화버튼 
  const onReset = () =>{
    setData({
      ...data,
       all : '',
    });
  }
  //신규 부서 등록 
  const onClick = () => {
    const isconfirm = window.confirm("신규부서 등록을 하시겠습니까?"); 
    if (isconfirm) {
      if(isNew){
        insertDept();
      }
    } else{
      return;
    }
  };
//================신규부서 등록 인설트
  const insertDept = async () => {
    if(data.deptEndYmd === null){
        setData({
            ...data,
            deptEndYmd : null,
          });
    }
    console.log(data);
    const param = [{ tbNm: "DEPT" }, data];
    try {
      const response = await ApiRequest("/boot/common/commonInsert", param);
      console.log(response);

        if (response > 0) {
          setData({});
          console.log(data);
          onHide();
        }

    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  return (
    <div className="popup-content" >
      <div className="dept-regist-content">
        <div className="dept-regist-content-inner" style={popupContentInnerStyle}>
          <div className="dx-fieldset">
          <div className="empDetailLeft" style={empDetailLeftStyle}>
            <CustomLabelValue
              props={labelValue.empFlnm}
              onSelect={handleChgState}
              value={data.empFlnm}
              
            />        
            <CustomLabelValue
              props={labelValue.upDeptNm}
              onSelect={handleChgState}
              value={data.upDeptId}
              
            />
            <CustomLabelValue
              props={labelValue.telno}
              onSelect={handleChgState}
              value={data.telno}
             
            />
             <CustomLabelValue
              props={labelValue.bankCd}
              onSelect={handleChgState}
              value={data.bankCd}              
            />
            
          </div>
          <div className="empDetailRight" style={empDetailRightStyle}> 
          <CustomLabelValue
              props={labelValue.jbpsCd}
              onSelect={handleChgState}
              value={data.jbpsNm}
              
            />
             <CustomLabelValue
              props={labelValue.hdofSttsCd}
              onSelect={handleChgState}
              value={data.hdofSttsNm}
              
            />
            <CustomLabelValue
              props={labelValue.eml}
              onSelect={handleChgState}
              value={data.eml}
              
            />        
            <CustomLabelValue
              props={labelValue.actNo}
              onSelect={handleChgState}
              value={data.actNo}
              
            />
            </div>
          </div>
        </div>
      </div>
      <div className="buttonContainer" style={buttonContainerStyle}>
              <Button style={buttonStyle} onClick={onReset} > 직원신규입력</Button>
              <Button style={buttonStyle}>기초정보 저장</Button>
      </div>
    </div>
  );
};

export default EmpRegist;
