import React, { useState, useEffect } from "react";
import { FormControl, InputLabel, Select, MenuItem, TextField, Button, Grid, TableCell } from "@mui/material";
import { DateBox } from "devextreme-react/date-box";
import ApiRequest from "utils/ApiRequest";

const ExpensInfo = ({onSendData, prjctId}) => {

    const [ctStlmSeCdList, setCtStlmSeCdList] = useState([]);
    const [bankCdList, setBankCdList] = useState([]);
    const [expensCdList, setExpensCdList] = useState([]);
    const [ clmOdr, setClmOdr ] = useState();
    const [ nextClmOdr, setNextClmOdr ] = useState();


    useEffect(() => {
        retrieveCtStlmSeCd();
        retrieveBankCd();
        retrieveExpensCdList();
        setExpensDate();
    }, []);

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
    
    const retrieveExpensCdList = async () => {
        const param = {
            "queryId": "elecAtrzMapper.retrieveExpensCdByPrmpc",
            prjctId: prjctId
        }

        try {
            const response = await ApiRequest("/boot/common/queryIdSearch", param);
            setExpensCdList(response);
        } catch (error) {
            console.error(error)
        }
    }
    
    const [forms, setForms] = useState([
        {
            clmAtrzDtlSn: 1,
            ctStlmSeCd: null,
            rciptPblcnYmd: null,
            taxBillPblcnYmd: null,
            dtlUseDtls: null,
            clmAmt: 0,
            vatInclsAmt: 0,
            dpstDmndYmd: null,
            expensCd: null,
            cnptNm: null,
            clmPrpos: null,
            bankCd: null,
            dpstrFlnm: null,
            dpstActno: null
        }
    ]);

    const addForm = () => {
        const newClmAtrzDtlSn = forms[forms.length - 1].clmAtrzDtlSn + 1;

        setForms([...forms, {
            clmAtrzDtlSn: newClmAtrzDtlSn,
            ctStlmSeCd: "",
            rciptPblcnYmd: null,
            taxBillPblcnYmd: null,
            dtlUseDtls: null,
            clmAmt: 0,
            vatInclsAmt: 0,
            dpstDmndYmd: null,
            expensCd: null,
            cnptNm: null,
            clmPrpos: null,
            bankCd: null,
            dpstrFlnm: null,
            dpstActno: null
        }]);
    };

    useEffect(() => {

        let data = [{tbNm: "CLM_ATRZ_DTL"}, ...forms]

        onSendData(data)
    },[forms]);

    const removeForm = (selectForm) => {
        if (forms.length === 1) { // 하나일 경우 지우지 않는다.
            return; 
        }

        setForms(forms.filter((form) => form.clmAtrzDtlSn !== selectForm.clmAtrzDtlSn));
    };

    const handleInputChange = (e, index, fieldName) => {
        const newForms = [...forms];
        if (fieldName === "ctStlmSeCd") {
            if (e.target.value !== "VTW01904") {
                newForms[index]["dpstDmndYmd"] = null
                newForms[index]["vatInclsAmt"] = 0;
                newForms[index]["dpstActno"] = null;
                newForms[index]["dpstrFlnm"] = null;
                newForms[index]["bankCd"] = null;
            }
        }
        newForms[index][fieldName] = e.target.value;
        setForms(newForms);
    };

    const handleDateChange = (value, index, fieldName) => {
        const newForms = [...forms];
        newForms[index][fieldName] = value;
        setForms(newForms => [...newForms]);
    };

    const setExpensDate = () => {
        
        const today = new Date();

        let year = today.getFullYear();
        let month = today.getMonth() + 1; 
        const day = today.getDate();
        let odr;
        let nextOdr

        if (day <= 15) {
            odr = 2;
        } else {

            odr = 1;

        }
        
        if (month === 1) {
            if(day <= 15) {
                month = 12; // 1월인 경우 이전 연도 12월로 설정
                year--;
            } else {

            }
        } else {
            if(day <= 15) {
                month--; // 2월 이상인 경우 이전 월로 설정
            } 
        }
    
        // 월을 두 자리 숫자로 표현합니다.
        const monthString = (month < 10 ? '0' : '') + month;
        
        setClmOdr(`${year}${monthString}-${odr}`);

        let nextYear = today.getFullYear();
        let nextMonth = today.getMonth() + 1; 
        if(nextMonth > 12) {
            nextMonth = 1;
            nextYear++;
        }

        const nextMonthString = (nextMonth < 10 ? '0' : '') + nextMonth;

        if(odr === 1) {
            nextOdr = 2;
        } else {
            nextOdr = 1;
        }

        setNextClmOdr(`${nextYear}${nextMonthString}-${nextOdr}`);
    }

    const handleNumberInputChange = (e, index, fieldName) => {
        const { value } = e.target;
        const newValue = value.replace(/[^0-9]/g, ""); // 숫자 이외의 값 제거
        const newForms = [...forms];
        newForms[index][fieldName] = newValue;
        setForms(newForms);
      };

    return (
        
        <div className="expensInpt" style={{ marginTop: "15px", paddingTop: "5px", paddingBottom: "10px" }}>
            <h4>사용 경비 입력</h4>
            <div className="expens-form">
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Grid container spacing={2}>
                            <Grid item xs={1.5}>
                                <div className="expens-form-inputName">
                                    지출방법
                                </div>
                            </Grid>
                            <Grid item xs={2}>
                                <div className="expens-form-inputName">
                                    사용일자
                                </div>
                            </Grid>
                            <Grid item xs={3}>
                                <div className="expens-form-inputName">
                                    상세내역 (목적)
                                </div>
                            </Grid>
                            <Grid item xs={1.5}>
                                <div className="expens-form-inputName">
                                    금액
                                </div>
                            </Grid>
                            <Grid item xs={2}>
                                <div className="expens-form-inputName">
                                    금액(부가세포함)
                                </div>
                            </Grid>
                            <Grid item xs={2}>
                                <div className="expens-form-inputName">
                                    입금요청일
                                </div>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={2}>
                            <Grid item xs={1.5}>
                                <div className="expens-form-inputName">
                                    비용코드
                                </div>
                            </Grid>
                            <Grid item xs={2}>
                                <div className="expens-form-inputName">
                                    거래처명
                                </div>
                            </Grid>
                            <Grid item xs={3}>
                                <div className="expens-form-inputName">
                                    용도 (참석자 명단)
                                </div>
                            </Grid>
                            <Grid item xs={5.5}>
                                <div className="expens-form-inputName">
                                    은행 / 예금주 / 계좌번호
                                </div>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <br/>
                {forms.map((form, index) => (
                    <div key={index}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Grid container spacing={2}>
                                    <Grid item xs={1.5}>
                                        <FormControl fullWidth variant="outlined">
                                            <InputLabel>지출방법</InputLabel>
                                            <Select
                                                label="지출방법"
                                                value={forms[index].ctStlmSeCd}
                                                onChange={(e) => handleInputChange(e, index, "ctStlmSeCd")}
                                                fullWidth
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
                                        <DateBox
                                            label={forms[index].ctStlmSeCd !== "VTW01904" ? "영수증발행일" : "세금계산서발행일"}
                                            labelMode="floating"
                                            stylingMode="outlined"
                                            displayFormat="yyyy-MM-dd"
                                            dateSerializationFormat="yyyyMMdd"
                                            value={forms[index].ctStlmSeCd !== "VTW01904" ? forms[index].rciptPblcnYmd : forms[index].taxBillPblcnYmd}
                                            onValueChanged={(e) => handleDateChange(e.value, index, forms[index].ctStlmSeCd !== "VTW01904" ? "rciptPblcnYmd" : "taxBillPblcnYmd")}
                                            width="100%"
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
                                            type="text"
                                            variant="outlined"
                                            value={parseInt(forms[index].clmAmt).toLocaleString()}
                                            onChange={(e) => handleNumberInputChange(e, index, "clmAmt")}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <TextField
                                            fullWidth
                                            id="vatInclsAmt"
                                            label="금액(부가세포함)"
                                            type="text"
                                            variant={forms[index].ctStlmSeCd !== "VTW01904" ? "filled" : "outlined"}
                                            value={parseInt(forms[index].vatInclsAmt).toLocaleString()}
                                            onChange={(e) => handleNumberInputChange(e, index, "vatInclsAmt")}
                                            disabled={forms[index].ctStlmSeCd !== "VTW01904"}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
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
                                        <FormControl fullWidth variant="outlined">
                                            <InputLabel>비용코드</InputLabel>
                                            <Select
                                                label="비용코드"
                                                fullWidth
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
                                        <FormControl fullWidth variant={forms[index].ctStlmSeCd !== "VTW01904" ? "filled" : "outlined"}>
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
                                            variant={forms[index].ctStlmSeCd !== "VTW01904" ? "filled" : "outlined"}
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
                                            variant={forms[index].ctStlmSeCd !== "VTW01904" ? "filled" : "outlined"}
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
                                onClick={() => removeForm(form)}
                            >
                                삭제
                            </Button>
                        </Grid>
                        <hr/>
                    </div>
                ))}
            </div>

            <hr/>
            <div>* 현재 TR 입력 차수: { clmOdr }</div>
            <div>* 마감 여부: </div>
            <br/>
            <div>1. 지출 방법: 개인법인카드, 개인현금</div>
            <br/>
            <div>
                <table className="expensInfo-table">
                    <thead>
                        <tr>
                            <th style={{width: '70%'}}>
                                사용일자
                            </th>
                            <th>
                                반영차수
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                2024년 03월 31일 이전
                            </td>
                            <td>
                                {nextClmOdr} 차수
                            </td>
                        </tr>
                        <tr>
                            <td>
                                2024년 03월 31일 이후
                            </td>
                            <td>
                                해당차수 반영
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <br/>
            <div>2. 지출 방법: 기업법인카드, 세금계산서</div>
            <br/>
            <div>
                <table className="expensInfo-table">
                    <thead>
                        <tr>
                            <th style={{width: '70%'}}>
                                사용일자
                            </th>
                            <th>
                                반영차수
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                전체
                            </td>
                            <td>
                                해당차수 반영
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <br/>
            <div>현재 TR입력차수가 마감되어 다음차수로 반영될 경우 직접 마감취소 또는 경영지원팀으로 마감취소 요청 하시기 바랍니다.</div>
        </div>
    )

}
export default ExpensInfo;