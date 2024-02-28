// npm install @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction @fullcalendar/react
import React from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
// import "./Calendar.css"

const Calandar = ({values, headerToolbar, initialView}) => {
    // (async () => {
    //     if (initCssBoolean) {
    //         if(initCssMenu == "EmpMonthVacInfo"){
    //             import("../../pages/humanResourceMng/emp/EmpMonthVacInfoCalendar.css");
    //         } else if(initCssMenu == "MeetingRoomManage"){
    //             import("../../pages/humanResourceMng/emp/MeetingRoomManageCalendar.css");
    //         }
    //     }
    // })();
    
    return(
        <>
        <div style={{display:'grid'}}>
            <FullCalendar
                locale="kr"
                timeZone="Asia/Seoul"
                height={"auto"}
                plugins={[dayGridPlugin,timeGridPlugin,interactionPlugin]}
                initialView={initialView}
                headerToolbar={headerToolbar}
                events={values}
            />
        </div>
        </>     
    );
}

export default Calandar;