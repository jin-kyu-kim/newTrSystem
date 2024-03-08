
import React, { useEffect, useState } from 'react';
import ApiRequest from '../../utils/ApiRequest';
import 'devextreme-react/text-area';
import Button from "devextreme-react/button";
import EmpInfoJson from "./EmpInfoJson.json";
import { Item, Form, SimpleItem, GroupItem, Label, FormTypes,} from 'devextreme-react/form';
import { useCookies } from "react-cookie";
import { Group } from 'devextreme-react/cjs/diagram';
import CustomCdComboBox from 'components/unit/CustomCdComboBox';
import { DateBox } from 'devextreme-react';

const EmpBasicInfo = () => {
    const [baseInfoData, setBaseInfoData] = useState([]);
    const [dtlInfoData, setDtlInfoData] = useState([]);
    const [outPutData, setOutPutData] = useState([]);

    const empBasicInfoJson = EmpInfoJson.EmpBasicInfo;

    /*유저세션*/
    const [cookies, setCookie] = useCookies(["userInfo", "userAuth"]);
    
    // const empId = cookies.userInfo.empId;
    const empId = '202160c6-bf25-11ee-b259-000c2956283f';
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

    const handleChgState = ({ name, value }) => {
      // setInitParam({
      //   ...initParam,
      //   [name]: value
      // });
      // setData({
      //   ...data,
      //   [name]: value
      // });
      // setParam({
      //   queryId: queryId,
      //   empId: userEmpId
      // });
    };

    return (
      <div style={{padding: '20px'}}>
      <div className='container'>
      <div>
      <p><strong>* 직원 기본정보</strong></p>
     
          <Form colCount={2} FieldDataChanged={handleFieldDataChanged} formData = {outPutData}>
                <GroupItem>
                  <GroupItem caption="">
                    <Item label = {{text : '성명'}} dataField="empFlnm" editorOptions={{ value: baseInfoData.empFlnm  , readOnly : true}} />
                    <Item label = {{text : '전화번호'}} dataField="telno" editorOptions={{ value: baseInfoData.telno , readOnly : true }}/>
                    <Item label = {{text : '생년월일'}} dataField="brdt" editorOptions={{ value: baseInfoData.brdt,  readOnly : true }}/>
                 
                  </GroupItem>
                </GroupItem>
                    
                <GroupItem>
                  <GroupItem caption="">
                  <Item label = {{text : '소속'}} dataField="소속" editorOptions={{ value: baseInfoData.telno  , readOnly : true}}/>
                  <Item label = {{text : '이메일'}} dataField="eml" editorOptions={{ value: baseInfoData.eml  , readOnly : true}}/>
                  
                  </GroupItem>
                </GroupItem>
               

          </Form>
          <p style={{marginTop: "30px"}}><strong>* 직원 상세정보</strong></p>
          <Form colCount={2} FieldDataChanged={handleFieldDataChanged} formData = {outPutData}>
          
          <GroupItem>
                  <GroupItem >
                    <Item label = {{text : '영문'}} dataField="engFlnm" editorOptions={{ value: dtlInfoData.engFlnm}}/>
                    <Item label = {{text : '기본주소'}} dataField="bassAddr" editorOptions={{ value: dtlInfoData.bassAddr }}/>
                    <Item label = {{text : '병역'}} className="prjctNameItem" ratio={1}>
                      <CustomCdComboBox param="VTW021" placeholderText="[병역]" name="pntPscoreSeCd" value={dtlInfoData.mtrscCd} onSelect={handleChgState} />
                   </Item>
                   <Item label = {{text : '군별'}} className="prjctNameItem" ratio={1}>
                      <CustomCdComboBox param="VTW022" placeholderText="[군별]" name="pntPscoreSeCd" value = {dtlInfoData.armyKndCd} onSelect={handleChgState}  />
                   </Item>
                    <Item label = {{text : '복무기간'}}className="ctmmnyNameItem" ratio={1} >
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <DateBox
                        type="date"
                        displayFormat="yyyy-MM-dd"
                        placeholder="복무시작일"
                        name="eduBgngYmd"
                        width="50%" // DateBox의 너비를 조절할 수 있습니다.
                        value = {dtlInfoData.srvicBgngYmd}
                      />
                      <DateBox
                        type="date"
                        displayFormat="yyyy-MM-dd"
                        placeholder="복무종료일"
                        name="eduBgngYmd"
                        width="50%" // DateBox의 너비를 조절할 수 있습니다.
                        value = {dtlInfoData.srvicEndYmd}
                      />
      </div>
                    </Item>
                    <Item label = {{text : '키'}} dataField="height" editorOptions={{ value: dtlInfoData.height }} />
                    <Item label = {{text : '혈액형'}} className="prjctNameItem" ratio={1} >
                      <CustomCdComboBox param="VTW024" placeholderText="[혈액형]" name="pntPscoreSeCd" onSelect={handleChgState} value={dtlInfoData.bdpCd}/>
                   </Item>
                   <Item label = {{text : '신체특이사항'}} dataField="bdyPartclrCn" editorOptions={{ value: dtlInfoData.bdyPartclrCn }}/>  

                  </GroupItem>
                </GroupItem>
                <GroupItem>
                  <GroupItem >
                    <Item label = {{text : '한자'}} dataField="chcrtFlnm" editorOptions={{ value: dtlInfoData.chcrtFlnm }}/>
                    <Item label = {{text : '상세주소'}} dataField="daddr" editorOptions={{ value: dtlInfoData.daddr }}/>
                    <Item label = {{text : '성별'}} className="prjctNameItem" ratio={1}>
                      <CustomCdComboBox param="VTW020" placeholderText="[성별]" name="pntPscoreSeCd" onSelect={handleChgState}  value = {dtlInfoData.sexdstnCd} />
                   </Item>
                    <Item label = {{text : '면제사유'}} dataField="armyExmptnCn" editorOptions={{ value: dtlInfoData.armyExmptnCn }}/>
                    <Item label = {{text : '병과'}} dataField="mryfrSpcablCn" editorOptions={{ value: dtlInfoData.mryfrSpcablCn }}/>
                    <Item label = {{text : '계급'}} dataField="dmblzClssCd" editorOptions={{ value: dtlInfoData.dmblzClssCd }}/>
                    <Item label = {{text : '몸무게'}} dataField="bdwgh" editorOptions={{ value: dtlInfoData.bdwgh }}/>
                  </GroupItem>
                </GroupItem>
          
          
          </Form>
            <div style={{ marginTop: '10px' }}>
              <Button text="저장" onClick={onClick} />
            </div>
        &nbsp;
      </div>
    </div>
    </div>
    );
  };
export default EmpBasicInfo;