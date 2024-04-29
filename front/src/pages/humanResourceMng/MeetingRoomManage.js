import { useState, useEffect, useRef } from 'react';
import { useCookies } from "react-cookie";

import { Scheduler } from 'devextreme-react';
import { Resource, View } from 'devextreme-react/scheduler';

// 날짜관련
// npm install moment
import Moment from "moment"

import ApiRequest from "utils/ApiRequest";

import "pages/humanResourceMng/MeetingRoomManage.css"
import MeetingRoomManagePopup from "pages/humanResourceMng/MeetingRoomManagePopup";



const MeetingRoomManage = () => {
    // 세션설정
    const [cookies, setCookie] = useCookies(["userInfo", "deptInfo"]);

    

    // 회의실종류코드조회
    const [selectMtgRoomCodeList, setSelectMtgRoomCodeList] = useState();

    useEffect(() => {
        getMtgRoomCode();
    }, [])

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





    // 팝업 visible처리정보
    const [popupMeetingRoomValue, setPopupMeetingRoomValue] = useState({ visible: false, state: "" });





    // 팝업전달 회의실정보
    const popupMtgRoomRsvt = useRef(null);

    // 팝업전달 회의참석자정보
    const popupMtgRoomRsvtAtdrn = useRef(null);

    // 팝업 visible처리정보
    const popupVisible = useRef();
    popupVisible.current = false;








    // 날짜변경이벤트
    function onOptionChanged(e) {
        setSearchMtgRoomParam({
            ...searchMtgRoomParam,
            changeDate: e,
            searchBoolean: true,
        })
    }




    // 신규회의실정보
    function onCellClick(e) {
        popupMtgRoomRsvt.current = "";
        popupMtgRoomRsvtAtdrn.current = "";
        setPopupMeetingRoomValue({ visible: true, state: "insert" })
        e.cancel = true;
    }




    // 기존회의실정보조회
    function onAppointmentFormOpening(e) {
        popupVisible.current = true;
        popupMtgRoomRsvt.current = selectMtgRoomValue.filter(item => item.mtgRoomRsvtSn == e.appointmentData.mtgRoomRsvtSn);
        selectMtgRoomRsvtAtdrn(e.appointmentData.mtgRoomRsvtSn);
        e.cancel = true;
    }

    // 기존회의실정보조회
    const selectMtgRoomRsvtAtdrn = async (param) => {
        popupMtgRoomRsvtAtdrn.current = await ApiRequest("/boot/common/queryIdSearch", { queryId: "humanResourceMngMapper.retrieveMtgAtdrnInq", mtgRoomRsvtSn: param });
        setPopupMeetingRoomValue({ visible: true, state: "update" })
        popupVisible.current = true;
    }


    function onAppointmentDblClick(e) {
        e.cancel = true;
    }


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

    return (
        <div className="" style={{ marginLeft: "2%", marginRight: "2%" }}>
            <div className="mx-auto" style={{ marginTop: "20px", marginBottom: "10px" }}>
                <h1 style={{ fontSize: "30px" }}>회의실예약(관리자)</h1>
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
            <div>
                {popupVisible.current ? popupVisible.current : popupVisible.current}
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
                    onAppointmentClick={onAppointmentFormOpening}
                    onCellClick={onCellClick}
                    onAppointmentDblClick={onAppointmentDblClick}
                    onOptionChanged={(e) => {
                        if (e.name == "currentDate") {
                            onOptionChanged(Moment(e.value).format('YYYYMMDD'));
                        }
                    }}
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
                        // visible={popupVisible.current ? popupVisible.current : false}
                        visible={popupMeetingRoomValue.visible}
                        mtgRoomRsvtValue={popupMtgRoomRsvt.current && popupMtgRoomRsvt.current != "" ? popupMtgRoomRsvt.current : selectMtgRoomValue}
                        mtgRoomRsvtAtdrnValue={popupMtgRoomRsvtAtdrn.current}
                        state={popupMeetingRoomValue.state}
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