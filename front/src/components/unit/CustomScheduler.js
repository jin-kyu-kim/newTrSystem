// npm install @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction @fullcalendar/react
import React, {useState, useEffect} from "react";
import { Scheduler } from 'devextreme-react/scheduler';
import {loadMessages, locale} from "devextreme/localization";
import Box, {Item} from "devextreme-react/box"
import koMessages from "../../utils/ko.json";
import "../unit/CustomScheduler.css"

const InitScheduler = ({values}) => {
    // DevExtrme 한글화설정
    loadMessages(koMessages);
    locale('ko');

    // 팝업에서 데이터 변경 후처리
    // 해당이벤트에 update 구문 처리해야함
    function onAppointmentUpdated(e){
        console.log(e);
        console.log(e.appointmentData);
    }

    // 이벤트 선택 시 팝업호출 전 팝업 컴포넌트 설정
    function onAppointmentFormOpening(e) {
        const form = e.form;
        let mainGroupItems = form.itemOption('mainGroup').items;

        console.log("mainGroupItems : ", mainGroupItems);

        // 상단 라벨변경
        mainGroupItems[0].label.text = "회의실"
        mainGroupItems[2].itemType = "empty"
        mainGroupItems[4].label.text = "회의내용"
        
        // 추가가능 editorType
        // dxAutocomplete, dxCalendar, dxCheckBox, dxColorBox, dxDateBox, dxDateRangeBox, 
        // dxDropDownBox, dxHtmlEditor, dxLookup, dxNumberBox, dxRadioGroup, dxRangeSlider, 
        // dxSelectBox, dxSlider, dxSwitch, dxTagBox, dxTextArea, dxTextBox
        // 참고 : https://js.devexpress.com/React/Documentation/ApiReference/UI_Components/dxForm/Types/#FormItemComponent

        // 예약자 영역 추가
        mainGroupItems.push({
            colSpan: 2, 
            label: { text: "예약자" },
            editorType: "dxTextBox",
        });

        // 회의참석자 영역 추가
        // mainGroupItems.push({
        //     colSpan: 2, 
        //     label: { text: "회의참석자1" },
        //     editorType: "dxSelectBox",
        //     editorOptions : {
        //                         placeholder : "인원을 선택하세요",
        //                         showClearButton : "true"
        //                     }
        // });

        mainGroupItems.push({
            colSpan: 2, 
            label: { text: "회의참석자1" },
            editorType: "dxTagBox",
            editorOptions : {
                            }
        });

        form.itemOption('mainGroup', 'items', mainGroupItems);
    }

    return(
        <>
        <div style={{display:'grid'}}>
            <Scheduler id="scheduler"
                locale="ko"
                dataSource={values}
                startDayHour={8}
                endDayHour={22}
                defaultCurrentView="week"
                maxAppointmentsPerCell={3}
                onAppointmentUpdated={onAppointmentUpdated}
                onAppointmentFormOpening={onAppointmentFormOpening}
            />
        </div>
        </>     
    );
}

export default InitScheduler;