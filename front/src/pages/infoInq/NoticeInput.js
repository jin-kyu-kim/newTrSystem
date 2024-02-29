import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";
import { Button } from "devextreme-react";
import uuid from "react-uuid";
import axios from "axios";

import ApiRequest from "utils/ApiRequest";
import NoticeJson from "../infoInq/NoticeJson.json";
import BoardInputForm from 'components/unit/BoardInputForm';

const NoticeInput = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [cookies] = useCookies(["userInfo", "userAuth"]);
    const { edit, menuKorName } = NoticeJson;
    const empId = cookies.userInfo.empId;
    const editMode = location.state.editMode;
    const id = location.state.id;
    const date = new Date();

    const [attachments, setAttachments] = useState([null]);
    const [data, setData] = useState({
        noticeId: uuid(),
        atchmnflId: null,
        noticeTtl: "",
        noticeCn: "",
        sgnalOrdr: 0, // 기본값 일반공지
        useYn: 'Y', // 공지표시 여부
        useEndYmd: null,
        imprtncNtcBgngYmd: null,
        imprtncNtcEndYmd: null,
        regEmpId: empId,
        regDt: date.toISOString().split("T")[0] + " " + date.toTimeString().split(" ")[0],
    });

    const onClick = () => {
        const isconfirm = window.confirm("등록하시겠습니까?");
        if (isconfirm) {
            insertNotice();
        }
    };
    const getOneData = async () => {
        const param = [{ tbNm: "NOTICE" }, { noticeId: id },]
        try {
            const response = await ApiRequest("/boot/common/commonSelect", param);
            console.log(response[0])
            setData(response[0]);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        if (editMode === 'update') {
            getOneData();
        }
    }, []);

    const validateData = () => {
        const errors = [];
        if (!data.noticeTtl || !data.noticeCn) {
          errors.push('required');
        }
        return errors.length === 0;
      };

    const insertNotice = async () => {
        const formData = new FormData();
        formData.append("tbNm", "NOTICE");
        formData.append("data", JSON.stringify(data));
        Object.values(attachments)
            .forEach((attachment) => formData.append("attachments", attachment));
        try {
            if (validateData()) {
                const response = await axios.post("/boot/common/insertlongText", formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                })
                if (response.data === 1) navigate("/infoInq/NoticeList")
            }
        } catch (error) {
            console.error("API 요청 에러:", error);
            throw error;
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
                setAttachments={setAttachments}
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