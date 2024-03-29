import React, { useState, useEffect } from "react";

import { Button } from "devextreme-react/button";

import CustomLabelValue from "components/unit/CustomLabelValue";
import CustomEditTable from "components/unit/CustomEditTable";
import MatrlCtCtrtDetailJson from "./MatrlCtCtrtDetailJson.json";


const PymntPlanPopup = ({prjctId, handlePopupVisible, handlePlanData, selectedData}) => {

    console.log("selectedData", selectedData);
    
    const labelValue = MatrlCtCtrtDetailJson.matrlCtrt.labelValue
    const matrlPlanParam = labelValue.matrlPlan
    matrlPlanParam.param.queryId.prjctId = prjctId;

    const { keyColumn, tableColumns } = MatrlCtCtrtDetailJson.matrlCtrt
    const [matrlCtrtData, setMatrlCtrtData] = useState({});
    const [pay, setPay] = useState([]);


    /**
     * console.log useEffect
     */
    useEffect(() => {
        console.log("matrlCtrtData", matrlCtrtData)
    },[matrlCtrtData]);

    useEffect(() => {
        console.log("pay", pay)
    },[pay]);

    useEffect(() => {
        console.log("뭐야 !! ", handlePopupVisible)
    },[handlePopupVisible]);


    /**
     *  부모창에서 전달 된 데이터로 셋팅
     */
    useEffect(() => {
        console.log("먼디",selectedData)
            if(selectedData.matrlCtSn === 0) {
                setMatrlCtrtData({});
                setPay([]);
            }else{
                setMatrlCtrtData(selectedData);
                setPay(selectedData.pay?selectedData.pay:[])
            }
    }, [selectedData]);


    /**
     *  선금, 중도금, 잔금 데이터 핸들링
     */
    const handleData = (payData) => {
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

            //선금
            if(["VTW03201","VTW03202","VTW03203","VTW03204"].includes(payData[i].payCd)){
                if(payData[i].payCd === "VTW03201"){
                    advPayYm = payData[i].payYm.getFullYear() + "" + month;
                }
                advPayAmt += payData[i].payAmt;
            //잔금
            } else if(payData[i].payCd === "VTW03212") {    

                surplusYm = payData[i].payYm.getFullYear() + "" + month;
                surplusAmt = payData[i].payAmt;
            //중도금
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

    /**
     *  입력값 변경시 데이터 핸들링
     */
    const handleChgState = ({name, value}) => {
        setMatrlCtrtData(matrlCtrtData => ({
            ...matrlCtrtData,
            [name]: value
        }));
    } 

    /**
     *  저장 시 밸리데이션 체크 
     */
    const savePlan = (e) => {
        e.preventDefault();
        if(!(matrlCtrtData.payTot > 0)) {
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
                            <CustomLabelValue  props={matrlPlanParam}  value={matrlCtrtData.matrlPlan} onSelect={handleChgState} />
                            <CustomLabelValue props={labelValue.cntrctamount} onSelect={handleChgState} readOnly={true} value={matrlCtrtData.cntrctamount}/>
                            <CustomLabelValue props={labelValue.prductNm} onSelect={handleChgState} value={matrlCtrtData.prductNm}/>
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