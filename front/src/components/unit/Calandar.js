// npm install @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction @fullcalendar/react
import React, { Component } from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from '@fullcalendar/react';
import style from "../unit/Calandar.css"


export default class DashBoard extends Component {
    constructor(props){
        super(props);
    }
    // dateClick=(info)=>{
    //     alert("cell 클릭 시 휴가정보 상세조회")
    // }

    // select=(info)=>{
    //     alert("cell 클릭 시 휴가정보 상세조회")
    // }
    render() {
        return(
            <>
            <div style={{ margin:15, display:'grid'}}>
                <FullCalendar   
                    plugins={[dayGridPlugin,timeGridPlugin,interactionPlugin]}
                    initialView={'dayGridMonth'}
                    headerToolbar={
                        {
                            start: '', 
                            center: 'title',
                            end: 'prev,next' 
                        }
                    }
                    height={"85vh"}
                    //dateClick={this.dateClick}
                    events={[
                        {title:'OOO 연차', date:'2024-02-22',},
                        {title:'OOO 공가',date:'2024-02-22',}
                    ]}
                />
            </div>
            </>     
        );
    }
}