import React from "react"
import { useCookies } from "react-cookie";
import { TextBox } from "devextreme-react/text-box";


const ElecAtrzTitleInfo = ({formData, prjctData, onHandleAtrzTitle, atrzParam}) => {

    const [cookies] = useCookies(["userInfo", "userAuth"]);
    return (
        <>
            <h4 style={{textAlign:"center"}}>{formData.gnrlAtrzTtl}</h4>
            <div style={{display:"flex", justifyContent:"flex-start", marginTop:"20px"}}>
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
                            <td>[{prjctData.prjctCdIdntfr}] {prjctData.prjctNm}</td>
                        </tr>
                        <tr>
                            <td>기안자</td>
                            <td> : </td>
                            <td>부서 명 / {cookies.userInfo.empNm}</td>
                        </tr>
                        <tr>
                            <td>기안일자</td>
                            <td> : </td>
                            <td></td>
                        </tr>
                    </table>
                </div>
                {/* 결재선 컴포넌트화 예정 */}
                <div style={{display: "inline-block"}}>
                    <table className="table-atrzLn">
                        <tbody>
                            <tr>
                                <th className="table-atrzLn-th" rowSpan={4}>결재</th>
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
                                <th className="table-atrzLn-th" rowSpan={4}>합의</th>
                                <th className="table-atrzLn-td" colSpan={4}></th>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="elecAtrzNewReq-title" style={{marginTop:"20px"}}>
                <div className="dx-fieldset">
                    <div className="dx-field">
                        <div className="dx-field-label" style={{width: "5%"}}>참 조</div>
                        <TextBox
                            className="dx-field-value"
                            readOnly={true}
                            style={{width: "95%"}}
                            value="CSC 김형균 전무;   경영지원팀 이진원 이사보;   경영지원팀 안주리 차장;   경영지원팀 안수민 차장;  부서 이름 직위; 부서 이름 직위;"
                        />
                    </div>
                    <div className="dx-field">
                        <div className="dx-field-label" style={{width: "5%"}}>제 목</div>
                        <TextBox
                            className="dx-field-value"
                            style={{width: "95%"}}
                            value={atrzParam.title}
                            onValueChanged={onHandleAtrzTitle}
                        />
                    </div>
                </div>
            </div>
            <hr/>
        </>
    )

}

export default ElecAtrzTitleInfo