import { useMemo, useEffect, useState } from "react";
import uuid from "react-uuid";
import EmpRegistJson from "./EmpRegistJson.json";
import Button from "devextreme-react/button";
import CustomCdComboBox from "../../components/unit/CustomCdComboBox";
import { useCookies } from "react-cookie";
import CustomLabelValue from "components/unit/CustomLabelValue";
import ApiRequest from "utils/ApiRequest";
import { left, right } from "@popperjs/core";

const EmpRegist = ({ onHide,empInfo, empno, isNew }) => {
  const {labelValue} = EmpRegistJson;
  const [readOnly, setReadOnly] = useState(true);
  const [data, setData] = useState([]);
  const [param, setParam] = useState([]);
  const [cookies, setCookie] = useCookies(["userInfo", "userAuth"]);
  const empId = cookies.userInfo.empId;
  
  //========================= 직원 기초정보 화면 스타일
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

  //==============================deptId 파라미터에 변경이 있을 때 실행되는 함수
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
        console.log("확인용2 ",empInfo);
      //setData(deptInfo);
    }
  }, [empno]);
  
  //=================empInfo 값이 변경되고 나서 setData함수가 실행되게 하는 useEffect
  useEffect(() => {
    if (empInfo.empno !== undefined) {
      setData(empInfo);    
    }
    
  }, [empInfo.empno]);

  useEffect(() => {
    console.log("DDDDDDD : ", data);
    
  }, [data]);

  //input박스 데이터 변경시 data에 새로 저장됨
  const handleChgState = ({ name, value }) => {
    //if(!readOnly) {
    if(name === "jbpsCd"){
      if(data.jbpsCd === "VTW00119")
      {
        setData({
          ...data,
          [name]: value,
          empTyCd : "VTW00202"
        });
      }else{
        setData({
          ...data,
          [name]: value,
          empTyCd : "VTW00201"
        });
      }
    }else{
      setData({
        ...data,
        [name]: value,
      });
    //}
  }
    
  };
  //커스텀라벨 초기화버튼 
  const onReset = () =>{
    setData({});
    console.log("data값입니다", data);
  }
  //기초정보 저장 
  const onClick = () => {

    const isconfirm = window.confirm("기초정보를 저장 하시겠습니까?"); 
    if (isconfirm) {
      if(data.empno !== undefined && data.empno !== ''){
        updateEmp();
      }else{
        insertEmp();
      }       
    } else{
      return;
     }
    
  };

//================기초정보 등록
  const insertEmp = async () => {
    console.log("insert입니다.")
    console.log(data);
    const date = new Date();
    const now =  date.toISOString().split("T")[0] +" " +date.toTimeString().split(" ")[0];
    const param =[
      { tbNm: "EMP" },
      {
         empId : uuid(),
         actno : data.actno,
         bankCd : data.bankCd,
         empTyCd : data.empTyCd,
         eml : data.eml,
         empFlnm : data.empFlnm,
         hdofSttsCd : data.hdofSttsCd,
         jbpsCd : data.jbpsCd,
         telno : data.telno,
         regEmpId : empId,
         regDt: now,
      }
  ]
    try {
      const response = await ApiRequest("/boot/common/commonInsert", param);
      console.log(response);

        if (response > 0) {
          setData({});
          console.log(data);
        }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };
  //================기초정보 업데이트
  const updateEmp = async () => {
    console.log("update입니다.")
    console.log(data);
    const date = new Date();
    const now =  date.toISOString().split("T")[0] +" " +date.toTimeString().split(" ")[0];
    const param =[
      { tbNm: "EMP" },
      {
         actno : data.actno,
         bankCd : data.bankCd,
         eml : data.eml,
         empFlnm : data.empFlnm,
         hdofSttsCd : data.hdofSttsCd,
         jbpsCd : data.jbpsCd,
         telno : data.telno,
         mdfcnEmpId : empId,
         mdfcnDt: now,
      },
      {
         empno : data.empno
      }
  ]
    try {
      const response = await ApiRequest("/boot/common/commonUpdate", param);
      console.log(response);

        if (response > 0) {
          setData({});
          console.log(data);
        }

    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

//화면그리는구간//
  return (
    <div className="popup-content" >

        <div className="dept-regist-content-inner" style={popupContentInnerStyle}>
          <div className="dx-fieldset">
          <div className="empDetailLeft" style={empDetailLeftStyle}>
          <CustomLabelValue props={labelValue.empFlnm} onSelect={handleChgState} value={data.empFlnm} />
          <CustomLabelValue props={labelValue.telno} onSelect={handleChgState} value={data.telno} />
          <CustomLabelValue props={labelValue.bankCd} onSelect={handleChgState} value={data.bankCd} /> 
          </div>
          <div className="empDetailRight" style={empDetailRightStyle}> 
          <CustomLabelValue props={labelValue.jbpsCd} onSelect={handleChgState} value={data.jbpsCd} />
          <CustomLabelValue props={labelValue.hdofSttsCd} onSelect={handleChgState} value={data.hdofSttsCd} />
          <CustomLabelValue props={labelValue.eml} onSelect={handleChgState} value={data.eml} />
          <CustomLabelValue props={labelValue.actno} onSelect={handleChgState} value={data.actno} />          
          </div>
          </div>
        </div>

      <div className="buttonContainer" style={buttonContainerStyle}>
          <Button style={buttonStyle} onClick={onReset} >직원신규입력</Button>
          <Button style={buttonStyle} onClick={onClick} >기초정보 저장</Button>
      </div>
    </div>
  );
};

export default EmpRegist;
