import { useEffect, useState } from 'react';
import { NumberBox } from "devextreme-react/number-box";
import SelectBox from "devextreme-react/select-box";
import TextBox from "devextreme-react/text-box";
import { DateBox } from 'devextreme-react/date-box';
import { Button } from "devextreme-react";
import Box, { Item } from "devextreme-react/box"
import CustomTable from "components/unit/CustomTable";
import CustomCdComboBox from "components/unit/CustomCdComboBox";
import AutoCompleteName from "components/unit/AutoCompleteName"
import ApiRequest from "../../utils/ApiRequest";
import EmpVcatnAltmntMngJson from "../humanResourceMng/EmpVcatnAltmntMng.json"
import Moment from 'moment'     // npm install moment

const { listQueryId, listKeyColumn, listTableColumns } = EmpVcatnAltmntMngJson;


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


/**
 * @param {*} startYear 시작하고싶은 년도
 * @param {number} endYear 시작년도 + endYear 년도
 * @returns 시작년도부터 시작년도 + endYear 까지의 1차원 배열반환
 */
function getYearList(startYear, endYear) {
    const yearList = [];
    let startDate = parseInt(new Date(String(startYear)).getFullYear());
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
    const [param, setParam] = useState([]);
    const [listValues, setListValues] = useState([]);
    const [selectValue, setSelectValue] = useState([]);
    const [searchParam, setSearchParam] = useState({ queryId: "", vcatnYr: "", empno: "", empFlnm: "", jobCd: "", deptCd: "", hdofSttsCd: "" });

    const nowYear = new Date().getFullYear();                                                   // 현재년도 (YYYY)
    const flagYear = Moment().format('YYYYMMDD') > nowYear + "0401" ? nowYear : nowYear - 1     // 회계년도

    // 화면 최초로드 시 조회 param 설정
    useEffect(() => {
        setParam({
            queryId: listQueryId,
        });
    }, [])

    // param 변경 시 validation 확인 후 조회로직 호출
    useEffect(() => {
        if (!Object.values(param).every((value) => value === "")) {
            pageHandle(param);
        }
    }, [param]);

    // 조회후 데이터 셋팅
    const pageHandle = async (initParam) => {
        try {
            setListValues(await ApiRequest("/boot/common/queryIdSearch", initParam));
        } catch (error) {
            console.log(error);
        }
    };


    /* ========================= 검색조건  =========================*/
    // CustomCdComboBox 검색조건 설정
    const handleChgState = ({ name, value }) => {
        setSearchParam({
            ...searchParam,
            [name]: value
        });
    };

    /**
     * @param {string} param 검색조건으로 설정할 key값
     * @param {*} e 검색조건으로 설정할 value값
     */
    function onSearchChg(param, e) {
        setSearchParam({
            ...searchParam,
            [param]: e
        })
    }

    // 검색버튼
    const searchHandle = () => {
        setParam({
            ...searchParam,
            queryId: listQueryId,
        });
        setSelectValue({

        })
    }
    /* ========================= 검색조건  =========================*/


    // 좌측의 직원목록에서 더블클릭한 행의 데이터 셋팅
    function onRowDblClick(e) {
        setSelectValue({
            empId: e.data.empId,
            empno: e.data.empno,
            empFlnm: e.data.empFlnm,
            vcatnYr: e.data.vcatnYr,
            vcatnAltmntDaycnt: e.data.vcatnAltmntDaycnt,
            useDaycnt: e.data.useDaycnt,
            vcatnRemndrDaycnt: e.data.vcatnRemndrDaycnt,
            newVcatnAltmntDaycnt: e.data.newVcatnAltmntDaycnt,
            newUseDaycnt: e.data.newUseDaycnt,
            newRemndrDaycnt: e.data.newRemndrDaycnt,
            altmntBgngYmd: e.data.altmntBgngYmd,
            altmntUseEndYmd: e.data.altmntUseEndYmd,
            visibleCtr: true,
            nameReadOnlyCtr: true,
            isNew: false,
        })
    }

    // 우측의 SelectBox 성명 변경
    function onSelectEmpFlnmChg(e) {
        setSelectValue({
            ...selectValue,
            empno: e,
            visibleCtr: ((e == null || e == "") ? false : true)
        })
    }

    /**
     * @param {string} param 검색조건으로 설정할 key값
     * @param {*} e 검색조건으로 설정할 value값
    */
    function onSelectChg(param, e) {
        if(param == "altmntBgngYmd" || param == "altmntUseEndYmd") e = Moment(e).format('YYYYMMDD');
        setSelectValue({
            ...selectValue,
            [param]: e
        })
    }

    function btnSaveClick(e) {
        const isconfirm = window.confirm("휴가정보를 저장 하시겠습니까?");
        if (isconfirm) {
            // updateVcatn();
        } else {
            return;
        }
    }

    function btnCancleClick(e) {
        setSelectValue({
            vcatnYr: flagYear,
            isNew: true
        })
    }

    useEffect(() => {
        console.log("selectValue : ", selectValue);
    }, [selectValue])

    // useEffect(() => {
    //     console.log("searchParam : ", searchParam);
    // }, [searchParam])

    // useEffect(() => {
    //     console.log("param : ", param);
    // }, [param])

    // useEffect(() => {
    //     console.log("listValues : ", listValues);
    // }, [listValues])

    return (
        <div className="" style={{ marginLeft: "7%", marginRight: "7%" }}>
            <div className="mx-auto" style={{ marginTop: "20px", marginBottom: "10px" }}>
                <h1 style={{ fontSize: "30px" }}>휴가배정관리</h1>
            </div>
            <div className="mx-auto" style={{ marginBottom: "10px" }}>
                <span>* 직원의 월별 휴가정보를 조회합니다.</span>
            </div>

            <Box direction="flex">
                <Item className="" ratio={1}>
                    <SelectBox
                        placeholder="[년도]"
                        showClearButton={true}
                        dataSource={getYearList("2013", 1)}
                        defaultValue={flagYear}
                        onValueChange={(e) => { onSearchChg("vcatnYr", e) }} />
                </Item>
                <Item className="" ratio={1}>
                    <TextBox
                        placeholder="[사번]"
                        showClearButton={true}
                        onValueChange={(e) => { onSearchChg("empno", e) }} />
                </Item>
                <Item className="" ratio={1}>
                    <TextBox
                        placeholder="[성명]"
                        showClearButton={true}
                        onValueChange={(e) => { onSearchChg("empFlnm", e) }} />
                </Item>
                <Item className="" ratio={1}>
                    <CustomCdComboBox
                        param="VTW001"
                        placeholderText="[직위]"
                        name="jobCd"
                        onSelect={handleChgState}
                        value={searchParam.jobCd} showClearValue={true} />
                </Item>
                <Item className="" ratio={1}>
                    <SelectBox placeholder="[소속]" />
                    {/* <CustomCdComboBox param="" placeholderText="[소속]" name="deptCd" onSelect={handleChgState} value={searchParam.deptCd} /> */}
                </Item>
                <Item className="" ratio={1}>
                    <CustomCdComboBox
                        param="VTW003"
                        placeholderText="[재직]"
                        name="hdofSttsCd"
                        onSelect={handleChgState}
                        value={searchParam.hdofSttsCd}
                        showClearValue={true} />
                </Item>
                <Item className="searchBtnItem" ratio={1}>
                    <Button onClick={searchHandle} text="검색" style={{ height: "48px", width: "50px" }} />
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
                            values={listValues}
                            onRowDblClick={onRowDblClick}
                        />
                    </div>
                </div>
                <div style={{ width: "40%" }}>
                    <div style={divStyle}><h4>* 개인별 휴가 배정 입력</h4></div>
                    <div style={divStyle}>휴가 배정일을 입력 시 사용일 및 잔여일은 자동 계산됩니다.</div>
                    <div style={{ marginTop: "10px", flexDirection: "row" }}>
                        <div className="row" style={divStyle}>
                            <div className="col-md-2" style={textAlign}>성명</div>
                            <div className="col-md-6">
                                <AutoCompleteName
                                    readOnlyValue={selectValue.nameReadOnlyCtr}
                                    defaultValue={selectValue.empno}
                                    placeholderText="성명"
                                    onValueChange={onSelectEmpFlnmChg} />
                            </div>
                            <div className="col-md-4">
                                <TextBox
                                    readOnly={selectValue.readOnlyCtr}
                                    value={selectValue.empno}
                                    visible={selectValue.visibleCtr} />
                            </div>
                        </div>
                        <div style={{ marginTop: "20px", fontSize: "11px", fontWeight: "700" }}>*회계년도기준</div>
                        <div className="row">
                            <div className="col-md-2" style={textAlign}>사용일수</div>
                            <div className="col-md-4">
                                <TextBox value={selectValue.useDaycnt} readOnly="true" />
                            </div>
                            <div className="col-md-2" style={textAlign}>배정일수</div>
                            <div className="col-md-4">
                                <NumberBox
                                    step={0.5}
                                    showSpinButtons={true}
                                    showClearButton={true}
                                    value={selectValue.vcatnAltmntDaycnt}
                                    onValueChange={(e) => { onSelectChg("vcatnAltmntDaycnt", e) }}
                                />
                            </div>
                        </div>
                        <div style={{ marginTop: "20px", fontSize: "11px", fontWeight: "700" }}>*입사년도기준</div>
                        <div className="row">
                            <div className="col-md-2" style={textAlign}>사용일수</div>
                            <div className="col-md-4">
                                <TextBox readOnly="true" value={selectValue.newUseDaycnt} />
                            </div>
                            <div className="col-md-2" style={textAlign}>배정일수</div>
                            <div className="col-md-4">
                                <NumberBox
                                    step={0.5}
                                    showSpinButtons={true}
                                    showClearButton={true}
                                    value={selectValue.newVcatnAltmntDaycnt}
                                    onValueChange={(e) => { onSelectChg("newVcatnAltmntDaycnt", e) }}
                            />
                            </div>
                        </div>
                        <div className="row" style={divStyle}>
                            <div className="col-md-2" style={textAlign}>사용기한</div>
                            <div className="col-md-4">
                                <DateBox value={selectValue.altmntBgngYmd} onValueChange={(e) => { onSelectChg("altmntBgngYmd", e) }}/>
                            </div>
                            <div className="col-md-2" style={textAlign}>~</div>
                            <div className="col-md-4">
                                <DateBox value={selectValue.altmntUseEndYmd} onValueChange={(e) => { onSelectChg("altmntUseEndYmd", e) }}/>
                            </div>
                        </div>
                        <div className="row" style={divStyle}>
                            <div className="col-md-2" style={{ textAlign: "left", display: "flex", alignItems: "center", fontSize: "14px"}}>휴가배정년도</div>
                            <div className="col-md-4">
                                <SelectBox
                                    placeholder="[년도]"
                                    showClearButton={true}
                                    value={selectValue.vcatnYr}
                                    dataSource={getYearList(nowYear - 1, 1)} 
                                    onValueChange={(e) => { onSelectChg("vcatnYr", e) }}/>
                            </div>
                        </div>
                        <div style={{ display: "inline-block", float: "right", marginTop: "25px" }}>
                            <Button style={{ height: "48px", width: "120px", marginRight: "15px" }} >엑셀업로드</Button>
                            <Button style={{ height: "48px", width: "70px", marginRight: "15px" }} onClick={btnSaveClick}>저장</Button>
                            <Button style={{ height: "48px", width: "70px" }} onClick={btnCancleClick}>초기화</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmpVcatnAltmntMng;
