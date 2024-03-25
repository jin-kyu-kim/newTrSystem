import React, { useState, useEffect } from "react";

import { Button } from "devextreme-react/button";
import {SelectBox} from "devextreme-react/select-box";
import TextBox from "devextreme-react/text-box";

import ApiRequest from "utils/ApiRequest";
import CustomLabelValue from "components/unit/CustomLabelValue";
import MatrlCtCtrtDetailJson from "./MatrlCtCtrtDetailJson.json";

const PymntPlanPopup = ({prjctId}) => {

    const labelValue = MatrlCtCtrtDetailJson.labelValue
    const [matrlPlan, setMatrlPlan] = useState({});
    const [matrlCtrtData, setMatrlCtrtData] = useState({});

    useEffect(() => {
        console.log("프로젝트:", prjctId);

        retrieveMatrlPlan();
    }, []);

    const retrieveMatrlPlan = async () => {
        const param = {
            queryId: "elecAtrzMapper.retrieveMatrlPlan",
            prjctId: prjctId
        }
         try {
            const response = await ApiRequest("/boot/common/queryIdSearch", param);
            console.log(response)
            setMatrlPlan(response)
         } catch (error) {
             console.error(error)
         }

    }

    const selectMatrlPlan = (e) => {
        console.log(e)
        setMatrlCtrtData(e)
    }
    
    const handleChgState = (e) => {
        
    }   


    return (
        <>
            <div className="popup-content">
                <div className="project-regist-content">
                    <div className="project-change-content-inner-left">
                        <div className="dx-fieldset">
                            <div className="dx-field">
                                <div className="dx-field-label">계획 투입 재료비</div>
                                <div className="dx-field-value">
                                    <SelectBox
                                        dataSource={matrlPlan}
                                        displayExpr="matrlPlan"
                                        onSelectionChanged={(e) => selectMatrlPlan(e.selectedItem)}
                                    />
                                </div>
                            </div>
                            <CustomLabelValue props={labelValue.cntrctamount} onSelect={handleChgState} readOnly={true} value={matrlCtrtData.cntrctamount}/>
                            <CustomLabelValue props={labelValue.productNm} onSelect={handleChgState} value={matrlCtrtData.productNm}/>
                            <CustomLabelValue props={labelValue.dlvgdsEntrpsNm} onSelect={handleChgState}  value={matrlCtrtData.dlvgdsEntrpsNm}/>
                            <CustomLabelValue props={labelValue.dtlCn} onSelect={handleChgState} value={matrlCtrtData.dtlCn}/>
                            <CustomLabelValue props={labelValue.untpc} onSelect={handleChgState} value={matrlCtrtData.untpc}/>
                            <CustomLabelValue props={labelValue.qy} onSelect={handleChgState} value={matrlCtrtData.qy}/>
                            <CustomLabelValue props={labelValue.tot} onSelect={handleChgState} value={matrlCtrtData.tot}/>
                            <CustomLabelValue props={labelValue.date} onSelect={handleChgState} value={matrlCtrtData.date}/>
                        </div>
                    </div>
                    <div className="project-change-content-inner-right">
                        <div className="dx-fieldset">
                            <div className="dx-field">
                                <div className="dx-field-value">
                                    <div>adsasdasdadasdadsadqweqw</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div style={{display:"inline-block"}}>
                <Button text="저장"/>
                <Button text="취소"/>
            </div>
        </>
    );

}

export default PymntPlanPopup;