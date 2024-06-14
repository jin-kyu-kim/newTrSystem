import { useEffect, useState, useRef } from "react"
import { useLocation } from "react-router-dom";
import { SelectBox, Button, DateBox, NumberBox, Scheduler, Form } from "devextreme-react";
import { Resource, AppointmentDragging } from 'devextreme-react/scheduler';
import { isSaturday, isSunday, startOfMonth, endOfMonth } from 'date-fns'
import Moment from "moment"
import axios from "axios";
import ApiRequest from "utils/ApiRequest";
import { useModal } from "components/unit/ModalContext";
import '../project/approval/ProjectHtCtAprvPop.css';

const token = localStorage.getItem("token");

const EmpWorkTime = () => {
    const { handleOpen } = useModal();
    const location = useLocation();
    const admin = location.state ? location.state.admin : undefined;

    // 근무시간데이터
    const insertValueRef = useRef(null);

    // 검색조건
    const SearchYearValueRef = useRef();
    SearchYearValueRef.current = new Date().getFullYear();

    const SearchMonthValueRef = useRef();
    SearchMonthValueRef.current = new Date().getDate() < 15 ? new Date().getMonth() : new Date().getMonth() + 1;

    // 차수별 시작, 종료일자
    let flagOrder = admin != undefined ? admin.aplyOdr : new Date().getDate() > 15 ? 1 : 2;
    let orderWorkBgngYmd = admin != undefined ? admin.orderWorkBgngYmd : flagOrder == 1 ? String(Moment(startOfMonth(new Date())).format("YYYYMMDD")) : String(Moment(new Date()).format("YYYYMM") - 1 + "16")
    let orderWorkEndYmd = admin != undefined ? admin.orderWorkEndYmd : flagOrder == 1 ? String(Moment(new Date()).format("YYYYMM") + "15") : Moment(endOfMonth(new Date(Moment(Moment(new Date()).format("YYYYMM") - 1 + "15").format("YYYY-MM-DD")))).format("YYYYMMDD")
    let orderWorkBgngMm = admin != undefined ? admin.aplyYm : flagOrder == 1 ? String(Moment(startOfMonth(new Date())).format("YYYYMM")) : String(Moment(new Date()).format("YYYYMM") - 1)

    // 세션설정
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const deptInfo = JSON.parse(localStorage.getItem("deptInfo"));
    const sessionEmpId = admin != undefined ? admin.empId : userInfo.empId
    const sessionJbpsCd = admin != undefined ? admin.jbpsCd : userInfo.jbpsCd
    const sessionDeptIdList = [];
    const sessionDeptNmList = admin != undefined ? [admin.deptNmAll] : [];

    if (sessionDeptNmList.length == 0) {
        for (let i = 0; i < deptInfo.length; i++) {
            sessionDeptIdList.push(
                deptInfo[i].deptId
            )
            sessionDeptNmList.push(
                deptInfo[i].deptNm
            )
        }
    }

    // 프로젝트목록 조회
    useEffect(() => {
        getPrjctInfo();
    }, [])

    // 프로젝트 목록 조회
    const [selectPrjctList, setSelectPrjctList] = useState();

    // 프로젝트 목록 조회
    const getPrjctInfo = async () => {
        try {
            setSelectPrjctList(await ApiRequest("/boot/common/queryIdSearch", { queryId: "indvdlClmMapper.retrievePrjctList" }));
        } catch (error) {
            console.error("getPrjctInfo_error : " + error);
        }
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
        aplyYm: admin != undefined ? admin.aplyYm :
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
                    if (orderWorkBgngMm != searchPrjctIndvdlCtMmParam.aplyYm) {
                        atrzDmndSttsCdFlag = "another"
                    } else if (prjctIndvdlCtMmParamFilter.length == prjctIndvdlCtMmParamFilter.filter(item => item.atrzDmndSttsCd == "VTW03702").length) {
                        atrzDmndSttsCdFlag = "audit"
                    } else if (prjctIndvdlCtMmParamFilter.length == prjctIndvdlCtMmParamFilter.filter(item => item.atrzDmndSttsCd == "VTW03703").length) {
                        atrzDmndSttsCdFlag = "approval"
                    } else if (prjctIndvdlCtMmParamFilter.length == prjctIndvdlCtMmParamFilter.filter(item => item.atrzDmndSttsCd == "VTW03702").length + prjctIndvdlCtMmParamFilter.filter(item => item.atrzDmndSttsCd == "VTW03703").length) {
                        atrzDmndSttsCdFlag = "composite"
                    } else {
                        atrzDmndSttsCdFlag = "use"
                    }
                } else {
                    if (orderWorkBgngMm != searchPrjctIndvdlCtMmParam.aplyYm) {
                        atrzDmndSttsCdFlag = "another"
                    } else {
                        atrzDmndSttsCdFlag = "use"
                    }
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
                aplyYm: Moment(e.value).format("YYYYMM"),
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
        let insertWorkHourListFilter = insertWorkHourList.filter(item => item.aplyType == "workAply" && item.aplyOdr == flagOrder && item.atrzDmndSttsCd == "VTW03701")

        if (insertWorkHourListFilter.length > 0) {
            try {
                const response = await ApiRequest("/boot/indvdlClm/insertPrjctMmAply", insertWorkHourListFilter);
                console.log('res', response)
                selectData(searchPrjctIndvdlCtMmParam);
                handleOpen("승인요청되었습니다.");
            } catch (error) {
                handleOpen("승인요청에 실패했습니다.")
            }
        } else {
            handleOpen("승인요청 가능한 근무시간이 없습니다.");
        }
    }

    // 승인요청취소버튼
    const onApprovalCancleclick = async () => {
        let deleteParams = insertWorkHourList.filter(item => item.aplyType == "workAply" && item.aplyOdr == flagOrder && item.atrzDmndSttsCd != "VTW03703");

        if (deleteParams.length > 0) {
            try {
                const response = await ApiRequest("/boot/indvdlClm/updatePrjctMmAply", deleteParams);
                selectData(searchPrjctIndvdlCtMmParam);
                handleOpen("승인취소되었습니다.");
            } catch (error) {
                handleOpen("승인취소에 실패했습니다.")
            }
        } else {
            handleOpen("승인취소 가능한 근무시간이 없습니다.");
        }
    }

    // 근무시간 임시저장
    function onSaveClick() {
        let errorMsg;
        let inputFormData = insertValueRef.current.props.data;

        if (!inputFormData.prjctId) errorMsg = "프로젝트를 선택하세요."
        else if (!inputFormData.workBgngYmd) errorMsg = "근무시작시간을 선택하세요."
        else if (!inputFormData.workEndYmd) errorMsg = "근무종료시간을 선택하세요."
        else if (!inputFormData.workHour) errorMsg = "근무시간을 선택하세요."

        if (errorMsg) {
            handleOpen(errorMsg);
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
                    console.log('vcant', vcatnData)
                    if (vcatnData[0].vcatnTyCd == "VTW01201" || vcatnData[0].vcatnTyCd == "VTW01204") {
                        
                    } else if (['VTW01202', 'VTW01203', 'VTW01205'].includes(vcatnData[0].vcatnTyCd) && vcatnData.length >= 2) {
                        console.log('???')
                    } else {
                        parseData.push({
                            text: inputFormData.prjctNm + " " + (inputFormData.workHour > 4 ? 4 : inputFormData.workHour) + "시간",
                            prjctId: inputFormData.prjctId,
                            empId: sessionEmpId,
                            jbpsCd: sessionJbpsCd,
                            aplyYm: orderWorkBgngMm,
                            aplyOdr: flagOrder,
                            md: inputFormData.workHour > 4 ? 0.5 : inputFormData.workHour / 8,
                            aplyYmd: Moment(String(startDate)).format("YYYYMMDD"),
                            yrycRate: 1 - (inputFormData.workHour > 4 ? 0.5 : inputFormData.workHour / 8),
                            aplyType: "workAply",
                            atrzDmndSttsCd: "VTW03701",
                            aprvrEmpId: inputFormData.aprvrEmpId,
                            isInsertBoolean: true,
                            stateType: "temp"
                        })
                    }
                } else {
                    parseData.push({
                        text: inputFormData.prjctNm + " " + inputFormData.workHour + "시간",
                        prjctId: inputFormData.prjctId,
                        empId: sessionEmpId,
                        jbpsCd: sessionJbpsCd,
                        aplyYm: orderWorkBgngMm,
                        aplyOdr: flagOrder,
                        md: inputFormData.workHour / 8,
                        aplyYmd: Moment(String(startDate)).format("YYYYMMDD"),
                        yrycRate: 0,
                        aplyType: "workAply",
                        atrzDmndSttsCd: "VTW03701",
                        aprvrEmpId: inputFormData.aprvrEmpId,
                        isInsertBoolean: true,
                        stateType: "temp"
                    })
                }
            }

            // 현재 선택된 직전 근무시간 데이터 정합성 체크
            if (insertWorkHourList) {
                for (let i = 0; i < insertWorkHourList.length; i++) {
                    if (parseData.find(item => item.aplyYmd == insertWorkHourList[i].aplyYmd)) {
                        if (((parseData.find(item => item.aplyYmd == insertWorkHourList[i].aplyYmd).md) + (insertWorkHourList[i].atrzDmndSttsCd ==='VTW03704' ? 0: insertWorkHourList[i].md)) > 1) {
                            handleOpen("근무시간은 8시간을 초과할 수 없습니다.");
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
                        if(item.atrzDmndSttsCd !== 'VTW03704'){
                            workHourValue += parseFloat(workHourCheckList[index].md);
                        }
                    })

                    if (workHourValue > 1) {
                        handleOpen("근무시간은 8시간을 초과할 수 없습니다.")
                        return;
                    }
                }
            }
            setInsertWorkHourList(parseData);
        }
    }

    // 근무시간 임시저장
    useEffect(() => {
        if (insertWorkHourList) {
            let insertPrjctMmStateTempFilter = insertWorkHourList.filter(item => item.stateType == "temp");

            if (insertPrjctMmStateTempFilter.length > 0) insertPrjctMmTemp(insertPrjctMmStateTempFilter);
        }
    }, [insertWorkHourList])

    // 근무시간 임시저장
    const insertPrjctMmTemp = async (param) => {
        if (param.length > 0) {
            try {
                const response = await ApiRequest("/boot/indvdlClm/insertPrjctMmAplyTemp", param);
                selectData(searchPrjctIndvdlCtMmParam);
            } catch (error) {
                handleOpen("저장에 실패했습니다.");
                setInsertWorkHourList(insertWorkHourList.filter(item => item.stateType != "temp"));
            }
        } else {
            handleOpen("근무시간을 입력해주세요.");
            return;
        }
    }

    // 단건삭제
    function onAppointmentDeleted(e) {
        e.appointmentData["stateType"] = "delete"

        setDeleteWorkHourList([e.appointmentData])
        setInsertWorkHourList(insertWorkHourList.filter(item => (item.aplyYmd != e.appointmentData.aplyYmd || item.prjctId != e.appointmentData.prjctId)))
    }

    // 전체삭제버튼
    function onDeleteListClick(e) {
        let deletePushData = insertWorkHourList.filter(item => ((item.atrzDmndSttsCd != "VTW03703" && item.atrzDmndSttsCd != "VTW03702") && item.aplyOdr == flagOrder && item.aplyType == "workAply"));

        if (deletePushData.length > 0) {
            deletePushData.map((item, index) => { deletePushData[index]["stateType"] = "delete" })

            setDeleteWorkHourList(deletePushData);
            setInsertWorkHourList(insertWorkHourList.filter(item => item.aplyOdr != flagOrder || item.atrzDmndSttsCd == "VTW03703" || item.atrzDmndSttsCd == "VTW03702" || item.aplyType != "workAply"));
        } else if (deletePushData.length == 0) {
            handleOpen("삭제가능한 근무시간이 없습니다.")
        }
    }

    // 근무시간 단건/다건 삭제
    useEffect(() => {
        if (deleteWorkHourList && deleteWorkHourList.length > 0) {
            deletePrjctMmTemp();
        }
    }, [deleteWorkHourList])

    // 근무시간 단건/다건 삭제
    const deletePrjctMmTemp = async () => {
        const formData = new FormData();

        formData.append("deletePrjctMmList", JSON.stringify(deleteWorkHourList));
        formData.append("updatePrjctMmList", JSON.stringify({ empId: sessionEmpId, flagOrder: flagOrder, orderWorkBgngMm: orderWorkBgngMm }));

        try {
            const response = await axios.post("/boot/indvdlClm/deletePrjctMmAply", formData, { headers: { 'Content-Type': 'multipart/form-data', "Authorization": `Bearer ${token}` }, });
            if(deleteWorkHourList.length > 1) handleOpen ("삭제되었습니다.")
        } catch (error) {
            handleOpen("삭제에 실패했습니다.")
        }
    }

    // 근무일수 구하기
    function getWorkDay(selectCrtrDateList) {
        if (selectCrtrDateList) {
            return selectCrtrDateList.filter(item => item.aplyYm == searchPrjctIndvdlCtMmParam.aplyYm && item.crtrOdr == flagOrder && item.hldyClCd == "VTW05001").length;
        }
    }

    // 공휴일수 구하기
    function getHoliDay(selectCrtrDateList) {
        if (selectCrtrDateList) {
            return selectCrtrDateList.filter(item => item.aplyYm == searchPrjctIndvdlCtMmParam.aplyYm && item.crtrOdr == flagOrder && item.hldyClCd == "VTW05003").length;
        }
    }

    // 실 근무일수 구하기
    function getRealWorkDay(insertWorkHourList){
        let cnt = 0;
        if (insertWorkHourList) {
            insertWorkHourList.map((item) => {
                if(item.aplyType == "workAply" && item.aplyOdr == flagOrder) cnt += item.md * 8;
            })
        }
        return cnt;
    }

    // 휴가일수 구하기
    function getVcatnDay(insertWorkHourList){
        let cnt = 0;
        if (insertWorkHourList) {
            insertWorkHourList.map((item) => {
                if (item.aplyType == "vcatnAply" && item.aplyOdr == flagOrder && item.md == 0) cnt += 8;
                if (item.aplyType == "vcatnAply" && item.aplyOdr == flagOrder && item.md == 0.5) cnt += 4;
            })
        }
        return cnt;
    }





    /* devextreme 이벤트 컨트롤 */
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
        e.cancel = true;
    }
    function onCellClick(e) {
        e.cancel = true;
    }
    function onDragStart(e){
        e.cancel = true
    }

    return (
        <div className="">
            <div className="title" style={{fontWeight: "500"}}>{admin != undefined ? "(관리자)" : ""} {orderWorkBgngMm} - {flagOrder}차수 근무시간</div>
            <div className="mx-auto" style={{ marginBottom: "10px" }}>
                <span>* 근무시간을 기간별로 조회 합니다.</span>
            </div>
            <div className="mx-auto" style={{ marginBottom: "10px" }}>
                <span>* 근무시간 출력은 '개인청구 &#62; 프로젝트 비용' 입력마감 및 승인 후 출력 가능합니다.</span>
            </div>
            <div className="mx-auto" style={{ marginBottom: "10px" }}>
                <span>* 프로젝트 명에 마우스를 올리면 해당 프로젝트의 전체 명을 확인할 수 있습니다.</span>
            </div>
            <div className="mx-auto" style={{ marginBottom: "10px" }}>
                <span>* 임시저장, 반려의 근무시간만 삭제가능합니다.</span>
            </div>
            <div className="row">
                {
                    admin != undefined ? <></>
                        :
                        <>
                            <div className="col-md-2" style={{ marginRight: "-20px" }}>
                                <SelectBox
                                    placeholder="[년도]"
                                    defaultValue={new Date().getFullYear()}
                                    dataSource={getYearList(10, 1)}
                                    ref={SearchYearValueRef}
                                    onEnterKey={searchHandle}
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
                                    onEnterKey={searchHandle}
                                    onValueChanged={(e) => { SearchMonthValueRef.current = e.value }}
                                />
                            </div>
                        </>
                }
                <div className="col-md-4">
                    {
                        admin != undefined
                            ? <></>
                            : <Button onClick={searchHandle} text="검색" style={{ height: "48px", width: "50px" }} />
                    }
                    {
                        selectPrjctIndvdlCtMmValue != undefined && selectPrjctIndvdlCtMmValue.mmAtrzCmptnYn == "use"
                            ? <Button onClick={(e) => { handleOpen("승인요청하시겠습니까?", onApprovalclick) }} text="승인요청" 
                                style={{ marginLeft: "5px", height: "48px", width: "100px" }} type='default' />
                            : selectPrjctIndvdlCtMmValue != undefined && (selectPrjctIndvdlCtMmValue.mmAtrzCmptnYn == "audit" || selectPrjctIndvdlCtMmValue.mmAtrzCmptnYn == "composite")
                            ? <Button onClick={() => { handleOpen("승인요청을 취소하시겠습니까?", onApprovalCancleclick) }} text='승인요청취소' 
                                style={{ marginLeft: "5px", height: "48px", width: "140px" }} type='danger'/>
                            : <></>
                    }
                </div>
            </div>
            <div className="row">
                <div className="col-md-4">
                    <div style={{ display: "flex", alignItems: "center", marginTop: "20px" }}>
                        <span style={{ width: "70px", background: "#999999", textAlign: "center", color: "white", fontWeight: "bold" }}>임시저장</span>
                        <span style={{ width: "50px", background: "#6495ed", marginLeft: "20px", textAlign: "center", color: "white", fontWeight: "bold" }}>결재중</span>
                        <span style={{ width: "50px", background: "#008000", marginLeft: "20px", textAlign: "center", color: "white", fontWeight: "bold" }}>승인</span>
                        <span style={{ width: "50px", background: "#ff4500", marginLeft: "20px", textAlign: "center", color: "white", fontWeight: "bold" }}>반려</span>
                    </div>
                </div>
                <div className="col-md-8">
                    <div style={{ display: "inline-block", float: "right" }}>
                        <Button text="전체삭제" onClick={() => { handleOpen("[승인], [결재중] 항목을 제외한 시간이 삭제됩니다.", onDeleteListClick) }} />
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
            { id: "VTW03702", color: '#6495ed' },
            { id: "VTW03703", color: '#008000' },
            { id: "VTW03704", color: '#ff4500' },
            { id: "VTW03701", color: '#999999' }
        ];

        const customDateCell = (props) => {
            const { data: { startDate, text } } = props;
            const dayClass = ['dx-template-wrapper'];
            dayClass.push(isSaturday(Moment(String(startDate)).format("YYYY-MM-DD")) == true ? "saturday" : "");
            dayClass.push(isSunday(Moment(String(startDate)).format("YYYY-MM-DD")) == true ? "sunday" : "");

            if (selectCrtrDateList) {
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
                        currentDate={admin != undefined ? admin.orderWorkBgngYmd : new Date(searchPrjctIndvdlCtMmParam.searchYear + "-" + searchPrjctIndvdlCtMmParam.searchMonth)}
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
                        <AppointmentDragging
                            onDragStart={onDragStart}
                        />
                    </Scheduler>
                </div>
                : <></>
        )
    }

    function createWorkHour(selectCrtrDateList, insertWorkHourList) {
        let workHour = getWorkDay(selectCrtrDateList) * 8;
        let holiHour = getHoliDay(selectCrtrDateList) * 8;
        let realWorkHour = getRealWorkDay(insertWorkHourList);
        let vcatnHour = getVcatnDay(insertWorkHourList)

        return (
            <>
                <div style={{ marginTop: "10px", border: "2px solid #CCCCCC" }}>
                    <div style={{ borderBottom: "2px solid #CCCCCC" }}>
                        <div style={{ display: "flex", alignItems: "center", height: "50px", marginLeft: "20px" }}>
                            {orderWorkBgngMm} - {flagOrder}차수 근무시간 : {realWorkHour + vcatnHour + holiHour} / {workHour + holiHour} hrs.
                        </div>
                    </div>
                    {
                        vcatnHour != 0
                            ?
                            <div style={{ display: "flex", alignItems: "center", height: "40px", marginLeft: "20px" }}>
                                * 휴가 : {vcatnHour} / {vcatnHour} hrs.
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
                        } : {realWorkHour}​ / {vcatnHour != 0 ? workHour - vcatnHour : workHour} hrs.
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
                                        <SelectBox
                                            dataSource={selectPrjctList}
                                            placeholder="프로젝트를 선택해주세요"
                                            valueExpr="prjctId"
                                            displayExpr="prjctNm"
                                            stylingMode="underlined"
                                            searchEnabled={true}
                                            onValueChange={(e) => {
                                                const selectedItem = selectPrjctList.find(item => item.prjctId === e);

                                                if (selectedItem) {
                                                    refInsertWorkHourValue.prjctId = e
                                                    refInsertWorkHourValue.prjctNm = selectedItem.prjctNm
                                                    refInsertWorkHourValue.aprvrEmpId = selectedItem.prjctMngrEmpId
                                                }
                                            }}
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
                                : selectPrjctIndvdlCtMmValue != undefined && selectPrjctIndvdlCtMmValue.mmAtrzCmptnYn == "another"
                                    ?
                                    <div style={{ marginTop: "10px", border: "2px solid #CCCCCC", height: "200px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                        <h4>해당차수가 아닙니다.</h4>
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