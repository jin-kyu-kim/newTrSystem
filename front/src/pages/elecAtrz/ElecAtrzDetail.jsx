import { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { Button } from 'devextreme-react/button';
import Popup from "devextreme-react/popup";
import TextArea from "devextreme-react/text-area";

import ElecAtrzTitleInfo from './common/ElecAtrzTitleInfo';
import CustomTable from 'components/unit/CustomTable';
import ElecAtrzTabDetail from './ElecAtrzTabDetail';
import electAtrzJson from './ElecAtrzJson.json';
import ApiRequest from 'utils/ApiRequest';
import { useModal } from "../../components/unit/ModalContext";
import './ElecAtrz.css'
import ElecAtrzHistPopup from "./common/ElecAtrzHistPopup";

const ElecAtrzDetail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const detailInfo = location.state.data;
    const sttsCd = location.state.sttsCd;
    const refer = location.state.refer;
    const prjctId = location.state.prjctId;
    const [ detailData, setDetailData ] = useState({});
    const [ prjctData, setPrjctData ] = useState({});
    const [ atrzOpnn, setAtrzOpnn ] = useState([]);
    const [ atrzOpnnVal, setAtrzOpnnVal ] = useState([]);
    const { header, keyColumn, columns, queryId, atchFlQueryId } = electAtrzJson.electAtrzDetail;
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const [ maxAtrzLnSn, setMaxAtrzLnSn ] = useState();
    const [ dtlInfo, setDtlInfo ] = useState({});
    const [ atachFileList, setAtachFileList ] = useState([]);
    const [ aplyYmd, setAplyYmd ] = useState();
    const [ odr, setOdr ] = useState();
    const [ rjctPopupVisible, setRjctPopupVisible ] = useState(false);
    const [ aprvPopupVisible, setAprvPopupVisible ] = useState(false);
    const [ opnnCn, setOpnnCn ] = useState("");
    const [ data, setData ] = useState(location.state.data);
    const { handleOpen } = useModal();

    /**
     * 이력 팝업 관련
     */
    const [ histPopVisible, setHistPopVisible ] = useState(false);
    const [ selectedData, setSelectedData ] = useState([]);
    // const [states, setStates] = useState({});

    // useEffect(() => {
    //         console.log(localStorage)
    //         const stateKeys = ["data", "sttsCd", "prjctId"];
    //         const newStates = {};
    //         stateKeys.forEach(key => {
    //         const storedState = localStorage.getItem(key);
    //         if (storedState) {
    //           newStates[key] = JSON.parse(storedState);
    //         }
    //       });
    //       console.log(newStates.data)
    //     //   setData(newStates.data);
    //   }, [])
    

    useEffect(() => {
        const getDetailData = async () => {
            const res = await ApiRequest('/boot/common/queryIdSearch', { queryId: "elecAtrzMapper.elecAtrzDetail", elctrnAtrzId: detailInfo.elctrnAtrzId })
            if (res) setDetailData({ ...detailInfo, ...res[0] })
        }
        getDetailData();
    }, [detailInfo]);
    
    const onBtnClick = (e) => {
        switch (e.element.id) {
            case "aprv": ; onAprvPopup();
                break;
            case "rjct": ; onRjctPopup();
                break;
            case "print": //console.log("출력 클릭"); 
                break;
            case "docHist": //console.log("문서이력 클릭");
                onHistPopAppear();
                break;
            case "reAtrz": onReReq();
                break;
            case "cancel":
                // 회수 가능 여부가 Y인 경우, 
                if(detailData.recall == "Y") {

                    handleOpen("회수 하시겠습니까?",  () => elctrnAtrzRecall(detailData), true);
                } else {
                    onCancelReq();
                }

                break;
            case "update": onUpdateReq();
            break;
            case "list": 
            // navigate('/elecAtrz/ElecAtrz') ;
            toList();
                break;
            default:
                break;
        }
    }

    useEffect(() => {
        if(detailData.elctrnAtrzId){
            getVacInfo();
            getPrjct();
            getAtrzLn();
            getMaxAtrzLnSn();
            getAtchFiles();
            setAplyYmdOdr();
        }
    }, [detailData]);

    const getAtchFiles = async () => {
        try{
            const response = await ApiRequest('/boot/common/queryIdSearch', {
                queryId: atchFlQueryId, atchmnflId: detailData.atchmnflId
            });
            setAtachFileList(response);
        } catch(error) {
            console.log('error', error);
        }
    };
    const getVacInfo = async () => {
        try {
            const response = await ApiRequest('/boot/common/commonSelect', [
                { tbNm: "VCATN_ATRZ" }, { elctrnAtrzId: detailData.elctrnAtrzId }
            ]);
            setDtlInfo(response[0]);
        } catch (error) {
            console.log('error', error);
        }
    };

    const getPrjct = async () => {
        try {
            const response = await ApiRequest("/boot/common/commonSelect", [
                { tbNm: "PRJCT" }, { prjctId: prjctId? prjctId : detailData.prjctId }
            ]);
            setPrjctData(response[0]);
        } catch (error) {
            console.error(error)
        }
    };

    const getAtrzLn = async () => {
        const param = {
            queryId: queryId,
            elctrnAtrzId: detailData.elctrnAtrzId
        }
        try {
            const response = await ApiRequest("/boot/common/queryIdSearch", param);
            const opnnList = response.filter(item => item.atrzSttsCdNm !== null);

            setAtrzOpnn(response);
            setAtrzOpnnVal(opnnList);
        } catch (error) {
            console.error(error)
        }
    };

    /**
     * 최종 결재선 순번확인: 현재 결재자가 마지막 결재인지 확인하기 위함
     */
    const getMaxAtrzLnSn = async () => {
        const param = {
            queryId: "elecAtrzMapper.retrieveMaxAtrzLnSn",
            elctrnAtrzId: detailData.elctrnAtrzId
        }
        try {
            const response = await ApiRequest("/boot/common/queryIdSearch", param);
            if(response[0]) setMaxAtrzLnSn(response[0].maxAtrzLnSn);
        } catch (error) {
            console.error(error)
        }
    }

    /**
     * 날짜 생성
     * @returns yyyyMMdd
     */
    const getToday = () => {
        let date = new Date();
        let year = date.getFullYear();
        let month = ("0" + (1 + date.getMonth())).slice(-2);
        let day = ("0" + date.getDate()).slice(-2);
    
        return year + month + day;
    }

    /**
     * 승인 처리
     */
    const aprvAtrz = async () => {
        const isconfirm = window.confirm("요청을 승인하시겠습니까?");
        const date = getToday();
        const mdfcnDt = new Date().toISOString().split('T')[0]+' '+new Date().toTimeString().split(' ')[0];
        const nowAtrzLnSn = detailData.nowAtrzLnSn;

        /**
         * 휴가 결재일 경우 승인처리를 따로 해준다.
         * 휴가 결재 중 휴직 분기처리가 존재한다. 
         */
        if(isconfirm) {
            if(detailData.elctrnAtrzTySeCd === "VTW04901") {

                // 휴직 처리 분기
                if(detailData.vcatnTyCd === "VTW05301" || detailData.vcatnTyCd === "VTW05302" || detailData.vcatnTyCd === "VTW05301" ) {
                    /**
                     * 휴직 승인 처리
                     */
                    const param = {
                        empId: detailData.atrzDmndEmpId,
                        sessionEmpId: userInfo.empId,
                        elctrnAtrzId: detailData.elctrnAtrzId,
                        vcatnTyCd: dtlInfo.vcatnTyCd,
                        vcatnBgngYmd: dtlInfo.vcatnBgngYmd,
                        vcatnEndYmd: dtlInfo.vcatnEndYmd,
                        vcatnDeCnt: dtlInfo.vcatnDeCnt,
                        mdfcnEmpId: userInfo.empId,
                        atrzStepCd: detailData.atrzStepCd,
                        aprvParam: [
                            { tbNm: "ATRZ_LN" },
                            { 
                                atrzSttsCd: "VTW00802",
                                aprvYmd: date,
                                mdfcnDt: mdfcnDt,
                                mdfcnEmpId: userInfo.empId,
                                atrzOpnnCn: opnnCn,
                            },
                            { 
                                elctrnAtrzId: detailData.elctrnAtrzId,
                                aprvrEmpId: userInfo.empId,
                                atrzLnSn: nowAtrzLnSn
                            }
                        ]
                    }

                    const response = leaveAprvProcess(param).then((value) => {
                        if(value[0].atrzLnSn > 0) {
                            upNowAtrzLnSn(value[0].atrzLnSn);
                        } else {
                            handleOpen("승인 처리에 실패하였습니다.");
                            return;
                        }
                    });
                } else {
                    /** 
                     * 휴가결재  승인처리 
                    */
                   const param = {
                       empId: detailData.atrzDmndEmpId,
                       elctrnAtrzId: detailData.elctrnAtrzId,
                       vcatnTyCd: dtlInfo.vcatnTyCd,
                       vcatnBgngYmd: dtlInfo.vcatnBgngYmd,
                       vcatnEndYmd: dtlInfo.vcatnEndYmd,
                       mdfcnEmpId: userInfo.empId,
                       atrzStepCd: detailData.atrzStepCd,
                        aprvParam: [
                            { tbNm: "ATRZ_LN" },
                            { 
                                atrzSttsCd: "VTW00802",
                                aprvYmd: date,
                                mdfcnDt: mdfcnDt,
                                mdfcnEmpId: userInfo.empId,
                                atrzOpnnCn: opnnCn,
                            },
                            { 
                                elctrnAtrzId: detailData.elctrnAtrzId,
                                aprvrEmpId: userInfo.empId,
                                atrzLnSn: nowAtrzLnSn
                            }
                        ]
                    }

                    const response = vacAprvProcess(param).then((value) => {
                        if(value[0].atrzLnSn > 0) {
                            upNowAtrzLnSn(value[0].atrzLnSn);
                        } else {
                            handleOpen("승인 처리에 실패하였습니다.");
                            return;
                        }
                    });
                }
            } else if (detailData.elctrnAtrzTySeCd === "VTW04915") {
                /**
                 * 휴가취소 결재 승인 처리
                 */
                const param = {
                    empId: detailData.atrzDmndEmpId,
                    elctrnAtrzId: detailData.elctrnAtrzId,
                    atrzStepCd: detailData.atrzStepCd,
                    histElctrnAtrzId: detailData.histElctrnAtrzId,
                    mdfcnEmpId: userInfo.empId,
                    aprvParam: [
                        { tbNm: "ATRZ_LN" },
                        { 
                            atrzSttsCd: "VTW00802",
                            aprvYmd: date,
                            mdfcnDt: mdfcnDt,
                            mdfcnEmpId: userInfo.empId,
                            atrzOpnnCn: opnnCn,
                        },
                        { 
                            elctrnAtrzId: detailData.elctrnAtrzId,
                            aprvrEmpId: userInfo.empId,
                            atrzLnSn: nowAtrzLnSn
                        }
                    ]
                }

                const response = vacCancelAprvProcess(param).then((value) => {
                    if(value[0].atrzLnSn > 0) {
                        upNowAtrzLnSn(value[0].atrzLnSn);
                    } else {
                        handleOpen("승인 처리에 실패하였습니다.");
                        return;
                    }
                });
            } else {
                 /** 
                  * 휴가결재 / 휴가취소 외 승인처리 
                  */
                const param = [
                    { tbNm: "ATRZ_LN" },
                    { 
                        atrzSttsCd: "VTW00802",
                        aprvYmd: date,
                        mdfcnDt: mdfcnDt,
                        mdfcnEmpId: userInfo.empId,
                        atrzOpnnCn: opnnCn,
                    },
                    { 
                        elctrnAtrzId: detailData.elctrnAtrzId,
                        aprvrEmpId: userInfo.empId,
                        atrzLnSn: nowAtrzLnSn
                    }
                ]

                const response = aprvProcess(param).then((value) => {
                    if(value.atrzLnSn > 0) {
                        // 단계 올리기
                        upNowAtrzLnSn(value.atrzLnSn);
                    } else {
                        handleOpen("승인 처리에 실패하였습니다.");
                        return;
                    }
                });
            }
        }
    }

    /**
     * 승인하는 프로세스
     * @param {*} param 
     * @returns 
     */
    const aprvProcess = async (param) => {
        const response = await ApiRequest("/boot/elecAtrz/aprvElecAtrz", param);
        return response;
    }

    /**
     * 휴가결재 승인 프로세스
     * @param {} param 
     * @returns 
     */
    const vacAprvProcess = async (param) => {
        const response = await ApiRequest("/boot/indvdlClm/updateVcatnMng", param);
        return response;
    }

    /**
     * 휴가결재취소 승인 프로세스
     * @param {*} param 
     * @returns 
     */
    const vacCancelAprvProcess = async (param) => {
        const response = await ApiRequest("/boot/indvdlClm/approvalReInsertVcatnAtrz", param);
        return response;
    }

    /**
     * 휴직 결재 승인 프로세스
     * @param {} param 
     * @returns 
     */
    const leaveAprvProcess = async (param) => {
        const response = await ApiRequest("/boot/indvdlClm/updateEmpLeave", param);
        return response;
    }

    /**
     * 결재가 완료된 후 결재선 순번에 따라 현재 결재선 순번을 높여준다. 
     * @param {} nowAtrzLnSn : 현재 결재선 순번
     * @returns 
     */
    const upNowAtrzLnSn = async (nowAtrzLnSn) => {
        let updParam = {};
        if(nowAtrzLnSn > maxAtrzLnSn) {
            // max보다 승인이 끝난 뒤 결재선 순번이 크면 최종승인임.
            updParam = {
                atrzDmndSttsCd: "VTW03703",
                nowAtrzLnSn: maxAtrzLnSn,
                mdfcnDt: new Date().toISOString().split('T')[0]+' '+new Date().toTimeString().split(' ')[0],
                mdfcnEmpId: userInfo.empId
            }
        } else {
            // max와 현재가 다르면 중간승인임.
            updParam = {
                nowAtrzLnSn: nowAtrzLnSn,
                mdfcnDt: new Date().toISOString().split('T')[0]+' '+new Date().toTimeString().split(' ')[0],
                mdfcnEmpId: userInfo.empId
            }
        }

        const param = [
            { tbNm: "ELCTRN_ATRZ" },
            updParam,
            {
                elctrnAtrzId: detailData.elctrnAtrzId
            }
        ]
        try {
            const response = await ApiRequest("/boot/common/commonUpdate", param);
            if(response > 0) {

                // 결재 취소나 변경결재가 아닌 경우
                if(detailData.atrzHistSeCd != "VTW05405" && detailData.atrzHistSeCd != "VTW05406") {

                    // 청구결재이면서 촤종 숭인인 경우 프로젝트 비용에 내용을 반영해준다.
                    if(detailData.elctrnAtrzTySeCd === "VTW04907" && nowAtrzLnSn > maxAtrzLnSn) {
                        const clmResult = handlePrcjtCost();
                        if(clmResult < 0) {
                            handleOpen("승인 처리에 실패하였습니다.");
                        }
                    }
                }

                // 결재 취소에 대한 최종 승인인 경우, 후속 처리를 진행한다.
                if(detailData.atrzHistSeCd === "VTW05405" && nowAtrzLnSn > maxAtrzLnSn) {

                    const param = {
                        atrzHistSeCd: detailData.atrzHistSeCd,
                        histElctrnAtrzId: detailData.histElctrnAtrzId,
                        elctrnAtrzTySeCd: detailData.elctrnAtrzTySeCd
                    }

                    // 1. 이력 컬럼에 있는 전자결재에 대한 처리 -> 
                    const response = await ApiRequest("/boot/elecAtrz/updateHistElctrnAtrz", param);

                }

                // 변경결재에 대한 최종 승인인 경우, 후속 처리를 진행한다.
                if(detailData.atrzHistSeCd === "VTW05406" && nowAtrzLnSn > maxAtrzLnSn) {
                    const param = {
                        atrzHistSeCd: detailData.atrzHistSeCd,
                        histElctrnAtrzId: detailData.histElctrnAtrzId,
                        elctrnAtrzTySeCd: detailData.elctrnAtrzTySeCd
                    }

                    // 1. 이력 컬럼에 있는 전자결재에 대한 처리 -> 
                    const response = await ApiRequest("/boot/elecAtrz/updateHistElctrnAtrz", param);

                    if(detailData.elctrnAtrzTySeCd === "VTW04907") {
                        const clmResult = handlePrcjtCost();
                        if(clmResult < 0) {
                            handleOpen("승인 처리에 실패하였습니다.");
                        }
                    }
                }


                handleOpen("승인 처리되었습니다.");
                navigate('/elecAtrz/ElecAtrz');
            } else {
                handleOpen("승인 처리에 실패하였습니다.");
                return;
            }
        } catch (error) {
            console.error(error)
        }
    }
    
    const onRjctPopup = () => {
        setRjctPopupVisible(true);
    }

    const onAprvPopup = () => {
        setAprvPopupVisible(true);
    }

    // 팝업 close
    const handleClose = () => {
        setRjctPopupVisible(false);
        setAprvPopupVisible(false);
        setOpnnCn("");
    };

    // 반려 의견 입력
    const onTextAreaValueChanged = useCallback((e) => {
        setOpnnCn(e.value);
    }, []);

    /**
     * 반려 실행
     */
    const rjctAtrz = async () => {
        const isconfirm = window.confirm("요청을 반려하시겠습니까?");
        const date = getToday();
        const mdfcnDt = new Date().toISOString().split('T')[0]+' '+new Date().toTimeString().split(' ')[0];

        const nowAtrzLnSn = detailData.nowAtrzLnSn;
        if(isconfirm) {

            const param = [
                { tbNm: "ATRZ_LN" },
                { 
                    atrzSttsCd: "VTW00803",
                    atrzOpnnCn: opnnCn,
                    rjctYmd: date,
                    mdfcnDt: mdfcnDt,
                    mdfcnEmpId: userInfo.empId,
                },
                { 
                    elctrnAtrzId: detailData.elctrnAtrzId,
                    aprvrEmpId: userInfo.empId,
                    atrzLnSn: nowAtrzLnSn
                }
            ]
            const result = await ApiRequest("/boot/common/commonUpdate", param);

            if(result > 0) {

                handleDmndStts(nowAtrzLnSn).then((value) => {
                    console.log(value);
                    if(value > 0) {

                        // 취소결재를 반려한 경우 후속조치
                        if(detailData.atrzHistSeCd === "VTW05405") {
                            // HIST_ELCTRN_ATRZ_ID 의 값을 다시 결재중으로 변경
                            // HIST_ELCTRN_ATRZ_ID의 결재선을 다시 결재중으로 변경
                            
                            const param = {
                                elctrnAtrzId: detailData.histElctrnAtrzId,
                                mdfcnDt: mdfcnDt,
                                mdfcnEmpId: userInfo.empId
                            }

                            const response = rollbackElctrnAtrz(param);
                        }
                        handleOpen("반려 처리되었습니다.");
                        
                        navigate('/elecAtrz/ElecAtrz');
                    } else {
                        handleOpen("반려 처리에 실패하였습니다.");
                        return;
                    }
                });

            } else {
                handleOpen("반려 처리에 실패하였습니다.");
            }
        }
    }

    const handleDmndStts = async (nowAtrzLnSn) => {
        const date = getToday();
        const mdfcnDt = new Date().toISOString().split('T')[0]+' '+new Date().toTimeString().split(' ')[0];
        const param = [
            { tbNm: "ELCTRN_ATRZ" },
            { 
                atrzDmndSttsCd: "VTW03704",
                mdfcnDt: mdfcnDt,
                mdfcnEmpId: userInfo.empId,
            },
            { 
                elctrnAtrzId: detailData.elctrnAtrzId,
                nowAtrzLnSn: nowAtrzLnSn
            }
        ]
        const result = await ApiRequest("/boot/common/commonUpdate", param);
        return result;
    }

    /**
     * 취소결재, 변경결재 반려로 인해 관련 전자결재를 원래대로 돌려준다.
     * @param {} param 
     * @returns 
     */
    const rollbackElctrnAtrz = async (param) => {

        return await ApiRequest("/boot/elecAtrz/rollbackElctrnAtrz", param);
    }

    /**
     * 청구결재 최종 승인 시 프로젝트 비용청구 테이블에 
     */
    const handlePrcjtCost = async () => {

        const regDt = new Date().toISOString().split('T')[0]+' '+new Date().toTimeString().split(' ')[0];
        const regEmpId = userInfo.empId;

        const param = {
            aplyYm: aplyYmd,
            aplyOdr: odr,
            elctrnAtrzId: detailData.elctrnAtrzId,
            prjctId: detailData.prjctId,
            empId: detailData.atrzDmndEmpId,
            regDt: regDt,
            regEmpId: regEmpId
        }
        
        try {
            const result = await ApiRequest("/boot/elecAtrz/insertPrjctCt", param);
            return result;
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * 청구결재용 청구 연월, 차수 생성
     */
    const setAplyYmdOdr = () => {
        const today = new Date();

        let year = today.getFullYear();
        let month = today.getMonth() + 1; 
        const day = today.getDate();
        let odr;
        let nextOdr

        if (day <= 15) {
            odr = 2;
        } else {
            odr = 1;
        }
        
        if (month === 1) {
            if(day <= 15) {
                month = 12; // 1월인 경우 이전 연도 12월로 설정
                year--;
            } else {

            }
        } else {
            if(day <= 15) {
                month--; // 2월 이상인 경우 이전 월로 설정
            } 
        }
    
        // 월을 두 자리 숫자로 표현합니다.
        const monthString = (month < 10 ? '0' : '') + month;
        
        setAplyYmd(`${year}${monthString}`);
        setOdr(odr);
    }

    /**
     * 결재를 회수한다.
     */
    const elctrnAtrzRecall = async (data) => {
        /**
         * 1. 회수 가능: 결재선 1번라인이 심사중일 경우(회수가능여부 Y)
         * 2. 
         */
        const param = [
            { tbNm: "ELCTRN_ATRZ" },
            {
                atrzDmndSttsCd: "VTW03701"
            },
            {
                elctrnAtrzId: data.elctrnAtrzId
            }
        ]

        try {
            const response = await ApiRequest("/boot/common/commonUpdate", param);
        
            if(response > 0) {
                handleOpen("회수되었습니다. 임시저장 목록에서 확인가능합니다.");
                navigate("/elecAtrz/ElecAtrz");
            } else {
                handleOpen("회수에 실패하였습니다. 관리자에게 문의해주세요");
            }

        } catch (error) {
            console.error(error);
        }
    }


    /**
     * 계약 지급인 경우 계약코드 select
     */
    useEffect(()=>{
            if(['VTW04911','VTW04912','VTW04913','VTW04914'].includes(detailData.elctrnAtrzTySeCd)){   //지급
                
            const getCtrtInfo = async () => {
                    try {
                        const response = await ApiRequest('/boot/common/queryIdSearch', 
                                {queryId: "elecAtrzMapper.retrieveElctrnAtrzId"
                                ,elctrnAtrzId: detailData.elctrnAtrzId}
                        );
                        
                        if(response.length>0){
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
                getCtrtInfo();       
            };
    },[detailData])

    /**
     * 재기안: VTW05407
     */
    const onReReq = async () => {
        navigate('/elecAtrz/ElecAtrzNewReq', { state: { formData: detailData, sttsCd: "VTW05407", prjctId: detailData.prjctId } });
    }

    /**
     * 결재 취소: VTW05405
     */
    const onCancelReq = async () => {


        navigate('/elecAtrz/ElecAtrzNewReq', { state: { formData: detailData, sttsCd: "VTW05405", prjctId: detailData.prjctId, }});
    }

    /**
     * 결재 변경: VTW05406
     * @returns 
     */
    const onUpdateReq = async () => {
        navigate('/elecAtrz/ElecAtrzNewReq', { state: { formData: detailData, sttsCd: "VTW05406", prjctId: detailData.prjctId, }});
    }

    const renderButtons = () => {
        const conditions = [
          { sttsCd: 'VTW00801', ids: ['aprv', 'rjct'] },
          { sttsCd: 'VTW03702', ids: ['cancel', 'reAtrz'] },
          { sttsCd: 'VTW03703', ids: ['update', 'cancel', 'reAtrz'] },
          { sttsCd: 'VTW03704', ids: ['reAtrz'] }
        ];
        const condition = conditions.find(cond => cond.sttsCd === sttsCd && (refer === null || refer === undefined));
        const filter = condition ? header.filter(item => condition.ids.includes(item.id)) : [];
      
        return filter.map((item, index) => (
          <Button id={item.id} text={item.text} key={index} type={item.type} 
                  onClick={onBtnClick} style={{ marginRight: '3px' }} />
        ));
    };

    // 팝업 관련
    const onHistPopHiding = async () => {
        setHistPopVisible(false);
    }
    
    const onHistPopAppear = async () => {
        setHistPopVisible(true);
    }

    const toList = async () => {

        location.state.give ? navigate(-1) :
        location.state.docSeCd !=='VTW03405'
                    ? navigate('/elecAtrz/ElecAtrz')
                    : navigate('/elecAtrz/ElecGiveAtrz',{state :{prjctId: prjctId, formData: location.state.formData}})
    }

    return (
        <div className="container" style={{ marginTop: "10px" }}>
                <ElecAtrzTitleInfo
                    atrzLnEmpList={atrzOpnn}
                    contents={header}
                    sttsCd={sttsCd}
                    refer={refer}
                    formData={detailData}
                    prjctData={prjctData}
                    atrzParam={detailData}
                    onClick={onBtnClick}
                />
            {/* 휴가           VTW04901, 
                청구           VTW04907,
                외주인력 계약   VTW04908,
                외주업체 계약   VTW04909,
                재료비 계약     VTW04910,
                계약 지급품의   VTW04914
                ... TODO  그 외 
                의 경우에는 컴포넌트 렌더링 */}
            {(detailData&&['VTW04901', 'VTW04907', 'VTW04908', 'VTW04909', 'VTW04910', 'VTW04915'].includes(detailData.elctrnAtrzTySeCd)) && (
                <ElecAtrzTabDetail
                    dtlInfo={dtlInfo} 
                    detailData={detailData}
                    sttsCd={sttsCd}
                    prjctId={prjctId}
                    prjctData={prjctData}
                />
            )}
            {(detailData&&data&&['VTW04911','VTW04912','VTW04913','VTW04914'].includes(detailData.elctrnAtrzTySeCd)) && (data.ctrtElctrnAtrzId) &&(
                <ElecAtrzTabDetail
                    dtlInfo={dtlInfo}
                    detailData={data}
                    sttsCd={sttsCd}
                    prjctId={prjctId}
                    prjctData={prjctData}
                />
            )}
            <div dangerouslySetInnerHTML={{ __html: detailData.cn }} />

            <hr className='elecDtlLine' style={{marginTop: '100px'}}/>
            <span>* 첨부파일</span>
            {atachFileList.length !== 0 && atachFileList.map((file, index) => (
                <div key={index}>
                    <Button icon="save" stylingMode="text" disabled={true} />
                    <a href={`/upload/${file.strgFileNm}`} download={file.realFileNm} style={{ fontSize: '18px', color: 'blue', fontWeight: 'bold' }}>{file.realFileNm}</a>
                </div>
            ))}

            <hr className='elecDtlLine'/>
            <span style={{marginLeft: '8px'}}>결재 의견</span>
            <CustomTable
                keyColumn={keyColumn}
                columns={columns}
                values={atrzOpnnVal}
            />
            <div style={{textAlign: 'center', marginBottom: '100px', marginTop: '20px'}}>
                {renderButtons()}
                 <Button text='목록' type='normal' 
                    onClick={() => toList()} />
            </div>
            <Popup
                width={"80%"}
                height={"80%"}
                visible={aprvPopupVisible}
                onHiding={handleClose}
                showCloseButton={true}
                title={"승인 의견"}
            >
                <TextArea 
                    height="50%"
                    valueChangeEvent="change"
                    onValueChanged={onTextAreaValueChanged}
                    placeholder="승인 의견을 입력해주세요."
                />
                <br/>
                <div className="buttons" align="right" style={{ marginTop: "20px" }}>
                    <Button 
                        text="Contained"
                        type="default"
                        stylingMode="contained"
                        style={{ margin: "2px" }}  
                        onClick={aprvAtrz}
                        >
                        승인
                        </Button>
                    <Button 
                        text="Contained"
                        type="default"
                        stylingMode="contained"
                        style={{ margin: "2px" }}
                        onClick={handleClose}
                        >
                        취소
                    </Button>
                </div>
            </Popup>
            <Popup
                width={"80%"}
                height={"80%"}
                visible={rjctPopupVisible}
                onHiding={handleClose}
                showCloseButton={true}
                title={"반려 사유"}
            >
                <TextArea 
                    height="50%"
                    valueChangeEvent="change"
                    onValueChanged={onTextAreaValueChanged}
                    placeholder="반려 사유를 입력해주세요."
                />
                <br/>
                <div className="buttons" align="right" style={{ marginTop: "20px" }}>
                    <Button 
                        text="Contained"
                        type="default"
                        stylingMode="contained"
                        style={{ margin: "2px" }} 
                        onClick={rjctAtrz}
                    >
                        반려
                    </Button>
                    <Button                     
                        text="Contained"
                        type="default"
                        stylingMode="contained"
                        style={{ margin: "2px" }} onClick={handleClose}
                        >
                        취소
                    </Button>
                </div>
            </Popup>
                <ElecAtrzHistPopup
                    visible={histPopVisible}
                    onPopHiding={onHistPopHiding}
                    selectedData={detailInfo}
                    sttsCd={sttsCd}
                /> 
        </div>
    );
}
export default ElecAtrzDetail;