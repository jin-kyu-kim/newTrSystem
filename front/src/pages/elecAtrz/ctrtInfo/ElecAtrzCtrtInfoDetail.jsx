import React, { useEffect, useState, useCallback, useRef } from "react";
import { Popup } from "devextreme-react/popup";
import { Button } from "devextreme-react";

import CustomTable from "../../../components/unit/CustomTable";
import ElecAtrzMatrlCtJson from "./ElecAtrzMatrlCtJson.json";
import ElecAtrzOutordCompanyJson from "./ElecAtrzOutordCompanyJson.json";
import PymntPlanPopup from "./PymntPlanPopup"

/**
 *  "VTW04908" : 외주인력
 *  "VTW04909" : 외주업체
 *  "VTW04910" : 재료비
 */
const ElecAtrzCtrtInfoDetail = ({data, prjctId, onSendData }) => {
    
    const [popupVisible, setPopupVisible] = useState(false);
    const [tableData, setTableData] = useState([]);                 //그리드 전체 데이터
    const [selectedData, setSelectedData] = useState({});           //선택된 행의 데이터
    
    let jsonData = {};
    if(data.elctrnAtrzTySeCd === "VTW04910"){
        jsonData = ElecAtrzMatrlCtJson
    }
    else if (data.elctrnAtrzTySeCd === "VTW04909"){
        jsonData = ElecAtrzOutordCompanyJson
    }
    const {keyColumn, tableColumns, summaryColumn, insertButton} = jsonData;

    /**
     * console.log useEffect
     */
    useEffect(() => {
        console.log(popupVisible);
    }, [popupVisible]);

    useEffect(() => {
        console.log(tableData);
    }, [tableData]);

    /**
     *  날짜데이터 포멧팅
     */
    function formatDateToYYYYMM(date) {
        let year = date.getFullYear().toString();
        let month = (date.getMonth() + 1).toString().padStart(2, '0'); 
        return year + month;
    }

    /**
     *  부모창으로 데이터 전송
     */
    useEffect(() => {

        //pay 배열에 tbNm 추가
        const updatedTableData = tableData.map(item => ({
            ...item,
            pay: [{ tbNm: 'ENTRPS_CTRT_DTL_CND' }, ...item.pay.map(payItem => ({ ...payItem }))]
        }));
        
        //테이블 배열에 tbNm 추가
        let newData;
        newData = [{ tbNm: 'ENTRPS_CTRT_DTL' }, ...updatedTableData];

        //pay데이터의 날짜 데이터 포멧팅
        newData.forEach(item => {
            if (!item.pay || item.pay.length === 0) return;
            item.pay.forEach(element => {
                if (!element.ctrtYmd) return;
                element.ctrtYmd = formatDateToYYYYMM(element.ctrtYmd);
            });
        });

        onSendData(newData);
    }, [tableData]);


    /**
     *  Table 버튼 handling
     */
    const handlePopupVisible = useCallback((button, data) => {

        if(button.name === "insert") {  //update인 경우도 추가해야함 .
            setPopupVisible(prev => !prev);
            // setSelectedData(data);
        }else if(button.name === "delete"){
            if(data.entrpsCtrtDtlSn != 0){
                setTableData(currentTableData => currentTableData.filter(item => item.entrpsCtrtDtlSn !== data.entrpsCtrtDtlSn));
            }
        }else if(button.name === "update"){
            setPopupVisible(prev => !prev);
            setSelectedData(data);
        }      

    },[popupVisible]);

    const closePopupVisible = useCallback(() => {
        setPopupVisible(false);
        setSelectedData({});
    },[]);


    const handlePopupData = (data) => {
        const existingIndex = tableData.findIndex(item => item.entrpsCtrtDtlSn === data.entrpsCtrtDtlSn);

        if(existingIndex >=0){
            const updatedData = [...tableData];
            updatedData[existingIndex] = data;
            setTableData(updatedData);
        } else {
            const maxSn = tableData.length > 0 ? Math.max(...tableData.map(item => item.entrpsCtrtDtlSn || 0)) : 0;
            data.entrpsCtrtDtlSn = maxSn + 1;     
            setTableData(prev => [...prev, data]);
        }
    }

    
    /**
     *  화면 표출
     */
    return (
        <div className="elecAtrzNewReq-ctrtInfo">
            <div style={{ textAlign: "right", marginBottom:"10px" }}>
                <Button name="insert" onClick={()=>handlePopupVisible({name:"insert"})}>{insertButton}</Button>
            </div>
           <CustomTable
            keyColumn={keyColumn}
            columns={tableColumns}
            values={tableData}
            pagerVisible={false}
            summary={true}
            summaryColumn={summaryColumn}
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
                <PymntPlanPopup 
                    prjctId={prjctId} 
                    handlePopupVisible={closePopupVisible} 
                    handlePlanData={handlePopupData} 
                    selectedData={selectedData}
                    data={data}
                />
            </Popup>
        </div>
    );

}
export default ElecAtrzCtrtInfoDetail;