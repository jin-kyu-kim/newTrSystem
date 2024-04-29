import { useEffect, useState, useRef } from 'react';
import { useCookies } from "react-cookie";

// 날짜계산
// npm install moment
import Moment from "moment"

// DevExtrme import
import { FileUploader, SelectBox, Button, TextBox, DateBox } from "devextreme-react";
import dxFileUploader from "devextreme/ui/file_uploader";

// 테이블 import
// npm install @mui/material
// npm install @emotion/styled
import { Select, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

// 랜덤채번 import
import uuid from "react-uuid";

import { useNavigate } from "react-router-dom";

import axios from "axios";
import CustomTable from "components/unit/CustomTable";
import ApprovalPopup from "components/unit/ApprovalPopup"
import AutoCompleteProject from "components/unit/AutoCompleteProject";
import EmpVacationJson from "../indvdlClm/EmpVacationJson.json"
import EmpVacationAttchList from "../indvdlClm/EmpVacationAttchList"
import ApiRequest from "utils/ApiRequest";

/**
 * 2023.03.18(박지환)
 * [확인완료]
 * 1. 휴가 심사중 상태에서 취소버튼 클릭하면 팝업 호출 후 선택값 따라 행삭제.
 * 2. 저장완료 시 휴가정보 전자결재문서로 이동
 * 
 * [확인필요]
 * 1. 휴가 승인받고 취소버튼 클릭하면??
 * 
 * [작업필요]
 * 1. 세션받아와서 EMP_ID, DEPT_NM 등등 설정필요.
 * 2. 받아온 세션 설정해서 목록조회 시 PARAM 설정 후 사용 필요함.
 * 3. 휴가정보 INSERT시 전자결재, 휴가결재 테이블에 작업 발생함.
 *    전자결재 저장 후 휴가결재 테이블 에러 발생 시 대처방안 없음.
 *    추후 공통 SERVICEIMPL 생성 후 해당파일에서 로직처리 필요함.
 * 4. TABLE ROW MERGE 화면 개발
 * 5. inline 적용되어 있는 css 관리 필요함.
 * 6. 저장 완료 시 해당 휴가정보 전자결재문서로 이동(추후 전자결재 서식 공통화 이후에 작업)
 * 7. 저장 시 validation 처리 필요함.
 */

const { listQueryId, listKeyColumn, listTableColumns } = EmpVacationJson;

// 현재년도
const nowYear = new Date().getFullYear();

// 회계년도
const flagYear = Moment().format('YYYYMMDD') >= nowYear + "0401" ? nowYear : nowYear - 1

// 전자결재, 휴가결재 
let elctrnAtrzId = uuid();

// 전자결재 팝업 데이터
let artzListValue = [];

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
                    let test = searchResult.find((item) => item.jbttlCd == ("VTW0100" + forStartIndex));
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

    const fileUploaderRef = useRef(null);

    // 세션정보
    const [cookies, setCookie] = useCookies(["userInfo", "deptInfo"]);
    const sessionEmpId = cookies.userInfo.empId
    const sessionEmpNm = cookies.userInfo.empNm
    let sessionDeptNm = cookies.deptInfo[0].deptNm
    let jbttlCd = cookies.deptInfo[0].jbttlCd

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
        searchYear: flagYear,
        empId: sessionEmpId,
        isSearch: true
    });

    // 휴가정보조회
    useEffect(() => {
        selectData(searchVcatnInfoParam);
    }, [searchVcatnInfoParam])





    // 휴가코드조회
    const [selectCodeValue, setSelectCodeValue] = useState([]);
    const [searchCodeParam, setSearchCodeParam] = useState({
        queryId: "humanResourceMngMapper.retrieveCodeList",
        searchType: "vcatnCode",
        upCdValue: "VTW012"
    });

    // 휴가코드조회
    useEffect(() => {
        selectData(searchCodeParam);
    }, [searchCodeParam])





    // 휴가신청전자결재첨부파일정보
    const [attachments, setAttachments] = useState([]);

    // 휴가신청전자결재저장정보
    const [insertElctrnValue, setInsertElctrnValue] = useState({
        // elctrnAtrzId: elctrnAtrzId,
        atrzDmndEmpId: sessionEmpId,
        atrzDmndSttsCd: "VTW03702",     // 결재요청상태코드_ATRZ_DMND_STTS_CD(심사중)
        elctrnAtrzTySeCd: "VTW04901",   // 전자결재유형구분코드_ELCTRN_ATRZ_TY_SE_CD(휴가)
    });





    // 휴가신청휴가결재저장정보
    const [insertVcatnValue, setInsertVcatnValue] = useState({
        // elctrnAtrzId: elctrnAtrzId, 
        empId: sessionEmpId,
        flagYear: flagYear
    });





    // 첨부파일팝업 전달 첨부파일ID
    const [popupAttachValue, setPopupAttachValue] = useState({ visible: false });





    // 결재선팝업에 전달할 결재선정보
    const [popupAtrzValue, setPopupAtrzValue] = useState([]);
    const [popupAtrzVisibleValue, setPopupVisibleAtrzValue] = useState(false);





    // 전자결재 승인권자목록정보
    const [atrzLnAprvListValue, setAtrzLnAprvListValue] = useState({});
    const [atrzLnAprvListParam, setAtrzLnAprvListParam] = useState({
        queryId: "indvdlClmMapper.retrieveAtrzLnAprvListInq",
        searchType: "atrzLnAprvList",
        deptId: cookies.deptInfo[0].deptId
    });

    // 전자결재 승인권자목록정보
    useEffect(() => {
        selectData(atrzLnAprvListParam);
    }, [atrzLnAprvListParam])





    // 전자결재 참조자목록정보
    const [atrzLnReftnListValue, setAtrzLnReftnListValue] = useState();
    const [atrzLnReftnListParam, setAtrzLnReftnListParam] = useState({
        queryId: "indvdlClmMapper.retrieveElctrnAtrzRefrnInq",
        searchType: "atrzLnReftnList",
        repDeptId: "9da3f461-9c7e-cd6c-00b6-c36541b09b0d"
    });

    // 전자결재 참조자목록정보
    useEffect(() => {
        selectData(atrzLnReftnListParam);
    }, [atrzLnReftnListParam])





    // 전자결재 심사권자 결재선정보
    const [atrzLnSrngValue, setAtrzLnSrngValue] = useState({});


    // 목록 및 코드조회
    const selectData = async (initParam) => {
        try {
            if (initParam.searchType == "vcatnList" && initParam.isSearch == true) setSelectVcatnListValue(await ApiRequest("/boot/common/queryIdSearch", initParam));
            else if (initParam.searchType == "vcatnCode") setSelectCodeValue(await ApiRequest("/boot/common/queryIdSearch", initParam));
            else if (initParam.searchType == "vcatnInfo") setSelectVcatnInfoValue(await ApiRequest("/boot/common/queryIdSearch", initParam));
            else if (initParam.searchType == "atrzLnReftnList") {
                const atrzLnReftnResult = await ApiRequest("/boot/common/queryIdSearch", initParam);

                setAtrzLnReftnListValue(atrzLnReftnResult);

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
            else if (initParam.searchType == "atrzLnAprvList") {
                const atrzLnAprvListResult = await ApiRequest("/boot/common/queryIdSearch", initParam);
                if (atrzLnAprvListResult.length > 0) {
                    const AtrzLnAprvResult = await ApiRequest("/boot/common/queryIdSearch", { queryId: "indvdlClmMapper.retrieveAtrzLnAprvInq", deptId: atrzLnAprvListResult, empId: sessionEmpId });
                    if (AtrzLnAprvResult.length > 0 && AtrzLnAprvResult) {
                        const returnReslut = atrzLnAprv(jbttlCd, AtrzLnAprvResult);
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
            else if (initParam.searchType == "atrzLnSrng") {
                const atrzLnSrngResult = await ApiRequest("/boot/common/queryIdSearch", { queryId: "indvdlClmMapper.retrieveAtrzLnSrngInq", prjctMngrEmpId: initParam.prjctMngrEmpId, prjctId: initParam.prjctId });
                if (atrzLnSrngResult.length > 0) {
                    setPopupAtrzValue(popupAtrzValue.filter(item => item.approvalCode != "VTW00704"))

                    if (!atrzLnSrngResult.find(item => item.empId == popupAtrzValue.empId)) {
                        setPopupAtrzValue(prevState => [...prevState,
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
            console.log("async_error : ", error);
        }
    };


    // 휴가신청전자결재저장 별도 도메인
    const insertVcatnAtrz = async (params) => {
        const formData = new FormData();

        formData.append("elctrnAtrzId", JSON.stringify({ elctrnAtrzId: elctrnAtrzId }));

        formData.append("elctrnTbNm", JSON.stringify({ tbNm: "ELCTRN_ATRZ" }));
        formData.append("insertElctrnValue", JSON.stringify(params));

        formData.append("vcatnTbNm", JSON.stringify({ tbNm: "VCATN_ATRZ" }));
        formData.append("insertVcatnValue", JSON.stringify(insertVcatnValue));

        formData.append("atrzLnTbNm", JSON.stringify({ tbNm: "ATRZ_LN" }));
        formData.append("insertAtrzLnValue", JSON.stringify(popupAtrzValue.filter(item => item.approvalCode == "VTW00702" || item.approvalCode == "VTW00703" || item.approvalCode == "VTW00704" || item.approvalCode == "VTW00705")));

        formData.append("refrnTbNm", JSON.stringify({ tbNm: "REFRN_MAN" }));
        formData.append("insertRefrnValue", JSON.stringify(popupAtrzValue.filter(item => item.approvalCode == "VTW00706" || item.approvalCode == "VTW00707")));

        Object.values(attachments).forEach((attachment) => formData.append("attachments", attachment));

        try {
            const response = await axios.post("/boot/indvdlClm/insertVcatnAtrz", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
            });

            clearFiles();

            elctrnAtrzId = uuid();

            setSearchVcatnListParam({
                ...searchVcatnListParam,
                isSearch: true
            })
            setInsertVcatnValue({
                elctrnAtrzId: "",
                emgncCttpc: "",
                rm: "",
                vcatnBgngYmd: "",
                vcatnDeCnt: "",
                vcatnEndYmd: "",
                vcatnPrvonsh: "",
                vcatnTyCd: "",
            })
            setInsertElctrnValue({
                ...insertElctrnValue,
                prjctId: null
            })
        } catch (error) {
            console.log("error: ", error);
        }
    }

    // 휴가목록 검색조건 설정
    function onSearchVcatnParam(param, e) {
        setSearchVcatnListParam({
            ...searchVcatnListParam,
            searchYear: e,
            isSearch: false,
        })
    }

    // 검색버튼
    function onSearchClick(e) {
        setSearchVcatnListParam({
            ...searchVcatnListParam,
            isSearch: true
        })
    }

    //
    function onDeptChange(e) {
        setAtrzLnAprvListParam({
            ...atrzLnAprvListParam,
            deptId: e
        })
    }

    // 저장버튼
    function onSaveClick() {
        let errorMsg;

        if (!insertElctrnValue.prjctId) {
            errorMsg = "프로젝트를 선택하세요."
        } else if (!insertVcatnValue.vcatnTyCd) {
            errorMsg = "휴가유형을 선택하세요."
        } else if (!insertVcatnValue.vcatnBgngYmd) {
            errorMsg = "휴가시작기간을 선택하세요."
        } else if (!insertVcatnValue.vcatnEndYmd && (insertVcatnValue.vcatnTyCd == "VTW01201" || insertVcatnValue.vcatnTyCd == "VTW01204")) {
            errorMsg = "휴가종료기간을 선택하세요."
        }

        if (errorMsg) {
            alert(errorMsg);
            return;
        } else {
            const isconfirm = window.confirm("저장하시겠습니까?");
            if (isconfirm) {
                insertVcatnAtrz(insertElctrnValue);
                setAtrzLnSrngValue()
            } else {
                return;
            }
        }

    }

    // 프로젝트ID 설정
    function onValuePrjctChange(e) {
        setInsertElctrnValue({
            ...insertElctrnValue,
            prjctId: e[0].prjctId,
        })
        selectData({
            searchType: "atrzLnSrng",
            prjctId: e[0].prjctId,
            prjctMngrEmpId: e[0].prjctMngrEmpId
        })
    }

    // 휴가정보 저장정보 설정
    function onInsertVcatnValue(param, e) {
        let vcatnDeCnt = "";

        // 날짜 parsing
        if (param == "vcatnBgngYmd" || param == "vcatnEndYmd") e = Moment(e).format('YYYYMMDD');

        // 휴가일수계산
        if (param == "vcatnBgngYmd" && insertVcatnValue.vcatnEndYmd != undefined) {
            vcatnDeCnt = insertVcatnValue.vcatnEndYmd - e + 1
        } else if (param == "vcatnEndYmd" && insertVcatnValue.vcatnBgngYmd != undefined) {
            vcatnDeCnt = e - insertVcatnValue.vcatnBgngYmd + 1
        } else if (insertVcatnValue.vcatnEndYmd != undefined && insertVcatnValue.vcatnBgngYmd != undefined) {
            vcatnDeCnt = insertVcatnValue.vcatnEndYmd - insertVcatnValue.vcatnBgngYmd + 1
        }

        if (param == "vcatnTyCd") {
            if ((e == "VTW01202" || e == "VTW01203" || e == "VTW01205" || e == "VTW01206")) {
                setInsertVcatnValue({
                    ...insertVcatnValue,
                    vcatnDeCnt: 0.5,
                    [param]: e,
                })
            } else {
                setInsertVcatnValue({
                    ...insertVcatnValue,
                    vcatnDeCnt: null,
                    vcatnBgngYmd: null,
                    vcatnEndYmd: null,
                    [param]: e,
                })
            }
        } else {
            if (
                param == "vcatnBgngYmd" &&
                (insertVcatnValue.vcatnTyCd == "VTW01202" ||
                    insertVcatnValue.vcatnTyCd == "VTW01203" ||
                    insertVcatnValue.vcatnTyCd == "VTW01205" ||
                    insertVcatnValue.vcatnTyCd == "VTW01206")) {
                setInsertVcatnValue({
                    ...insertVcatnValue,
                    vcatnEndYmd: e,
                    [param]: e,
                })
            } else {
                setInsertVcatnValue({
                    ...insertVcatnValue,
                    vcatnDeCnt: vcatnDeCnt,
                    [param]: e,
                })
            }
        }
    }

    // 휴가목록 선택
    function onRowClick(e) {
        navigate("/elecAtrz/ElecAtrzDetail", { state: { data: { elctrnAtrzId: e.data.elctrnAtrzId, elctrnAtrzTySeCd: "VTW04901" } } })
    }

    // 테이블버튼클릭
    function onButtonClick(e, data) {
        if (e.text == "파일") {
            setPopupAttachValue({
                attachId: data.atchmnflId,
                visible: true,
            })
        } else if (e.text == "휴가 취소요청") {
            alert("휴가 취소요청 팝업 호출");
        }
    }

    // 결재선버튼클릭
    function onAtrzClick(e) {
        setPopupVisibleAtrzValue(true);
    }

    // 결재선버튼 callback
    const onAtrzHiding = async (aprvrEmpList) => {
        setPopupAtrzValue(aprvrEmpList);
        setPopupVisibleAtrzValue(false);
    }

    // 첨부파일버튼 callback
    function onAttchHiding(e) {
        setPopupAttachValue({
            attachId: "",
            visible: e
        })
    }

    // 첨부파일
    const changeAttchValue = (e) => {
        setInsertVcatnValue({
            ...insertVcatnValue,
            atchmnflId: uuid()
        })
        setAttachments(e.value)
    }

    // 첨부파일 화면 초기화
    const clearFiles = () => {
        let fileUploader = fileUploaderRef.current.instance; 
        fileUploader.reset();
    };

    return (
        <div className="" style={{ marginLeft: "5%", marginRight: "5%" }}>
            <div className="mx-auto" style={{ marginTop: "20px", marginBottom: "10px" }}>
                <h1 style={{ fontSize: "30px" }}>휴가</h1>
            </div>
            <div className="mx-auto" style={{ marginBottom: "10px" }}>
                <h5>* 휴가 등록 및 현황을 조회합니다.</h5>
            </div>
            <div className="row" style={{ marginTop: "20px" }}>
                <div className="col-md-2" style={{ marginRight: "-20px" }}>
                    <SelectBox
                        placeholder="[년도]"
                        defaultValue={flagYear}
                        dataSource={getYearList(10, 1)}
                        onValueChange={(e) => { onSearchVcatnParam("vcatnYr", e) }} />
                </div>
                <div className="col-md-1">
                    <Button
                        text="검색"
                        onClick={onSearchClick}
                        style={{ height: "48px", width: "50px" }}
                    />
                </div>
                <div style={{ marginTop: "10px" }}>
                    <span>※검색시 휴가신청에 작성한 내용은 삭제됩니다.</span>
                </div>

                <div style={{ display: "flex", marginTop: "30px" }}>
                    <div style={{ width: "65%", marginRight: "25px" }}>
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
                                        {createHeader()}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {createBody(selectVcatnInfoValue)}
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
                            !true
                                ?
                                <div style={{ marginTop: "20px", backgroundColor: "#FFCCCA", borderRadius: "10px" }}>
                                    <span style={{ fontWeight: "bold", color: "#996666", marginLeft: "20px" }}>공가 파일 미첨부! </span>
                                    <span>아래 '파일첨부' 버튼을 통해 공가 증빙서류를 첨부해 주세요.</span>
                                </div>
                                :
                                <></>
                        }
                        <div style={{ marginTop: "30px" }}>
                            <CustomTable
                                keyColumn={listKeyColumn}
                                columns={listTableColumns}
                                values={selectVcatnListValue}
                                onRowDblClick={onRowClick}
                                onClick={onButtonClick}
                            />
                        </div>
                    </div>
                    <div style={{ width: "35%" }}>
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
                                cookies.deptInfo.length > 1
                                    ?
                                    <>
                                        <div className="col-md-2" style={textAlign}>소속</div>
                                        <div className="col-md-10">
                                            <SelectBox
                                                defaultValue={cookies.deptInfo[0].deptId}
                                                dataSource={cookies.deptInfo}
                                                displayExpr="deptNm"
                                                valueExpr="deptId"
                                                onValueChange={onDeptChange}
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
                                <AutoCompleteProject
                                    placeholderText="프로젝트를 선택해주세요"
                                    // value={insertElctrnValue[1].prjctId}
                                    onValueChange={onValuePrjctChange}
                                    sttsBoolean={true}
                                />
                            </div>
                        </div>
                        <div className="row" style={{ marginTop: "5px" }}>
                            <div className="col-md-2" style={textAlign}>휴가유형</div>
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
                        </div>

                        {
                            insertVcatnValue.vcatnTyCd != "VTW01202" && insertVcatnValue.vcatnTyCd !== "VTW01203" && insertVcatnValue.vcatnTyCd !== "VTW01205" && insertVcatnValue.vcatnTyCd !== "VTW01206"
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
                        <div style={{ display: "inline-block", float: "right", marginTop: "25px" }}>
                            <Button style={{ height: "48px", width: "100px", marginRight: "15px" }} onClick={onAtrzClick}>결재선지정</Button>
                            <Button style={{ height: "48px", width: "60px" }} onClick={onSaveClick}>저장</Button>
                        </div>

                        <EmpVacationAttchList
                            width={"500px"}
                            height={"500px"}
                            visible={popupAttachValue.visible}
                            attachId={popupAttachValue.attachId}
                            title={"전자결재 파일 첨부"}
                            onHiding={onAttchHiding}
                        />

                        <ApprovalPopup
                            width={"500px"}
                            height={"500px"}
                            visible={popupAtrzVisibleValue}
                            atrzLnEmpList={popupAtrzValue}
                            onHiding={onAtrzHiding}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EmpVacation;






/* ========================= 화면 레이아웃 영역  =========================*/



/**
 * @returns 휴가정보에 표현될 테이블 헤더 영역
 */
function createHeader() {
    const tableHeader = [];
    const headerData = [
        { value: flagYear + "년" },
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
    const tableBody = [];
    const tableData = selectVcatnInfoValue[0];

    if (selectVcatnInfoValue.length > 0) {
        tableBody.push(
            <>
                <TableRow>
                    <TableCell rowSpan={3}>연차</TableCell>
                    <TableCell>회계년도 기준</TableCell>
                    <TableCell>{tableData.vcatnAltmntDaycnt}일</TableCell>
                    <TableCell>{tableData.useDaycnt}일</TableCell>
                    <TableCell>{tableData.vcatnRemndrDaycnt}일</TableCell>
                    <TableCell>{flagYear}-04-01<br />~{flagYear + 1}-03-31</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>
                        입사일 기준<br />
                        <span style={{ color: "red", fontSize: "11px", fontWeight: "bold" }}>(입사 1년차 미만자 해당)</span>
                    </TableCell>
                    <TableCell>
                        {
                            tableData.newVcatnAltmntDaycnt != "" && tableData.newVcatnAltmntDaycnt != undefined
                                ? tableData.newVcatnAltmntDaycnt
                                : 0
                        }일
                    </TableCell>
                    <TableCell>
                        {
                            tableData.newUseDaycnt != "" && tableData.newUseDaycnt != undefined
                                ? tableData.newUseDaycnt
                                : 0
                        }일
                    </TableCell>
                    <TableCell>
                        {
                            tableData.newRemndrDaycnt != "" && tableData.newRemndrDaycnt != undefined
                                ? tableData.newRemndrDaycnt
                                : 0
                        }일
                    </TableCell>
                    <TableCell>
                        {
                            tableData.altmntBgngYmd != "" && tableData.altmntUseEndYmd != "" && tableData.altmntBgngYmd != null && tableData.altmntUseEndYmd != null
                                ? Moment(tableData.altmntBgngYmd).format('YYYY-MM-DD')
                                : ""
                        }
                        <br />
                        {
                            tableData.altmntBgngYmd != "" && tableData.altmntUseEndYmd != "" && tableData.altmntBgngYmd != null && tableData.altmntUseEndYmd != null
                                ? "~" + Moment(tableData.altmntUseEndYmd).format('YYYY-MM-DD')
                                : ""
                        }
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>총연차</TableCell>
                    <TableCell>{tableData.vcatnAltmntDaycnt + tableData.newVcatnAltmntDaycnt}일</TableCell>
                    <TableCell>{tableData.useDaycnt + tableData.newUseDaycnt}일</TableCell>
                    <TableCell>{tableData.vcatnRemndrDaycnt + tableData.newRemndrDaycnt}일</TableCell>
                    <TableCell>{flagYear}-04-01<br />~{flagYear + 1}-03-31</TableCell>
                </TableRow>
                <TableRow style={{ borderTop: "2px solid #CCCCCC", borderBottom: "2px solid #CCCCCC" }}>
                    <TableCell>공가</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>{tableData.pblenVcatnUseDaycnt}일</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                </TableRow>
            </>
        )
    }

    return tableBody;
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
                                    atrzLnSrngValue.empId == atrzLnAprvListValue.empId
                                        ?
                                        <></>
                                        :
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
                                atrzLnSrngValue
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
                                atrzLnSrngValue
                                    ?
                                    atrzLnReftnListValue.map((item, index) => {
                                        return (
                                            <>
                                                {atrzLnReftnListValue[index].listEmpFlnm}
                                                <br />
                                            </>
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

/* ========================= 화면 레이아웃 영역  =========================*/

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
