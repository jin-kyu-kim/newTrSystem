import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import CustomTable from "components/unit/CustomTable";
import EmpInfoJson from "./EmpInfoJson.json";
import TextBox from "devextreme-react/text-box";
import Box, { Item } from "devextreme-react/box";
import { Button } from "devextreme-react/button";
import CustomCdComboBox from "../../components/unit/CustomCdComboBox";
import ApiRequest from "utils/ApiRequest";
import CustomDateRangeBox from "components/unit/CustomDateRangeBox";
import { useCookies } from "react-cookie";
import { DateBox } from "devextreme-react";
import NumberBox from "devextreme-react/number-box";

const EmpDegree = ({ callBack, props }) => {
  const [cookies] = useCookies(["userInfo", "userAuth"]);
 
  const userEmpId = cookies.userInfo.empId;
  const [param, setParam] = useState({});
  const [data, setData] = useState({empId: userEmpId, mtcltnYr: null, grdtnYr: null});
// 이 부분은 초기화할 값으로 설정하셔야 합니다.

  const { queryId, keyColumn, tableColumns } = EmpInfoJson.EmpDegree;
  const [values, setValues] = useState([]);

  useEffect(() => {
    console.log("유저정보는?"+userEmpId);
    // if (!Object.values(param).every((value) => value === "")) {
    // pageHandle();
    //  }
    setParam({
      ...param,
      queryId: queryId,
      //empId: "202160c6-bf25-11ee-b259-000c2956283f",
      empId: data.empId,
    // });
    });
  }, []);

  const [initParam, setInitParam] = useState({
    
    acbgSeCd: "",
    schlNm: "",
    majorIntltshNm: "",
    grdtnSttsCd: "",
    pntPscoreSeCd: "",
    scre: "",
    mtcltnYr: "",
    grdtnYr: ""
  });

  // const handleStartDateChange = (newStartDate) => {

  //   // 시작일자가 변경될 때 수행할 로직 추가
  //   setInitParam({
  //     ...initParam,
  //     mtcltnYr: newStartDate,
  //     placeholder: "입학일"
  //   });
  //   setData({
  //     ...data,
      
  //     grdtnYr: newStartDate
      


  //   });
    
  // };

  // const handleEndDateChange = (newEndDate) => {

  //   // 종료일자가 변경될 때 수행할 로직 추가
  //   setInitParam({
  //     ...initParam,
  //     grdtnYr: newEndDate


  //   });
  //   setData({
  //     ...data,
  //     grdtnYr: newEndDate


  //   });
  // };

  const handleSubmit = () => {
    //callBack(initParam);
  };
  const handleClear = () => {
    setInitParam({
      acbgSeCd: "",
      schlNm: "",
      majorIntltshNm: "",
      grdtnSttsCd: "",
      pntPscoreSeCd: "",
      scre: "",
      mtcltnYr: "",
      grdtnYr: ""
    });

  };

  const handleChgState = ({ name, value }) => {
    setInitParam({
      ...initParam,
      [name]: value,
    });

    setParam({
      queryId: queryId
    })
    setData({
      empId:userEmpId,
      [name]: value
    })
  };

  const pageHandle = async () => {


    try {

      const response = await ApiRequest("/boot/common/queryIdSearch", param);
      setValues(response);
      if (response.length !== 0) {
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };

  const acbgInsert = async () => {
    console.log("data : "+data.empId)
    const params = [{ tbNm: "EMP_ACBG" }, data
    ]
    try {

      const response = await ApiRequest("/boot/common/commonInsert", params);
      console.log(response);
      if (response.length !== 0) {
      } else {
      }
    } catch (error) {
      console.log(error);
    }

  }

  useEffect(() => {
    pageHandle();
  }, [param.empId]);

  return (
    <div className="container" style={{ height: "700px" }}>
      <div className="title p-1" style={{ marginTop: "20px", marginBottom: "10px" }}>
        <h1 style={{ fontSize: "40px" }}>학력</h1>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <CustomTable keyColumn={keyColumn} columns={tableColumns} values={values} paging={true} queryId={queryId} />
      </div>
      <div style={{ marginBottom: "20px", backgroundColor: "#eeeeee", width: "100%", height: "300px", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ width: "95%", height: "250px" }}>
          <h5>학력을 입력/수정 합니다.</h5>
          <Box direction="row" width="50%" height={40}>
            <Item className="prjctNameItem" ratio={1}>
              <CustomCdComboBox param="VTW025" placeholderText="[학교구분]" name="acbgSeCd" onSelect={handleChgState} value={initParam.acbgSeCd} />
            </Item>
            <Item className="prjctNameItem" ratio={1}>
              <TextBox placeholder="학교명" stylingMode="filled" size="medium" name="schlNm" value={initParam.schlNm} onValueChanged={(e) => handleChgState({ name: e.component.option("name"), value: e.value })} />
            </Item>
            <Item className="prjctNameItem" ratio={1}>
              <TextBox placeholder="전공(계열)" stylingMode="filled" size="large" name="majorIntltshNm" value={initParam.majorIntltshNm} onValueChanged={(e) => handleChgState({ name: e.component.option("name"), value: e.value })} />
            </Item>
          </Box>
          <br />
          <Box direction="row" width="90%" height={40}>
            <Item className="prjctNameItem" ratio={1}>
              <CustomCdComboBox param="VTW026" placeholderText="[졸업구분]" name="grdtnSttsCd" onSelect={handleChgState} value={initParam.grdtnSttsCd} />
            </Item>
            <Item className="prjctNameItem" ratio={1}>
              <CustomCdComboBox param="VTW027" placeholderText="[학점 만점]" name="pntPscoreSeCd" onSelect={handleChgState} value={initParam.pntPscoreSeCd} />
            </Item>
            <Item className="prjctNameItem" ratio={1}>
              <TextBox placeholder="성적" stylingMode="filled" size="large" name="scre" value={initParam.scre} onValueChanged={(e) => handleChgState({ name: e.component.option("name"), value: e.value })} />
            </Item>
            <Item className="prjctDatePickerItem" ratio={1} >
            <NumberBox
                showSpinButtons={true}
                format="#"
                name = "mtcltnYr"
                min={1900} // 최소 연도
                max={9999} // 최대 연도 (현재 연도)
                step={1} // 연도가 1씩 증가/감소하도록 설정
                value={initParam.mtcltnYr}
                onValueChanged={(e) => handleChgState({ name: e.component.option("name"), value: e.value })}
                placeholder="입학년도"
          />
            </Item>
          
            <Item className="prjctDatePickerItem" ratio={2} >
            <NumberBox
                showSpinButtons={true}
                format="#"
                name = "grdtnYr"
                min={1900} // 최소 연도
                max={9999} // 최대 연도 (현재 연도)
                step={1} // 연도가 1씩 증가/감소하도록 설정
                value={initParam.grdtnYr}
                onValueChanged={(e) => handleChgState({ name: e.component.option("name"), value: e.value })}
                placeholder="졸업년도"
                width="50%"
          />
            </Item>
          </Box>
          <Box style={{ marginTop: "30px", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Item className="searchBtnItem" width="10%" ratio={1}  >
              <Button onClick={acbgInsert} text="저장" />
            </Item>
            <Item className="searchBtnItem" width="10%" ratio={1} >
              <Button onClick={handleClear} text="초기화" />
            </Item>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default EmpDegree;