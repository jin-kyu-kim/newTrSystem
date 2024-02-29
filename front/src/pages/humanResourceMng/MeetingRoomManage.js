import React, {useState, useEffect} from 'react';
import Calendar from "../../components/unit/Calendar"
import ApiRequest from "../../utils/ApiRequest";
import EmpMonthVacInfoJson from "../humanResourceMng/MeetingRoomManage.json"

const MeetingRoomManage = () => {
    const [mtgRoomRvstParam, setMtgRoomRvstParam] = useState([]);
    const [mtgRoomRvstValues, setMtgRoomRvstValues] = useState([]);
    
    const [mtgRoomRvstAtdrnParam, setMtgRoomRvstAtdrnParam] = useState([]);
    const [mtgRoomRvstAtdrnValues, setMtgRoomRvstAtdrnValues] = useState([]);

    const [searchParam, setSearchParam] = useState({empno: ""});

    // 화면 최초로드 시 조회 param 설정
    useEffect(() => {
        setMtgRoomRvstParam({
            queryId: EmpMonthVacInfoJson.MtgRoomRsvt[0].queryId
        });
        setMtgRoomRvstAtdrnParam({
            queryId: EmpMonthVacInfoJson.MtgRoomRsvtAtdrn[0].queryId
        });
    },[]);

    // 조회
    useEffect(() => {
        if(!Object.values(mtgRoomRvstParam).every((value) => value === "")) {
            pageHandle(mtgRoomRvstParam);
        };
    }, [mtgRoomRvstParam]);

    // 조회
    const pageHandle = async (initParam) => {
        try {
            const response = await ApiRequest("/boot/common/queryIdSearch", initParam);
            setMtgRoomRvstValues(response);
        } catch (error) {
            console.log(error);
        }
    };
      
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
            <div className="mx-auto" style={{ marginBottom: "20px", marginTop: "20px"}}>
                <Calendar 
                    values={mtgRoomRvstValues}
                    headerToolbar={{
                        left: 'prev,next',
                        center: 'title',
                        right: 'timeGridDay,timeGridWeek,listWeek'
                    }}
                    initialView="timeGridWeek"
                    initCssValue="listStyle"
                    clickEventValue="true"
                    />
            </div>
    </div>
    );
}

export default MeetingRoomManage;