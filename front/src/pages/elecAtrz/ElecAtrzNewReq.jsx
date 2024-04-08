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
import { Button } from 'devextreme-react';

const ElecAtrzNewReq = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const prjctId = location.state.prjctId;
    const deptId = location.state.deptId;
    const formData = location.state.formData;
    const [cookies] = useCookies(["userInfo", "userAuth"]);

    const [data, setData] = useState(location.state.formData);
    const [atrzParam, setAtrzParam] = useState({});
    const [childData, setChildData] = useState({});  //자식 컴포넌트에서 받아온 데이터
    const [prjctData, setPrjctData] = useState({});
    const [attachments, setAttachments] = useState([]);
    const [atrzLnEmpList, setAtrzLnEmpList] = useState([]);
    const column = { "dataField": "gnrlAtrzCn", "placeholder": "내용을 입력해주세요."};

    /*
     * 첨부파일 저장 테이블 지정 
     * >> TODO. 현재는 전자결재문서를 elctrnAtrzTySeCd 이것으로 구분중이지만 
     *    전자결재ID로 구분하는게 맞을 듯함.
     */
    let insertTable = "";
    if(["VTW04907"].includes(data.elctrnAtrzTySeCd)){
        insertTable = "CLM_ATRZ";
    }else if(["VTW04909","VTW04910"].includes(data.elctrnAtrzTySeCd)){
        insertTable = "CTRT_ATRZ";
    }

    console.log(formData);

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
     * 자식컴포넌트에서 받아온 데이터 set 
     */
    useEffect(() => {
        console.log("childData", childData);

        setAtrzParam(atrzParam => ({
            ...atrzParam,
            ...childData
        }));
    }, [childData]);

    /**
     *  내용 html 데이터 set
     */
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

        //임시저장 눌렀을 시 벨리데이션 체크    
        const isValid = checkValidation(stts, param, atrzLnEmpList); 
        if(!isValid) return;


        /**
         * 전자결재 & 첨부파일 저장
         */

        console.log(atrzLnEmpList)

        const insertParam = {
            param,
            atrzDmndSttsCd: stts,
            elctrnAtrzId: uuid(),
            prjctId: prjctId,
            deptId: deptId,
            elctrnAtrzTySeCd: data.elctrnAtrzTySeCd,
            regDt: date.toISOString().split('T')[0]+' '+date.toTimeString().split(' ')[0],
            regEmpId: cookies.userInfo.empId,
            atrzFormDocId: formData.atrzFormDocId,
            atrzLnEmpList
        }  

        try {
            const response = await ApiRequest("/boot/elecAtrz/insertElecAtrz", insertParam);
            console.log(response);

            if(response){
                // 첨부파일 저장
                const formDataAttach = new FormData();      
                formDataAttach.append("tbNm", JSON.stringify({tbNm : insertTable})); 
                formDataAttach.append("data", JSON.stringify({atchmnflId : uuid()}));
                formDataAttach.append("idColumn", JSON.stringify({elctrnAtrzId: response})); //결재ID
                formDataAttach.append("deleteFiles", JSON.stringify([]));
                Object.values(attachments)
                    .forEach((attachment) => formDataAttach.append("attachments", attachment));

                    for (let [key, value] of formDataAttach.entries()) {
                        console.log(key, value);
                    }

                const responseAttach = await axios.post("/boot/common/insertlongText", formDataAttach, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                console.log(responseAttach);

                if(responseAttach.status === 200){
                    alert("전자결재 요청이 완료되었습니다.")
                    navigate("/elecAtrz/ElecAtrz");
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
        navigate("../elecAtrz/ElecAtrzForm", {state: {prjctId: prjctId, deptId: deptId}});
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


    /**
     * 결재요청 및 임시저장 벨리데이션 체크
     */
    const checkValidation = (stts, param, atrzLnEmpList) => {
        if(["VTW03701","VTW03702"].includes(stts)){
            if(param.title === undefined || param.title === ""){
                alert("결재 제목을 입력해주세요.");
                return false;
            }else if(param.atrzCn === undefined || param.atrzCn === ""){
                alert("결재 내용을 입력해주세요.");
                return false;
            }
        }
        console.log(atrzLnEmpList)

        var atrzLn = atrzLnEmpList.find( ({ approvalCode }) => approvalCode == 'VTW00705');


        // console.log(atrzLn)

        if(atrzLn === undefined){
            alert("결재선을 입력해주세요.");
            return false;
        }


        return true;
    }
    
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
                    deptId={deptId}
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
                        <ExpensInfo onSendData={handleChildData} prjctId={prjctId}/>
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

                <div style={{textAlign: 'center', marginBottom: '100px'}}>
                {ElecAtrzNewReqJson.header.map((item, index) => (
                    <Button id={item.id} text={item.text} key={index} type={item.type} 
                        onClick={onBtnClick} style={{marginRight: '3px'}}/>
                ))}
                </div>
            </div>
        </>
    );
}

export default ElecAtrzNewReq;