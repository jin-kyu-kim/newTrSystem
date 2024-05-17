import React, { useState, useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { TabPanel } from "devextreme-react";
import Button from "devextreme-react/button";
import Popup from "devextreme-react/popup";

import ApiRequest from "utils/ApiRequest";
import ProjectAprvDetailJson from "./ProjectAprvDetailJson.json";
import TextArea from "devextreme-react/text-area";
import { useModal } from "../../../components/unit/ModalContext";

const ProjectAprvDetail = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const prjctId = location.state.id;
    const atrzLnSn = location.state.atrzLnSn;
    const atrzSttsCd = location.state.atrzSttsCd;
    const atrzStepCd = location.state.atrzStepCd;
    const nowAtrzStepCd = location.state.nowAtrzStepCd;
    const ctrtYmd = location.state.ctrtYmd;
    const stbleEndYmd = location.state.stbleEndYmd;
    const bgtMngOdr = location.state.bgtMngOdr;
    const aprvrEmpId = location.state.aprvrEmpId;
    const ProjectAprvDetail = ProjectAprvDetailJson;
    const atrzDmndSttsCd = ProjectAprvDetail.atrzDmndSttsCd;

    const [aprvPopupVisible, setAprvPopupVisible] = useState(false);
    const [rjctPopupVisible, setRjctPopupVisible] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [opnnCn, setOpnnCn] = useState("");
    const [data, setData] = useState([]);
    const [btnVisible, setBtnVisible] = useState(false);
    const { handleOpen } = useModal();

    /** 유저 정보 */
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const userAuth = JSON.parse(localStorage.getItem("userAuth"));
    const deptInfo = JSON.parse(localStorage.getItem("deptInfo"));

    const empId = userInfo.empId;
    const deptId = deptInfo.length != 0 ? deptInfo[0].deptId : null;

    useEffect(() => {

        if(atrzSttsCd === 'VTW00801') {
            if(aprvrEmpId === empId) handleBtnVisible();
        }

        const param = {
            "queryId": ProjectAprvDetail.queryId,
            "prjctId": prjctId,
            "atrzLnSn": atrzLnSn,
        }

        const response = ApiRequest("/boot/common/queryIdSearch", param).then((response) => {
        
            setData(response);
        });

    },[]);

    const handleBtnVisible = () => {

        setBtnVisible(true);
    };


    // 날짜 생성
    const getToday = () => {
        let date = new Date();
        let year = date.getFullYear();
        let month = ("0" + (1 + date.getMonth())).slice(-2);
        let day = ("0" + date.getDate()).slice(-2);
    
        return year + month + day;
    }

    /*
        승인 
    */
    const onClickAprv = async () => {

        const isconfirm = window.confirm("요청을 승인하시겠습니까?");
        const date = getToday();
        const mdfcnDt = new Date().toISOString().split('T')[0]+' '+new Date().toTimeString().split(' ')[0];
        if(isconfirm) {
            const atrzLnDtlParam = [
                { tbNm: "PRJCT_ATRZ_LN_DTL" },
                {
                    atrzSttsCd: "VTW00802",
                    AtrzOpnnCn: opnnCn,
                    aprvYmd: date,
                    mdfcnDt: mdfcnDt,
                    mdfcnEmpId: empId,
                },
                {
                    prjctId: prjctId,
                    atrzLnSn: atrzLnSn,
                    aprvrEmpId: empId,
                    atrzStepCd: atrzStepCd
                }
            ]
            
            // const response = await ApiRequest("/boot/common/commonUpdate", atrzLnDtlParam);
            const result = await requestProcess(atrzLnDtlParam).then((value) => {
                
                if(value != null) {
                    const nowStep = value;
                    handleNowAtrzStepCd(nowStep);
                    // 마지막 결재자일 경우
                    if(nowStep === "VTW00708") { 
                        
                        // PRJCT_BGT_PRMPC 테이블 승인으로 수정
                        // ATRZ_DMND_STTS_CD -> VTW03703(승인)
                        handleBgtPrmpc("VTW03703");
    
                        // PRJCT_HIST 테이블을 승인 상태로 수정
                        handleTempPrjct("VTW03703");

                        // PRJCT_HIST 테이블 데이터 -> PRJCT
                        handlePrjctInfo();

                        // PRJCT 테이블
                        // BIZ_STTS_CD 컬럼 -> VTW00402(수행)
                        handlePrjctBizStts("VTW00402");

                    }
    
                    handleOpen("승인이 완료되었습니다.");
                    navigate("../project/ProjectAprv");
                } else {
                    handleOpen("승인이 실패하였습니다.");
                    return;
                }
            
            });
        }
    }

    /* 
        반려 
    */
    const onClickRjct = async () => {

        const isconfirm = window.confirm("요청을 반려하시겠습니까?");
        const date = getToday();

        const mdfcnDt = new Date().toISOString().split('T')[0]+' '+new Date().toTimeString().split(' ')[0];
        if(isconfirm) {
            
            const atrzLnDtlParam = [
                { tbNm: "PRJCT_ATRZ_LN_DTL" },
                { 
                    atrzSttsCd: "VTW00803",
                    rjctPrvonsh: opnnCn,
                    rjctYmd: date,
                    mdfcnDt: mdfcnDt,
                    mdfcnEmpId: empId,
                },
                {
                    prjctId: prjctId,
                    atrzLnSn: atrzLnSn,
                    atrzStepCd: atrzStepCd
                }
            ]

            const response = await ApiRequest("/boot/common/commonUpdate", atrzLnDtlParam);

            if(response > 0) {

                // 반려되면
                // PRJCT_BGT_PRMPC 테이블 반려로 수정 << todo
                // 컬럼 ATRZ_DMND_STTS_CD -> VTW03704
                handleBgtPrmpc("VTW03704");

                // PRJCT_HIST 테이블 임시저장으로 수정
                handleTempPrjct("VTW03701");

                handleOpen("반려 되었습니다.");
                navigate("../project/ProjectAprv");
            } else {
                handleOpen("반려가 실패하였습니다.");
                return;
            }
        }
    }

    const requestProcess = async (param) => {
        // const response = await ApiRequest("/boot/common/commonUpdate", param);
        const response = await ApiRequest("/boot/prjct/aprvPrjctAtrz", param)
        return response;
    
    }
    
    const handleNowAtrzStepCd = async (nowStep) => {
        const mdfcnDt = new Date().toISOString().split('T')[0]+' '+new Date().toTimeString().split(' ')[0];
        const param = [
            { tbNm: "PRJCT_ATRZ_LN" },
            { 
                nowAtrzStepCd: nowStep,
                mdfcnEmpId: empId,
                mdfcnDt: mdfcnDt,
            },
            {
                prjctId: prjctId,
                atrzLnSn: atrzLnSn, 
            }
        ]    

        await ApiRequest("/boot/common/commonUpdate", param);
    }

    /**
     * 반려 시 PRJCT_BGT_PRMPC 테이블 수정
     * atrzDmndSttsCd 결재요청상태구분코드: 임시저장(VTW03701) 으로 수정
     * 승인목록에서 조회한 bgtMngOdr 값으로 수정
     */
    const handleBgtPrmpc = async (cdValue) => {
        const mdfcnDt = new Date().toISOString().split('T')[0]+' '+new Date().toTimeString().split(' ')[0];
        const date = getToday();
    
        const param = [
            { tbNm : "PRJCT_BGT_PRMPC" },
            {
                atrzDmndSttsCd: cdValue,
                atrzCmptnYmd: date,
                mdfcnEmpId: empId,
                mdfcnDt: mdfcnDt,
            },
            {
                prjctId: prjctId,
                bgtMngOdr: bgtMngOdr,
            }
        ]
    
        await ApiRequest("/boot/common/commonUpdate", param);
    }
    
    const handlePrjctBizStts = async (cdValue) => {
        const mdfcnDt = new Date().toISOString().split('T')[0]+' '+new Date().toTimeString().split(' ')[0];

        const param = [
            { tbNm : "PRJCT" },
            {
                bizSttsCd: cdValue,
                mdfcnEmpId: empId,
                mdfcnDt: mdfcnDt,
            },
            {
                prjctId: prjctId,
            }
        ]

        await ApiRequest("/boot/common/commonUpdate", param);
    }

    /**
     * 프로젝트 최종 승인이 된 뒤 프로젝트 데이터들을 수정해줌.
     */
    const handlePrjctInfo = async () => {
        const mdfcnDt = new Date().toISOString().split('T')[0]+' '+new Date().toTimeString().split(' ')[0];
    
        const param = {
            queryId: "projectMapper.updatePrjctData",
            prjctId: prjctId,
            mdfcnEmpId: empId,
            mdfcnDt: mdfcnDt,
            state: "UPDATE"
        } 

        try {
            await ApiRequest("/boot/common/queryIdDataControl", param);
        } catch (error) {
            console.error('Error fetching data', error);
        }

    }

   /**
   * PRJCT_HIST(프로젝트이력) 테이블의 ATRZ_DMND_STTS_CD(승인요청상태코드)를 변경한다.
   * @param {"VTW03701", "VTW03702", "VTW03703"} cdValue : ATRZ_DMND_STTS_CD(승인요청상태코드)
   */
    const handleTempPrjct = async (cdValue) => {
        const mdfcnDt = new Date().toISOString().split('T')[0]+' '+new Date().toTimeString().split(' ')[0];
    
        const param = {
            queryId: "projectMapper.updateTempPrjctAtrzDmndSttsCd",
            prjctId: prjctId,
            atrzDmndSttsCd: cdValue,
            mdfcnEmpId: empId,
            mdfcnDt: mdfcnDt,
            state: "UPDATE"
        } 

        try {
            await ApiRequest("/boot/common/queryIdDataControl", param);
        } catch (error) {
            console.error('Error fetching data', error);
        }
    }

    // 탭 변경 시 인덱스 설정
    const onSelectionChanged = useCallback(
        (args) => {
            if(args.name === "selectedIndex") {
                setSelectedIndex(args.value);
            }
        },
        [selectedIndex]
    );

    // 탭 이름 렌더링
    const itemTitleRender = (a) => <span>{a.TabName}</span>;

    // 팝업 close
    const handleClose = () => {
        setAprvPopupVisible(false);
        setRjctPopupVisible(false);
    };
    
    // 승인 팝업 Open
    const onAprvPopup = () => {
        /*
        *  심사중인지 확인한다.
        *  VTW00801 : 심사중, VTW00802 : 승인, VTW00803 : 반려, VTW00804 : 보류, VTW00805 : 취소
        */
        if(atrzSttsCd !== 'VTW00801') {
            handleOpen("심사중 상태가 아닙니다.");
            return;
        }

        if(atrzStepCd !== nowAtrzStepCd) {
            handleOpen("현재 선행 결재가 완료되지 않았습니다.");
            return;
        }

        setAprvPopupVisible(true);
    }

    // 반려 팝업 Open
    const onRjctPopup = () => {

        /*
        *  심사중인지 확인한다.
        *  VTW00801 : 심사중, VTW00802 : 승인, VTW00803 : 반려, VTW00804 : 보류, VTW00805 : 취소
        */
        if(atrzSttsCd !== 'VTW00801') {
            handleOpen("심사중 상태가 아닙니다.");
            return;
        }

        if(atrzStepCd !== nowAtrzStepCd) {
            handleOpen("현재 선행 결재가 완료되지 않았습니다.");
            return;
        }

        setRjctPopupVisible(true);
    }

    // 승인/반려 의견 입력
    const onTextAreaValueChanged = useCallback((e) => {
        setOpnnCn(e.value);
    }, []);

    const DataRow = (rowInfo) => {
        
        const result = [];

        const header = [];

        const stts = [];

        const emp = [];

        const ymd = [];

        const defalultHeader = (
            <>
                <th className="table-atrzLn-td">
                    검토
                </th>
                <th className="table-atrzLn-td">
                    확인
                </th>
                <th className="table-atrzLn-td">
                    심사
                </th>
                <th className="table-atrzLn-td">
                    승인
                </th>
            </>
            
        )

        rowInfo.map((item, index) => {

            header.push(
                <th className="table-atrzLn-th">
                    {item.atrzStepNm}
                </th>
            );

            stts.push(
                <td className="table-atrzLn-td">
                    {item.atrzSttsNm}
                </td>
            );
            emp.push(
                <td className="table-atrzLn-td">
                    {item.aprvrEmpFlnm}
                </td>
            )
            if(item.atrzSttsNm === '반려') {
                ymd.push(
                    <td className="table-atrzLn-td">
                        {item.mdfcnDt}
                    </td>
                )
            } else {
                ymd.push(
                    <td className="table-atrzLn-td">
                        {item.mdfcnDt}
                    </td>
                )
            }
        })


        const test = (
            <table className="table-atrzLn">
                {/* <colgroup>
                    <col width="8%"/>
                    <col width="23%"/>
                    <col width="23%"/>
                    <col width="23%"/>
                    <col width="23%"/>
                </colgroup> */}
                <tbody>
                    <tr>
                        <th className="table-atrzLn-th" rowspan={4}>결재</th>
                        {header}
                        {/* {defalultHeader} */}
                    </tr>
                    <tr>
                        {stts}
                    </tr>
                    <tr>
                        {emp}
                    </tr>
                    <tr>
                        {ymd}
                    </tr>
                </tbody>
            </table>
        );

        return test;
    }
          
    return (
        <div>
            <div
                className="title-aprvDetail-container"
                style={{ marginTop: "20px" }}
            >
                <div className="title-aprvDetail title-aprvDetail-left" style={{ marginRight: "20px", marginBottom: "10px", marginLeft: "10%"}}>
                    <h1 style={{ fontSize: "30px" }}>프로젝트 승인 내역</h1>
                    <div>{location.state.prjctNm}</div>
                </div>
                <div className="title-aprvDetail-right">
                    <div className="table-atrzLn-wrapper">
                        {/* <DataGrid
                            id="prjctAprvLn"
                            dataSource={data}
                            dataRowRender={DataRow}
                        >
                            <Column 
                                caption=""
                            />
                            <Column 
                                caption="검증"
                                dataField=""
                            />
                            <Column 
                                caption="확인"
                                dataField="atrzSttsNm"
                            />
                             <Column 
                                caption="심사"
                            />
                            <Column 
                                caption="승인"
                            />
                        </DataGrid> */}
                        {DataRow(data)}
                    <div className="buttons" align="right" style={{ marginTop: "5px", marginBottom: "5px" }}>
                        <Button text="승인" visible={btnVisible} onClick={onAprvPopup}/>
                        <Button text="반려" visible={btnVisible} onClick={onRjctPopup}/>
                        <Button text="목록" onClick={() => navigate("../project/ProjectAprv")}/>
                    </div>
                    </div>
                </div>
            </div>
            <div
                style={{
                    marginTop: "20px",
                    marginBottom: "10px",
                    width: "100%",
                    height: "100%",
                }}
            >
                <TabPanel 
                    height="auto"
                    width="auto"
                    dataSource={ProjectAprvDetail.tab}
                    selectedIndex={selectedIndex}
                    onOptionChanged={onSelectionChanged}
                    itemTitleRender={itemTitleRender}
                    animationEnabled={true}
                    itemComponent = {
                        ({ data }) => {
                            const Component = React.lazy(() => import(`../${data.url}.js`));
                            if(data.index === selectedIndex) {
                                return (
                                    <React.Suspense fallback={<div>Loading...</div>}>
                                        <Component 
                                            prjctId={prjctId} 
                                            ctrtYmd={ctrtYmd} 
                                            stbleEndYmd={stbleEndYmd} 
                                            bgtMngOdr={bgtMngOdr} 
                                            atrzDmndSttsCd={atrzDmndSttsCd}
                                            nowAtrzStepCd={nowAtrzStepCd}
                                            atrzLnSn={atrzLnSn}
                                        />
                                    </React.Suspense>
                                );
                            }
                        }
                    }
                />
            </div>
            <Popup
                width={ProjectAprvDetail.aprvPopup.width}
                height={ProjectAprvDetail.aprvPopup.height}
                visible={aprvPopupVisible}
                onHiding={handleClose}
                showCloseButton={true}
                title={ProjectAprvDetail.aprvPopup.title}
            >
                <TextArea 
                    height="50%"
                    valueChangeEvent="change"
                    onValueChanged={onTextAreaValueChanged}
                    placeholder="승인 의견을 입력해주세요."
                />
                <br/>
                <Button text="승인" onClick={onClickAprv}/>
                <Button text="취소" onClick={handleClose}/>
            </Popup>
            <Popup
                width={ProjectAprvDetail.rjctPopup.width}
                height={ProjectAprvDetail.rjctPopup.height}
                visible={rjctPopupVisible}
                onHiding={handleClose}
                showCloseButton={true}
                title={ProjectAprvDetail.rjctPopup.title}
            >
                <TextArea 
                    height="50%"
                    valueChangeEvent="change"
                    onValueChanged={onTextAreaValueChanged}
                    placeholder="반려 사유를 입력해주세요."
                />
                <br/>
                <Button text="반려" onClick={onClickRjct}/>
                <Button text="취소" onClick={handleClose}/>
            </Popup>
        </div>
    )

}

export default ProjectAprvDetail;