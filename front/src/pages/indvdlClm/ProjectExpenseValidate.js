import ApiRequest from 'utils/ApiRequest';

export const validateFields = async (selectedItem, placeholderAndRequired, setValidationErrors, buttonGroup) => {
    console.log('selectedItem!!!', selectedItem)

    const newErrors = [];
    const errorMessages = new Set();

    let smartPhoneErrors = 0;
    let dinnerErrors = false;
    let overAmtErrors = false;
    
    if (selectedItem.length === 0) {
        newErrors.push('error');
        errorMessages.add('선택된 사용내역이 없습니다.');
    }

    if (selectedItem.some(item => item.prjctId === null || (buttonGroup.length < 2 && !item.prjctId))) {
        newErrors.push('error');
        errorMessages.add('프로젝트를 선택해주세요');
    }

    if (selectedItem.some(item => item.prjctId !== null && (item.expensCd === null || (buttonGroup.length < 2 && !item.expensCd)))) {
        newErrors.push('error');
        errorMessages.add('비용코드를 선택해주세요');
    }

    // 비용코드에 따른 필수값 검사
    selectedItem.forEach(item => {
        const expensRules = placeholderAndRequired.find(rule => rule.expensCd === item.expensCd);

        if (expensRules) {
            const requiredFields = expensRules.required;

            if (requiredFields.ctPrpos && !item.ctPrpos) {
                newErrors.push({
                    cardUseSn: item.cardUseSn || null, // 단건 입력에서는 cardUseSn이 없을 수 있으므로 null 처리
                    field: 'ctPrpos'
                });
                errorMessages.add('모든 필수항목을 입력해주세요.');
            }
            if (requiredFields.atdrn && (!item.atdrn || item.atdrn.length === 0)) {
                newErrors.push({
                    cardUseSn: item.cardUseSn || null,
                    field: 'atdrn'
                });
                errorMessages.add('모든 필수항목을 입력해주세요.');
            }

            if (item.expensCd === 'VTW04509') {

                checkSmartPhoneValidation(selectedItem).then(result => {
                    if (smartPhoneErrors !== 0) {
                        smartPhoneErrors = result;
                        errorMessages.add(expensRules.message);
                    }
                })

            } else if (item.expensCd === 'VTW04531' && item.atdrn && item.atdrn.length > 0) {

                checkDinnerValidation(selectedItem).then(result => {
                    if (result) {
                        dinnerErrors = result;
                        errorMessages.add('해당 사용일자에 이미 야근식대를 사용한 직원이 포함되어있습니다.');
                    }
                })

                overAmtErrors = checkDinnerAmt(item)
                if(overAmtErrors){
                    errorMessages.add('야근식대는 1인 최대 15,000원까지 가능합니다.');
                }
            }

        }
    });
    setValidationErrors(newErrors);

    return {
        isValid: newErrors.length === 0 && smartPhoneErrors === 0 && !dinnerErrors && !overAmtErrors,
        messages: Array.from(errorMessages)
    };
};

export const hasError = (validationErrors, cardUseSn, fieldName) => {
    if (cardUseSn !== null) {
        return validationErrors.some(error => error.cardUseSn === cardUseSn && error.field === fieldName);
    } else {
        return validationErrors.some(error => error.field === fieldName);
    }
};

/** 스마트폰지원 중복 유효성 검사 */
const checkSmartPhoneValidation = async (selectedItem) => {
    let smartPhoneCnt = 0;

    const param = {
        queryId: 'indvdlClmMapper.retrieveMoblphonDpcnYn',
        aplyYm: selectedItem[0].aplyYm,
        empId: selectedItem[0].empId,
    };
    try {
        const response = await ApiRequest('/boot/common/queryIdSearch', param);
        smartPhoneCnt = response[0].cnt;
    } catch (error) {
        console.log(error);
    }
    return smartPhoneCnt;
}

/** 야근식대 횟수 유효성 검사 */
const checkDinnerValidation = async (selectedItem) => {
    let dinnerList = [];

    const param = {
        queryId: 'indvdlClmMapper.retrieveDinnrDpcnYn',
        utztnDt: selectedItem[0].utztnDt,
    };
    try {
        // 해당 사용일의 야근식대 전체 참석자
        const response = await ApiRequest('/boot/common/queryIdSearch', param);
        dinnerList = response.map(dinner => dinner);
    } catch (error) {
        console.log(error);
    }
    console.log('dinnerList', dinnerList)

    let isMatch = false;

    if (selectedItem.some(item => item.atdrn)) {
        selectedItem.map(one => {
            isMatch = one.atdrn.some(person =>
                dinnerList.some(dinner =>
                    dinner.atdrn.split(',').includes(person.value)
                )
            )
        })
    }
    return isMatch;
}

/** 야근식대 1인 금액 유효성 검사 */
const checkDinnerAmt = (selectedOne) => {
    let isOverAmt = false;

    if(selectedOne.atdrn.length * 15000 < selectedOne.utztnAmt){
        isOverAmt = true;
    }
    return isOverAmt;
}