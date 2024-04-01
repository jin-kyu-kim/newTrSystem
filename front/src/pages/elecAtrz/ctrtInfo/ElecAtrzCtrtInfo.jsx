import React, {useEffect, useState} from "react";

import CustomLabelValue from "../../../components/unit/CustomLabelValue";
import ElecAtrzCtrtInfoJson from "./ElecAtrzCtrtInfoJson.json";

import { SelectBox } from "devextreme-react/select-box";
import { TextBox } from "devextreme-react/text-box";
import { NumberBox } from "devextreme-react";
import { DateRangeBox } from "devextreme-react/date-range-box";

import CustomCdComboBox from "../../../components/unit/CustomCdComboBox";
import { set } from "date-fns";


const ElecAtrzCtrtInfo = ({data, prjctId, onSendData }) => {
    const labelValue = ElecAtrzCtrtInfoJson.labelValue;
    const [infoData, setInfoData] = useState({});

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
        onSendData(infoData);
    }, [infoData]);


    /**
     *  입력값 변경시 데이터 핸들링
     */
    const handleChgState = ({name, value}) => {
        setInfoData(infoData => ({
            ...infoData,
            [name]: value
        }));
    } 

    return (
        <div className="elecAtrzNewReq-ctrtInfo">
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
                            <TextBox
                                placeholder="사업자등록번호 또는 주민등록번호"
                                width="400px"
                                onValueChanged={(e) => {
                                    handleChgState({name: "cntrctrIdntfcNo", value: e.value})
                                }}
                                value={infoData.cntrctrIdntfcNo}
                           />
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
                            <TextBox
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
                                // value={infoData}
                            />
                        </div>
                        <div style={{float: "left", marginRight: "auto", width:"20%"}}>
                            <NumberBox
                                placeholder="사용자지급일"
                                showClearButton={true}
                                min={1}
                                max={31}
                                defaultValue={1}
                                showSpinButtons={true}
                                step={1}
                            />
                        </div>
                    </div>
                </div>
                <CustomLabelValue props={labelValue.etc} value={infoData.etc} onSelect={handleChgState}/>
            </div>
        </div>
    );

}
export default ElecAtrzCtrtInfo;