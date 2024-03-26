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
        const params = [{
            tbNm: "PRJCT_INDVDL_CT_MM"
        }, {
            "prjctId": props.value.prjctId,
            "empId": props.value.empId,
            "aplyYm": props.value.aplyYm,
            "aplyOdr": props.value.aplyOdr
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
            const params = [{ tbNm: props.tbNm, snColumn: props.snColumn }, props.value];
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