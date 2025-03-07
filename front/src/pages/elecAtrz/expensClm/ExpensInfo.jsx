import React, { useState, useEffect } from "react";
import { FormControl, InputLabel, Select, MenuItem, TextField, Button, Grid } from "@mui/material";
import { DateBox } from "devextreme-react/date-box";
import ApiRequest from "utils/ApiRequest";

const ExpensInfo = ({ onSendData, prjctId, prjctData, data, sttsCd}) => {

    const [ctStlmSeCdList, setCtStlmSeCdList] = useState([]);
    const [bankCdList, setBankCdList] = useState([]);
    const [expensCdList, setExpensCdList] = useState([]);
    const [clmOdr, setClmOdr] = useState();
    const [nextClmOdr, setNextClmOdr] = useState();
    const [deadLineDate, setDeadLineDate] = useState();
    const [ctAtrzCmptnYn, setCtAtrzCmptnYn] = useState();
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    useEffect(() => {
        retrieveCtStlmSeCd();
        retrieveBankCd();
        retrieveExpensCdList();
        setExpensDate();
    }, [prjctData]);

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
        if (prjctData == undefined) {
            return;
        }
        const param = {
            "queryId": prjctData.prjctStleCd == "VTW01803" ? "elecAtrzMapper.retrieveExpensCdAll" : "elecAtrzMapper.retrieveExpensCdByPrmpc",
            prjctId: prjctId,
            prjctStleCd: prjctData.prjctStleCd,
        }
        try {
            const response = await ApiRequest("/boot/common/queryIdSearch", param);
            setExpensCdList(response);
        } catch (error) {
            console.error(error)
        }
    }
    const [forms, setForms] = useState([]);

    useEffect(() => {
        if (data.atrzDmndSttsCd === "VTW03701" || sttsCd === "VTW05407" || sttsCd === "VTW05405" || sttsCd === "VTW05406" ) {
            getTempData();

        } else if (data.selectedData) {
            let sn = 1;
            const tmpArr = data.selectedData.map(item => ({
                clmAtrzDtlSn: sn++,
                ctStlmSeCd: 'VTW01903',
                rciptPblcnYmd: String(item.utztnDt).substring(0, 8),
                taxBillPblcnYmd: null,
                dtlUseDtls: item.ctPrpos,
                clmAmt: item.utztnAmt,
                vat: 0,
                vatInclsAmt: 0,
                dpstDmndYmd: null,
                expensCd: item.expensCd,
                cnptNm: item.useOffic,
                clmPrpos: item.atdrn,
                bankCd: null,
                dpstrFlnm: null,
                dpstActno: null
            }));
            setForms(tmpArr);
        } else {
            setForms([
                {
                    clmAtrzDtlSn: 1,
                    ctStlmSeCd: null,
                    rciptPblcnYmd: null,
                    taxBillPblcnYmd: null,
                    dtlUseDtls: null,
                    clmAmt: 0,
                    vat: 0,
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
        }
    }, []);

    const getTempData = async () => {
        const param = {
            queryId: "elecAtrzMapper.retrieveTempClmAtrzDtl",
            elctrnAtrzId: data.elctrnAtrzId
        }
        const response = await ApiRequest("/boot/common/queryIdSearch", param);
        setForms(response);
    }

    const addForm = () => {
        const newClmAtrzDtlSn = forms[forms.length - 1].clmAtrzDtlSn + 1;
        setForms([...forms, {
            clmAtrzDtlSn: newClmAtrzDtlSn,
            ctStlmSeCd: null,
            rciptPblcnYmd: null,
            taxBillPblcnYmd: null,
            dtlUseDtls: null,
            clmAmt: 0,
            vat: 0,
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
        let data = [{ tbNm: "CLM_ATRZ_DTL" }, ...forms]
        onSendData(data)
    }, [forms]);

    const removeForm = (selectForm) => {
        if (forms.length === 1) { // 하나일 경우 지우지 않는다.
            return;
        }
        setForms([...forms.filter((form) => form.clmAtrzDtlSn !== selectForm.clmAtrzDtlSn)]);
    };

    const handleInputChange = (e, index, fieldName) => {
        const newForms = [...forms];
        if (fieldName === "ctStlmSeCd") {
            if (e.target.value !== "VTW01904") {
                newForms[index]["taxBillPblcnYmd"] = null
                newForms[index]["dpstDmndYmd"] = null
                newForms[index]["vatInclsAmt"] = 0;
                newForms[index]["vat"] = 0;
                newForms[index]["dpstActno"] = null;
                newForms[index]["dpstrFlnm"] = null;
                newForms[index]["bankCd"] = null;
            }else{
                newForms[index]["rciptPblcnYmd"] = null
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

    /**
     * 청구 차수 및 날짜 계산
     */
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
            if (day <= 15) {
                month = 12; // 1월인 경우 이전 연도 12월로 설정
                year--;
            } else {

            }
        } else {
            if (day <= 15) {
                month--; // 2월 이상인 경우 이전 월로 설정
            }
        }

        // 월을 두 자리 숫자로 표현합니다.
        const monthString = (month < 10 ? '0' : '') + month;

        setClmOdr(`${year}${monthString}-${odr}`);
        getDeadLineDate(odr);

        let aplyYm = `${year}${monthString}`

        chkCtAtrzCmptnYn(aplyYm, odr);

        let nextYear = today.getFullYear();
        let nextMonth = today.getMonth() + 1;
        if (nextMonth > 12) {
            nextMonth = 1;
            nextYear++;
        }

        const nextMonthString = (nextMonth < 10 ? '0' : '') + nextMonth;

        if (odr === 1) {
            nextOdr = 2;
        } else {
            nextOdr = 1;
        }

        setNextClmOdr(`${nextYear}${nextMonthString}-${nextOdr}`);
    }

    const getDeadLineDate = async (odr) => {

        const param = {
            queryId: "elecAtrzMapper.retrieveDeadLineDate",
            crtrOdr: odr
        }

        try {
            const response = await ApiRequest("/boot/common/queryIdSearch", param);
            setDeadLineDate(response[0].deadLineDate);
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * 숫자 input 값 처리
     * @param {*} e 
     * @param {*} index 
     * @param {*} fieldName 
     */
    const handleNumberInputChange = (e, index, fieldName) => {
        const { value } = e.target;


        let newValue = value.replace(/[^0-9]/g, ""); // 숫자 이외의 값 제거
        if(fieldName === "clmAmt" || fieldName === "vatInclsAmt" || fieldName === "vat") {
            if(newValue === "") {
                newValue = 0;
            }
        }
        const newForms = [...forms];
        newForms[index][fieldName] = newValue;
        setForms(newForms);

        if(fieldName === "vat") {
            onCalVat(index)
        }
    };

    /**
     * 부가세 계산(10%)
     * @param {} index 
     */
    const onCalVat = (index) => {
        const newForms = [...forms];
        if(newForms[index].ctStlmSeCd === "VTW01904") {
            newForms[index]["vatInclsAmt"] = parseInt(forms[index].clmAmt) + parseInt(forms[index].vat);
        } else if(forms[index].ctStlmSeCd === "VTW01905") {
            newForms[index]["vatInclsAmt"] = forms[index].clmAmt * 0.967;
        } else if (forms[index].ctStlmSeCd === "VTW01906") {
            newForms[index]["vatInclsAmt"] = forms[index].clmAmt * 0.912;
        }

        setForms(newForms);
    }

    const chkCtAtrzCmptnYn = async (aplyYm, odr) => {

        const param = [
            { tbNm: "PRJCT_INDVDL_CT_MM" },
            {
                prjctId: prjctId,
                empId: userInfo.empId,
                aplyYm: aplyYm,
                aplyOdr: odr
            }
        ]

        const response = await ApiRequest("/boot/common/commonSelect", param);
        if (response.length != 0) {
            setCtAtrzCmptnYn(response[0].ctAtrzCmptnYn);
        }
    }

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
                            <Grid item xs={1.1}>
                                <div className="expens-form-inputName">
                                    금액
                                </div>
                            </Grid>
                            <Grid item xs={2.4}>
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
                <br />
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
                                                readOnly={sttsCd === "VTW05405" ? true : false}
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
                                            readOnly={sttsCd === "VTW05405" ? true : false}
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
                                            disabled={sttsCd === "VTW05405" ? true : false}
                                        />
                                    </Grid>
                                    <Grid item xs={1.1}>
                                        <TextField
                                            fullWidth
                                            id="clmAmt"
                                            label="금액"
                                            type="text"
                                            variant="outlined"
                                            value={
                                                parseInt(forms[index].clmAmt) === NaN ? 0 : parseInt(forms[index].clmAmt).toLocaleString()
                                            }
                                            onChange={(e) => handleNumberInputChange(e, index, "clmAmt")}
                                            disabled={sttsCd === "VTW05405" ? true : false}
                                        />
                                    </Grid>
                                    <Grid item xs={1.1}>
                                        <div style={{width: "100%"}}>
                                            {forms[index].ctStlmSeCd === "VTW01904" ? 
                                            <TextField 
                                                fullWidth
                                                id="vat"
                                                label="VAT"
                                                type="text"
                                                variant="outlined"
                                                value={
                                                    parseInt(forms[index].vat) === NaN ? 0 : parseInt(forms[index].vat).toLocaleString()
                                                }
                                                onChange={(e) => handleNumberInputChange(e, index, "vat")}
                                                disabled={sttsCd === "VTW05405" ? true : false}
                                            /> 
                                            : 
                                            <Button
                                            variant="contained"
                                            style={{marginTop: "10px", width:"100%"}}
                                            disabled={sttsCd === "VTW05405" ? true : !["VTW01904", "VTW01905", "VTW01906"].includes(forms[index].ctStlmSeCd)}
                                            onClick={() => onCalVat(index)}
                                            >
                                                {forms[index].ctStlmSeCd === "VTW01905" ? "-3.3%" : 
                                                forms[index].ctStlmSeCd === "VTW01906" ? "-8.8%" : "세액"} 
                                            </Button>
                                            }
                                        </div>
                                    </Grid>
                                    <Grid item xs={1.3}>
                                        <TextField
                                            fullWidth
                                            id="vatInclsAmt"
                                            label="금액(부가세포함)"
                                            type="text"
                                            variant={!["VTW01904", "VTW01905", "VTW01906"].includes(forms[index].ctStlmSeCd) ? "filled" : "outlined"}
                                            value={
                                                parseInt(forms[index].vatInclsAmt) === NaN ? 0 : parseInt(forms[index].vatInclsAmt).toLocaleString()
                                            }
                                            onChange={(e) => handleNumberInputChange(e, index, "vatInclsAmt")}
                                            disabled={sttsCd === "VTW05405" ? true : !["VTW01904", "VTW01905", "VTW01906"].includes(forms[index].ctStlmSeCd)}
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
                                            disabled={sttsCd === "VTW05405" ? true : !["VTW01904", "VTW01905", "VTW01906"].includes(forms[index].ctStlmSeCd)}
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
                                                readOnly={sttsCd === "VTW05405" ? true : false}
                                            >
                                                {expensCdList.map((item, index) => (
                                                    <MenuItem key={index} value={item.expensCd}>{item.cdNm}</MenuItem>
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
                                            disabled={sttsCd === "VTW05405" ? true : false}
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
                                            disabled={sttsCd === "VTW05405" ? true : false}
                                        />
                                    </Grid>
                                    <Grid item xs={1.5}>
                                        <FormControl fullWidth variant={!["VTW01904", "VTW01905", "VTW01906"].includes(forms[index].ctStlmSeCd) ? "filled" : "outlined"}>
                                            <InputLabel>은행코드</InputLabel>
                                            <Select
                                                label="은행코드"
                                                value={forms[index].bankCd}
                                                onChange={(e) => handleInputChange(e, index, "bankCd")}
                                                disabled={!["VTW01904", "VTW01905", "VTW01906"].includes(forms[index].ctStlmSeCd)}
                                                autoWidth
                                                MenuProps={{
                                                    PaperProps: {
                                                        style: {
                                                            maxHeight: 200, // 최대 표시할 항목 수에 맞게 조정
                                                        },
                                                    },
                                                }}
                                                readOnly={sttsCd === "VTW05405" ? true : false}
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
                                            variant={!["VTW01904", "VTW01905", "VTW01906"].includes(forms[index].ctStlmSeCd) ? "filled" : "outlined"}
                                            value={forms[index].dpstrFlnm}
                                            onChange={(e) => handleInputChange(e, index, "dpstrFlnm")}
                                            disabled={sttsCd === "VTW05405" ? true : !["VTW01904", "VTW01905", "VTW01906"].includes(forms[index].ctStlmSeCd)}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <TextField
                                            fullWidth
                                            id="dpstActno"
                                            label="입금계좌"
                                            type="text"
                                            variant={!["VTW01904", "VTW01905", "VTW01906"].includes(forms[index].ctStlmSeCd) ? "filled" : "outlined"}
                                            value={forms[index].dpstActno}
                                            onChange={(e) => handleInputChange(e, index, "dpstActno")}
                                            disabled={sttsCd === "VTW05405" ? true : !["VTW01904", "VTW01905", "VTW01906"].includes(forms[index].ctStlmSeCd)}
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
                                    style={{ marginTop: "10px", marginRight: "10px", marginBottom: "10px" }}
                                    onClick={addForm}
                                    disabled={sttsCd === "VTW05405" ? true : false}
                                >
                                    추가
                                </Button>
                            )}
                            <Button
                                variant="contained"
                                color="secondary"
                                style={{ marginTop: "10px", marginBottom: "10px" }}
                                onClick={() => removeForm(form)}
                                disabled={sttsCd === "VTW05405" ? true : false}
                            >
                                삭제
                            </Button>
                        </Grid>
                        <hr />
                    </div>
                ))}
            </div>

            <hr />
            <div>* 현재 TR 입력 차수: {clmOdr}</div>
            <div>* 마감 여부: {ctAtrzCmptnYn != null ? "마감" : "작성중"} </div>
            <br />
            <div>1. 지출 방법: 개인법인카드, 개인현금</div>
            <br />
            <div>
                <table className="expensInfo-table">
                    <thead>
                        <tr>
                            <th style={{ width: '70%' }}>
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
                                {deadLineDate} 이전
                            </td>
                            <td>
                                {ctAtrzCmptnYn != null ? nextClmOdr : clmOdr} 차수
                            </td>
                        </tr>
                        <tr>
                            <td>
                                {deadLineDate}  이후
                            </td>
                            <td>
                                해당차수 반영
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <br />
            <div>2. 지출 방법: 기업법인카드, 세금계산서</div>
            <br />
            <div>
                <table className="expensInfo-table">
                    <thead>
                        <tr>
                            <th style={{ width: '70%' }}>
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
            <br />
            <div>현재 TR입력차수가 마감되어 다음차수로 반영될 경우 직접 마감취소 또는 경영지원팀으로 마감취소 요청 하시기 바랍니다.</div>
        </div>
    )

}
export default ExpensInfo;