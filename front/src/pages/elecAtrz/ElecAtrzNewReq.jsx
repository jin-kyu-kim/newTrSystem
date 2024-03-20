import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Button } from "devextreme-react/button"; 
import HtmlEditBox from "components/unit/HtmlEditBox";

const ElecAtrzNewReq = () => {

    const location = useLocation();
    const prjctId = location.state.prjctId;
    
    const navigate = useNavigate();

    /**
     * 결재요청 버튼 클릭시 전자결재 요청 함수 실행
     */
    const handleElecAtrz = async () => {
        console.log("전자결재 요청");
    }

    /**
     * 결재선 지정 버튼 클릭시 결재선 지정 팝업 호출
     */
    const onAtrzLnPopup = async () => {
        console.log("결재선 지정 팝업 호출");
    }

    /**
     * 임시저장 버튼 클릭시 임시저장 함수 실행
     */
    const saveTemp = async () => {
        console.log("임시저장");
    }

    /**
     * 목록 버튼 클릭시 전자결재 서식 목록으로 이동
     */
    const toAtrzNewReq = async () => {
        navigate("../elecAtrz/elecAtrzForm", {state: {prjctId: prjctId}});
    }

    const test = "<p><span style=\"color: rgb(68, 68, 68); background-color: rgb(255, 255, 255); font-size: 14px; font-family: &quot;Open Sans&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;\">1. 프로젝트 투입 인력의 인사 관련 처리 지원 및 인턴 수배 등의 요청에 대한 품의 양식입니다.</span></p><p><span style=\"color: rgb(68, 68, 68); background-color: rgb(255, 255, 255); font-size: 14px; font-family: &quot;Open Sans&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;\">2. 결재선은 PM 또는 팀리더 - [심사자 : 팀장 &gt; 승인자 : 대표이사], 팀장 - [승인자 : 대표이사] 로 지정합니다.</span></p><p><span style=\"color: rgb(68, 68, 68); background-color: rgb(255, 255, 255); font-size: 14px; font-family: &quot;Open Sans&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;\">3. 참조자는 CSC 센터장, 인사담장자로 지정합니다. </span></p><p><span style=\"color: rgb(68, 68, 68); background-color: rgb(255, 255, 255); font-size: 14px; font-family: &quot;Open Sans&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;\">4. 검토자, 확인자는 지정하지 않습니다.</span></p><p><br></p>"

    return (
        <>
            <div className="container" style={{marginTop:"10px"}}>
                <div style={{display:"flex", justifyContent:"flex-start"}}>
                    <div style={{float: "left", marginRight:"auto"}}>로고</div>
                    <div style={{display: "inline-block"}}>
                        <Button text="결재요청" onClick={handleElecAtrz}/>
                        <Button text="결재선지정" onClick={onAtrzLnPopup}/>
                        <Button text="임시저장" onClick={saveTemp}/>
                        <Button text="목록" onClick={toAtrzNewReq}/>
                    </div>
                </div>
                <div style={{textAlign:"center"}}>선택한 기안문서의 명칭</div>
                <div style={{display:"flex", justifyContent:"flex-start"}}>
                    <div style={{float: "left", marginRight:"auto"}}>
                        <table>
                            <tr>
                                <td>문서번호</td>
                                <td> : </td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>프로젝트</td>
                                <td> : </td>
                                <td>프로젝트명</td>
                            </tr>
                            <tr>
                                <td>기안자</td>
                                <td> : </td>
                                <td>부서 명 / 로그인한 사용자 명</td>
                            </tr>
                            <tr>
                                <td>기안일자</td>
                                <td> : </td>
                                <td></td>
                            </tr>
                        </table>
                    </div>
                    <div style={{display: "inline-block"}}>
                    <table className="table-atrzLn">
                            <tbody>
                                <tr>
                                    <th className="table-atrzLn-th" rowspan={4}>결재</th>
                                    <th className="table-atrzLn-th">검토</th>
                                    <th className="table-atrzLn-th">확인</th>
                                    <th className="table-atrzLn-th">심사</th>
                                    <th className="table-atrzLn-th">결재</th>
                                </tr>
                                <tr>
                                    <td className="table-atrzLn-td"></td>
                                    <td className="table-atrzLn-td"></td>
                                    <td className="table-atrzLn-td"></td>
                                    <td className="table-atrzLn-td"></td>
                                </tr>
                                <tr>
                                    <td className="table-atrzLn-td"></td>
                                    <td className="table-atrzLn-td"></td>
                                    <td className="table-atrzLn-td"></td>
                                    <td className="table-atrzLn-td"></td>
                                </tr>
                                <tr>
                                    <td className="table-atrzLn-td"></td>
                                    <td className="table-atrzLn-td"></td>
                                    <td className="table-atrzLn-td"></td>
                                    <td className="table-atrzLn-td"></td>
                                </tr>
                                <tr>
                                    <th className="table-atrzLn-th" rowspan={4}>합의</th>
                                    <th className="table-atrzLn-td" colspan={4}></th>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div style={{marginTop:"20px"}}>
                    <table>
                        <tr>
                            <td>참조</td>
                            <td> : </td>
                        <td>
                            CSC 김형균 전무;   경영지원팀 이진원 이사보;   경영지원팀 안주리 차장;   경영지원팀 안수민 차장;  부서 이름 직위;
                        </td>
                        </tr>
                        <tr>
                            <td>제목</td>
                            <td> : </td>
                            <td>텍스트 박스</td>
                        </tr>
                    </table>
                </div>
                <hr/>
                <div dangerouslySetInnerHTML={{ __html: test }} />
                {/* <HtmlEditBox 
                /> */}
            </div>
        </>
    );


}

export default ElecAtrzNewReq;