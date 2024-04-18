import React, { useCallback, useEffect, useState } from 'react';
import { Popup } from "devextreme-react/popup";
import CustomTable from 'components/unit/CustomTable';
import ElecAtrzCtrtOutordHnfJson from "./ElecAtrzCtrtOutordHnfJson.json";
import PymntPlanOutordHnfPopup from "./PymntPlanOutordHnfPopup";

import { Button } from 'devextreme-react/button';

/**
 * data : 해당 전자결제 문서에 대한 데이터
 * prjctId : 해당 프로젝트 ID
 * onSendData : 부모창으로 데이터 전송 위한 함수
 */
const ElecAtrzCtrtOutordHnfDetail = ({data, prjctId, onSendData, prjctData }) => {
    // console.log("data",data);
    // console.log("prjctId",prjctId);
    // console.log("prjctData",prjctData);
    const ctrtYmd = prjctData.ctrtYmd;
    const stbleEndYmd = prjctData.stbleEndYmd; 
    let monthlyData = [];
    const [popupVisible, setPopupVisible] = useState(false);
    const [tableData, setTableData] = useState([]);                 //그리드 전체 데이터
    const [selectedData, setSelectedData] = useState({});           //선택된 행의 데이터

    useEffect(() => {
        console.log("tableData",tableData);
    },[tableData]);


   /* =========================  월별 데이터 생성  =========================*/
    const makeMonthlyData = (start, end) => {
        const startData = new Date(start.substring(0, 4), start.substring(4, 6) - 1, start.substring(6, 8));
        const endData = new Date(end.substring(0, 4), end.substring(4, 6) - 1, end.substring(6, 8));

        const result = [{ "key": "atrzStepCdNm", "value": "구분"},
                        { "key": "total", "value": "총합계"}
                    ];

        let currentDate = new Date(startData);
        while (currentDate <= endData) {
            const yearMonth = `${currentDate.getFullYear()}.${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`;

            result.push({ value: yearMonth,
                subColumns: [
                        { key: `mm-${yearMonth}`, value: "MM"},
                        { key: `cash=${yearMonth}`, value: "금액"}
                ]
            })

            currentDate.setMonth(currentDate.getMonth() + 1);
        }
        // console.log("result",result);
        return result;
    }
    
    if(ctrtYmd && stbleEndYmd){
        monthlyData = makeMonthlyData(ctrtYmd, stbleEndYmd);
    }


    /* =========================  Table 버튼 handling  =========================*/
    const handlePopupVisible = useCallback((button, data) => {

        if(button.name === "insert") {  
            setPopupVisible(prev => !prev);

        }else if(button.name === "delete"){
            if(data.inptHnfId != 0){
                setTableData(currentTableData => currentTableData.filter(item => item.inptHnfId !== data.inptHnfId));
            }
        }else if(button.name === "update"){
            setPopupVisible(prev => !prev);
            setSelectedData(data);
        }      

    },[]);

    /* =========================  PopUp 제어  =========================*/
    /**
     * Popup 닫기
     */
    const closePopupVisible = useCallback(() => {
        setPopupVisible(false);
        setSelectedData({});
    },[]);

    /**
     * Popup data 처리
     */
    const handlePopupData = (data) => {
        console.log("data",data);
        const existingIndex = tableData.findIndex(item => item.inptHnfId === data.inptHnfId);
        if(existingIndex >=0){
            const updatedData = [...tableData];
            updatedData[existingIndex] = data;
            setTableData(updatedData);
        } else {
            console.log(tableData.length)
            const maxSn = tableData.length > 0 ? Math.max(...tableData.map(item => item.inptHnfId || 0)) : 0;
            data.inptHnfId = maxSn + 1;  
            setTableData(prev => [...prev, data]);
        }
    }

    /* =========================  부모창으로 데이터 전송  =========================*/
    useEffect(() => {

        //pay 배열에 tbNm 추가
        // const updatedTableData = tableData.map(item => ({
        //     ...item,
        //     pay: [{ tbNm: 'ENTRPS_CTRT_DTL_CND' }, ...item.pay.map(payItem => ({ ...payItem }))]
        // }));
        
        //테이블 배열에 tbNm 추가
        let newData;
        newData = [{ tbNm: 'HNF_CTRT_DTL' }, ...tableData];

        //pay데이터의 날짜 데이터 포멧팅
        // newData.forEach(item => {
        //     if (!item.pay || item.pay.length === 0) return;
        //     item.pay.forEach(element => {
        //         if (!element.ctrtYmd) return;
        //         element.ctrtYmd = formatDateToYYYYMM(element.ctrtYmd);
        //     });
        // });

        console.log("newData", newData)
        onSendData(newData);
    }, [tableData]);


    /* =========================  화면 표출  =========================*/
    return (
        <div>
            <CustomTable
                keyColumn={"test"}
                columns={monthlyData}
                values={""}
                pagerVisible={false}
                />
            <div style={{ textAlign: "right", marginBottom:"10px" }}>
                <Button name="insert" onClick={()=>handlePopupVisible({name:"insert"})}>{ElecAtrzCtrtOutordHnfJson.insertButton}</Button>
            </div>
            <CustomTable
                keyColumn={ElecAtrzCtrtOutordHnfJson.keyColumn}
                columns={ElecAtrzCtrtOutordHnfJson.tableColumns}
                values={tableData}
                pagerVisible={false}
                onClick={handlePopupVisible}
                />

            <Popup
                width="80%"
                height="80%" 
                visible={popupVisible}
                onHiding={closePopupVisible}
                showCloseButton={true}
                title="지불 계획 입력"
            >
                <PymntPlanOutordHnfPopup 
                    prjctId={prjctId} 
                    handlePopupVisible={closePopupVisible} 
                    ctrtYmd={ctrtYmd}
                    stbleEndYmd={stbleEndYmd}
                    handlePopupData={handlePopupData} 
                    selectedData={selectedData}
                    // data={data}
                />
            </Popup>

        </div>
    );
    }

export default ElecAtrzCtrtOutordHnfDetail;