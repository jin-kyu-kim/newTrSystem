import React, {useEffect, useState} from "react";
import ProjectExpenseJson from "./ProjectExpenseJson.json"
import CustomLabelValue from "../../components/unit/CustomLabelValue";
import ProjectExpenseSubmit from "./ProjectExpenseSubmit";
import ApiRequest from "../../utils/ApiRequest";
import TagBox from 'devextreme-react/tag-box';
import {RequiredRule, Validator} from "devextreme-react/validator";
import {TextBox} from "devextreme-react/text-box";
import CustomComboBox from "../../components/unit/CustomComboBox";

const ProjectExpenseCash = (props) => {
    const { labelValue } = ProjectExpenseJson;
    const [customParam, setCustomParam] = useState([]);
    const [elcCustomParam, setElcCustomParam] = useState([]);
    const [empList, setEmpList] = useState([]);
    const [cashValue, setCashValue] = useState({
        "empId": props.empId,
        "regEmpId": props.empId
    });
    const [dateValue, setDateValue] = useState();
    const [expensCdComboBox, setExpensCdComboBox] = useState(false);
    const [ctPrposTextBox, setCtPrposTextBox] = useState({
        "required": false,
        "className": "dx-field-label",
        "placeholder": "상세내역(목적)"
    });
    const [atdrnTextBox, setAtdrnTextBox] = useState({
        "required": false,
        "className": "dx-field-label",
        "placeholder": "용도(참석자명단)"
    });
    const [requiredValidationList, setRequiredValidationList] = useState([
        'ctAtrzSeCd','utztnDt','useOffic','utztnAmt','prjctId','expensCd'
    ]);

    useEffect(()=>{

        getEmpList();

        setCustomParam({...customParam, "queryId" : 'indvdlClmMapper.retrieveExpensCdPrjctAccto'});
        setElcCustomParam({"queryId": "projectExpenseMapper.retrieveElctrnAtrzClm", "empId": props.empId})
        setCashValue({...cashValue, "aplyYm" : props.aplyYm, "aplyOdr" : props.aplyOdr});
    },[]);

    const getEmpList = async () => {
        try {
            const response = await ApiRequest("/boot/common/commonSelect", [
                { tbNm: "EMP" },
                {},
            ]);
            const processedData = response.map(({ empId, empno, empFlnm }) => ({
                key: empId,
                value: empno+' '+empFlnm,
            }));
            setEmpList(processedData);
        } catch (error) {
            console.log(error);
        }
    };

    const handleChgValue = ({name, value}) => {

        //프로젝트 선택해야 비용코드 선택 가능
        if(name === 'prjctId'){
            if(value !== null){
                setExpensCdComboBox(true);
                setCustomParam({...customParam, prjctId: value});
            } else {
                setExpensCdComboBox(false);
                setCustomParam({...customParam, prjctId: ''});
            }
        }

        //비용코드별 필수여부, placehold 값 변경
        if(name === 'expensCd'){
            if(value === 'VTW04518'){ //출장비-장기출장
                window.alert('해당코드는 개인청구에서 청구할 수 없는 코드입니다. 전자결재에서 청구하시기 바랍니다.');
                return;    
            } else if(value === 'VTW04528'){ //고객회의비
                setCtPrposTextBox({
                    required: true, 
                    className: "dx-field-label asterisk", 
                    placeholder: "상세내역(참여인력)"
                })
                setAtdrnTextBox({
                    required: true,
                    className: "dx-field-label asterisk",
                    placeholder: "용도"
                })

                setRequiredValidationList(['ctAtrzSeCd','utztnDt','useOffic','utztnAmt','prjctId','expensCd','ctPrpos','atdrn']);
            } else if(value === 'VTW04530'){ //사무용품/소모품
                setCtPrposTextBox({
                    required: false,
                    className: "dx-field-label",
                    placeholder: "상세내역(목적)"
                })
                setAtdrnTextBox({
                    required: true,
                    className: "dx-field-label asterisk",
                    placeholder: "용도(참석자명단)"
                })

                setRequiredValidationList(['ctAtrzSeCd','utztnDt','useOffic','utztnAmt','prjctId','expensCd','atdrn']);
            } else if(value === 'VTW04531'){ //야근식대
                setCtPrposTextBox({
                    required: true,
                    className: "dx-field-label asterisk",
                    placeholder: "상세내역(목적)"
                })
                setAtdrnTextBox({
                    required: true,
                    className: "dx-field-label asterisk",
                    placeholder: "참석자명단"
                })

                setRequiredValidationList(['ctAtrzSeCd','utztnDt','useOffic','utztnAmt','prjctId','expensCd','ctPrpos','atdrn']);
            } else if(value === 'VTW04533'){ //야근택시비
                setCtPrposTextBox({
                    required: false,
                    className: "dx-field-label",
                    placeholder: "출발지-목적지"
                })
                setAtdrnTextBox({
                    required: true,
                    className: "dx-field-label asterisk",
                    placeholder: "탑승자"
                })

                setRequiredValidationList(['ctAtrzSeCd','utztnDt','useOffic','utztnAmt','prjctId','expensCd','atdrn']);
            } else {
                setCtPrposTextBox({
                    required: false,
                    className: "dx-field-label",
                    placeholder: "상세내역(목적)"
                })
                setAtdrnTextBox({
                    required: false,
                    className: "dx-field-label",
                    placeholder: "용도(참석자명단)"
                })

                setRequiredValidationList(['ctAtrzSeCd','utztnDt','useOffic','utztnAmt','prjctId','expensCd']);
            }
        }

        //야근식대 참석자 배열 아닌 문자열로 변환
        if(name === 'atdrn' && Array.isArray(value)){
            value = value.join(',');
        }

        setCashValue({...cashValue, [name] : value});

    };

    const handleChgDate = ({name, value}) => {
        setDateValue({...dateValue, [name] : value});
        setCashValue({...cashValue, [name] : value + "000000"});
    };

    const validate = (required) => {
        if(required) {
            return (
                <RequiredRule message={'필수 입력 값입니다.'}/>
            )
        }
    }

    return(
        <div className="container" style={{margin: '4%'}}>
            <span style={{fontSize: 18}}> 개인이 현금 또는 개인법인카드로 지불한 청구건을 등록합니다.<br/>
                <span style={{color: "red", fontSize: 14}}>※ 사용금액이 20만원 이상일 경우<br/>
                    1. '전자결재 > 경비 사전 보고'를 작성후 승인 받으시기 바랍니다.<br/>
                    2. TR 제출시 승인받은 '결재 사전 보고' 결재문서를 출력하여 함께 제출하시기 바랍니다.
                </span>
            </span>
            <div className="dx-fieldset" style={{width: '70%'}}>
                <CustomLabelValue props={labelValue.ctAtrzSeCd} onSelect={handleChgValue} value={cashValue?.ctAtrzSeCd}/>
                <CustomLabelValue props={labelValue.utztnDt} onSelect={handleChgDate} value={dateValue?.utztnDt}/>
                <CustomLabelValue props={labelValue.useOffic} onSelect={handleChgValue} value={cashValue?.useOffic}/>
                <CustomLabelValue props={labelValue.utztnAmt} onSelect={handleChgValue} value={cashValue?.utztnAmt}/>
                <div className="dx-field">
                    <div className="dx-field-label asterisk">프로젝트<br/>(프로젝트명 또는 코드 입력)</div>
                    <div className="dx-field-value">
                        <CustomComboBox
                            label={labelValue.prjctId.label}
                            props={labelValue.prjctId.param}
                            onSelect={handleChgValue}
                            placeholder={'"["입력시 사용가능한 프로젝트 전체 조회'}
                            value={cashValue?.prjctId}
                            required={labelValue.prjctId.required}
                        />
                    </div>
                </div>
                {expensCdComboBox ? (
                    <div className="dx-field">
                        <div className="dx-field-label asterisk">비용코드</div>
                        <div className="dx-field-value">
                            <CustomComboBox
                                label={labelValue.expensCd.label}
                                props={labelValue.expensCd.param}
                                customParam={customParam}
                                onSelect={handleChgValue}
                                placeholder={labelValue.expensCd.placeholder}
                                value={cashValue?.expensCd}
                                required={labelValue.expensCd.required}
                            />
                        </div>
                    </div>
                ) : (
                    <CustomLabelValue props={labelValue.expensBox} readOnly={true}/>
                )}
                <div className="dx-field">
                    <div className={ctPrposTextBox.className}>상세내역(목적)</div>
                    <div className="dx-field-value">
                        <TextBox
                            key="ctPrpos"
                            placeholder={ctPrposTextBox.placeholder}
                            showClearButton={true}
                            value={cashValue?.ctPrpos}
                            onValueChanged={(e) => {
                                handleChgValue({name: "ctPrpos", value: e.value})
                            }}
                        >
                            <Validator>{validate(ctPrposTextBox.required)}</Validator>
                        </TextBox>
                    </div>
                </div>
                <div className="dx-field">
                    <div className={atdrnTextBox.className}>용도(참석자명단)</div>
                    <div className="dx-field-value">
                        {cashValue.expensCd === 'VTW04531' ? (
                            <TagBox
                                dataSource={empList}
                                displayExpr="value"
                                valueExpr="key"
                                placeholder={atdrnTextBox.placeholder}
                                searchEnabled={true}
                                onValueChanged={(e) => handleChgValue({name: "atdrn", value: e.value})}
                            >
                                <Validator>{validate(atdrnTextBox.required)}</Validator>
                            </TagBox>
                        ) : (
                            <TextBox
                                key="atdrn"
                                placeholder={atdrnTextBox.placeholder}
                                showClearButton={true}
                                value={cashValue?.atdrn}
                                onValueChanged={(e) => {
                                    handleChgValue({name: "atdrn", value: e.value})
                                }}
                            >
                                <Validator>{validate(atdrnTextBox.required)}</Validator>
                            </TextBox>
                        )}
                    </div>
                </div>
                <div className="dx-field">
                    <div className="dx-field-label">전자결재</div>
                    <div className="dx-field-value">
                        <CustomComboBox
                            label={labelValue.elctrnAtrzId.label}
                            props={labelValue.elctrnAtrzId.param}
                            customParam={elcCustomParam}
                            onSelect={handleChgValue}
                            placeholder={labelValue.elctrnAtrzId.placeholder}
                            value={cashValue?.elctrnAtrzId}
                        />
                    </div>
                </div>
                <ProjectExpenseSubmit
                    text="저장"
                    type="default"
                    value={[cashValue]}
                    tbNm="PRJCT_CT_APLY"
                    atrzTbNm="PRJCT_CT_ATRZ"
                    snColumn="PRJCT_CT_APLY_SN"
                    requiredValidation={requiredValidationList}
                />
            </div>
        </div>
    );
};

export default ProjectExpenseCash;