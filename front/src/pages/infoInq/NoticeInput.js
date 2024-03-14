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

const NoticeInput = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [cookies] = useCookies(["userInfo", "userAuth"]);
    const [attachments, setAttachments] = useState([]);
    const [deleteFiles, setDeleteFiles] = useState([]);
    const [newAttachments, setNewAttachments] = useState(attachments);
    const { edit, menuKorName, insertUrl, updateUrl, detail } = NoticeJson;

    const empId = cookies.userInfo.empId;
    const editMode = location.state.editMode;
    const id = location.state.id;
    const date = moment();
    const [ data, setData ] = useState({
        noticeId: uuid(),
        regEmpId: empId,
        regDt: date.format('YYYY-MM-DD HH:mm:ss')
    });
    
    const onClick = () => {
        const result = window.confirm(editMode === 'create' ? "등록하시겠습니까?" : "수정하시겠습니까?");
        if(result) storeNotice(editMode);
    };

    const getOneData = async () => {
        const param = { queryId: detail.detailQueryId, noticeId: id }
        try {
            const response = await ApiRequest("/boot/common/queryIdSearch", param);
            if (response.length !== 0) {
                setData(response[0]);
                const tmpFileList = response.map((data) => ({
                    realFileNm: data.realFileNm,
                    strgFileNm: data.strgFileNm,
                    atchmnflSn: data.atchmnflSn
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

    const validateData = () => {
        let maxSize = 0;
        attachments.map((file) => {
            if (file !== null) {
                maxSize += file.size;
            }
        })
        const errors = [];
        if (!data.noticeTtl || !data.noticeCn) {
            errors.push('required');
        } else if (maxSize !== 0 && maxSize > 1.5*1024*1024*1024) {
            alert('업로드 가능한 용량보다 큽니다')
            errors.push('Exceeded size limit');
        }
        return errors.length === 0;
    };
    
    const attachFileDelete = (deleteItem) => {
        setDeleteFiles([...deleteFiles, { atchmnflSn: deleteItem.atchmnflSn }]);
        setNewAttachments(newAttachments.filter(item => item !== deleteItem));
    }

    const storeNotice = async (editMode) => {
        if(editMode === 'update'){
            setData({
                ...data,
                noticeId: id,
                mdfcnEmpId: empId,
                mdfcnDt: date.format('YYYY-MM-DD HH:mm:ss')
            })
        }
        const formData = new FormData();
        formData.append("tbNm", "NOTICE");
        formData.append("data", JSON.stringify(data)); 
        Object.values(deleteFiles)
            .forEach((deleteFiles) => formData.append("deleteFiles", deleteFiles));
        Object.values(attachments)
            .forEach((attachment) => formData.append("attachments", attachment));
        try {
            if (validateData()) {
                const response = await axios.post(editMode === 'create' ? insertUrl : updateUrl, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                })
                if (response.data >= 0) navigate("/infoInq/NoticeList")
            }
        } catch (error) {
            console.error("API 요청 에러:", error);
        }
    };

    return (
        <div className="container">
            <div className="title p-1" style={{ marginTop: "20px", marginBottom: "10px" }}>
                <h1 style={{ fontSize: "40px" }}>{menuKorName}</h1>
            </div>
            <div className="col-md-10 mx-auto" style={{ marginBottom: "10px" }}>
                <span>* {menuKorName}을 {editMode === 'update' ? '수정합니다' : '입력합니다.'}</span>
            </div>
            <BoardInputForm
                edit={edit}
                data={data}
                setData={setData}
                editMode={editMode}
                attachments={attachments}
                setAttachments={setAttachments}
                attachFileDelete={attachFileDelete}
                newAttachments={newAttachments}
                setNewAttachments={setNewAttachments}
            />
            <div className="wrap_btns inputFormBtn">
                <Button
                    id="button"
                    text="목록"
                    className="btn_submit filled_gray"
                    onClick={() => navigate("/infoInq/NoticeList")}
                />
                <Button
                    id="button"
                    text="저장"
                    className="btn_submit filled_blue"
                    useSubmitBehavior={true}
                    onClick={onClick}
                />
            </div>
        </div>
    );
};
export default NoticeInput;