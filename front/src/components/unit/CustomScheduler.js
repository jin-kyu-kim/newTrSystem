// npm install @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction @fullcalendar/react
import React from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from '@fullcalendar/list';    // npm install @fullcalendar/list
import style from "./CustomScheduler.css"

const CustomScheduler = ({values, headerToolbar, initialView, initCssBoolean, initCssMenu /*initCssUrl*/}) => {
    return(
        <>
        <div style={{display:'grid'}}>
            <div className={style}>
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
            />
            </div>
        </div>
        </>     
    );
}

export default CustomScheduler;