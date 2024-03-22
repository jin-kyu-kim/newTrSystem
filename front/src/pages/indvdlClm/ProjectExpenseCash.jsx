import React, {useEffect, useState} from "react";
import ProjectExpenseJson from "./ProjectExpenseJson.json"
import AutoCompleteProject from "../../components/unit/AutoCompleteProject";
import Button from "devextreme-react/button";
import CustomLabelValue from "../../components/unit/CustomLabelValue";
import {useCookies} from "react-cookie";
import ApiRequest from "../../utils/ApiRequest";
import axios from "axios";

const button = {
    borderRadius: '5px',
    width: '80px',
    marginTop: '20px',
    marginRight: '15px'
}

const ProjectExpenseCash = (callBack,props) => {
    const [cookies] = useCookies([]);
    const Json = ProjectExpenseJson;
    const {labelValue} = Json;
    const [cashValue, setCashValue] = useState({
        "empId": cookies.userInfo.empId,
        "regEmpId": cookies.userInfo.empId
    });
    const [dateValue, setDateValue] = useState();
    let aplyDate = null;
    let now = new Date();

    useEffect(()=>{
        let dateNum = Number(now.getDate());
        if(dateNum <= 15){
            let firstDayOfMonth = new Date( now.getFullYear(), now.getMonth() , 1 );
            let lastMonth = new Date ( firstDayOfMonth.setDate( firstDayOfMonth.getDate() - 1 ) );
            aplyDate = {
                "aplyYm": lastMonth.getFullYear()+('0' + (lastMonth.getMonth()+1)).slice(-2),
                "aplyOdr": 2
            }
        } else if (16 <= dateNum){
            aplyDate = {
                "aplyYm": now.getFullYear()+('0' + (now.getMonth()+1)).slice(-2),
                "aplyOdr": 1
            }
        }
    },[]);

    useEffect(()=>{
        setCashValue({...cashValue, "aplyYm" : aplyDate?.aplyYm, "aplyOdr" : aplyDate?.aplyOdr});
    },[aplyDate]);

    const handleChgValue = ({name, value}) => {
        setCashValue({...cashValue, [name] : value});
    };

    const handleChgDate = ({name, value}) => {
        setDateValue({...dateValue, [name] : value});
        setCashValue({...cashValue, [name] : value + "000000"});
    };

    const handleSubmit = async() => {
        const params = [{
            tbNm: "PRJCT_INDVDL_CT_MM"
        }, {
            "prjctId": cashValue.prjctId,
            "empId": cashValue.empId,
            "aplyYm": cashValue.aplyYm,
            "aplyOdr": cashValue.aplyOdr
        }
        ]
        const result = searchMM(params);
        result.then((value)=>{
            if(value?.length == 0){
                const resultMM = insertMM(params);
                resultMM.then(()=>{
                    insertValue();
                });
            } else {
                insertValue();
            }
        });
    };

    const searchMM = async(params) => {
        const response = await ApiRequest("/boot/common/commonSelect", params);
        return response;
    }

    const insertMM = async (params) => {
        const response = await axios.post("/boot/common/commonInsert", params);
        return response;
    }

    const insertValue = async () => {
        const confirmResult = window.confirm("등록하시겠습니까?");
        if (confirmResult) {
            const params = [{ tbNm: "PRJCT_CT_APLY", snColumn: "PRJCT_CT_APLY_SN" }, cashValue];
            try {
                const response = await ApiRequest("/boot/common/commonInsert", params);
                if (response === 1) {
                    window.alert("등록되었습니다.")
                }
            } catch (error) {
                console.error("API 요청 에러:", error);
                throw error;
            }
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
            <form onSubmit={handleSubmit}>
                <div className="dx-fieldset" style={{width: '70%'}}>
                    <CustomLabelValue props={labelValue.ctAtrzSeCd} onSelect={handleChgValue} value={cashValue?.ctAtrzSeCd}/>
                    <CustomLabelValue props={labelValue.utztnDt} onSelect={handleChgDate} value={dateValue?.utztnDt}/>
                    <CustomLabelValue props={labelValue.useOffic} onSelect={handleChgValue} value={cashValue?.useOffic}/>
                    <CustomLabelValue props={labelValue.utztnAmt} onSelect={handleChgValue} value={cashValue?.utztnAmt}/>
                    <AutoCompleteProject
                        placeholderText="프로젝트 명"
                        onValueChange={(e) => handleChgValue({name: "prjctId", value: e})}
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