import React, { useEffect, useState, useCallback, useRef } from "react";
import { Popup } from "devextreme-react/popup";
import { Button } from "devextreme-react";

import CustomTable from "../../../components/unit/CustomTable";
import ElecAtrzMatrlCtDetailJson from "./ElecAtrzMatrlCtDetailJson.json";
import PymntPlanPopup from "./PymntPlanPopup"


const ElecAtrzCtrtInfoDetail = ({data, prjctId, onSendData, childRef }) => {

    const {keyColumn, tableColumns, summaryColumn} = ElecAtrzMatrlCtDetailJson;
    const [popupVisible, setPopupVisible] = useState(false);
    // const [tableData, setTableData] = useState([{matrlCtSn: 0}]);   //그리드 전체 데이터
    const [tableData, setTableData] = useState([]);   //그리드 전체 데이터
    const [selectedData, setSelectedData] = useState({});           //선택된 행의 데이터
    const test = [{'2024.03': "뭐야"}];  //그리드 기본 값
    

    /**
     * console.log useEffect
     */
    useEffect(() => {
        console.log(popupVisible);
    }, [popupVisible]);

    /**
     *  부모창으로 데이터 전송
     */
    useEffect(() => {
        console.log(tableData);
        onSendData(tableData);
        // childRef.current = tableData;
    }, [tableData]);



    /**
     *  Table 버튼 handling
     */
    const handlePopupVisible = useCallback((button, data) => {
        console.log("가긴함?", button)
        console.log("data?", data)

        if(button.name === "insert") {  //update인 경우도 추가해야함 .
            setPopupVisible(prev => !prev);
            // setSelectedData(data);
        }else if(button.name === "delete"){
            if(data.matrlCtSn != 0){
                setTableData(currentTableData => currentTableData.filter(item => item.matrlCtSn !== data.matrlCtSn));
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
        const existingIndex = tableData.findIndex(item => item.matrlCtSn === data.matrlCtSn);

        if(existingIndex >=0){
            const updatedData = [...tableData];
            updatedData[existingIndex] = data;
            setTableData(updatedData);
        } else {
            const maxSn = tableData.length > 0 ? Math.max(...tableData.map(item => item.matrlCtSn || 0)) : 0;
            data.matrlCtSn = maxSn + 1;     
            setTableData(prev => [...prev, data]);
        }
        
    }

    
    /**
     *  화면 표출
     */
    return (
        <div className="elecAtrzNewReq-ctrtInfo">
            <div style={{ textAlign: "right", marginBottom:"10px" }}>
                <Button name="insert" onClick={()=>handlePopupVisible({name:"insert"})}>재료비 추가</Button>
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
                />
            </Popup>
        </div>
    );

}
export default ElecAtrzCtrtInfoDetail;