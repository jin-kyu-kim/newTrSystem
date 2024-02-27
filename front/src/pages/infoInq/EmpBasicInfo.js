
import React, { useEffect, useState } from 'react';
import ApiRequest from '../../utils/ApiRequest';
import CustomHorizontalTable from "../../components/unit/CustomHorizontalTable";
//import CustomLabelValue from "../../../components/unit/CustomLabelValue";
import CustomCdComboBox from "../../components/unit/CustomCdComboBox";
import Button from "devextreme-react/button";
import EmpInfoJson from "./EmpInfoJson.json";
import DataGrid, { Column, Editing } from 'devextreme-react/data-grid';
import { Item, Form, SimpleItem, GroupItem} from 'devextreme-react/form';
import { useCookies } from "react-cookie";
import { Group } from 'devextreme-react/cjs/diagram';

const EmpBasicInfo = () => {
    const [baseInfoData, setBaseInfoData] = useState([]);
    const [dtlInfoData, setDtlInfoData] = useState([]);
    const [outPutData, setOutPutData] = useState([]);

    const empBasicInfoJson = EmpInfoJson.EmpBasicInfo;

    /*유저세션*/
    const [cookies, setCookie] = useCookies(["userInfo", "userAuth"]);
    
    const empId = cookies.userInfo.empId;
    /* 기본 정보 */
    useEffect(() => {
      const baseData = async () => {
        const param = [
          {tbNm : "EMP"},
          {
            empId : empId
          }
        ];
        try{
          const response = await ApiRequest("/boot/common/commonSelect", param);
          delete response[0].regDt;
          delete response[0].regEmpId;
          setBaseInfoData(response[0]);
        } catch(error){
          console.error('Error fetching data', error);
        }
      };
      baseData();
    }, []);

    /* 상세 정보 */
    useEffect(() => {
      const detailData = async () => {
        const param = [
          {tbNm : "EMP_DTL"},
          {
            empId : empId
          }
        ];
        try{
          const response = await ApiRequest("/boot/common/commonSelect", param);
          delete response[0].regDt;
          delete response[0].regEmpId;
          setDtlInfoData(response[0]);
        } catch(error){
          console.error('Error fetching data', error);
        }
      };
      detailData();
    }, []);

    /* 저장 버튼 클릭*/
    const onClick = () => {
      //validationInq();
      handleFieldDataChanged();
    }

    /*변경데이터*/
    const handleFieldDataChanged = (e) => {
      transFromChgData();
    };

    /* 유효성 검사*/
    const validationInq = () => {
      
    }
    /*저장 데이터 가공*/
    const transFromChgData = () => {
      console.log(outPutData);
      /*
      const updateData = () => {

      }
      */
    }


    const updateDataTranform = () => {
      const param = [
        { tbNm: "EMP"},
        {
          brdt: "19880818",
          telno: "01045671234",
          eml: "test@test.co.kr"
        },
        {
          empId: "202160c6-bf25-11ee-b259-000c2956283f"
        }
      ]

      return param;
    }

    const updatePersonInfo = async () => {
      const param = updateDataTranform();
      console.log("도달");
      try{
        const response = await ApiRequest("/boot/common/commonUpdate", param);
        if(response > 0){
            window.alert("성공 등록!");
        }
      }catch(error){
        console.error('Error fetching data', error);
      }
    }


    return (
      <div style={{padding: '20px'}}>
      <div className='container'>
      <div>
      <p><strong>* 직원 기본정보 테스트</strong></p>
        <React.Fragment>
          <Form colCount={2} FieldDataChanged={handleFieldDataChanged} formData = {outPutData}>
                <GroupItem>
                  <GroupItem caption="직원 기본정보01">
                    <Item label = {{text : '성명'}} dataField="empFlnm" editorOptions={{ value: baseInfoData.empFlnm }}/>
                    <Item label = {{text : '전화번호'}} dataField="telno" editorOptions={{ value: baseInfoData.telno }}/>
                  </GroupItem>
                </GroupItem>
                <GroupItem>
                  <GroupItem caption="직원 기본정보02">
                  <Item label = {{text : '소속'}} dataField="소속" editorOptions={{ value: baseInfoData.telno }}/>
                  <Item label = {{text : '이메일'}} dataField="eml" editorOptions={{ value: baseInfoData.eml }}/>
                  </GroupItem>
                </GroupItem>
                <GroupItem>
                  <GroupItem caption="직원 상세정보02">
                    <Item label = {{text : '영문'}} dataField="engFlnm" editorOptions={{ value: dtlInfoData.engFlnm }}/>
                    <Item label = {{text : '생년월일'}} dataField="brdt" editorOptions={{ value: dtlInfoData.brdt }}/>
                    <Item label = {{text : '전화번호'}} dataField="telno" editorOptions={{ value: dtlInfoData.telno }}/>
                    <Item label = {{text : '기본주소'}} dataField="bassAddr" editorOptions={{ value: dtlInfoData.bassAddr }}/>
                    <Item label = {{text : '병역'}} dataField="armyKndCd" editorOptions={{ value: dtlInfoData.armyKndCd }}/>
                    <Item label = {{text : '군별'}} dataField="" editorOptions={{ value: dtlInfoData.telno }}/>
                    <Item label = {{text : '복무기간'}} dataField="" editorOptions={{ value: dtlInfoData.telno }}/>
                    <Item label = {{text : '키'}} dataField="height" editorOptions={{ value: dtlInfoData.height }}/>
                    <Item label = {{text : '혈액형'}} dataField="bdpCd" editorOptions={{ value: dtlInfoData.bdpCd }}/>
                    <Item label = {{text : '수정직원id'}} dataField="mdfcnEmpId" editorOptions={{ value: dtlInfoData.mdfcnEmpId }}/>
                  </GroupItem>
                </GroupItem>
                <GroupItem>
                  <GroupItem caption="직원 상세정보03">
                    <Item label = {{text : '한자'}} dataField="chcrtFlnm" editorOptions={{ value: dtlInfoData.chcrtFlnm }}/>
                    <Item label = {{text : '성별'}} dataField="sexdstnCd" editorOptions={{ value: dtlInfoData.sexdstnCd }}/>
                    <Item label = {{text : '이메일'}} dataField="eml" editorOptions={{ value: dtlInfoData.eml }}/>
                    <Item label = {{text : '상세주소'}} dataField="daddr" editorOptions={{ value: dtlInfoData.daddr }}/>
                    <Item label = {{text : '면제사유'}} dataField="armyExmptnCn" editorOptions={{ value: dtlInfoData.armyExmptnCn }}/>
                    <Item label = {{text : '병과'}} dataField="mryfrSpcablCn" editorOptions={{ value: dtlInfoData.mryfrSpcablCn }}/>
                    <Item label = {{text : '계급'}} dataField="dmblzClssCd" editorOptions={{ value: dtlInfoData.dmblzClssCd }}/>
                    <Item label = {{text : '몸무게'}} dataField="bdwgh" editorOptions={{ value: dtlInfoData.bdwgh }}/>
                    <Item label = {{text : '신체특이사항'}} dataField="bdyPartclrCn" editorOptions={{ value: dtlInfoData.bdyPartclrCn }}/>
                    <Item label = {{text : '수정일시'}} dataField="mdfcnDt" editorOptions={{ value: dtlInfoData.mdfcnDt }}/>
                  </GroupItem>
                </GroupItem>
          </Form>
            <div style={{ marginTop: '10px' }}>
              <Button text="저장" onClick={onClick} />
            </div>

         </React.Fragment>
        &nbsp;
      </div>
    </div>
    </div>
    );
  };
export default EmpBasicInfo;