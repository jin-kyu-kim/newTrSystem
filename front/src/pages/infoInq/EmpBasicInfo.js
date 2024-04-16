import React, { useEffect, useState } from "react";
import ApiRequest from "../../utils/ApiRequest";
import "devextreme-react/text-area";
import Button from "devextreme-react/button";
import {
  Item,
  Form,
  GroupItem,
} from "devextreme-react/form";
import { useCookies } from "react-cookie";
import CustomCdComboBox from "components/unit/CustomCdComboBox";
import { DateBox, NumberBox, TextBox } from "devextreme-react";

const EmpBasicInfo = ({naviEmpId}) => {
  const [baseInfoData, setBaseInfoData] = useState([]);
  /*유저세션*/
  const [cookies, setCookie] = useCookies(["userInfo", "userAuth"]);

   let empId;

    if(naviEmpId.length !== 0){
        empId = naviEmpId;
    } else {
        empId = cookies.userInfo.empId;
    }

  const [empCnt, setEmpCnt] = useState(0);

  const [empDtlData, setEmpDtlData] = useState([]);

  const formatDate = (value) => {
    if (value instanceof Date) {
      const year = value.getFullYear();
      const month = (value.getMonth() + 1).toString().padStart(2, "0");
      const day = value.getDate().toString().padStart(2, "0");

      return `${year}${month}${day}`;
    } else {
      const parsedDate = new Date(value);
      const year = parsedDate.getFullYear();
      const month = (parsedDate.getMonth() + 1).toString().padStart(2, "0");
      const day = parsedDate.getDate().toString().padStart(2, "0");

      return `${year}${month}${day}`;
    }
  };

  const baseData = async () => {
    const param = {
      queryId: "infoInqMapper.retrieveEmpBassInfo",
      empId: empId,
    };
    
    try {
      const response = await ApiRequest("/boot/common/queryIdSearch", param);
      delete response[0].regDt;
      delete response[0].regEmpId;
      setBaseInfoData(response[0]);
    
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };
  const empInfoCnt = async () => {
    const selectParams = {queryId: "infoInqMapper.selectEmpInfoCnt", empId: empId};
    try {
      const response = await ApiRequest(
        "/boot/common/queryIdSearch",    selectParams);
      if (response.length !== 0) {
        setEmpCnt(response[0].cnt);
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };

    /* 기본 정보 */
    useEffect(() => {
      setEmpDtlData ({
        ...empDtlData,
        empId: empId,
        
      });
      empInfoCnt();
      baseData();
    
 }, []);

 useEffect(() => {
    
  detailData();
}, [baseInfoData]);

  const handleChgState = ({ name, value }) => {
  
    setEmpDtlData({
      ...empDtlData,
      [name]: value
    });
  };


  const detailData = async () => {
    const param = [
      { tbNm: "EMP_DTL" },
      {
        empId: empId,
      },
    ];
    try {
      const response = await ApiRequest("/boot/common/commonSelect", param);
      delete response[0].regDt;
      delete response[0].regEmpId;
      delete response[0].empId;
      delete response[0].sexdstnCdNm;
      delete response[0].armyKndCdNm;
      delete response[0].mtrscCdNm;
      delete response[0].bdpCdNm;
      delete response[0].dmblzClssCdNm;
      
       setEmpDtlData(response[0]);
      
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };


  const updateEmpInfo = async () => {
    if (empDtlData.srvicEndYmd !=null && empDtlData. srvicEndYmd!='' &&empDtlData.srvicBgngYmd != null && empDtlData.srvicBgngYmd !== '' && empDtlData.srvicBgngYmd >= empDtlData.srvicEndYmd) {
      window.alert(
        "복무종료일자가 복무시작날짜와 같거나 복무종료일자가 더 큽니다."
      );
      return;
    }
    if(empDtlData.engFlnm !='' &&empDtlData.engFlnm != null && empDtlData.engFlnm.length > 30){
     alert ("영문 이름은 30자를 넘을수 없습니다"); 
     return ;
    }
 
    if (!/^[a-zA-Z\s]+$/.test(empDtlData.engFlnm)) {
      alert("영문 이름은 영문자와 공백만 입력 가능합니다.");
      return;
  }
 
if(empDtlData.bassAddr !='' &&empDtlData.bassAddr != null && empDtlData.bassAddr.length > 60){
  alert ("기본주소는 60자를 넘을수 없습니다"); 
  return ;
 }
 if(empDtlData.bdyPartclrCn !='' &&empDtlData.bdyPartclrCn != null && empDtlData.bdyPartclrCn.length > 60){
  alert ("신체 특이사항은 60자를 넘을수 없습니다"); 
  return ;
 }
  if (empDtlData.chcrtFlnm !='' &&empDtlData.chcrtFlnm != null && !/^[\u4E00-\u9FFF\s]+$/.test(empDtlData.chcrtFlnm)) {
    alert("한자이름은 한자와 공백만 입력 가능합니다.");
    return;
}
if(empDtlData.chcrtFlnm !='' &&empDtlData.chcrtFlnm != null && empDtlData.chcrtFlnm.length > 30){
  alert ("한자이름은 30자를 넘을수 없습니다"); 
  return ;
 }

 if(empDtlData.daddr !='' &&empDtlData.daddr != null && empDtlData.daddr.length > 60){
  alert ("상세주소는 60자를 넘을수 없습니다"); 
  return ;
 }
 if(empDtlData.armyExmptnCn !='' &&empDtlData.armyExmptnCn != null && empDtlData.armyExmptnCn.length > 30){
  alert ("면제사유는 30자를 넘을수 없습니다"); 
  return ;
 }
 if(empDtlData.mryfrSpcablCn !='' &&empDtlData.mryfrSpcablCn != null && empDtlData.mryfrSpcablCn.length > 30){
  alert ("병과명은 30자를 넘을수 없습니다"); 
  return ;
 }
 if (empDtlData.height !='' &&empDtlData.height != null &&  !/^\d{1,4}(?:\.\d)?$/.test(empDtlData.height)) {
  alert("키는 정수 3자리와 소수점 첫째 자리까지만 입력 가능합니다.");
  return;
}
if (empDtlData.bdwgh !='' &&empDtlData.bdwgh != null &&  !/^\d{1,4}(?:\.\d)?$/.test(empDtlData.bdwgh)) {
  alert("정수 4자리와 소수점 첫째 자리까지만 입력 가능합니다.");
  return;
}
 


    
    const dtlConfirmResult = window.confirm("직원정보를 저장하시겠습니까?");

    if (dtlConfirmResult) {
    
      if (empCnt == 0) {
        
        const params = [{ tbNm: "EMP_DTL" }, empDtlData];
        try {
          const response = await ApiRequest("/boot/common/commonInsert",  params);
          if (response === 1) {
            
            window.alert("직원정보가 저장 되었습니다.");
            window.location.reload();
          } else {
            // 저장 실패 시 처리
          }
        } catch (error) {
          console.log(error);
        }
      } else if (empCnt == 1) {
        const params = [{ tbNm: "EMP_DTL" }, empDtlData, { empId: empId }];
        try {
          const response = await ApiRequest("/boot/common/commonUpdate", params);

          if (response === 1) {
            window.alert("직원정보가 저장 되었습니다.");
            window.location.reload();
          } else {
            // 저장 실패 시 처리
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  return (
    <div style={{ padding: "20px" ,backgroundColor: "#b5c1c7" }}>
    <div className="container" style={{ padding: "20px" ,backgroundColor: "#fff" }}>
        <div>
          <p>
            <strong>* 직원 기본정보</strong>
          </p>
          <Form colCount={2}>
            <GroupItem>
              <GroupItem >
                <Item
                  dataField="성명"
                  editorOptions={{
                    value: baseInfoData.empFlnm,
                    readOnly: true,
                  }}
                />
                <Item
                  dataField="전화번호"
                  editorOptions={{ value: baseInfoData.telno, readOnly: true }}
                />
                <Item
              
                  dataField="생년월일"
                  editorOptions={{ value: baseInfoData.brdt, readOnly: true }}
                />
              </GroupItem>
            </GroupItem>

            <GroupItem>
              <GroupItem >
                <Item
              
                  dataField="소속"
                  editorOptions={{ value: baseInfoData.deptNm, readOnly: true }}
                />
                <Item
                  dataField="eml"
                  editorOptions={{ value: baseInfoData.eml, readOnly: true }}
                />
              </GroupItem>
            </GroupItem>
          </Form>
          <p style={{ marginTop: "30px" }}>
            <strong>* 직원 상세정보</strong>
          </p>
          <Form colCount={2}>
              <GroupItem>
                <Item dataField="영문" ratio={1}>
                  <TextBox
                    width="100%"
                    placeholder="영문"
                    stylingMode="filled"
                    size="large"
                    name="engFlnm"
                    value={empDtlData.engFlnm}
                    onValueChanged={(e) =>
                      handleChgState({
                        name: e.component.option("name"),
                        value: e.value,
                      })
                    }
                  />
                </Item>
                <Item
                
                   dataField="기본주소"
                  ratio={1}
                >
                  <TextBox
                    width="100%"
                    placeholder="기본주소"
                    stylingMode="filled"
                    size="large"
                    name="bassAddr"
                    value={empDtlData.bassAddr}
                    onValueChanged={(e) =>
                      handleChgState({
                        name: e.component.option("name"),
                        value: e.value,
                      })
                    }
                  />
                </Item>
                <Item
                  className="prjctNameItem"
                  dataField="성별"
                  ratio={1}
                >
                  <CustomCdComboBox
                    param="VTW020"
                    placeholderText="[성별]"
                    name="sexdstnCd"
                    onSelect={handleChgState}
                    value={empDtlData.sexdstnCd}
                  />
                </Item>
                <Item
                   dataField="병역"
                  className="prjctNameItem"
                  ratio={1}
                >
                  <CustomCdComboBox
                    param="VTW021"
                    placeholderText="[병역]"
                    name="mtrscCd"
                    onSelect={handleChgState}
                    value={empDtlData.mtrscCd}
                  />
                </Item>

                <Item
                   dataField="군별"
                  className="prjctNameItem"
                  ratio={1}
                >
                  <CustomCdComboBox
                    param="VTW022"
                    placeholderText="[군별]"
                    name="armyKndCd"
                    value={empDtlData.armyKndCd}
                    onSelect={handleChgState}
                   
                  
                  />
                </Item>

               

                <Item
                  dataField="계급"
                  ratio={1}
                >
                  <CustomCdComboBox
                    param="VTW023"
                    placeholderText="[계급]"
                    name="dmblzClssCd"
                    onSelect = {handleChgState}
                    value={empDtlData.dmblzClssCd}
                  
                  />
                </Item>

                <Item
                  dataField="혈액형"
                  ratio={1}
                >
                  <CustomCdComboBox
                    param="VTW024"
                    placeholderText="[혈액형]"
                    name="bdpCd"
                    onSelect={handleChgState}
                    value={empDtlData.bdpCd}
                  />
                </Item>

                <Item
                  dataField="신체특이사항"
                  ratio={1}
                >
                  <TextBox
                    width="100%"
                    placeholder="신체특이사항"
                    stylingMode="filled"
                    size="large"
                    name="bdyPartclrCn"
                    value={empDtlData.bdyPartclrCn}
                    onValueChanged={(e) =>
                      handleChgState({
                        name: e.component.option("name"),
                        value: e.value,
                      })
                    }
                  />
                </Item>
              
            </GroupItem>
            <GroupItem>
                <Item  dataField="한자" ratio={1}>
                  <TextBox
                    width="100%"
                    placeholder="한자"
                    stylingMode="filled"
                    size="large"
                    name="chcrtFlnm"
                    value={empDtlData.chcrtFlnm}
                    onValueChanged={(e) =>
                      handleChgState({
                        name: e.component.option("name"),
                        value: e.value,
                      })
                    }
                  />
                </Item>
                                 
                <Item   dataField="상세주소" ratio={1}>
                  <TextBox
                    width="100%"
                    placeholder="상세주소"
                    stylingMode="filled"
                    size="large"
                    name="daddr"
                    value={empDtlData.daddr}
                    onValueChanged={(e) =>
                      handleChgState({
                        name: e.component.option("name"),
                        value: e.value,
                      })
                    }
                  />
                </Item>

              
                <Item
                  dataField="면제사유"
                  ratio={1}
                >
                  <TextBox
                    width="100%"
                    placeholder="면제사유"
                    stylingMode="filled"
                    size="large"
                    name="armyExmptnCn"
                    value={empDtlData.armyExmptnCn}
                    onValueChanged={(e) =>
                      handleChgState({
                        name: e.component.option("name"),
                        value: e.value,
                      })
                    }
                  />
                </Item>
                <Item
                 
                  dataField="병과"
                  ratio={1}
                >
                  <TextBox
                    width="100%"
                    placeholder="병과"
                    stylingMode="filled"
                    size="large"
                    name="mryfrSpcablCn"
                    value={empDtlData.mryfrSpcablCn}
                    onValueChanged={(e) =>
                      handleChgState({
                        name: e.component.option("name"),
                        value: e.value,
                      })
                    }
                  />
                </Item>

                <Item
                  label={{ text: "복무기간" }}
                  dataField="복무기간"
                  className="ctmmnyNameItem"
                  ratio={1}
                >
                  <div style={{ display: "flex", gap: "10px" }}>
                    <DateBox
                      type="date"
                      displayFormat="yyyy-MM-dd"
                      placeholder="복무시작일"
                      name="srvicBgngYmd"
                      width="50%" // DateBox의 너비를 조절할 수 있습니다.
                      value={empDtlData.srvicBgngYmd}
                      onValueChanged={(e) =>
                        handleChgState({
                          name: e.component.option("name"),
                          value: formatDate(e.value),
                        })
                      }
                    />
                    <DateBox
                      type="date"
                      displayFormat="yyyy-MM-dd"
                      placeholder="복무종료일"
                      name="srvicEndYmd"
                      width="50%" // DateBox의 너비를 조절할 수 있습니다.
                      value={empDtlData.srvicEndYmd}
                      onValueChanged={(e) =>
                        handleChgState({
                          name: e.component.option("name"),
                          value: formatDate(e.value),
                        })
                      }
                    />
                  </div>
                </Item>
                <Item  dataField="키" ratio={1}>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                    }}
                  >
                    <NumberBox
                      width="100%"
                      placeholder="키"
                      stylingMode="filled"
                      size="large"
                      name="height"
                      value={empDtlData.height}
                      onValueChanged={(e) =>
                        handleChgState({
                          name: e.component.option("name"),
                          value: e.value,
                        })
                      }
                    />
                    cm
                  </div>
                </Item>
                <Item  dataField="몸무게" ratio={1}>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                    }}
                  >
                    <NumberBox
                      width="100%"
                      placeholder="몸무게"
                      stylingMode="filled"
                      size="large"
                      name="bdwgh"
                      value={empDtlData.bdwgh}
                      onValueChanged={(e) =>
                        handleChgState({
                          name: e.component.option("name"),
                          value: e.value,
                        })
                      }
                    />
                    kg
                  </div>
                </Item>
              </GroupItem>
          </Form>
          <div style={{ marginTop: "25px",  marginLeft: "600px" }}>
            <Button text="저장" onClick={updateEmpInfo} type="default" />

         
          </div>
          &nbsp;
        </div>
      </div>
    </div>

    
  );
};

// export default React.memo(EmpBasicInfo);
export default EmpBasicInfo;