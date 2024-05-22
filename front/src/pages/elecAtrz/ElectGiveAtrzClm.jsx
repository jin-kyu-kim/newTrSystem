import React, {useEffect, useState}from "react";
import { useLocation } from "react-router-dom";
import ElectGiveAtrzClmJson from "./ElectGiveAtrzClmJson.json";
import CustomLabelValue from "components/unit/CustomLabelValue";
import ApiRequest from "utils/ApiRequest";
import { Button } from "devextreme-react";

const ElectGiveAtrzClm = ({ detailData, sttsCd, onSendData, ctrtTyCd}) => {
    const location = useLocation();
    const formData = location.state.formData;
    const [clmData, setClmData] = 
      useState({"ctrtElctrnAtrzId": formData ? formData.ctrtElctrnAtrzId : detailData.ctrtElctrnAtrzId
                ,"tbNm": "CTRT_GIVE_ATRZ"});
    const labelValue = ElectGiveAtrzClmJson.labelValue;

    if (!formData || formData.atrzDmndSttsCd === "VTW03701" || sttsCd === "VTW05407") { // 임시저장
        labelValue.giveYmd.param.queryId.ctrtElctrnAtrzId = detailData.ctrtElctrnAtrzId;
        labelValue.giveYmd.param.queryId.ctrtTyCd = ctrtTyCd
    } else {
        labelValue.giveYmd.param.queryId.ctrtElctrnAtrzId = formData.ctrtElctrnAtrzId;
        labelValue.giveYmd.param.queryId.ctrtTyCd = ctrtTyCd
    }
    
    /* readOnly 조절 */
    let controlReadOnly = false;

    if(!formData){
        controlReadOnly = true;
    }

    /* 계약청구 데이터 조회 */
    useEffect(()=>{
        if(!formData || formData.atrzDmndSttsCd === "VTW03701" || sttsCd === "VTW05407"){
            const getCtrtInfo = async () => {
                    const param = [{ tbNm: "CTRT_GIVE_ATRZ" }, { elctrnAtrzId: formData? formData.elctrnAtrzId : detailData.elctrnAtrzId }] 
                    try {
                        const response = await ApiRequest('/boot/common/commonSelect', 
                        param          
                    );
                        setClmData(response[0])
                        
                    } catch (error) {
                        console.log('error', error);
                    }
                }            
            getCtrtInfo();
        }
    },[])

    /* 부모창으로 데이터 전달 */
    useEffect(()=>{
        // clmData.useYn 인경우 clmData.useYn, clmData.vatExclAmt, clmData.giveYmd, clmData.ctrtElctrnAtrzId 지우기
        // if (clmData.useYn === 'N' && (clmData.vatExclAmt || clmData.giveYmd || clmData.ctrtElctrnAtrzId)) {
        //     setClmData((prev) => ({
        //         useYn: prev.useYn,
        //         vatExclAmt: '',
        //         giveYmd: '',
        //         ctrtElctrnAtrzId: ''
        //     }));
        // } 

        if (!clmData.rate && clmData.giveAmt && clmData.vatExclAmt) {
            const giveAmt = clmData.giveAmt;
            const vatExclAmt = clmData.vatExclAmt;          
            const rate = ((giveAmt - vatExclAmt) / vatExclAmt) * 100;
    
            if (clmData.rate !== rate) {
                setClmData((pre) => ({
                    ...pre,
                    rate: rate
                }));
            }
           
            if(!clmData.oldData){
                setClmData((pre)=>({
                    ...pre,
                    oldData : clmData.giveYmd
                }))
            }
        }
            
        if(onSendData){
            onSendData(clmData);
        }
    },[clmData]);

     /**
     *  입력값 변경시 데이터 핸들링
     */
     const handleChgState = ({name, value}) => {
        if(value){
            setClmData(clmData => ({
                ...clmData,
                [name]: value
            }));
        }
    } 

    /**
     * 세금 계산하는 버튼 hanlding
     */
    const texCal = (rate) => {
        const vatExclAmt = clmData.vatExclAmt;
        const giveAmt = vatExclAmt + (vatExclAmt * (rate/100));

        setClmData(clmData => ({
            ...clmData,
            giveAmt : giveAmt,
            rate : rate
        }));
    }

    return (
        <div>
            <h3>계약청구</h3>
            <div style={{ width: '50%'}}>
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", width:"100%"}}>
                    <div className="dx-fieldset" style={{flex: 1, display: "flex", flexDirection: "column"}}>
                        {labelValue.giveYmd.param.queryId.ctrtElctrnAtrzId ? 
                        <>
                        <CustomLabelValue props={labelValue.giveYmd} onSelect={handleChgState} value={clmData.giveYmd} readOnly={controlReadOnly} />
                        <CustomLabelValue props={labelValue.vatExclAmt} onSelect={handleChgState} value={clmData.vatExclAmt} readOnly={true}/>
                        <CustomLabelValue props={labelValue.giveAmt} onSelect={handleChgState} value={!clmData.giveYmd? "" : clmData.giveAmt} readOnly={true}/>
                        <CustomLabelValue props={labelValue.taxBillPblcnYmd} onSelect={handleChgState} value={clmData.taxBillPblcnYmd} readOnly={controlReadOnly}/>
                        </>
                        : ""}
                        </div>
                    {!controlReadOnly &&
                        <div style={{flex: "0 0 auto", marginTop: "80px"}}>
                            <Button text="-3.3%" onClick={()=>texCal("-3.3")}></Button>
                            <Button text="-8.8%" onClick={()=>texCal("-8.8")}></Button>
                            <Button text="+10%" onClick={()=>texCal("+10")}></Button>
                        </div>
                    }
                </div>
            </div>
        </div>

        

    )
}

export default ElectGiveAtrzClm;