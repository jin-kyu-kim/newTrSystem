export const validateFields = (selectedItem, placeholderAndRequired, setValidationErrors) => {
    const newErrors = [];

    selectedItem.forEach(item => {
        const expensRules = placeholderAndRequired.find(rule => rule.expensCd === item.expensCd);
        if (expensRules) {
            const requiredFields = expensRules.required;
            if (requiredFields.ctPrpos && !item.ctPrpos) {
                newErrors.push({
                    cardUseSn: item.cardUseSn,
                    field: 'ctPrpos'
                });
            }
            if (requiredFields.atdrn && !item.atdrn) {
                newErrors.push({
                    cardUseSn: item.cardUseSn,
                    field: 'atdrn'
                });
            }
        }
    });
    setValidationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};

export const hasError = (validationErrors, cardUseSn, fieldName) => {
    return validationErrors.some(error => error.cardUseSn === cardUseSn && error.field === fieldName);
};