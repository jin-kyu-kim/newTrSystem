import React, { useState, useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { TabPanel } from "devextreme-react";
import Button from "devextreme-react/button";
import { useCookies } from "react-cookie";

import ApiRequest from "utils/ApiRequest";
import ProjectAprvDetailJson from "./ProjectAprvDetailJson.json";
import LinkButton from "components/unit/LinkButton";
import CustomPopup from "../../../components/unit/CustomPopup";
import TextArea from "devextreme-react/text-area";

const ProjectAprvDetail = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const prjctId = location.state.id;
    const atrzLnSn = location.state.atrzLnSn;
    const atrzSttsCd = location.state.atrzSttsCd;
    const [cookies, setCookie] = useCookies(["userInfo", "userAuth"]);
    const ProjectAprvDetail = ProjectAprvDetailJson;
  
    const [aprvPopupVisible, setAprvPopupVisible] = useState(false);
    const [rjctPopupVisible, setRjctPopupVisible] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [atrzOpnnCn, setAtrzOpnnCn] = useState("");
    const [rjctPrvonsh, setRjctPrvonsh] = useState("");
    const [opnnCn, setOpnnCn] = useState("");

    useEffect(() => {
        /**
         * 39	VTW007	결재단계코드			VTW00701	기안
            40	VTW007	결재단계코드			VTW00702	검토
            41	VTW007	결재단계코드			VTW00703	확인
            42	VTW007	결재단계코드			VTW00704	심사
            43	VTW007	결재단계코드			VTW00705	승인
         */
        // 현재 결재선 단계와 로그인한 사용자의 조회중인 프로젝트 승인단계가 같은지 확인 먼저 하기. 
        // column 추가된 다음 진행  하기
    }, [])  

    /**
     * 현재 프로젝트 승인의 단계와 지금 로그인한 사용자의 결재선 승인 단계가 일치하는지 먼저 확인한다.
     * 최종 승인일 경우 
     * 
     * @returns 
     */

/**
 *   const result = AtrzDate(atrzLnSn).then((value) => {
        order = JSON.parse(JSON.stringify(value));
        order.reverse();
        AtrzInfoData(order[0].atrzLnSn);
    });
 * @returns 
 */

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
                }
            ]
            // const response = await ApiRequest("/boot/common/commonUpdate", atrzLnParam);
            
            const result = await onRequestProcess(atrzLnDtlParam).then((value) => {
                return value;
            });

            if(result > 0) {

                /**
                 * prjct 테이블 update 실행
                 * 군데 굳이 이렇게 해야하나?
                 */


                alert("승인요청이 완료되었습니다.");
                navigate("../project/ProjectAprv");
            } else {
                alert("승인요청이 실패하였습니다.");
                return;
            }
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
                    aprvrEmpId: cookies.userInfo.empId,
                }
            ]

            const response = await ApiRequest("/boot/common/commonUpdate", atrzLnDtlParam);

            if(response > 0) {
                alert("반려 되었습니다.");
                navigate("../project/ProjectAprv");
            } else {
                alert("반려가 실패하였습니다.");
                return;
            }
        }
    }

    const onRequestProcess = async (param) => {

        console.log(param);
        const response = await ApiRequest("/boot/common/commonUpdate", param);
        return response;

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
            alert("심사중 상태가 아닙니다.");
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

        setRjctPopupVisible(true);
    }

    // 승인/반려 의견 입력
    const onTextAreaValueChanged = useCallback((e) => {
        setOpnnCn(e.value);
    }, []);
          
    return (
        <div>
            <div
                className="title p-1"
                style={{ marginTop: "20px", marginBottom: "10px" }}
            >
                <div style={{ marginRight: "20px", marginBottom: "10px" }}>
                    <h1 style={{ fontSize: "30px" }}>프로젝트 승인 내역</h1>
                    <div>{location.state.prjctNm}</div>
                </div>
            </div>
            <div className="buttons" align="right" style={{ margin: "20px" }}>
                <Button text="승인" onClick={onAprvPopup}/>
                <Button text="반려" onClick={onRjctPopup}/>
                <LinkButton location={-1} name={"목록"} type={"normal"} stylingMode={"outline"}/>
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
                            return (
                                <React.Suspense fallback={<div>Loading...</div>}>
                                    <Component prjctId={prjctId} atrzLnSn={atrzLnSn}/>
                                </React.Suspense>
                            );
                        }
                    }
                />
            </div>
            <CustomPopup props={ProjectAprvDetail.aprvPopup} visible={aprvPopupVisible} handleClose={handleClose}>
                <TextArea 
                height="50%"
                valueChangeEvent="change"
                onValueChanged={onTextAreaValueChanged}
                placeholder="승인 의견을 입력해주세요."
                />
                <br/>
                <Button text="승인" onClick={onClickAprv}/>
                <Button text="취소" onClick={handleClose}/>
            </CustomPopup>
            <CustomPopup props={ProjectAprvDetail.aprvPopup} visible={rjctPopupVisible} handleClose={handleClose}>
                <TextArea 
                height="50%"
                valueChangeEvent="change"
                onValueChanged={onTextAreaValueChanged}
                placeholder="반려 사유를 입력해주세요."
                />
                <br/>
                <Button text="반려" onClick={onClickRjct}/>
                <Button text="취소" onClick={handleClose}/>
            </CustomPopup>
        </div>
    )

}

export default ProjectAprvDetail;