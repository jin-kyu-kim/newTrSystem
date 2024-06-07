import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { Button } from "devextreme-react";
import { useModal } from "../../components/unit/ModalContext";
import uuid from "react-uuid";
import axios from "axios";
import ApiRequest from "utils/ApiRequest";
import NoticeJson from "../infoInq/NoticeJson.json";
import BoardInputForm from 'components/composite/BoardInputForm';

const NoticeInput = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { edit, insertUrl, detail, dirType } = NoticeJson;
    const [ attachments, setAttachments ] = useState([]);
    const [ deleteFiles, setDeleteFiles ] = useState([{tbNm: "ATCHMNFL"}]);
    const [ newAttachments, setNewAttachments ] = useState(attachments);
    const [ prevData, setPrevData ] = useState({});
    const { handleOpen } = useModal();
    const [ data, setData ] = useState({
        noticeId: uuid(),
        useYn: "Y",
        dirType: dirType
    });

    const editMode = location.state.editMode;
    const id = location.state.id;

    const getOneData = async () => {
        const param = { queryId: detail.detailQueryId, noticeId: id }
        try {
            const response = await ApiRequest("/boot/common/queryIdSearch", param);
            if (response.length !== 0) {
                const { atchmnflSn, realFileNm, strgFileNm, regDt, regEmpNm, fileStrgCours, ...resData } = response[0];
                setData({ ...resData, dirType });
                setPrevData({ ...resData });
                const tmpFileList = response.map((data) => ({
                    realFileNm: data.realFileNm,
                    strgFileNm: data.strgFileNm,
                    atchmnflSn: data.atchmnflSn
                }));
                setTypeChk(prev => ({
                    ...prev,
                    imprtnc: resData.sgnalOrdr === 1 ? true : false
                }));
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
        imprtnc: data.sgnalOrdr === 1 ? true : false,
        useYn: data.useYn === "Y" ? true : false,
        move: false,
    });

    const chkSgnalOrdr = () => {
        let sgnalOrdr = 0;
        let useYn = "Y";
        
        if (typeChk.imprtnc && typeChk.move) {
            sgnalOrdr = 3
        } else if (typeChk.move) {
            sgnalOrdr = 2
        } else if (typeChk.imprtnc) {
            sgnalOrdr = 1
        }
        if (!typeChk.useYn) useYn = "N"
        setData({ ...data, sgnalOrdr: sgnalOrdr, useYn: useYn });
    }

    useEffect(() => {
        if (typeChk.imprtnc || typeChk.move || typeChk.useYn) chkSgnalOrdr();
    }, [typeChk.imprtnc, typeChk.move, typeChk.useYn])

    const attachFileDelete = (deleteItem) => {
        setDeleteFiles([...deleteFiles, { atchmnflId: data.atchmnflId ,atchmnflSn: deleteItem.atchmnflSn, strgFileNm: deleteItem.strgFileNm }]);
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
            const token = localStorage.getItem("token");
            if(validateData()){
                const response = await axios.post(insertUrl, formData, {
                    headers: { 'Content-Type': 'multipart/form-data', "Authorization": `Bearer ${token}` },
                })
                if (response.data >= 1) {
                    const action = editMode === 'update' ? '수정' : '등록';
                    handleOpen(`${action}되었습니다.`);
                    navigate("/infoInq/NoticeList");
                }
            } else{
                handleOpen('필수항목을 입력해주세요.')
            }
        } catch (error) {
            console.error("API 요청 에러:", error);
        }
    };
    const inputConfig = { data, setData, typeChk, setTypeChk, attachments, setAttachments, newAttachments, setNewAttachments };

    return (
        <div className="container">
            <div className="title p-1" style={{ marginTop: "20px", marginBottom: "10px" }}></div>
            <div className="col-md-10 mx-auto" style={{ marginBottom: "30px" }}>
                <h1 style={{ fontSize: "40px" }}>공지사항</h1>
                <span>* 공지사항을 {editMode === 'update' ? '수정합니다' : '입력합니다.'}</span>
            </div>

            <BoardInputForm
                edit={edit}
                editMode={editMode}
                editType='notice'
                attachFileDelete={attachFileDelete}
                inputConfig={inputConfig}
            />
            
            <div className="wrap_btns inputFormBtn">
                <Button text="목록" onClick={() => navigate("/infoInq/NoticeList")} />
                <Button text="저장" useSubmitBehavior={true} onClick={() => handleOpen(editMode !== 'update' ? "등록하시겠습니까?" : "수정하시겠습니까?", () => storeNotice(editMode))} />
            </div>
        </div>
    );
};
export default NoticeInput;