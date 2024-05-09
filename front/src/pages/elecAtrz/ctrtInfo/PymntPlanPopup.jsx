import React, { useState, useEffect } from "react";

import { Button } from "devextreme-react/button";

import CustomLabelValue from "components/unit/CustomLabelValue";
import CustomEditTable from "components/unit/CustomEditTable";
import ElecAtrzMatrlCtPopupJson from "./ElecAtrzMatrlCtPopupJson.json";
import ElecAtrzOutordCompanyPopupJson from "./ElecAtrzOutordCompanyPopupJson.json";
import { useModal } from "../../../components/unit/ModalContext";

/**
 *  "VTW04909" : 외주업체
 *  "VTW04910" : 재료비
 */
const PymntPlanPopup = ({prjctId, handlePopupVisible, handlePlanData, selectedData, data, sttsCd, ctrtTyCd, tableData}) => {

    let jsonData = {};
    if((ctrtTyCd ? ctrtTyCd : data.elctrnAtrzTySeCd) === "VTW04910"){
        jsonData = ElecAtrzMatrlCtPopupJson
    }
    else if ((ctrtTyCd ? ctrtTyCd : data.elctrnAtrzTySeCd) === "VTW04909"){
        jsonData = ElecAtrzOutordCompanyPopupJson
    }

    const labelValue = jsonData.matrlCtrt.labelValue
    const matrlPlanParam = labelValue.matrlPlan
    matrlPlanParam.param.queryId.prjctId = prjctId;

    const { keyColumn, tableColumns } = jsonData.matrlCtrt
    const [matrlCtrtData, setMatrlCtrtData] = useState({});
    const [pay, setPay] = useState([]);
    let controlReadOnly = false;
    const { handleOpen } = useModal();
    /**
     *  부모창에서 전달 된 데이터로 셋팅
     */
    useEffect(() => {
        
        setMatrlCtrtData(selectedData);
        setPay(selectedData.pay?selectedData.pay:[])

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
                    // advPayYm = pay[i].ctrtYmd
                }
                advPayAmt += pay[i].ctrtAmt;
               
            //잔금
            } else if(pay[i].giveOdrCd === "VTW03212") {    
                surplusYm = pay[i].ctrtYmd.getFullYear () + "" + month;
                // surplusYm = pay[i].ctrtYmd;
                surplusAmt = pay[i].ctrtAmt;

            //중도금
            } else  {
                if(pay[i].giveOdrCd === "VTW03202") {  
                    prtPayYm = pay[i].ctrtYmd.getFullYear() + "" + month;
                    // prtPayYm = pay[i].ctrtYmd;
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
        // console.log(name, value)
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
            handleOpen("지불 총액은 0 이상 입력해야 합니다.");
            return;
        }

        //지급 총액이 가용금액을 초과할 경우
        if(matrlCtrtData.cntrctamount < matrlCtrtData.totAmt) {
            handleOpen("지불 총액은 계약금액을 초과할 수 없습니다.");
            return;
        }

        if(matrlCtrtData.expectCt < matrlCtrtData.totAmt){
            handleOpen("지불 총액은 계약금액을 초과할 수 없습니다.");
            return;
        }

        const isExpectCtrtEntrps = tableData.some(item => {
            if((item.expectCtrtEntrpsNm === matrlCtrtData.expectCtrtEntrpsNm)&&!(Object.keys(selectedData).length)) {
                handleOpen(`이미 등록된 ${matrlPlanParam.label}입니다.`);
                return true; // true를 반환하여 some 메서드 반복 중단
            }
            return false;
        });
        if (isExpectCtrtEntrps) return; // 등록된 사원이 있으면 함수 탈출

        handlePlanData(matrlCtrtData);
        handlePopupVisible();
    }


    // 수정테이블 수정가능 여부
    const isEditable = !["VTW03702","VTW03703","VTW03704","VTW03705","VTW03706","VTW03707","VTW03405"].includes(sttsCd) 
                        && data.elctrnAtrzTySeCd !== "VTW04914";

    controlReadOnly = !isEditable
    
    return (
    <>
        <form onSubmit={savePlan}>
            <div className="popup-content">
                <div className="project-regist-content">
                    <div className="project-change-content-inner-left">
                    {data.elctrnAtrzTySeCd === "VTW04910" || ctrtTyCd === "VTW04910" ? 
                        <div className="dx-fieldset">
                            <CustomLabelValue props={matrlPlanParam}  value={matrlCtrtData.expectCtrtEntrpsNm} onSelect={handleChgState} readOnly={controlReadOnly}/>
                            <CustomLabelValue props={labelValue.cntrctamount} onSelect={handleChgState} readOnly={true} value={matrlCtrtData.cntrctamount}/>
                            <CustomLabelValue props={labelValue.prductNm} onSelect={handleChgState} value={matrlCtrtData.prductNm} readOnly={controlReadOnly}/>
                            <CustomLabelValue props={labelValue.dtlCn} onSelect={handleChgState} value={matrlCtrtData.dtlCn} readOnly={controlReadOnly}/>
                            <CustomLabelValue props={labelValue.untpc} onSelect={handleChgState} value={matrlCtrtData.untpc} readOnly={controlReadOnly}/>
                            <CustomLabelValue props={labelValue.qy} onSelect={handleChgState} value={matrlCtrtData.qy} readOnly={controlReadOnly}/>
                            <CustomLabelValue props={labelValue.tot} onSelect={handleChgState} value={matrlCtrtData.untpc*matrlCtrtData.qy} readOnly={controlReadOnly}/>
                            <CustomLabelValue props={labelValue.dlvgdsPrnmntYmd} onSelect={handleChgState} value={matrlCtrtData.dlvgdsPrnmntYmd} readOnly={controlReadOnly}/>
                            <CustomLabelValue props={labelValue.totAmt} onSelect={handleChgState} readOnly={true} value={matrlCtrtData.totAmt}/>
                        </div> : 
                        <div className="dx-fieldset">
                            <CustomLabelValue props={matrlPlanParam}  value={matrlCtrtData.expectCtrtEntrpsNm} onSelect={handleChgState} readOnly={controlReadOnly} />
                            <CustomLabelValue props={labelValue.expectCt} onSelect={handleChgState} readOnly={true} value={matrlCtrtData.expectCt}/>
                            <CustomLabelValue props={labelValue.prductNm} onSelect={handleChgState} value={matrlCtrtData.prductNm? matrlCtrtData.prductNm : matrlCtrtData.outordEntrpsNm} readOnly={controlReadOnly}/>
                            <CustomLabelValue props={labelValue.tkcgJob} onSelect={handleChgState} value={matrlCtrtData.tkcgJob} readOnly={controlReadOnly}/>
                            <CustomLabelValue props={labelValue.inptPrnmntHnfCnt} onSelect={handleChgState} value={matrlCtrtData.inptPrnmntHnfCnt} readOnly={controlReadOnly}/>
                            <CustomLabelValue props={labelValue.ctrtBgngYmd} onSelect={handleChgState} value={matrlCtrtData.ctrtBgngYmd} readOnly={controlReadOnly}/>
                            <CustomLabelValue props={labelValue.ctrtEndYmd} onSelect={handleChgState} value={matrlCtrtData.ctrtEndYmd} readOnly={controlReadOnly}/>
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
                            noEdit={!isEditable}
                            />
                    </div>
                </div>
                <div>
                    {isEditable&& (
                        <>
                        <Button text="저장" useSubmitBehavior={true}/>
                        <Button text="취소" onClick={handlePopupVisible}/>
                        </>
                    )}
                </div>
            </div>
        </form>
    </>
    );

}

export default PymntPlanPopup;