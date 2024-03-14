import {useEffect, useState } from "react";
import uuid from "react-uuid";
import DeptRegistJson from "./DeptRegistJson.json";
import Button from "devextreme-react/button";

import { useCookies } from "react-cookie";
import CustomLabelValue from "components/unit/CustomLabelValue";
import ApiRequest from "utils/ApiRequest";

const DeptRegist = ({ onHide,deptInfo, deptId, isNew }) => {
  const {deptDetailqueryId, labelValue, queryId } = DeptRegistJson;
  const [readOnly, setReadOnly] = useState(true);
  const [data, setData] = useState([]);
  const [deptUdt,setDeptUdt] = useState(false)
  const [param, setParam] = useState([]);
  const [showButton, setShowButton] = useState(false);
  const [cookies, setCookie] = useCookies(["userInfo", "userAuth"]);
  const empId = cookies.userInfo.empId;
  const date = new Date();
  const now =  date.toISOString().split("T")[0] +" " +date.toTimeString().split(" ")[0];

  //부서 상세정보 화면 스타일
  const popupContentInnerStyle = {
    overflow:"hidden",
    marginTop:"-20px"
  };

  const buttonContainerStyle = {
    display: "flex",
    justifyContent: "center",
    margin:"10px"
  };

  const buttonStyle = {
    marginLeft: "10px",
  };


  //deptId 파라미터에 변경이 있을 때 실행되는 함수
  useEffect(() => {
    if(deptId === undefined && isNew){
        setData({
        ...data,
        deptId: uuid(),
        endYn: "N",
        regEmpId : empId,
        regDt: now,
      });
    } else if(deptId !=null){
      setData(deptInfo);
      setDeptUdt(true);
    }
  }, [deptId]);
  
  //deptInfo 값이 변경되고 나서 setData함수가 실행되게 하는 useEffect
  useEffect(() => {
    if (deptInfo !== undefined) {
      setData(deptInfo);
    }
  }, [deptInfo]);

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

  //신규 부서 등록 
  const onClick = () => {
    const isconfirm = window.confirm("부서내역을 등록하시겠습니까?"); 
    if (isconfirm) {
      if(deptUdt){
        console.log("업데이트요")
        updateEmp();
      }else{
        console.log("인서트요")
        if(isNew){
          if(data.deptEndYmd === null){
            setData({
                ...data,
                deptEndYmd : null,
              });
          }
          insertDept();
        }
      }
    } else{
      return;
    }
  };

  const insertDept = async () => {
 
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
 //================부서상세정보 업데이트
 const updateEmp = async () => {
  const paramUdt =[
    { tbNm: "DEPT" },
    {
       deptNm : data.deptNm,
       upDeptId : data.upDeptId,
       deptBgngYmd : data.eml,
       deptEndYmd : data.empFlnm,
       telno : data.telno,
       mdfcnEmpId : empId,
       mdfcnDt: now,
    },
    {
       deptId : data.deptId
    }
]
const paraUdtHnf =[ { tbNm: "DEPT_HNF" },{ deptId: deptInfo.deptId,},{ deptId : data.deptId} ]
  try {
    const response = await ApiRequest("/boot/common/commonUpdate", paramUdt);
    const responseHnf = await ApiRequest("/boot/common/commonUpdate", paraUdtHnf);
      if (response > 0 && responseHnf >0 ) {
        alert("저장되었습니다."); 
        setData({});
        console.log(data);
        //onHide();
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
            <CustomLabelValue props={labelValue.deptNm} onSelect={handleChgState} value={data.deptNm} readOnly={readOnly} />
            <CustomLabelValue props={labelValue.upDeptNm} onSelect={handleChgState} value={data.upDeptId} readOnly={readOnly} />
            <CustomLabelValue props={labelValue.deptMngrEmpFlnm} onSelect={handleChgState} value={data.deptMngrEmpFlnm} readOnly={true} />
            <CustomLabelValue props={labelValue.deptBgngYmd} onSelect={handleChgState} value={data.deptBgngYmd} readOnly={readOnly} />
            <CustomLabelValue props={labelValue.deptEndYmd} onSelect={handleChgState} value={data.deptEndYmd} readOnly={readOnly} />
          </div>
        </div>
      </div>
      <div className="buttonContainer" style={buttonContainerStyle}>
      {showButton? (
        <div>
          <Button text="저장" onClick={onClick} style={buttonStyle}/>
          <Button onClick={onHide} text="취소" style={buttonStyle} />
        </div> 
        ):(
        null
      )}

      </div>
    </div>
  );
};

export default DeptRegist;
