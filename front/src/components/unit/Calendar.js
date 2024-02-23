// npm install @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction @fullcalendar/react
import React, { Component } from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from '@fullcalendar/react';
import style from "../unit/Calendar.css"

const Calandar = ({values}) => {
    const replaceData = [
        { "key": "empFlnm", "value": "성명" },
        { "key": "cdNm", "value": "휴가코드명" },
        { "key": "bgngDay", "value": "휴가시작일자" },
        { "key": "endDay", "value": "휴가종료일자" },
        { "key": "vcatnMonth", "value": "휴가월" },
        { "key": "vcatnDeCnt", "value": "휴가일자" },
        { "key": "elctrnAtrzId", "value": "전자결재ID" }
    ]

    for (let i = 0; i < values.length; i++){
        if(values[i].vcatnDeCnt > 1){
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