import React, { useState, useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { TabPanel } from "devextreme-react";
import Button from "devextreme-react/button";
import { useCookies } from "react-cookie";
import Popup from "devextreme-react/popup";

import ApiRequest from "utils/ApiRequest";
import ProjectAprvDetailJson from "./ProjectAprvDetailJson.json";
import TextArea from "devextreme-react/text-area";

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
    const [cookies, setCookie] = useCookies(["userInfo", "userAuth"]);
    const ProjectAprvDetail = ProjectAprvDetailJson;
    const atrzDmndSttsCd = ProjectAprvDetail.atrzDmndSttsCd;
  
    const [aprvPopupVisible, setAprvPopupVisible] = useState(false);
    const [rjctPopupVisible, setRjctPopupVisible] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [opnnCn, setOpnnCn] = useState("");
    const [data, setData] = useState([]);
    const [btnVisible, setBtnVisible] = useState(false);

    useEffect(() => {
        console.log(aprvrEmpId)
        console.log(cookies.userInfo.empId)

        if(atrzSttsCd === 'VTW00801') {
            if(aprvrEmpId === cookies.userInfo.empId) handleBtnVisible();
        }

        const param = {
            "queryId": ProjectAprvDetail.queryId,
            "prjctId": prjctId,
            "atrzLnSn": atrzLnSn,
        }

        const response = ApiRequest("/boot/common/queryIdSearch", param).then((response) => {
        
            setData(response);
        });
        console.log(data)

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
                    mdfcnEmpId: cookies.userInfo.empId,
                },
                {
                    prjctId: prjctId,
                    atrzLnSn: atrzLnSn,
                    aprvrEmpId: cookies.userInfo.empId,
                    atrzStepCd: atrzStepCd
                }
            ]
            
            // const response = await ApiRequest("/boot/common/commonUpdate", atrzLnDtlParam);
            const result = await requestProcess(atrzLnDtlParam).then((value) => {
                
                // if(value > 0) {
                if(value != null) {
                    // let nowStep;

                    // switch(atrzStepCd) {
                    //     case "VTW00701":
                    //         nowStep = "VTW00702";
                    //         break;
                    //     case "VTW00702":
                    //         nowStep = "VTW00703";
                    //         break;
                    //     case "VTW00703":
                    //         nowStep = "VTW00704";
                    //         break;
                    //     case "VTW00704":
                    //         nowStep = "VTW00705";
                    //         break;
                    //     case "VTW00705":
                    //         nowStep = "VTW00708";
                    //         break;
                    // }
                    const nowStep = value;
                    handleNowAtrzStepCd(nowStep);
                    // 마지막 결재자일 경우
                    if(atrzStepCd === "VTW00705") { 
                        
                        // PRJCT_BGT_PRMPC 테이블 승인으로 수정
                        // ATRZ_DMND_STTS_CD -> VTW03703(승인)
                        handleBgtPrmpc("VTW03703");
    
                        // PRJCT 테이블
                        // BIZ_STTS_CD 컬럼 -> VTW00402(수행)
                        handlePrjctBizStts("VTW00402");
                    }
    
                    alert("승인이 완료되었습니다.");
                    navigate("../project/ProjectAprv");
                } else {
                    alert("승인이 실패하였습니다.");
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
                    mdfcnEmpId: cookies.userInfo.empId,
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

                alert("반려 되었습니다.");
                navigate("../project/ProjectAprv");
            } else {
                alert("반려가 실패하였습니다.");
                return;
            }
        }
    }

    const requestProcess = async (param) => {
        // const response = await ApiRequest("/boot/common/commonUpdate", param);
        const response = await ApiRequest("/boot/prjct/aprvPrjctAtrz", param)
        console.log(response)
        return response;
    
    }
    
    const handleNowAtrzStepCd = async (nowStep) => {
        const mdfcnDt = new Date().toISOString().split('T')[0]+' '+new Date().toTimeString().split(' ')[0];
        const param = [
            { tbNm: "PRJCT_ATRZ_LN" },
            { 
                nowAtrzStepCd: nowStep,
                mdfcnEmpId: cookies.userInfo.empId,
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
            mdfcnEmpId: cookies.userInfo.empId,
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
            mdfcnEmpId: cookies.userInfo.empId,
            mdfcnDt: mdfcnDt,
          },
          {
            prjctId: prjctId,
          }
        ]
    
        await ApiRequest("/boot/common/commonUpdate", param);
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
        console.log(data);
        /*
        *  심사중인지 확인한다.
        *  VTW00801 : 심사중, VTW00802 : 승인, VTW00803 : 반려, VTW00804 : 보류, VTW00805 : 취소
        */
        if(atrzSttsCd !== 'VTW00801') {
            alert("심사중 상태가 아닙니다.");
            return;
        }

        if(atrzStepCd !== nowAtrzStepCd) {
            alert("현재 선행 결재가 완료되지 않았습니다.");
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
            alert("심사중 상태가 아닙니다.");
            return;
        }

        if(atrzStepCd !== nowAtrzStepCd) {
            alert("현재 선행 결재가 완료되지 않았습니다.");
            return;
        }

        setRjctPopupVisible(true);
    }

    // 승인/반려 의견 입력
    const onTextAreaValueChanged = useCallback((e) => {
        setOpnnCn(e.value);
    }, []);

    const DataRow = (rowInfo) => {
        // console.log(rowInfo)
        console.log(rowInfo)
        
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
                                        <Component prjctId={prjctId} ctrtYmd={ctrtYmd} stbleEndYmd={stbleEndYmd} bgtMngOdr={bgtMngOdr} atrzDmndSttsCd={atrzDmndSttsCd}/>
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