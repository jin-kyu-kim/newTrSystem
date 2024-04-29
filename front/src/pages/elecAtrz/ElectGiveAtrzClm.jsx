import React, {useEffect, useState}from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ElectGiveAtrzClmJson from "./ElectGiveAtrzClmJson.json";
import CustomLabelValue from "components/unit/CustomLabelValue";
import { Button } from "devextreme-react";

const ElectGiveAtrzClm = ({onSendData}) => {
    const location = useLocation();
    const formData = location.state.formData;
    const labelValue = ElectGiveAtrzClmJson.labelValue;
    labelValue.giveYmd.param.queryId.ctrtElctrnAtrzId = formData.ctrtElctrnAtrzId
    const [clmData, setClmData]
     = useState({"ctrtElctrnAtrzId":formData.ctrtElctrnAtrzId
                ,"tbNm": "CTRT_GIVE_ATRZ"});

    console.log("location", location)


    useEffect(()=>{
        onSendData(clmData);
    },[clmData]);

     /**
     *  입력값 변경시 데이터 핸들링
     */
     const handleChgState = ({name, value}) => {
        setClmData(clmData => ({
            ...clmData,
            [name]: value
        }));
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
                <CustomLabelValue props={labelValue.giveYmd} onSelect={handleChgState} value={clmData.giveYmd}/>
                <CustomLabelValue props={labelValue.vatExclAmt} onSelect={handleChgState} value={clmData.vatExclAmt} readOnly={true}/>
                <CustomLabelValue props={labelValue.giveAmt} onSelect={handleChgState} value={!clmData.giveYmd? "" : clmData.giveAmt} readOnly={true}/>
                <CustomLabelValue props={labelValue.taxBillPblcnYmd} onSelect={handleChgState} value={clmData.taxBillPblcnYmd}/>
            </div>
            <div>
                <Button text="-3.3%" onClick={()=>texCal("-3.3")}></Button>
                <Button text="-8.8%" onClick={()=>texCal("-8.8")}></Button>
                <Button text="+10%" onClick={()=>texCal("+10")}></Button>
            </div>
            </div>
        </div>

        

    )
}

export default ElectGiveAtrzClm;