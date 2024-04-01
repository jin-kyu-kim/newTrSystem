import React, { useState } from "react";
import { FormControl, InputLabel, Select, MenuItem, TextField, Button, Grid } from '@mui/material';

import { DateBox } from 'devextreme-react/date-box';
const ExpensInfo = () => {

    const [forms, setForms] = useState([
        {
            expenseTypeCode: '',
            receiptDate: '',
            participant: '',
            usePrice: '',
            usePriceAddTax: '',
            requestDate: '',
            expenseCode: '',
            usePlace: '',
            purpose: '',
            bankCode: '',
            accountHolder: '',
            accountNumber: ''
        }
    ]);

    const addForm = () => {
        const newFormId = forms[forms.length - 1] + 1;
        setForms([...forms, {
            expenseTypeCode: '',
            receiptDate: '',
            participant: '',
            usePrice: '',
            usePriceAddTax: '',
            requestDate: '',
            expenseCode: '',
            usePlace: '',
            purpose: '',
            bankCode: '',
            accountHolder: '',
            accountNumber: ''
        }]);
    };

    const removeForm = (id) => {
        if (forms.length === 1) {
            return; // If only one form, do not remove
        }
        setForms(forms.filter((formId) => formId !== id));
    };

    const handleInputChange = (e, index, fieldName) => {
        const newForms = [...forms];
        if (fieldName === 'expenseTypeCode') {
            if (e.target.value !== 'VTW02304') {
                newForms[index]['accountNumber'] = '';
                newForms[index]['accountHolder'] = '';
                newForms[index]['bankCode'] = '';
            }
        }
        newForms[index][fieldName] = e.target.value;
        setForms(newForms);
    };

    const handleDateChange = (value, index, fieldName) => {
        const newForms = [...forms];
        newForms[index][fieldName] = value;
        setForms(newForms);
    };

    const handleSubmit = () => {
        // 여기에 입력된 값들을 저장하거나 활용하는 로직을 작성합니다.
        console.log(forms);
    };

    return (
        
        <div className="jumbotron" style={{ marginTop: '15px', paddingTop: '5px', paddingBottom: '10px' }} id="divcostcontroll">
            <input type="hidden" name="totalBudget" id="totalBudget" value="" />
            <h4>사용 경비 입력</h4>
            {forms.map((formId, index) => (
                <div key={formId}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={1.5}>
                                    <FormControl fullWidth>
                                        <InputLabel>지출방법</InputLabel>
                                        <Select
                                            label="지출방법"
                                            native
                                            value={forms[index].expenseTypeCode}
                                            onChange={(e) => handleInputChange(e, index, 'expenseTypeCode')}
                                        >
                                            <option value=""></option>
                                            <option value="VTW02301">기업법인카드</option>
                                            <option value="VTW02303">개인법인카드</option>
                                            <option value="VTW02302">개인현금지급</option>
                                            <option value="VTW02304">세금계산서/기타</option>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={2}>
                                    {/* <TextField
                                        fullWidth
                                        id="UseDt"
                                        label="영수증발행일"
                                        type="text"
                                        variant="outlined"
                                        value=""
                                        onChange={() => {}}
                                        InputLabelProps={{ shrink: true }}
                                    /> */}
                                    <DateBox
                                        label="영수증발행일"
                                        labelMode="floating"
                                        stylingMode="outlined"
                                        displayFormat={"yyyy-MM-dd"}
                                        value={forms[index].receiptDate}
                                        onValueChanged={(e) => handleDateChange(e.value, index, 'receiptDate')}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        fullWidth
                                        id="participant"
                                        label="상세내역 (목적)"
                                        type="text"
                                        variant="outlined"
                                        value={forms[index].participant}
                                        onChange={(e) => handleInputChange(e, index, 'participant')}
                                    />
                                </Grid>
                                <Grid item xs={1.5}>
                                    <TextField
                                        fullWidth
                                        id="usePrice"
                                        label="금액"
                                        type="text"
                                        variant="outlined"
                                        value={forms[index].usePrice}
                                        onChange={(e) => handleInputChange(e, index, 'usePrice')}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <TextField
                                        fullWidth
                                        id="usePrice"
                                        label="금액(부가세포함)"
                                        type="text"
                                        variant="outlined"
                                        value={forms[index].usePriceAddTax}
                                        onChange={(e) => handleInputChange(e, index, 'usePriceAddTax')}
                                        disabled={forms[index].expenseTypeCode !== 'VTW02304'}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    {/* <TextField
                                        fullWidth
                                        id="usePrice"
                                        label="입금요청일"
                                        type="text"
                                        variant="outlined"
                                        value=""
                                        onChange={() => {}}
                                    /> */}
                                    <DateBox 
                                        label="입금요청일"
                                        labelMode="floating"
                                        stylingMode="outlined"
                                        displayFormat={"yyyy-MM-dd"}
                                        value={forms[index].requestDate}
                                        onValueChanged={(e) => handleDateChange(e.value, index, 'requestDate')}
                                        disabled={forms[index].expenseTypeCode !== 'VTW02304'}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={1.5}>
                                    <FormControl fullWidth>
                                        <InputLabel>비용코드</InputLabel>
                                        <Select
                                            label="비용코드"
                                            native
                                            value={forms[index].expenseCode}
                                            onChange={(e) => handleInputChange(e, index, 'expenseCode')}
                                        >
                                            <option value=""></option>
                                            <option value="VTW02101">야근식대</option>
                                            {/* Add other options */}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={2}>
                                    <TextField
                                        fullWidth
                                        id="usePlace"
                                        label="거래처명"
                                        type="text"
                                        variant="outlined"
                                        value={forms[index].usePlace}
                                        onChange={(e) => handleInputChange(e, index, 'usePlace')}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        fullWidth
                                        id="purpose"
                                        label="용도 (참석자 명단)"
                                        type="text"
                                        variant="outlined"
                                        value={forms[index].purpose}
                                        onChange={(e) => handleInputChange(e, index, 'purpose')}
                                    />
                                </Grid>
                                <Grid item xs={1.5}>
                                    <FormControl fullWidth>
                                        <InputLabel>은행코드</InputLabel>
                                        <Select
                                            label="은행코드"
                                            native
                                            value={forms[index].bankCode}
                                            onChange={(e) => handleInputChange(e, index, 'bankCode')}
                                            inputProps={{
                                                name: 'expenseCode',
                                                id: 'expenseCode',
                                            }}
                                            disabled={forms[index].expenseTypeCode !== 'VTW02304'}
                                        >
                                            <option value=""></option>
                                            <option value="VTW02101">은행1</option>
                                            {/* Add other options */}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={2}>
                                    <TextField
                                        fullWidth
                                        id="usePlace"
                                        label="예금주"
                                        type="text"
                                        variant="outlined"
                                        value={forms[index].accountHolder}
                                        onChange={(e) => handleInputChange(e, index, 'accountHolder')}
                                        disabled={forms[index].expenseTypeCode !== 'VTW02304'}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <TextField
                                        fullWidth
                                        id="usePlace"
                                        label="입금계좌"
                                        type="text"
                                        variant="outlined"
                                        value={forms[index].accountNumber}
                                        onChange={(e) => handleInputChange(e, index, 'accountNumber')}
                                        disabled={forms[index].expenseTypeCode !== 'VTW02304'}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    {/* <Grid container spacing={2}> */}

                        {/* Add other input fields */}
                    {/* </Grid> */}
                    <Grid container justifyContent="center">
                        {index === forms.length - 1 && (
                            <Button
                                variant="contained"
                                color="primary"
                                style={{ marginTop: '10px', marginRight: '10px', marginBottom: '10px'}}
                                onClick={addForm}
                            >
                                추가
                            </Button>
                        )}
                        <Button
                            variant="contained"
                            color="secondary"
                            style={{ marginTop: '10px', marginBottom: '10px' }}
                            onClick={() => removeForm(formId)}
                        >
                            삭제
                        </Button>
                    </Grid>
                </div>
            ))}

            <Button onClick={()=>handleSubmit()}>체크</Button>
        </div>
    )

}
export default ExpensInfo;