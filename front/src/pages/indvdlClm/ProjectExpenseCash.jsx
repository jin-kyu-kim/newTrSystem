import React, {useState} from "react";
import ProjectExpenseJson from "./ProjectExpenseJson.json"
import AutoCompleteProject from "../../components/unit/AutoCompleteProject";
import Button from "devextreme-react/button";
import CustomLabelValue from "../../components/unit/CustomLabelValue";

const button = {
    borderRadius: '5px',
    width: '80px',
    marginTop: '20px',
    marginRight: '15px'
}

const ProjectExpenseCash = (callBack,props) => {
    const Json = ProjectExpenseJson;
    const {labelValue} = Json;
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
                <div className="dx-fieldset" style={{width: '70%'}}>
                    <CustomLabelValue props={labelValue.testParameter} onSelect={handleChgValue} value={cashValue?.testParameter}/>
                    <CustomLabelValue props={labelValue.utztnDt} onSelect={handleChgValue} value={cashValue?.utztnDt}/>
                    <CustomLabelValue props={labelValue.useOffic} onSelect={handleChgValue} value={cashValue?.useOffic}/>
                    <CustomLabelValue props={labelValue.utztnAmt} onSelect={handleChgValue} value={cashValue?.utztnAmt}/>
                    <AutoCompleteProject
                        placeholderText="프로젝트 명"
                        onValueChange={(e) => handleChgValue({name: "prjctId", value: e.value})}
                    />
                    <CustomLabelValue props={labelValue.expensCd} onSelect={handleChgValue} value={cashValue?.expensCd}/>
                    <CustomLabelValue props={labelValue.ctPrpos} onSelect={handleChgValue} value={cashValue?.ctPrpos}/>
                    <CustomLabelValue props={labelValue.ATDRN} onSelect={handleChgValue} value={cashValue?.ATDRN}/>
                    <Button style={button} type='default' text="저장" useSubmitBehavior></Button>
                </div>
            </form>
        </div>
    );
};

export default ProjectExpenseCash;