import { useEffect, useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";

import { NumberBox, SelectBox, TextBox, DateBox, Button, Box } from "devextreme-react";
import { Item } from "devextreme-react/box"

// 날짜관련
// npm install moment
import Moment from "moment"

import CustomTable from "components/unit/CustomTable";
import CustomCdComboBox from "components/unit/CustomCdComboBox";
import CustomEmpComboBox from "components/unit/CustomEmpComboBox"
import EmpVcatnAltmntMngJson from "pages/humanResourceMng/EmpVcatnAltmntMngJson.json"
import ApiRequest from "utils/ApiRequest";
import { Select } from '@mui/material';


const { listQueryId, listKeyColumn, listTableColumns, insertQueryId } = EmpVcatnAltmntMngJson;


// 현재년도
const nowYear = new Date().getFullYear();

// 회계년도
const flagYear = Moment().format('YYYYMMDD') > nowYear + "0401" ? nowYear : nowYear - 1

/**
 * @param {number} startYear 현재년도 기준 화면에 보여줄 (현재년도 - startYear)
 * @param {number} endYear 현재년도 기준 화면에 보여줄 (현재년도 + endYear)
 * @returns 시작년도부터 시작년도 + endYear 까지의 1차원 배열반환
 */
function getYearList(startYear, endYear) {
    const yearList = [];
    let startDate = parseInt(new Date(String(new Date().getFullYear() - startYear)).getFullYear());
    let endDate = parseInt(new Date().getFullYear() + endYear);

    for (startDate; startDate <= endDate; startDate++) {
        yearList.push(startDate);
    }

    return yearList;
}


/**
 * @description 휴가배정관리 화면을 구현한다
 */
const EmpVcatnAltmntMng = () => {
    const navigate = useNavigate();

    useEffect(() => {
        getEmpVacList();
        getDeptList();
        getCodeList();
    }, [])





    // 직원별휴가목록조회
    const [selectEmpVacListValue, setSelectEmpVacListValue] = useState([]);

    // 부서목록조회
    const [selectDeptListValue, setSelectDeptListValue] = useState([]);

    // 부서목록조회
    const [selectJobCdListValue, setSelectJobCdListValue] = useState([]);

    // 부서목록조회
    const [selectHdofSttsCdListValue, setSelectHdofSttsCdListValue] = useState([]);


    // 직원별휴가목록조회
    const getEmpVacList = async () => {
        try {
            setSelectEmpVacListValue(await ApiRequest("/boot/common/queryIdSearch", { queryId: "humanResourceMngMapper.retrieveEmpVcatnInfo" }));
        } catch (error) {
            console.log("getEmpVacList_error : ", error);
        }
    };


    // 부서목록조회
    const getDeptList = async () => {
        try {
            setSelectDeptListValue(await ApiRequest('/boot/common/commonSelect', [{ tbNm: "DEPT" }]));
        } catch (error) {
            console.log('getDeptList_error', error);
        }
    };

    // 코드조회
    const getCodeList = async () => {
        try {
            setSelectJobCdListValue(await ApiRequest('/boot/common/commonSelect', [{ tbNm: "CD" }, { upCdValue: "VTW001" }]));
            setSelectHdofSttsCdListValue(await ApiRequest('/boot/common/commonSelect', [{ tbNm: "CD" }, { upCdValue: "VTW003" }]));
        } catch (error) {
            console.log('getDeptList_error', error);
        }
    };


    // 조회조건
    const [searchParam, setSearchParam] = useState({ queryId: "humanResourceMngMapper.retrieveEmpVcatnInfo" });

    // 휴가배정정보
    const [selectValue, setSelectValue] = useState({ empId: "", useDaycnt: "", newUseDaycnt: "" });


    const [paramFlag, setParamFlag] = useState({ readOnlyCtr: true, insertVcantFlag: 0 });




    // 조회
    const onSearch = async () => {
        try {
            setSelectEmpVacListValue(await ApiRequest("/boot/common/queryIdSearch", searchParam));
            setSelectValue();
        } catch (error) {
            console.log("getEmpVacList_error : ", error);
        }
    };





    // 좌측의 직원목록에서 더블클릭한 행의 데이터 셋팅
    function onRowDblClick(e) {
        setSelectValue(e.data);
        setParamFlag({
            insertVcantFlag: 0,
            readOnlyCtr: true,
        })
    }

    useEffect(() => {
        console.log("selectValue : ", selectValue);
    }, [selectValue])








    // 휴가배정정보저장
    function btnSaveClick(e) {
        let errorMsg;

        if (!selectValue.empId) errorMsg = "사원을 선택하세요."
        else if (!selectValue.altmntBgngYmd) errorMsg = "시작사용기간을 입력하세요."
        else if (!selectValue.altmntUseEndYmd) errorMsg = "종료사용기간을 입력하세요."
        else if (setParamFlag.insertVcantFlag == 1) {
            if (!selectValue.vcatnAltmntDaycnt) errorMsg = "배정일수를 입력하세요."
        }
        else if (setParamFlag.insertVcantFlag == 2) {
            if (!selectValue.newVcatnAltmntDaycnt) errorMsg = "배정일수를 입력하세요."
        }

        if (errorMsg) {
            alert(errorMsg);
            return;
        } else {
            const isconfirm = window.confirm("휴가정보를 저장 하시겠습니까?");
            if (isconfirm) {

            } else {
                return;
            }
        }
    }




    // 조회후 데이터 셋팅
    const insertPageHandle = async (initParam) => {
        let errorMsg;

        if (!initParam.empId) {
            errorMsg = "사원을 선택하세요."
        } else if (!initParam.vcatnYr) {
            errorMsg = "휴가배정년도를 선택하세요."
        }

        if (errorMsg) {
            alert(errorMsg);
            return;
        }

        try {
            const response = await ApiRequest("/boot/common/queryIdSearch", initParam);
            // searchHandle();
            // setSelectValue({
            //     ...selectValue
            // })
        } catch (error) {
            console.log(error);
        }
    };



    function onButtonClick(e, data) {
        console.log("data : ", data);
        navigate("/indvdlClm/EmpVacation", {
            empId: data.empId,
            empFlnm: data.empFlnm,
            deptList: [

            ]
        })
    }


    function createForm(flag) {
        return(
            <>
                <div className="row" style={{ marginBottom: "20px" }}>
                    <div className="col-md-2" style={textAlign}>휴가종류</div>
                    <div className="col-md-4">
                        <SelectBox
                            placeholder=""
                            dataSource={[{ id: "N", value: "회계년도휴가" }, { id: "Y", value: "신규휴가" }]}
                            valueExpr="id"
                            displayExpr="value"
                            readOnly={flag == 0 ? true : false}
                            onValueChange={(e) => {
                                setParamFlag({ ...paramFlag, setInsertVcantFlag: e });
                                setSelectValue({
                                    ...selectValue,
                                    vcatnAltmntDaycnt: "",
                                    newVcatnAltmntDaycnt: "",
                                    altmntBgngYmd: e == 1 ? flagYear + "0401" : null,
                                    altmntUseEndYmd: e == 1 ? (flagYear + 1) + "0331" : null,
                                })
                            }}
                        />
                    </div>
                </div>
                <div className="row" style={divStyle}>
                    <div className="col-md-2" style={textAlign}>성명</div>
                    <div className="col-md-6">
                        <CustomEmpComboBox
                            value={selectValue ? selectValue.empId : ""}
                            readOnly={paramFlag.readOnlyCtr}
                            onValueChange={(e) => { setSelectValue({ ...selectValue, empno: e[0].empno, empId: e[0].empId }) }}
                            useEventBoolean={true}
                        />
                    </div>
                    <div className="col-md-4">
                        <TextBox
                            readOnly={true}
                            value={selectValue ? selectValue.empno : ""}
                        />
                    </div>
                </div>
                <div className="row" style={{ marginTop: "20px" }}>
                    <div className="col-md-2" style={textAlign}>사용기한</div>
                    <div className="col-md-4">
                        <DateBox
                            value={selectValue ? selectValue.altmntBgngYmd : ""}
                            readOnly={paramFlag.readOnlyCtr}
                            displayFormat="yyyy-MM-dd"
                            onValueChange={(e) => { setSelectValue({ ...selectValue, altmntBgngYmd: Moment(e).format('YYYYMMDD') }) }} />
                    </div>
                    <div className="col-md-2" style={textAlign}>~</div>
                    <div className="col-md-4">
                        <DateBox
                            value={selectValue ? selectValue.altmntUseEndYmd : ""}
                            readOnly={paramFlag.readOnlyCtr}
                            displayFormat="yyyy-MM-dd"
                            onValueChange={(e) => { setSelectValue({ ...selectValue, altmntUseEndYmd: Moment(e).format('YYYYMMDD') }) }} />
                    </div>
                </div>
                <div className="row" style={{ marginTop: "20px" }}>
                    <div className="col-md-2" style={textAlign}>사용일수</div>
                    <div className="col-md-4">
                        <TextBox value={selectValue ? String(selectValue.useDaycnt) : null} readOnly={true} />
                    </div>
                    <div className="col-md-2" style={textAlign}>배정일수</div>
                    <div className="col-md-4">
                        <NumberBox
                            step={0.5}
                            showSpinButtons={true}
                            showClearButton={true}
                            readOnly={paramFlag.readOnlyCtr}
                            value={selectValue ? Number(selectValue.vcatnAltmntDaycnt) : null}
                            onValueChange={(e) => { setSelectValue({ ...selectValue, vcatnAltmntDaycnt: e }) }}
                        />
                    </div>
                </div>
            </>
        )
    }


    return (
        <div style={{ marginLeft: "3%", marginRight: "3%" }}>
            <div className="mx-auto" style={{ marginTop: "20px", marginBottom: "10px" }}>
                <h1 style={{ fontSize: "30px" }}>휴가배정관리</h1>
            </div>
            <div className="mx-auto" style={{ marginBottom: "10px" }}>
                <span>* 직원의 월별 휴가정보를 조회합니다.</span>
            </div>

            <Box direction="flex">
                <Item ratio={1}>
                    <SelectBox
                        placeholder="[년도]"
                        defaultValue={flagYear}
                        dataSource={getYearList(10, 1)}
                        onValueChange={(e) => { setSearchParam({ ...searchParam, vcatnYr: e }) }}
                    />
                </Item>
                <Item ratio={1}>
                    <TextBox
                        placeholder="[사번]"
                        showClearButton={true}
                        onValueChange={(e) => { setSearchParam({ ...searchParam, empno: e }) }}
                    />
                </Item>
                <Item ratio={1}>
                    <TextBox
                        placeholder="[성명]"
                        showClearButton={true}
                        onValueChange={(e) => { setSearchParam({ ...searchParam, empFlnm: e }) }}
                    />
                </Item>
                <Item ratio={1}>
                    <SelectBox
                        placeholder="[직위]"
                        showClearValue={true}
                        dataSource={selectJobCdListValue}
                        valueExpr="cdValue"
                        displayExpr="cdNm"
                        onValueChange={(e) => { setSearchParam({ ...searchParam, jobCd: e }) }}
                    />
                </Item>
                <Item ratio={1}>
                    <SelectBox
                        placeholder="[소속]"
                        showClearButton={true}
                        dataSource={selectDeptListValue}
                        valueExpr="deptId"
                        displayExpr="deptNm"
                        onValueChange={(e) => { setSearchParam({ ...searchParam, deptId: e }) }}
                    />
                </Item>
                <Item ratio={1}>
                    <SelectBox
                        placeholder="[재직]"
                        showClearValue={true}
                        dataSource={selectHdofSttsCdListValue}
                        valueExpr="cdValue"
                        displayExpr="cdNm"
                        onValueChange={(e) => { setSearchParam({ ...searchParam, hdofSttsCd: e }) }}
                    />
                </Item>
                <Item ratio={1}>
                    <Button onClick={onSearch} text="검색" style={{ height: "48px", width: "50px" }} />
                </Item>
            </Box>

            <div style={{ display: "flex", marginTop: "30px" }}>
                <div style={{ width: "60%", marginRight: "25px" }}>
                    <div style={divStyle}><h4>* 직원목록</h4></div>
                    <div style={divStyle}>직원목록을 클릭시 휴가 배정 정보를 수정 할 수있습니다.</div>
                    <div style={divStyle}>
                        <CustomTable
                            keyColumn={listKeyColumn}
                            columns={listTableColumns}
                            values={selectEmpVacListValue}
                            onRowDblClick={onRowDblClick}
                            onClick={onButtonClick}
                        />
                    </div>
                </div>
                <div style={{ width: "40%" }}>
                    <div style={divStyle}><h4>* 개인별 휴가 배정 입력</h4></div>
                    <div style={divStyle}>휴가 배정일을 입력 시 사용일 및 잔여일은 자동 계산됩니다.</div>
                    <div style={{ marginTop: "10px", flexDirection: "row" }}>
                    {createForm(1)}
                        {/* {
                            paramFlag.readOnlyCtr == false && setParamFlag.insertVcantFlag != 0
                                ?
                                <div className="row" style={{ marginBottom: "20px" }}>
                                    <div className="col-md-2" style={textAlign}>휴가종류</div>
                                    <div className="col-md-4">
                                        <SelectBox
                                            placeholder="휴가종류를 선택하세요."
                                            defaultValue="N"
                                            dataSource={[{ id: "N", value: "회계년도휴가" }, { id: "Y", value: "신규휴가" }]}
                                            valueExpr="id"
                                            displayExpr="value"
                                            onValueChange={(e) => {
                                                setParamFlag({ ...paramFlag, setInsertVcantFlag: e });
                                                setSelectValue({
                                                    ...selectValue,
                                                    vcatnAltmntDaycnt: "",
                                                    newVcatnAltmntDaycnt: "",
                                                    altmntBgngYmd: e == 1 ? flagYear + "0401" : null,
                                                    altmntUseEndYmd: e == 1 ? (flagYear + 1) + "0331" : null,
                                                })
                                            }}
                                        />
                                    </div>
                                    {
                                        setParamFlag.insertVcantFlag == 1
                                            ?
                                            <>
                                                <div className="col-md-2" style={textAlign}>배정년도</div>
                                                <div className="col-md-4">
                                                    <SelectBox
                                                        placeholder="[년도]"
                                                        defaultValue={flagYear}
                                                        dataSource={getYearList(0, 1)}
                                                    />
                                                </div>
                                            </>
                                            :
                                            <>
                                                <div className="col-md-2" style={textAlign}>배정년도</div>
                                                <div className="col-md-4">
                                                    <TextBox
                                                        readOnly={true}
                                                    />
                                                </div>
                                            </>
                                    }
                                </div>
                                : <></>
                        }
                        <div className="row" style={divStyle}>
                            <div className="col-md-2" style={textAlign}>성명</div>
                            <div className="col-md-6">
                                <CustomEmpComboBox
                                    value={selectValue ? selectValue.empId : ""}
                                    readOnly={paramFlag.readOnlyCtr}
                                    onValueChange={(e) => { setSelectValue({ ...selectValue, empno: e[0].empno, empId: e[0].empId }) }}
                                    useEventBoolean={true}
                                />
                            </div>
                            <div className="col-md-4">
                                <TextBox
                                    readOnly={true}
                                    value={selectValue ? selectValue.empno : ""}
                                />
                            </div>
                        </div>
                        {
                            setParamFlag.insertVcantFlag == 1
                                ?
                                <>
                                    <div className="row" style={{ marginTop: "20px" }}>
                                        <div className="col-md-2" style={textAlign}>사용기한</div>
                                        <div className="col-md-4">
                                            <DateBox
                                                value={selectValue ? selectValue.altmntBgngYmd : ""}
                                                displayFormat="yyyy-MM-dd"
                                                onValueChange={(e) => { setSelectValue({ ...selectValue, altmntBgngYmd: Moment(e).format('YYYYMMDD') }) }} />
                                        </div>
                                        <div className="col-md-2" style={textAlign}>~</div>
                                        <div className="col-md-4">
                                            <DateBox
                                                value={selectValue ? selectValue.altmntUseEndYmd : ""}
                                                displayFormat="yyyy-MM-dd"
                                                onValueChange={(e) => { setSelectValue({ ...selectValue, altmntUseEndYmd: Moment(e).format('YYYYMMDD') }) }} />
                                        </div>
                                    </div>
                                    <div style={{ marginTop: "20px", fontSize: "11px", fontWeight: "700" }}>*회계년도기준</div>
                                    <div className="row">
                                        <div className="col-md-2" style={textAlign}>사용일수</div>
                                        <div className="col-md-4">
                                            <TextBox value={selectValue ? String(selectValue.useDaycnt) : null} readOnly={true} />
                                        </div>
                                        <div className="col-md-2" style={textAlign}>배정일수</div>
                                        <div className="col-md-4">
                                            <NumberBox
                                                step={0.5}
                                                showSpinButtons={true}
                                                showClearButton={true}
                                                value={selectValue ? Number(selectValue.vcatnAltmntDaycnt) : null}
                                                onValueChange={(e) => { setSelectValue({ ...selectValue, vcatnAltmntDaycnt: e }) }}
                                            />
                                        </div>
                                    </div>
                                </>
                                : setParamFlag.insertVcantFlag == 2
                                    ?
                                    <>
                                        <div className="row" style={{ marginTop: "20px" }}>
                                            <div className="col-md-2" style={textAlign}>사용기한</div>
                                            <div className="col-md-4">
                                                <DateBox
                                                    value={selectValue ? selectValue.altmntBgngYmd : ""}
                                                    displayFormat="yyyy-MM-dd"
                                                    onValueChange={(e) => { setSelectValue({ ...selectValue, altmntBgngYmd: Moment(e).format('YYYYMMDD') }) }} />
                                            </div>
                                            <div className="col-md-2" style={textAlign}>~</div>
                                            <div className="col-md-4">
                                                <DateBox
                                                    value={selectValue ? selectValue.altmntUseEndYmd : ""}
                                                    displayFormat="yyyy-MM-dd"
                                                    onValueChange={(e) => { setSelectValue({ ...selectValue, altmntUseEndYmd: Moment(e).format('YYYYMMDD') }) }} />
                                            </div>
                                        </div>
                                        <div style={{ marginTop: "20px", fontSize: "11px", fontWeight: "700" }}>*입사년도기준</div>
                                        <div className="row">
                                            <div className="col-md-2" style={textAlign}>사용일수</div>
                                            <div className="col-md-4">
                                                <TextBox readOnly={true} value={selectValue ? String(selectValue.newUseDaycnt) : null} />
                                            </div>
                                            <div className="col-md-2" style={textAlign}>배정일수</div>
                                            <div className="col-md-4">
                                                <NumberBox
                                                    step={0.5}
                                                    showSpinButtons={true}
                                                    showClearButton={true}
                                                    value={selectValue ? Number(selectValue.newVcatnAltmntDaycnt) : null}
                                                    onValueChange={(e) => { setSelectValue({ ...selectValue, newVcatnAltmntDaycnt: e }) }}
                                                />
                                            </div>
                                        </div>
                                    </>
                                    :
                                    <>
                                        <div className="row" style={{ marginTop: "20px" }}>
                                            <div className="col-md-2" style={textAlign}>사용기한</div>
                                            <div className="col-md-4">
                                                <DateBox
                                                    value={selectValue ? selectValue.altmntBgngYmd : ""}
                                                    displayFormat="yyyy-MM-dd"
                                                    onValueChange={(e) => { setSelectValue({ ...selectValue, altmntBgngYmd: Moment(e).format('YYYYMMDD') }) }} />
                                            </div>
                                            <div className="col-md-2" style={textAlign}>~</div>
                                            <div className="col-md-4">
                                                <DateBox
                                                    value={selectValue ? selectValue.altmntUseEndYmd : ""}
                                                    displayFormat="yyyy-MM-dd"
                                                    onValueChange={(e) => { setSelectValue({ ...selectValue, altmntUseEndYmd: Moment(e).format('YYYYMMDD') }) }} />
                                            </div>
                                        </div>
                                        <div style={{ marginTop: "20px", fontSize: "11px", fontWeight: "700" }}>*회계년도기준</div>
                                        <div className="row">
                                            <div className="col-md-2" style={textAlign}>사용일수</div>
                                            <div className="col-md-4">
                                                <TextBox value={selectValue ? String(selectValue.useDaycnt) : null} readOnly={true} />
                                            </div>
                                            <div className="col-md-2" style={textAlign}>배정일수</div>
                                            <div className="col-md-4">
                                                <NumberBox
                                                    step={0.5}
                                                    showSpinButtons={true}
                                                    showClearButton={true}
                                                    value={selectValue ? Number(selectValue.vcatnAltmntDaycnt) : null}
                                                    onValueChange={(e) => { setSelectValue({ ...selectValue, vcatnAltmntDaycnt: e }) }}
                                                />
                                            </div>
                                        </div>
                                        <div style={{ marginTop: "20px", fontSize: "11px", fontWeight: "700" }}>*입사년도기준</div>
                                        <div className="row">
                                            <div className="col-md-2" style={textAlign}>사용일수</div>
                                            <div className="col-md-4">
                                                <TextBox readOnly={true} value={selectValue ? String(selectValue.newUseDaycnt) : null} />
                                            </div>
                                            <div className="col-md-2" style={textAlign}>배정일수</div>
                                            <div className="col-md-4">
                                                <NumberBox
                                                    step={0.5}
                                                    showSpinButtons={true}
                                                    showClearButton={true}
                                                    value={selectValue ? Number(selectValue.newVcatnAltmntDaycnt) : null}
                                                    onValueChange={(e) => { setSelectValue({ ...selectValue, newVcatnAltmntDaycnt: e }) }}
                                                />
                                            </div>
                                        </div>
                                    </>
                        } */}
                        <div style={{ display: "inline-block", float: "right", marginTop: "25px" }}>
                            <Button style={{ height: "48px", width: "120px", marginRight: "15px" }} >엑셀업로드</Button>
                            <Button style={{ height: "48px", width: "70px", marginRight: "15px" }} onClick={btnSaveClick}>저장</Button>
                            <Button style={{ height: "48px", width: "70px" }} onClick={(e) => {
                                setParamFlag({
                                    insertVcantFlag: 1,
                                    readOnlyCtr: false
                                })
                                setSelectValue({
                                    empId: "",
                                    useDaycnt: "",
                                    newUseDaycnt: "",
                                    altmntBgngYmd: flagYear + "0401",
                                    altmntUseEndYmd: (flagYear + 1) + "0331"
                                });
                            }}>신규</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmpVcatnAltmntMng;

/* ========================= 화면레이아웃  =========================*/
const divStyle = {
    marginTop: "10px"
}

const textAlign = {
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "14px"
}
/* ========================= 화면레이아웃  =========================*/