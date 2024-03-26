import React, { useEffect, useState, useCallback } from "react";
import CustomTable from "../../../components/unit/CustomTable";
import ElecAtrzMatrlCtDetailJson from "./ElecAtrzMatrlCtDetailJson.json";

import { Popup } from "devextreme-react/popup";
import PymntPlanPopup from "./PymntPlanPopup"


const ElecAtrzCtrtInfoDetail = ({prjctId}) => {
    const {keyColumn, tableColumns} = ElecAtrzMatrlCtDetailJson;
    const [popupVisible, setPopupVisible] = useState(false);

    console.log("keyColumn", keyColumn);

    useEffect(() => {
        console.log(popupVisible);
    }, [popupVisible]);


    const values = [{matrlCtSn: "0"}];  //그리드 기본 값


    /**
     *  Table 버튼 handling
     */
    const handlePopupVisible = useCallback((button, data) => {
        if(button.name === "insert") {
            setPopupVisible(prev => !prev);
        }else if(button.name === "delete"){
            console.log("삭제!!!!!!!!!!", data);
        }       
    },[popupVisible]);

    const toglePopupVisible = useCallback(() => {
        setPopupVisible(prev => !prev);
    },[]);


    /**
     *  화면 표출
     */
    return (
        <div className="elecAtrzNewReq-ctrtInfo">
           <CustomTable
            keyColumn={keyColumn}
            columns={tableColumns}
            values={values}
            pagerVisible={false}
            summary={false}
            onClick={handlePopupVisible}
            />

            <Popup
                width="80%"
                height="80%"
                visible={popupVisible}
                onHiding={toglePopupVisible}
                showCloseButton={true}
                title="지불 계획 입력"
            >
                <PymntPlanPopup prjctId={prjctId}/>
            </Popup>
        </div>
    );

}
export default ElecAtrzCtrtInfoDetail;