import React, { useState, useEffect } from "react";
import { FormControl, InputLabel, Select, MenuItem, TextField, Button, Grid } from "@mui/material";
import { DateBox } from "devextreme-react/date-box";
import ApiRequest from "utils/ApiRequest";

const ExpensInfo = ({onSendData}) => {

    const [ctStlmSeCdList, setCtStlmSeCdList] = useState([]);
    const [bankCdList, setBankCdList] = useState([]);
    const [expensCdList, setExpensCdList] = useState([]);

    useEffect(() => {
        retrieveCtStlmSeCd();
        retrieveBankCd();
        retrieveCdList();
    }, []);

    useEffect(() => {
        console.log(ctStlmSeCdList)
    }, [ctStlmSeCdList]);

    const retrieveCtStlmSeCd = async () => {
        
        const param = [
            { tbNm: "CD" },
            { upCdValue: "VTW019" }
        ];

        try {
            const response = await ApiRequest("/boot/common/commonSelect", param);
            setCtStlmSeCdList(response);
        } catch (error) {
            console.error(error)
        }
    
    }

    const retrieveBankCd = async () => {
    
        const param = [
            { tbNm: "CD" },
            { upCdValue: "VTW035" }
        ];

        try {
            const response = await ApiRequest("/boot/common/commonSelect", param);
            setBankCdList(response);
        } catch (error) {
            console.error(error)
        }
    }
    
    const retrieveCdList = async () => {
        const param = [
            { tbNm: "CD" },
            { upCdValue: "VTW045" }
        ];

        try {
            const response = await ApiRequest("/boot/common/commonSelect", param);
            setExpensCdList(response);
        } catch (error) {
            console.error(error)
        }
    }

    const [forms, setForms] = useState([
        {
            ctStlmSeCd: "",
            taxBillPblcnYmd: "",
            dtlUseDtls: "",
            clmAmt: "",
            vatInclsAmt: "",
            dpstDmndYmd: "",
            expensCd: "",
            cnptNm: "",
            clmPrpos: "",
            bankCd: "",
            dpstrFlnm: "",
            dpstActno: ""
        }
    ]);

    const addForm = () => {
        // const newFormId = forms[forms.length - 1] + 1;
        setForms([...forms, {
            ctStlmSeCd: "",
            taxBillPblcnYmd: "",
            dtlUseDtls: "",
            clmAmt: "",
            vatInclsAmt: "",
            dpstDmndYmd: "",
            expensCd: "",
            cnptNm: "",
            clmPrpos: "",
            bankCode: "",
            dpstrFlnm: "",
            dpstActno: ""
        }]);
    };

    useEffect(() => {
        console.log(forms)
        onSendData(forms)

    },[forms]);

    const removeForm = (id) => {
        if (forms.length === 1) {
            return; // If only one form, do not remove
        }
        
        const newForms = forms.filter((formId) => formId !== id);

        setForms(newForms);
    };

    const handleInputChange = (e, index, fieldName) => {
        const newForms = [...forms];
        if (fieldName === "ctStlmSeCd") {
            if (e.target.value !== "VTW01904") {
                newForms[index]["dpstDmndYmd"] = "";
                newForms[index]["vatInclsAmt"] = "";
                newForms[index]["dpstActno"] = "";
                newForms[index]["dpstrFlnm"] = "";
                newForms[index]["bankCd"] = "";
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

        onSendData(forms)
    };

    return (
        
        <div className="expensInpt" style={{ marginTop: "15px", paddingTop: "5px", paddingBottom: "10px" }}>
            <h4>사용 경비 입력</h4>
            {forms.map((formId, index) => (
                <div key={index}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={1.5}>
                                    <FormControl fullWidth>
                                        <InputLabel>지출방법</InputLabel>
                                        <Select
                                            label="지출방법"
                                            value={forms[index].ctStlmSeCd}
                                            onChange={(e) => handleInputChange(e, index, "ctStlmSeCd")}
                                            autoWidth
                                        >

                                            {ctStlmSeCdList.map((item, index) => (
                                            <MenuItem key={index} value={item.cdValue}>
                                                {item.cdNm}
                                            </MenuItem>
                                            ))}
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
                                        label={forms[index].ctStlmSeCd !== "VTW01904" ? "영수증발행일" : "세금계산서발행일"}
                                        placeholder="사용일자"
                                        labelMode="floating"
                                        stylingMode="outlined"
                                        displayFormat="yyyy-MM-dd"
                                        dateSerializationFormat="yyyyMMdd"
                                        value={forms[index].ctStlmSeCd !== "VTW01904" ? forms[index].rciptPblcnYmd : forms[index].taxBillPblcnYmd}
                                        onValueChanged={(e) => handleDateChange(e.value, index, forms[index].ctStlmSeCd !== "VTW01904" ? "rciptPblcnYmd" : "taxBillPblcnYmd")}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        fullWidth
                                        id="dtlUseDtls"
                                        label="상세내역 (목적)"
                                        type="text"
                                        variant="outlined"
                                        value={forms[index].dtlUseDtls}
                                        onChange={(e) => handleInputChange(e, index, "dtlUseDtls")}
                                    />
                                </Grid>
                                <Grid item xs={1.5}>
                                    <TextField
                                        fullWidth
                                        id="clmAmt"
                                        label="금액"
                                        type="number"
                                        variant="outlined"
                                        value={forms[index].clmAmt}
                                        onChange={(e) => handleInputChange(e, index, "clmAmt")}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <TextField
                                        fullWidth
                                        id="vatInclsAmt"
                                        label="금액(부가세포함)"
                                        type="text"
                                        variant="outlined"
                                        value={forms[index].vatInclsAmt}
                                        onChange={(e) => handleInputChange(e, index, "vatInclsAmt")}
                                        disabled={forms[index].ctStlmSeCd !== "VTW01904"}
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
                                        displayFormat="yyyy-MM-dd"
                                        dateSerializationFormat="yyyyMMdd"
                                        value={forms[index].dpstDmndYmd}
                                        onValueChanged={(e) => handleDateChange(e.value, index, "dpstDmndYmd")}
                                        disabled={forms[index].ctStlmSeCd !== "VTW01904"}
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
                                            autoWidth
                                            value={forms[index].expensCd}
                                            onChange={(e) => handleInputChange(e, index, "expensCd")}
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 200, // 최대 표시할 항목 수에 맞게 조정
                                                    },
                                                },
                                            }}
                                        >
                                            {expensCdList.map((item, index) => (
                                                <MenuItem key={index} value={item.cdValue}>{item.cdNm}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={2}>
                                    <TextField
                                        fullWidth
                                        id="cnptNm"
                                        label="거래처명"
                                        type="text"
                                        variant="outlined"
                                        value={forms[index].cnptNm}
                                        onChange={(e) => handleInputChange(e, index, "cnptNm")}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        fullWidth
                                        id="clmPrpos"
                                        label="용도 (참석자 명단)"
                                        type="text"
                                        variant="outlined"
                                        value={forms[index].clmPrpos}
                                        onChange={(e) => handleInputChange(e, index, "clmPrpos")}
                                    />
                                </Grid>
                                <Grid item xs={1.5}>
                                    <FormControl fullWidth>
                                        <InputLabel>은행코드</InputLabel>
                                        <Select
                                            label="은행코드"
                                            value={forms[index].bankCd}
                                            onChange={(e) => handleInputChange(e, index, "bankCd")}
                                            disabled={forms[index].ctStlmSeCd !== "VTW01904"}
                                            autoWidth
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 200, // 최대 표시할 항목 수에 맞게 조정
                                                    },
                                                },
                                            }}
                                        >
                                            {bankCdList.map((item, index) => (
                                                <MenuItem key={index} value={item.cdValue}>{item.cdNm}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={2}>
                                    <TextField
                                        fullWidth
                                        id="dpstrFlnm"
                                        label="예금주"
                                        type="text"
                                        variant="outlined"
                                        value={forms[index].dpstrFlnm}
                                        onChange={(e) => handleInputChange(e, index, "dpstrFlnm")}
                                        disabled={forms[index].ctStlmSeCd !== "VTW01904"}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <TextField
                                        fullWidth
                                        id="dpstActno"
                                        label="입금계좌"
                                        type="text"
                                        variant="outlined"
                                        value={forms[index].dpstActno}
                                        onChange={(e) => handleInputChange(e, index, "dpstActno")}
                                        disabled={forms[index].ctStlmSeCd !== "VTW01904"}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container justifyContent="right">
                        {index === forms.length - 1 && (
                            <Button
                                variant="contained"
                                color="primary"
                                style={{ marginTop: "10px", marginRight: "10px", marginBottom: "10px"}}
                                onClick={addForm}
                            >
                                추가
                            </Button>
                        )}
                        <Button
                            variant="contained"
                            color="secondary"
                            style={{ marginTop: "10px", marginBottom: "10px" }}
                            onClick={() => removeForm(formId)}
                        >
                            삭제
                        </Button>
                    </Grid>
                </div>
            ))}

            <Button onClick={()=>handleSubmit()}>체크</Button>
            
            <hr/>
            <div>* 현재 TR 입력 차수: </div>
            <div>* 마감 여부: </div>
            <br/>
            <div>1. 지출 방법: 개인법인카드, 개인현금</div>
            <div>

            </div>
            <br/>
            <div>2. 지출 방법: 기업법인카드, 세금계산서</div>
            <div>

            </div>
            <br/>
            <div>현재 TR입력차수가 마감되어 다음차수로 반영될 경우 직접 마감취소 또는 경영지원팀으로 마감취소 요청 하시기 바랍니다.</div>
        </div>
    )

}
export default ExpensInfo;