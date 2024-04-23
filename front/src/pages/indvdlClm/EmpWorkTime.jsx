import { useEffect, useState, useRef } from "react"
import { useCookies } from "react-cookie";

import axios from "axios";

import { SelectBox, Button, DateBox, NumberBox, Scheduler, Form } from "devextreme-react";
import { Resource } from 'devextreme-react/scheduler';

// 날짜관련
// npm install date-fns
import { isSaturday, isSunday, startOfMonth, endOfMonth } from 'date-fns'

// 날짜관련
// npm install moment
import Moment from "moment"

import ApiRequest from "utils/ApiRequest";
import AutoCompleteProject from "components/unit/AutoCompleteProject";
import '../project/approval/ProjectHtCtAprvPop.css';

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
 * 3. 년도/월 검색조건 선택 시 State로 관리하여 화면 렌더링 발생함
 *    Ref로 관리하여 화면 렌더링 차단
 * 4. 공휴일, 주말, 근무일자 데이터조회하여 변경
 */


// 차수별 시작, 종료일자
let flagOrder = new Date().getDate() > 15 ? 1 : 2;
let orderWorkBgngYmd = flagOrder == 1 ? String(Moment(startOfMonth(new Date())).format("YYYYMMDD")) : String(Moment(new Date()).format("YYYYMM") - 1 + "16")
let orderWorkEndYmd = flagOrder == 1 ? String(Moment(new Date()).format("YYYYMM") + "15") : Moment(endOfMonth(new Date(Moment(Moment(new Date()).format("YYYYMM") - 1 + "15").format("YYYY-MM-DD")))).format("YYYYMMDD")
let orderWorkBgngMm = flagOrder == 1 ? String(Moment(startOfMonth(new Date())).format("YYYYMM")) : String(Moment(new Date()).format("YYYYMM") - 1)

const EmpWorkTime = () => {
    // 근무시간데이터
    const insertValueRef = useRef(null);

    // 검색조건
    const SearchYearValueRef = useRef();
    SearchYearValueRef.current = new Date().getFullYear();

    const SearchMonthValueRef = useRef();
    SearchMonthValueRef.current = new Date().getDate() < 15 ? new Date().getMonth() : new Date().getMonth() + 1;

    // 세션설정
    const [cookies, setCookie] = useCookies(["userInfo", "deptInfo"]);
    const sessionEmpId = cookies.userInfo.empId 
    const sessionJbpsCd = cookies.userInfo.jbpsCd
    const sessionDeptIdList = [];
    const sessionDeptNmList = [];

    for (let i = 0; i < cookies.deptInfo.length; i++) {
        sessionDeptIdList.push(
            cookies.deptInfo[i].deptId
        )
        sessionDeptNmList.push(
            cookies.deptInfo[i].deptNm
        )
    }





    // 월별정보조회
    const [selectCrtrDateList, setSelectCrtrDateList] = useState();
    const [selectCrtrDateParam, setSelectCrtrDateParam] = useState({
        queryId: "indvdlClmMapper.retrieveMnbyYmdInq",
        aplyYm: orderWorkBgngMm,
    });

    // 월별정보조회
    useEffect(() => {
        getDayList(selectCrtrDateParam);
    }, [selectCrtrDateParam])
    
    const getDayList = async (selectCrtrDateParam) => {
        try {
            setSelectCrtrDateList(await ApiRequest("/boot/common/queryIdSearch", selectCrtrDateParam));
        } catch (error) {
            console.error("getDayList_error : " + error);
        }
    }





    // 프로젝트개인비용MM 조회
    const [selectPrjctIndvdlCtMmValue, setSelectPrjctIndvdlCtMmValue] = useState();
    const [searchPrjctIndvdlCtMmParam, setSearchPrjctIndvdlCtMmParam] = useState({
        queryId: "indvdlClmMapper.retrievePrjctIndvdlCtAply",
        searchType: "prjctIndvdlCtMmParam",
        empId: sessionEmpId,
        aplyOdr: flagOrder,
        searchYear: new Date().getFullYear(),
        searchMonth: new Date().getDate() < 16 ? new Date().getMonth() : new Date().getMonth() + 1,
        aplyYm:
            SearchYearValueRef.current +
            (String(new Date().getMonth()).length == 1
                ? new Date().getDate() < 16
                    ? "0" + new Date().getMonth()
                    : "0" + (new Date().getMonth() + 1)
                : new Date().getMonth() < 16
                    ? new Date().getMonth() 
                    : (new Date().getMonth() + 1)
            ),
        searchBoolean: false
    });


    // 프로젝트개인비용MM 신청여부 조회
    useEffect(() => {
        selectData(searchPrjctIndvdlCtMmParam);
    }, [searchPrjctIndvdlCtMmParam])

    // 프로젝트개인비용MM 신청여부 조회
    const selectData = async (initParam) => {
        try {
            if (initParam.searchType == "prjctIndvdlCtMmParam") {
                let atrzDmndSttsCdFlag;
                const prjctIndvdlCtMmParamResult = await ApiRequest("/boot/common/queryIdSearch", initParam);
                const prjctIndvdlCtMmParamFilter = prjctIndvdlCtMmParamResult.filter(item => item.aplyType != "vcatnAply" && item.aplyOdr == flagOrder);

                setInsertWorkHourList(await ApiRequest("/boot/common/queryIdSearch", initParam))

                if (prjctIndvdlCtMmParamFilter.length > 0) {
                    if (prjctIndvdlCtMmParamFilter.length == prjctIndvdlCtMmParamFilter.filter(item => item.atrzDmndSttsCd == "VTW03702").length) {
                        atrzDmndSttsCdFlag = "audit"
                    } else if (prjctIndvdlCtMmParamFilter.length == prjctIndvdlCtMmParamFilter.filter(item => item.atrzDmndSttsCd == "VTW03703").length) {
                        atrzDmndSttsCdFlag = "approval"
                    } else if (prjctIndvdlCtMmParamFilter.length == prjctIndvdlCtMmParamFilter.filter(item => item.atrzDmndSttsCd == "VTW03702").length + prjctIndvdlCtMmParamFilter.filter(item => item.atrzDmndSttsCd == "VTW03703").length) {
                        atrzDmndSttsCdFlag = "composite"
                    } else {
                        atrzDmndSttsCdFlag = "use"
                    }
                } else {
                    atrzDmndSttsCdFlag = "use"
                }

                setSelectPrjctIndvdlCtMmValue({
                    prjctIndvdlCtMmParamResult,
                    mmAtrzCmptnYn: atrzDmndSttsCdFlag
                });
            }
        } catch (error) {
            console.log("retrievePrjctIndvdlCtAply_error : ", error);
        }
    };





    // 검색버튼
    const searchHandle = () => {
        setSearchPrjctIndvdlCtMmParam({
            ...searchPrjctIndvdlCtMmParam,
            searchYear: SearchYearValueRef.current,
            searchMonth: SearchMonthValueRef.current,
            aplyYm: SearchYearValueRef.current + (String(SearchMonthValueRef.current).length == 1 ? "0" + SearchMonthValueRef.current : SearchMonthValueRef.current),
            searchBoolean: true,
        });
    }





    // 날짜 변경 시 재조회
    function onOptionChanged(e) {
        if (e.name == "currentDate") {
            setSearchPrjctIndvdlCtMmParam({
                ...searchPrjctIndvdlCtMmParam,
                searchYear: Moment(e.value).format("YYYY"),
                searchMonth: Moment(e.value).format("MM"),
                aplyYm: Moment(e.value).format("YYYYMM"),
                searchBoolean: true,
            });
            setSelectCrtrDateParam({
                ...selectCrtrDateParam,
                aplyYm:Moment(e.value).format("YYYYMM"),
            });
        }
    }





    // 근무시간저장정보
    const [insertWorkHourList, setInsertWorkHourList] = useState();
    const [insertWorkHourValue, setInsertWorkHourValue] = useState({
        workHour: 8,
        workBgngYmd: orderWorkBgngYmd,
        workEndYmd: orderWorkEndYmd,
        prjctId: "",
        prjctNm: "",
    });




    
    // 근무시간삭제정보
    const [deleteWorkHourList, setDeleteWorkHourList] = useState([]);





    // 승인요청버튼
    const onApprovalclick = async () => {
        const isconfirm = window.confirm("승인요청 하시겠습니까?");
        if (isconfirm) {
            let insertWorkHourListFilter = insertWorkHourList.filter(item => item.aplyType == "workAply" && item.aplyOdr == flagOrder)
            const formData = new FormData();

            formData.append("insertWorkHourList", JSON.stringify(insertWorkHourListFilter));
            formData.append("deleteWorkHourList", JSON.stringify(deleteWorkHourList));

            if (insertWorkHourList.length > 0) {
                try {
                    const response = await axios.post("/boot/indvdlClm/insertPrjctMmAply", formData, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    });
                    selectData(searchPrjctIndvdlCtMmParam);
                    alert("승인요청되었습니다.");
                } catch (error) {
                    console.log("insertPrjctMmAply_error: ", error);
                }
            } else {
                alert("근무시간을 입력해주세요.");
                return;
            }
        } else {
            return;
        }
    }

    // 승인요청취소버튼
    const onApprovalCancleclick = async () => {
        const isconfirm = window.confirm("승인요청을 취소하시겠습니까?");
        if (isconfirm) {
            let deleteParams = insertWorkHourList.filter(item => item.aplyType == "workAply" && item.aplyOdr == flagOrder && item.atrzDmndSttsCd != "VTW03703");
            if (deleteParams.length > 0) {
                try {
                    const response = await ApiRequest("/boot/indvdlClm/updatePrjctMmAply", deleteParams);
                    selectData(searchPrjctIndvdlCtMmParam);
                    alert("승인취소되었습니다.");
                } catch (error) {
                    console.log("updatePrjctMmAply_error: ", error);
                }
            } else {
                alert("요청된 근무시간이 없습니다.");
                return;
            }
        } else {
            return;
        }
    }

    // 저장
    function onSaveClick() {
        let errorMsg;
        let inputFormData = insertValueRef.current.props.data;

        if (!inputFormData.prjctId) errorMsg = "프로젝트를 선택하세요."
        else if (!inputFormData.workBgngYmd) errorMsg = "근무시작시간을 선택하세요."
        else if (!inputFormData.workEndYmd) errorMsg = "근무종료시간을 선택하세요."
        else if (!inputFormData.workHour) errorMsg = "근무시간을 선택하세요."

        if (errorMsg) {
            alert(errorMsg);
            return;
        } else {
            let parseData = [];
            let startDate = parseInt(inputFormData.workBgngYmd);
            let endDate = parseInt(inputFormData.workEndYmd);

            for (startDate; startDate <= endDate; startDate++) {
                let vcatnData = insertWorkHourList.filter(item => item.aplyYmd == Moment(String(startDate)).format("YYYYMMDD"));

                if (selectCrtrDateList.find((item) => item.crtrYmd == startDate && item.hldyClCd == "VTW05003")) {
                
                } else if (isSaturday(Moment(String(startDate)).format("YYYY-MM-DD")) || isSunday(Moment(String(startDate)).format("YYYY-MM-DD"))) {
                    
                } else if (vcatnData.length > 0 && vcatnData[0].aplyType == 'vcatnAply') {
                    if (vcatnData[0].vcatnTyCd == "VTW01201" || vcatnData[0].vcatnTyCd == "VTW01204") {
                        
                    } else {
                        parseData.push({
                            text: inputFormData.prjctNm + " " + (inputFormData.workHour > 4 ? 4 : inputFormData.workHour) + "시간",
                            prjctId: inputFormData.prjctId,
                            empId: sessionEmpId,
                            aplyYm: orderWorkBgngMm,
                            aplyOdr: flagOrder,
                            md: inputFormData.workHour > 4 ? 0.5 : inputFormData.workHour / 8,
                            aplyYmd: Moment(String(startDate)).format("YYYYMMDD"),
                            yrycRate: 1 - (inputFormData.workHour > 4 ? 0.5 : inputFormData.workHour / 8),
                            aplyType: "workAply",
                            atrzDmndSttsCd: "VTW03702",
                            isInsertBoolean: true,
                            jbpsCd: sessionJbpsCd
                        })
                    }
                } else {
                    parseData.push({
                        text: inputFormData.prjctNm + " " + inputFormData.workHour + "시간",
                        prjctId: inputFormData.prjctId,
                        empId: sessionEmpId,
                        aplyYm: orderWorkBgngMm,
                        aplyOdr: flagOrder,
                        md: inputFormData.workHour / 8,
                        aplyYmd: Moment(String(startDate)).format("YYYYMMDD"),
                        yrycRate: 1 - (inputFormData.workHour / 8),
                        aplyType: "workAply",
                        atrzDmndSttsCd: "VTW03702",
                        isInsertBoolean: true,
                        jbpsCd: sessionJbpsCd
                    })
                }
            }

            // 현재 선택된 직전 근무시간 데이터 정합성 체크
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

            // 누적 선택된 근무시간 정합성 체크
            for (let i = 0; i < parseData.length; i++) {
                let workHourCheckList = [];
                let workHourValue = 0;

                workHourCheckList = parseData.filter(item => item.aplyYmd == parseData[i].aplyYmd)

                if (workHourCheckList) {
                    workHourCheckList.map((item, index) => {
                        workHourValue += parseFloat(workHourCheckList[index].md)
                    })

                    if (workHourValue > 1) {
                        alert("근무시간은 8시간을 초과할 수 없습니다.")
                        return;
                    }
                }
            }
            setInsertWorkHourList(parseData);
        }
    }

    function onAppointmentClick(e) {
        if (e.appointmentData.isInsertBoolean == false) e.cancel = true;
        else if (e.appointmentData.aplyType == "vcatnAply") e.cancel = true;
        else if (e.appointmentData.isInsertBoolean != true && e.appointmentData.atrzDmndSttsCd == "VTW03702" || e.appointmentData.atrzDmndSttsCd == "VTW03703") e.cancel = true;
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
        setDeleteWorkHourList([...deleteWorkHourList, e.appointmentData])
        setInsertWorkHourList(insertWorkHourList.filter(item => (item.aplyYmd != e.appointmentData.aplyYmd || item.prjctId != e.appointmentData.prjctId)))
    }

    function onCellClick(e) {
        e.cancel = true;
    }

    // 전체삭제버튼
    function onDeleteListClick(e){
        const isconfirm = window.confirm("승인된 목록을 제외한 근무시간들이 삭제됩니다.\n삭제하시겠습니까?");
        if (isconfirm) {
            setInsertWorkHourList(insertWorkHourList.filter(item => item.atrzDmndSttsCd == "VTW03703" || item.aplyType != "workAply"));
        } else {
            return;
        }
    }

    // 실 근무일수 구하기
    function getWorkDay(selectCrtrDateList) {
        if (selectCrtrDateList) {
            return selectCrtrDateList.filter(item => item.crtrOdr == flagOrder && item.hldyClCd == "VTW05001").length;
        }
    }

    // 공휴일수 구하기
    function getHoliDay(selectCrtrDateList) {
        if (selectCrtrDateList) {
            return selectCrtrDateList.filter(item => item.crtrOdr == flagOrder && item.hldyClCd == "VTW05003").length;
        }
    }

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
                        ref={SearchYearValueRef}
                        onValueChanged={(e) => { SearchYearValueRef.current = e.value }}
                    />
                </div>
                <div className="col-md-2" style={{ marginRight: "-20px", width: "150px" }}>
                    <SelectBox
                        dataSource={getMonthList()}
                        defaultValue={new Date().getDate() < 15 ? new Date().getMonth() : new Date().getMonth() + 1}
                        valueExpr="key"
                        displayExpr="value"
                        placeholder=""
                        ref={SearchMonthValueRef}
                        onValueChanged={(e) => { SearchMonthValueRef.current = e.value }}
                    />
                </div>
                <div className="col-md-2">
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
            <div className="row">
                <div className="col-md-3">
                    <div style={{ display: "flex", alignItems: "center", marginTop: "20px" }}>
                        <span style={{ width: "50px", background: "#6495ed", textAlign: "center", color: "white", fontWeight: "bold" }}>결재중</span>
                        <span style={{ width: "50px", background: "#008000", marginLeft: "20px", textAlign: "center", color: "white", fontWeight: "bold" }}>승인</span>
                        <span style={{ width: "50px", background: "#ff4500", marginLeft: "20px", textAlign: "center", color: "white", fontWeight: "bold" }}>반려</span>
                    </div>
                </div>
                <div className="col-md-9">
                    <div style={{ display: "inline-block", float: "right"}}>
                        <Button text="전체삭제" onClick={onDeleteListClick}/>
                    </div>
                </div>
            </div>
            {createScheduler(insertWorkHourList)}
            {createWorkHour(selectCrtrDateList, insertWorkHourList)}
            {createInsertWorkHour(selectPrjctIndvdlCtMmValue)}
        </div>
    )

    function createScheduler(insertWorkHourList) {
        const resourcesData = [
            {
                id: "VTW03702",
                color: '#6495ed',
            },
            {
                id: "VTW03703",
                color: '#008000',
            },
            {
                id: "VTW03704",
                color: '#ff4500',
            },
            {
                id: "",
                color: '#6495ed',
            },
        ];

        const customDateCell = (props) => {
            const { data: { startDate, text } } = props;
            const dayClass = ['dx-template-wrapper'];
            dayClass.push(isSaturday(Moment(String(startDate)).format("YYYY-MM-DD")) == true ? "saturday" : "");
            dayClass.push(isSunday(Moment(String(startDate)).format("YYYY-MM-DD")) == true ? "sunday" : "");

            if(selectCrtrDateList){
                let holidayList = selectCrtrDateList.filter(item => item.hldyClCd == "VTW05003");
                dayClass.push(holidayList.find(item => item.crtrYmd == Moment(String(startDate)).format("YYYYMMDD")) ? "sunday" : "");
            }

            return (
                <div className={dayClass.join(' ')}>
                    <div className={'day-cell'}>{text}</div>
                </div>
            );
        };

        return (
            insertWorkHourList ? 
            <div className="mx-auto" style={{ marginBottom: "20px", marginTop: "30px" }}>
                <Scheduler
                    locale="ko"
                    defaultCurrentView="month"
                    views={["month"]}
                    dataSource={insertWorkHourList}
                    textExpr="text"
                    startDateExpr="aplyYmd"
                    endDateExpr="aplyYmd"
                    dataCellComponent={customDateCell}
                    currentDate={new Date(searchPrjctIndvdlCtMmParam.searchYear + "-" + searchPrjctIndvdlCtMmParam.searchMonth)}
                    onAppointmentClick={onAppointmentClick}
                    onAppointmentDblClick={onAppointmentDblClick}
                    onAppointmentFormOpening={onAppointmentFormOpening}
                    onAppointmentDeleted={onAppointmentDeleted}
                    onCellClick={onCellClick}
                    onOptionChanged={onOptionChanged}
                >
                    <Resource
                        dataSource={resourcesData}
                        fieldExpr="atrzDmndSttsCd"
                    />
                </Scheduler>
            </div>
            : <></>
        )
    }

    function createWorkHour(selectCrtrDateList, insertWorkHourList) {
        let workHour = getWorkDay(selectCrtrDateList) * 8;
        let holiHour = getHoliDay(selectCrtrDateList) * 8;
        let vcatnCnt = 0;

        if (insertWorkHourList) vcatnCnt = insertWorkHourList.filter(item => item.aplyType == "vcatnAply" && item.aplyOdr == flagOrder).length


        return (
            <>
                <div style={{ marginTop: "10px", border: "2px solid #CCCCCC" }}>
                    <div style={{ borderBottom: "2px solid #CCCCCC" }}>
                        <div style={{ display: "flex", alignItems: "center", height: "50px", marginLeft: "20px" }}>
                            {orderWorkBgngMm} - {flagOrder}차수 근무시간 : {vcatnCnt != 0 ? workHour - vcatnCnt * 8 : workHour} / {workHour} hrs.
                        </div>
                    </div>
                    {
                        vcatnCnt != 0
                            ?
                            <div style={{ display: "flex", alignItems: "center", height: "40px", marginLeft: "20px" }}>
                                * 휴가 : {vcatnCnt * 8} / {workHour} hrs.
                            </div>
                            : <></>
                    }
                    {
                        holiHour != 0
                            ?
                            <div style={{ display: "flex", alignItems: "center", height: "40px", marginLeft: "20px" }}>
                                * 공휴일 : {holiHour} / {holiHour} hrs.
                            </div>
                            : <></>
                    }
                    <div style={{ display: "flex", alignItems: "center", height: "50px", marginLeft: "20px" }}>
                        * {"\u00A0"}{
                            sessionDeptNmList.map((item, index) => {
                                if (sessionDeptNmList.length == index + 1) {
                                    return (
                                        <div key={index}>
                                            {sessionDeptNmList[index] + "\u00A0"}
                                        </div>
                                    )
                                } else {
                                    return (
                                        <div key={index}>
                                            {sessionDeptNmList[index] + ", \u00A0 "}
                                        </div>
                                    )
                                }
                            })
                        } : {vcatnCnt != 0 ? workHour - vcatnCnt * 8 : workHour}​ / {workHour} hrs.
                    </div>
                </div>
            </>
        )
    }

    function createInsertWorkHour(selectPrjctIndvdlCtMmValue) {
        let refInsertWorkHourValue = insertWorkHourValue;

        function onRefInsertWorkHourValue(param, e) {
            if (param == "workBgngYmd" || param == "workEndYmd") e = Moment(e).format('YYYYMMDD');

            refInsertWorkHourValue[param] = e;
        }

        function onRefValuePrjctChange(e) {
            refInsertWorkHourValue.prjctId = e[0].prjctId;
            refInsertWorkHourValue.prjctNm = e[0].prjctNm;
        }
        
        return (
            <Form ref={insertValueRef} data={refInsertWorkHourValue} style={{ marginTop: "20px" }}>
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
                                            onValueChange={onRefValuePrjctChange}
                                            sttsBoolean={true}
                                        />
                                    </div>
                                </div>
                                <div className="row" style={{ marginTop: "30px" }}>
                                    <div className="col-md-3" style={textAlign}>근무시작일자</div>
                                    <div className="col-md-2">
                                        <DateBox
                                            stylingMode="underlined"
                                            displayFormat="yyyy-MM-dd"
                                            defaultValue={refInsertWorkHourValue.workBgngYmd}
                                            min={orderWorkBgngYmd}
                                            max={orderWorkEndYmd}
                                            onValueChange={(e) => { onRefInsertWorkHourValue("workBgngYmd", e) }}
                                        />
                                    </div>
                                </div>
                                <div className="row" style={{ marginTop: "30px" }}>
                                    <div className="col-md-3" style={textAlign}>근무종료일자</div>
                                    <div className="col-md-2">
                                        <DateBox
                                            stylingMode="underlined"
                                            displayFormat="yyyy-MM-dd"
                                            defaultValue={refInsertWorkHourValue.workEndYmd}
                                            min={orderWorkBgngYmd}
                                            max={orderWorkEndYmd}
                                            onValueChange={(e) => { onRefInsertWorkHourValue("workEndYmd", e) }}
                                        />
                                    </div>
                                </div>
                                <div className="row" style={{ marginTop: "30px", marginBottom: "30px" }}>
                                    <div className="col-md-3" style={textAlign}>일 근무시간</div>
                                    <div className="col-md-1">
                                        <NumberBox
                                            stylingMode="underlined"
                                            showSpinButtons={true}
                                            min={1}
                                            max={8}
                                            step={1}
                                            defaultValue={8}
                                            onValueChange={(e) => { onRefInsertWorkHourValue("workHour", e) }}
                                        />
                                    </div>
                                    <div className="col-md-1" style={textAlignMargin}>
                                        시간
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: "inline-block", float: "right", marginTop: "25px" }}>
                                <Button style={{ height: "48px", width: "60px", marginRight: "15px" }} onClick={onSaveClick}>저장</Button>
                                {/* <Button style={{ height: "48px", width: "80px" }}>초기화</Button> */}
                            </div>
                        </div>
                        : selectPrjctIndvdlCtMmValue != undefined && (selectPrjctIndvdlCtMmValue.mmAtrzCmptnYn == "audit" || selectPrjctIndvdlCtMmValue.mmAtrzCmptnYn == "composite")
                            ?
                            <div>
                                <div style={{ marginTop: "10px", border: "2px solid #CCCCCC", height: "200px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    <h4>근무시간 [승인요청취소] 후 등록/수정/삭제 할 수 있습니다.</h4>
                                </div>
                            </div>
                            : selectPrjctIndvdlCtMmValue != undefined && selectPrjctIndvdlCtMmValue.mmAtrzCmptnYn == "approval"
                                ?
                                <div>
                                    <div style={{ marginTop: "10px", border: "2px solid #CCCCCC", height: "200px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                        <h4>요청한 근무시간이 최종승인 되었습니다.</h4>
                                    </div>
                                </div>
                                : <></>
                }
            </Form>
        )
    }
}

export default EmpWorkTime;


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