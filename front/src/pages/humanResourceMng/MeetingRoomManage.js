import React, {useState, useEffect} from 'react';
// import Calendar from "../../components/unit/Calendar"
import CustomScheduler from "../../components/unit/CustomScheduler"
import ApiRequest from "../../utils/ApiRequest";
import EmpMonthVacInfoJson from "../humanResourceMng/MeetingRoomManage.json"
import { Change } from 'devextreme-react/cjs/data-grid';

const MeetingRoomManage = () => {
    const [mtgRoomRvstParam, setMtgRoomRvstParam] = useState([]);
    const [mtgRoomRvstValues, setMtgRoomRvstValues] = useState([]);
   
    const [codeParam, setCodeParam] = useState([]);
    const [codeValues, setCodeValues] = useState([]);
 
    // 화면 최초로드 시 조회 param 설정
    useEffect(() => {
        // 회의정보 조회조건설정
        setMtgRoomRvstParam({
            searchType : "data",
            queryId: EmpMonthVacInfoJson.MtgRoomRsvt[0].queryId
        });

        // 회의실코드 조회조건설정
        setCodeParam({
            searchType : "code",
            queryId: EmpMonthVacInfoJson.MeetingRoomList[0].queryId,
            upCdValue : "VTW042",
            ctmmnyNm : "search"
        });
    },[]);
 
    // 회의정보조회
    useEffect(() => {
        if(!Object.values(mtgRoomRvstParam).every((value) => value === "")) {
            pageHandle(mtgRoomRvstParam);
        };
    }, [mtgRoomRvstParam]);
    
    // 회의실코드조회
    useEffect(() => {
        if(!Object.values(codeParam).every((value) => value === "")) {
            pageHandle(codeParam);
        };
    }, [codeParam]);
 
    // 조회
    const pageHandle = async (initParam) => {
        try {
            if(initParam.searchType == "data") setMtgRoomRvstValues(await ApiRequest("/boot/common/queryIdSearch", initParam));
            else if(initParam.searchType == "code") setCodeValues(await ApiRequest("/boot/common/queryIdSearch", initParam));
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="" style={{marginLeft:"5%", marginRight:"5%"}}>
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
                {/* <Calendar 
                    values={mtgRoomRvstValues}
                    headerToolbar={{
                        left: 'prev,next',
                        center: 'title',
                        right: 'timeGridDay,timeGridWeek,listWeek'
                    }}
                    initialView="timeGridWeek"
                    initCssValue="listStyle"
                    clickEventValue="true"
                /> */}
                <CustomScheduler
                    listValues={mtgRoomRvstValues}
                    codeValues={codeValues}
                />
            </div>
    </div>
    );
}
 
export default MeetingRoomManage;