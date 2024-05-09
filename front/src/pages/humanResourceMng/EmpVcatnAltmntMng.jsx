import { useEffect, useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";

import { NumberBox, SelectBox, TextBox, DateBox, Button, Box } from "devextreme-react";
import { Item } from "devextreme-react/box"

// 날짜관련
// npm install moment
import Moment from "moment"

import CustomTable from "components/unit/CustomTable";
import CustomEmpComboBox from "components/unit/CustomEmpComboBox"
import EmpVcatnAltmntMngJson from "pages/humanResourceMng/EmpVcatnAltmntMngJson.json"
import ApiRequest from "utils/ApiRequest";

import { useModal } from "components/unit/ModalContext";

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
    const { handleOpen } = useModal();

    const navigate = useNavigate();

    const cntrBgngYmdRef = useRef();
    const cntrEndYmdRef = useRef();

    useEffect(() => {
        getEmpVacList();
        getDeptList();
        getCodeList();
    }, [])





    // 직원별휴가목록조회
    const [selectEmpVacListValue, setSelectEmpVacListValue] = useState([]);

    // 부서목록조회
    const [selectDeptListValue, setSelectDeptListValue] = useState([]);

    // 직책목록조회
    const [selectJobCdListValue, setSelectJobCdListValue] = useState([]);

    // 재직목록조회
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
    const [selectValue, setSelectValue] = useState({ queryId: "humanResourceMngMapper.insertVcatnMng", empId: "", useDaycnt: "", newUseDaycnt: "", vcatnYr: flagYear });

    // 화면데이터처리
    const [paramFlag, setParamFlag] = useState({ readOnlyCtr: true, insertReadOnlyCtr: true, insertVcantFlag: 0 });

    // 휴가배정정보이력조회
    const [selectHistValue, setSelectHistValue] = useState({ queryId: "humanResourceMngMapper.retrieveEmpVcatnInfo" });





    // 조회
    const onSearch = async () => {
        try {
            setSelectEmpVacListValue(await ApiRequest("/boot/common/queryIdSearch", searchParam));
            setSelectValue();
            setParamFlag({ readOnlyCtr: true, insertReadOnlyCtr: true, insertVcantFlag: 0 })
        } catch (error) {
            console.log("onSearch_error : ", error);
        }
    };


    // 기존휴가배정정보조회
    const getSelectValue = async () => {
        try {
            const response = await ApiRequest("/boot/common/queryIdSearch", selectHistValue);
            if (response.length > 0) {
                let pushReponseData = response[0];
                pushReponseData["queryId"] = "humanResourceMngMapper.insertVcatnMng";
                setSelectValue(pushReponseData);
            } else {
                setSelectValue({
                    ...selectValue,
                    queryId: "humanResourceMngMapper.insertVcatnMng",
                    useDaycnt: 0,
                    newUseDaycnt: 0,
                    pblenVcatnUseDaycnt: 0,
                    vcatnAltmntDaycnt: 0,
                    vcatnRemndrDaycnt: 0,
                    newRemndrDaycnt: 0,
                    altmntBgngYmd: selectValue.altmntBgngYmd,
                    altmntUseEndYmd: selectValue.altmntUseEndYmd,
                })
            }
        } catch (error) {
            console.log("getSelectValue_error : ", error);
        }
    };





    // 좌측의 직원목록에서 더블클릭한 행의 데이터 셋팅
    function onRowDblClick(e) {
        let pushData = e.data;
        pushData["queryId"] = "humanResourceMngMapper.insertVcatnMng";
        setSelectValue(pushData);
        setParamFlag({
            insertVcantFlag: 0,
            readOnlyCtr: true,
            insertReadOnlyCtr: false,
        })
    }





    // 휴가배정정보저장
    const btnSaveClick = async () => {
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
            handleOpen(errorMsg);
            return;
        } else {
            const isconfirm = window.confirm("휴가정보를 저장 하시겠습니까?");
            if (isconfirm) {
                await ApiRequest("/boot/common/queryIdSearch", selectValue);
                handleOpen("저장되었습니다.");
                onSearch();
            } else {
                return;
            }
        }
    }




    // 기존휴가정보조회
    useEffect(() => {
        if (selectHistValue && selectHistValue.empId) {
            getSelectValue();
        }
    }, [selectHistValue])





    // 휴가상세화면이동
    function onButtonClick(e, data) {
        linkVcatn(data);
    }

    // 휴가상세화면이동
    const linkVcatn = async (data) => {
        let selectParam = data
        selectParam["queryId"] = "sysMngMapper.userDept"

        // 휴가상세화면 전달할 세션부서정보조회
        const response = await ApiRequest("/boot/common/queryIdSearch", selectParam);

        // 조회성공 시 화면 이동
        if (response.length > 0) {
            navigate("/indvdlClm/EmpVacation", {
                state: {
                    empId: data.empId,
                    empFlnm: data.empFlnm,
                    deptList: response
                }
            })
        }
    }






    // 휴가등록불가기간 설정
    const btnSaveCntrlYmd = async () => {
        const response = await ApiRequest("/boot/common/queryIdSearch", 
            {queryId: "humanResourceMngMapper.updateVcatnCntrlYmdYn", cntrBgngYmd: cntrBgngYmdRef.current, cntrEndYmd: cntrEndYmdRef.current}
        );

        handleOpen("저장되었습니다.");
    }





    return (
        <div style={{ marginLeft: "1%", marginRight: "1%" }}>
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
                        onEnterKey={onSearch}
                        onValueChange={(e) => { setSearchParam({ ...searchParam, vcatnYr: e }) }}
                    />
                </Item>
                <Item ratio={1}>
                    <TextBox
                        placeholder="[사번]"
                        showClearButton={true}
                        onEnterKey={onSearch}
                        onValueChange={(e) => { setSearchParam({ ...searchParam, empno: e }) }}
                    />
                </Item>
                <Item ratio={1}>
                    <TextBox
                        placeholder="[성명]"
                        showClearButton={true}
                        onEnterKey={onSearch}
                        onValueChange={(e) => { setSearchParam({ ...searchParam, empFlnm: e }) }}
                    />
                </Item>
                <Item ratio={1}>
                    <SelectBox
                        placeholder="[직위]"
                        showClearButton={true}
                        dataSource={selectJobCdListValue}
                        valueExpr="cdValue"
                        displayExpr="cdNm"
                        onEnterKey={onSearch}
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
                        onEnterKey={onSearch}
                        onValueChange={(e) => { setSearchParam({ ...searchParam, deptId: e }) }}
                    />
                </Item>
                <Item ratio={1}>
                    <SelectBox
                        placeholder="[재직]"
                        showClearButton={true}
                        dataSource={selectHdofSttsCdListValue}
                        valueExpr="cdValue"
                        displayExpr="cdNm"
                        onEnterKey={onSearch}
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
                            keyColumn={EmpVcatnAltmntMngJson.listKeyColumn}
                            columns={EmpVcatnAltmntMngJson.listTableColumns}
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
                        <div className="row" style={{ marginBottom: "20px" }}>
                            <div className="col-md-2" style={textAlign}>휴가종류</div>
                            <div className="col-md-4">
                                <SelectBox
                                    placeholder=""
                                    dataSource={[{ id: "N", value: "회계년도휴가" }, { id: "Y", value: "신규휴가" }]}
                                    value={selectValue ? selectValue.newVcatnYn : ""}
                                    valueExpr="id"
                                    displayExpr="value"
                                    readOnly={paramFlag.insertVcantFlag == 0 ? true : false}
                                    onValueChange={(e) => {
                                        setParamFlag({ ...paramFlag, setInsertVcantFlag: e });
                                        setSelectValue({
                                            ...selectValue,
                                            vcatnAltmntDaycnt: "",
                                            newVcatnAltmntDaycnt: "",
                                            newVcatnYn: e,
                                            altmntBgngYmd: e == "N" ? selectValue.vcatnYr + "0401" : null,
                                            altmntUseEndYmd: e == "N" ? (selectValue.vcatnYr + 1) + "0331" : null,
                                        })
                                        setSelectHistValue({ ...selectHistValue, newVcatnYn: e })

                                    }}
                                />
                            </div>
                            <div className="col-md-2" style={textAlign}>배정년도</div>
                            <div className="col-md-4">
                                <SelectBox
                                    placeholder="[년도]"
                                    defaultValue={flagYear}
                                    readOnly={paramFlag.insertVcantFlag == 0 ? true : false}
                                    value={selectValue && selectValue.newVcatnYn ? parseInt(selectValue.vcatnYr) : ""}
                                    dataSource={getYearList(1, 1)}
                                    onValueChange={(e) => {
                                        setSelectValue({
                                            ...selectValue,
                                            vcatnYr: e,
                                            altmntBgngYmd: selectValue.newVcatnYn == "N" ? e + "0401" : null,
                                            altmntUseEndYmd: selectValue.newVcatnYn == "N" ? (e + 1) + "0331" : null,
                                        })
                                        setSelectHistValue({ ...selectHistValue, vcatnYr: e })
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
                                    useEventBoolean={true}
                                    onValueChange={(e) => {
                                        setSelectValue({
                                            ...selectValue,
                                            empno: e[0].empno,
                                            empId: e[0].empId
                                        })
                                        setSelectHistValue({ ...selectHistValue, empId: e[0].empId })
                                    }}
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
                                    readOnly={paramFlag.insertReadOnlyCtr}
                                    displayFormat="yyyy-MM-dd"
                                    onValueChange={(e) => { setSelectValue({ ...selectValue, altmntBgngYmd: Moment(e).format('YYYYMMDD') }) }} />
                            </div>
                            <div className="col-md-2" style={textAlign}>~</div>
                            <div className="col-md-4">
                                <DateBox
                                    value={selectValue ? selectValue.altmntUseEndYmd : ""}
                                    readOnly={paramFlag.insertReadOnlyCtr}
                                    displayFormat="yyyy-MM-dd"
                                    onValueChange={(e) => { setSelectValue({ ...selectValue, altmntUseEndYmd: Moment(e).format('YYYYMMDD') }) }} />
                            </div>
                        </div>
                        <div className="row" style={{ marginTop: "20px" }}>
                            {
                                selectValue && selectValue.newVcatnYn == "N"
                                    ?
                                    <>
                                        <div className="col-md-2" style={textAlign}>사용일수</div>
                                        <div className="col-md-4">
                                            <TextBox
                                                readOnly={true}
                                                value={selectValue ? String(selectValue.useDaycnt) : null}
                                            />
                                        </div>
                                        <div className="col-md-2" style={textAlign}>배정일수</div>
                                        <div className="col-md-4">
                                            <NumberBox
                                                step={0.5}
                                                showSpinButtons={true}
                                                showClearButton={true}
                                                readOnly={paramFlag.insertReadOnlyCtr}
                                                value={selectValue ? Number(selectValue.vcatnAltmntDaycnt) : null}
                                                onValueChange={(e) => {
                                                    setSelectValue({
                                                        ...selectValue,
                                                        vcatnAltmntDaycnt: e
                                                    })
                                                }}
                                            />
                                        </div>
                                    </>
                                    :
                                    <>
                                        <div className="col-md-2" style={textAlign}>사용일수</div>
                                        <div className="col-md-4">
                                            <TextBox
                                                readOnly={true}
                                                value={selectValue ? String(selectValue.newUseDaycnt) : null}
                                            />
                                        </div>
                                        <div className="col-md-2" style={textAlign}>배정일수</div>
                                        <div className="col-md-4">
                                            <NumberBox
                                                step={0.5}
                                                showSpinButtons={true}
                                                showClearButton={true}
                                                readOnly={paramFlag.insertReadOnlyCtr}
                                                value={selectValue ? Number(selectValue.newVcatnAltmntDaycnt) : null}
                                                onValueChange={(e) => {
                                                    setSelectValue({
                                                        ...selectValue,
                                                        newVcatnAltmntDaycnt: e
                                                    })
                                                }}
                                            />
                                        </div>
                                    </>
                            }
                        </div>
                        <div div className="row" style={{ display: "inline-block", float: "right", marginTop: "25px" }}>
                            <Button style={{ height: "48px", width: "120px", marginRight: "15px" }} >엑셀업로드</Button>
                            <Button style={{ height: "48px", width: "60px", marginRight: "15px" }} onClick={btnSaveClick}>저장</Button>
                            <Button style={{ height: "48px", width: "60px" }} onClick={(e) => {
                                setParamFlag({
                                    insertVcantFlag: 1,
                                    readOnlyCtr: false,
                                    insertReadOnlyCtr: false

                                });
                                setSelectValue({
                                    queryId: "humanResourceMngMapper.insertVcatnMng",
                                    empId: "",
                                    useDaycnt: 0,
                                    newUseDaycnt: 0,
                                    pblenVcatnUseDaycnt: 0,
                                    vcatnAltmntDaycnt: 0,
                                    vcatnRemndrDaycnt: 0,
                                    newRemndrDaycnt: 0,
                                    newVcatnYn: "N",
                                    altmntBgngYmd: flagYear + "0401",
                                    altmntUseEndYmd: (flagYear + 1) + "0331",
                                    vcatnYr: flagYear
                                });
                                setSelectHistValue({
                                    ...selectHistValue,
                                    empId: "",
                                    newVcatnYn: "N",
                                    vcatnYr: flagYear
                                })
                            }}>신규</Button>
                        </div>
                    </div>
                    <div style={{ marginTop: "100px" }}><h4>* 휴가등록 불가기간</h4></div>
                    <div style={divStyle}>휴가등록 불가기간을 설정합니다.</div>
                    <div style={{ marginTop: "10px", flexDirection: "row" }}>
                        <div className="row" style={{ marginBottom: "20px" }}>
                            <div className="col-md-2" style={textAlign}>휴가종류</div>
                            <div className="col-md-4">
                                <DateBox
                                    displayFormat="yyyy-MM-dd"
                                    ref={cntrBgngYmdRef}
                                    onValueChanged={(e) => { cntrBgngYmdRef.current = Moment(e.value).format("YYYYMMDD") }}
                                />
                            </div>
                            <div className="col-md-2" style={textAlign}>~</div>
                            <div className="col-md-4">
                                <DateBox
                                    displayFormat="yyyy-MM-dd"
                                    ref={cntrEndYmdRef}
                                    onValueChanged={(e) => { cntrEndYmdRef.current = Moment(e.value).format("YYYYMMDD") }}
                                />
                            </div>
                        </div>
                    </div>
                    <div div className="row" style={{ display: "inline-block", float: "right", marginTop: "25px" }}>
                    <div style={{ display: "inline-block", float: "right", marginTop: "25px" }}>
                        <Button style={{ height: "48px", width: "60px"}} onClick={btnSaveCntrlYmd}>저장</Button>
                    </div>
                    </div>
                </div>
            </div>
            <br /><br /><br /><br /><br />
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