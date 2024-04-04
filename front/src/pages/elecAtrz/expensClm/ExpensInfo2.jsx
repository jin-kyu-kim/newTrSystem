import React, { useState } from "react";
import { Button } from 'devextreme-react/button';
import { SelectBox } from 'devextreme-react/select-box';
import { TextBox } from 'devextreme-react/text-box';
import { DateBox } from 'devextreme-react/date-box';

const ExpensInfo2 = () => {
    const [forms, setForms] = useState([
        {
            expenseTypeCode: "",
            receiptDate: "",
            participant: "",
            usePrice: "",
            usePriceAddTax: "",
            requestDate: "",
            expenseCode: "",
            usePlace: "",
            purpose: "",
            bankcode: "",
            accountHolder: "",
            accountNumber: ""
        }
    ]);

    const addForm = () => {
        const newForm = {
            expenseTypeCode: "",
            receiptDate: "",
            participant: "",
            usePrice: "",
            usePriceAddTax: "",
            requestDate: "",
            expenseCode: "",
            usePlace: "",
            purpose: "",
            bankcode: "",
            accountHolder: "",
            accountNumber: ""
        };
        setForms([...forms, newForm]);
    };

    const removeForm = (index) => {
        if (forms.length === 1) {
            return; // If only one form, do not remove
        }
        setForms(forms.filter((_, i) => i !== index));
    };

    return (
        <div>
            <h4>사용 경비 입력</h4>
            {forms.map((form, index) => (
                <div key={index}>
                    <div key={index} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <SelectBox
                            items={[
                                { value: "", text: "" },
                                { value: "VTW02301", text: "기업법인카드" },
                                { value: "VTW02303", text: "개인법인카드" },
                                { value: "VTW02302", text: "개인현금지급" },
                                { value: "VTW02304", text: "세금계산서/기타" }
                            ]}
                            value={form.expenseTypeCode}
                            onValueChanged={(e) => {
                                const updatedForms = [...forms];
                                updatedForms[index].expenseTypeCode = e.value;
                                setForms(updatedForms);
                            }}
                        />
                        <DateBox
                            value={form.receiptDate}
                            onValueChanged={(e) => {
                                const updatedForms = [...forms];
                                updatedForms[index].receiptDate = e.value;
                                setForms(updatedForms);
                            }}
                        />
                        <TextBox
                            value={form.participant}
                            onValueChanged={(e) => {
                                const updatedForms = [...forms];
                                updatedForms[index].participant = e.value;
                                setForms(updatedForms);
                            }}
                        />
                        <TextBox
                            value={form.usePrice}
                            onValueChanged={(e) => {
                                const updatedForms = [...forms];
                                updatedForms[index].usePrice = e.value;
                                setForms(updatedForms);
                            }}
                        />
                        <TextBox
                            value={form.usePriceAddTax}
                            onValueChanged={(e) => {
                                const updatedForms = [...forms];
                                updatedForms[index].usePriceAddTax = e.value;
                                setForms(updatedForms);
                            }}
                        />
                        <DateBox
                            value={form.requestDate}
                            onValueChanged={(e) => {
                                const updatedForms = [...forms];
                                updatedForms[index].requestDate = e.value;
                                setForms(updatedForms);
                            }}
                        />
                    </div>
                    <div key={index} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <SelectBox
                            items={[
                                { value: "", text: "" },
                                { value: "VTW02101", text: "야근식대" }
                            ]}
                            value={form.expenseCode}
                            onValueChanged={(e) => {
                                const updatedForms = [...forms];
                                updatedForms[index].expenseCode = e.value;
                                setForms(updatedForms);
                            }}
                        />
                        <TextBox
                            value={form.usePlace}
                            onValueChanged={(e) => {
                                const updatedForms = [...forms];
                                updatedForms[index].usePlace = e.value;
                                setForms(updatedForms);
                            }}
                        />
                        <TextBox
                            value={form.purpose}
                            onValueChanged={(e) => {
                                const updatedForms = [...forms];
                                updatedForms[index].purpose = e.value;
                                setForms(updatedForms);
                            }}
                        />
                        <SelectBox
                            items={[
                                { value: "", text: "" },
                                { value: "VTW02101", text: "은행1" }
                            ]}
                            value={form.bankcode}
                            onValueChanged={(e) => {
                                const updatedForms = [...forms];
                                updatedForms[index].bankcode = e.value;
                                setForms(updatedForms);
                            }}
                        />
                        <TextBox
                            value={form.accountHolder}
                            onValueChanged={(e) => {
                                const updatedForms = [...forms];
                                updatedForms[index].accountHolder = e.value;
                                setForms(updatedForms);
                            }}
                        />
                        <TextBox
                            value={form.accountNumber}
                            onValueChanged={(e) => {
                                const updatedForms = [...forms];
                                updatedForms[index].accountNumber = e.value;
                                setForms(updatedForms);
                            }}
                        />
                    </div>
                    <div>
                        {index === forms.length - 1 && (
                            <Button
                                text="추가"
                                onClick={addForm}
                            />
                        )}
                        <Button
                            text="삭제"
                            onClick={() => removeForm(index)}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};
export default ExpensInfo2;