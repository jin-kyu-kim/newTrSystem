import React, { useCallback, useEffect, useState } from 'react';
import { Popup } from "devextreme-react/popup";
import { Button } from 'devextreme-react/button';
import { parse, addMonths, subMonths  } from 'date-fns';

import CustomTable from 'components/unit/CustomTable';

import ElecAtrzCtrtOutordHnfJson from "./ElecAtrzCtrtOutordHnfJson.json";
import PymntPlanOutordHnfPopup from "./PymntPlanOutordHnfPopup";

import ApiRequest from "utils/ApiRequest";

/**
 * data : 해당 전자결제 문서에 대한 데이터
 * prjctId : 해당 프로젝트 ID
 * onSendData : 부모창으로 데이터 전송 위한 함수
 */
const ElecAtrzCtrtOutordHnfDetail = ({data, prjctId, onSendData, prjctData, sttsCd, ctrtTyCd }) => {

    const ctrtYmd = prjctData.ctrtYmd;
    const stbleEndYmd = prjctData.stbleEndYmd; 
    let monthlyData = [];
    const [popupVisible, setPopupVisible] = useState(false);
    const [tableData, setTableData] = useState([]);                 //그리드 전체 데이터
    const [selectedData, setSelectedData] = useState({});           //선택된 행의 데이터
    const [summaryTableData, setSummaryTableData] = useState([]);    //요약 데이터
    let tableColumns = ElecAtrzCtrtOutordHnfJson.tableColumns;

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


  /*
    *상태코드에 따른 버튼 변경
    */
    if(["VTW03702","VTW03703","VTW03704","VTW03705","VTW03706","VTW03707"].includes(sttsCd)
       || ["VTW04911","VTW04912","VTW04913","VTW04914",].includes(data.elctrnAtrzTySeCd)){
        tableColumns = tableColumns.filter(item => item.value !== '삭제');

        tableColumns = tableColumns.map((item) => {
                        if(item.value === "수정"){
                            return {
                                ...item,
                                button:{
                                    ...item.button,
                                    text: "상세"
                                }
                            };
                        }
                        return item;
                    });
    }


   /* =========================  월별 데이터 생성  =========================*/
    const makeMonthlyData = (start, end) => {      
        const startData = start ? subMonths(parse(start, 'yyyyMMdd', new Date()), 1) : subMonths(new Date(), 1);
        const endData = end ? addMonths(parse(end, 'yyyyMMdd', new Date()), 1) : addMonths(start, 16);

        const result = [{ "key": "atrzStepCdNm", "value": "구분", "fixed": true},
                        { "key": "mm", "value": "총MM", "fixed": true},
                        { "key": "total", "value": "총합계",  "fixed": true, "currency": true,}
                    ];

        let currentDate = new Date(startData);
        while (currentDate <= endData) {
            const yearMonth = `${currentDate.getFullYear()}${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`;
            const formattedYearMonth = `${currentDate.getFullYear()}.${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`;
            result.push({ value: formattedYearMonth,
                subColumns: [
                        { key: `mm-${yearMonth}`, value: "MM"},
                        { key: `cash-${yearMonth}`, value: "업체금액", "currency": true},
                        { key: `indvcash-${yearMonth}`, value: "개인금액", "currency": true}
                ]
            })

            summaryColumn.push(
                { key: `mm-${yearMonth}`, value: `mm-${yearMonth}`, type: "sum", format: "총 {0} MM", precision: 2,  },
                { key: `cash-${yearMonth}`, value: `cash-${yearMonth}`, type: "sum", format: "총 {0} 원", precision: 0 },
                { key: `indvcash-${yearMonth}`, value: `indvcash-${yearMonth}`, type: "sum", format: "총 {0} 원", precision: 0 }
            )

            currentDate.setMonth(currentDate.getMonth() + 1);
        }
        return result;
    }
    
    if(ctrtYmd && stbleEndYmd){
        monthlyData = makeMonthlyData(ctrtYmd, stbleEndYmd);
    }


    /* =========================  임시저장 조회  =========================*/
    useEffect(() => {
        /* 임시저장 조회 */
        if(sttsCd === "VTW03701") {
            getTempData();
        /* 전자결재 목록 조회 */
        }else if(["VTW03702","VTW03703","VTW03704","VTW03705"].includes(sttsCd)) {
            getTempData();
        }
        /* 지급 조회 */
        else if(["VTW03405"].includes(sttsCd)){   
            getTempData();
        } else if(sttsCd === "VTW05407") {
            getTempData();
        }
    }, [data.ctrtElctrnAtrzId])

    

    const getTempData = async () => {
        const dtlParam = {
            queryId: "elecAtrzMapper.retrieveOutorHnfDtl",
            elctrnAtrzId: data.ctrtElctrnAtrzId ? data.ctrtElctrnAtrzId : data.elctrnAtrzId,
            elctrnAtrzTySeCd: ctrtTyCd ? ctrtTyCd : data.elctrnAtrzTySeCd
        };
        const dtlResponse = await ApiRequest("/boot/common/queryIdSearch", dtlParam);
    
        const dtlCndParam = [
            { tbNm: "HNF_CTRT_DTL_MM" },
            { elctrnAtrzId: data.ctrtElctrnAtrzId ? data.ctrtElctrnAtrzId : data.elctrnAtrzId }
        ];
    
        const dtlCndResponse = await ApiRequest("/boot/common/commonSelect", dtlCndParam);
    
        const result = dtlResponse.map((ctrtItem) => {
            const hnfCtrtDtlMmItems = dtlCndResponse
                .filter((hnfItem) => hnfItem.inptHnfId === ctrtItem.inptHnfId)
                .map((item) => {
                    const { elctrnAtrzId, inptHnfId, inptYm, ...rest } = item;
                    return {
                        ...rest,
                        id: inptYm
                    };
                });
    
            return {
                ...ctrtItem,
                hnfCtrtDtlMm: hnfCtrtDtlMmItems
            };
        });
    
        handlePopupData(result);
    };



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
    const handlePopupData = (dataArray) => {
        const newDataArray = Array.isArray(dataArray) ? dataArray : [dataArray];
        const updatedTableData = [...tableData];
    
        newDataArray.forEach((data) => {
            const existingIndex = updatedTableData.findIndex(
                (item) => item.entrpsCtrtDtlSn === data.entrpsCtrtDtlSn
            );
    
            if (existingIndex >= 0) {
                updatedTableData[existingIndex] = data;
            } else {
                const maxSn = updatedTableData.length > 0 ? Math.max(...updatedTableData.map(item => item.entrpsCtrtDtlSn || 0)) : 0;
                data.entrpsCtrtDtlSn = maxSn + 1;
                updatedTableData.push(data);
            }
        });
        setTableData(updatedTableData);
    };


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
                    acc[groupKey].total += (mmItem.entrpsGiveCtrtAmt || 0)+(mmItem.indvdlGiveCtrtAmt || 0);
                    if (!acc[groupKey][`mm-${mmItem.id}`]) {
                        acc[groupKey][`mm-${mmItem.id}`] = 0; 
                    }
                    if (!acc[groupKey][`cash-${mmItem.id}`]) {
                        acc[groupKey][`cash-${mmItem.id}`] = 0; 
                    }
                    if (!acc[groupKey][`indvcash-${mmItem.id}`]) {
                        acc[groupKey][`indvcash-${mmItem.id}`] = 0; 
                    }
                    acc[groupKey][`mm-${mmItem.id}`] += mmItem.mm;
                    acc[groupKey][`indvcash-${mmItem.id}`] += mmItem.indvdlGiveCtrtAmt || 0 ;
                    if(mmItem.entrpsGiveCtrtAmt){
                        acc[groupKey][`cash-${mmItem.id}`] += mmItem.entrpsGiveCtrtAmt || 0;
                    }
                    
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
        
        if(onSendData){
            onSendData(newData);
        }
    }, [tableData]);


    /* =========================  화면 표출  =========================*/
    return (
        <div>
            {summaryTableData && monthlyData && summaryColumn &&
            <CustomTable
                keyColumn={"key"}
                columns={monthlyData}
                values={summaryTableData}
                pagerVisible={false}
                summary={true}
                summaryColumn={summaryColumn}
                scrolling={true}
                wordWrap={true}
            />
            }

            <div style={{ textAlign: "right", margin:"10px" }}>
                {(!["VTW03702","VTW03703","VTW03704","VTW03705","VTW03706","VTW03707","VTW03405"].includes(sttsCd)) && (
                        !["VTW04911","VTW04912","VTW04913","VTW04914",].includes(data.elctrnAtrzTySeCd) 
                    ) && (
                    <Button name="insert" onClick={()=>handlePopupVisible({name:"insert"})}>{ElecAtrzCtrtOutordHnfJson.insertButton}</Button>
                )}
            </div>

            <CustomTable
                keyColumn={ElecAtrzCtrtOutordHnfJson.keyColumn}
                columns={tableColumns}
                values={tableData ? tableData : []}
                pagerVisible={false}
                onClick={handlePopupVisible}
                summary={true}
                summaryColumn={ElecAtrzCtrtOutordHnfJson.summaryColumn}
                scrolling={true}
                wordWrap={true}
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
                    data={data}
                    sttsCd={sttsCd}
                    ctrtTyCd={ctrtTyCd}
                />
            </Popup>
        </div>
    );
}

export default ElecAtrzCtrtOutordHnfDetail;