import { useEffect, useState, useRef } from 'react';
import { FileUploader, SelectBox, Button, TextBox, DateBox } from "devextreme-react";
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { isSaturday, isSunday, addDays } from 'date-fns'
import uuid from "react-uuid";
import axios from "axios";
import Moment from "moment"
import ApiRequest from "utils/ApiRequest";
import { useLocation } from 'react-router';
import { useNavigate } from "react-router-dom";
import { useModal } from "components/unit/ModalContext";
import CustomTable from "components/unit/CustomTable";
import ApprovalPopup from "components/unit/ApprovalPopup"
import EmpVacationCanclePopup from "pages/indvdlClm/EmpVacationCanclePopup";
import EmpVacationCondolencePopup from "pages/indvdlClm/EmpVacationCondolencePopup";
import EmpVacationAttchList from "pages/indvdlClm/EmpVacationAttchList"
import EmpVacationJson from "pages/indvdlClm/EmpVacationJson.json"

const { listKeyColumn, listTableColumns } = EmpVacationJson;

// 회계년도
const flagYear = Moment().format('YYYYMMDD') >= new Date().getFullYear() + "0401" ? new Date().getFullYear() : new Date().getFullYear() - 1
let elctrnAtrzId = uuid(); // 전자결재, 휴가결재 
let artzListValue = []; // 전자결재 팝업 데이터

const token = localStorage.getItem("token");

/**
 * @param {number} startYear 현재년도 기준 화면에 보여줄 (현재년도 - startYear)
 * @param {number} endYear 현재년도 기준 화면에 보여줄 (현재년도 + endYear)
 * @returns 시작년도부터 시작년도 + endYear 까지의 1차원 배열반환
 */
function getYearList(startYear, endYear) {
    const yearList = [];
    let startDate = parseInt(new Date(String(new Date().getFullYear() - startYear)).getFullYear());
    let endDate = parseInt(new Date().getFullYear() + endYear);

    for (startDate; startDate <= endDate; startDate++) {
        yearList.push(startDate);
    }
    return yearList;
}

/**
 * 
 * @param {*} jbttlCd 세션에서 받아온 직책코드
 * @param {*} searchResult 
 * @returns 휴가승인권자 정보
 */
function atrzLnAprv(jbttlCd, searchResult) {
    const result = [];
    let flag = true;
    let startIndex = parseInt(jbttlCd.substr(7, 8));

    for (startIndex; startIndex > 0; startIndex--) {
        let forStartIndex = 1;

        if (jbttlCd == ("VTW0100" + startIndex)) {
            while (forStartIndex > 0 && flag) {
                if (searchResult.find((item) => item.jbttlCd == ("VTW0100" + forStartIndex))) {
                    result.push({
                        empId: searchResult.find((item) => item.jbttlCd == ("VTW0100" + forStartIndex)).empId,
                        empFlnm: searchResult.find((item) => item.jbttlCd == ("VTW0100" + forStartIndex)).empFlnm,
                        jbpsNm: searchResult.find((item) => item.jbttlCd == ("VTW0100" + forStartIndex)).jbpsNm,
                        atrzLnAprvNm: searchResult.find((item) => item.jbttlCd == ("VTW0100" + forStartIndex)).listEmpFlnm
                    })
                    flag = false;
                }
                forStartIndex--
            }
        }
    }
    return result
}

const EmpVacation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { handleOpen } = useModal();

    // 첨부파일데이터
    const fileUploaderRef = useRef(null);

    // 화면로딩안내
    const [loading, setLoading] = useState(false);

    // 세션설정
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const deptInfo = JSON.parse(localStorage.getItem("deptInfo"));
    let sessionEmpId = location.state ? location.state.empId : userInfo.empId
    let sessionEmpNm = location.state ? location.state.empFlnm : userInfo.empNm
    let sessionDeptNm = location.state ? location.state.deptList[0].deptNm : deptInfo[0].deptNm
    let jbttlCd = location.state ? location.state.deptList[0].jbttlCd : deptInfo[0].jbttlCd

    // 1. 월별 근무일_공휴일정보조회
    // 2. 프로젝트목록조회
    // 3. 휴가코드조회
    // 4. 경조휴가 결재선정보조회
    useEffect(() => {
        getVcatnInfo();
        getPrjctInfo();
        getVcatnCode();
        getCondolenceceAtrzList();
    }, [])

    // 월별 근무일_공휴일 조회
    const [selectCrtrDateList, setSelectCrtrDateList] = useState();

    // 월별 근무일_공휴일 조회
    const getVcatnInfo = async () => {
        try {
            setSelectCrtrDateList(await ApiRequest("/boot/common/queryIdSearch", { queryId: "indvdlClmMapper.retrieveVcatnYearInfoInq", searchYear:flagYear }));
        } catch (error) {
            console.error("getVcatnInfo_error : " + error);
        }
    }

    // 프로젝트 목록 조회
    const [selectPrjctList, setSelectPrjctList] = useState();

    // 프로젝트 목록 조회
    const getPrjctInfo = async () => {
        try {
            setSelectPrjctList(await ApiRequest("/boot/common/queryIdSearch", { queryId: "indvdlClmMapper.retrievePrjctList" }));
        } catch (error) {
            console.error("getPrjctInfo_error : " + error);
        }
    }

    // 휴가코드조회
    const [selectCodeValue, setSelectCodeValue] = useState();

    // 휴직종류코드조회
    const [selectVcatnLeaveCodeValue, setSelectVcatnLeaveCodeValue] = useState([]);

    // 휴가코드조회
    const getVcatnCode = async () => {
        try {
            setSelectCodeValue(await ApiRequest("/boot/common/commonSelect", [{ tbNm: "CD" }, { upCdValue: "VTW012", useYn: "Y" }]));
            setSelectVcatnLeaveCodeValue(await ApiRequest("/boot/common/commonSelect", [{ tbNm: "CD" }, { upCdValue: "VTW053", useYn: "Y" }]));
        } catch (error) {
            console.error("getPrjctInfo_error : " + error);
        }
    }

    // 경조휴가 검토자정보
    const [selectCondolenceAtrzReviewValue, setSelectCondolenceAtrzReviewValue] = useState()

    // 경조휴가 승인자정보
    const [selectCondolenceAtrzApprovalValue, setSelectCondolenceAtrzApprovalValue] = useState()

    // 경조휴가 검토자, 승인자정보
    const getCondolenceceAtrzList = async () => {
        try {
            setSelectCondolenceAtrzReviewValue(await ApiRequest("/boot/common/queryIdSearch", {
                queryId: "indvdlClmMapper.retrieveElctrnAtrzRefrnInq",
                approvalCode: "VTW00702",
                state: "review"
            }));

            setSelectCondolenceAtrzApprovalValue(await ApiRequest("/boot/common/queryIdSearch", {
                queryId: "indvdlClmMapper.retrieveElctrnAtrzRefrnInq",
                approvalCode: "VTW00705",
                state: "approval"
            }));
        } catch (error) {
            console.error("getPrjctInfo_error : " + error);
        }
    }

    // 기존휴가정보조회
    const [selectSearchVcatnListValue, setSelectSearchVcatnListValue] = useState();
    const [selectSearchVcatnListParam, setSelectSearchVcatnListParam] = useState({
        queryId: "indvdlClmMapper.retrieveVcatnInfoInq",
        searchType: "searchVcatnList",
        searchYear: flagYear,
        empId: sessionEmpId,
        isSearch: true
    });

    // 기존휴가정보조회
    useEffect(() => {
        selectData(selectSearchVcatnListParam)
    }, [selectSearchVcatnListParam])

    // 휴가목록조회
    const [selectVcatnListValue, setSelectVcatnListValue] = useState([]);
    const [searchVcatnListParam, setSearchVcatnListParam] = useState({
        queryId: "indvdlClmMapper.retrieveVcatnListInq",
        searchType: "vcatnList",
        empId: sessionEmpId,
        searchYear: flagYear,
        isSearch: true
    });

    // 휴가목록조회
    useEffect(() => {
        selectData(searchVcatnListParam);
    }, [searchVcatnListParam]);

    // 휴가정보조회
    const [selectVcatnInfoValue, setSelectVcatnInfoValue] = useState([]);
    const [searchVcatnInfoParam, setSearchVcatnInfoParam] = useState({
        queryId: "indvdlClmMapper.retrieveVcatnInfoInq",
        searchType: "vcatnInfo",
        empId: sessionEmpId,
        isSearch: true
    });

    // 휴가정보조회
    useEffect(() => {
        selectData(searchVcatnInfoParam);
    }, [searchVcatnInfoParam])


    // 휴가신청전자결재첨부파일정보
    const [attachments, setAttachments] = useState([]);

    // 휴가신청전자결재저장정보
    const [insertElctrnValue, setInsertElctrnValue] = useState({
        atrzDmndEmpId: sessionEmpId,
        atrzDmndSttsCd: "VTW03702",     // 결재요청상태코드_ATRZ_DMND_STTS_CD(심사중)
        elctrnAtrzTySeCd: "VTW04901",   // 전자결재유형구분코드_ELCTRN_ATRZ_TY_SE_CD(휴가)
    });

    // 휴가신청휴가결재저장정보
    const [insertVcatnValue, setInsertVcatnValue] = useState({
        empId: sessionEmpId,
        flagYear: flagYear
    });

    // 첨부파일팝업 첨부파일ID 정보
    const [popupAttachValue, setPopupAttachValue] = useState({ visible: false });

    // 결재선팝업 결재선 정보
    const [popupAtrzValue, setPopupAtrzValue] = useState([]);
    const [popupAtrzVisibleValue, setPopupVisibleAtrzValue] = useState(false);

    // 경조휴가,공가 안내팝업 정보
    const [popupCondolenceVisibleValue, setPopupCondolenceVisibleValue] = useState({ type: "", visible: false });

    // 휴가취소요청 정보
    const [popupVcatnAtrzCancleValue, setPopupVcatnAtrzCancleValue] = useState({ visible: false });

    // 전자결재 승인권자목록정보
    const [atrzLnAprvListValue, setAtrzLnAprvListValue] = useState()
    const [atrzLnAprvListParam, setAtrzLnAprvListParam] = useState({
        queryId: "indvdlClmMapper.retrieveAtrzLnAprvListInq",
        searchType: "atrzLnAprvList",
        deptId: location.state ? location.state.deptList[0].deptId : deptInfo[0].deptId
    });

    // 전자결재 승인권자목록정보
    useEffect(() => {
        selectData(atrzLnAprvListParam);
    }, [atrzLnAprvListParam])
    
    // 전자결재 심사권자목록정보
    const [atrzLnSnrgListValue, setAtrzLnSnrgListValue] = useState()

    // 전자결재 참조자목록정보
    const [atrzLnReftnListParam, setAtrzLnReftnListParam] = useState({
        queryId: "indvdlClmMapper.retrieveElctrnAtrzRefrnInq",
        searchType: "atrzLnReftnList",
        state: "ref"
    });

    // 전자결재 참조자목록정보
    useEffect(() => {
        selectData(atrzLnReftnListParam);
    }, [atrzLnReftnListParam])

    // 목록 및 코드조회
    const selectData = async (initParam) => {
        try {
            // 휴가목록조회
            if (initParam.searchType == "vcatnList" && initParam.isSearch == true) setSelectVcatnListValue(await ApiRequest("/boot/common/queryIdSearch", initParam));

            // 휴가정보조회
            else if (initParam.searchType == "vcatnInfo") setSelectVcatnInfoValue(await ApiRequest("/boot/common/queryIdSearch", initParam));

            // 기존휴가정보조회
            else if (initParam.searchType == "searchVcatnList" && initParam.isSearch == true) setSelectSearchVcatnListValue(await ApiRequest("/boot/common/queryIdSearch", initParam));

            // 전자결재 참조자목록정보조회
            else if (initParam.searchType == "atrzLnReftnList") {
                const atrzLnReftnResult = await ApiRequest("/boot/common/queryIdSearch", initParam);

                if (atrzLnReftnResult.length > 0) {
                    artzListValue = [];

                    atrzLnReftnResult.map((item, index) => {
                        artzListValue.push({
                            ...popupAtrzValue,
                            approvalCode: "VTW00706",               // 결재단계코드(참조)
                            empId: atrzLnReftnResult[index].empId,
                            empFlnm: atrzLnReftnResult[index].empFlnm,
                            jbpsNm: atrzLnReftnResult[index].jbpsNm,
                            listEmpFlnm: atrzLnReftnResult[index].listEmpFlnm,
                        })
                    })
                    setPopupAtrzValue(artzListValue);
                }
            }

            // 전자결재 승인자목록정보조회
            else if (initParam.searchType == "atrzLnAprvList") {
                let pushData = [];
                const atrzLnAprvListResult = await ApiRequest("/boot/common/queryIdSearch", initParam);

                for (let i = 0; i < atrzLnAprvListResult.length > 0; i++) {
                    const AtrzLnAprvResult = await ApiRequest("/boot/common/queryIdSearch", { queryId: "indvdlClmMapper.retrieveAtrzLnAprvInq", deptId: atrzLnAprvListResult[i].deptId, empId: sessionEmpId });

                    if (AtrzLnAprvResult.length > 0) pushData.push(AtrzLnAprvResult[0])

                    if (i == atrzLnAprvListResult.length - 1) {
                        const returnReslut = atrzLnAprv(jbttlCd, pushData);

                        if(!popupAtrzValue.find(item => item.approvalCode == "VTW00705" && item.empId == returnReslut[0].empId)){
                            // 전자결재 승인권자목록정보
                            setAtrzLnAprvListValue({
                                approvalCode: "VTW00705",                   // 결재단계코드(승인)
                                empId: returnReslut[0].empId,
                                empFlnm: returnReslut[0].empFlnm,
                                jbpsNm: returnReslut[0].jbpsNm,
                                listEmpFlnm: returnReslut[0].atrzLnAprvNm,
                            })
    
                            // 전자결재 결재선승인권자목록정보
                            setPopupAtrzValue(prevState => [
                                ...prevState,
                                {
                                    approvalCode: "VTW00705",               // 결재단계코드(승인)
                                    empId: returnReslut[0].empId,
                                    empFlnm: returnReslut[0].empFlnm,
                                    jbpsNm: returnReslut[0].jbpsNm,
                                    listEmpFlnm: returnReslut[0].atrzLnAprvNm,
                                }
                            ])
                        }
                    }
                }
            }

            // 전자결재 심사자목록정보조회
            else if (initParam.searchType == "atrzLnSrng") {
                const atrzLnSrngResult = await ApiRequest("/boot/common/queryIdSearch", { queryId: "indvdlClmMapper.retrieveAtrzLnSrngInq", prjctMngrEmpId: initParam.prjctMngrEmpId, prjctId: initParam.prjctId });

                if (atrzLnSrngResult.length > 0) {
                    setPopupAtrzValue(popupAtrzValue.filter(item => item.approvalCode != "VTW00704"))

                    setAtrzLnSnrgListValue({
                        approvalCode: "VTW00704",                   // 결재단계코드(심사)
                        empId: atrzLnSrngResult[0].empId,
                        empFlnm: atrzLnSrngResult[0].empFlnm,
                        jbpsNm: atrzLnSrngResult[0].jbpsNm,
                        listEmpFlnm: atrzLnSrngResult[0].listEmpFlnm
                    })

                    if (!popupAtrzValue.find(item => item.empId == atrzLnSrngResult[0].empId)) {
                        setPopupAtrzValue(prevState => [
                            ...prevState,
                            {
                                approvalCode: "VTW00704",                   // 결재단계코드(심사)
                                empId: atrzLnSrngResult[0].empId,
                                empFlnm: atrzLnSrngResult[0].empFlnm,
                                jbpsNm: atrzLnSrngResult[0].jbpsNm,
                                listEmpFlnm: atrzLnSrngResult[0].listEmpFlnm
                            }
                        ])
                    }

                }
            }
        } catch (error) {
            console.log(initParam.searchType + "_error : ", error);
        }
    };

    // 휴가신청전자결재저장
    function onSaveClick() {
        let errorMsg;

        if (!insertElctrnValue.prjctId) errorMsg = "프로젝트를 선택하세요."
        else if (!insertVcatnValue.vcatnTyCd) errorMsg = "휴가유형을 선택하세요."
        else if (!insertVcatnValue.vcatnBgngYmd) errorMsg = "휴가시작기간을 선택하세요."
        else if (!insertVcatnValue.vcatnEndYmd && (insertVcatnValue.vcatnTyCd == "VTW01201" || insertVcatnValue.vcatnTyCd == "VTW01204")) errorMsg = "휴가종료기간을 선택하세요."
        else if (insertVcatnValue.vcatnTyCd == "VTW01209" && !insertVcatnValue.vcatnLeaveTyCd) errorMsg = "휴직유형을 선택하세요"
        else if (insertVcatnValue.vcatnTyCd == "VTW01209" && attachments.length < 1) errorMsg = "휴직 신청 시 첨부파일을 등록해주세요.";
        else if (!insertVcatnValue.vcatnPrvonsh && (insertVcatnValue.vcatnLeaveTyCd == "VTW05302" || insertVcatnValue.vcatnLeaveTyCd == "VTW05303")) errorMsg = "사유를 입력하세요"

        if (errorMsg) {
            handleOpen(errorMsg);
            return;
        } else {
            // 휴직
            if(insertVcatnValue.vcatnTyCd == "VTW01209") insertVcatnAtrz(insertElctrnValue);
            
            // 휴가신청
            else {
                let response = getVcatnVali();
                if (response) {
                    handleOpen(response);
                    return;
                } else {
                    insertVcatnAtrz(insertElctrnValue);
                }
            }
        }
    }

    // 휴가신청전자결재저장 정합성
    function getVcatnVali() {
        let errorMsg;
        const flagOrder = Moment(new Date()).format("YYYYMMDD") <= (Moment(new Date()).format("YYYY") + "0331") ? 1 : 2     // 회계년도기준차수
        const nowAccountDate = flagOrder == 1 ? parseInt(Moment(new Date()).format("YYYY")) - 1 + "0331" : (Moment(new Date()).format("YYYY") + "0331");            // 회계년도기준일자
        const newAccountDate = flagOrder == 1 ? parseInt(Moment(new Date()).format("YYYY")) + "0331" : parseInt(Moment(new Date()).format("YYYY")) + 1 + "0331"     // 다음회계년도기준일자
        let newVcatnList = selectVcatnInfoValue.filter(item => item.vcatnFlag == "NEW")[0];            // 신규휴가정보
        let accountVcatnList = selectVcatnInfoValue.filter(item => item.vcatnFlag == "ACCOUNT")[0];    // 회계휴가정보

        // 경조휴가 첨부파일 확인
        if(["VTW01207", "VTW01208", "VTW01209"].includes(insertVcatnValue.vcatnTyCd) && attachments.length < 1){
            errorMsg = "경조휴가 및 휴직 신청 시 첨부파일을 등록해주세요.";
        }

        // 휴가등록불가기간 신청하는 경우
        if (selectCrtrDateList.find(item => item.vcatnCntrlYmdYn == "Y" && item.crtrYmd == Moment(new Date()).format('YYYYMMDD'))) {
            errorMsg = "휴가등록불가기간입니다. 인사관리부서에 문의해주세요.";
        }

        // 휴가신청일자 정합성 확인
        if (insertVcatnValue.vcatnBgngYmd > insertVcatnValue.vcatnEndYmd) {
            errorMsg = "휴가시작일자와 휴가종료일자를 확인해주세요.";
        }

        // case_A 
        // 신규배정휴가가 존재하지 않고 회계년도휴가가 존재하는경우
        if (!newVcatnList && accountVcatnList) {
            // case_1
            // 현재회계년도 이전일자 휴가신청
            if (insertVcatnValue.vcatnBgngYmd <= nowAccountDate) {
                errorMsg = "이전회계년도 휴가는 등록하실 수 없습니다. 인사관리부서에 문의해주세요.";
            }
            // case_2
            // 현재회계년도 이후일자 휴가신청
            else if (insertVcatnValue.vcatnEndYmd > newAccountDate) {
                errorMsg = "회계년도기준 휴가사용기한을 확인해주세요";
            }
        }
        // case_B
        // 신규배정휴가가 존재하고 회계년도휴가가 존재하지 않는 경우
        else if (newVcatnList && !accountVcatnList) {
            // case_1 
            // 신규휴가일수가 부족한 경우
            if (insertVcatnValue.vcatnDeCnt > newVcatnList.newRemndrDaycnt) {
                errorMsg = "입사일기준 잔여휴가일수가 부족합니다.";
            }
            // case_2
            // 신규휴가사용기간 이외 일자 휴가신청
            else if (
                insertVcatnValue.vcatnBgngYmd < newVcatnList.altmntBgngYmd ||
                insertVcatnValue.vcatnBgngYmd > newVcatnList.altmntUseEndYmd ||
                insertVcatnValue.vcatnEndYmd < newVcatnList.altmntBgngYmd ||
                insertVcatnValue.vcatnEndYmd > newVcatnList.altmntUseEndYmd) {
                errorMsg = "입사일기준 휴가사용기한을 확인해주세요";
            }
        }
        // case_C
        // 신규배정휴가가 존재하고 회계년도휴가도 존재하는 경우
        else if (newVcatnList && accountVcatnList) {
            // case_C1
            // 현재회계년도 이후일자 휴가신청
            if (insertVcatnValue.vcatnEndYmd > newAccountDate) {
                errorMsg = "회계년도/입사일기준 휴가사용기한을 확인해주세요";
            }
            // case_C2
            // 신규휴가사용기간 이전휴가 신청
            else if (insertVcatnValue.vcatnBgngYmd < newVcatnList.altmntBgngYmd) {
                errorMsg = "입사일기준 휴가사용기한을 확인해주세요";
            }
            // case_C3
            // 휴가일자가 신규휴가사용기간에만 속할 경우
            else if (insertVcatnValue.vcatnEndYmd <= nowAccountDate) {
                // case_1
                // 신규배정휴가에서 휴가신청이 불가능한 경우
                if (newVcatnList.newRemndrDaycnt < insertVcatnValue.vcatnDeCnt) {
                    errorMsg = "입사일기준 잔여휴가일수가 부족합니다.";
                }
            }
        }
        return errorMsg;
    }

    // 휴가신청전자결재저장
    const insertVcatnAtrz = async (params) => {
        const formData = new FormData();

        let insertData = {
            ...insertVcatnValue,
            dirType: 'elec'
        };

        if (insertVcatnValue.vcatnTyCd == "VTW01209") insertData["vcatnTyCd"] = insertVcatnValue.vcatnLeaveTyCd

        formData.append("elctrnAtrzId", JSON.stringify({ elctrnAtrzId: elctrnAtrzId }));

        formData.append("elctrnTbNm", JSON.stringify({ tbNm: "ELCTRN_ATRZ" }));
        formData.append("insertElctrnValue", JSON.stringify(params));

        formData.append("vcatnTbNm", JSON.stringify({ tbNm: "VCATN_ATRZ" }));
        formData.append("insertVcatnValue", JSON.stringify(insertData));

        formData.append("atrzLnTbNm", JSON.stringify({ tbNm: "ATRZ_LN" }));
        formData.append("insertAtrzLnValue", JSON.stringify(popupAtrzValue.filter(item => item.approvalCode == "VTW00702" || item.approvalCode == "VTW00703" || item.approvalCode == "VTW00704" || item.approvalCode == "VTW00705")));

        formData.append("refrnTbNm", JSON.stringify({ tbNm: "REFRN_MAN" }));
        formData.append("insertRefrnValue", JSON.stringify(popupAtrzValue.filter(item => item.approvalCode == "VTW00706" || item.approvalCode == "VTW00707")));

        Object.values(attachments).forEach((attachment) => formData.append("attachments", attachment));

        try {
            setLoading(true);
            let axiosUrl = ["VTW05301", "VTW05302", "VTW053013"].includes(insertData.vcatnTyCd) ? "/boot/indvdlClm/insertEmpLeave" : "/boot/indvdlClm/insertVcatnAtrz";

            const response = await axios.post(axiosUrl, formData, {
                headers: { 'Content-Type': 'multipart/form-data', "Authorization": `Bearer ${localStorage.getItem("token")}` },
            });

            if (response && response.data == "성공") {
                handleOpen("저장되었습니다.");

                // 전자결재ID 채번
                elctrnAtrzId = uuid();

                // 첨부파일초기화
                if (["VTW01204", "VTW01207", "VTW01208", "VTW01209"].includes(insertVcatnValue.vcatnTyCd)) clearFiles();

                // 화면초기화
                setSearchVcatnListParam({ ...searchVcatnListParam, isSearch: true })
                setInsertElctrnValue({ ...insertElctrnValue, prjctId: null })
                selectData(searchVcatnListParam);

                setInsertVcatnValue({
                    empId: sessionEmpId,
                    flagYear: flagYear,
                    elctrnAtrzId: null,
                    emgncCttpc: null,
                    rm: null,
                    vcatnBgngYmd: "",
                    vcatnDeCnt: "",
                    vcatnEndYmd: "",
                    vcatnPrvonsh: null,
                    vcatnTyCd: "",
                    vcatnLeaveTyCd: ""
                })
            } else {
                handleOpen(response.data);
            }
        } catch (error) {
            handleOpen("실패하였습니다.")
        } finally {
            setLoading(false);
        }
    }

    // 휴가정보 저장정보 설정
    function onInsertVcatnValue(param, e) {
        // 날짜 parsing
        if (param == "vcatnBgngYmd" || param == "vcatnEndYmd") e = Moment(e).format('YYYYMMDD');

        // 휴가유형 선택
        if (param == "vcatnTyCd") {

            // 반차선택
            if (["VTW01202", "VTW01203", "VTW01205"].includes(e)) {
                setNormalAtrz();

                setInsertVcatnValue({
                    ...insertVcatnValue,
                    vcatnDeCnt: String(0.5),
                    vcatnBgngYmd: null,
                    vcatnEndYmd: null,
                    [param]: e,
                })
            }
            // 반차제외선택(연차, 공가, 경조휴가, 휴직)
            else {
                setInsertVcatnValue({
                    ...insertVcatnValue,
                    vcatnDeCnt: null,
                    vcatnBgngYmd: null,
                    vcatnEndYmd: null,
                    [param]: e,
                })

                // 공가
                if (e == "VTW01204") {
                    setNormalAtrz();

                    setPopupCondolenceVisibleValue({ type: "official", visible: true })
                }

                // 경조휴가
                else if (e == "VTW01207" || e == "VTW01208") {
                    setCondolenceAtrz();
                    setPopupCondolenceVisibleValue({ type: "condolence", visible: true })
                }

                // 휴직
                else if (e == "VTW01209") setCondolenceAtrz();

                // 연차
                else setNormalAtrz();
            }
        }

        // 휴가유형제외 선택
        else {
            // 반차선택시 휴가종료일자 설정
            if (param == "vcatnBgngYmd" && ["VTW01202", "VTW01203", "VTW01205"].includes(insertVcatnValue.vcatnTyCd)) {
                // 주말 및 공휴일 확인
                if (isSaturday(Moment(e).format("YYYY-MM-DD")) || isSunday(Moment(e).format("YYYY-MM-DD"))) {
                    handleOpen("주말입니다.")
                } else if (selectCrtrDateList.find((item => item.hldyClCd == "VTW05003" && item.crtrYmd == e))) {
                    handleOpen("공휴일입니다.")
                } else {
                    setInsertVcatnValue({ ...insertVcatnValue, vcatnEndYmd: e, [param]: e })
                }
            } else {
                setInsertVcatnValue({ ...insertVcatnValue, [param]: e })
            }
        }
    }

    // 휴가일수설정
    useEffect(() => {
        if (insertVcatnValue.vcatnBgngYmd && insertVcatnValue.vcatnEndYmd) {
            let startDate = parseInt(insertVcatnValue.vcatnBgngYmd);
            let endDate = parseInt(insertVcatnValue.vcatnEndYmd);
            let weekendDayCnt = 0;

            var startDay = new Date(Moment(String(startDate)).format("YYYY-MM-DD"));
            var endDay = new Date(Moment(String(endDate)).format("YYYY-MM-DD"));

            var diff = endDay.getTime() - startDay.getTime();
            var daydiff = diff / (1000 * 60 * 60 * 24) + 1;

            // 휴가기간선택시 
            if (insertVcatnValue.vcatnTyCd && ["VTW01201", "VTW01204", "VTW01207", "VTW01208", "VTW01209"].includes(insertVcatnValue.vcatnTyCd)) {
                for (let i = 0; i < daydiff; i++) {
                    let valiCheckDate = Moment((addDays(new Date(Moment(String(startDate)).format("YYYY-MM-DD")), i))).format("YYYY-MM-DD");

                    if (isSaturday(valiCheckDate) || isSunday(valiCheckDate)) {
                        weekendDayCnt++;
                    } else if (selectCrtrDateList.find((item => item.hldyClCd == "VTW05003" && item.crtrYmd == Moment(String(valiCheckDate)).format("YYYYMMDD")))) {
                        weekendDayCnt++;
                    }
                }
                setInsertVcatnValue({ ...insertVcatnValue, vcatnDeCnt: String(daydiff - weekendDayCnt) })
            }
        }
    }, [insertVcatnValue.vcatnBgngYmd, insertVcatnValue.vcatnEndYmd])

    // 휴가목록선택
    function onRowClick(e) {
        if(e.event.target.className === "dx-button-content" || e.event.target.className === "dx-button-text") {
            return;
        }
        navigate("/elecAtrz/ElecAtrzDetail", { state: { data: { 
            elctrnAtrzId: e.data.elctrnAtrzId, 
            gnrlAtrzTtl: e.data.gnrlAtrzTtl,
            elctrnAtrzDocNo: e.data.elctrnAtrzDocNo,
            elctrnAtrzTySeCd: e.data.elctrnAtrzTySeCd, 
            prjctId: e.data.prjctId,
            regDt: e.data.regDt
        } } })
    }

    // 버튼클릭
    function onButtonClick(e, data) {
        if (e.text == "파일") {
            setPopupAttachValue({ elctrnAtrzId: data.elctrnAtrzId, attachId: data.atchmnflId, visible: true })
        } else if (e.text == "취소") {
            setPopupVcatnAtrzCancleValue({ data: data, empId: sessionEmpId, visible: true })
        }
    }

    // 결재선버튼 callback
    const onAtrzHiding = async (aprvrEmpList) => {
        setPopupAtrzValue(aprvrEmpList);
        setPopupVisibleAtrzValue(false);
    }

    // 첨부파일변경
    const changeAttchValue = (e) => {
        setInsertVcatnValue({ ...insertVcatnValue, atchmnflId: uuid() })
        setAttachments(e.value)
    }

    // 첨부파일 화면 초기화
    const clearFiles = () => {
        let fileUploader = fileUploaderRef.current.instance;
        fileUploader.reset();
    };

    // 일반휴가 결재선설정
    function setNormalAtrz() {
        let pushData = popupAtrzValue.filter(item => (item.approvalCode != "VTW00705" && item.approvalCode != "VTW00702" && (item.empId != atrzLnAprvListValue.empId)))
        pushData.push(atrzLnAprvListValue);
        setPopupAtrzValue(pushData);
    }

    // 경조휴가, 휴직 결재선설정
    function setCondolenceAtrz() {
        let pushData = popupAtrzValue.filter(item => (item.approvalCode != "VTW00705" && item.approvalCode != "VTW00702"))
        
        if(atrzLnSnrgListValue) pushData.push(selectCondolenceAtrzReviewValue[0], selectCondolenceAtrzApprovalValue[0], atrzLnSnrgListValue );
        else if(!atrzLnSnrgListValue) pushData.push(selectCondolenceAtrzReviewValue[0], selectCondolenceAtrzApprovalValue[0]);

        setPopupAtrzValue(pushData);
    }

    return (
        <div>
            {loading && (
                <div className="loading-overlay">
                    <div style={{fontWeight: "bold", transform: "translate(0px, 0px)"}}> 요청 중입니다... </div>
                </div>
            )}
            <div className="title">휴가</div>
            <div className="title-desc">* 휴가 등록 및 현황을 조회합니다.</div>
            <div className="row" style={{ marginTop: "20px" }}>
                <div style={{display: 'flex'}}>
                    <div className="col-md-2" style={{ marginRight: "-20px" }}>
                        <SelectBox
                            placeholder="[년도]"
                            defaultValue={flagYear}
                            dataSource={getYearList(5, 1)}
                            onValueChange={(e) => {
                                setSearchVcatnListParam({ ...searchVcatnListParam, searchYear: e, isSearch: false })
                                setSelectSearchVcatnListParam({ ...selectSearchVcatnListParam, searchYear: e, isSearch: false })
                            }} 
                        />
                    </div>
                    <div>
                        <Button
                            text="검색"
                            type='default'
                            style={{ height: "48px", width: "50px", marginLeft: '30px', marginRight: '10px' }}
                            onClick={(e) => {
                                setSearchVcatnListParam({ ...searchVcatnListParam, isSearch: true })
                                setSelectSearchVcatnListParam({ ...selectSearchVcatnListParam, isSearch: true })
                            }}
                        />
                    </div>
                    <div style={{ marginTop: "10px" }}>
                        <span>※검색시 휴가신청에 작성한 내용은 삭제됩니다.</span>
                    </div>
                </div>

                <div style={mainContainerStyle}>
                    <div style={mainLeftContainerStyle}>
                        <div style={{ marginTop: "30px" }}>
                            <h5>* 휴가 정보</h5>
                        </div>
                        <div style={{ marginTop: "5px" }}>
                            <span>사용기한 내에 사용하지 않은 연차는 소멸됩니다.</span><br />
                            <span style={{ visibility: "hidden" }}>line</span>
                        </div>
                        <div style={{ marginTop: "30px" }}>
                            <Table>
                                <TableHead>
                                    <TableRow style={{ borderTop: "2px solid #CCCCCC", borderBottom: "2px solid #CCCCCC" }}>
                                        {createHeader(selectSearchVcatnListParam)}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {selectSearchVcatnListValue ? createBody(selectSearchVcatnListValue) : <></>}
                                </TableBody>
                            </Table>
                        </div>
                        <div style={{ marginTop: "30px" }}>
                            <h5>* 휴가신청 목록</h5>
                        </div>
                        <div style={{ marginTop: "10px" }}>
                            <span>1.리스트를 선택시 상세보기가 가능합니다.</span><br />
                            <span>2.결재가 진행되지 않았을 경우 내용수정이 가능합니다.</span><br />
                            <span>3.결재 취소는 결재 완료 후 가능합니다.</span>
                        </div>
                        {
                            selectVcatnListValue && selectVcatnListValue.find(item => (item.atrzDmndSttsCd != "VTW03704" && item.atrzDmndSttsCd != "VTW03705") && (item.vcatnTyCd == "VTW01204" || item.vcatnTyCd == "VTW01207" || item.vcatnTyCd == "VTW01208" || item.vcatnTyCd == "VTW01209") && !item.atchmnflId)
                                ?
                                <div style={{ marginTop: "20px", backgroundColor: "#FFCCCA", height: "50px", borderRadius: "10px", display: "flex", alignItems: "center" }}>
                                    <div style={{ fontWeight: "bold", color: "#996666", marginLeft: "20px", fontSize: "16px" }}>공가 파일 미첨부! </div>
                                    <div style={{ marginLeft: "5px" }}>아래 '첨부파일' 버튼을 통해 공가 증빙서류를 첨부해 주세요.</div>
                                </div>
                                : <></>
                        }
                        <div style={{ marginTop: "30px" }}>
                            <CustomTable
                                keyColumn={listKeyColumn}
                                columns={listTableColumns}
                                values={selectVcatnListValue}
                                wordWrap={true}
                                onRowClick={(e) => onRowClick(e)}
                                onClick={onButtonClick}
                            />
                        </div>
                    </div>
                    <div style={mainRightContainerStyle}>
                        <div style={{ marginTop: "30px" }}>
                            <h5>* 휴가신청</h5>
                        </div>
                        <div style={{ marginTop: "5px" }}>
                            <span>1.프로젝트를 입력하면 프로젝트별 기본 결재선이 자동으로 세팅됩니다.</span><br />
                            <span>2.프로젝트 재 검색시 휴가기간, 파일첨부는 다시 작성해야합니다.</span>
                        </div>
                        <div style={{ marginTop: "30px" }}>
                            {elctrnLine(popupAtrzValue)}
                        </div>
                        <div className="row" style={{ marginTop: "30px" }}>
                            {
                                (location.state && location.state.deptList.length > 1) || deptInfo.length > 1
                                    ?
                                    <>
                                        <div className="col-md-2" style={textAlign}>소속</div>
                                        <div className="col-md-10">
                                            <SelectBox
                                                defaultValue={location.state ? location.state.deptList[0].deptId : deptInfo[0].deptId}
                                                dataSource={location.state ? location.state.deptList : deptInfo}
                                                displayExpr="deptNm"
                                                valueExpr="deptId"
                                                onValueChange={(e) => { setAtrzLnAprvListParam({ ...atrzLnAprvListParam, deptId: e }) }}
                                            />
                                        </div>
                                    </>
                                    :
                                    <>
                                        <div className="col-md-2" style={textAlign}>소속</div>
                                        <div className="col-md-10">
                                            <TextBox value={sessionDeptNm} readOnly={true} />
                                        </div>
                                    </>
                            }
                        </div>
                        <div className="row" style={{ marginTop: "5px" }}>
                            <div className="col-md-2" style={textAlign}>기안자</div>
                            <div className="col-md-10">
                                <TextBox value={sessionEmpNm} readOnly={true} />
                            </div>
                        </div>
                        <div className="row" style={{ marginTop: "5px" }}>
                            <div className="col-md-2" style={textAlign}>프로젝트</div>
                            <div className="col-md-10">
                                <SelectBox
                                    dataSource={selectPrjctList}
                                    placeholder="프로젝트를 선택해주세요"
                                    valueExpr="prjctId"
                                    displayExpr="prjctNm"
                                    value={insertElctrnValue.prjctId}
                                    stylingMode="underlined"
                                    searchEnabled={true}
                                    onValueChange={(e) => {
                                        const selectedItem = selectPrjctList.find(item => item.prjctId === e);

                                        if (selectedItem) {
                                            setInsertElctrnValue({ ...insertElctrnValue, prjctId: e })
                                            selectData({ searchType: "atrzLnSrng", prjctId: e, prjctMngrEmpId: selectedItem.prjctMngrEmpId })
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        <div className="row" style={{ marginTop: "5px" }}>
                            <div className="col-md-2" style={textAlign}>휴가유형</div>
                            {
                                insertVcatnValue && insertVcatnValue.vcatnTyCd == "VTW01209"
                                ?
                                <>
                                    <div className="col-md-5">
                                        <SelectBox
                                            dataSource={selectCodeValue}
                                            placeholder="휴가유형을 선택해주세요"
                                            valueExpr="cdValue"
                                            displayExpr="cdNm"
                                            value={insertVcatnValue.vcatnTyCd}
                                            stylingMode="underlined"
                                            onValueChange={(e) => { onInsertVcatnValue("vcatnTyCd", e) }}
                                        />
                                    </div>
                                    <div className="col-md-5">
                                        <SelectBox
                                            dataSource={selectVcatnLeaveCodeValue}
                                            placeholder="휴직유형을 선택해주세요"
                                            valueExpr="cdValue"
                                            displayExpr="cdNm"
                                            value={insertVcatnValue.vcatnLeaveTyCd}
                                            stylingMode="underlined"
                                            onValueChange={(e) => { 
                                                if(e == "VTW05302") handleOpen("무급휴직의 기간은 2개월을 초과할 수 없습니다.")
                                                onInsertVcatnValue("vcatnLeaveTyCd", e)
                                            }}
                                        />
                                    </div>
                                </>
                                : 
                                <div className="col-md-10">
                                    <SelectBox
                                        dataSource={selectCodeValue}
                                        placeholder="휴가유형을 선택해주세요"
                                        valueExpr="cdValue"
                                        displayExpr="cdNm"
                                        value={insertVcatnValue.vcatnTyCd}
                                        stylingMode="underlined"
                                        onValueChange={(e) => { onInsertVcatnValue("vcatnTyCd", e) }}
                                    />
                                </div>
                            }
                        </div>
                        {
                            insertVcatnValue.vcatnTyCd != "VTW01202" && insertVcatnValue.vcatnTyCd !== "VTW01203" && insertVcatnValue.vcatnTyCd !== "VTW01205"
                                ?
                                <div className="row" style={{ marginTop: "5px" }}>
                                    <div className="col-md-2" style={textAlign}>휴가기간</div>
                                    <div className="col-md-4">
                                        <DateBox
                                            stylingMode="underlined"
                                            value={insertVcatnValue.vcatnBgngYmd}
                                            displayFormat="yyyy-MM-dd"
                                            onValueChange={(e) => { onInsertVcatnValue("vcatnBgngYmd", e) }}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <DateBox
                                            stylingMode="underlined"
                                            value={insertVcatnValue.vcatnEndYmd}
                                            displayFormat="yyyy-MM-dd"
                                            onValueChange={(e) => { onInsertVcatnValue("vcatnEndYmd", e) }}
                                        />
                                    </div>
                                    <div className="col-md-2">
                                        <TextBox
                                            onValueChange={(e) => { onInsertVcatnValue("vcatnDeCnt", e) }}
                                            value={insertVcatnValue.vcatnDeCnt != "" ? insertVcatnValue.vcatnDeCnt : ""}
                                        />
                                    </div>
                                </div>
                                :
                                <div className="row" style={{ marginTop: "5px" }}>
                                    <div className="col-md-2" style={textAlign}>휴가기간</div>
                                    <div className="col-md-4">
                                        <DateBox
                                            stylingMode="underlined"
                                            value={insertVcatnValue.vcatnBgngYmd}
                                            displayFormat="yyyy-MM-dd"
                                            onValueChange={(e) => { onInsertVcatnValue("vcatnBgngYmd", e) }}
                                        />
                                    </div>
                                    <div className="col-md-2">
                                        <TextBox
                                            value={"0.5"}
                                            onValueChange={(e) => { onInsertVcatnValue("vcatnDeCnt", 0.5) }}
                                        />
                                    </div>
                                </div>
                        }

                        <div className="row" style={{ marginTop: "5px" }}>
                            <div className="col-md-2" style={textAlign}>사유</div>
                            <div className="col-md-10">
                                <TextBox
                                    placeholder="사유"
                                    stylingMode="underlined"
                                    value={insertVcatnValue.vcatnPrvonsh}
                                    onValueChange={(e) => { onInsertVcatnValue("vcatnPrvonsh", e) }}
                                />
                            </div>
                        </div>
                        <div className="row" style={{ marginTop: "5px" }}>
                            <div className="col-md-2" style={textAlign}>비상연락망</div>
                            <div className="col-md-10">
                                <TextBox
                                    placeholder="비상연락망"
                                    stylingMode="underlined"
                                    value={insertVcatnValue.emgncCttpc}
                                    onValueChange={(e) => { onInsertVcatnValue("emgncCttpc", e) }}
                                />
                            </div>
                        </div>
                        <div className="row" style={{ marginTop: "5px" }}>
                            <div className="col-md-2" style={textAlign}>비고</div>
                            <div className="col-md-10">
                                <TextBox
                                    placeholder="비고"
                                    stylingMode="underlined"
                                    value={insertVcatnValue.rm}
                                    onValueChange={(e) => { onInsertVcatnValue("rm", e) }}
                                />
                            </div>
                        </div>
                        {
                            insertVcatnValue && (insertVcatnValue.vcatnTyCd == "VTW01204" || insertVcatnValue.vcatnTyCd == "VTW01207" || insertVcatnValue.vcatnTyCd == "VTW01208" || insertVcatnValue.vcatnTyCd == "VTW01209")
                                ?
                                <div className="row" style={{ marginTop: "5px" }}>
                                    <div className="col-md-2" style={textAlign}>첨부</div>
                                    <div className="col-md-10">
                                        <FileUploader
                                            selectButtonText="첨부파일"
                                            multiple={true}
                                            labelText=""
                                            uploadMode="useButton"
                                            onValueChanged={changeAttchValue}
                                            ref={fileUploaderRef}
                                        />
                                    </div>
                                </div>
                                : <></>
                        }
                        <div style={{ display: "inline-block", float: "right", marginTop: "25px" }}>
                            <Button style={{ height: "48px", width: "100px", marginRight: "15px" }} onClick={(e) => { setPopupVisibleAtrzValue(true) }}>결재선지정</Button>
                            <Button style={{ height: "48px", width: "60px" }} onClick={() => { handleOpen("저장하시겠습니까?", onSaveClick) }}>저장</Button>
                        </div>

                        {
                            popupAttachValue.visible == true
                                ?
                                <EmpVacationAttchList
                                    width={"500px"}
                                    height={"500px"}
                                    title={"전자결재 파일 첨부"}
                                    visible={popupAttachValue.visible}
                                    attachId={popupAttachValue.attachId}
                                    elctrnAtrzId={popupAttachValue.elctrnAtrzId}
                                    onHiding={(e) => { if(e == false) {
                                        setPopupAttachValue({ attachId: "", visible: e })
                                        setSearchVcatnListParam({ ...searchVcatnListParam, isSearch: true })
                                        selectData(searchVcatnListParam);
                                    } }}
                                />
                                : <></>
                        }

                        <ApprovalPopup
                            width={"500px"}
                            height={"500px"}
                            visible={popupAtrzVisibleValue}
                            atrzLnEmpList={popupAtrzValue}
                            onHiding={onAtrzHiding}
                        />

                        {popupVcatnAtrzCancleValue.visible == true
                            ?
                            <EmpVacationCanclePopup
                                width={"900px"}
                                height={"520px"}
                                title={"* 휴가결재 취소 요청"}
                                visible={popupVcatnAtrzCancleValue.visible}
                                dataMap={popupVcatnAtrzCancleValue.data}
                                empId={popupVcatnAtrzCancleValue.empId}
                                loading={(e) => { 
                                    setLoading(e)
                                    setSearchVcatnListParam({ ...searchVcatnListParam, isSearch: true })
                                    selectData(searchVcatnListParam);
                                }}
                                onHiding={(e) => {
                                    setPopupVcatnAtrzCancleValue({ visible: e })
                                    setSearchVcatnListParam({ ...searchVcatnListParam, isSearch: true })
                                    selectData(searchVcatnListParam);
                                }}
                            />
                            : <></>
                        }

                        {popupCondolenceVisibleValue.visible == true
                            ?
                            <EmpVacationCondolencePopup
                                width={"600px"}
                                height={popupCondolenceVisibleValue.type == "condolence" ? "940px" : "300px"}
                                visible={popupCondolenceVisibleValue.visible}
                                type={popupCondolenceVisibleValue.type}
                                onHiding={(e) => { setPopupCondolenceVisibleValue({ visible: e }) }}
                            />
                            : <></>
                        }
                    </div>
                </div>
            </div>
            <br /><br /><br /><br /><br />
        </div>
    )
}
export default EmpVacation;

/**
 * @returns 휴가정보에 표현될 테이블 헤더 영역
 */
function createHeader(selectSearchVcatnListParam) {
    const tableHeader = [];
    const headerData = [
        { value: (selectSearchVcatnListParam.isSearch == true ? selectSearchVcatnListParam.searchYear : flagYear) + "년" },
        { value: "상세" },
        { value: "부여" },
        { value: "사용" },
        { value: "잔여일수" },
        { value: "사용기한" },
    ]

    for (let i = 0; i < headerData.length; i++) {
        tableHeader.push(
            <TableCell key={"tableHeader : " + i}>
                {headerData[i].value}
            </TableCell>
        )
    }
    return tableHeader;
}


/**
 * @returns 휴가정보에 표현될 테이블 바디 영역
 */
function createBody(selectVcatnInfoValue) {
    if (selectVcatnInfoValue && selectVcatnInfoValue.length > 0) {
        const accountTableData = selectVcatnInfoValue.filter(item => item.vcatnFlag == "ACCOUNT")[0];
        const newTableData = selectVcatnInfoValue.filter(item => item.vcatnFlag == "NEW")[0];
        return (
            <>
                <TableRow>
                    <TableCell rowSpan={3}>연차</TableCell>
                    <TableCell>회계년도 기준</TableCell>
                    <TableCell>{accountTableData ? accountTableData.vcatnAltmntDaycnt : 0}일</TableCell>
                    <TableCell>{accountTableData ? accountTableData.useDaycnt : 0}일</TableCell>
                    <TableCell>{accountTableData ? accountTableData.vcatnRemndrDaycnt : 0}일</TableCell>
                    <TableCell>{accountTableData.vcatnYr}-04-01<br />~{parseInt(accountTableData.vcatnYr) + 1}-03-31</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>
                        입사일 기준<br />
                        <span style={{ color: "red", fontSize: "11px", fontWeight: "bold" }}>(입사 1년차 미만자 해당)</span>
                    </TableCell>
                    <TableCell>{newTableData ? newTableData.newVcatnAltmntDaycnt : 0}일
                    </TableCell>
                    <TableCell>{newTableData ? newTableData.newUseDaycnt : 0}일
                    </TableCell>
                    <TableCell>{newTableData ? newTableData.newRemndrDaycnt : 0}일
                    </TableCell>
                    <TableCell>
                        {
                            newTableData
                                ? Moment(newTableData.altmntBgngYmd).format('YYYY-MM-DD')
                                : ""
                        }
                        <br />
                        {
                            newTableData
                                ? "~" + Moment(newTableData.altmntUseEndYmd).format('YYYY-MM-DD')
                                : ""
                        }
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>총연차</TableCell>
                    <TableCell>
                        {
                            accountTableData && newTableData
                                ? accountTableData.vcatnAltmntDaycnt + newTableData.newVcatnAltmntDaycnt
                                : accountTableData
                                    ? accountTableData.vcatnAltmntDaycnt
                                    : newTableData
                                        ? newTableData.newVcatnAltmntDaycnt
                                        : 0
                        }일
                    </TableCell>
                    <TableCell>
                        {
                            accountTableData && newTableData
                                ? accountTableData.useDaycnt + newTableData.newUseDaycnt
                                : accountTableData
                                    ? accountTableData.useDaycnt
                                    : newTableData
                                        ? newTableData.newUseDaycnt
                                        : 0
                        }일
                    </TableCell>
                    <TableCell>
                        {
                            accountTableData && newTableData
                                ? accountTableData.vcatnRemndrDaycnt + newTableData.newRemndrDaycnt
                                : accountTableData
                                    ? accountTableData.vcatnRemndrDaycnt
                                    : newTableData
                                        ? newTableData.newRemndrDaycnt
                                        : 0
                        }일
                    </TableCell>
                    <TableCell></TableCell>
                </TableRow>
                <TableRow style={{ borderTop: "2px solid #CCCCCC", borderBottom: "2px solid #CCCCCC" }}>
                    <TableCell>공가</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell>{accountTableData ? accountTableData.pblenVcatnUseDaycnt : 0}일</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                </TableRow>
            </>
        )
    }
}

function elctrnLine(popupAtrzValue) {
    const atrzLnReviewValue = popupAtrzValue.find(item => item.approvalCode == "VTW00702")
    const atrzLnConfirmValue = popupAtrzValue.find(item => item.approvalCode == "VTW00703")
    const atrzLnSrngValue = popupAtrzValue.find(item => item.approvalCode == "VTW00704")
    const atrzLnAprvListValue = popupAtrzValue.find(item => item.approvalCode == "VTW00705")
    const atrzLnReftnListValue = popupAtrzValue.filter(item => item.approvalCode == "VTW00706")

    return (
        <>
            <Table>
                <TableBody>
                    <TableRow style={tableHeaderStyle}>
                        <TableCell rowSpan={3} style={tableLeftStyle}>결재선</TableCell>
                        <TableCell style={cellHeaderStyle}>검토</TableCell>
                        <TableCell style={cellHeaderStyle}>확인</TableCell>
                        <TableCell style={cellHeaderStyle}>심사</TableCell>
                        <TableCell style={cellHeaderStyle}>승인</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell style={cellStyle}></TableCell>
                        <TableCell style={cellStyle}></TableCell>
                        <TableCell style={cellStyle}></TableCell>
                        <TableCell style={cellStyle}></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell style={cellStyle}>
                            {
                                atrzLnReviewValue
                                    ?
                                    <div>
                                        {atrzLnReviewValue.empFlnm}
                                        <br />
                                        {atrzLnReviewValue.jbpsNm}
                                    </div>
                                    : ""
                            }
                        </TableCell>
                        <TableCell style={cellStyle}>
                            {
                                atrzLnConfirmValue
                                    ?
                                    <div>
                                        {atrzLnConfirmValue.empFlnm}
                                        <br />
                                        {atrzLnConfirmValue.jbpsNm}
                                    </div>
                                    : ""
                            }
                        </TableCell>
                        <TableCell style={cellStyle}>
                            {
                                atrzLnSrngValue
                                    ?
                                    <div>
                                        {atrzLnSrngValue.empFlnm}
                                        <br />
                                        {atrzLnSrngValue.jbpsNm}
                                    </div>
                                    : ""
                            }
                        </TableCell>
                        <TableCell style={cellStyle}>
                            {
                                atrzLnAprvListValue
                                    ?
                                    <div>
                                        {atrzLnAprvListValue.empFlnm}
                                        <br />
                                        {atrzLnAprvListValue.jbpsNm}
                                    </div>
                                    : ""
                            }
                        </TableCell>
                    </TableRow>
                    <TableRow style={tableHeaderStyle}>
                        <TableCell style={tableLeftStyle}>참조</TableCell>
                        <TableCell colSpan={4} style={cellStyle}>
                            {
                                atrzLnReftnListValue
                                    ?
                                    atrzLnReftnListValue.map((item, index) => {
                                        return (
                                            <div key={index}>
                                                {atrzLnReftnListValue[index].listEmpFlnm}
                                                <br />
                                            </div>
                                        )
                                    })
                                    : <></>
                            }
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </>
    )
}
/* ========================= mergeTable css 영역  =========================*/
const tableHeaderStyle = {
    borderBottom: "1.5px solid #CCCCCC",
    borderTop: "1.5px solid #CCCCCC"
}

const tableLeftStyle = {
    borderRight: "1.5px solid #CCCCCC",
    borderLeft: "1.5px solid #CCCCCC",
    backgroundColor: "#EEEEEE",
    width: "50px"
}

const cellHeaderStyle = {
    textAlign: "center",
    border: "1.5px solid #CCCCCC",
}

const cellStyle = {
    textAlign: "center",
    border: "1.5px solid #CCCCCC",
    fontSize: "12px",
    height: "70px",
    width: "100vw"
}

const textAlign = {
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "14px"
}

const mainContainerStyle = {
    display: "flex",
    alignItems: "flex-start",
    flexWrap: "wrap",
    justifyContent: "center",
};

const mainLeftContainerStyle = {
    width: "62%",
    minWidth: "300px",
    marginBottom: "20px",
    marginRight: "20px"
};

const mainRightContainerStyle = {
    width: "36%",
    minWidth: "300px",
    display: "flex",
    flexDirection: "column",
};