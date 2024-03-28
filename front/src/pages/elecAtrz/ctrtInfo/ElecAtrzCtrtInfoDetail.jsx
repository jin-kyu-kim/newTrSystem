import React, { useEffect, useState, useCallback } from "react";
import CustomTable from "../../../components/unit/CustomTable";
import ElecAtrzMatrlCtDetailJson from "./ElecAtrzMatrlCtDetailJson.json";

import { Popup } from "devextreme-react/popup";
import PymntPlanPopup from "./PymntPlanPopup"


const ElecAtrzCtrtInfoDetail = ({data, prjctId}) => {
    const {keyColumn, tableColumns, summaryColumn} = ElecAtrzMatrlCtDetailJson;
    const [popupVisible, setPopupVisible] = useState(false);
    const [tableData, setTableData] = useState([{matrlCtSn: 0}]);
    const [selectedData, setSelectedData] = useState({});
    const test = [{'2024.03': "뭐야"}];  //그리드 기본 값

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
     *  Table 버튼 handling
     */
    const handlePopupVisible = useCallback((button, data) => {

        if(button.name === "insert") {  //update인 경우도 추가해야함 .
            setPopupVisible(prev => !prev);
            setSelectedData(data);
        }else if(button.name === "delete"){
            if(data.matrlCtSn != 0){
                setTableData(currentTableData => currentTableData.filter(item => item.matrlCtSn !== data.matrlCtSn));
            }
        }       

    },[popupVisible]);

    const closePopupVisible = useCallback(() => {
        setPopupVisible(false);
        setSelectedData({});
    },[]);


    const handlePopupData = (data) => {
        const maxSn = Math.max(...tableData.map(item => item.matrlCtSn));
        data.matrlCtSn = maxSn + 1;     
        setTableData(prev => [...prev, data]);
    }

    
    /**
     *  화면 표출
     */
    return (
        <div className="elecAtrzNewReq-ctrtInfo">
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