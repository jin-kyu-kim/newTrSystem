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
    const { edit, insertUrl, detail } = NoticeJson;
    const [ attachments, setAttachments ] = useState([]);
    const [ deleteFiles, setDeleteFiles ] = useState([{tbNm: "ATCHMNFL"}]);
    const [ newAttachments, setNewAttachments ] = useState(attachments);
    const [ prevData, setPrevData ] = useState({});
    const [ data, setData ] = useState({
        errId: uuid(),
        useYn: "Y",
        errPrcsSttsCd : "VTW05501"
    });
    const [realData, setRealData] = useState([])
    const { handleOpen } = useModal();

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
                const { atchmnflSn, realFileNm, strgFileNm, regDt, regEmpNm, ...resData } = response[0];
                setData({ ...resData });
                setPrevData({ ...resData });
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

    useEffect(() => {
        setRealData({errId : data.errId, errTtl : data.errTtl? data.errTtl: data.noticeTtl, errCn : data.errCn?data.errCn:data.noticeCn, errPrcsSttsCd : 'VTW05501',atchmnflId: data.atchmnflId })
    }, [data]);

    const attachFileDelete = (deleteItem) => {
        setDeleteFiles([...deleteFiles, { atchmnflId: data.atchmnflId , atchmnflSn: deleteItem.atchmnflSn }]);
        setNewAttachments(newAttachments.filter(item => item !== deleteItem));
    }

    const validateData = () => {
        console.log(realData)
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
                    if(editMode === 'update') {
                    handleOpen('수정되었습니다.');
                    }else{
                    handleOpen('등록되었습니다.');
                    }
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
            <div className="title p-1" style={{ marginTop: "20px", marginBottom: "10px" }}></div>
            <div className="col-md-10 mx-auto" style={{ marginBottom: "30px" }}>
                <h1 style={{ fontSize: "40px" }}>오류게시판</h1>
                <span>* 오류게시 자료를 {editMode === 'update' ? '수정합니다' : '입력합니다.'}</span>
            </div>

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