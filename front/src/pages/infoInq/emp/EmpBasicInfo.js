
import React, { useEffect, useState } from 'react';
import ApiRequest from '../../../utils/ApiRequest';
import CustomHorizontalTable from "../../../components/unit/CustomHorizontalTable";
//import CustomLabelValue from "../../../components/unit/CustomLabelValue";
import CustomCdComboBox from "../../../components/unit/CustomCdComboBox";
import Button from "devextreme-react/button";
import EmpBasicInfoJson from "./EmpBasicInfoJson.json";
import DataGrid, { Column, Editing } from 'devextreme-react/data-grid';
import { Form, SimpleItem} from 'devextreme-react/form';
import { useCookies } from "react-cookie";

const EmpBasicInfo = () => {
    const [baseInfoData, setBaseInfoData] = useState([]);
    const [dtlInfoData, setDtlInfoData] = useState([]);
    const[data, setData] = useState([]);

    const empBasicInfoJson = EmpBasicInfoJson;

    /*유저세션*/
    const [cookies, setCookie] = useCookies(["userInfo", "userAuth"]);
    
    const empId = cookies.userInfo.empId;
    const deptId = cookies.userInfo.deptId;

    /* 기본 정보 */
    useEffect(() => {
      const baseData = async () => {
        const param = [
          {tbNm: "EMP"},
          {
            empId : "202160c6-bf25-11ee-b259-000c2956283f"
          }
        ];
        try{
          const response = await ApiRequest("/boot/common/commonSelect", param);
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
            empId : "202160c6-bf25-11ee-b259-000c2956283f"
          }
        ];
        try{
          const response = await ApiRequest("/boot/common/commonSelect", param);
          setDtlInfoData(response[0]);
        } catch(error){
          console.error('Error fetching data', error);
        }
      };
      detailData();
    }, []);
    
    /**/
    useEffect(() => {

    })

    /*리팩토링 예정*/
    /*태그부분들 리팩토링 예정*/
    const dtlData = empBasicInfoJson.DtlInfo.reduce((result, header, index) => {
      if (index % 2 === 0) {
        result.push({
          header: header.value,
          Header: header.key,
          column : dtlInfoData?.[header.key] ?? "",
          header1: empBasicInfoJson.DtlInfo[index + 1]?.value,
          Header1: empBasicInfoJson.DtlInfo[index + 1]?.key,
          column1 : dtlInfoData?.[empBasicInfoJson.DtlInfo[index + 1]?.key] ?? "",
        });
      }
      return result;
    }, []);
    /*리팩토링 예정*/

    /* 데이터 가공 하여 출력하는 함수 만들기*/
    const dataTransForm = () => {

    }

    /*화면 가공*/

    /* 저장 버튼 클릭*/
    const onClick = () => {
      //validationInq();
      const isconfirm = window.confirm("개인정보를 수정 하시겠습니까?");
      if(isconfirm){
        updatePersonInfo();
      }
    }

    /* 유효성 검사*/
    const validationInq = () => {

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

    /*수정*/ 
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
        <p><strong>* 직원 기본정보</strong></p>
        <CustomHorizontalTable headers={empBasicInfoJson.BaseInfo} column={baseInfoData}/>
        &nbsp;
        <p><strong>* 직원 상세정보</strong></p>
        <DataGrid
          dataSource={dtlData}
          showBorders={true}
          showColumnHeaders={false} // 최상단 헤더를 숨기는 설정
          showRowLines={true}       // 로우마다 분할 선을 보이도록 설정
          showColumnLines={false}    // 컬럼마다 분할 선을 보이도록 설정
          onCellPrepared={(e) => {
            if (e.columnIndex === 0 || e.columnIndex === 2) {
              e.cellElement.style.textAlign = 'center';
              e.cellElement.style.fontWeight = 'bold';
              e.cellElement.style.cursor = 'default';
              e.cellElement.style.color ='black'
              e.cellElement.style.backgroundColor = '#e9ecef'
            }
            if (e.columnIndex === 2 && e.value === '') {
              e.cellElement.style.textAlign = 'center';
              e.cellElement.style.fontWeight = 'bold';
              e.cellElement.style.cursor = 'default';
              e.cellElement.style.color ='black'
              e.cellElement.style.backgroundColor = 'white'
              e.cellElement.style.pointerEvents = 'none';
          }
          }}   
        >
          <Column dataField="header" caption="Header" alignment="center" />
          <Column 
            dataField="column" 
            caption="Column" 
            cellTemplate = {(container, options) => {
              const input = document.createElement('input');
              input.type = 'text';
              input.value = options.value;
              container.appendChild(input);
            }
          } 
          />
          <Column dataField="header1" caption="Header1" alignment="center" />
          <Column 
            dataField="column1" 
            caption="Column1" 
            cellTemplate = {(container, options) => {
              const input = document.createElement('input');
              input.type = 'text';
              input.value = options.value;
              container.appendChild(input);
            }
          } 
          />
        </DataGrid>
      </div>
      <div style={{padding: '20px', textAlign : 'center'}}>
        <Button text="저장" onClick={onClick} textAlign = "center"/>
      </div>
    </div>
    );
  };
export default EmpBasicInfo;