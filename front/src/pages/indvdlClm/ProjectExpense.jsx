import React, {useCallback, useEffect, useState} from "react";
import {Button, TabPanel} from "devextreme-react";
import ProjectExpenseJson from "./ProjectExpenseJson.json"
import ApiRequest from "../../utils/ApiRequest";
import {useCookies} from "react-cookie";
import CustomTable from "../../components/unit/CustomTable";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const ProjectExpense = () => {
    const navigate = useNavigate ();

    const {keyColumn, elcKeyColumn, ctAplyTableColumns, columnCharge} = ProjectExpenseJson;
    const ExpenseInfo = ProjectExpenseJson.ExpenseInfo;
    const [index, setIndex] = useState(0);
    const [aplyYm, setAplyYm] = useState();
    const [aplyOdr, setAplyOdr] = useState();
    const [pageSize] = useState(10);
    const [values, setValues] = useState([]);
    const [charge, setCharge] = useState([]);
    const [mmAplyCheck, setMmAplyCheck] = useState();
    const [ctAtrzCmptnYn, setCtAtrzCmptnYn] = useState(null);
    const [totCnt, setTotCnt] = useState(0);
    const [aprvDmndCnt, setAprvDmndCnt] = useState(0);
    const [cookies] = useCookies([]);

    const empId = cookies.userInfo.empId;

    const date = new Date();
    const year = date.getFullYear();
    const day = date.getDate();

    const month = day > 15 ? date.getMonth() + 1 : date.getMonth();

    let odrVal = day > 15 ? "1" : "2";
    let monthVal = month < 10 ? "0" + month : month;

    const onSelectionChanged = useCallback(
        (args) => {
            if (args.name === "selectedIndex") {
                setIndex(args.value);
            }
        },
        [setIndex]
    );

    useEffect(() => {

        // 비용 청구 0건일 때 근무시간 먼저 승인요청 했는지 체크
        checkMMAply();

        // 비용결재완료여부 확인
        getCtAtrzCmptnYn();

        // 비용 청구내역 조회
        getCtAplyList();

        // 전자결재 청구내역 조회
        getElctrnAtrzClmList();

        // 결재요청상태코드별 건수 조회
        getCtAtrzDmndStts();

        setAplyYm(year+monthVal);
        setAplyOdr(odrVal);
    }, []);

    // 비용 청구 0건일 때 근무시간 먼저 승인요청 했는지 체크
    const checkMMAply = async () => {
        try {

            const param = [
                { tbNm: "PRJCT_INDVDL_CT_MM" },
                {
                    empId: empId,
                    aplyYm: year+monthVal,
                    aplyOdr: odrVal
                },
            ];
            const response = await axios.post("/boot/common/commonSelect", param);

            setMmAplyCheck(response.data);

        } catch (error) {
            console.log(error);
        }
    }

    // 비용 청구내역 조회
    const getCtAplyList = async () => {
        try{
            const param = {
                queryId: "projectExpenseMapper.retrievePrjctCtAplyList",
                empId: empId,
                aplyYm: year+monthVal,
                aplyOdr: odrVal
            };
            const response = await ApiRequest("/boot/common/queryIdSearch", param);

            setValues(response);
        } catch (e) {
            console.log(e);
        }
    };

    // 전자결재 청구내역 조회
    const getElctrnAtrzClmList = async () => {
        try{
            const param = {
                queryId: "projectExpenseMapper.retrieveElctrnAtrzClm",
                empId: empId,
                aplyYm: year+monthVal,
                aplyOdr: odrVal
            };
            const response = await ApiRequest("/boot/common/queryIdSearch", param);

            setCharge(response);
        } catch (e) {
            console.log(e);
        }
    };

    // 결재요청상태코드별 건수 조회
    const getCtAtrzDmndStts = async () => {
        try{
            const param = {
                queryId: "indvdlClmMapper.retrieveCtAtrzDmndStts",
                empId: empId,
                aplyYm: year+monthVal,
                aplyOdr: odrVal
            };
            const response = await ApiRequest("/boot/common/queryIdSearch", param);

            setTotCnt(response[0].totCnt);
            setAprvDmndCnt(response[0].aprvDmnd);
        } catch (e) {
            console.log(e);
        }
    };

    //입력마감 버튼 클릭
    function onInptDdlnClick() {

        if(mmAplyCheck.length === 0){
            window.alert('경비청구 건수가 없을 경우 근무시간을 먼저 승인 요청 해주시기 바랍니다.')
            return;
        }

        const inptDDln = window.confirm('입력마감하시겠습니까?');

        if(inptDDln){
            if(totCnt === 0){
                // 프로젝트개인비용MM 비용결재완료여부 N으로 업데이트
                updateCtAtrzCmptnYn();
            } else {
                // 비용 청구 데이터 결재요청상태 null -> 임시저장
                prjctCtInptDdln();
            }
        }
    };

    // 프로젝트개인비용MM 비용결재완료여부 N으로 업데이트
    const updateCtAtrzCmptnYn = async () => {
        const param =[
            { tbNm: "PRJCT_INDVDL_CT_MM" },
            {
                ctAtrzCmptnYn : "N"
            },
            {
                empId : empId,
                aplyYm: aplyYm,
                aplyOdr: aplyOdr
            }
        ]

        try {
            const response = await ApiRequest("/boot/common/commonUpdate", param);

            if (response > 0) {
                window.location.reload();
                window.alert("입력마감 되었습니다.");
            }
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };

    // 비용 청구 데이터 결재요청상태 null -> 임시저장
    const prjctCtInptDdln = async () => {

        const param = {
            queryId: "indvdlClmMapper.retrievePrjctCtInptDdln",
            state: "UPDATE",
            empId: empId,
            aplyYm: aplyYm,
            aplyOdr: aplyOdr
        };

        try {
            const response = await ApiRequest("/boot/common/queryIdDataControl", param);

            // 프로젝트개인비용MM 비용결재완료여부 N으로 업데이트
            if (response !== 0)
                updateCtAtrzCmptnYn();

        } catch (error) {
            console.log(error);
        }
    }

    // 비용결재완료여부 확인
    const getCtAtrzCmptnYn = async () => {
        try {
            const param = [
                { tbNm: "PRJCT_INDVDL_CT_MM" },
                {
                    empId: empId,
                    aplyYm: year+monthVal,
                    aplyOdr: odrVal
                },
            ];
            const response = await axios.post("/boot/common/commonSelect", param);

            for(let i = 0; i < response.data.length; i++) {
                if(response.data[i].ctAtrzCmptnYn === 'Y'){
                    setCtAtrzCmptnYn('Y');
                } else if(response.data[i].ctAtrzCmptnYn === 'N'){
                    setCtAtrzCmptnYn('N');
                    break;
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    // 승인요청 버튼 클릭
    function onAprvDmndClick() {

        const aprvDmnd = window.confirm("승인요청하시겠습니까?");

        if(aprvDmnd){
            if(totCnt === 0){
                // 프로젝트개인비용MM 비용결재완료여부 Y로 업데이트
                updateCtAtrzCmptnYnAprv();
            } else {
                // 비용 청구 데이터 결재요청상태 임시저장 -> 결재중
                prjctPrjctAprvDmnd();
            }
        }
    };

    // 프로젝트개인비용MM 비용결재완료여부 Y로 업데이트
    const updateCtAtrzCmptnYnAprv = async () => {
        const param =[
            { tbNm: "PRJCT_INDVDL_CT_MM" },
            {
                ctAtrzCmptnYn : "Y"
            },
            {
                empId : empId,
                aplyYm: aplyYm,
                aplyOdr: aplyOdr
            }
        ]

        try {
            const response = await ApiRequest("/boot/common/commonUpdate", param);

            if (response > 0) {
                window.location.reload();
                window.alert("승인요청 되었습니다.");
            }
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };

    // 비용 청구 데이터 결재요청상태 임시저장 -> 결재중
    const prjctPrjctAprvDmnd = async () => {

        const param = {
            queryId: "indvdlClmMapper.retrievePrjctAprvDmnd",
            state: "UPDATE",
            empId: empId,
            aplyYm: aplyYm,
            aplyOdr: aplyOdr
        };

        try {
            const response = await ApiRequest("/boot/common/queryIdDataControl", param);

            if (response > 0) {
                window.location.reload();
                window.alert("승인요청 되었습니다.");
            }
        } catch (error) {
            console.log(error);
        }
    }

    // 입력마감취소 버튼 클릭
    function onInptDdlnRtrcnClick() {

        const inptDDlnRtrcn = window.confirm('입력마감을 취소 하시겠습니까?');

        // 비용 청구 데이터 결재요청상태 임시저장 -> null
        if(inptDDlnRtrcn)
            prjctCtInptDdlnRtrcn();
    };

    // 비용 청구 데이터 결재요청상태 임시저장 -> null
    const prjctCtInptDdlnRtrcn = async () => {

        const param = {
            queryId: "indvdlClmMapper.retrievePrjctCtInptDdlnRtrcn",
            state: "UPDATE",
            empId: empId,
            aplyYm: aplyYm,
            aplyOdr: aplyOdr
        };

        try {
            const response = await ApiRequest("/boot/common/queryIdDataControl", param);

            // 프로젝트개인비용MM 비용결재완료여부 NULL으로 업데이트
            if (response !== undefined || response !== null)
                updateCtAtrzCmptnYnNull();
        } catch (error) {
            console.log(error);
        }
    }

    // 프로젝트개인비용MM 비용결재완료여부 NULL으로 업데이트
    const updateCtAtrzCmptnYnNull = async () => {
        const param =[
            { tbNm: "PRJCT_INDVDL_CT_MM" },
            {
                ctAtrzCmptnYn: null
            },
            {
                empId : empId,
                aplyYm: aplyYm,
                aplyOdr: aplyOdr
            }
        ]

        try {
            const response = await ApiRequest("/boot/common/commonUpdate", param);

            if (response > 0) {
                window.location.reload();
                window.alert("입력마감이 취소 되었습니다.");
            }
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };

    // 승인요청취소 버튼 클릭
    function onAprvDmndRtrcnClick() {

        const aprvDmndRtrcn = window.confirm('승인요청을 취소 하시겠습니까?');

        // 비용 청구 데이터 결재요청상태 임시저장 -> 결재중
        if(aprvDmndRtrcn)
            prjctPrjctAprvDmndRtrcn();
    }

    // 비용 청구 데이터 결재요청상태 임시저장 -> 결재중
    const prjctPrjctAprvDmndRtrcn = async () => {

        const param = {
            queryId: "indvdlClmMapper.retrievePrjctAprvDmndRtrcn",
            state: "UPDATE",
            empId: empId,
            aplyYm: aplyYm,
            aplyOdr: aplyOdr
        };

        try {
            const response = await ApiRequest("/boot/common/queryIdDataControl", param);

            if (response > 0) {
                window.location.reload();
                window.alert("승인요청 취소 되었습니다.");
            }
        } catch (error) {
            console.log(error);
        }
    }


    function onPrintClick() {
        console.log('aprvDmnd',aprvDmndCnt)
    };


    const deleteValue = async (e) => {
        const confirmResult = window.confirm("삭제하시겠습니까?");

        if (confirmResult) {
            const atrzParams = [
                { tbNm: "PRJCT_CT_ATRZ" },
                {
                    prjctId:  e.prjctId,
                    empId: empId,
                    aplyYm: aplyYm,
                    aplyOdr: aplyOdr,
                    prjctCtAplySn: e.prjctCtAplySn
                }
            ];

            const aplyParams = [
                { tbNm: "PRJCT_CT_APLY" },
                {
                    prjctId:  e.prjctId,
                    empId: empId,
                    aplyYm: aplyYm,
                    aplyOdr: aplyOdr,
                    prjctCtAplySn: e.prjctCtAplySn
                }
            ];

            try {
                const atrzResponse = await ApiRequest("/boot/common/commonDelete", atrzParams);
                const aplyResponse = await ApiRequest("/boot/common/commonDelete", aplyParams);
                if (atrzResponse === 1 && aplyResponse === 1) {
                    window.location.reload();
                    window.alert("삭제되었습니다.")
                }
            } catch (error) {
                console.error("API 요청 에러:", error);
                console.log(error);
            }
        }

    };

    const elecAtrzButtonRender = (button, data) => {
        let render = true;

        return(
            render && <Button name={button.name} text={button.text} onClick={(e) => moveToElecAtrz(button, data)} />
        );
    };

    const moveToElecAtrz = (button, data) => {
        navigate("/elecAtrz/ElecAtrzDetail",
            { state: {
                    data: data
                }
            });
    }

    const itemTitleRender = (a) => <span>{a.TabName}</span>;

    return (
        <div className="container">
            <div>
                <div className="mx-auto" style={{marginTop: "20px", marginBottom: "30px"}}>
                    <h1 style={{fontSize: "30px"}}>프로젝트비용</h1>
                    {ctAtrzCmptnYn === 'N' && aprvDmndCnt === 0 ? (
                        <div>
                            <Button
                                onClick={onAprvDmndClick} text="승인요청" style={{ marginLeft: "5px", height: "48px", width: "100px" }}
                            />
                            <Button
                                onClick={onInptDdlnRtrcnClick} text="입력마감취소" style={{ marginLeft: "5px", height: "48px", width: "130px" }}
                            />
                            <Button
                                onClick={onPrintClick} text="출력(팝업)" style={{ marginLeft: "5px", height: "48px", width: "120px" }}
                            />
                        </div>
                    ) : aprvDmndCnt !== 0 ? (
                        <div>
                            <Button
                                onClick={onAprvDmndRtrcnClick} text="승인요청취소" style={{ marginLeft: "5px", height: "48px", width: "130px" }}
                            />
                            <Button
                                onClick={onPrintClick} text="출력(팝업)" style={{ marginLeft: "5px", height: "48px", width: "120px" }}
                            />
                        </div>
                    ) : ctAtrzCmptnYn === 'Y' ? (
                        <div>
                            <Button
                                onClick={onPrintClick} text="출력(팝업)" style={{ marginLeft: "5px", height: "48px", width: "120px" }}
                            />
                        </div>
                    ) : (
                        <div>
                            <Button
                                onClick={onInptDdlnClick} text="입력마감" style={{ marginLeft: "5px", height: "48px", width: "100px" }}
                            />
                        </div>
                    )}
                        <p>* {aplyYm}-{aplyOdr}차수 TR 청구 내역</p>
                        <CustomTable
                            keyColumn={keyColumn}
                            pageSize={pageSize}
                            columns={ctAplyTableColumns}
                            values={values}
                            paging={true}
                            onClick={deleteValue}
                            wordWrapEnabled={true}
                        />
                        <p>* 전자결재 청구 내역</p>
                        <CustomTable
                            keyColumn={elcKeyColumn}
                            pageSize={pageSize}
                            columns={columnCharge}
                            values={charge}
                            paging={true}
                            wordWrapEnabled={true}
                            buttonRender={elecAtrzButtonRender}
                            onClick={moveToElecAtrz}
                        />
                </div>
                {ctAtrzCmptnYn !== null ? (
                    <div style={{
                        height: "250px",
                        width: "auto",
                        margin: "50px 0 10px 0",
                        borderRadius: "5px",
                        background: "#F2F2F2",
                        display: "flex",
                        alignItems: "center"
                    }}>
                        <span style={{fontSize: "20px", marginLeft: "30px"}}>입력 마감되었습니다.</span>
                    </div>
                ) : (
                    <TabPanel
                        height="auto"
                        width="auto"
                        dataSource={ExpenseInfo}
                        selectedIndex={index}
                        onOptionChanged={onSelectionChanged}
                        itemTitleRender={itemTitleRender}
                        animationEnabled={true}
                        itemComponent={({data}) => {
                            const Component = React.lazy(() => import(`${data.url}`));
                            return (
                                <React.Suspense fallback={<div>Loading...</div>}>
                                    <Component
                                        empId={empId}
                                        index={index}
                                        setIndex={setIndex}
                                        aplyYm={aplyYm}
                                        aplyOdr={aplyOdr}
                                    />
                                </React.Suspense>
                            );
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default ProjectExpense;