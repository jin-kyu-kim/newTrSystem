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


    /* 기본 정보 */
    useEffect(() => {
    
      baseData();
      empInfoCnt();
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

  const empInfoCnt = async () => {
    const selectParams = {
      queryId: "infoInqMapper.selectEmpInfoCnt",
      empId: empId,
    };
    try {
      const response = await ApiRequest(
        "/boot/common/queryIdSearch",
        selectParams
      );
      console.log(response);
      if (response.length !== 0) {
        setEmpCnt(response[0].cnt);
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateEmpInfo = async () => {
    const dtlConfirmResult = window.confirm("직원정보를 저장하시겠습니까?");

    if (dtlConfirmResult) {
      if (empDtlData.srvicBgngYmd >= empDtlData.srvicEndYmd) {
        window.alert(
          "복무종료일자가 복무시작날짜와 같거나 복무종료일자가 더 큽니다."
        );
        return;
      }

      if (empCnt === 0) {
        const params = [{ tbNm: "EMP_DTL" }, empDtlData];
        try {
          console.log("params:", params);
          const response = await ApiRequest(
            "/boot/common/commonInsert",
            params
          );

          if (response === 1) {
            
            window.alert("직원정보가 저장 되었습니다.");
            window.scroll(0, 0);
            // empInfoCnt();
          } else {
            // 저장 실패 시 처리
          }
        } catch (error) {
          console.log(error);
        }
      } else if (empCnt === 1) {
        const params = [{ tbNm: "EMP_DTL" }, empDtlData, { empId: empId }];
        try {
          console.log("params:", params);
          const response = await ApiRequest(
            "/boot/common/commonUpdate",
            params
          );
          console.log(response);
          console.log(response[0]);

          if (response === 1) {
            window.alert("직원정보가 저장 되었습니다.");
            window.scroll(0, 0);
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
      <div className="container" style={{ width : "35%", padding: "20px" ,backgroundColor: "#fff" }}>
          <p >
            <strong>* 비밀번호 변경</strong>
          </p>
          <Form colCount={1}>
              <GroupItem>
                <Item dataField="현재 비밀번호" ratio={1}>
                  <TextBox
                    width="100%"
                    placeholder="현재 비밀번호"
                    stylingMode="filled"
                    size="large"
                    mode="password"
                    name="engFlnm"
                    onValueChanged={(e) =>
                      handleChgState({
                        name: e.component.option("name"),
                        value: e.value,
                      })
                    }
                  />
                </Item>
                <Item
                
                   dataField="새 비밀번호"
                  ratio={1}
                >
                  <TextBox
                    width="100%"
                    mode="password"
                    placeholder="새 비밀번호"
                    stylingMode="filled"
                    size="large"
                    name="bassAddr"
                    onValueChanged={(e) =>
                      handleChgState({
                        name: e.component.option("name"),
                        value: e.value,
                      })
                    }
                  />
                </Item>
                <Item
                  dataField="비밀번호 확인"
                  ratio={1}
                >
                  <TextBox
                    width="100%"
                    mode="password"
                    placeholder="비밀번호 확인"
                    stylingMode="filled"
                    size="large"
                    name="bdyPartclrCn"
                    onValueChanged={(e) =>
                      handleChgState({
                        name: e.component.option("name"),
                        value: e.value,
                      })
                    }
                  />
                </Item>
              
            </GroupItem>
          
          </Form>
          <div style={{ marginTop: "10px", marginLeft: "275px" }}>
            <Button   type="default" text="저장" onClick={updateEmpInfo} />
         
          </div>
        </div>
      </div>

    
  );
};
export default EmpBasicInfo;