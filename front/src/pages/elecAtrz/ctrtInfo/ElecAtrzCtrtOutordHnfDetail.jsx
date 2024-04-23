import React, { useCallback, useEffect, useState } from 'react';
import { Popup } from "devextreme-react/popup";
import { Button } from 'devextreme-react/button';

import CustomTable from 'components/unit/CustomTable';

import ElecAtrzCtrtOutordHnfJson from "./ElecAtrzCtrtOutordHnfJson.json";
import PymntPlanOutordHnfPopup from "./PymntPlanOutordHnfPopup";

/**
 * data : 해당 전자결제 문서에 대한 데이터
 * prjctId : 해당 프로젝트 ID
 * onSendData : 부모창으로 데이터 전송 위한 함수
 */
const ElecAtrzCtrtOutordHnfDetail = ({data, prjctId, onSendData, prjctData }) => {

    const ctrtYmd = prjctData.ctrtYmd;
    const stbleEndYmd = prjctData.stbleEndYmd; 
    let monthlyData = [];
    const [popupVisible, setPopupVisible] = useState(false);
    const [tableData, setTableData] = useState([]);                 //그리드 전체 데이터
    const [selectedData, setSelectedData] = useState({});           //선택된 행의 데이터
    const [summaryTableData, setSummaryTableData] = useState([]);    //요약 데이터

    const summaryColumn = [
        {
          "key": "mm",
          "value": "총MM",
          "type": "sum",
          "format": "총 {0} MM",
          "precision" : 2
        },
        {
          "key": "total",
          "value": "총합계",
          "type": "sum",
          "format": "총 {0} 원"
        }
  ]

   /* =========================  월별 데이터 생성  =========================*/
    const makeMonthlyData = (start, end) => {
        const startData = new Date(start.substring(0, 4), start.substring(4, 6) - 1, start.substring(6, 8));
        const endData = new Date(end.substring(0, 4), end.substring(4, 6) - 1, end.substring(6, 8));

        const result = [{ "key": "atrzStepCdNm", "value": "구분"},
                        { "key": "mm", "value": "총MM"},
                        { "key": "total", "value": "총합계", "currency": true}
                    ];

        let currentDate = new Date(startData);
        while (currentDate <= endData) {
            const yearMonth = `${currentDate.getFullYear()}${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`;
            const formattedYearMonth = `${currentDate.getFullYear()}.${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`;
            result.push({ value: formattedYearMonth,
                subColumns: [
                        { key: `mm-${yearMonth}`, value: "MM"},
                        { key: `cash-${yearMonth}`, value: "금액", "currency": true}
                ]
            })

            summaryColumn.push(
                { key: `mm-${yearMonth}`, value: `mm-${yearMonth}`, type: "sum", format: "총 {0} MM", precision: 2 },
                { key: `cash-${yearMonth}`, value: `cash-${yearMonth}`, type: "sum", format: "총 {0} 원", precision: 0 }
            )

            currentDate.setMonth(currentDate.getMonth() + 1);
        }
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
        const existingIndex = tableData.findIndex(item => item.inptHnfId === data.inptHnfId);
        
        if(existingIndex >=0){
            const updatedData = [...tableData];
            updatedData[existingIndex] = data;
            setTableData(updatedData);
        } else {
            const maxSn = tableData.length > 0 ? Math.max(...tableData.map(item => item.inptHnfId || 0)) : 0;
            data.inptHnfId = maxSn + 1;  
            setTableData(prev => [...prev, data]);
        }
    }

    /* =========================  SummaryTable 데이터 처리  =========================*/
    useEffect(() => {

        if (tableData.length > 0) {
            const newSummaryTableData = tableData.reduce((acc, item) => {
                
                const groupKey = item.outordHnfCtrtSeCd; // 그룹핑 키로 사용될 outordHnfCtrtSeCd
                if (!acc[groupKey]) {                    // 그룹 키가 존재하지 않으면 초기화
                    acc[groupKey] = {
                        atrzStepCdNm: item.outordHnfCtrtSeCdNm,
                        mm: 0,
                        total: 0,
                        key: item.outordHnfCtrtSeCd,
                    };
                }
        
                item.hnfCtrtDtlMm.forEach(mmItem => {
                    
                    acc[groupKey].mm += mmItem.mm;
                    acc[groupKey].total += mmItem.ctrtAmt;
                    if (!acc[groupKey][`mm-${mmItem.id}`]) {
                        acc[groupKey][`mm-${mmItem.id}`] = 0; 
                    }
                    if (!acc[groupKey][`cash-${mmItem.id}`]) {
                        acc[groupKey][`cash-${mmItem.id}`] = 0; 
                    }
                    acc[groupKey][`mm-${mmItem.id}`] += mmItem.mm;
                    acc[groupKey][`cash-${mmItem.id}`] += mmItem.ctrtAmt;
                });
        
                return acc;
            }, {});
        
            setSummaryTableData(prev => {
                const updatedData = Object.values(newSummaryTableData); // 객체의 값을 배열로 변환
                return updatedData;
            });
    }  else {
        setSummaryTableData([]);
    }
    },[tableData]);

    /* =========================  부모창으로 데이터 전송  =========================*/
    useEffect(() => {

        //hnfCtrtDtlMm 배열에 tbNm 추가
        const updatedTableData = tableData.map(item => ({
            ...item,
            hnfCtrtDtlMm: [{ tbNm: 'HNF_CTRT_DTL_MM' }, ...item.hnfCtrtDtlMm.map(mmItem => ({ ...mmItem }))]
        }));
        
        //테이블 배열에 tbNm 추가
        let newData;
        newData = [{ tbNm: 'HNF_CTRT_DTL' }, ...updatedTableData];

        onSendData(newData);
    }, [tableData]);


    /* =========================  화면 표출  =========================*/
    return (
        <div>
            <CustomTable
                keyColumn={"key"}
                columns={monthlyData}
                values={summaryTableData}
                pagerVisible={false}
                summary={true}
                summaryColumn={summaryColumn}
                // smallSummaryColumn={summaryColumn}
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
                summary={true}
                summaryColumn={ElecAtrzCtrtOutordHnfJson.summaryColumn}
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
                    tableData={tableData}
                    // data={data}
                />
            </Popup>
        </div>
    );
}

export default ElecAtrzCtrtOutordHnfDetail;