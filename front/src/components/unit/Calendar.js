// npm install @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction @fullcalendar/react
import React from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from '@fullcalendar/list';    // npm install @fullcalendar/list
import "./Calendar.css"

/*
    values : 화면에 표현될 json 데이터
    headerToolbar : 헤더에 표현될 버튼 리스트(년도 이동, 월 이동, calendar 유형)
    initialView : 화면 최초 로드 시 보여질 calendar 유형(리스트, 일별, 주별, 월별)
    initCssValue : FullCalendar css 변경 희망 시 해당 컴포넌트를 묶을 <div> 태그의 className
                   해당값 설정 후 css 파일에 원하는 코드 추가필요
    clickEventValue : cellClickEvent 사용여부
*/

function dateClick(info) {
    
}

const Calendar = ({values, headerToolbar, initialView, initCssValue, clickEventValue}) => {
    if(clickEventValue == "true"){
        dateClick=(info)=>{
            alert("회의실정보 수정 팝업 호출")
        }
    } else {
        dateClick=(info)=>{
            
        }
    }

    return(
        <>
        <div style={{display:'grid'}} className={initCssValue}>
            <FullCalendar
                locale="kr"
                timeZone="Asia/Seoul"
                height={"auto"}
                plugins={[dayGridPlugin,timeGridPlugin,interactionPlugin,listPlugin]}
                initialView={initialView}
                headerToolbar={headerToolbar}
                events={values}
                slotMinTime={"08:00"}
                slotMaxTime={"22:00"}
                eventClick={dateClick}
            />
        </div>
        </>     
    );
}

export default Calendar;