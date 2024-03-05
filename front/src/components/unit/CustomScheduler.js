// npm install @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction @fullcalendar/react
import React, {useEffect} from "react";
import { Scheduler } from 'devextreme-react/scheduler';
import {loadMessages, locale} from "devextreme/localization";
import koMessages from "../../utils/ko.json";
 
const initScheduler = ({values}) => {
 
    loadMessages(koMessages);
    locale('ko');
 
    return(
        <>
        <div style={{display:'grid'}}>
            <Scheduler id="scheduler"
                dataSource={values}
                startDayHour={8}
                endDayHour={22}
                defaultCurrentView="week"
                maxAppointmentsPerCell={3}
                locale="ko"
            />
        </div>
        </>    
    );
}
 
export default initScheduler;