import ApiRequest from 'utils/ApiRequest';

const CASH_FIELDS = ["ctStlmSeCd", "utztnDt", "useOffic", "utztnAmt"];

export const validateFields = async (selectedItem, placeholderAndRequired, setValidationErrors, buttonGroup, empInfo) => {
    let newErrors = [];
    let errorMessages = new Set();

    let smartPhoneErrors = 0;
    let dinnerErrors = false;
    let overAmtErrors = false;

    if (selectedItem.length === 0) {
        newErrors.push('error');
        errorMessages.add('선택된 사용내역이 없습니다.');
    }

    // 전체 필수 항목 검사
    for (const item of selectedItem) {

        const cashRequired = CASH_FIELDS.every(key => item[key] !== undefined);

        if (buttonGroup.length < 2 && !cashRequired) {
            newErrors.push('error');
            errorMessages.add('필수항목을 모두 입력해주세요.');

        } else if (item.prjctId === null || (buttonGroup.length < 2 && !item.prjctId)) {
            newErrors.push('error');
            errorMessages.add('프로젝트를 선택해주세요');

        } else if (item.prjctId !== null && (item.expensCd === null || (buttonGroup.length < 2 && !item.expensCd))) {
            newErrors.push('error');
            errorMessages.add('비용코드를 선택해주세요');
        }
        
        // 단일 등록시 사용가능 최대 금액 검사
        if (item.elctrnAtrzId === undefined) {
            if (checkMaxAmt(item.utztnAmt, empInfo)) {
                newErrors.push('error');
                errorMessages.add('최대 사용금액을 초과했습니다. 전자결재를 통해 신청해주시길 바랍니다.'); 
            }
        }

        // 비용코드에 따라 달라지는 필수항목 검사
        const expensRules = placeholderAndRequired.find(rule => rule.expensCd === item.expensCd);
        if (expensRules) {
            const requiredFields = expensRules.required;

            if (requiredFields.ctPrpos && !item.ctPrpos) {
                newErrors.push({
                    cardUseSn: item.cardUseSn || null, // 단건 입력에서는 cardUseSn이 없을 수 있으므로 null 처리
                    field: 'ctPrpos'
                });
                errorMessages.add('필수항목을 모두 입력해주세요.');
            }
            if (requiredFields.atdrn && (!item.atdrn || item.atdrn.length === 0)) {
                newErrors.push({
                    cardUseSn: item.cardUseSn || null,
                    field: 'atdrn'
                });
                errorMessages.add('필수항목을 모두 입력해주세요.');
            }

            if (item.expensCd === 'VTW04509') {
                const smartPhoneResult = await checkSmartPhoneValidation(item);
                if (smartPhoneResult !== 0) {
                    smartPhoneErrors = smartPhoneResult;
                    errorMessages.add(expensRules.message);
                }

            } else if (item.expensCd === 'VTW04531' && item.atdrn && item.atdrn.length > 0) {
                try {
                    const dinnerValidationResult = await checkDinnerValidation(item);
                    if (dinnerValidationResult) {
                        newErrors.push({
                            cardUseSn: item.cardUseSn || null,
                            field: 'atdrn'
                        });
                        dinnerErrors = true;
                        errorMessages.add('해당 사용일자에 이미 야근식대를 사용한 직원이 포함되어있습니다.');
                    }
                } catch (error) {
                    console.log(error);
                }

                overAmtErrors = checkDinnerAmt(item)
                if (overAmtErrors) {
                    newErrors.push({
                        cardUseSn: item.cardUseSn || null,
                        field: 'atdrn'
                    });
                    errorMessages.add('야근식대는 1인 최대 15,000원까지 가능합니다.');
                }
            }
        }
    };
    setValidationErrors(newErrors);

    return {
        isValid: newErrors.length === 0 && smartPhoneErrors === 0 && !dinnerErrors && !overAmtErrors,
        messages: Array.from(errorMessages)
    };
};

// 화면 표시를 위한 검사
export const hasError = (validationErrors, cardUseSn, fieldName) => {
    if (cardUseSn !== null) {
        return validationErrors.some(error => error.cardUseSn === cardUseSn && error.field === fieldName);
    } else {
        return validationErrors.some(error => error.field === fieldName);
    }
};

const checkSmartPhoneValidation = async (selectedItem) => {
    let smartPhoneCnt = 0;

    const param = {
        queryId: 'indvdlClmMapper.retrieveMoblphonDpcnYn',
        aplyYm: selectedItem.aplyYm,
        empId: selectedItem.empId,
    };
    try {
        const response = await ApiRequest('/boot/common/queryIdSearch', param);
        smartPhoneCnt = response[0].cnt;
    } catch (error) {
        console.log(error);
    }
    return smartPhoneCnt;
}

const checkDinnerValidation = async (selectedOne) => {
    let dinnerList = [];
    let isMatch = false;

    const param = {
        queryId: 'indvdlClmMapper.retrieveDinnrDpcnYn',
        utztnDt: selectedOne.utztnDt,
    };
    try {
        // 해당 사용일의 야근식대 전체 참석자
        const response = await ApiRequest('/boot/common/queryIdSearch', param);
        dinnerList = response;
    } catch (error) {
        console.log(error);
    }

    const atdrns = Object.values(selectedOne.atdrn).map(item => item.key);
    for (const item of dinnerList) {
        if (atdrns.includes(item.atndEmpId)) {
            isMatch = true;
            break;
        }
    }
    return isMatch;
}

const checkDinnerAmt = (selectedOne) => {
    let isOverAmt = false;

    if (selectedOne.atdrn.length * 15000 < selectedOne.utztnAmt) {
        isOverAmt = true;
    }
    return isOverAmt;
}

const checkMaxAmt = (utztnAmt, emp) => {
    const specialCase = ['VK1342', 'VK1039'];
    let result = false;
    
    if (specialCase.includes(emp.empno)) { // 본부장 - 80만원
        result = utztnAmt >= 800000;
    } else if (emp.jbttlCd === 'VTW01001') { // 부서장(팀장) - 50만원
        result = utztnAmt >= 500000;
    } else { // 일반직원 - 20만원
        result = utztnAmt >= 200000;
    }
    return result;
}