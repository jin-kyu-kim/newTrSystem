import React, {useEffect, useState} from "react";
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
    const [smartPhoneCnt, setSmartPhoneCnt] = useState([1]);
    const [dinnerList, setDinnerList] = useState([]);
    const [response, setResponse] = useState(0);
    const [atrzResponse, setAtrzResponse] = useState(0);
    const [prjctCtAplySn, setPrjctCtAplySn] = useState();

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const hours = String(currentDate.getHours()).padStart(2, "0");
    const minutes = String(currentDate.getMinutes()).padStart(2, "0");
    const seconds = String(currentDate.getSeconds()).padStart(2, "0");

    const formattedDate = `${year}${month}${day}${hours}${minutes}${seconds}`;


    // 필수값 유효성 검사
    const checkRequiredValidation = () => {

        let required = true;

        for (let i = 0; i < props.requiredValidation.length; i++) {
            const propertyName = props.requiredValidation[i];
            const propertyValue = props.value[0][propertyName]; // 해당 속성의 값


            if (!props.value[0].hasOwnProperty(propertyName) || propertyValue === null) {
                required = false;
                
                break;
            }
        }

        return required;
    }

    // 스마트폰지원 중복 유효성 검사
    const checkSmartPhoneValidation = async () => {

        const param = {
            queryId: 'indvdlClmMapper.retrieveMoblphonDpcnYn',
            aplyYm: props.value[0].aplyYm,
            empId: props.value[0].empId,
        };
        try{
            const response = await ApiRequest('/boot/common/queryIdSearch', param);
            setSmartPhoneCnt(response[0].cnt);
        }catch (error){
            console.log(error);
        }
        return smartPhoneCnt;
    }

    // 야근식대 중복 유효성 검사
    const getDinnerEmpList = async () => {

        const param = {
            queryId: 'indvdlClmMapper.retrieveDinnrDpcnYn',
            utztnDt: props.value[0].utztnDt,
        };

        try{
            const response = await ApiRequest('/boot/common/queryIdSearch', param);
            setDinnerList(response);
        }catch (error){
            console.log(error);
        }
    }

    const checkDinnerValidation = () => {

        getDinnerEmpList();

        let noMatched = true;
        const newEmpList = props.value[0].atdrn.split(',');

        for (let i = 0; i < newEmpList.length; i++){
            for (let j = 0; j < dinnerList.length; j++) {
                const splitString = dinnerList[j].atdrn.split(',');
                const matchEmpID = splitString.some(item => item === newEmpList[i]);

                if(matchEmpID)
                    noMatched = false;

                break;

            }
        }

        return noMatched;
    }

    const handleSubmit = async() => {
        try{

            const requiredValidation = checkRequiredValidation();

            // 필수값 유효성 검사
            if(!requiredValidation){
                window.alert('필수값을 모두 입력해주세요.')
                return;
            }

            // 스마트폰지원 중복 유효성 검사
            if(props.value[0].expensCd === 'VTW04509'){
                checkSmartPhoneValidation();
                if (smartPhoneCnt !== 0){
                    window.alert('스마트폰지원은 한 달에 한 번 신청 가능합니다.')
                    return;
                }
            }

            // 야근식대 중복 유효성 검사
            if(props.value[0].expensCd === 'VTW04531'){
                const dinnerValidation = checkDinnerValidation();
                if (!dinnerValidation){
                    window.alert('야근식대는 같은 날 중복 신청할 수 없습니다.')
                    return;
                }
            }
            
            // 이번 차수 유효성 검사
            
            // 중복 승인번호 유효성 검사

            const confirmResult = window.confirm("등록하시겠습니까?");

            if (confirmResult) {

                let params = [];
                props.value.forEach((data) => {
                    params.push({
                        "prjctId": data.prjctId,
                        "empId": data.empId,
                        "aplyYm": data.aplyYm,
                        "aplyOdr": data.aplyOdr,
                        "mmAtrzCmptnYn": "N"
                    })
                });

                insertMM(params);

                // insertValue() 함수 호출 후 완료될 때까지 기다림
                await insertValue();

                // getPrjctCtAplySn() 및 insertAtrzValue() 함수 호출
                await getPrjctCtAplySn();

            }
        } catch (e) {
            window.alert("오류가 발생했습니다. 사용내역을 선택했는지 확인해 주세요.")
        }
    };



    const insertMM = async (params) => {
        const response = await axios.post("/boot/indvdlClm/insertPrjctMM", params);
        return response;
    }

    const insertValue = async () => {
        const params = [{tbNm: props.tbNm, snColumn: props.snColumn}];

        props.value.forEach(value => {
            if (typeof value.prjctId === "object") {
                value.prjctId = value.prjctId[0].prjctId;
            }
            if (typeof value.utztnAmt === "string") {
                value.utztnAmt = value.utztnAmt.replace(",", "");
            }
            params.push(value);
        })

        try {
            const insertResponse = await ApiRequest("/boot/common/commonInsert", params);

            setResponse(insertResponse);
        } catch (error) {
            console.error("API 요청 에러:", error);
            throw error;
        }

        console.log('response',response)

    }

    const insertAtrzValue = async () => {
        const atrzParams = [{tbNm: props.atrzTbNm}];

        console.log('prjctCtAplySn',prjctCtAplySn)

        atrzParams.push({
            prjctCtAplySn: prjctCtAplySn,
            prjctId: props.value[0].prjctId,
            empId: props.value[0].empId,
            aplyYm: props.value[0].aplyYm,
            aplyOdr: props.value[0].aplyOdr
        });

        try {
            const insertResponse = await ApiRequest("/boot/common/commonInsert", atrzParams);

            setAtrzResponse(insertResponse);

            console.log('atrzResponse', atrzResponse);

            // insertAtrzValue() 함수 완료 후 실행되는 부분
            if (insertResponse === 1) {
                window.location.reload();
                window.alert("등록되었습니다.");
            }

        } catch (error) {
            console.error("API 요청 에러:", error);
            throw error;
        }
        console.log('atrzResponse',atrzResponse)
    }

    useEffect(() => {
        console.log('response[0].prjctCtAplySn', prjctCtAplySn);
        if (prjctCtAplySn !== undefined && prjctCtAplySn !== null) {
            // prjctCtAplySn 값이 정의되었을 때 로직 실행
            insertAtrzValue();
        }
    }, [prjctCtAplySn]);

    const getPrjctCtAplySn = async () => {

        const param = {
            queryId: 'indvdlClmMapper.retrievePrjctCtAplySn',
            prjctId: props.value[0].prjctId,
            empId: props.value[0].empId,
            aplyYm: props.value[0].aplyYm,
            aplyOdr: props.value[0].aplyOdr
        };

        try{
            const response = await ApiRequest('/boot/common/queryIdSearch', param);
            console.log('getPrjctCtAplySn response:', response);

            setPrjctCtAplySn(response[0].prjctCtAplySn);

        }catch (error){
            console.log(error);
        }
    }

    const handleValidating = (e) => {
        console.log(e)
        if (!e.validationGroup.validate().isValid) {
            alert('aa')
            e.preventDefault(); // 제출 동작을 취소합니다.
        }

        return;
    };


    return(
        <Button
            style={button}
            type={props.type}
            text={props.text}
            onClick={handleSubmit}
            useSubmitBehavior={true}
            onValidating={handleValidating}
        >
        </Button>
    );
};

export default ProjectExpenseSubmit;