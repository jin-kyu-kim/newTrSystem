import React, { useState } from "react";

import { Popup } from "devextreme-react/popup";
import { Button } from "devextreme-react/button";

import PymntPlanPopup from "./PymntPlanPopup"

const CompanyCtrtInfo = ({prjctId}) => {
    
    console.log(prjctId)

    const [popupVisible, setPopupVisible] = useState(false);


    /**
     * 팝업 레이어 표시/비표시
     */
    const handlePopupVisible = async () => {
        setPopupVisible(!popupVisible);
    }

    return (
        <>
            <h3>계약 세부 내용</h3>
            <div>CompanyCtrtInfo</div>
            <Button text="추가" onClick={handlePopupVisible}></Button>


            <Popup
                width="80%"
                height="80%"
                visible={popupVisible}
                onHiding={handlePopupVisible}
                showCloseButton={true}
                title="지불 계획 입력"
            >
                <PymntPlanPopup prjctId={prjctId}/>
            </Popup>
        </>
    );
    
}
export default CompanyCtrtInfo;