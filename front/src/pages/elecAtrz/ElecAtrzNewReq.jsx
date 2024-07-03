import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import uuid from 'react-uuid'

import { FileUploader } from "devextreme-react/file-uploader";
import HtmlEditBox from "components/unit/HtmlEditBox";
import ApiRequest from "utils/ApiRequest";
import axios from "axios";
import ElecAtrzNewReqJson from "./ElecAtrzNewReqJson.json"

import ElecAtrzTitleInfo from "./common/ElecAtrzTitleInfo";
import ExpensInfo from "./expensClm/ExpensInfo";

import ElecAtrzCtrtInfo from "./ctrtInfo/ElecAtrzCtrtInfo";
import ElecAtrzCtrtInfoDetail from "./ctrtInfo/ElecAtrzCtrtInfoDetail";
import ElecAtrzCtrtOutordHnfDetail from "./ctrtInfo/ElecAtrzCtrtOutordHnfDetail";
import ElecAtrzTabDetail from "./ElecAtrzTabDetail";

import { Button } from 'devextreme-react';
import { useModal } from "../../components/unit/ModalContext";
import ApprovalPopup from 'components/unit/ApprovalPopup';

const ElecAtrzNewReq = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const prjctId = location.state.prjctId;
    const formData = location.state.formData;
    const [sttsCd, setSttsCd] = useState(location.state.sttsCd);
    const ctrtTyCd = location.state.ctrtTyCd;

    const { handleOpen } = useModal();
    const [loading, setLoading] = useState(false);
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    /** 첨부파일 관련 */
    const [attachments, setAttachments] = useState([]);
    const [deleteFiles, setDeleteFiles] = useState([{ tbNm: "ATCHMNFL" }]);
    const [newAttachments, setNewAttachments] = useState(attachments);
    const fileDir = newAttachments[0]?.fileStrgCours ? newAttachments[0]?.fileStrgCours.substring(8) : null;

    const [data, setData] = useState(location.state.formData);
    const [atrzParam, setAtrzParam] = useState({});
    const [childData, setChildData] = useState({});  //자식 컴포넌트에서 받아온 데이터
    const [prjctData, setPrjctData] = useState({});

    const [atrzLnEmpList, setAtrzLnEmpList] = useState([]);
    const [popVisible, setPopVisible] = useState(false);
    const column = { "dataField": "gnrlAtrzCn", "placeholder": "내용을 입력해주세요." };

    // 임시저장 용 전자결재 아이디
    const [elctrnAtrzId, setElctrnAtrzId] = useState();

    useEffect(() => {
        getDetailData();
        /**
         * 계약 지급인 경우 계약코드 및 계약전자결재ID 조회
         */
        if (!ctrtTyCd) {
            if (formData.atrzDmndSttsCd === "VTW03701" || sttsCd === "VTW05407" || sttsCd === "VTW05406" || sttsCd === "VTW05405") {   //임시저장
                getCtrtInfo();
            };
        }
    }, [elctrnAtrzId]);

    const getDetailData = async () => {
        const res = await ApiRequest('/boot/common/queryIdSearch', { queryId: "elecAtrzMapper.elecAtrzDetail", elctrnAtrzId: elctrnAtrzId != undefined ? elctrnAtrzId : formData.elctrnAtrzId })
        if (res.length !== 0) {
            setData(prev => {
                const newState = {
                    ...prev,
                    ...res[0]
                };
                return newState;
            });
        }
    }

    const getCtrtInfo = async () => {
        try {
            const response = await ApiRequest('/boot/common/queryIdSearch',
                { queryId: "elecAtrzMapper.retrieveElctrnAtrzId", elctrnAtrzId: formData.elctrnAtrzId }
            );
            if (response.length > 0) {
                setData(prev => {
                    const newState = {
                        ...prev,
                        ctrtElctrnAtrzId: response[0].ctrtElctrnAtrzId,
                        ctrtTyCd: response[0].elctrnAtrzTySeCd
                    };
                    return newState;
                });
            }
        } catch (error) {
            console.log('error', error);
        }
    }

    /*
     * 첨부파일 저장 테이블 지정 
     */
    let insertTable = "";
    if (["VTW04907"].includes(data.elctrnAtrzTySeCd)) {
        insertTable = "CLM_ATRZ";
    } else if (["VTW04908", "VTW04909", "VTW04910"].includes(data.elctrnAtrzTySeCd)) {
        insertTable = "CTRT_ATRZ";
    } else if (["VTW04911", "VTW04912", "VTW04913", "VTW04914"].includes(data.elctrnAtrzTySeCd)) {
        insertTable = "CTRT_GIVE_ATRZ";
    } else {
        insertTable = "GNRL_ATRZ";
    }

    /**
     * 자식컴포넌트에서 받아온 데이터 처리
     * @param {Object|Array} data 
     */
    const handleChildData = (data) => {
        if (Array.isArray(data)) {
            setChildData(prevData => ({
                ...prevData,
                arrayData: data
            }));
        } else if (typeof data === "object") {
            setChildData(prevData => ({
                ...prevData,
                ...data
            }));
        }
    }

    useEffect(() => {
        retrievePrjctInfo();
        /**
         * 상태 코드가 임시저장일 때 실행될 코드
         * 상태 코드가 재기안 일때 실행될 코드
         */
        if (sttsCd === "VTW03701" || sttsCd === "VTW05407" || sttsCd === "VTW05406" || sttsCd === "VTW05405") {

            setAtrzParam(atrzParam => ({
                ...atrzParam,
                title: data.title,
                atrzCn: data.cn
            }));
            // 첨부파일 조회
            if (data.atchmnflId) {
                getAttachments();
            }
        }
    }, [data]);

    /**
     * 자식컴포넌트에서 받아온 데이터 set 
     */
    useEffect(() => {
        // 일반 전자결재시 테이블 삽입. "GNRL_ATRZ"
        if (!["VTW04908", "VTW04909", "VTW04910", "VTW04907", "VTW04911", "VTW04912", "VTW04913", "VTW04914"].includes(data.elctrnAtrzTySeCd)) {
            setAtrzParam(atrzParam => ({
                ...atrzParam,
                ...childData,
                tbNm: "GNRL_ATRZ"
            }));
        }
        setAtrzParam(atrzParam => ({
            ...atrzParam,
            ...childData
        }));
    }, [childData]);

    /**
     *  내용 html 데이터 set
     */
    useEffect(() => {

        setAtrzParam(atrzParam => ({
            ...atrzParam,
            atrzCn: data.gnrlAtrzCn === undefined ? data.cn : data.gnrlAtrzCn
        }));
    }, [data]);

    /**
     * 첨부파일 조회
     */
    const getAttachments = async () => {
        try {
            const response = await ApiRequest("/boot/common/commonSelect", [
                { tbNm: "ATCHMNFL" }, { atchmnflId: data.atchmnflId }
            ]);
            if (response.length > 0) {
                const tmpFileList = response.map((item) => ({
                    realFileNm: item.realFileNm,
                    strgFileNm: item.strgFileNm,
                    atchmnflSn: item.atchmnflSn,
                    fileStrgCours: item.fileStrgCours
                }));
                setAttachments(tmpFileList);
                setNewAttachments(tmpFileList);
            }
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * 파일 제거 
     * @param {} deleteItem 
     */
    const attachFileDelete = (deleteItem) => {
        setDeleteFiles([...deleteFiles, { atchmnflId: sttsCd === "VTW05405" || sttsCd === "VTW05406" || sttsCd === "VTW05407" ? '' : data.atchmnflId, atchmnflSn: deleteItem.atchmnflSn, strgFileNm: deleteItem.strgFileNm }]);
        setNewAttachments(newAttachments.filter(item => item !== deleteItem));
    }

    /** 결재선용 데이터 - 등록시에는 기본 참조자 리스트 조회 */
    useEffect(() => {
        /** 최초에는 참조 테이블의 데이터만 가져온다. */
        const getAtrzEmp = async () => {
            try {
                const response = await ApiRequest('/boot/common/queryIdSearch', {
                    queryId: "indvdlClmMapper.retrieveElctrnAtrzRefrnInq",
                    approvalCode: "VTW00706",
                    state: "elecRef"
                })
                setAtrzLnEmpList(response);
            } catch (error) {
                console.log('error', error);
            }
        };

        /** 임시저장일 경우에 저장된 결재선을 가져온다. */
        const getTempAtrzLn = async () => {
            const param = {
                queryId: "elecAtrzMapper.retrieveAtrzLn",
                elctrnAtrzId: data.ctrtElctrnAtrzId ? data.ctrtElctrnAtrzId : data.elctrnAtrzId,
                sttsCd: sttsCd
            }
            try {
                const response = await ApiRequest("/boot/common/queryIdSearch", param);
                setAtrzLnEmpList(response);
            } catch (error) {
                console.error(error)
            }
        }

        /** 취소결재 경우에 승인된 결재선을 가져온다. */
        const retrieveRtrcnAtrzLn = async () => {

            const param = {
                elctrnAtrzId: data.ctrtElctrnAtrzId ? data.ctrtElctrnAtrzId : data.elctrnAtrzId,
            }

            const response = await ApiRequest("/boot/elecAtrz/retrieveRtrcnAtrzLn", param);
            setAtrzLnEmpList(response);
        }

        if (sttsCd === "VTW03701" || sttsCd === "VTW05407" || sttsCd === "VTW05406") {
            getTempAtrzLn();
        } else if (sttsCd === "VTW05405") {
            // 결재선을 가져오되, 승인한 사람들에게 취소요청을 하기 위해서 승인된 것만 가져오기.
            retrieveRtrcnAtrzLn();
        } else {
            getAtrzEmp();
        }
    }, []);

    const onAtrzLnPopup = async () => {
        setPopVisible(true);
    }

    const onPopHiding = async (aprvrEmpList) => {
        setPopVisible(false);
        getAtrzLn(aprvrEmpList)
    }

    const getAtrzLn = (lnList) => {
        // 결재선 등록후 받은 파라미터
        setAtrzLnEmpList(lnList);
    }

    /**
     * 프로젝트 기초정보 조회
     */
    const retrievePrjctInfo = async () => {
        const param = [
            { tbNm: "PRJCT" },
            { prjctId: prjctId }
        ]
        try {
            const response = await ApiRequest("/boot/common/commonSelect", param);
            setPrjctData(response[0]);
        } catch (error) {
            console.error(error)
        }
    };

    /**
     * 결재요청 버튼 클릭시 결재요청 코드와 함께 전자결재 요청 함수 실행
     */
    const requestElecAtrz = async () => {
        handleOpen("결재요청 하시겠습니까?", () => createAtrz(atrzParam, "VTW03702"), true);
    }

    /**
     * 임시저장 버튼 클릭시 임시저장 코드와 함께 저장 함수 실행
     */
    const saveTemp = async () => {
        createAtrz(atrzParam, "VTW03701");
    }

    /**
     * 승인 요청 및 임시저장 시 실행되는 함수
     * @param {} param 
     */
    const createAtrz = async (param, stts) => {
        const date = new Date();

        //임시저장 눌렀을 시 벨리데이션 체크    
        const isValid = checkValidation(stts, param, atrzLnEmpList);
        if (!isValid) return;

        /**
         * 전자결재 & 첨부파일 저장
         */
        const insertParam = {
            param,
            atrzDmndSttsCd: stts,
            elctrnAtrzId: data.elctrnAtrzId !== undefined && sttsCd === "VTW03701" ? data.elctrnAtrzId : uuid(),
            prjctId: prjctId,
            elctrnAtrzTySeCd: data.elctrnAtrzTySeCd,
            regDt: date.toISOString().split('T')[0] + ' ' + date.toTimeString().split(' ')[0],
            regEmpId: userInfo.empId,
            atrzFormDocId: formData.atrzFormDocId,
            atrzLnEmpList,
            sttsCd: sttsCd,
            histElctrnAtrzId: sttsCd === "VTW05405" || sttsCd === "VTW05406" ? data.elctrnAtrzId : data.histElctrnAtrzId,
            atrzHistSeCd: sttsCd === "VTW05405" || sttsCd === "VTW05406" ? sttsCd : data.atrzHistSeCd != undefined ? data.atrzHistSeCd : "VTW05401"
        }
        
        try {
            setLoading(true);
            const response = await ApiRequest("/boot/elecAtrz/insertElecAtrz", insertParam);
            const token = localStorage.getItem("token");

            if (response) {
                // 비용청구에서 넘어온 Data Insert 경우
                if (formData.selectedData) {
                    const updateRows = formData.selectedData.map(data => {
                        ApiRequest('/boot/common/commonUpdate', [
                            { tbNm: "CARD_USE_DTLS" },
                            { prjctCtInptPsbltyYn: "N" },
                            { lotteCardAprvNo: data.lotteCardAprvNo }
                        ]);
                    });
                    Promise.all(updateRows).then(res => {
                    }).catch(error => {
                        console.error("error:", error);
                    });
                }

                // 취소결재 변경결재 시 결재선 멈춤
                if (stts != "VTW03701" && (data.atrzHistSeCd === "VTW05405" || sttsCd === "VTW05405")) {
                    const param = [
                        { tbNm: "ATRZ_LN" },
                        {
                            atrzSttsCd: "VTW00806",
                            mdfcnDt: date.toISOString().split('T')[0] + ' ' + date.toTimeString().split(' ')[0],
                            mdfcnEmpId: userInfo.empId,
                        },
                        {
                            elctrnAtrzId: insertParam.histElctrnAtrzId,
                            atrzSttsCd: "VTW00801"
                        }
                    ]
                    const updateResponse = await ApiRequest("/boot/common/commonUpdate", param);
                }

                const formDataAttach = new FormData();
                formDataAttach.append("tbNm", JSON.stringify({ tbNm: insertTable }));

                // 1. 임시저장 -> 
                if (data.atchmnflId !== undefined && sttsCd === "VTW03701") {
                    formDataAttach.append("data", JSON.stringify({ atchmnflId: data.atchmnflId, dirType: ElecAtrzNewReqJson.dirType }));

                } else if (data.atchmnflId !== undefined && stts === "VTW03701" && sttsCd === "VTW05407") {
                    formDataAttach.append("data", JSON.stringify({ atchmnflId: data.atchmnflId, dirType: ElecAtrzNewReqJson.dirType }));
                
                } else if (sttsCd === "VTW05405" || sttsCd === "VTW05406" || sttsCd === "VTW05407") {
                    formDataAttach.append("data", JSON.stringify({ atchmnflId: uuid(), dirType: ElecAtrzNewReqJson.dirType }));

                } else {
                    formDataAttach.append("data", JSON.stringify({ atchmnflId: uuid(), dirType: ElecAtrzNewReqJson.dirType }));

                }
                if (data.elctrnAtrzId !== undefined && sttsCd === "VTW03701") {
                    formDataAttach.append("idColumn", JSON.stringify({ elctrnAtrzId: data.elctrnAtrzId })); //결재ID

                } else {
                    formDataAttach.append("idColumn", JSON.stringify({ elctrnAtrzId: response })); //결재ID

                }
                formDataAttach.append("deleteFiles", JSON.stringify(deleteFiles));
                Object.values(attachments)
                    .forEach((attachment) => formDataAttach.append("attachments", attachment));

                const responseAttach = await axios.post("/boot/common/insertlongText", formDataAttach, {
                    headers: { 'Content-Type': 'multipart/form-data', "Authorization": `Bearer ${token}` },
                });

                if (responseAttach.status === 200) {
                    if (stts === "VTW03701") {
                        setData({
                            ...data,
                            elctrnAtrzId: insertParam.elctrnAtrzId,
                            title: insertParam.param.title
                        });

                        setElctrnAtrzId(response);
                        setSttsCd("VTW03701");
                        handleOpen("임시저장이 완료되었습니다.");
                    } else {
                        handleOpen("전자결재 요청이 완료되었습니다.")
                        navigate("/elecAtrz/ElecAtrz");
                    }
                }
            } else {
                handleOpen("전자결재 요청에 실패하였습니다. 관리자에게 문의하세요. ")
            }
        } catch (error) {
            console.error(error)
            if (error.response.status === 401) {
                // 로그인 상태를 해제하고 로그인 페이지로 이동
                localStorage.removeItem("token");
                localStorage.removeItem("isLoggedIn");
            }
        } finally {
            setLoading(false);
        }
    }

    /**
     * 목록 버튼 클릭시 전자결재 서식 목록으로 이동
     */
    const toAtrzNewReq = () => {
        if (["VTW03701", "VTW03702", "VTW03703", "VTW03704", "VTW00801", "VTW00802", "VTW05405", "VTW05406", "VTW05407"].includes(sttsCd)) {
            navigate("../elecAtrz/ElecAtrz", { state: { prjctId: prjctId } });
        } else if (sttsCd === "VTW03405") {
            navigate("../elecAtrz/ElecGiveAtrz", { state: { prjctId: prjctId, formData: formData } });
        } else {
            navigate("../elecAtrz/ElecAtrzForm", { state: { prjctId: prjctId } });
        }
    }

    /**
     * 결재 제목 생성하는 함수
     */
    const handleElecAtrzTitle = (e) => {
        setAtrzParam((atrzParam) => ({
            ...atrzParam,
            title: e.value
        }));

        setData((prevData) => ({
            ...prevData,
            title: e.value
        }));
    }

    const onBtnClick = (e) => {
        switch (e.element.id) {
            case "requestElecAtrz": requestElecAtrz();
                break;
            case "saveTemp": saveTemp();
                break;
            case "toAtrzNewReq": toAtrzNewReq();
                break;
            case "onAtrzLnPopup": onAtrzLnPopup();
                break;
            default:
                break;
        }
    }

    /**
     * 첨부파일 데이터 핸들링
     */
    const handleAttachmentChange = (e) => {
        setAttachments(e.value);
    };

    const validateFields = (fields) => {
        for (const [field, message] of Object.entries(ElecAtrzNewReqJson.validationRules)) {
            // 세금계산서의 경우 taxBillPblcnYmd는 필수값
            if (fields.ctStlmSeCd === 'VTW01904' && field === 'taxBillPblcnYmd') {
                if (fields.taxBillPblcnYmd === null || fields.taxBillPblcnYmd === "") {
                    handleOpen(message);
                    return false;
                }
            }

             // taxBillPblcnYmd 값이 존재하는 경우 rciptPblcnYmd 검증 건너뛰기
            if (field === 'rciptPblcnYmd') {
                if (fields.taxBillPblcnYmd && fields.taxBillPblcnYmd !== null) {
                    continue;
                }
            }
            if (field === 'taxBillPblcnYmd') {
                if (fields.rciptPblcnYmd && fields.rciptPblcnYmd !== null) {
                    continue;
                }
            }

            if (fields[field] === null || fields[field] === "" || fields[field] === 0) {
                handleOpen(message);
                return false;
            }
        }
        return true;
    };
    /**
     * 결재요청 및 임시저장 벨리데이션 체크
     */
    const checkValidation = (stts, param, atrzLnEmpList) => {
        if (["VTW03701", "VTW03702"].includes(stts)) {
            if (param.title === undefined || param.title === "") {
                handleOpen("결재 제목을 입력해주세요.");
                return false;
            } else if (param.atrzCn === undefined || param.atrzCn === "") {
                handleOpen("결재 내용을 입력해주세요.");
                return false;
            }
        }
        var atrzLn = atrzLnEmpList.find(({ approvalCode }) => approvalCode == 'VTW00705');

        if (atrzLn === undefined) {
            handleOpen("결재선의 승인자를 입력해주세요.");
            return false;
        }

        // 경비청구 필수 컬럼 validation
        if (param.arrayData && param.arrayData[0].tbNm === ElecAtrzNewReqJson.validationTableNmx) {
            if (!validateFields(param?.arrayData[1])) {
                return false;
            }
        }
        return true;
    }

    return (
        <>
            <div className="" style={{ marginTop: "10px" }}>
                {loading && (
                    <div className="loading-overlay">
                        요청 중입니다...
                    </div>
                )}
                <ElecAtrzTitleInfo
                    atrzLnEmpList={atrzLnEmpList}
                    getAtrzLn={getAtrzLn}
                    contents={ElecAtrzNewReqJson.header}
                    onHandleAtrzTitle={handleElecAtrzTitle}
                    onClick={onBtnClick}
                    prjctData={prjctData}
                    formData={formData}
                    atrzParam={atrzParam}
                    sttsCd={sttsCd}
                />
                <div dangerouslySetInnerHTML={{ __html: formData.docFormDc }} />
                {["VTW04909", "VTW04910"].includes(formData.elctrnAtrzTySeCd) && !["VTW03405"].includes(formData.docSeCd) &&   //VTW04909: 외주업체 계약, VTW04910: 재료비 계약
                    <>
                        <ElecAtrzCtrtInfo prjctId={prjctId} data={data} onSendData={handleChildData} sttsCd={sttsCd} />
                        <ElecAtrzCtrtInfoDetail prjctId={prjctId} data={data} onSendData={handleChildData} sttsCd={sttsCd} />
                    </>
                }
                {["VTW04908"].includes(formData.elctrnAtrzTySeCd) && !["VTW03405"].includes(formData.docSeCd) &&   //VTW04908: 외주인력 계약
                    <>
                        <ElecAtrzCtrtInfo prjctId={prjctId} data={data} onSendData={handleChildData} sttsCd={sttsCd} />
                        <ElecAtrzCtrtOutordHnfDetail prjctId={prjctId} data={data} onSendData={handleChildData} prjctData={prjctData} sttsCd={sttsCd} />
                    </>
                }
                {["VTW04907"].includes(formData.elctrnAtrzTySeCd) &&  //VTW04907: 비용사용(청구,출장비청구)
                    <>
                        <ExpensInfo onSendData={handleChildData} prjctId={prjctId} data={data} prjctData={prjctData} sttsCd={sttsCd} />
                    </>
                }
                {["VTW04911"].includes(formData.elctrnAtrzTySeCd) && ["VTW04909", "VTW04910", "VTW04908"].includes(ctrtTyCd ? ctrtTyCd : data.ctrtTyCd) && prjctData &&
                    <>
                        <ElecAtrzTabDetail detailData={data} sttsCd={sttsCd} prjctId={prjctId} ctrtTyCd={ctrtTyCd ? ctrtTyCd : data.ctrtTyCd} prjctData={prjctData} onSendData={handleChildData} />
                    </>
                }

                <HtmlEditBox
                    column={{ "dataField": "gnrlAtrzCn" }}
                    data={data}
                    setData={setData}
                    value={data.gnrlAtrzCn === undefined ? data.cn : data.gnrlAtrzCn}
                    placeholder={column.placeholder}
                />
                <hr />
                <div style={{ marginBottom: "30px" }}>
                    <div> * 첨부파일</div>
                    {
                        sttsCd === "VTW05405" || sttsCd === "VTW05406" || sttsCd === "VTW05407" ?
                            <>
                                <div> * 이전 전자결재에 첨부된 파일</div>
                                <div> 취소/변경/재기안 문서 작성 시 재 업로드하시기 바랍니다.</div>
                            </>
                            : <></>
                    }
                    <FileUploader
                        multiple={true}
                        accept="*/*"
                        uploadMode="useButton"
                        onValueChanged={handleAttachmentChange}
                        maxFileSize={1.5 * 1024 * 1024 * 1024}
                    />
                    {newAttachments[0] !== null && newAttachments.map((item, index) => (
                        <div key={index}>
                            {item.realFileNm && (item.realFileNm.endsWith('.jpg') || item.realFileNm.endsWith('.jpeg') || item.realFileNm.endsWith('.png') || item.realFileNm.endsWith('.gif')) ?
                                (<img src={`${fileDir}/${item.strgFileNm}`} style={{ width: '50%', marginBottom: '20px' }} alt={item.realFileNm} />)
                                : <span>{item.realFileNm}</span>}
                            {item.realFileNm && <span onClick={() => attachFileDelete(item)} style={{ fontWeight: 'bold', marginLeft: '10px', color: 'red', cursor: 'pointer' }}>X</span>}
                        </div>
                    ))}
                </div>

                <div style={{ textAlign: 'center', marginBottom: '100px' }}>
                    {ElecAtrzNewReqJson.header.map((item, index) => (
                        <Button id={item.id} text={item.text} key={index} type={item.type}
                            onClick={onBtnClick} style={{ marginRight: '3px' }} />
                    ))}
                </div>

                <ApprovalPopup
                    visible={popVisible}
                    atrzLnEmpList={atrzLnEmpList}
                    onHiding={onPopHiding}
                />
            </div>
        </>
    );
}
export default ElecAtrzNewReq;