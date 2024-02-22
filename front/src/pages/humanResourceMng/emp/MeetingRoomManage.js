import React from 'react';
import Scheduler from 'devextreme-react/scheduler';
import { data, } from './MeetingRoomManageData.js';

const currentDate = new Date(2021, 3, 29);
const views = ['day', 'week', 'workWeek', 'month'];

const App = () => (
    <div className="container">
        <div className="col-md-14 mx-auto" style={{ marginTop: "20px", marginBottom: "10px" }}>
            <h1 style={{ fontSize: "30px" }}>회의실예약(관리자)</h1>
        </div>
        <div className="col-md-14 mx-auto" style={{ marginBottom: "10px" }}>
            <span>* 회의실 예약 내역 조회, 예약 및 예약수정이 가능합니다.</span>
        </div>
        <div className="col-md-14 mx-auto" style={{ marginBottom: "10px" }}>
            <span>* 소회의실 - 4인실  | 중회의실 - 10인실  | 대회의실 - 16인실</span>
        </div>
        <div className="col-md-14 mx-auto" style={{ marginBottom: "20px" }}>
        <Scheduler
            timeZone="Asia/Seoul"
            dataSource={data}
            views={views}
            defaultCurrentView="week"
            defaultCurrentDate={currentDate}
            height={730}
            startDayHour={9}
        />
        </div>
  </div>
);
export default App;