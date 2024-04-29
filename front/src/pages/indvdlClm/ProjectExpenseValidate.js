import ApiRequest from 'utils/ApiRequest';

export const validateFields = (selectedItem, placeholderAndRequired, setValidationErrors) => {
    console.log('Validation check', selectedItem);
    const newErrors = [];

    selectedItem.forEach(item => {
        const expensRules = placeholderAndRequired.find(rule => rule.expensCd === item.expensCd);
        if (expensRules) {
            const requiredFields = expensRules.required;
            if (requiredFields.ctPrpos && !item.ctPrpos) {
                newErrors.push({
                    cardUseSn: item.cardUseSn || null, // 단건 입력에서는 cardUseSn이 없을 수 있으므로 null 처리
                    field: 'ctPrpos'
                });
            }
            if (requiredFields.atdrn && !item.atdrn) {
                newErrors.push({
                    cardUseSn: item.cardUseSn || null, // 단건 입력에서는 cardUseSn이 없을 수 있으므로 null 처리
                    field: 'atdrn'
                });
            }
        }
    });
    // 추가된 유효성 검사 로직은 유지
    const smartPhoneCnt = checkSmartPhoneValidation(selectedItem, setValidationErrors);
    if(smartPhoneCnt !== 0){

    }
    // if (!checkDinnerValidation(selectedItem, setValidationErrors)) {
    //     newErrors.push({
    //         cardUseSn: selectedItem[0].cardUseSn || null, // 단건 입력에서는 cardUseSn이 없을 수 있으므로 null 처리
    //         field: 'atdrn'
    //     });
    // }

    setValidationErrors(newErrors);
    return newErrors.length === 0;
};



export const hasError = (validationErrors, cardUseSn, fieldName) => {
    if(cardUseSn !== null){
        return validationErrors.some(error => error.cardUseSn === cardUseSn && error.field === fieldName);
    } else{
        console.log(fieldName)
        return validationErrors.some(error => error.field === fieldName);
    }
};

// 스마트폰지원 중복 유효성 검사
const checkSmartPhoneValidation = async (selectedItem) => {
    let smartPhoneCnt = 0;
    const param = {
        queryId: 'indvdlClmMapper.retrieveMoblphonDpcnYn',
        aplyYm: selectedItem[0].aplyYm,
        empId: selectedItem[0].empId,
    };
    try{
        const response = await ApiRequest('/boot/common/queryIdSearch', param);
        smartPhoneCnt = response[0].cnt;
        console.log('smartPhoneCnt', smartPhoneCnt)
    }catch (error){
        console.log(error);
    }
    return smartPhoneCnt;
}

// 야근식대 중복 유효성 검사
const checkDinnerValidation = async (selectedItem) => {
    let dinnerList = [];
    
    const param = {
        queryId: 'indvdlClmMapper.retrieveDinnrDpcnYn',
        utztnDt: selectedItem[0].utztnDt,
    };
    try{
        const response = await ApiRequest('/boot/common/queryIdSearch', param);
        dinnerList.push(response);
    }catch (error){
        console.log(error);
    }

    let noMatched = true;
    const newEmpList = selectedItem[0].atdrn.split(',');

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