import { useMemo, useEffect, useState } from "react";
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
  const [param, setParam] = useState([]);
  const [showButton, setShowButton] = useState(false);
  const [cookies, setCookie] = useCookies(["userInfo", "userAuth"]);
  const empId = cookies.userInfo.empId;
  
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
    const date = new Date();
    const now =  date.toISOString().split("T")[0] +" " +date.toTimeString().split(" ")[0];

    if(deptId === undefined && isNew){
        setData({
        ...data,
        deptId: uuid(),
        endYn: "N",
        regEmpId : empId,
        regDt: now,
      });
    } else if(deptId !=null && !isNew){
        // deptInfoHandle();
        console.log(deptId)
        console.log(deptInfo);
      //setData(deptInfo);
    }
  }, [deptId]);
  
  //deptInfo 값이 변경되고 나서 setData함수가 실행되게 하는 useEffect
  useEffect(() => {
    if (deptInfo.deptId !== undefined) {
      setData(deptInfo);
    }
  }, [deptInfo.deptId]);

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
    const isconfirm = window.confirm("신규부서 등록을 하시겠습니까?"); 
    if (isconfirm) {
      if(isNew){
        insertDept();
      }
    } else{
      return;
    }
  };

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
            <CustomLabelValue
              props={labelValue.deptNm}
              onSelect={handleChgState}
              value={data.deptNm}
              readOnly={readOnly}
            />
            <CustomLabelValue
              props={labelValue.upDeptNm}
              onSelect={handleChgState}
              value={data.upDeptId}
              readOnly={readOnly}
            />
            <CustomLabelValue
              props={labelValue.deptMngrEmpFlnm}
              onSelect={handleChgState}
              value={data.deptMngrEmpFlnm}
              readOnly={true}
            />
            <CustomLabelValue
              props={labelValue.deptBgngYmd}
              onSelect={handleChgState}
              value={data.deptBgngYmd}
              readOnly={readOnly}
            />
            <CustomLabelValue
              props={labelValue.deptEndYmd}
              onSelect={handleChgState}
              value={data.deptEndYmd}
              readOnly={readOnly}
            />
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
