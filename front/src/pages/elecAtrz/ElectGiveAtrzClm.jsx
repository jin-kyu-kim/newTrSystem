import React, {useEffect, useState}from "react";
import { useLocation } from "react-router-dom";
import ElectGiveAtrzClmJson from "./ElectGiveAtrzClmJson.json";
import CustomLabelValue from "components/unit/CustomLabelValue";
import ApiRequest from "utils/ApiRequest";
import { Button } from "devextreme-react";

const ElectGiveAtrzClm = ({ detailData, sttsCd, onSendData}) => {
    const location = useLocation();
    const formData = location.state.formData;
    const labelValue = ElectGiveAtrzClmJson.labelValue;

    useEffect(()=>{
        if(formData.atrzDmndSttsCd === "VTW03701"){ //임시저장
            labelValue.giveYmd.param.queryId.ctrtElctrnAtrzId = detailData.ctrtElctrnAtrzId
        }else{
            labelValue.giveYmd.param.queryId.ctrtElctrnAtrzId = formData.ctrtElctrnAtrzId
        }
    },[detailData, formData])

    const [clmData, setClmData]
     = useState({"ctrtElctrnAtrzId":formData.ctrtElctrnAtrzId
                ,"tbNm": "CTRT_GIVE_ATRZ"});

    let controlReadOnly = false;

    //TODO. 임시저장을 제외한 조회시 readOnly 지정 필요.
    // if(formData.atrzDmndSttsCd === "VTW03701"){
    //     controlReadOnly = true;
    // }


    useEffect(()=>{
        if(formData.atrzDmndSttsCd === "VTW03701"){
            const getCtrtInfo = async () => {
                    try {
                        const response = await ApiRequest('/boot/common/commonSelect', 
                        [{ tbNm: "CTRT_GIVE_ATRZ" }, { elctrnAtrzId: formData.elctrnAtrzId }]               
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
        onSendData(clmData);
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
            <div className="dx-fieldset">
                <CustomLabelValue props={labelValue.giveYmd} onSelect={handleChgState} value={clmData.giveYmd} readOnly={controlReadOnly} />
                <CustomLabelValue props={labelValue.vatExclAmt} onSelect={handleChgState} value={clmData.vatExclAmt} readOnly={true}/>
                <CustomLabelValue props={labelValue.giveAmt} onSelect={handleChgState} value={!clmData.giveYmd? "" : clmData.giveAmt} readOnly={true}/>
                <CustomLabelValue props={labelValue.taxBillPblcnYmd} onSelect={handleChgState} value={clmData.taxBillPblcnYmd} readOnly={controlReadOnly}/>
            </div>
            {/* {!controlReadOnly && */}
                <div>
                    <Button text="-3.3%" onClick={()=>texCal("-3.3")}></Button>
                    <Button text="-8.8%" onClick={()=>texCal("-8.8")}></Button>
                    <Button text="+10%" onClick={()=>texCal("+10")}></Button>
                </div>
            {/* } */}
            </div>
        </div>

        

    )
}

export default ElectGiveAtrzClm;