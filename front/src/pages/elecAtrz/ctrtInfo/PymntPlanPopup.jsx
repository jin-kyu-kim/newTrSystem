import React, { useState, useEffect } from "react";

import { Button } from "devextreme-react/button";
import {SelectBox} from "devextreme-react/select-box";
import TextBox from "devextreme-react/text-box";

import ApiRequest from "utils/ApiRequest";
import CustomLabelValue from "components/unit/CustomLabelValue";
import CustomEditTable from "components/unit/CustomEditTable";
import MatrlCtCtrtDetailJson from "./MatrlCtCtrtDetailJson.json";


const PymntPlanPopup = ({prjctId, handlePopupVisible, handlePlanData}) => {
    
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
        setMatrlCtrtData(matrlCtrtData => ({
            ...matrlCtrtData,
            [name]: value
        }));
    } 


    const handleData = async (payData) => {
        console.log(payData)
        setPay(payData)
        let advPayYm = "";
        let advPayAmt = 0;
        let surplusYm = "";
        let surplusAmt = 0;
        let prtPayYm = "";
        let prtPayAmt = 0;


        for(let i = 0; i < payData.length; i++) {
            console.log(payData[i].payCd)
            console.log(payData[i].payYm.getFullYear());
            console.log(payData[i].payYm.getMonth() + 1);

            let month
            if(payData[i].payYm.getMonth() + 1 < 10) {
                month = "0" + (payData[i].payYm.getMonth() + 1)
            }

            if(payData[i].payCd === "VTW03201") {

                advPayYm = payData[i].payYm.getFullYear() + "" + month;
                advPayAmt = payData[i].payAmt;
            } else if(payData[i].payCd === "VTW03212") {

                surplusYm = payData[i].payYm.getFullYear() + "" + month;
                surplusAmt = payData[i].payAmt;

            } else  {
                if(payData[i].payCd === "VTW03202") {
                    prtPayYm = payData[i].payYm.getFullYear() + "" + month;
                }
                prtPayAmt += payData[i].payAmt;
            }

        }

        setMatrlCtrtData({
            ...matrlCtrtData,
            pay,
            "advPayYm": advPayYm,
            "advPayAmt": advPayAmt,
            "surplusYm": surplusYm,
            "surplusAmt": surplusAmt,
            "prtPayYm": prtPayYm,
            "prtPayAmt": prtPayAmt,
            "payTot": advPayAmt + surplusAmt + prtPayAmt
        })

    }

    const savePlan = async (e) => {
        e.preventDefault();
        if(!matrlCtrtData.payTot > 0) {
            alert("지불 총액은 0 이상 입력해야 합니다.");
            return;
        }

        handlePlanData(matrlCtrtData);
        handlePopupVisible();
    }

    return (
        <>
            <form onSubmit={savePlan}>
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
                                <CustomLabelValue props={labelValue.dlvgdsYmd} onSelect={handleChgState} value={matrlCtrtData.dlvgdsYmd}/>
                                <CustomLabelValue props={labelValue.payTot} onSelect={handleChgState} readOnly={true} value={matrlCtrtData.payTot}/>
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
                        <Button text="저장" useSubmitBehavior={true}/>
                        <Button text="취소" onClick={handlePopupVisible}/>
                    </div>
                </div>

            </form>
        </>
    );

}

export default PymntPlanPopup;