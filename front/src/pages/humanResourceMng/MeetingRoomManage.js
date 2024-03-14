import React, { useState, useEffect } from 'react';
// import Calendar from "../../components/unit/Calendar"
import CustomScheduler from "../../components/unit/CustomScheduler"
import ApiRequest from "../../utils/ApiRequest";
import Moment from "moment"

const MeetingRoomManage = () => {
    // 회의실예약정보조회
    const [selectMtgRoomValue, setSelectMtgRoomValue] = useState([]);
    const [searchMtgRoomParam, setSearchMtgRoomParam] = useState({
        searchType: "mtgRoom",
        queryId: "humanResourceMngMapper.retrieveMtgRoomInfoInq",
        changeDate: Moment(new Date()).format('YYYYMMDD')
    });

    // 회의참석자정보조회
    const [selectMtgRoomRsvtAtdrnValue, setSelectMtgRoomRsvtAtdrnValue] = useState([]);
    const [searchMtgRoomRsvtAtdrnParam, setSearchMtgRoomRsvtAtdrnParam] = useState({
        searchType: "mtgRoomRsvtAtdrn",
        queryId: "humanResourceMngMapper.retrieveMtgAtdrnInq",
        changeDate: Moment(new Date()).format('YYYYMMDD')
    });

    // 회의실코드
    const [searchCodeParam, setSearchCodeParam] = useState({ 
        queryId: "humanResourceMngMapper.retrieveCodeList", 
        searchType: "mtgRoomCode", 
        upCdValue: "VTW042" });
    const [selectCodeValue, setSelectCodeValue] = useState([]);

    // 직원목록조회
    const [searchEmpParam, setSearchEmpParam] = useState({ 
        queryId: "humanResourceMngMapper.retrieveEmpList", 
        searchType: "empList" });
    const [selectEmpValue, setSelectEmpValue] = useState([]);


    // 회의실예약정보조회
    useEffect(() => {
        if (!Object.values(searchMtgRoomParam).every((value) => value === "")) {
            pageHandle(searchMtgRoomParam);
        };
    }, [searchMtgRoomParam]);

    // 회의참석자정보조회
    useEffect(() => {
        if (!Object.values(searchMtgRoomRsvtAtdrnParam).every((value) => value === "")) {
            pageHandle(searchMtgRoomRsvtAtdrnParam);
        };
    }, [searchMtgRoomRsvtAtdrnParam]);

    // 회의실코드조회
    useEffect(() => {
        if (!Object.values(searchCodeParam).every((value) => value === "")) {
            pageHandle(searchCodeParam);
        };
    }, [searchCodeParam])

    // 직원목록조회
    useEffect(() => {
        if (!Object.values(searchEmpParam).every((value) => value === "")) {
            pageHandle(searchEmpParam);
        };
    }, [searchEmpParam])

    // 조회
    const pageHandle = async (initParam) => {
        try {
            if (initParam.searchType == "mtgRoom") setSelectMtgRoomValue(await ApiRequest("/boot/common/queryIdSearch", initParam));
            else if (initParam.searchType == "mtgRoomRsvtAtdrn") setSelectMtgRoomRsvtAtdrnValue(await ApiRequest("/boot/common/queryIdSearch", initParam));
            else if (initParam.searchType == "mtgRoomCode") setSelectCodeValue(await ApiRequest("/boot/common/queryIdSearch", initParam));
            else if (initParam.searchType == "empList") setSelectEmpValue(await ApiRequest("/boot/common/queryIdSearch", initParam));
        } catch (error) {
            console.log(error);
        }
    };

    function onOptionChanged(e) {
        setSearchMtgRoomParam({
            ...searchMtgRoomParam,
            changeDate: e,
        })
        setSearchMtgRoomRsvtAtdrnParam({
            ...searchMtgRoomRsvtAtdrnParam,
            changeDate: e,
        })
    }

    return (
        <div className="" style={{ marginLeft: "5%", marginRight: "5%" }}>
            <div className="mx-auto" style={{ marginTop: "20px", marginBottom: "10px" }}>
                <h1 style={{ fontSize: "30px" }}>회의실예약(관리자)</h1>
            </div>
            <div className="mx-auto" style={{ marginBottom: "10px" }}>
                <span>* 회의실 예약 내역 조회, 예약 및 예약수정이 가능합니다.</span>
            </div>
            <div className="mx-auto" style={{ marginBottom: "10px" }}>
                <span>* 소회의실 - 4인실  | 중회의실 - 10인실  | 대회의실 - 16인실</span>
            </div>
            <div className="mx-auto" style={{ marginBottom: "20px", marginTop: "20px" }}>
                <CustomScheduler
                    mtgRoomList={selectMtgRoomValue}
                    mtgRoomRsvtAtdrnList={selectMtgRoomRsvtAtdrnValue}
                    mtgCodeList={selectCodeValue}
                    empList={selectEmpValue}
                    onOptionChanged={onOptionChanged}
                />
            </div>
        </div>
    );
}

export default MeetingRoomManage;