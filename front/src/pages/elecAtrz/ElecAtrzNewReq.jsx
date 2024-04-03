import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import uuid from 'react-uuid'

import { FileUploader } from "devextreme-react/file-uploader";
import HtmlEditBox from "components/unit/HtmlEditBox";
import ApiRequest from "utils/ApiRequest";
import axios from "axios";
import ElecAtrzNewReqJson from "./ElecAtrzNewReqJson.json"

import ElecAtrzTitleInfo from "./common/ElecAtrzTitleInfo";
import ExpensInfo from "./expensClm/ExpensInfo";

import ElecAtrzCtrtInfo from "./ctrtInfo/ElecAtrzCtrtInfo";
import ElecAtrzCtrtInfoDetail from "./ctrtInfo/ElecAtrzCtrtInfoDetail";

const ElecAtrzNewReq = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const prjctId = location.state.prjctId;
    const formData = location.state.formData;
    // const childRef = useRef();
    const [cookies] = useCookies(["userInfo", "userAuth"]);
    const empId = cookies.userInfo.empId;
    console.log("empId",empId);
    const [data, setData] = useState(location.state.formData);
    const [atrzParam, setAtrzParam] = useState({});
    const [childData, setChildData] = useState({});  //자식 컴포넌트에서 받아온 데이터
    const [prjctData, setPrjctData] = useState({});
    const [attachments, setAttachments] = useState([]);
    const [atrzLnEmpList, setAtrzLnEmpList] = useState([]);

    const column = { "dataField": "gnrlAtrzCn", "placeholder": "내용을 입력해주세요."};

    /**
     * 자식컴포넌트에서 받아온 데이터 처리
     * @param {Object|Array} data 
     */
    const handleChildData = (data) => {
        if(Array.isArray(data)){
            setChildData(prevData => ({
                ...prevData,
                arrayData: data
            }));
        }else if(typeof data === "object"){
            setChildData(prevData => ({
                ...prevData,
                ...data
            }));
        }
    }
    
    /**
     * console.log useEffect
     */
    useEffect(() => {
        console.log("childData", childData);

        setAtrzParam(atrzParam => ({
            ...atrzParam,
            ...childData
        }));


    }, [childData]);

    useEffect(() => {
        setAtrzParam(atrzParam => ({
            ...atrzParam,
            atrzCn: data.gnrlAtrzCn
        }));
    
    }, [data]);



    useEffect(() => {

        retrievePrjctInfo();
        /**
         * Todo
         * 전자결재ID가 있는 경우,
         * 결재정보 조회로 넘어온 경우라면, 결재 정보를 보여준다.(임시저장이거나 결재 올라간거???)
         */

    }, []);

    /** 결재선용 데이터 - 등록시에는 기본 참조자 리스트 조회 */
    useEffect(() => {
        const getAtrzEmp = async () => {
            try{
                const response = await ApiRequest('/boot/common/queryIdSearch', {
                    queryId: "indvdlClmMapper.retrieveElctrnAtrzRefrnInq",
                    searchType: "atrzLnReftnList", 
                    repDeptId: "9da3f461-9c7e-cd6c-00b6-c36541b09b0d"
                })
                setAtrzLnEmpList(response);
            } catch(error) {
                console.log('error', error);
            }
        };
        getAtrzEmp();
    }, []);

    const getAtrzLn = (lnList) => {
        // 결재선 등록후 받은 파라미터
        setAtrzLnEmpList(lnList);
    }

    /**
     * 프로젝트 기초정보 조회
     */
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
        createAtrz(atrzParam, "VTW03702");
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
         * 결재선은 당장은 없어도? 될 듯?z`
         */

        createAtrz(atrzParam, "VTW03701");
    }

    /**
     * 승인 요청 및 임시저장 시 실행되는 함수
     * @param {} param 
     */
    const createAtrz = async (param, stts) => {
        const date = new Date();
        console.log(param)

        // 임시저장 버튼을 클릭했을 경우, 처리할 것이 있는가?
        if(stts === "VTW03701"){

        }

        const insertParam = {
            param,
            atrzDmndSttsCd: stts,
            elctrnAtrzId: uuid(),
            prjctId: prjctId,
            // 결재선
            elctrnAtrzTySeCd: data.elctrnAtrzTySeCd,
            regDt: date.toISOString().split('T')[0]+' '+date.toTimeString().split(' ')[0],
            regEmpId: cookies.userInfo.empId,
        }  

        console.log(insertParam)

        try {
            const response = await ApiRequest("/boot/elecAtrz/insertElecAtrz", insertParam);
            console.log(response);

            if(response){
                // 첨부파일 저장
                const formDataAttach = new FormData();
                formDataAttach.append("tbNm", JSON.stringify({tbNm: "CTRT_ATRZ"}));
                formDataAttach.append("data", JSON.stringify({atchmnflId : ""}));
                formDataAttach.append("idColumn", JSON.stringify({elctrnAtrzId: response})); //결재ID 받아와야 함
                formDataAttach.append("deleteFiles", JSON.stringify([]));
                Object.values(attachments)
                    .forEach((attachment) => formDataAttach.append("attachments", attachment));

                const responseAttach = await axios.post("/boot/common/insertlongText", formDataAttach, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                console.log(responseAttach);

                if(responseAttach.status === 200){
                    alert("전자결재 요청이 완료되었습니다.")
                    navigate("/elecAtrz/ElecAtrzForm");
                }

        }else{
            alert("전자결재 요청에 실패하였습니다. 관리자에게 문의하세요. ")
        }

        } catch (error) {
            console.error(error)
        }
    }

    /**
     * 목록 버튼 클릭시 전자결재 서식 목록으로 이동
     */
    const toAtrzNewReq = () => {
        navigate("../elecAtrz/ElecAtrzForm", {state: {prjctId: prjctId}});
    }

    /**
     * 결재 제목 생성하는 함수
     */
    const handleElecAtrzTitle = (e) => {
        console.log(e.value);
        setAtrzParam({
            ...atrzParam,
        title: e.value});
    }

    const onBtnClick = (e) => {

        switch (e.element.id) {
            case "requestElecAtrz": requestElecAtrz(); 
                break;
            case "saveTemp": saveTemp();
                break;
            case "toAtrzNewReq": toAtrzNewReq();
                break;
            default:
                break;
        }
    }

    /**
     * 첨부파일 데이터 핸들링
     */
    const handleAttachmentChange = (e) => {
        setAttachments(e.value);
    };
    
    return (
        <>
            <div className="container" style={{marginTop:"10px"}}>
                <ElecAtrzTitleInfo
                    atrzLnEmpList={atrzLnEmpList}
                    getAtrzLn={getAtrzLn}
                    contents={ElecAtrzNewReqJson.header}
                    onHandleAtrzTitle={handleElecAtrzTitle}
                    onClick={onBtnClick}
                    prjctData={prjctData}
                    formData={formData}
                    atrzParam={atrzParam}
                />
                <div dangerouslySetInnerHTML={{ __html: formData.docFormDc }} />
                    {["VTW04909","VTW04910"].includes(data.elctrnAtrzTySeCd) &&  (
                        <>
                        <ElecAtrzCtrtInfo prjctId={prjctId} data={data} onSendData={handleChildData}/>
                        <ElecAtrzCtrtInfoDetail prjctId={prjctId} data={data} onSendData={handleChildData}/>
                        </>
                    )}
                    {formData.elctrnAtrzTySeCd === "VTW04907" &&
                    <>
                        <ExpensInfo onSendData={handleChildData}/>
                    </>
                    }
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
                        onValueChanged={handleAttachmentChange}
                        maxFileSize={1.5 * 1024 * 1024 * 1024}
                    />
                </div>
            </div>
        </>
    );
}

export default ElecAtrzNewReq;