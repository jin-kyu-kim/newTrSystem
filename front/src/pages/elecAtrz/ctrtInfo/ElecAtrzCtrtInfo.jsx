import React, {useEffect, useState} from "react";

import CustomLabelValue from "../../../components/unit/CustomLabelValue";
import ElecAtrzCtrtInfoJson from "./ElecAtrzCtrtInfoJson.json";

import { SelectBox } from "devextreme-react/select-box";
import { TextBox } from "devextreme-react/text-box";
import { NumberBox } from "devextreme-react";
import { DateRangeBox } from "devextreme-react/date-range-box";
import { Validator, RequiredRule, } from "devextreme-react/validator";

import CustomCdComboBox from "../../../components/unit/CustomCdComboBox";


const ElecAtrzCtrtInfo = ({data, prjctId, onSendData }) => {
    const labelValue = ElecAtrzCtrtInfoJson.labelValue;
    const [infoData, setInfoData] = useState({});

    const giveDe = [
        {"value": "5"},
        {"value": "10"},
        {"value": "15"},
        {"value": "지급일 지정"}
    ];

    /**
     *  부모창으로 데이터 전송
     */
    useEffect(() => {
        if (!infoData.tbNm) {
            setInfoData(infoData => ({
                ...infoData,
                tbNm: 'CTRT_ATRZ'
            }));
        }      
        //지급일 지정일 경우 지급일 변경
        const updatedInfoData = { ...infoData };
        if(updatedInfoData.giveDe === "지급일 지정"){
            updatedInfoData.giveDe = updatedInfoData.giveDeEtc;
            delete updatedInfoData.giveDeEtc;
        }

        onSendData(updatedInfoData);
    }, [infoData]);


    /**
     *  입력값 변경시 데이터 핸들링
     */
    const handleChgState = ({name, value, name2, value2}) => {

        setInfoData(infoData => ({
            ...infoData,
            [name]: value,
            [name2] : value2
        }));
    } 

    return (
        <div className="elecAtrzNewReq-ctrtInfo" >
            <h3>계약정보</h3>
            <div className="dx-fieldset">
                <div className="dx-field">
                    <div className="dx-field-label"> 계약구분</div>
                    <div className="dx-field-value">
                        <div className="dx-field-value-text">
                            {data.elctrnAtrzTySeCdNm}
                        </div>
                    </div>
                </div>
                <CustomLabelValue props={labelValue.ctrtTrgtNm} value={infoData.ctrtTrgtNm} onSelect={handleChgState} />
                <CustomLabelValue props={labelValue.cntrctrAddr} value={infoData.cntrctrAddr} onSelect={handleChgState}/>
                <div className="dx-field">
                    <div className="dx-field-label">사업자등록번호 또는 주민등록번호</div>
                    <div className="dx-field-value">
                        <div style={{float: "left", marginRight: "20px", width: "20%"}}>
                            {/* <SelectBox
                                placeholder="구분"
                            /> */}
                            <CustomCdComboBox
                                param="VTW046"
                                placeholderText="구분"
                                name="cntrctrIdntfcSeCd"
                                onSelect={handleChgState}
                                value={infoData.cntrctrIdntfcSeCd}
                                required={false}
                                label={"구분"}
                            />
                        </div>
                        <div style={{display:"inline-block", marginLeft:"auto"}}>
                            <NumberBox
                                placeholder="사업자등록번호 또는 주민등록번호"
                                width="400px"
                                onValueChanged={(e) => {
                                    handleChgState({name: "cntrctrIdntfcNo", value: e.value})
                                }}
                                value={infoData.cntrctrIdntfcNo}
                           >
                                {/* <Validator><RequiredRule message={"필수값입니다."}/></Validator> */}
                           </NumberBox>
                        </div>
                    </div>
                </div>
                {
                    ["VTW04908","VTW04909"].includes(data.elctrnAtrzTySeCd) &&
                    <div className="dx-field">
                        <div className="dx-field-label">계약기간</div>
                        <div className="dx-field-value">
                            <div style={{width: "50%"}}>
                                <DateRangeBox
                                    displayFormat={"yyyy-MM-dd"}
                                    dateSerializationFormat="yyyyMMdd"
                                    applyValueMode="useButtons"
                                    value={[infoData.ctrtBgngYmd, infoData.ctrtEndYmd]}
                                    onValueChanged={(e) => {
                                        handleChgState({name: "ctrtBgngYmd", value: e.value[0], name2: "ctrtEndYmd", value2: e.value[1]})
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                }
                <div className="dx-field">
                    <div className="dx-field-label">입금계좌</div>
                    <div className="dx-field-value">
                        <div style={{float: "left", marginRight: "20px", width:"20%"}}>
                            <CustomCdComboBox
                                param="VTW035"
                                placeholderText="은행코드"
                                name="dpstBankCd"
                                onSelect={handleChgState}
                                value={infoData.dpstBankCd}
                                required={false}
                                label={"은행코드"}
                            />
                        </div>
                        <div style={{display:"inline-block", marginLeft: "auto", marginRight: "20px", width: "20%"}}>
                            <TextBox
                                placeholder="예금주"
                                onValueChanged={(e) => {
                                    handleChgState({name: "dpstrFlnm", value: e.value})
                                }}
                                value={infoData.dpstrFlnm}
                            />
                        </div>
                        <div style={{display:"inline-block", marginLeft:"auto", width: "30%"}}>
                            <NumberBox
                                placeholder="계좌번호"
                                onValueChanged={(e) => {
                                    handleChgState({name: "dpstActno", value: e.value})
                                }}
                                value={infoData.dpstActno}
                            />
                        </div>
                    </div>
                </div>
                <div className="dx-field">
                    <div className="dx-field-label">지급일</div>
                    <div className="dx-field-value">
                        <div style={{float: "left", marginRight: "20px", width:"20%"}}>
                            <CustomCdComboBox
                                param="VTW038"
                                placeholderText="지급구분"
                                name="giveMthdSeCd"
                                onSelect={handleChgState}
                                value={infoData.giveMthdSeCd}
                                required={false}
                                label={"지급구분"}
                            />
                        </div>
                        <div style={{float: "left", marginRight: "20px", width:"20%"}}>
                            <SelectBox
                                placeholder="지급일"
                                name="giveDe"
                                displayExpr="value"
                                valueExpr="value"
                                onValueChanged={(e) => {
                                    handleChgState({name: "giveDe", value: e.value})
                                }}
                                value={infoData.giveDe}
                                dataSource={giveDe}
                            />
                        </div>
                        <div style={{float: "left", marginRight: "auto", width:"30%"}}>
                            <NumberBox
                                placeholder="사용자지급일"
                                showClearButton={true}
                                min={1}
                                max={31}
                                showSpinButtons={true}
                                step={1}
                                value={infoData.giveDeEtc}
                                readOnly={infoData.giveDe === "지급일 지정" ? false : true}
                                onValueChanged={(e) => {
                                    handleChgState({name: "giveDeEtc", value: e.value})
                                }}
                            />
                        </div>
                    </div>
                </div>
                <CustomLabelValue 
                    props={labelValue.giveDePrvonsh} 
                    value={infoData.giveDePrvonsh} 
                    onSelect={handleChgState}
                    readOnly={infoData.giveDe === "지급일 지정" ? false : true}
                    />
            </div>
        </div>
    );

}
export default ElecAtrzCtrtInfo;