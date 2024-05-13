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
import { useCookies } from 'react-cookie';
import './ElecAtrz.css'
import { useModal } from "../../components/unit/ModalContext";

const ElecAtrzDetail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const detailData = location.state.data;
    const sttsCd = location.state.sttsCd;
    const prjctId = location.state.prjctId;
    const [ prjctData, setPrjctData ] = useState({});
    const [ atrzOpnn, setAtrzOpnn ] = useState([]);
    const [ atrzOpnnVal, setAtrzOpnnVal ] = useState([]);
    const { header, keyColumn, columns, queryId, atchFlQueryId } = electAtrzJson.electAtrzDetail;
    const [ cookies ] = useCookies(["userInfo"]);
    const [ maxAtrzLnSn, setMaxAtrzLnSn ] = useState();
    const [ dtlInfo, setDtlInfo ] = useState({});
    const [ atachFileList, setAtachFileList ] = useState([]);
    const [ aplyYmd, setAplyYmd ] = useState();
    const [ odr, setOdr ] = useState();
    const [rjctPopupVisible, setRjctPopupVisible] = useState(false);
    const [opnnCn, setOpnnCn] = useState("");
    const [data, setData] = useState(location.state.data);
    const { handleOpen } = useModal();
    // console.log("location 디테일!!!", location);

    const onBtnClick = (e) => {

        switch (e.element.id) {
            case "aprv": ; aprvAtrz();
                break;
            case "rjct": ; onRjctPopup();
                break;
            case "print": //console.log("출력 클릭"); 
                break;
            case "docHist": //console.log("문서이력 클릭");
                break;
            default:
                break;
        }
    }

    useEffect(() => {
        getVacInfo();
        getPrjct();
        getAtrzLn();
        getMaxAtrzLnSn();
        getAtchFiles();
        setAplyYmdOdr();
    }, []);

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
            setMaxAtrzLnSn(response[0].maxAtrzLnSn);

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
         */
        if(isconfirm) {

            if(detailData.elctrnAtrzTySeCd === "VTW04901") {    
                /** 
                 * 휴가결재  승인처리 
                 */
                const param = {
                        empId: detailData.atrzDmndEmpId,
                        elctrnAtrzId: detailData.elctrnAtrzId,
                        vcatnTyCd: dtlInfo.vcatnTyCd,
                        vcatnBgngYmd: dtlInfo.vcatnBgngYmd,
                        vcatnEndYmd: dtlInfo.vcatnEndYmd,
                        mdfcnEmpId: cookies.userInfo.empId,
                        atrzStepCd: detailData.atrzStepCd,
                        aprvParam: [
                            { tbNm: "ATRZ_LN" },
                            { 
                                atrzSttsCd: "VTW00802",
                                aprvYmd: date,
                                mdfcnDt: mdfcnDt,
                                mdfcnEmpId: cookies.userInfo.empId,
                            },
                            { 
                                elctrnAtrzId: detailData.elctrnAtrzId,
                                aprvrEmpId: cookies.userInfo.empId,
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

            } else if (detailData.elctrnAtrzTySeCd === "VTW04915") {
                /**
                 * 휴가취소 결재 승인 처리
                 */
                const param = {
                    empId: detailData.atrzDmndEmpId,
                    elctrnAtrzId: detailData.elctrnAtrzId,
                    atrzStepCd: detailData.atrzStepCd,
                    aprvParam: [
                        { tbNm: "ATRZ_LN" },
                        { 
                            atrzSttsCd: "VTW00802",
                            aprvYmd: date,
                            mdfcnDt: mdfcnDt,
                            mdfcnEmpId: cookies.userInfo.empId,
                        },
                        { 
                            elctrnAtrzId: detailData.elctrnAtrzId,
                            aprvrEmpId: cookies.userInfo.empId,
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
                        mdfcnEmpId: cookies.userInfo.empId,
                    },
                    { 
                        elctrnAtrzId: detailData.elctrnAtrzId,
                        aprvrEmpId: cookies.userInfo.empId,
                        atrzLnSn: nowAtrzLnSn
                    }
                ]

                const response = aprvProcess(param).then((value) => {
                    if(value > 0) {
                        // 단계 올리기
                        upNowAtrzLnSn(value);
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

    const vacAprvProcess = async (param) => {
        const response = await ApiRequest("/boot/indvdlClm/updateVcatnMng", param);
        return response;
    }

    const vacCancelAprvProcess = async (param) => {
        const response = await ApiRequest("/boot/indvdlClm/approvalReInsertVcatnAtrz", param);
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
                mdfcnEmpId: cookies.userInfo.empId
            }
        } else {
            // max와 현재가 다르면 중간승인임.
            updParam = {
                nowAtrzLnSn: nowAtrzLnSn,
                mdfcnDt: new Date().toISOString().split('T')[0]+' '+new Date().toTimeString().split(' ')[0],
                mdfcnEmpId: cookies.userInfo.empId
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

                // 청구결재이면서 촤종 숭인인 경우 프로젝트 비용에 내용을 반영해준다.
                if(detailData.elctrnAtrzTySeCd === "VTW04907" && nowAtrzLnSn > maxAtrzLnSn) {
                    const clmResult = handlePrcjtCost();
                    if(clmResult < 0) {
                        handleOpen("승인 처리에 실패하였습니다.");
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

    // 팝업 close
    const handleClose = () => {
        setRjctPopupVisible(false);
    };

    // 반려 의견 입력
    const onTextAreaValueChanged = useCallback((e) => {
        setOpnnCn(e.value);
    }, []);

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
                    rjctPrvonsh: opnnCn,
                    rjctYmd: date,
                    mdfcnDt: mdfcnDt,
                    mdfcnEmpId: cookies.userInfo.empId,
                },
                { 
                    elctrnAtrzId: detailData.elctrnAtrzId,
                    aprvrEmpId: cookies.userInfo.empId,
                    atrzLnSn: nowAtrzLnSn
                }
            ]
            const result = await ApiRequest("/boot/common/commonUpdate", param);

            if(result > 0) {

                handleDmndStts(nowAtrzLnSn).then((value) => {
                    console.log(value);
                    if(value > 0) {
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
                mdfcnEmpId: cookies.userInfo.empId,
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
     * 청구결재 최종 승인 시 프로젝트 비용청구 테이블에 
     */
    const handlePrcjtCost = async () => {

        const regDt = new Date().toISOString().split('T')[0]+' '+new Date().toTimeString().split(' ')[0];
        const regEmpId = cookies.userInfo.empId;

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
     * 계약 지급인 경우 계약코드 select
     */
    useEffect(()=>{
            if(detailData.elctrnAtrzTySeCd === "VTW04914"){   //지급
                
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
    },[])

    useEffect(()=>{
        
    },[data])

    return (
        <div className="container" style={{ marginTop: "10px" }}>
            {/* {atrzOpnn.length !== 0 &&  */}  
                <ElecAtrzTitleInfo
                    atrzLnEmpList={atrzOpnn}
                    contents={header}
                    sttsCd={sttsCd}
                    formData={detailData}
                    prjctData={prjctData}
                    atrzParam={detailData}
                    onClick={onBtnClick}
                />
                {/* } */}

            {/* 휴가           VTW04901, 
                청구           VTW04907,
                외주인력 계약   VTW04908,
                외주업체 계약   VTW04909,
                재료비 계약     VTW04910,
                계약 지급품의   VTW04914
                ... TODO  그 외 
                의 경우에는 컴포넌트 렌더링 */}
            {(['VTW04901', 'VTW04907', 'VTW04908', 'VTW04909', 'VTW04910'].includes(detailData.elctrnAtrzTySeCd)) && (
                <ElecAtrzTabDetail
                    dtlInfo={dtlInfo}
                    detailData={detailData}
                    sttsCd={sttsCd}
                    prjctId={prjctId}
                    prjctData={prjctData}
                />
            )}
            {(['VTW04914'].includes(detailData.elctrnAtrzTySeCd)) && (data.ctrtElctrnAtrzId) &&(
                <ElecAtrzTabDetail
                    dtlInfo={dtlInfo}
                    detailData={data}
                    sttsCd={sttsCd}
                    prjctId={prjctId}
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
            <div style={{textAlign: 'center', marginBottom: '100px'}}>
                {sttsCd === 'VTW00801' && header.filter(item => item.id === 'aprv' || item.id === 'rjct').map((item, index) => (
                    <Button id={item.id} text={item.text} key={index} type={item.type} 
                        onClick={onBtnClick} style={{marginRight: '3px'}}/>
                ))}
                 <Button text='목록' type='normal' 
                    onClick={() => {location.state.docSeCd !=='VTW03405'
                                    ? navigate('/elecAtrz/ElecAtrz') 
                                    : navigate('/elecAtrz/ElecGiveAtrz',{state :{prjctId: prjctId, formData: location.state.formData}}) }} />
            </div>
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
                <Button text="반려" onClick={rjctAtrz}/>
                <Button text="취소" onClick={handleClose}/>
            </Popup>
        </div>
    );
}
export default ElecAtrzDetail;