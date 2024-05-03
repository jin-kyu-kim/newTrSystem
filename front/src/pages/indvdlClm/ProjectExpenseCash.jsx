import { useEffect, useState } from "react";
import { TagBox, TextBox } from "devextreme-react";
import { validateFields, hasError } from './ProjectExpenseValidate';
import ProjectExpenseSubmit from "./ProjectExpenseSubmit";
import ProjectExpenseJson from "./ProjectExpenseJson.json";
import CustomLabelValue from "components/unit/CustomLabelValue";
import CustomComboBox from 'components/unit/CustomComboBox';
import ApiRequest from "utils/ApiRequest";

const ProjectExpenseCash = (props) => {
    const { labelValue } = ProjectExpenseJson;
    const { placeholderAndRequired, btnInfo } = ProjectExpenseJson.ProjectExpenseTab;
    const [ validationErrors, setValidationErrors ] = useState([]);
    const [ customParam, setCustomParam ] = useState({ queryId: "indvdlClmMapper.retrieveExpensCdPrjctAccto" });
    const atrzParam = {
        queryId: "projectExpenseMapper.retrieveElctrnAtrzClm",
        empId: props.empId
    };
    const [ empList, setEmpList ] = useState([]);
    const [ dateVal, setDateVal ] = useState({utztnDt: undefined});
    const [ value, setValue ] = useState([{
        empId: props.empId,
        aplyYm: props.aplyYm,
        aplyOdr: props.aplyOdr
    }]);

    useEffect(() => {
        const getEmpList = async () => { // TagBox
            try {
                const response = await ApiRequest("/boot/common/commonSelect", [{ tbNm: "EMP" }]);
                const processedData = response.map(({ empId, empno, empFlnm }) => ({
                    key: empId,
                    value: empFlnm,
                    displayValue: empno+' '+empFlnm,
                }));
                setEmpList(processedData);
            } catch (error) {
                console.log(error);
            }
        };
        getEmpList();
    }, []);

    useEffect(() => {
        setCustomParam({
            ...customParam,
            prjctId: value[0].prjctId
        })
    }, [value[0].prjctId]);
    
    const handleChgValue = (data) => {
        let newValue = data.value;

        if(data.name === 'utztnDt'){
            newValue = newValue + "000000";
            setDateVal({[data.name]: data.value});
        }
        setValue(prevValue => [{
            ...prevValue[0],
            [data.name]: newValue
        }]);
        
    }

    const SpecialTypeRender = ({item}) => {
        switch (item.type) {
            case 'selectBox':
                return (
                    <CustomComboBox
                        label={item.label}
                        props={item.param}
                        customParam={item.name === 'expensCd' ? customParam : atrzParam }
                        onSelect={handleChgValue}
                        placeholder={item.placeholder}
                        value={value[0][item.name]}
                        required={item.required}
                        readOnly={item.name === 'expensCd' && !value[0].prjctId}
                    />
                )
            default: // textBox
                return item.name === 'atdrn' && value[0].expensCd === 'VTW04531' ? (
                    <TagBox
                        dataSource={empList}
                        placeholder={item.placeholder}
                        searchEnabled={true}
                        style={{ backgroundColor: hasError(validationErrors, null, item.name) ? '#FFCCCC' : '' }}
                        showClearButton={true}
                        value={value[0][item.name]}
                        displayExpr={item.displayExpr}
                        showSelectionControls={true}
                        applyValueMode="useButtons"
                        onValueChanged={(e) => {
                            handleChgValue({name: item.name, value: e.value})
                            setValidationErrors(prevErrors => prevErrors.filter(error => !(error.field === item.name)))
                        }} /> 
                ) : ( 
                    <TextBox 
                        value={value[0][item.name]} 
                        style={{ backgroundColor: hasError(validationErrors, null, item.name) ? '#FFCCCC' : '' }}
                        placeholder={item.placeholder} 
                        onValueChanged={(e) => {
                            handleChgValue({name: item.name, value: e.value})
                            setValidationErrors(prevErrors => prevErrors.filter(error => !(error.field === item.name)))
                        }} 
                    /> 
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

            <div className="dx-fieldset" style={{width: '80%'}}>
                {labelValue.map((item, index) => 
                    (!item.special ? 
                        <CustomLabelValue props={item} onSelect={handleChgValue} value={item.name === 'utztnDt' ? dateVal[item.name] : value[0][item.name]} key={index} />
                    : 
                        <div className="dx-field" key={index} >
                            <div className="dx-field-label asterisk">{item.label}</div>
                            <div className="dx-field-value">
                                <SpecialTypeRender item={item} />
                            </div>
                        </div>
                    )
                )}
            </div>

            <div style={{marginTop: '20px', marginLeft: '430px'}}>
                <ProjectExpenseSubmit validateFields={() => validateFields(value, placeholderAndRequired, setValidationErrors, btnInfo)} 
                    getData={props.getData} selectedItem={value} buttonGroup={btnInfo} width={'1000px'} />
            </div>
        </div>
    );
};
export default ProjectExpenseCash;