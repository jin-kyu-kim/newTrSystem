import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";
import { Button } from "devextreme-react";
import uuid from "react-uuid";
import axios from "axios";
import ApiRequest from "utils/ApiRequest";
import NoticeJson from "../infoInq/NoticeJson.json";
import BoardInputForm from 'components/composite/BoardInputForm';
import moment from 'moment';

const ReferenceInput = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [cookies] = useCookies(["userInfo", "userAuth"]);
    const [attachments, setAttachments] = useState([]);
    const [deleteFiles, setDeleteFiles] = useState([{tbNm: "ATCHMNFL"}]);
    const [newAttachments, setNewAttachments] = useState(attachments);
    const { edit, insertUrl, detail } = NoticeJson;

    const empId = cookies.userInfo.empId;
    const editMode = location.state.editMode;
    const id = location.state.id;
    const date = moment();
    const [prevData, setPrevData] = useState({});
    const [ data, setData ] = useState({
        noticeId: uuid(),
        regEmpId: empId,
        useYn: "Y",
        regDt: date.format('YYYY-MM-DD HH:mm:ss')
    });
    
    const onClick = () => {
        const result = window.confirm(editMode !== 'update' ? "등록하시겠습니까?" : "수정하시겠습니까?");
        if(result) storeNotice(editMode);
    };

    const getOneData = async () => {
    const param = { queryId: detail.detailQueryId, noticeId: id }
        try {
            const response = await ApiRequest("/boot/common/queryIdSearch", param);
            if (response.length !== 0) {
                const { atchmnflSn, realFileNm, strgFileNm, regDt, regEmpNm, ...resData } = response[0];
                setData({ ...resData });
                setPrevData({ ...resData });
                const tmpFileList = response.map((data) => ({
                    realFileNm: data.realFileNm,
                    strgFileNm: data.strgFileNm,
                    atchmnflSn: data.atchmnflSn
                }));
                setTypeChk({...typeChk, imprtnc: data.imprtncNtcBgngYmd !== null ? true : false})
                setAttachments(tmpFileList);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (editMode === 'update') getOneData();
    }, []);

    const [typeChk, setTypeChk] = useState({
        imprtnc: data.imprtncNtcBgngYmd !== undefined ? true : false,
        useYn: data.useYn === "Y" ? true : false,
        move: false,
    });

    const chkSgnalOrdr = () => {
        let sgnalOrdr = 2;
        let useYn = "Y";

        if (typeChk.imprtnc && typeChk.move) {
            sgnalOrdr = 1
        } else if (typeChk.move) {
            sgnalOrdr = 0
        } else if (typeChk.imprtnc) {
            sgnalOrdr = 3
        }
        if (!typeChk.useYn) useYn = "N"
        setData({ ...data, sgnalOrdr: sgnalOrdr, useYn: useYn });
    }

    useEffect(() => {
        if (typeChk.imprtnc || typeChk.move || typeChk.useYn) chkSgnalOrdr();
    }, [typeChk.imprtnc, typeChk.move, typeChk.useYn])
    
    const attachFileDelete = (deleteItem) => {
        setDeleteFiles([...deleteFiles, { atchmnflId: data.atchmnflId , atchmnflSn: deleteItem.atchmnflSn }]);
        setNewAttachments(newAttachments.filter(item => item !== deleteItem));
    }

    const validateData = () => {
        const errors = [];
        if (!data.noticeTtl || !data.noticeCn) {
          errors.push('required');
        }
        return errors.length === 0;
    };

    const storeNotice = async (editMode) => {
        if(editMode === 'update'){
            let changedValues = {};

            Object.keys(data).forEach(key => {
                if(prevData[key] !== data[key]){
                    changedValues = { ...changedValues, [key]: data[key] }
                }
            });
            setData({
                atchmnflId: data.atchmnflId,
                regEmpId: empId,
                mdfcnEmpId: empId,
                mdfcnDt: date.format('YYYY-MM-DD HH:mm:ss'),
                changedValues
            })
        }
        const formData = new FormData();
        formData.append("tbNm", JSON.stringify({tbNm: "NOTICE"}));
        formData.append("data", JSON.stringify(data));
        if(editMode === 'update') {
            formData.append("idColumn", JSON.stringify({noticeId: data.noticeId}));
            formData.append("deleteFiles", JSON.stringify(deleteFiles));
        }
        Object.values(attachments)
            .forEach((attachment) => formData.append("attachments", attachment));
        try {
            if(validateData()){
                const response = await axios.post(insertUrl, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                })
                if (response.data >= 1) navigate("/infoInq/ReferenceList")
            }
        } catch (error) {
            console.error("API 요청 에러:", error);
        }
    };

    return (
        <div className="container">
            <div className="title p-1" style={{ marginTop: "20px", marginBottom: "10px" }}></div>
            <div className="col-md-10 mx-auto" style={{ marginBottom: "30px" }}>
                <h1 style={{ fontSize: "40px" }}>자료실</h1>
                <span>* 자료실을 {editMode === 'update' ? '수정합니다' : '입력합니다.'}</span>
            </div>
            <BoardInputForm
                edit={edit}
                data={data}
                typeChk={typeChk}
                editMode={editMode}
                editType='referemce'
                attachments={attachments}
                newAttachments={newAttachments}
                setData={setData}
                setTypeChk={setTypeChk}
                setAttachments={setAttachments}
                attachFileDelete={attachFileDelete}
                setNewAttachments={setNewAttachments}
            />
            <div className="wrap_btns inputFormBtn">
                <Button text="목록" onClick={() => navigate("/infoInq/ReferenceList")} />
                <Button text="저장" useSubmitBehavior={true} onClick={onClick} />
            </div>
        </div>
    );
};
export default ReferenceInput;