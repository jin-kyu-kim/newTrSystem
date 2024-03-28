import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

import { Button } from "devextreme-react/button"; 
import { TextBox } from "devextreme-react/text-box";
import { FileUploader } from "devextreme-react/file-uploader";
import HtmlEditBox from "components/unit/HtmlEditBox";
import ApiRequest from "utils/ApiRequest";

import ElecAtrzCtrtInfo from "./ctrtInfo/ElecAtrzCtrtInfo";
import ElecAtrzCtrtInfoDetail from "./ctrtInfo/ElecAtrzCtrtInfoDetail";

const ElecAtrzNewReq = () => {

    const location = useLocation();
    const prjctId = location.state.prjctId;
    const formData = location.state.formData;
    const [prjctData, setPrjctData] = useState({});
    const [data, setData] = useState(location.state.formData);
    const [cookies] = useCookies(["userInfo", "userAuth"]);

    const [atrzParam, setAtrzParam] = useState({});

    const navigate = useNavigate();

    const column = { "dataField": "gnrlAtrzCn", "placeholder": "내용을 입력해주세요."};

    console.log("formData", formData);
    
    useEffect(() => {
        retrievePrjctInfo();

        // Todo: 결재정보 조회로 넘어온 경우라면, 결재 정보를 보여준다.(임시저장이거나 결재 올라간거???)


    }, []);

    const retrievePrjctInfo = async () => {
        const param = [
            { tbNm: "PRJCT" },
            { prjctId: prjctId}
        ]
        try {
            const response = await ApiRequest("/boot/common/commonSelect", param);
            setPrjctData(response[0]);
        } catch (error) {
            console.error(error)
        }
    };

    /**
     * 결재요청 버튼 클릭시 전자결재 요청 함수 실행
     */
    const requestElecAtrz = async () => {
        console.log("전자결재 요청");

        // Todo
        // elctrnAtrzTySeCd에 따라서 저장 테이블 다르게(계약, 청구, 일반, 휴가..)
        // 결재선 지정이 되어있는지 확인, 안되어 있으면..?

        


    }

    /**
     * 결재선 지정 버튼 클릭시 결재선 지정 팝업 호출
     */
    const onAtrzLnPopup = async () => {
        console.log("결재선 지정 팝업 호출");
    
        /**
         * Todo
         * 결재선 만들어지면 
         * 결재선 보이는 테이블 형식에 집어넣기. 
         */
    }

    /**
     * 임시저장 버튼 클릭시 임시저장 함수 실행
     */
    const saveTemp = async () => {
        console.log("임시저장");
        
        /**
         * Todo
         * 전자결재 테이블저장 하고, elctrnAtrzTySeCd에 따라서 저장 테이블 다르게(계약, 청구, 일반, 휴가..)
         * 결재요청상태코드는 임시저장으로 저장
         * 결재선은 당장은 없어도? 될 듯?
         */

    }

    /**
     * 목록 버튼 클릭시 전자결재 서식 목록으로 이동
     */
    const toAtrzNewReq = async () => {
        navigate("../elecAtrz/elecAtrzForm", {state: {prjctId: prjctId}});
    }

    /**
     * 결재 param 생성하는 함수
     */
    const handleElecAtrz = (e) => {
        console.log(e.value);
        setAtrzParam({title: e.value});
    }


    return (
        <>
            <div className="container" style={{marginTop:"10px"}}>
                <div style={{display:"flex", justifyContent:"flex-start"}}>
                    <div style={{float: "left", marginRight:"auto"}}>로고</div>
                    <div style={{display: "inline-block"}}>
                        <Button text="결재요청" onClick={requestElecAtrz}/>
                        <Button text="결재선지정" onClick={onAtrzLnPopup}/>
                        <Button text="임시저장" onClick={saveTemp}/>
                        <Button text="목록" onClick={toAtrzNewReq}/>
                    </div>
                </div>
                <div style={{textAlign:"center"}}>{formData.gnrlAtrzTtl}</div>
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
                                <td>{prjctData.prjctNm}</td>
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
                                onValueChanged={handleElecAtrz}
                            />
                        </div>
                    </div>
                </div>
                <hr/>
                <div dangerouslySetInnerHTML={{ __html: formData.docFormDc }} />
                    {["VTW04909","VTW04910"].includes(data.elctrnAtrzTySeCd) &&  (
                        <>
                        <ElecAtrzCtrtInfo data={data}/>
                        <ElecAtrzCtrtInfoDetail prjctId={prjctId} data={data}/>
                        </>
                    )}
                <HtmlEditBox 
                    column={ {"dataField": "gnrlAtrzCn"}}
                    data={data}
                    setData={setData}
                    value={data.gnrlAtrzCn}
                    placeholder={column.placeholder}
                />
                <hr/>
                <div style={{marginBottom: "30px"}}>
                    <div> * 첨부파일</div>
                    <FileUploader
                        multiple={true}
                        accept="*/*"
                        uploadMode="useButton"
                        // onValueChanged={handleAttachmentChange}
                        maxFileSize={1.5 * 1024 * 1024 * 1024}
                    />
                </div>
            </div>
        </>
    );
}

export default ElecAtrzNewReq;