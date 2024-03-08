// npm install @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction @fullcalendar/react
import React, { useState, useEffect } from "react";
import { Scheduler } from 'devextreme-react/scheduler';
import { loadMessages, locale } from "devextreme/localization";
import Box, { Item } from "devextreme-react/box"
import koMessages from "../../utils/ko.json";
import "../unit/CustomScheduler.css"


// popup tagBox 호출 테스트용도
const simpleProducts = [
    'HD Video Player',
    'SuperHD Video Player',
    'SuperPlasma 50',
    'SuperLED 50',
    'SuperLED 42',
    'SuperLCD 55',
    'SuperLCD 42',
    'SuperPlasma 65',
    'SuperLCD 70',
    'Projector Plus',
    'Projector PlusHT',
    'ExcelRemote IR',
    'ExcelRemote Bluetooth',
    'ExcelRemote IP',
];

const products = [
    {
      key : "VK1001",
      data : "회의실1"
    },
    {
        key : "VK1002",
        data : "회의실2"
    },
]

const InitScheduler = ({ listValues, codeValues }) => {
    const [selectValue, setSelectValue] = useState([]);
    
    // DevExtrme 한글화설정
    loadMessages(koMessages);
    locale('ko');

    // customForm 설정
    function createForm(){
        let customGroupItems = [];
    
        // 추가가능 editorType
        // dxAutocomplete, dxCalendar, dxCheckBox, dxColorBox, dxDateBox, dxDateRangeBox, 
        // dxDropDownBox, dxHtmlEditor, dxLookup, dxNumberBox, dxRadioGroup, dxRangeSlider, 
        // dxSelectBox, dxSlider, dxSwitch, dxTagBox, dxTextArea, dxTextBox
        // 참고 : https://js.devexpress.com/React/Documentation/ApiReference/UI_Components/dxForm/Types/#FormItemComponent
    
        // 회의실 영역 추가
        if (!customGroupItems.find(function (i) { return i.dataField === "mgtRoomCd" })) {
            customGroupItems.push({
                colSpan: 2,
                label: { text: "회의실" },
                editorType: "dxSelectBox",
                dataField: "mgtRoomCd",
                editorOptions: {
                    dataSource : codeValues,
                    displayExpr : "childCdNm",
                    valueExpr : "childCdValue"
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
                    // 직원목록 조회하여 셋팅 필요함
                    dataSource: simpleProducts,
                    searchEnabled: "true"
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
                    type : "datetime",
                    value : selectValue.startDate
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
                    type : "datetime",
                    value : selectValue.endDate
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
                    value : selectValue.text
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
                    dataSource: simpleProducts,
                    searchEnabled: "true"
                }
            });
        }
    
        // 예약취소버튼 추가
        // if (!customGroupItems.find(function (i) { return i.dataField === "cancle" })) {
        //     customGroupItems.push({
        //         label: { text: "예약취소" },
        //         editorType: "dxButton",
        //         dataField: "cancle",
        //         editorOptions: {
        //             // 해당이벤트에서 예약취소 로직 선언
        //             onClick : cancleButtonClick
        //         }
        //     });
        // }
    
        return customGroupItems;
    }

    // 팝업에서 데이터 변경 후처리
    // 해당이벤트에 update 구문 처리해야함
    function onAppointmentUpdated(e) {
        console.log(e.appointmentData);
    }

    // 팝업에 전달할 데이터 셋팅
    function onAppointmentClick(e) {
        const clickValue = e.appointmentData;
        
        setSelectValue({
            rsvtEmpId: clickValue.rsvtEmpId,                // 예약직원ID
            empFlnm: clickValue.rsvtEmpFlnm,                // 예약직원명
            startDate: clickValue.startDate,                // 회의시작시간
            endDate: clickValue.endDate,                    // 회의종료시간
            MtgTtl: clickValue.mtgTtl,                      // 회의내용
        })
    }

    // 예약취소버튼
    function cancleButtonClick(e){
        const isconfirm = window.confirm("예약을 취소하시겠습니까?");
        if (isconfirm) {
            // deleteMeet();
        } else {
            return;
        }
    }

    // 이벤트 선택 시 팝업호출 전 팝업 컴포넌트 설정
    function onAppointmentFormOpening(e) {
        e.form.itemOption('mainGroup', 'items', createForm());
    }

    return (
        <>
            <div style={{ display: 'grid' }}>
                <Scheduler id="scheduler"
                    locale="ko"
                    dataSource={listValues}
                    startDayHour={8}
                    endDayHour={22}
                    defaultCurrentView="week"
                    maxAppointmentsPerCell={3}
                    onAppointmentUpdated={onAppointmentUpdated}
                    onAppointmentFormOpening={onAppointmentFormOpening}
                    onAppointmentClick={onAppointmentClick}
                    textExpr="mtgTtl"
                    startDateExpr="startDate"
                    endDateExpr="endDate"
                />
            </div>
        </>
    );
}

export default InitScheduler;
