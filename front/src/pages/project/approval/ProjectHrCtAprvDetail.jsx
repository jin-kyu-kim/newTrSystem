import React, {useCallback, useEffect, useLayoutEffect, useRef, useState,} from "react";
import  { useLocation } from "react-router-dom";
import SearchPrjctCostSet from "../../../components/composite/SearchPrjctCostSet";
import ProjectHrCtAprvDetailJson from "./ProjectHrCtAprvDetailJson.json";
import ApiRequest from "../../../utils/ApiRequest";
import CustomTable from "../../../components/unit/CustomTable";
import Popup from "devextreme-react/popup";
import ProjectHrCtAprvCtPop from "./ProjectHtCtAprvCtPop";
import ProjectHrCtAprvMmPop from "./ProjectHtCtAprvMmPop";
import TextArea from "devextreme-react/text-area";
import Button from "devextreme-react/button";

const ProjectHrCtAprvDetail = () => {

    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const location = useLocation();
    const prjctId = location.state.prjctId;
    const prjctNm = location.state.prjctNm;
    const bgtMngOdr = location.state.bgtMngOdr;
    const { searchParams, mm, ct, detailMm, detailCt } = ProjectHrCtAprvDetailJson;
    
    const [param, setParam] = useState([]);
    const [data, setData] = useState([]);
    let childData = useRef(null);
    const [mmValues, setMmValues] = useState([]);
    const [ctValues, setCtValues] = useState([]);
    const [ctPopupVisible, setCtPopupVisible] = useState(false);
    const [mmPopupVisible, setMmPopupVisible] = useState(false);
    const [mmRjctPopupVisible, setMmRjctPopupVisible] = useState(false);
    const [ctRjctPopupVisible, setCtRjctPopupVisible] = useState(false);
    const [ctDetailValues, setCtDetailValues] = useState([]);
    const [mmDetailValues, setMmDetailValues] = useState([]);
    let opnnCn = useRef("");
    const [currentDate, setCurrentDate] = useState(new Date());
    const [holiday, setHoliday] = useState([]);

    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    let firstDayOfMonth = new Date( date.getFullYear(), date.getMonth() , 1 );
    let lastMonth = new Date(firstDayOfMonth.setDate( firstDayOfMonth.getDate() - 1 )); // 전월 말일
    const day = date.getDate();

    let odrVal = day > 15 ? "2" : "1";
    let monthVal = month < 10 ? "0" + month : month;
    let lastMonthVal = (lastMonth.getMonth() + 1) < 10 ? "0" + (lastMonth.getMonth() + 1) : lastMonth.getMonth() + 1;
    let dayVal = day < 10 ? "0" + day : day;
    let aplyYm = year + monthVal;

    useEffect(() => {
        setParam({
            ...param,
            queryId: ProjectHrCtAprvDetailJson.mm.queryId,
            prjctId: prjctId,
            aplyYm: day > 15 ? aplyYm : lastMonth.getFullYear()+lastMonthVal,
            aplyOdr: day > 15 ? "1" : "2",
            bgtMngOdr: bgtMngOdr
        })
        isHoliday();
    }, []);

    // 팝업 캘린더 휴일 가져오기
    const isHoliday = async () => {
        const response = await ApiRequest('/boot/common/commonSelect', [
            {tbNm: "CRTR_DATE"}, {hldyClCd: "VTW05003"}
        ]);
        setHoliday(response);
    }

    // 조회 호출
    useEffect(() => {
        if(!Object.values(param).every((value) => value === "")) {
            handleMmAply();
            handleCtAply();
            getCtChildList(ctChild.current);
        }
    }, [param])

    useEffect(() => {
        if(data.aplyYm != null){
            setCurrentDate(data.aplyYm.slice(0,4)+"/"+data.aplyYm.slice(4,6)+"/01");
        }
    }, [data]);

    // 경비 조회
    const handleCtAply = async () => {
        const ctParam = {
            ...param,
            queryId: ProjectHrCtAprvDetailJson.ct.queryId,
        }
        const response = await ApiRequest("/boot/common/queryIdSearch", ctParam);
        setCtValues(response);
    }

    // 인력 조회
    const handleMmAply = async () => {
        const response = await ApiRequest("/boot/common/queryIdSearch", param);
        setMmValues(response);
    }

    const searchHandle = async (initParam) => {
        if(initParam.yearItem == null || initParam.monthItem == null) {
            setParam({
                ...param,
                queryId: ProjectHrCtAprvDetailJson.mm.queryId,
                prjctId: prjctId,
                aplyYm: aplyYm,
                aplyOdr: odrVal,
                empId: initParam.empId,
                bgtMngOdr: bgtMngOdr
            })
            return;
        };

        setParam({
            ...param,
            queryId: ProjectHrCtAprvDetailJson.mm.queryId,
            prjctId: prjctId,
            aplyYm: initParam.yearItem + initParam.monthItem,
            aplyOdr: initParam.aplyOdr,
            empId: initParam.empId,
            bgtMngOdr: bgtMngOdr
        })
    }

    // 인력 데이터그리드의 승인, 승인취소, 반려, 반려취소 버튼 누를 시
    const onMmBtnClick = async (button, data) => {
        if(button.name === "aprvList"){
            setData(data);
            await retrieveProjectMmAplyDetail(data);
            setMmPopupVisible(true);
        }else if(button.name === "aprv"){
            const param = [
                { tbNm: "PRJCT_MM_ATRZ" },
                { atrzDmndSttsCd: "VTW03703",
                  aprvrEmpId: userInfo.empId,
                  aprvYmd: year + monthVal + dayVal},
                { prjctId: prjctId, empId: data.empId, aplyYm: data.aplyYm, aplyOdr: data.aplyOdr, atrzDmndSttsCd: "VTW03702"}
            ];
            try {
                const confirmResult = window.confirm("승인하시겠습니까?");
                if(confirmResult){
                    const response = await ApiRequest('/boot/common/commonUpdate', param);
                    if(response > 0) {
                        const param = { prjctId: prjctId, empId: data.empId, aplyYm: data.aplyYm, aplyOdr: data.aplyOdr};
                        await ApiRequest('/boot/prjct/updateMmAtrzCmptnYn', param);
                        handleMmAply();
                        getMmChildList(expandedMmKey);
                    }
                }
            } catch (error) {
                console.log(error)
            }
        }else if(button.name === "rjct"){
            setData(data);
            setMmRjctPopupVisible(true);
        }else if(button.name === "aprvCncl"){
            const param = [
                { tbNm: "PRJCT_MM_ATRZ" },
                { atrzDmndSttsCd: "VTW03702",
                  aprvrEmpId: null,
                  aprvYmd: null},
                { prjctId: prjctId, empId: data.empId, aplyYm: data.aplyYm, aplyOdr: data.aplyOdr, atrzDmndSttsCd: "VTW03703"}
            ];
            try {
                const confirmResult = window.confirm("승인 취소하시겠습니까?");
                if(confirmResult){
                    const response = await ApiRequest('/boot/common/commonUpdate', param);
                    if(response > 0) {
                        const param = [
                            { tbNm: "PRJCT_INDVDL_CT_MM" },
                            { mmAtrzCmptnYn: "N"},
                            { prjctId: prjctId, empId: data.empId, aplyYm: data.aplyYm, aplyOdr: data.aplyOdr}
                        ];
                        await ApiRequest('/boot/common/commonUpdate', param);
                        handleMmAply();
                        getMmChildList(expandedMmKey);
                    }
                }
            } catch (error) {
                console.log(error)
            }
        }else if(button.name === "rjctCncl"){
            try {
                const confirmResult = window.confirm("반려 취소하시겠습니까?");
                const param = [
                    { tbNm: "PRJCT_MM_ATRZ" },
                    { atrzDmndSttsCd: "VTW03702",
                      aprvrEmpId: null,
                      rjctPrvonsh: null,
                      rjctYmd: null
                    },
                    { prjctId: prjctId, empId: data.empId, aplyYm: data.aplyYm, aplyOdr: data.aplyOdr, atrzDmndSttsCd: "VTW03704"}
                ];
                if(confirmResult) {
                    const response = await ApiRequest('/boot/common/commonUpdate', param);
                    if (response > 0) {
                        const param = [
                            { tbNm: "PRJCT_INDVDL_CT_MM" },
                            { mmAtrzCmptnYn: "N"},
                            { prjctId: prjctId, empId: data.empId, aplyYm: data.aplyYm, aplyOdr: data.aplyOdr}
                        ];
                        await ApiRequest('/boot/common/commonUpdate', param);
                        handleMmAply();
                        getMmChildList(expandedMmKey);
                    }
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

    // 경비 데이터그리드의 승인, 승인취소, 반려, 반려취소 버튼 누를 시
    const onCtBtnClick = async (button, data) => {
        if(button.name === "ctList"){
            setData(data);
            await retrieveProjectCtAplyDetail(data);
            setCtPopupVisible(true);
        }else if(button.name === "aprv"){
            const param = [
                { tbNm: "PRJCT_CT_ATRZ" },
                { atrzDmndSttsCd: "VTW03703",
                  aprvrEmpId: userInfo.empId,
                  aprvYmd: year + monthVal + dayVal},
                { prjctId: prjctId, empId: data.empId, aplyYm: data.aplyYm, aplyOdr: data.aplyOdr, atrzDmndSttsCd: "VTW03702"}
            ];
            try {
                const confirmResult = window.confirm("승인하시겠습니까?");
                if(confirmResult){
                    const response = await ApiRequest('/boot/common/commonUpdate', param);
                    if(response > 0) {
                        const param = { prjctId: prjctId, empId: data.empId, aplyYm: data.aplyYm, aplyOdr: data.aplyOdr};
                        await ApiRequest('/boot/prjct/updateCtAtrzCmptnYn', param);
                        handleCtAply();
                        getCtChildList(expandedCtKey);
                    }
                }
            } catch (error) {
                console.log(error)
            }
        }else if(button.name === "rjct"){
            setData(data);
            setCtRjctPopupVisible(true);
        }else if(button.name === "aprvCncl"){
            const param = {
                queryId: 'projectMapper.updateCtAply',
                prjctId: prjctId,
                empId: data.empId,
                aplyYm: data.aplyYm,
                aplyOdr: data.aplyOdr,
                state: "UPDATE"
            };
            try {
                const confirmResult = window.confirm("승인 취소하시겠습니까?");
                if(confirmResult){
                    const response = await ApiRequest('/boot/common/queryIdDataControl', param);
                    if(response) {
                        const param = [
                            { tbNm: "PRJCT_INDVDL_CT_MM" },
                            { ctAtrzCmptnYn: "N"},
                            { prjctId: prjctId, empId: data.empId, aplyYm: data.aplyYm, aplyOdr: data.aplyOdr}
                        ];
                        await ApiRequest('/boot/common/commonUpdate', param);
                        handleCtAply();
                        getCtChildList(expandedCtKey);
                    }
                }
            } catch (error) {
                console.log(error)
            }
        }else if(button.name === "rjctCncl"){
            try {
                const confirmResult = window.confirm("반려 취소하시겠습니까?");
                const param = [
                    { tbNm: "PRJCT_CT_ATRZ" },
                    { atrzDmndSttsCd: "VTW03702",
                        aprvrEmpId: null,
                        rjctPrvonsh: null,
                        rjctYmd: null
                    },
                    { prjctId: prjctId, empId: data.empId, aplyYm: data.aplyYm, aplyOdr: data.aplyOdr, atrzDmndSttsCd: "VTW03704"}
                ];
                if(confirmResult) {
                    const response = await ApiRequest('/boot/common/commonUpdate', param);
                    if (response > 0) {
                        const param = [
                            { tbNm: "PRJCT_INDVDL_CT_MM" },
                            { ctAtrzCmptnYn: "N"},
                            { prjctId: prjctId, empId: data.empId, aplyYm: data.aplyYm, aplyOdr: data.aplyOdr}
                        ];
                        await ApiRequest('/boot/common/commonUpdate', param);
                        handleCtAply();
                        getCtChildList(expandedCtKey);
                    }
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

    // 반려사유 작성창 핸들
    const onTextAreaValueChanged = useCallback((e) => {
        opnnCn.current = e.value;
    }, []);

    // 인력 반려사유 작성 후 반려 버튼 클릭
    const onClickMmRjct = async () => {
        try {
            const confirmResult = window.confirm("반려하시겠습니까?");
            let param = null;
            if(childData.current != null){
                param = [
                    { tbNm: "PRJCT_MM_ATRZ" },
                    { atrzDmndSttsCd: "VTW03704",
                      aprvrEmpId: userInfo.empId,
                      rjctPrvonsh: opnnCn.current,
                      rjctYmd: year + monthVal + dayVal
                    },
                    { prjctId: childData.current.prjctId, empId: childData.current.empId, aplyYm: childData.current.aplyYm,
                      aplyOdr: childData.current.aplyOdr, aplyYmd: childData.current.aplyYmd}
                ];
            } else {
                param = [
                    { tbNm: "PRJCT_MM_ATRZ" },
                    { atrzDmndSttsCd: "VTW03704",
                      aprvrEmpId: userInfo.empId,
                      rjctPrvonsh: opnnCn.current,
                      rjctYmd: year + monthVal + dayVal
                    },
                    { prjctId: prjctId, empId: data.empId, aplyYm: data.aplyYm, aplyOdr: data.aplyOdr, atrzDmndSttsCd: "VTW03702"}
                ];
            }

            if(confirmResult) {
                const response = await ApiRequest('/boot/common/commonUpdate', param);
                if (response > 0) {
                    let param = null;
                    if(childData.current != null){
                        param = { prjctId: childData.current.prjctId, empId: childData.current.empId,
                                  aplyYm: childData.current.aplyYm, aplyOdr: childData.current.aplyOdr};
                    } else {
                        param = { prjctId: prjctId, empId: data.empId, aplyYm: data.aplyYm, aplyOdr: data.aplyOdr};
                    }
                    await ApiRequest('/boot/prjct/updateMmAtrzCmptnYn', param);
                    childData.current = null;
                    handleMmAply();
                    getMmChildList(expandedMmKey);
                    setMmRjctPopupVisible(false);
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    // 경비 반려사유 작성 후 반려 버튼 클릭
    const onClickCtRjct = async () => {
        try {
            const confirmResult = window.confirm("반려하시겠습니까?");
            let param = null;
            if(childData.current != null){
                param = [
                    { tbNm: "PRJCT_CT_ATRZ" },
                    { atrzDmndSttsCd: "VTW03704",
                        aprvrEmpId: userInfo.empId,
                        rjctPrvonsh: opnnCn.current,
                        rjctYmd: year + monthVal + dayVal
                    },
                    { prjctId: childData.current.prjctId, empId: childData.current.empId, aplyYm: childData.current.aplyYm,
                        aplyOdr: childData.current.aplyOdr, prjctCtAplySn: childData.current.prjctCtAplySn}
                ];
            } else {
                param = [
                    { tbNm: "PRJCT_CT_ATRZ" },
                    { atrzDmndSttsCd: "VTW03704",
                        aprvrEmpId: userInfo.empId,
                        rjctPrvonsh: opnnCn.current,
                        rjctYmd: year + monthVal + dayVal
                    },
                    { prjctId: prjctId, empId: data.empId, aplyYm: data.aplyYm, aplyOdr: data.aplyOdr, atrzDmndSttsCd: "VTW03702"}
                ];
            }

            if(confirmResult) {
                const response = await ApiRequest('/boot/common/commonUpdate', param);
                if (response > 0) {
                    let param = null;
                    if(childData.current != null){
                        param = { prjctId: childData.current.prjctId, empId: childData.current.empId,
                                  aplyYm: childData.current.aplyYm, aplyOdr: childData.current.aplyOdr};
                    } else {
                        param = { prjctId: prjctId, empId: data.empId, aplyYm: data.aplyYm, aplyOdr: data.aplyOdr};
                    }
                    await ApiRequest('/boot/prjct/updateCtAtrzCmptnYn', param);
                    childData.current = null;
                    handleCtAply();
                    getCtChildList(expandedCtKey);
                    setCtRjctPopupVisible(false);
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    // 인력 팝업 내부 데이터 가져오기
    const retrieveProjectMmAplyDetail = async (data) => {

        const param = {
            queryId: "projectMapper.retrieveProjectMmAplyDetail",
            prjctId: prjctId,
            aplyYm: data.aplyYm,
            aplyOdr: data.aplyOdr,
            empId: data.empId
        }
        const response = await ApiRequest("/boot/common/queryIdSearch", param);
        setMmDetailValues(response);
    }

    // 경비 팝업 내부 데이터 가져오기
    const retrieveProjectCtAplyDetail = async (data) => {

        const param = {
            queryId: "projectMapper.retrieveProjectCtAplyDetail",
            prjctId: prjctId,
            aplyYm: data.aplyYm,
            aplyOdr: data.aplyOdr,
            empId: data.empId
        }
        const response = await ApiRequest("/boot/common/queryIdSearch", param);
        setCtDetailValues(response);
    }

    // 팝업 닫기
    const handleClose = () => {
        setCtPopupVisible(false);
        setMmPopupVisible(false);
        setCtRjctPopupVisible(false);
        setMmRjctPopupVisible(false);
    };

    const [mmChildList, setMmChildList] = useState([]);
    const [expandedMmKey, setExpandedMmKey] = useState(null);
    const mmChild = useRef("");

    useLayoutEffect(() => {
        getMmChildList(mmChild.current);
    }, [mmChild.current]);

    // 인력 세부리스트 데이터 가져오기
    const getMmChildList = async (key) => {
        try {
            const response = await ApiRequest("/boot/common/queryIdSearch",
                { queryId: 'projectMapper.retrieveProjectMmChild',
                    prjctId: param.prjctId,
                    empId: key,
                    aplyYm: param.aplyYm,
                    aplyOdr: param.aplyOdr
                });
            setMmChildList(response);
        } catch (error) {
            console.error(error)
        }
    };

    // 인력 세부리스트 선택 시 로우의 키값 확인
    const expandingMm = (e) => {
        mmChild.current = e.key;
        if (expandedMmKey !== e.key) {
            e.component.collapseRow(expandedMmKey);
            setMmChildList([]);
            setExpandedMmKey(e.key);
        }
    };

    // 인력 세부리스트의 승인, 승인취소, 반려, 반려취소 버튼 누를 시
    const onMmChildBtnClick = async (button, data) => {
        if(button.name === "aprv"){
            const param = [
                { tbNm: "PRJCT_MM_ATRZ" },
                { atrzDmndSttsCd: "VTW03703",
                    aprvrEmpId: userInfo.empId,
                    aprvYmd: year + monthVal + dayVal},
                { prjctId: data.prjctId, empId: data.empId, aplyYm: data.aplyYm, aplyOdr: data.aplyOdr, aplyYmd: data.aplyYmd }
            ];
            try {
                const confirmResult = window.confirm("승인하시겠습니까?");
                if(confirmResult){
                    const response = await ApiRequest('/boot/common/commonUpdate', param);
                    if(response > 0) {
                        const param = { prjctId: data.prjctId, empId: data.empId, aplyYm: data.aplyYm, aplyOdr: data.aplyOdr};
                        await ApiRequest('/boot/prjct/updateMmAtrzCmptnYn', param);
                        handleMmAply();
                        getMmChildList(expandedMmKey);
                    }
                }
            } catch (error) {
                console.log(error)
            }
        }else if(button.name === "aprvCncl"){
            const param = [
                { tbNm: "PRJCT_MM_ATRZ" },
                { atrzDmndSttsCd: "VTW03702",
                  aprvrEmpId: null,
                  aprvYmd: null},
                { prjctId: data.prjctId, empId: data.empId, aplyYm: data.aplyYm, aplyOdr: data.aplyOdr, aplyYmd: data.aplyYmd }
            ];
            try {
                const confirmResult = window.confirm("승인 취소하시겠습니까?");
                if(confirmResult){
                    const response = await ApiRequest('/boot/common/commonUpdate', param);
                    if(response > 0) {
                        const param = [
                            { tbNm: "PRJCT_INDVDL_CT_MM" },
                            { mmAtrzCmptnYn: "N"},
                            { prjctId: data.prjctId, empId: data.empId, aplyYm: data.aplyYm, aplyOdr: data.aplyOdr}
                        ];
                        await ApiRequest('/boot/common/commonUpdate', param);
                        handleMmAply();
                        getMmChildList(expandedMmKey);
                    }
                }
            } catch (error) {
                console.log(error)
            }
        }else if(button.name === "rjct"){
            childData.current = data;
            setMmRjctPopupVisible(true);
        }else if(button.name === "rjctCncl"){
            try {
                const confirmResult = window.confirm("반려 취소하시겠습니까?");
                const param = [
                    { tbNm: "PRJCT_MM_ATRZ" },
                    { atrzDmndSttsCd: "VTW03702",
                        aprvrEmpId: null,
                        rjctPrvonsh: null,
                        rjctYmd: null
                    },
                    { prjctId: data.prjctId, empId: data.empId, aplyYm: data.aplyYm, aplyOdr: data.aplyOdr, aplyYmd: data.aplyYmd}
                ];
                if(confirmResult) {
                    const response = await ApiRequest('/boot/common/commonUpdate', param);
                    if (response > 0) {
                        const param = [
                            { tbNm: "PRJCT_INDVDL_CT_MM" },
                            { mmAtrzCmptnYn: "N"},
                            { prjctId: data.prjctId, empId: data.empId, aplyYm: data.aplyYm, aplyOdr: data.aplyOdr}
                        ];
                        await ApiRequest('/boot/common/commonUpdate', param);
                        handleMmAply();
                        getMmChildList(expandedMmKey);
                    }
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

    // 인력 세부리스트 화면
    const masterDetailMm = () => {
        if(mmChildList.length !== 0){
            return (
                <CustomTable
                    values={mmChildList}
                    keyColumn={detailMm.keyColumn}
                    columns={detailMm.tableColumns}
                    onClick={onMmChildBtnClick}
                />
            );
        }
    };


    const [ctChildList, setCtChildList] = useState([]);
    const [expandedCtKey, setExpandedCtKey] = useState(null);
    const ctChild = useRef("");

    useLayoutEffect(() => {
        getCtChildList(ctChild.current);
    }, [ctChild.current]);

    // 경비 세부리스트 데이터 가져오기
    const getCtChildList = async (key) => {
        try {
            const response = await ApiRequest("/boot/common/queryIdSearch",
            { queryId: 'projectMapper.retrieveProjectCtChild',
                prjctId: param.prjctId,
                empId: key,
                aplyYm: param.aplyYm,
                aplyOdr: param.aplyOdr
            });
            setCtChildList(response);
        } catch (error) {
            console.error(error)
        }
    };

    // 경비 세부리스트 선택 시 로우의 키값 확인
    const expandingCt = (e) => {
        ctChild.current = e.key;
        if (expandedCtKey !== e.key) {
            e.component.collapseRow(expandedCtKey);
            setCtChildList([]);
            setExpandedCtKey(e.key);
        }
    };

    // 경비 세부리스트의 승인, 승인취소, 반려, 반려취소 버튼 누를 시
    const onCtChildBtnClick = async (button, data) => {
        if(button.name === "aprv"){
            try {
                const confirmResult = window.confirm("승인하시겠습니까?");
                if(confirmResult){
                    let response = 0;
                    if((day > 15 && data.aplyYm === date.getFullYear()+monthVal && data.aplyOdr === 1) ||
                        (15 >= day && data.aplyYm === lastMonth.getFullYear()+lastMonthVal && data.aplyOdr === 2)){
                        const param = [
                            { tbNm: "PRJCT_CT_ATRZ" },
                            { atrzDmndSttsCd: "VTW03703",
                                aprvrEmpId: userInfo.empId,
                                aprvYmd: year + monthVal + dayVal},
                            { prjctId: data.prjctId, empId: data.empId, aplyYm: data.aplyYm, aplyOdr: data.aplyOdr, prjctCtAplySn: data.prjctCtAplySn }
                        ];
                        response = await ApiRequest('/boot/common/commonUpdate', param);
                    } else {
                        const param = { prjctId: data.prjctId, empId: data.empId, aplyYm: data.aplyYm, aplyOdr: data.aplyOdr, prjctCtAplySn: data.prjctCtAplySn, aprvrEmpId: userInfo.empId };
                        response = await ApiRequest('/boot/prjct/apprvOldCt', param);
                    }
                    if(response > 0) {
                        const param = { prjctId: data.prjctId, empId: data.empId, aplyYm: data.aplyYm, aplyOdr: data.aplyOdr};
                        await ApiRequest('/boot/prjct/updateCtAtrzCmptnYn', param);
                        handleCtAply();
                        getCtChildList(expandedCtKey);
                    }
                }
            } catch (error) {
                console.log(error)
            }
        }else if(button.name === "aprvCncl"){
            const param = [
                { tbNm: "PRJCT_CT_ATRZ" },
                { atrzDmndSttsCd: "VTW03702",
                    aprvrEmpId: null,
                    aprvYmd: null},
                { prjctId: data.prjctId, empId: data.empId, aplyYm: data.aplyYm, aplyOdr: data.aplyOdr, prjctCtAplySn: data.prjctCtAplySn }
            ];
            try {
                const confirmResult = window.confirm("승인 취소하시겠습니까?");
                if(confirmResult){
                    const response = await ApiRequest('/boot/common/commonUpdate', param);
                    if(response > 0) {
                        const param = [
                            { tbNm: "PRJCT_INDVDL_CT_MM" },
                            { ctAtrzCmptnYn: "N"},
                            { prjctId: data.prjctId, empId: data.empId, aplyYm: data.aplyYm, aplyOdr: data.aplyOdr}
                        ];
                        await ApiRequest('/boot/common/commonUpdate', param);
                        handleCtAply();
                        getCtChildList(expandedCtKey);
                    }
                }
            } catch (error) {
                console.log(error)
            }
        }else if(button.name === "rjct"){
            childData.current = data;
            setCtRjctPopupVisible(true);
        }else if(button.name === "rjctCncl"){
            try {
                const confirmResult = window.confirm("반려 취소하시겠습니까?");
                const param = [
                    { tbNm: "PRJCT_CT_ATRZ" },
                    { atrzDmndSttsCd: "VTW03702",
                        aprvrEmpId: null,
                        rjctPrvonsh: null,
                        rjctYmd: null
                    },
                    { prjctId: data.prjctId, empId: data.empId, aplyYm: data.aplyYm, aplyOdr: data.aplyOdr, prjctCtAplySn: data.prjctCtAplySn}
                ];
                if(confirmResult) {
                    const response = await ApiRequest('/boot/common/commonUpdate', param);
                    if (response > 0) {
                        const param = [
                            { tbNm: "PRJCT_INDVDL_CT_MM" },
                            { ctAtrzCmptnYn: "N"},
                            { prjctId: data.prjctId, empId: data.empId, aplyYm: data.aplyYm, aplyOdr: data.aplyOdr}
                        ];
                        await ApiRequest('/boot/common/commonUpdate', param);
                        handleCtAply();
                        getCtChildList(expandedCtKey);
                    }
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

    // 경비 세부리스트 화면
    const masterDetailCt = () => {
        if(ctChildList.length !== 0){
            return (
                <CustomTable
                    values={ctChildList}
                    keyColumn={detailCt.keyColumn}
                    columns={detailCt.tableColumns}
                    onClick={onCtChildBtnClick}
                />
            );
        }
    };

    return (
        <div className="container">
            <div
                className="title p-1"
                style={{ marginTop: "20px", marginBottom: "10px" }}
            >
                <h1 style={{ fontSize: "40px" }}>프로젝트 비용승인</h1>
            </div>
            <div className="" style={{ marginBottom: "10px" }}>
                <span>* 프로젝트: {prjctNm}</span>
            </div>
            <div className="wrap_search" style={{ marginBottom: "20px" }}>
                <SearchPrjctCostSet callBack={searchHandle} props={searchParams} />
            </div>
            <div className="" style={{ marginBottom: "10px" }}>
                <span>* 수행인력</span>
            </div>
            <CustomTable keyColumn={mm.keyColumn} columns={mm.tableColumns} values={mmValues} paging={true} onClick={onMmBtnClick} summary={true} summaryColumn={mm.summaryColumn} masterDetail={masterDetailMm} handleExpanding={expandingMm}/>
            <div className="" style={{ marginBottom: "10px" }}>
                <span>* 경비</span>
            </div>
            <CustomTable keyColumn={ct.keyColumn} columns={ct.tableColumns} values={ctValues} paging={true} onClick={onCtBtnClick} summary={true} summaryColumn={ct.summaryColumn} masterDetail={masterDetailCt} handleExpanding={expandingCt}/>
            <Popup
                width={ProjectHrCtAprvDetailJson.popup.width}
                height={ProjectHrCtAprvDetailJson.popup.height}
                visible={ctPopupVisible}
                onHiding={handleClose}
                showCloseButton={true}
            >
                <ProjectHrCtAprvCtPop props={ctDetailValues} prjctNm={prjctNm} data={data} currentDate={currentDate} setCurrentDate={setCurrentDate} holiday={holiday}/>
            </Popup>

            <Popup
                width={ProjectHrCtAprvDetailJson.popup.width}
                height={ProjectHrCtAprvDetailJson.popup.height}
                visible={mmPopupVisible}
                onHiding={handleClose}
                showCloseButton={true}
            >
                <ProjectHrCtAprvMmPop props={mmDetailValues} prjctNm={prjctNm} data={data} currentDate={currentDate} setCurrentDate={setCurrentDate} holiday={holiday}/>
            </Popup>

            <Popup
                width={ProjectHrCtAprvDetailJson.rjctPopup.width}
                height={ProjectHrCtAprvDetailJson.rjctPopup.height}
                visible={mmRjctPopupVisible}
                onHiding={handleClose}
                showCloseButton={true}
                title={ProjectHrCtAprvDetailJson.rjctPopup.title}
            >
                <TextArea
                    height="50%"
                    valueChangeEvent="change"
                    onValueChanged={onTextAreaValueChanged}
                    placeholder="반려 사유를 입력해주세요."
                />
                <br/>
                <Button text="반려" onClick={onClickMmRjct}/>
                <Button text="취소" onClick={handleClose}/>
            </Popup>

            <Popup
                width={ProjectHrCtAprvDetailJson.rjctPopup.width}
                height={ProjectHrCtAprvDetailJson.rjctPopup.height}
                visible={ctRjctPopupVisible}
                onHiding={handleClose}
                showCloseButton={true}
                title={ProjectHrCtAprvDetailJson.rjctPopup.title}
            >
                <TextArea
                    height="50%"
                    valueChangeEvent="change"
                    onValueChanged={onTextAreaValueChanged}
                    placeholder="반려 사유를 입력해주세요."
                />
                <br/>
                <Button text="반려" onClick={onClickCtRjct}/>
                <Button text="취소" onClick={handleClose}/>
            </Popup>
        </div>

    );


}

export default ProjectHrCtAprvDetail;