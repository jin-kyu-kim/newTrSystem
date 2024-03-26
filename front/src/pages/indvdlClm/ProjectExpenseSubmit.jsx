import React from "react";
import Button from "devextreme-react/button";
import ApiRequest from "../../utils/ApiRequest";
import axios from "axios";

const button = {
    borderRadius: '5px',
    width: 'auto',
    marginTop: '20px',
    marginRight: '15px'
}

const ProjectExpenseSubmit = (props) => {

    const handleSubmit = async() => {
        let params = [];
        try{
            params = [{
                tbNm: "PRJCT_INDVDL_CT_MM"
            }, {
                "prjctId": props.value[0].prjctId,
                "empId": props.value[0].empId,
                "aplyYm": props.value[0].aplyYm,
                "aplyOdr": props.value[0].aplyOdr
            }]
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
        } catch (e) {
            window.alert("오류가 발생했습니다. 사용내역을 선택했는지 확인해 주세요.")
        }
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
            const params = [{ tbNm: props.tbNm, snColumn: props.snColumn }];
            props.value.forEach(value => {
                value.utztnAmt = value.utztnAmt.replace(",","");
                params.push(value);
            })
            try {
                const response = await ApiRequest("/boot/common/commonInsert", params);
                if (response === 1) {
                    window.location.reload();
                    window.alert("등록되었습니다.")
                }
            } catch (error) {
                console.error("API 요청 에러:", error);
                throw error;
            }
        }
    }

    return(
        <Button style={button} type={props.type} text={props.text} onClick={handleSubmit}></Button>
    );
};

export default ProjectExpenseSubmit;