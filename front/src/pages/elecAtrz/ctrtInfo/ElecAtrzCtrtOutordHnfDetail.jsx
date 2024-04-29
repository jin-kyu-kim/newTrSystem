import React, { useCallback, useState } from 'react';
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
    console.log("prjctId",prjctId);
    // console.log("prjctData",prjctData);
    const ctrtYmd = prjctData.ctrtYmd;
    const stbleEndYmd = prjctData.stbleEndYmd; 
    let monthlyData = [];
    const [popupVisible, setPopupVisible] = useState(false);

    /*
    *  월별 데이터 생성
    */
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
        // console.log("monthlyData",monthlyData);
    }

        /**
     *  Table 버튼 handling
     */
    const handlePopupVisible = useCallback((button, data) => {

        if(button.name === "insert") {  
            setPopupVisible(prev => !prev);

        }else if(button.name === "delete"){
            if(data.entrpsCtrtDtlSn != 0){
                // setTableData(currentTableData => currentTableData.filter(item => item.entrpsCtrtDtlSn !== data.entrpsCtrtDtlSn));
            }
        }else if(button.name === "update"){
            // setPopupVisible(prev => !prev);
            // setSelectedData(data);
        }      

    },[]);


    /**
     * Popup 제어
     */
    const closePopupVisible = useCallback(() => {
        setPopupVisible(false);
        // setSelectedData({});
    },[]);



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
                keyColumn={"test"}
                columns={ElecAtrzCtrtOutordHnfJson.tableColumns}
                values={""}
                pagerVisible={false}
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
                    // handlePlanData={handlePopupData} 
                    // selectedData={selectedData}
                    // data={data}
                />
            </Popup>

        </div>
    );
    }

export default ElecAtrzCtrtOutordHnfDetail;