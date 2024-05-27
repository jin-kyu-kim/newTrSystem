import { useEffect, useState } from "react";
import uuid from "react-uuid";
import EmpRegistJson from "./EmpRegistJson.json";
import Button from "devextreme-react/button";
import CustomLabelValue from "components/unit/CustomLabelValue";
import ApiRequest from "utils/ApiRequest";
import { left, right } from "@popperjs/core";
import moment from "moment";
import notify from 'devextreme/ui/notify';
import { useModal } from "../../components/unit/ModalContext";

const EmpRegist = ({callBack, empInfo, read,callBackR,callBackF,reForm}) => {

//-----------------------------선언 구간 -----------------------------------
    const {labelValue,empDetailqueryId} = EmpRegistJson;
    const [empMax,setEmpMax] =useState({});   //사번 MAX값
    const [param, setParam] = useState([]);   //사번 max값 조회용 세팅 param
    const [updateParam,setUpdateParam] = useState([]);
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const userAuth = JSON.parse(localStorage.getItem("userAuth"));
    const empId = userInfo.empId;
    const query =(empDetailqueryId);
    const { handleOpen } = useModal();
//==----------------------기초정보 폼 설정용 선언==============================
    const [empIdd,setEmpIdd] = useState();
    const [empno,setEmpno] = useState();
    const [empFlnm, setEmpFlnm] = useState();
    const [telno, setTelno] = useState();
    const [bankCd, setBankCd] = useState();  
    const [jbpsCd, setJbpsCd] = useState();  
    const [hdofSttsCd, setHdofSttsCd] = useState(); 
    const [eml, setEml] = useState(); 
    const [actno, setActno] = useState(); 
    const [empTyCd,setEmpTyCd] = useState();
    const [jncmpYmd,setJncmpYmd] = useState();
    const [dept,setDept] = useState();
    const date = new Date();
    const now =  date.toISOString().split("T")[0] +" " +date.toTimeString().split(" ")[0];
    const startday = moment().format('YYYYMMDD'); //현재 년월일 (부서 시작일자 자동 세팅용)
    const gnfdDate = moment().format('YYYYMM') //현재 년월
    //const emailRegEx = /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/i;
//-----------------------------초기세팅 구간 -----------------------------------
  
      useEffect(() => {   //변수 초기화
        setEmpIdd(null);
        setEmpno(null);
        setEmpFlnm(null);
        setTelno(null);
        setBankCd(null);
        setJbpsCd(null);
        setHdofSttsCd("VTW00301");
        setEml(null);
        setActno(null);
        setEmpTyCd(null);
        setDept(null);
        setJncmpYmd(startday);
      }, []);
     
      useEffect(() => {
        if (empInfo.empId !== undefined) {
          setEmpIdd(empInfo.empId);
          setEmpno(empInfo.empno);
          setEmpFlnm(empInfo.empFlnm);
          setTelno(empInfo.telno);
          setBankCd(empInfo.bankCd);
          setJbpsCd(empInfo.jbpsCd);
          setHdofSttsCd(empInfo.hdofSttsCd);
          setEml(empInfo.eml);
          setActno(empInfo.actno);
          setJncmpYmd(empInfo.jncmpYmd)
        }
      }, [empInfo]);

        useEffect(()=>{
          if(reForm === true){
            reset();
          }
        },[reForm])

      useEffect(() => {
        if(!Object.values(empMax).every((value) => value === "")){
          const paramIns =[
            { tbNm: "EMP" },
            {
              empId : uuid(),
              empno : empMax,
              actno : actno,
              bankCd : bankCd,
              empTyCd : empTyCd,
              eml : eml,
              empFlnm : empFlnm,
              hdofSttsCd : hdofSttsCd,
              jbpsCd : jbpsCd,
              telno : telno,
              regEmpId : empId,
              regDt: now,
            }
          ]
          insertEmp(paramIns);
        }
      }, [empMax]);

      useEffect(() => {
        if(jbpsCd === "VTW00119")
        {
          setEmpTyCd("VTW00202")
          setParam({empnoChk : "VM" ,queryId : "humanResourceMngMapper.retrieveEmpnoMax",});
        }else{
          setEmpTyCd("VTW00201")
          setParam({empnoChk : "VK" ,queryId : "humanResourceMngMapper.retrieveEmpnoMax", });
        }
      }, [jbpsCd]);

      useEffect(() => {
        if(!Object.values(updateParam).every((value) => value === "")){
          updateEmp();
        }
      }, [updateParam]);

//-----------------------------이벤트 구간 -----------------------------------
    const reset = () => {
      setEmpIdd(null);
      setEmpno(null);
      setEmpFlnm(null);
      setTelno(null);
      setBankCd(null);
      setJbpsCd(null);
      setHdofSttsCd("VTW00301");
      setEml(null);
      setActno(null);
      setJncmpYmd(startday);
      setDept(null);
    };

    const handleChgState = ({ name, value }) => {     //값변경시 이벤트
      console.log(name,value)
      if(name === "jbpsCd"){
        setJbpsCd(value);
      }else if(name === "empFlnm"){
        setEmpFlnm(value);
      }else if(name === "telno"){
        setTelno(value);
      }else if(name === "bankCd"){
        setBankCd(value);
      }else if(name === "actno"){
        setActno(value);
      }else if(name === "hdofSttsCd"){
        setHdofSttsCd(value);
      }else if(name === "eml" ){
        // if(!emailCheck(value) && value !== null){
        //   alert("이메일 형식으로 입력해주세요");
        // }else{
        // }
        setEml(value);  
      }else if(name === "jncmpYmd" ){
        setJncmpYmd(value);  
      }else if(name === "deptId"){
        setDept(value);
      }
      
    };

    //커스텀라벨 초기화버튼 
    const onReset = (e) =>{
      reset();
      callBackR();
      callBackF();
      notify("초기화되었습니다.","success",200);
    }
   
    //기초정보 저장 
    const onClick = (e) => {
      console.log("저장1")
      if(empFlnm === null){
        handleOpen("성명을 입력해주세요");
      }else if(jbpsCd === null){
        handleOpen("직위를 선택해주세요");
      }else if(hdofSttsCd === null){
        handleOpen("재직상태를 선택해주세요");
      }else if(bankCd === null){
        handleOpen("은행코드를 선택해주세요");
      }else if(actno === null){
        handleOpen("계좌번호를 입력해주세요");
      }else{
        if(empIdd === null){
          if(dept === null ){
            handleOpen("소속을 선택해주세요");
          }
        }
        const isconfirm = window.confirm("기초정보를 저장 하시겠습니까?"); 
        if (isconfirm) {
          if(empIdd === null ){
            empnoHandle(); //조회하러 이동
          }else{
            if(jncmpYmd !== null || empInfo.jncmpYmd !== jncmpYmd){
              const paramHist =[
                { tbNm: "EMP_HIST" , snColumn: "EMP_HIST_SN", snSearch: {empId : empIdd}},
                {
                empId : empIdd,
                hdofSttsCd : hdofSttsCd,
                jbpsCd : jbpsCd,
                jncmpYmd : jncmpYmd,
                regEmpId : empId,
                regDt: now,
              }
              ]
              setUpdateParam(paramHist)
            }else{
              updateEmp();
            }
          }       
        } else{
          return;
        }
      }
      
      
    };
    //사번 max값 조회용
    const empnoHandle = async () => {
      try {
        const response = await ApiRequest("/boot/common/queryIdSearch", param);
        setEmpMax(response[0].empnoChk);    
      } catch (error) {
        console.log(error);
      }
    };

    // const emailCheck = (emailck) => { //이메일 형식 체크용
    //   return emailRegEx.test(emailck); 
    // }

  //================기초정보 등록
    const insertEmp = async (paramIns) => {
      const paramHist =[  //직원 히스토리 최초 저장
        { tbNm: "EMP_HIST"},
        {
        empId : paramIns[1].empId,
        empHistSn: "0",
        hdofSttsCd : hdofSttsCd,
        jbpsCd : jbpsCd,
        jncmpYmd : jncmpYmd,
        regEmpId : empId,
        regDt: now,
      }
      ]
      const paramuUser =
        {
        empId : paramIns[1].empId,
        empno : paramIns[1].empno,
        acntExpryYn : "N",
        acntYn : "N",
        passwordExpryYn : "N",
        usePsbltyAcntYn : "Y",
        regEmpId : empId,
        regDt: now,
      }
      const InsertDept =[ //부서발령
        { tbNm: "DEPT_HNF" },
        {
           deptId : dept,
           empId : paramIns[1].empId,
           jbttlCd : "VTW01003",
           empno : paramIns[1].empno,
           deptGnfdYmd : gnfdDate,
           regDt : now,
           regEmpId: empId,        
        },
      ]
      const InsertDeptHistParam=[ //부서발령 히스토리 정보
        { tbNm: "DEPT_HNF_HIST", snColumn: "DEPT_HNF_HIST_SN", snSearch: {deptId : dept, empId : paramIns.empId}},
        {
           deptId : dept,
           empId : paramIns[1].empId,
           jbttlCd : "VTW01003",
           empno : paramIns[1].empno,
           deptGnfdYmd : gnfdDate,
           regDt : now,
           regEmpId: empId,        
        },
      ]
      try {
        const response = await ApiRequest("/boot/common/commonInsert", paramIns);
        const responseHist = await ApiRequest("/boot/common/commonInsert", paramHist);
        const responseUser = await ApiRequest("/boot/sysMng/resetPswd", paramuUser);
        const responseDept = await ApiRequest("/boot/common/commonInsert", InsertDept); //발령인서트
        const histDeptResponse = await ApiRequest("/boot/common/commonInsert", InsertDeptHistParam); //발령 히스토리 인서트
          if (response > 0 && responseHist > 0 && responseUser === "성공" && responseDept > 0 && histDeptResponse > 0) {
            handleOpen("저장되었습니다.");
            onReset();
            callBack(query);
          }
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
  


    const updateEmp = async () => {   //업데이트
      const param =[
        { tbNm: "EMP" },
        {
          actno : actno,
          bankCd : bankCd,
          eml : eml,
          empFlnm : empFlnm,
          hdofSttsCd : hdofSttsCd,
          jbpsCd : jbpsCd,
          telno : telno,
          mdfcnEmpId : empId,
          mdfcnDt: now,
        },
        {
          empId : empIdd
        }
    ]
    
      try {
        const response = await ApiRequest("/boot/common/commonUpdate", param);
        if(!Object.values(updateParam).every((value) => value === "")){
        const responseHist = await ApiRequest("/boot/common/commonInsert",updateParam);
        }
          if (response > 0) {
            handleOpen("저장되었습니다."); 
            onReset();
            callBack(query);
          }
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

//-------------------------------------------화면그리는구간-------------------------------------------------------------------//
  return (
    <div className="popup-content" >
        <div className="dept-regist-content-inner" style={popupContentInnerStyle}>
          <div className="dx-fieldset">
          <div className="empDetailLeft" style={empDetailLeftStyle}>
          <CustomLabelValue props={labelValue.empFlnm} onSelect={handleChgState} value={empFlnm} />
          <CustomLabelValue props={labelValue.hdofSttsCd} onSelect={handleChgState} value={hdofSttsCd} />
          <CustomLabelValue props={labelValue.telno} onSelect={handleChgState} value={telno} />
          <CustomLabelValue props={labelValue.bankCd} onSelect={handleChgState} value={bankCd} /> 
          </div>
          <div className="empDetailRight" style={empDetailRightStyle}> 
          <CustomLabelValue props={labelValue.jbpsCd} onSelect={handleChgState} value={jbpsCd} readOnly={read}/>
          <CustomLabelValue props={labelValue.jncmpYmd} onSelect={handleChgState} value={jncmpYmd} />
          <CustomLabelValue props={labelValue.eml} onSelect={handleChgState} value={eml} />
          <CustomLabelValue props={labelValue.actno} onSelect={handleChgState} value={actno} />          
          </div>
          {empIdd === null ? ( 
            <div className="dx-field" style={{display:"inline-block",marginTop:"30px", width: "100%"}}> 
            <CustomLabelValue props={labelValue.deptId} onSelect={handleChgState} value={dept} readOnly={read}/>
            </div>
          ): null }
          </div>
        </div>
      <div className="buttonContainer" style={buttonContainerStyle}>
          <Button style={buttonStyle} type="danger" text="초기화" onClick={onReset} >입력초기화</Button>
          <Button style={buttonStyle} onClick={onClick} >기초정보 저장</Button>
      </div>
    </div>
  );
};

export default EmpRegist;

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