import { useState, useEffect, useRef, useCallback } from 'react';

import { Scheduler } from 'devextreme-react';
import { Resource, View } from 'devextreme-react/scheduler';

// 날짜관련
// npm install moment
import Moment from "moment"

import ApiRequest from "utils/ApiRequest";

import MeetingRoomManagePopup from "pages/humanResourceMng/MeetingRoomManagePopup";
import "pages/humanResourceMng/MeetingRoomManage.css"



const MeetingRoomManage = () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const userAuth = JSON.parse(localStorage.getItem("userAuth"));





    // 회의실종류코드조회
    const [selectMtgRoomCodeList, setSelectMtgRoomCodeList] = useState();

    // 회의실종류코드조회
    useEffect(() => {
        getMtgRoomCode();
    }, [])

    // 회의실종류코드조회
    const getMtgRoomCode = async () => {
        setSelectMtgRoomCodeList(await ApiRequest('/boot/common/commonSelect', [{ tbNm: "CD" }, { upCdValue: "VTW042" }]));
    }





    // 회의실예약정보조회
    const [selectMtgRoomValue, setSelectMtgRoomValue] = useState();
    const [searchMtgRoomParam, setSearchMtgRoomParam] = useState({
        queryId: "humanResourceMngMapper.retrieveMtgRoomInfoInq",
        changeDate: Moment(new Date()).format('YYYYMMDD'),
        searchBoolean: true
    });

    // 회의실예약정보조회
    useEffect(() => {
        selectMtgRoom(searchMtgRoomParam);
    }, [searchMtgRoomParam]);

    // 회의실예약정보조회
    const selectMtgRoom = async (initParam) => {
        try {
            if(initParam.searchBoolean == true) setSelectMtgRoomValue(await ApiRequest("/boot/common/queryIdSearch", initParam));
        } catch (error) {
            console.log("selectMtgRoom_error : ", error);
        }
    };





    // 권한정보
    const [authValue, setAuthValue] = useState();


    // 팝업 visible처리정보
    const [popupMeetingRoomValue, setPopupMeetingRoomValue] = useState({ visible: false, state: "" });





    // 팝업전달 회의실정보
    const popupMtgRoomRsvt = useRef(null);

    // 팝업전달 회의참석자정보
    const popupMtgRoomRsvtAtdrn = useRef(null);





    // 날짜변경이벤트
    function onOptionChanged(e) {
        // 날짜변경시 회의실예약정보 재조회
        setSearchMtgRoomParam({
            ...searchMtgRoomParam,
            changeDate: e,              // 변경된날짜
            searchBoolean: true,        // 재조회여부
        })
    }




    // 신규회의실정보
    function onCellClick(e) {
        // 선택한 셀의 시작일자, 종료일자, 회의실종류 설정
        popupMtgRoomRsvt.current = ([{
            mtgRoomCd: e.cellData.groups.mtgRoomCd,
            rsvtEmpId: userInfo.empId,
            useYmd: Moment(e.cellData.startDate).format("YYYYMMDD"),
            useEndYmd: Moment(e.cellData.startDate).format("YYYYMMDD"),
            useBgngHm: Moment(e.cellData.startDate).format("HHmm"),
            useEndHm: Moment(e.cellData.endDate).format("HHmm"),
            startDate: e.cellData.startDate,
            endDate: e.cellData.endDate,
        }]);
        popupMtgRoomRsvtAtdrn.current = "";
        setPopupMeetingRoomValue({ visible: true, state: "insert" })
        setAuthValue("new")
        e.cancel = true;
    }




    // 기존회의실정보조회
    function onAppointmentFormOpening(e) {
        popupMtgRoomRsvt.current = selectMtgRoomValue.filter(item => item.mtgRoomRsvtSn == e.appointmentData.mtgRoomRsvtSn);
        selectMtgRoomRsvtAtdrn(e.appointmentData.mtgRoomRsvtSn);

        if(userAuth.find((item) => item == "VTW04805")) setAuthValue("all")
        else if(!userAuth.find((item) => item == "VTW04805") && e.appointmentData.rsvtEmpId == userInfo.empId) setAuthValue("self")
        else setAuthValue("none")

        e.cancel = true;
    }

    // 기존회의실정보조회
    const selectMtgRoomRsvtAtdrn = async (param) => {
        popupMtgRoomRsvtAtdrn.current = await ApiRequest("/boot/common/queryIdSearch", { queryId: "humanResourceMngMapper.retrieveMtgAtdrnInq", mtgRoomRsvtSn: param });
        setPopupMeetingRoomValue({ visible: true, state: "update" })
    }

    // 더블클릭이벤트 차단
    function onAppointmentDblClick(e) {
        e.cancel = true;
    }

    // grouping 설정
    const groupData = [
        {
            text: '중회의실',
            id: "VTW04201",
            color: '#1e90ff',
        },
        {
            text: '소회의실',
            id: "VTW04202",
            color: '#ff9747',
        },
        {
            text: '대회의실',
            id: "VTW04203",
            color: '#008000',
        },
        {
            text: 'Zoom',
            id: "VTW04204",
            color: '#aaaaaa',
        },
    ];

    // 상단 navigator formating
    const customizeDateNavigatorText = useCallback((e) => {
        const formatOptions = { 
            year: 'numeric', 
            month: 'numeric', 
            day: 'numeric' 
        };

        const formattedStartDate = e.startDate.toLocaleString('kr', formatOptions);
        const formattedEndDate = e.endDate.toLocaleString('kr', formatOptions);

        return formattedStartDate + ' - ' + formattedEndDate;
    }, []);

    return (
        <div className="" style={{ marginLeft: "1%", marginRight: "1%" }}>
            <div className="mx-auto" style={{ marginTop: "20px", marginBottom: "10px" }}>
                <h1 style={{ fontSize: "30px" }}>회의실예약 {userAuth.find((item) => item == "VTW04805") ? <>(관리자)</> : ""}</h1>
            </div>
            <div className="mx-auto" style={{ marginBottom: "10px" }}>
                <span>* 회의실 예약 내역 조회, 예약 및 예약수정이 가능합니다.</span>
            </div>
            <div className="mx-auto" style={{ marginBottom: "10px" }}>
                <span>* 회의실 예약 시작 시간이 지난경우 예약 수정 및 취소는 불가합니다.</span>
            </div>
            <div className="mx-auto" style={{ display: "flex", alignItems: "center" }}>
            * {"\u00A0"}
                    {selectMtgRoomCodeList ? 
                        selectMtgRoomCodeList.map((item, index) => {
                        if (selectMtgRoomCodeList.length == index + 1) {
                            return (
                                <div key={index}>
                                    {selectMtgRoomCodeList[index].cdNm}
                                </div>
                            )
                        } else {
                            return (
                                <div key={index}>
                                    {selectMtgRoomCodeList[index].cdNm + " | \u00A0"}
                                </div>
                            )
                        }
                    })
                    : <></>
                }
            </div>
            <div className="mx-auto" style={{ marginBottom: "20px", marginTop: "20px" }}>
                <Scheduler id="scheduler"
                    dataSource={selectMtgRoomValue}
                    startDayHour={8}
                    endDayHour={22}
                    textExpr="mtgTtl"
                    startDateExpr="startDate"
                    endDateExpr="endDate"
                    defaultCurrentView="workWeek"
                    groups={["mtgRoomCd"]}
                    groupByDate={true}
                    maxAppointmentsPerCell={3}
                    crossScrollingEnabled={true}
                    allDayPanelMode="hidden"
                    customizeDateNavigatorText={customizeDateNavigatorText}
                    onAppointmentClick={onAppointmentFormOpening}
                    onCellClick={onCellClick}
                    onAppointmentDblClick={onAppointmentDblClick}
                    onOptionChanged={(e) => { if (e.name == "currentDate") onOptionChanged(Moment(e.value).format('YYYYMMDD')) }}
                >
                    <Resource
                        dataSource={groupData}
                        fieldExpr="mtgRoomCd"
                        label="회의실"
                    />
                    <View
                        type="day"
                        name="일별"
                    />
                    <View
                        type="week"
                        name="주별"
                    />
                    <View
                        type="workWeek"
                        name="주별(주말제외)"
                    />
                    <View
                        type="agenda"
                        name="일정"
                    />
                </Scheduler>

                {popupMeetingRoomValue.visible == true
                    ?
                    <MeetingRoomManagePopup
                        width={"900px"}
                        height={"650px"}
                        title={"회의실 예약"}
                        visible={popupMeetingRoomValue.visible}
                        mtgRoomRsvtValue={popupMtgRoomRsvt.current && popupMtgRoomRsvt.current != "" ? popupMtgRoomRsvt.current : selectMtgRoomValue}
                        mtgRoomRsvtAtdrnValue={popupMtgRoomRsvtAtdrn.current}
                        mtgRoomRsvtListValue={selectMtgRoomValue}
                        state={popupMeetingRoomValue.state}
                        authState={authValue}
                        onHiding={(e, state) => {
                            setPopupMeetingRoomValue({ visible: e })
                            setSearchMtgRoomParam({ ...searchMtgRoomParam, searchBoolean: state })
                        }}
                    />
                    :
                    <></>
                }
            </div>
        </div>
    );
}

export default MeetingRoomManage;