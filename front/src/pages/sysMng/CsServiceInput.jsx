import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { Button } from "devextreme-react";
import { useModal } from "../../components/unit/ModalContext";
import uuid from "react-uuid";
import axios from "axios";
import ApiRequest from "utils/ApiRequest";
import NoticeJson from "../sysMng/CsServiceJson.json";
import BoardInputForm from 'components/composite/BoardInputForm';

const CsServiceInput = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { edit, insertUrl, detail, dirType } = NoticeJson;
    const [ attachments, setAttachments ] = useState([]);
    const [ deleteFiles, setDeleteFiles ] = useState([{tbNm: "ATCHMNFL"}]);
    const [ newAttachments, setNewAttachments ] = useState(attachments);
    const [ prevData, setPrevData ] = useState({});
    const [ realData, setRealData ] = useState([])
    const { handleOpen } = useModal();
    const [ data, setData ] = useState({
        errId: uuid(),
        useYn: "Y",
        errPrcsSttsCd : "VTW05501",
        dirType: dirType
    });

    const editMode = location.state.editMode;
    const id = location.state.id;

    const getOneData = async () => {
        const params = {
            queryId: detail.detailQueryId,
            errId: id
        }
        try {
            const response = await ApiRequest("/boot/common/queryIdSearch", params);
            if (response.length !== 0) {
                const { atchmnflSn, realFileNm, strgFileNm, regDt, regEmpNm, fileStrgCours, ...resData } = response[0];
                setData({ ...resData, dirType });
                setPrevData({ ...resData });
                const tmpFileList = response.map((data) => ({
                    realFileNm: data.realFileNm,
                    strgFileNm: data.strgFileNm,
                    atchmnflSn: data.atchmnflSn,
                    fileStrgCours: data.fileStrgCours
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

    useEffect(() => {
        setRealData({errId : data.errId, errTtl : data.errTtl? data.errTtl: data.noticeTtl, errCn : data.errCn?data.errCn:data.noticeCn, errPrcsSttsCd : 'VTW05501',atchmnflId: data.atchmnflId })
    }, [data]);

    const attachFileDelete = (deleteItem) => {
        setDeleteFiles([...deleteFiles, { atchmnflId: data.atchmnflId , atchmnflSn: deleteItem.atchmnflSn, strgFileNm: deleteItem.strgFileNm }]);
        setNewAttachments(newAttachments.filter(item => item !== deleteItem));
    }

    const validateData = () => {
        const errors = [];
        if (!realData.errTtl || !realData.errCn) {
          errors.push('required');
        }
        return errors.length === 0;
    };

    const storeReference = async (editMode) => {
        if(editMode === 'update'){
            let changedValues = {};

            Object.keys(data).forEach(key => {
                if(prevData[key] !== data[key]){
                    changedValues = { ...changedValues, [key]: data[key] }
                }
            });
            setRealData({
                atchmnflId: data.atchmnflId,
                changedValues
            })
        }
        const formData = new FormData();
        
        formData.append("tbNm", JSON.stringify({tbNm: "ERR_MNG"}));
        formData.append("data", JSON.stringify(realData));
        if(editMode === 'update') {
            formData.append("idColumn", JSON.stringify({errId: data.errId}));
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
                    navigate("/sysMng/CsServiceList");
                }
            } else{
                handleOpen('필수항목을 입력해주세요.')
            }
        } catch (error) {
            console.error("API 요청 에러:", error);
        }
    };
    const inputConfig = { data, setData, attachments, setAttachments, newAttachments, setNewAttachments };

    return (
        <div className="container">
            <div className="title">오류게시판</div>
            <div className='title-desc'>* 오류게시 자료를 {editMode === 'update' ? '수정합니다' : '입력합니다.'}</div>

            <BoardInputForm
                edit={edit}
                editMode={editMode}
                editType='referemce'
                attachFileDelete={attachFileDelete}
                inputConfig={inputConfig}
            />
            
            <div className="wrap_btns inputFormBtn">
                <Button text="목록" onClick={() => navigate("/sysMng/CsServiceList")} />
                <Button text="저장" useSubmitBehavior={true} onClick={() => handleOpen(editMode !== 'update' ? "등록하시겠습니까?" : "수정하시겠습니까?", () => storeReference(editMode))} />
            </div>
        </div>
    );
};
export default CsServiceInput;