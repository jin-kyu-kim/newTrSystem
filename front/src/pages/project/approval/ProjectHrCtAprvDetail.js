import React, {useCallback, useEffect, useState,} from "react";
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
import {useCookies} from "react-cookie";

const ProjectHrCtAprvDetail = () => {

    const [cookies] = useCookies([]);
    const location = useLocation();
    const prjctId = location.state.prjctId;
    const prjctNm = location.state.prjctNm;
    const bgtMngOdr = location.state.bgtMngOdr;
    const { searchParams, mm, ct } = ProjectHrCtAprvDetailJson;
    
    const [param, setParam] = useState([]);
    const [data, setData] = useState([]);
    const [mmValues, setMmValues] = useState([]);
    const [ctValues, setCtValues] = useState([]);
    const [ctPopupVisible, setCtPopupVisible] = useState(false);
    const [mmPopupVisible, setMmPopupVisible] = useState(false);
    const [mmRjctPopupVisible, setMmRjctPopupVisible] = useState(false);
    const [ctRjctPopupVisible, setCtRjctPopupVisible] = useState(false);
    const [ctDetailValues, setCtDetailValues] = useState([]);
    const [mmDetailValues, setMmDetailValues] = useState([]);
    const [opnnCn, setOpnnCn] = useState("");
    const [currentDate, setCurrentDate] = useState(new Date());

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
    }, []);

    // 조회
    useEffect(() => {
        if(!Object.values(param).every((value) => value === "")) {
            handleMmAply();
            handleCtAply();
        }

    }, [param])

    useEffect(() => {
        if(data.aplyYm != null){
            setCurrentDate(data.aplyYm.slice(0,4)+"/"+data.aplyYm.slice(4,6)+"/01");
        }
    }, [data]);

    const handleCtAply = async () => {

        const ctParam = {
            ...param,
            queryId: ProjectHrCtAprvDetailJson.ct.queryId,
        }

        const response = await ApiRequest("/boot/common/queryIdSearch", ctParam);
        setCtValues(response);
    }

    // 경비 조회
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

    const onMmBtnClick = async (button, data) => {
        if(button.name === "aprvList"){
            setData(data);
            await retrieveProjectMmAplyDetail(data);
            setMmPopupVisible(true);
        }else if(button.name === "aprv"){
            const param = [
                { tbNm: "PRJCT_MM_ATRZ" },
                { atrzDmndSttsCd: "VTW03703",
                  aprvrEmpId: cookies.userInfo.empId,
                  aprvYmd: year + monthVal + dayVal},
                { prjctId: prjctId, empId: data.empId, aplyYm: data.aplyYm, aplyOdr: data.aplyOdr, atrzDmndSttsCd: "VTW03702"}
            ];
            try {
                const confirmResult = window.confirm("승인하시겠습니까?");
                if(confirmResult){
                    const response = await ApiRequest('/boot/common/commonUpdate', param);
                    if(response > 0) {
                        const param = [
                            { tbNm: "PRJCT_INDVDL_CT_MM" },
                            { mmAtrzCmptnYn: "Y"},
                            { prjctId: prjctId, empId: data.empId, aplyYm: data.aplyYm, aplyOdr: data.aplyOdr}
                        ];
                        await ApiRequest('/boot/common/commonUpdate', param);
                        handleMmAply();
                    }
                }
            } catch (error) {
                console.log(error)
            }
        }else if(button.name === "rjct"){
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
                        handleMmAply();
                    }
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

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


    const onCtBtnClick = async (button, data) => {
        if(button.name === "ctList"){
            setData(data);
            await retrieveProjectCtAplyDetail(data);
            setCtPopupVisible(true);
        }else if(button.name === "aprv"){
            const param = [
                { tbNm: "PRJCT_CT_ATRZ" },
                { atrzDmndSttsCd: "VTW03703",
                  aprvrEmpId: cookies.userInfo.empId,
                  aprvYmd: year + monthVal + dayVal},
                { prjctId: prjctId, empId: data.empId, aplyYm: data.aplyYm, aplyOdr: data.aplyOdr, atrzDmndSttsCd: "VTW03702"}
            ];
            try {
                const confirmResult = window.confirm("승인하시겠습니까?");
                if(confirmResult){
                    const response = await ApiRequest('/boot/common/commonUpdate', param);
                    if(response > 0) {
                        const param = [
                            { tbNm: "PRJCT_INDVDL_CT_MM" },
                            { ctAtrzCmptnYn: "Y"},
                            { prjctId: prjctId, empId: data.empId, aplyYm: data.aplyYm, aplyOdr: data.aplyOdr}
                        ];
                        await ApiRequest('/boot/common/commonUpdate', param);
                        handleCtAply();
                    }
                }
            } catch (error) {
                console.log(error)
            }
        }else if(button.name === "rjct"){
            setCtRjctPopupVisible(true);
        }else if(button.name === "aprvCncl"){
            const param = [
                { tbNm: "PRJCT_CT_ATRZ" },
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
                            { ctAtrzCmptnYn: "N"},
                            { prjctId: prjctId, empId: data.empId, aplyYm: data.aplyYm, aplyOdr: data.aplyOdr}
                        ];
                        await ApiRequest('/boot/common/commonUpdate', param);
                        handleCtAply();
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
                        handleCtAply();
                    }
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

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

    const handleClose = () => {
        setCtPopupVisible(false);
        setMmPopupVisible(false);
        setCtRjctPopupVisible(false);
        setMmRjctPopupVisible(false);
    };

    const onTextAreaValueChanged = useCallback((e) => {
        setOpnnCn(e.value);
    }, []);

    const onClickMmRjct = async () => {
        try {
            const confirmResult = window.confirm("반려하시겠습니까?");
            const param = [
                { tbNm: "PRJCT_MM_ATRZ" },
                { atrzDmndSttsCd: "VTW03704",
                  aprvrEmpId: cookies.userInfo.empId,
                  rjctPrvonsh: opnnCn,
                  rjctYmd: year + monthVal + dayVal
                },
                { prjctId: prjctId, empId: data.empId, aplyYm: data.aplyYm, aplyOdr: data.aplyOdr, atrzDmndSttsCd: "VTW03702"}
            ];
            if(confirmResult) {
                const response = await ApiRequest('/boot/common/commonUpdate', param);
                if (response > 0) {
                    handleMmAply();
                    setMmRjctPopupVisible(false);
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    const onClickCtRjct = async () => {
        try {
            const confirmResult = window.confirm("반려하시겠습니까?");
            const param = [
                { tbNm: "PRJCT_CT_ATRZ" },
                { atrzDmndSttsCd: "VTW03704",
                  aprvrEmpId: cookies.userInfo.empId,
                  rjctPrvonsh: opnnCn,
                  rjctYmd: year + monthVal + dayVal
                },
                { prjctId: prjctId, empId: data.empId, aplyYm: data.aplyYm, aplyOdr: data.aplyOdr, atrzDmndSttsCd: "VTW03702"}
            ];
            if(confirmResult) {
                const response = await ApiRequest('/boot/common/commonUpdate', param);
                if (response > 0) {
                    handleCtAply();
                    setCtRjctPopupVisible(false);
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

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
            <CustomTable keyColumn={mm.keyColumn} columns={mm.tableColumns} values={mmValues} paging={true} onClick={onMmBtnClick} summary={true} summaryColumn={mm.summaryColumn}/>
            <div className="" style={{ marginBottom: "10px" }}>
                <span>* 경비</span>
            </div>
            <CustomTable keyColumn={ct.keyColumn} columns={ct.tableColumns} values={ctValues} paging={true} onClick={onCtBtnClick} summary={true} summaryColumn={ct.summaryColumn}/>
            <Popup
                width={ProjectHrCtAprvDetailJson.popup.width}
                height={ProjectHrCtAprvDetailJson.popup.height}
                visible={ctPopupVisible}
                onHiding={handleClose}
                showCloseButton={true}
            >
                <ProjectHrCtAprvCtPop props={ctDetailValues} prjctNm={prjctNm} data={data} currentDate={currentDate} setCurrentDate={setCurrentDate}/>
            </Popup>

            <Popup
                width={ProjectHrCtAprvDetailJson.popup.width}
                height={ProjectHrCtAprvDetailJson.popup.height}
                visible={mmPopupVisible}
                onHiding={handleClose}
                showCloseButton={true}
            >
                <ProjectHrCtAprvMmPop props={mmDetailValues} prjctNm={prjctNm} data={data} currentDate={currentDate} setCurrentDate={setCurrentDate}/>
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