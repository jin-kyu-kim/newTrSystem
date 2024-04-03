import { useEffect, useState } from "react"
import { useCookies } from "react-cookie";

import axios from "axios";

import { SelectBox, Button, DateBox, TextBox, NumberBox, Scheduler } from "devextreme-react";
import { loadMessages, locale } from "devextreme/localization";

// 날짜관련
// npm install date-fns
import { isSaturday, isSunday, startOfMonth, endOfMonth } from 'date-fns'
import { subYears, subMonths } from "date-fns"

// 날짜계산
// npm install moment
import Moment from "moment"

import koMessages from "utils/ko.json";
import ApiRequest from "utils/ApiRequest";
import AutoCompleteProject from "components/unit/AutoCompleteProject";

/**
 * 2023.03.27(박지환)
 * [확인완료]
 * 
 * [확인필요]
 * 
 * [작업필요]
 * 1. 15일보다 크면 1차수, 15일보다 작으면 2차수 고정
 * 2. 15일보다 크면 시작일자 1일 종료일자 15일 고정, 
 *    15일보다 작으면 시작일자 16일 종료일자 마지막날짜 고정
 */

const getHoliday = {
    url: `https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getHoliDeInfo?`,
    serviceKey: "4bjQqSQtmjf8jce2ingNztnBgXaR6OQiQcl55Rf%2FYWIltMwUZX%2BZu%2Fr5tVC2tNvlDkFLCGgRZPwu%2Faf%2FLsMlBg%3D%3D",
    solYear: 2024,
    solMonth: 12,
}

// 차수별 시작, 종료일자
let flagOrder = new Date().getDate() > 15 ? 1 : 2;
let orderWorkBgngYmd = flagOrder == 1 ? String(Moment(startOfMonth(new Date())).format("YYYYMMDD")) : String(Moment(new Date()).format("YYYYMM") - 1 + "16")
let orderWorkEndYmd = flagOrder == 1 ? String(Moment(new Date()).format("YYYYMM") + "15") : Moment(endOfMonth(new Date(Moment(Moment(new Date()).format("YYYYMM") - 1 + "15").format("YYYY-MM-DD")))).format("YYYYMMDD")
let orderWorkBgngMm = flagOrder == 1 ? String(Moment(startOfMonth(new Date())).format("YYYYMM")) : String(Moment(new Date()).format("YYYYMM") - 1)


// let orderWorkBgngYmd = flagOrder == 2 ? String(Moment(startOfMonth(new Date())).format("YYYYMMDD")) : String(Moment(new Date()).format("YYYYMM") - 1 + "16")
// let orderWorkEndYmd = flagOrder == 2 ? String(Moment(new Date()).format("YYYYMM") + "15") : Moment(endOfMonth(new Date(Moment(Moment(new Date()).format("YYYYMM") - 1 + "15").format("YYYY-MM-DD")))).format("YYYYMMDD")
// let orderWorkBgngMm = flagOrder == 2 ? String(Moment(startOfMonth(new Date())).format("YYYYMM")) : String(Moment(new Date()).format("YYYYMM") - 1)

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
 * @returns 01~12월 배열반환
 */
function getMonthList() {
    const monthList = [];

    for (let i = 1; i <= 12; i++) {
        if (i < 10) {
            monthList.push({
                key: i,
                value: "0" + i,
            });
        } else {
            monthList.push({
                key: i,
                value: i
            });
        }
    }
    return monthList;
}

const EmpMonthVacInfo = () => {
    // DevExtrme 한글화설정
    loadMessages(koMessages);
    locale('ko');


    const [cookies, setCookie] = useCookies(["userInfo", "userAuth", "deptInfo"]);
    const sessionEmpId = cookies.userInfo.empId ? cookies.userInfo.empId : "EMP_3000"


    // 프로젝트개인비용MM 조회
    const [selectPrjctIndvdlCtMmValue, setSelectPrjctIndvdlCtMmValue] = useState();
    const [searchPrjctIndvdlCtMmParam, setSearchPrjctIndvdlCtMmParam] = useState({
        queryId: "indvdlClmMapper.retrievePrjctIndvdlCtAply",
        searchType: "prjctIndvdlCtMmParam",
        empId: sessionEmpId,
        aplyYm: orderWorkBgngMm,
        aplyOdr: flagOrder,
        // empId: "sytest3",
        // aplyYm: "202402",
        // aplyOdr: "2",
    });

    // 프로젝트개인비용MM 신청여부 조회
    useEffect(() => {
        selectData(searchPrjctIndvdlCtMmParam);
    }, [searchPrjctIndvdlCtMmParam])


    const selectData = async (initParam) => {
        try {
            if (initParam.searchType == "prjctIndvdlCtMmParam") {
                let atrzDmndSttsCdFlag;
                const prjctIndvdlCtMmParamResult = await ApiRequest("/boot/common/queryIdSearch", initParam);
                const prjctIndvdlCtMmParamFilter = prjctIndvdlCtMmParamResult.filter(item => item.aplyType != "vcatnAply" && item.aplyOdr == flagOrder);

                setInsertWorkHourList(
                    await ApiRequest("/boot/common/queryIdSearch", initParam)
                )

                console.log("prjctIndvdlCtMmParamFilter : ", prjctIndvdlCtMmParamFilter);

                if(prjctIndvdlCtMmParamFilter.length > 0){
                    if (prjctIndvdlCtMmParamFilter.length == prjctIndvdlCtMmParamFilter.filter(item => item.atrzDmndSttsCd == "VTW00801").length) {
                        atrzDmndSttsCdFlag = "audit"
                    } else if(prjctIndvdlCtMmParamFilter.length == prjctIndvdlCtMmParamFilter.filter(item => item.atrzDmndSttsCd == "VTW00802").length){
                        atrzDmndSttsCdFlag = "approval"
                    } else if(prjctIndvdlCtMmParamFilter.length == prjctIndvdlCtMmParamFilter.filter(item => item.atrzDmndSttsCd == "VTW00801").length + prjctIndvdlCtMmParamFilter.filter(item => item.atrzDmndSttsCd == "VTW00802").length) {
                        atrzDmndSttsCdFlag = "composite"
                    } else {
                        atrzDmndSttsCdFlag = "use"
                    }
                } else {
                    atrzDmndSttsCdFlag = "use"
                }

                console.log("atrzDmndSttsCdFlag : ", atrzDmndSttsCdFlag);

                setSelectPrjctIndvdlCtMmValue({
                    prjctIndvdlCtMmParamResult,
                    mmAtrzCmptnYn: atrzDmndSttsCdFlag
                });
            }
        } catch (error) {
            console.log("async_error : ", error);
        }
    };





    // 공휴일정보조회
    const [holidayList, setHolidayList] = useState();

    // 공휴일정보조회
    useEffect(() => {
        getHolidayInfo();
    }, [])

    // 공휴일정보 조회
    const getHolidayInfo = async () => {
        const response = await axios.get(getHoliday.url + "ServiceKey=" + getHoliday.serviceKey + "&solYear=" + getHoliday.solYear + "&numOfRows=100").then(function (response) {
            setHolidayList(response.data.response.body.items.item)
            // console.log("공휴일조회완료")
        }).catch(function (error) {
            console.log("실패");
        })
    }





    // 검색조건
    const [searchParam, setSearchParam] = useState({
        searchYear: new Date().getFullYear(),
        searchMonth: new Date().getDate() < 15 ? new Date().getMonth() : new Date().getMonth() + 1,
        // searchMonth: new Date().getMonth() + 1,
        searchPrevYear: new Date().getFullYear(),
        searchPrevMonth: new Date().getDate() < 15 ? new Date().getMonth() : new Date().getMonth() + 1,
        // searchPrevMonth: new Date().getMonth() + 1,
        searchBoolean: true
    });





    // 근무시간정보
    const [insertWorkHourList, setInsertWorkHourList] = useState();





    // 근무시간저장정보
    const [insertWorkHourValue, setInsertWorkHourValue] = useState({
        workHour: 8,
        workBgngYmd: orderWorkBgngYmd,
        workEndYmd: orderWorkEndYmd,
    });





    // 상단검색조건
    function onSearchChg(currParam, prevParam, e) {
        setSearchParam({
            ...searchParam,
            [currParam]: e.value,
            // [prevParam]: e.previousValue,
            searchBoolean: false,
        })
    }

    // 상담검색버튼
    const searchHandle = () => {
        setSearchParam({
            ...searchParam,
            searchPrevYear: searchParam.searchYear,
            searchPrevMonth: searchParam.searchMonth,
            searchBoolean: true,
        });
    }

    // 승인요청버튼
    function onApprovalclick() {
        insertPrjctMmAply(insertWorkHourList.filter(item => item.aplyType == "workAply" && item.aplyOdr == flagOrder));
    }

    // 승인요청취소버튼
    function onApprovalCancleclick(){
        const isconfirm = window.confirm("승인요청을 취소하시겠습니까?");
        if (isconfirm) {
            deletePrjctMmAply(insertWorkHourList.filter(item => item.aplyType == "workAply" && item.aplyOdr == flagOrder));
        } else {
            return;
        }
    }

    // 승인요청버튼
    const insertPrjctMmAply = async (params) => {
        if(params.length > 0){
            try {
                const response = await ApiRequest("/boot/indvdlClm/insertPrjctMmAply", params);
                selectData(searchPrjctIndvdlCtMmParam)
            } catch (error) {
                console.log("error: ", error);
            }
        } else {
            alert("근무시간을 입력해주세요.");
            return;
        }
    }

    // 승인요청취소버튼
    const deletePrjctMmAply = async (params) => {
        if(params.length > 0){
            try {
                const response = await ApiRequest("/boot/common/queryIdSearch", {
                    queryId: "indvdlClmMapper.retrievePrjctMmAtrzRtrcn",
                    empId: sessionEmpId,
                    aplyYm: orderWorkBgngMm,
                    aplyOdr: flagOrder,
                });
                selectData(searchPrjctIndvdlCtMmParam)
            } catch (error) {
                console.log("error: ", error);
            }
        } else {
            alert("요청된 근무시간이 없습니다.");
            return;
        }
    }

    // 프로젝트ID 설정
    function onValuePrjctChange(e) {
        setInsertWorkHourValue({
            ...insertWorkHourValue,
            prjctId: e[0].prjctId,
            prjctNm: e[0].prjctNm,
        })
    }

    // 근무시간저장정보 설정
    function onInsertWorkHourValue(param, e) {
        // 날짜 parsing
        if (param == "workBgngYmd" || param == "workEndYmd") e = Moment(e).format('YYYYMMDD');

        setInsertWorkHourValue({
            ...insertWorkHourValue,
            [param]: e,
        })
    }

    // 저장
    function onSaveClick() {
        let parseData = [];
        let startDate = parseInt(insertWorkHourValue.workBgngYmd);
        let endDate = parseInt(insertWorkHourValue.workEndYmd);

        // 근무시작일자 ~ 근무종료일자 
        for (startDate; startDate <= endDate; startDate++) {
            let vcatnData = insertWorkHourList.filter(item => item.aplyYmd == Moment(String(startDate)).format("YYYYMMDD"));

            if (holidayList.find((item) => item.locdate == startDate)) {
                // parseData.push({
                //     text: holidayList.find((item) => item.locdate == startDate).dateName,
                //     aplyYmd: Moment(String(startDate)).format("YYYY-MM-DD"),
                //     isInsertBoolean: false
                // })
            } else if (isSaturday(Moment(String(startDate)).format("YYYY-MM-DD")) || isSunday(Moment(String(startDate)).format("YYYY-MM-DD"))) {
                
            } else if ( vcatnData.length > 0 && vcatnData[0].aplyType == 'vcatnAply' ){
                if(vcatnData[0].vcatnTyCd == "VTW01201" || vcatnData[0].vcatnTyCd == "VTW01204"){
                    
                } else {
                    // parseData.push({
                    //     text: insertWorkHourValue.prjctNm + " " + insertWorkHourValue.workHour > 4 ? 4 : insertWorkHourValue.workHour + "시간",
                    //     prjctId: insertWorkHourValue.prjctId,
                    //     empId: "EMP_3000",
                    //     aplyYm: orderWorkBgngMm,
                    //     aplyOdr: flagOrder,
                    //     md: insertWorkHourValue.workHour > 4 ? 0.5 : insertWorkHourValue.workHour / 8,
                    //     aplyYmd: Moment(String(startDate)).format("YYYYMMDD"),
                    //     yrycRate: 1 - (insertWorkHourValue.workHour / 8),
                    //     isInsertBoolean: true
                    // }) 
                }
            } else {
                parseData.push({
                    text: insertWorkHourValue.prjctNm + " " + insertWorkHourValue.workHour + "시간",
                    prjctId: insertWorkHourValue.prjctId,
                    empId: sessionEmpId,
                    aplyYm: orderWorkBgngMm,
                    aplyOdr: flagOrder,
                    md: insertWorkHourValue.workHour / 8,
                    aplyYmd: Moment(String(startDate)).format("YYYYMMDD"),
                    yrycRate: 1 - (insertWorkHourValue.workHour / 8),
                    aplyType: "workAply",
                    atrzDmndSttsCd: "VTW00801",
                    isInsertBoolean: true
                })
            }
        }

        if (insertWorkHourList) {
            for (let i = 0; i < insertWorkHourList.length; i++) {
                if (parseData.find(item => item.aplyYmd == insertWorkHourList[i].aplyYmd)) {
                    if (parseData.find(item => item.aplyYmd == insertWorkHourList[i].aplyYmd).md + insertWorkHourList[i].md > 1) {
                        alert("근무시간은 8시간을 초과할 수 없습니다.");
                        return;
                    }
                }
                parseData.push(insertWorkHourList[i]);
            }
        }

        setInsertWorkHourList( parseData )
    }

    function onAppointmentClick(e) {
        console.log(e);
        if (e.appointmentData.isInsertBoolean == false) e.cancel = true;
        else if (e.appointmentData.aplyType == "vcatnAply") e.cancel = true;
        else if (e.appointmentData.atrzDmndSttsCd == "VTW00801" || e.appointmentData.atrzDmndSttsCd == "VTW00802") e.cancel = true;
        else e.cancel = false;
    }

    function onAppointmentDblClick(e) {
        e.cancel = true;
    }

    function onAppointmentFormOpening(e) {
        // 해당이벤트 컨트롤 시 스크롤 사라지는 이슈 발생 해결불가능함
        e.cancel = true;
    }

    function onAppointmentDeleted(e) {
        setInsertWorkHourList(insertWorkHourList.filter(item => (item.aplyYmd != e.appointmentData.aplyYmd || item.prjctId != e.appointmentData.prjctId)))
    }

    function onCellClick(e) {
        e.cancel = true;
    }

    // 실 근무일수 구하기
    function getWorkDay(holidayList) {
        if (holidayList) {
            let startDate = parseInt(orderWorkBgngYmd);
            let endDate = parseInt(orderWorkEndYmd);
            let workDay = orderWorkEndYmd - orderWorkBgngYmd + 1;

            for (startDate; startDate <= endDate; startDate++) {
                if (isSaturday(Moment(String(startDate)).format("YYYY-MM-DD")) || isSunday(Moment(String(startDate)).format("YYYY-MM-DD"))) {
                    workDay -= 1;
                } else if (holidayList.find(item => item.locdate == startDate)) {
                    workDay -= 1;
                }
            }

            return workDay;
        }
    }

    // useEffect(() => {
    //     console.log("searchParam : ", searchParam);
    // },[searchParam])

    return (
        <div className="" style={{ marginLeft: "10%", marginRight: "10%" }}>
            <div className="mx-auto" style={{ marginTop: "20px", marginBottom: "10px" }}>
                <h1 style={{ fontSize: "30px" }}>{orderWorkBgngMm} - {flagOrder}차수 근무시간</h1>
            </div>
            <div className="mx-auto" style={{ marginBottom: "10px" }}>
                <span>* 근무시간을 기간별로 조회 합니다.</span>
            </div>
            <div className="mx-auto" style={{ marginBottom: "10px" }}>
                <span>* 근무시간 출력은 '개인청구 &#62; 프로젝트 비용' 입력마감 및 승인 후 출력 가능합니다.</span>
            </div>
            <div className="mx-auto" style={{ marginBottom: "10px" }}>
                <span>* 프로젝트 명에 마우스를 올리면 해당 프로젝트의 전체 명을 확인할 수 있습니다.</span>
            </div>
            <div className="row">
                <div className="col-md-2" style={{ marginRight: "-20px" }}>
                    <SelectBox
                        placeholder="[년도]"
                        defaultValue={new Date().getFullYear()}
                        dataSource={getYearList(10, 1)}
                        onValueChanged={(e) => { onSearchChg("searchYear", "searchPrevYear", e) }}
                    />
                </div>
                <div className="col-md-1" style={{ marginRight: "-20px" }}>
                    <SelectBox
                        dataSource={getMonthList()}
                        defaultValue={new Date().getDate() < 15 ? new Date().getMonth() : new Date().getMonth() + 1}
                        valueExpr="key"
                        displayExpr="value"
                        placeholder=""
                        onValueChanged={(e) => { onSearchChg("searchMonth", "searchPrevMonth", e) }}
                    />
                </div>
                <div className="col-md-3">
                    <Button
                        onClick={searchHandle} text="검색" style={{ height: "48px", width: "50px" }}
                    />
                    {
                        selectPrjctIndvdlCtMmValue != undefined && selectPrjctIndvdlCtMmValue.mmAtrzCmptnYn == "use"
                            ?
                            <Button
                                onClick={onApprovalclick} text="승인요청" style={{ marginLeft: "5px", height: "48px", width: "100px" }}
                            />
                            : selectPrjctIndvdlCtMmValue != undefined && (selectPrjctIndvdlCtMmValue.mmAtrzCmptnYn == "audit" || selectPrjctIndvdlCtMmValue.mmAtrzCmptnYn == "composite")
                                ?
                                    <Button
                                        onClick={onApprovalCancleclick} text='승인요청취소' style={{ marginLeft: "5px", height: "48px", width: "140px" }}
                                    />
                                : <></>
                    }
                </div>
            </div>
            {createScheduler(searchParam, insertWorkHourList)}
            {createWorkHour(holidayList, insertWorkHourList)}
            <div style={{ marginTop: "20px" }} />
            {createInsertWorkHour(selectPrjctIndvdlCtMmValue)}

        </div>
    )

    function createScheduler(searchParam, insertWorkHourList) {
        return (
            <div className="mx-auto" style={{ marginBottom: "20px", marginTop: "30px" }}>
                <Scheduler
                    locale="ko"
                    defaultCurrentView="month"
                    views={["month"]}
                    dataSource={insertWorkHourList}
                    textExpr="text"
                    startDateExpr="aplyYmd"
                    endDateExpr="aplyYmd"
                    currentDate={
                        searchParam.searchBoolean == true
                            ? new Date(searchParam.searchYear + "-" + searchParam.searchMonth)
                            : new Date(searchParam.searchPrevYear + "-" + searchParam.searchPrevMonth)
                    }
                    onAppointmentClick={onAppointmentClick}
                    onAppointmentDblClick={onAppointmentDblClick}
                    onAppointmentFormOpening={onAppointmentFormOpening}
                    onAppointmentDeleted={onAppointmentDeleted}
                    onCellClick={onCellClick}
                />
            </div>
        )
    }

    function createWorkHour(holidayList, insertWorkHourList) {
        let workHour = getWorkDay(holidayList) * 8;
        let vcatnCnt = -1;
        let vcatnFilterList;

        if(insertWorkHourList != null && insertWorkHourList != "" && insertWorkHourList != undefined && insertWorkHourList.length > 0){
            vcatnCnt = insertWorkHourList.filter(item => item.aplyType == "vcatnAply").length
        }
        return (
            <>
                <div style={{ marginTop: "10px", border: "2px solid #CCCCCC" }}>
                    <div style={{ borderBottom: "2px solid #CCCCCC" }}>
                        <div style={{ display: "flex", alignItems: "center", height: "50px", marginLeft: "20px" }}>
                            {orderWorkBgngMm} - {flagOrder}차수 근무시간 : {vcatnCnt != -1 ? workHour - vcatnCnt * 8 : workHour} / {workHour} hrs.
                        </div>
                    </div>
                    {
                        vcatnCnt != -1
                            ?
                                <div style={{ display: "flex", alignItems: "center", height: "50px", marginLeft: "20px" }}>
                                    * 휴가 : {vcatnCnt * 8} / {workHour} hrs.
                                </div>        
                            : <></>
                    }
                    <div style={{ display: "flex", alignItems: "center", height: "50px", marginLeft: "20px" }}>
                        * CSC : {vcatnCnt != -1 ? workHour - vcatnCnt * 8 : workHour}​ / {workHour} hrs.
                    </div>
                </div>
            </>
        )
    }

    function createInsertWorkHour(selectPrjctIndvdlCtMmValue) {
        return (
            <>
                {
                    selectPrjctIndvdlCtMmValue != undefined && selectPrjctIndvdlCtMmValue.mmAtrzCmptnYn == "use"
                        ?
                        <div style={{ border: "2px solid #CCCCCC" }}>
                            <div style={{ marginLeft: "30px", marginRight: "30px" }}>
                                <h5 style={{ marginTop: "30px" }}>
                                    근무시간을 입력 합니다.
                                </h5>
                                <div>
                                    아래 일관입력버튼을 사용하여 입력하시면 휴가 및 공휴일을 제외하고 일괄 입력됩니다.
                                </div>
                                <div className="row" style={{ marginTop: "30px" }}>
                                    <div className="col-md-3" style={textAlign}>프로젝트<br />(프로젝트명 또는 코드 입력)</div>
                                    <div className="col-md-4">
                                        <AutoCompleteProject
                                            placeholderText="프로젝트를 선택해주세요"
                                            onValueChange={onValuePrjctChange}
                                        />
                                    </div>
                                </div>
                                <div className="row" style={{ marginTop: "30px" }}>
                                    <div className="col-md-3" style={textAlign}>근무시작일자</div>
                                    <div className="col-md-2">
                                        <DateBox
                                            stylingMode="underlined"
                                            displayFormat="yyyy-MM-dd"
                                            value={insertWorkHourValue.workBgngYmd}
                                            min={orderWorkBgngYmd}
                                            max={orderWorkEndYmd}
                                            onValueChange={(e) => { onInsertWorkHourValue("workBgngYmd", e) }}
                                        />
                                    </div>
                                </div>
                                <div className="row" style={{ marginTop: "30px" }}>
                                    <div className="col-md-3" style={textAlign}>근무종료일자</div>
                                    <div className="col-md-2">
                                        <DateBox
                                            stylingMode="underlined"
                                            displayFormat="yyyy-MM-dd"
                                            value={insertWorkHourValue.workEndYmd}
                                            min={orderWorkBgngYmd}
                                            max={orderWorkEndYmd}
                                            onValueChange={(e) => { onInsertWorkHourValue("workEndYmd", e) }}
                                        />
                                    </div>
                                </div>
                                <div className="row" style={{ marginTop: "30px", marginBottom: "30px" }}>
                                    <div className="col-md-3" style={textAlign}>일 근무시간</div>
                                    <div className="col-md-1">
                                        <NumberBox
                                            stylingMode="underlined"
                                            showSpinButtons={true}
                                            min={0}
                                            max={8}
                                            step={1}
                                            defaultValue={8}
                                            value={insertWorkHourValue.workHour}
                                            onValueChange={(e) => { onInsertWorkHourValue("workHour", e) }}
                                        />
                                    </div>
                                    <div className="col-md-1" style={textAlignMargin}>
                                        시간
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: "inline-block", float: "right", marginTop: "25px" }}>
                                <Button style={{ height: "48px", width: "60px", marginRight: "15px" }} onClick={onSaveClick}>저장</Button>
                                <Button style={{ height: "48px", width: "80px" }}>초기화</Button>
                            </div>
                        </div>
                        : selectPrjctIndvdlCtMmValue != undefined && (selectPrjctIndvdlCtMmValue.mmAtrzCmptnYn == "audit" || selectPrjctIndvdlCtMmValue.mmAtrzCmptnYn == "composite")
                            ?
                                <div>
                                    <div style={{ marginTop: "10px", border: "2px solid #CCCCCC", height: "200px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                        <h4>근무시간 [승인요청취소] 후 등록/수정/삭제 할 수 있습니다.</h4>
                                    </div>
                                    <br /><br /><br /><br />
                                </div>
                            : selectPrjctIndvdlCtMmValue != undefined && selectPrjctIndvdlCtMmValue.mmAtrzCmptnYn == "approval"
                                ? 
                                <div>
                                    <div style={{ marginTop: "10px", border: "2px solid #CCCCCC", height: "200px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                        <h4>요청한 근무시간이 최종승인 되었습니다.</h4>
                                    </div>
                                    <br /><br /><br /><br />
                                </div>
                                : <></>

                }
            </>
        )
    }
}

export default EmpMonthVacInfo;


const textAlign = {
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "14px"
}

const textAlignMargin = {
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "14px",
    marginLeft: "-30px"
}