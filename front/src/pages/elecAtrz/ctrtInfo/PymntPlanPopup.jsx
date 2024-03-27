import React, { useState, useEffect } from "react";

import { Button } from "devextreme-react/button";
import {SelectBox} from "devextreme-react/select-box";
import TextBox from "devextreme-react/text-box";

import ApiRequest from "utils/ApiRequest";
import CustomLabelValue from "components/unit/CustomLabelValue";
import CustomEditTable from "components/unit/CustomEditTable";
import MatrlCtCtrtDetailJson from "./MatrlCtCtrtDetailJson.json";


const PymntPlanPopup = ({prjctId, handlePopupVisible}) => {
    
    const labelValue = MatrlCtCtrtDetailJson.matrlCtrt.labelValue
    const { keyColumn, tableColumns } = MatrlCtCtrtDetailJson.matrlCtrt
    const [matrlPlan, setMatrlPlan] = useState({});
    const [matrlCtrtData, setMatrlCtrtData] = useState({});
    const [pay, setPay] = useState([]);

    const matrlCtrt = {};

    useEffect(() => {

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
        setMatrlCtrtData(e);
    }
    
    const handleChgState = ({name, value}) => {
        setMatrlCtrtData({
            ...matrlCtrtData,
            [name]: value
        })
    } 

    const handleData = async (payData) => {
        console.log(payData)
        setPay(payData)

        for(let i = 0; i < payData.length; i++) {
            
            console.log(

                payData[i].payYmd
            )
        }

        setMatrlCtrtData({
            ...matrlCtrtData,
            payData
        })
    }

    const test = async () => {
        console.log(matrlCtrtData)
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
                            <CustomLabelValue props={labelValue.prductNm} onSelect={handleChgState} value={matrlCtrtData.prductNm}/>
                            <CustomLabelValue props={labelValue.dlvgdsEntrpsNm} onSelect={handleChgState}  value={matrlCtrtData.dlvgdsEntrpsNm}/>
                            <CustomLabelValue props={labelValue.dtlCn} onSelect={handleChgState} value={matrlCtrtData.dtlCn}/>
                            <CustomLabelValue props={labelValue.untpc} onSelect={handleChgState} value={matrlCtrtData.untpc}/>
                            <CustomLabelValue props={labelValue.qy} onSelect={handleChgState} value={matrlCtrtData.qy}/>
                            <CustomLabelValue props={labelValue.tot} onSelect={handleChgState} value={matrlCtrtData.tot}/>
                            <CustomLabelValue props={labelValue.date} onSelect={handleChgState} value={matrlCtrtData.date}/>
                        </div>
                    </div>
                    <div className="project-change-content-inner-right">
                        <CustomEditTable 
                            keyColumn={keyColumn} 
                            columns={tableColumns} 
                            allowEdit={true}
                            values={pay}
                            handleData={handleData}
                        />
                    </div>
                </div>
                <div>
                    <Button text="저장" onClick={test}/>
                    <Button text="취소" onClick={handlePopupVisible}/>
                </div>
            </div>

        </>
    );

}

export default PymntPlanPopup;