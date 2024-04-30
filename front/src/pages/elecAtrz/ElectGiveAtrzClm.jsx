import React, {useEffect, useState}from "react";
import { useLocation } from "react-router-dom";
import ElectGiveAtrzClmJson from "./ElectGiveAtrzClmJson.json";
import CustomLabelValue from "components/unit/CustomLabelValue";
import ApiRequest from "utils/ApiRequest";
import { Button } from "devextreme-react";

const ElectGiveAtrzClm = ({ detailData, sttsCd, onSendData}) => {
    const location = useLocation();
    const formData = location.state.formData;
    const [clmData, setClmData] = 
      useState({"ctrtElctrnAtrzId": formData ? formData.ctrtElctrnAtrzId : detailData.ctrtElctrnAtrzId
                ,"tbNm": "CTRT_GIVE_ATRZ"});
    const [labelValue, setLabelValue] = useState(ElectGiveAtrzClmJson.labelValue);

    // console.log("detailData clm 이라고!", detailData)
    // console.log("sttsCd", sttsCd)
    // console.log("formData", formData)

    useEffect(() => {
        // 객체를 새로 생성하여 불변성을 유지
        const newLabelValue = {...labelValue};
        
        if (!formData || formData.atrzDmndSttsCd === "VTW03701") { // 임시저장
            newLabelValue.giveYmd.param.queryId.ctrtElctrnAtrzId = detailData.ctrtElctrnAtrzId;
        } else {
            newLabelValue.giveYmd.param.queryId.ctrtElctrnAtrzId = formData.ctrtElctrnAtrzId;
        }

        setLabelValue(newLabelValue); // 상태 업데이트
    }, [detailData, formData]);

    
    /* readOnly 조절 */
    let controlReadOnly = false;

    if(!formData){
        controlReadOnly = true;
    }


    useEffect(()=>{
        if(!formData || formData.atrzDmndSttsCd === "VTW03701"){
            const getCtrtInfo = async () => {
                    try {
                        const response = await ApiRequest('/boot/common/commonSelect', 
                        [{ tbNm: "CTRT_GIVE_ATRZ" }, { elctrnAtrzId: formData? formData.elctrnAtrzId : detailData.elctrnAtrzId }]               
                    );
                        setClmData(response[0])
                        
                    } catch (error) {
                        console.log('error', error);
                    }
                }            
            getCtrtInfo();
        }
    },[])


    useEffect(()=>{
        console.log("clmData", clmData)
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
            giveAmt : giveAmt
        }));
    }

    return (
        <div>
            <h3>계약청구</h3>
            <div style={{ width: '50%'}}>
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", width:"100%"}}>
                    <div className="dx-fieldset" style={{flex: 1, display: "flex", flexDirection: "column"}}>
                        <CustomLabelValue props={labelValue.giveYmd} onSelect={handleChgState} value={clmData.giveYmd} readOnly={controlReadOnly} />
                        <CustomLabelValue props={labelValue.vatExclAmt} onSelect={handleChgState} value={clmData.vatExclAmt} readOnly={true}/>
                        <CustomLabelValue props={labelValue.giveAmt} onSelect={handleChgState} value={!clmData.giveYmd? "" : clmData.giveAmt} readOnly={true}/>
                        <CustomLabelValue props={labelValue.taxBillPblcnYmd} onSelect={handleChgState} value={clmData.taxBillPblcnYmd} readOnly={controlReadOnly}/>
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