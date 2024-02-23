// npm install @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction @fullcalendar/react
import React, { Component } from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from '@fullcalendar/react';
import style from "../unit/Calendar.css"

const Calandar = ({values}) => {
    const replaveValues = [];
    
    for(let i = 0; i < values.length; i++){
        console.log("values[i] : ", values[i]);
        replaveValues.push(values[i]);

        if(values[i].vcatnDeCnt > 1){
            // replaveValues.push(values[i].empFlnm);
            // replaveValues.push(values[i].cdNm);
            // replaveValues.push(values[i].bgngDay);
            // replaveValues.push(values[i].endDay);
            // replaveValues.push(values[i].vcatnMonth);
            // replaveValues.push(values[i].vcatnDeCnt);
            // replaveValues.push(values[i].elctrnAtrzId);
            // console.log("1일이상");
        }
    }

    return(
        <>
        <div style={{display:'grid'}}>
            <FullCalendar
                locale="kr"
                timeZone="Asia/Seoul"
                plugins={[dayGridPlugin,timeGridPlugin,interactionPlugin]}
                initialView={'dayGridMonth'}
                headerToolbar={
                    {
                        left: 'prevYear,nextYear',
                        center: 'title',
                        right: 'prev,next',
                    }
                }
                height={"auto"}
                //dateClick={this.dateClick}
                events={values}
                // events={[
                //     {title:'OOO 연차', date:'2024-02-22'},
                //     {title:'OOO 공가', date:'2024-02-22'}
                // ]}
            />
        </div>
        </>     
    );
}

export default Calandar;