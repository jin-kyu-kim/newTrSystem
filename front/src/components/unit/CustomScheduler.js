// npm install @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction @fullcalendar/react
import React, { useState, useEffect } from "react";
import { Scheduler } from 'devextreme-react/scheduler';
import { loadMessages, locale } from "devextreme/localization";
import ApiRequest from "../../utils/ApiRequest";
import koMessages from "../../utils/ko.json";
import "../unit/CustomScheduler.css"
import Moment from "moment"


/*
    mtgRoomList : 회의실예약정보
    mtgRoomRsvtAtdrnList : 회의실참석자정보
    mtgCodeList : 회의실코드정보
    empList : 직원목록
 */
const InitScheduler = ({ mtgRoomList, mtgRoomRsvtAtdrnList, mtgCodeList, empList, onOptionChanged }) => {

    // 선택한 회의실 상세정보
    const [selectValue, setSelectValue] = useState([]);

    // 선택한 회의실참석자 상세정보
    const test = [{empId: "EMP_0001", listEmpFlnm:"TEST"}, {empId: "EMP_0002", listEmpFlnm:"TEST2"}];

    // 팝업에 전달할 데이터 셋팅
    function onAppointmentClick(e) {
        const clickValue = e.appointmentData;

        setSelectValue({
            empId: clickValue.empId,
            empno: clickValue.empno,
            endDate: clickValue.endDate,
            mtgRoomCd: clickValue.mtgRoomCd,
            mtgRoomNm: clickValue.mtgRoomNm,
            mtgRoomRsvtSn: clickValue.mtgRoomRsvtSn,
            mtgTtl: clickValue.mtgTtl,
            rsvtEmpFlnm: clickValue.rsvtEmpFlnm,
            rsvtEmpId: clickValue.rsvtEmpId,
            startDate: clickValue.startDate,
            useBgngHm: clickValue.useBgngHm,
            useEndHm: clickValue.useEndHm,
            useYmd: clickValue.useYmd
        })
    }

    

    // 이벤트 선택 시 팝업호출 전 팝업 컴포넌트 설정
    function onAppointmentFormOpening(e) {
        e.form.itemOption('mainGroup', 'items', createForm(e));
    }

    // 팝업에서 데이터 변경 후처리
    // 해당이벤트에 update 구문 처리해야함
    function onAppointmentUpdated(e) {
        console.log(e.appointmentData);
    }

    // 예약취소버튼
    function cancleButtonClick(e) {
        const isconfirm = window.confirm("예약을 취소하시겠습니까?");
        if (isconfirm) {
            // deleteMeet();
        } else {
            return;
        }
    }

    // customForm 설정
    function createForm(e) {
    let customGroupItems = [];
    let atndEmpList = [];

    for(let index in mtgRoomRsvtAtdrnList){
        if(mtgRoomRsvtAtdrnList[index].mtgRoomRsvtSn == selectValue.mtgRoomRsvtSn){
            atndEmpList.push({
                empId: mtgRoomRsvtAtdrnList[index].empId,
                listEmpFlnm: mtgRoomRsvtAtdrnList[index].listEmpFlnm,
            })
        }
    }

    // 회의실 영역 추가
    if (!customGroupItems.find(function (i) { return i.dataField === "mtgRoomCd" })) {
        customGroupItems.push({
            colSpan: 2,
            label: { text: "회의실" },
            editorType: "dxSelectBox",
            dataField: "mtgRoomCd",
            editorOptions: {
                dataSource: mtgCodeList,
                displayExpr: "cdNm",
                valueExpr: "cdValue",
                value: selectValue.mtgRoomCd
            }
        });
    }

    // 예약자 영역 추가
    if (!customGroupItems.find(function (i) { return i.dataField === "rsvtEmpFlnm" })) {
        customGroupItems.push({
            colSpan: 2,
            label: { text: "예약자" },
            editorType: "dxSelectBox",
            dataField: "rsvtEmpFlnm",
            editorOptions: {
                dataSource: empList,
                displayExpr: "listEmpFlnm",
                valueExpr: "empId",
                searchEnabled: "true",
                value: selectValue.rsvtEmpId
            }
        });
    }

    // 회의시작시간 영역 추가
    if (!customGroupItems.find(function (i) { return i.dataField === "startDate" })) {
        customGroupItems.push({
            colSpan: 2,
            label: { text: "시작시간" },
            editorType: "dxDateBox",
            dataField: "startDate",
            editorOptions: {
                type: "datetime",
                value: selectValue.startDate
            }
        });
    }

    // 회의종료시간 영역 추가
    if (!customGroupItems.find(function (i) { return i.dataField === "endDate" })) {
        customGroupItems.push({
            colSpan: 2,
            label: { text: "종료시간" },
            editorType: "dxDateBox",
            dataField: "endDate",
            editorOptions: {
                type: "datetime",
                value: selectValue.endDate
            }
        });
    }

    // 회의내용 영역 추가
    if (!customGroupItems.find(function (i) { return i.dataField === "MtgTtl" })) {
        customGroupItems.push({
            colSpan: 2,
            label: { text: "회의내용" },
            editorType: "dxTextArea",
            dataField: "MtgTtl",
            editorOptions: {
                value: selectValue.mtgTtl
            }
        });
    }

    // 회의참석자 영역 추가
    if (!customGroupItems.find(function (i) { return i.dataField === "atndEmp" })) {
        customGroupItems.push({
            colSpan: 2,
            label: { text: "회의참석자" },
            editorType: "dxTagBox",
            dataField: "atndEmp",
            editorOptions: {
                dataSource: empList,
                displayExpr: "listEmpFlnm",
                valueExpr: "empId",
                searchEnabled: "true",
                value: atndEmpList,
                onValueChange(args) {
                        
                },
            },
            
        });
    }

    if (!customGroupItems.find(function (i) { return i.dataField === "cancle" })) {
        customGroupItems.push({
            colSpan: 2,
            editorType: "dxButton",
            editorOptions: {
                text: "예약취소",
                // 해당이벤트에서 예약취소 로직 선언
                // onClick : cancleButtonClick({

                // }),
            }
        });
    }

    return customGroupItems;
}

    return (
        <>
            <div style={{ display: 'grid' }}>
                <Scheduler id="scheduler"
                    locale="ko"
                    dataSource={mtgRoomList}
                    startDayHour={8}
                    endDayHour={22}
                    textExpr="mtgTtl"
                    startDateExpr="startDate"
                    endDateExpr="endDate"
                    defaultCurrentView="week"
                    maxAppointmentsPerCell={3}
                    onAppointmentUpdated={onAppointmentUpdated}
                    onAppointmentFormOpening={onAppointmentFormOpening}
                    onAppointmentClick={onAppointmentClick}
                    onOptionChanged={(e) => {
                        if (e.name == "currentDate") {
                            onOptionChanged(Moment(e.value).format('YYYYMMDD'));
                        }
                    }}
                />
            </div>
        </>
    );
}

export default InitScheduler;




// 추가가능 editorType
// dxAutocomplete, dxCalendar, dxCheckBox, dxColorBox, dxDateBox, dxDateRangeBox, 
// dxDropDownBox, dxHtmlEditor, dxLookup, dxNumberBox, dxRadioGroup, dxRangeSlider, 
// dxSelectBox, dxSlider, dxSwitch, dxTagBox, dxTextArea, dxTextBox
// 참고 : https://js.devexpress.com/React/Documentation/ApiReference/UI_Components/dxForm/Types/#FormItemComponent