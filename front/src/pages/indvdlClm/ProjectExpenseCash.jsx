import React, {useState} from "react";
import DateBox from "devextreme-react/date-box";
import {NumberBox} from "devextreme-react";
import ProjectExpenseJson from "./ProjectExpenseJson.json"
import CustomCdComboBox from "../../components/unit/CustomCdComboBox";
import {TextBox} from "devextreme-react/text-box";
import AutoCompleteProject from "../../components/unit/AutoCompleteProject";
import Button from "devextreme-react/button";

const thStyle = {
    backgroundColor: '#f5f5f5',
    color: '#666666',
    fontWeight: 'bold',
    textAlign: 'center',
    border : '1px solid #dddddd',
    fontSize: 14
};

const tdStyle = {
    border : '1px solid #dddddd'
}

const inputStyle = {
    backgroundColor: 'white',
    width: '100%',
    height: '50px',
    border : '1px solid #dddddd',
    borderRadius : '5px',
    fontSize: 14
}

const button = {
    borderRadius: '5px',
    width: '80px',
    marginTop: '20px',
    marginRight: '15px'
}

const ProjectExpenseCash = (callBack,props) => {
    const Json = ProjectExpenseJson;
    const [cashValue, setCashValue] = useState();
    const handleChgValue = ({name, value}) => {
        setCashValue({...cashValue, [name] : value});
    };
    const handleSubmit = () => {

    };
    return(
        <div className="container" style={{margin: '4%'}}>
            <span style={{fontSize: 18}}> 개인이 현금 또는 개인법인카드로 지불한 청구건을 등록합니다.<br/>
                <span style={{color: "red", fontSize: 14}}>※ 사용금액이 20만원 이상일 경우<br/>
                    1. '전자결재 > 경비 사전 보고'를 작성후 승인 받으시기 바랍니다.<br/>
                    2. TR 제출시 승인받은 '결재 사전 보고' 결재문서를 출력하여 함께 제출하시기 바랍니다.
                </span>
            </span>
            <form onSubmit={handleSubmit}>
                <table style={{border: '1px solid #dddddd', marginTop: '15px'}}>
                    <colgroup>
                        <col width="25%"/>
                        <col width="75%"/>
                    </colgroup>
                    <tbody>
                    <tr>
                        <th style={thStyle}>구분</th>
                        <td style={tdStyle}>
                            {/*<CustomCdComboBox*/}
                            {/*    param="VTW045"*/}
                            {/*    placeholderText="구분"*/}
                            {/*    name="expensCd"*/}
                            {/*    onSelect={handleChgValue}*/}
                            {/*    value={cashValue?.expensCd}*/}
                            {/*    showClearButton={true}*/}
                            {/*/>*/}
                        </td>
                    </tr>
                    <tr>
                        <th style={thStyle}>사용일시</th>
                        <td style={tdStyle}>
                            <DateBox
                                value={cashValue?.utztnDt}
                                dateSerializationFormat={'yyyyMMddHHmmSS'}
                                onValueChanged={(e) => handleChgValue({name: "utztnDt", value: e.value})}
                                inputAttr={Json.dateLabel}
                                type="date"
                                style={{backgroundColor: 'white'}}
                            />
                        </td>
                    </tr>
                    <tr>
                        <th style={thStyle}>사용처</th>
                        <td style={tdStyle}>
                            <TextBox
                                style={inputStyle}
                                placeholder="사용처"
                                value={cashValue?.useOffic}
                                onValueChanged={(e) => handleChgValue({name: "useOffic", value: e.value})}
                                showClearButton={true}
                            />
                        </td>
                    </tr>
                    <tr>
                        <th style={thStyle}>금액</th>
                        <td style={tdStyle}>
                            <NumberBox
                                value={cashValue?.utztnAmt}
                                onValueChanged={(e) => handleChgValue({name: "utztnAmt", value: e.value})}
                                inputAttr={Json.withSpinAndButtonsLabel}
                                style={{backgroundColor: 'white'}}
                                showClearButton={true}
                            />
                        </td>
                    </tr>
                    <tr>
                        <th style={thStyle}>프로젝트</th>
                        <td style={tdStyle}>
                            <AutoCompleteProject
                                placeholderText="프로젝트 명"
                                onValueChange={(e) => handleChgValue({name: "prjctId", value: e.value})}
                            />
                        </td>
                    </tr>
                    <tr>
                        <th style={thStyle}>비용코드</th>
                        <td style={tdStyle}>
                            <CustomCdComboBox
                                param="VTW045"
                                placeholderText="비용코드"
                                name="expensCd"
                                onSelect={handleChgValue}
                                value={cashValue?.expensCd}
                                showClearButton={true}
                            />
                        </td>
                    </tr>
                    <tr>
                        <th style={thStyle}>목적</th>
                        <td style={tdStyle}>
                            <TextBox
                                style={inputStyle}
                                placeholder="용도"
                                value={cashValue?.ctPrpos}
                                onValueChanged={(e) => handleChgValue({name: "ctPrpos", value: e.value})}
                                showClearButton={true}
                            />
                        </td>
                    </tr>
                    <tr>
                        <th style={thStyle}>참석자</th>
                        <td style={tdStyle}>
                            <TextBox
                                style={inputStyle}
                                placeholder="참석자"
                                value={cashValue?.ATDRN}
                                onValueChanged={(e) => handleChgValue({name: "ATDRN", value: e.value})}
                                showClearButton={true}
                            />
                        </td>
                    </tr>
                    </tbody>
                </table>
            </form>
            <Button style={button} type='default' text="저장" useSubmitBehavior></Button>
        </div>
    );
};

export default ProjectExpenseCash;