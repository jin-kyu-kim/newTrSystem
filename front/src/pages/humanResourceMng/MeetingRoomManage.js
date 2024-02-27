import React, {useState} from 'react';
import CustomScheduler from "../../../components/unit/CustomScheduler"
import "../../../components/unit/CustomScheduler.css"

// const {queryId} = EmpMonthVacInfoJson;

const MeetingRoomManage = () => {
      
    return (
        <div className="container">
            <div className="mx-auto" style={{ marginTop: "20px", marginBottom: "10px" }}>
                <h1 style={{ fontSize: "30px" }}>회의실예약(관리자)</h1>
            </div>
            <div className="mx-auto" style={{ marginBottom: "10px" }}>
                <span>* 회의실 예약 내역 조회, 예약 및 예약수정이 가능합니다.</span>
            </div>
            <div className="mx-auto" style={{ marginBottom: "10px" }}>
                <span>* 소회의실 - 4인실  | 중회의실 - 10인실  | 대회의실 - 16인실</span>
            </div>
            <div className="mx-auto" style={{ marginBottom: "20px" }}>
                <CustomScheduler 
                    values=""
                    headerToolbar={{
                        left: 'prev,next',
                        center: 'title',
                        right: 'timeGridDay,timeGridWeek,listWeek'
                    }}
                    initialView="timeGridWeek"
                    />
            </div>
    </div>
    );
}

export default MeetingRoomManage;