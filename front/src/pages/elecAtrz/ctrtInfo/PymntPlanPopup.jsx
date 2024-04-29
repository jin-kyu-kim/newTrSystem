import React, { useState, useEffect } from "react";

import { Button } from "devextreme-react/button";

import CustomLabelValue from "components/unit/CustomLabelValue";
import CustomEditTable from "components/unit/CustomEditTable";
import ElecAtrzMatrlCtPopupJson from "./ElecAtrzMatrlCtPopupJson.json";
import ElecAtrzOutordCompanyPopupJson from "./ElecAtrzOutordCompanyPopupJson.json";

/**
 *  "VTW04909" : 외주업체
 *  "VTW04910" : 재료비
 */
const PymntPlanPopup = ({prjctId, handlePopupVisible, handlePlanData, selectedData, data}) => {

    let jsonData = {};
    if(data.elctrnAtrzTySeCd === "VTW04910"){
        jsonData = ElecAtrzMatrlCtPopupJson
    }
    else if (data.elctrnAtrzTySeCd === "VTW04909"){
        jsonData = ElecAtrzOutordCompanyPopupJson
    }

    const labelValue = jsonData.matrlCtrt.labelValue
    const matrlPlanParam = labelValue.matrlPlan
    matrlPlanParam.param.queryId.prjctId = prjctId;

    const { keyColumn, tableColumns } = jsonData.matrlCtrt
    const [matrlCtrtData, setMatrlCtrtData] = useState({});
    const [pay, setPay] = useState([]);


    /**
     * console.log useEffect
     */
    useEffect(() => {
        // console.log("matrlCtrtData", matrlCtrtData)
    },[matrlCtrtData]);

    useEffect(() => {
        // console.log("pay", pay)
    },[pay]);

    useEffect(() => {
        // console.log("뭐야 !! ", handlePopupVisible)
    },[handlePopupVisible]);


    /**
     *  부모창에서 전달 된 데이터로 셋팅
     */
    useEffect(() => {
        
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
        setPay([...payData])
    }

    useEffect(() => {
        let advPayYm = "";
        let advPayAmt = 0;
        let surplusYm = "";
        let surplusAmt = 0;
        let prtPayYm = "";
        let prtPayAmt = 0;

        for(let i = 0; i < pay.length; i++) {

            let month
            if(pay[i].ctrtYmd.getMonth() + 1 < 10) {
                month = "0" + (pay[i].ctrtYmd.getMonth() + 1)
            }

            //선금
            if(["VTW03201","VTW03202","VTW03203","VTW03204"].includes(pay[i].giveOdrCd)){
                if(pay[i].giveOdrCd === "VTW03201"){
                    advPayYm = pay[i].ctrtYmd.getFullYear() + "" + month;
                }
                advPayAmt += pay[i].ctrtAmt;
               
            //잔금
            } else if(pay[i].giveOdrCd === "VTW03212") {    
                surplusYm = pay[i].ctrtYmd.getFullYear () + "" + month;
                surplusAmt = pay[i].ctrtAmt;

            //중도금
            } else  {
                if(pay[i].giveOdrCd === "VTW03202") {  
                    prtPayYm = pay[i].ctrtYmd.getFullYear() + "" + month;
                }
                prtPayAmt += pay[i].ctrtAmt;
            }
        }
        setMatrlCtrtData(prevState => ({
            ...prevState,
            pay,
            "advPayYm": advPayYm,
            "advPayAmt": advPayAmt,
            "surplusYm": surplusYm,
            "surplusAmt": surplusAmt,
            "prtPayYm": prtPayYm,
            "prtPayAmt": prtPayAmt,
            "totAmt": advPayAmt + surplusAmt + prtPayAmt
        }));
    }, [pay]);

    
    /**
     *  입력값 변경시 데이터 핸들링
     */
    const handleChgState = ({name, value}) => {
        console.log(name, value)
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
        if(!(matrlCtrtData.totAmt > 0)) {
            alert("지불 총액은 0 이상 입력해야 합니다.");
            return;
        }

        //지급 총액이 가용금액을 초과할 경우
        if(matrlCtrtData.cntrctamount < matrlCtrtData.totAmt) {
            alert("지불 총액은 계약금액을 초과할 수 없습니다.");
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
                    {data.elctrnAtrzTySeCd === "VTW04910" ? 
                        <div className="dx-fieldset">
                            <CustomLabelValue props={matrlPlanParam}  value={matrlCtrtData.matrlPlan} onSelect={handleChgState} />
                            <CustomLabelValue props={labelValue.cntrctamount} onSelect={handleChgState} readOnly={true} value={matrlCtrtData.cntrctamount}/>
                            <CustomLabelValue props={labelValue.prductNm} onSelect={handleChgState} value={matrlCtrtData.prductNm}/>
                            <CustomLabelValue props={labelValue.dtlCn} onSelect={handleChgState} value={matrlCtrtData.dtlCn}/>
                            <CustomLabelValue props={labelValue.untpc} onSelect={handleChgState} value={matrlCtrtData.untpc}/>
                            <CustomLabelValue props={labelValue.qy} onSelect={handleChgState} value={matrlCtrtData.qy}/>
                            <CustomLabelValue props={labelValue.tot} onSelect={handleChgState} value={matrlCtrtData.untpc*matrlCtrtData.qy}/>
                            <CustomLabelValue props={labelValue.dlvgdsPrnmntYmd} onSelect={handleChgState} value={matrlCtrtData.dlvgdsPrnmntYmd}/>
                            <CustomLabelValue props={labelValue.totAmt} onSelect={handleChgState} readOnly={true} value={matrlCtrtData.totAmt}/>
                        </div> : 
                        <div className="dx-fieldset">
                            <CustomLabelValue props={matrlPlanParam}  value={matrlCtrtData.outordEntrpsNm} onSelect={handleChgState} />
                            <CustomLabelValue props={labelValue.expectCt} onSelect={handleChgState} readOnly={true} value={matrlCtrtData.expectCt}/>
                            <CustomLabelValue props={labelValue.prductNm} onSelect={handleChgState} value={matrlCtrtData.prductNm? matrlCtrtData.prductNm : matrlCtrtData.outordEntrpsNm}/>
                            <CustomLabelValue props={labelValue.tkcgJob} onSelect={handleChgState} value={matrlCtrtData.tkcgJob}/>
                            <CustomLabelValue props={labelValue.inptPrnmntHnfCnt} onSelect={handleChgState} value={matrlCtrtData.inptPrnmntHnfCnt}/>
                            <CustomLabelValue props={labelValue.ctrtBgngYmd} onSelect={handleChgState} value={matrlCtrtData.ctrtBgngYmd}/>
                            <CustomLabelValue props={labelValue.ctrtEndYmd} onSelect={handleChgState} value={matrlCtrtData.ctrtEndYmd}/>
                            <CustomLabelValue props={labelValue.totAmt} onSelect={handleChgState} readOnly={true} value={matrlCtrtData.totAmt}/>
                         </div>
                        }
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