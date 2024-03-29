import React, {useEffect, useState} from "react";

import CustomLabelValue from "../../../components/unit/CustomLabelValue";
import ElecAtrzOutordEmpCtrtJson from "../ElecAtrzOutordEmpCtrtJson.json";

import { SelectBox } from "devextreme-react/select-box";
import { TextBox } from "devextreme-react/text-box";
import { DateRangeBox } from "devextreme-react/date-range-box";


const ElecAtrzCtrtInfo = ({data}) => {

    useEffect(() => {
        console.log("info")
        console.log(data.elctrnAtrzTySeCd);
    }, []);

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
                <CustomLabelValue props={ElecAtrzOutordEmpCtrtJson.labelValue.ctrtTrgtNm} />
                <CustomLabelValue props={ElecAtrzOutordEmpCtrtJson.labelValue.cntrctrAddr} />
                <div className="dx-field">
                    <div className="dx-field-label">사업자등록번호 또는 주민등록번호</div>
                    <div className="dx-field-value">
                        <div style={{float: "left", marginRight: "20px", width: "20%"}}>
                            <SelectBox
                                placeholder="구분"
                            />
                        </div>
                        <div style={{display:"inline-block", marginLeft:"auto"}}>
                            <TextBox
                                placeholder="사업자등록번호 또는 주민등록번호"
                                width="400px"
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
                            <SelectBox
                                placeholder="은행코드"
                            />
                        </div>
                        <div style={{display:"inline-block", marginLeft: "auto", marginRight: "20px", width: "20%"}}>
                            <TextBox
                                placeholder="예금주"
                            />
                        </div>
                        <div style={{display:"inline-block", marginLeft:"auto", width: "30%"}}>
                            <TextBox
                                placeholder="계좌번호"
                            />
                        </div>
                    </div>
                </div>
                <div className="dx-field">
                    <div className="dx-field-label">지급일</div>
                    <div className="dx-field-value">
                        <div style={{float: "left", marginRight: "20px", width:"20%"}}>
                            <SelectBox
                                placeholder="지급구분"
                            />
                        </div>
                        <div style={{float: "left", marginRight: "auto", width:"20%"}}>
                            <SelectBox
                                placeholder="지급일"
                            />
                        </div>
                    </div>
                </div>
                <CustomLabelValue props={ElecAtrzOutordEmpCtrtJson.labelValue.etc} />
            </div>
        </div>
    );

}
export default ElecAtrzCtrtInfo;