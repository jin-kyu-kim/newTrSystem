import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";
import uuid from "react-uuid";
import CheckBox from "devextreme-react/check-box";
import { FileUploader, Button, TextBox } from "devextreme-react";

import CustomDateRangeBox from "components/unit/CustomDateRangeBox";
import "../../assets/css/Style.css";
import ApiRequest from "utils/ApiRequest";
import NoticeJson from "../infoInq/NoticeJson.json";
import HtmlEditBox from "components/unit/HtmlEditBox";
import CustomDatePicker from "components/unit/CustomDatePicker";
import axios from "axios";

const NoticeInput = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [cookies] = useCookies(["userInfo", "userAuth"]);
    const { edit, menuKorName } = NoticeJson;
    const empId = cookies.userInfo.empId;
    const editMode = location.state.editMode;
    const id = location.state.id;
    const date = new Date();

    const [attachments, setAttachments] = useState([]);
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
    const { noticeTtl, noticeCn, useEndYmd } = data || {};
    const [noticeTypeChk, setNoticeTypeChk] = useState({
        imprtnc: false,
        useYn: 'Y',
        moveToRefer: false,
    });
    const handleAttachmentChange = (e) => {
        setAttachments(e.value);
        setData({
            ...data,
            atchmnflId: uuid()
        })
    };
    const handleStartDateChange = (newStartDate) => {
        // 상단 중요공지 시작일자
        setData({
            ...data,
            imprtncNtcBgngYmd: newStartDate,
        });
    };
    const handleEndDateChange = (newEndDate) => {
        setData({
            ...data,
            imprtncNtcEndYmd: newEndDate,
        });
    };
    const handleUseYnDateChg = ({ name, value }) => {
        setData({
            ...data,
            [name]: value,
        });
    };
    const onClick = () => {
        const isconfirm = window.confirm("등록하시겠습니까?");
        if (isconfirm) {
            insertNotice();
        }
    };
    const getOneData = async () => {
        const param = [{tbNm: "NOTICE"}, { noticeId: id },]
        try{
            const response = await ApiRequest("/boot/common/commonSelect", param);
            console.log(response[0])
            setData(response[0]);
        } catch(error){
            console.log(error);
        }
    }
    useEffect(() => {
        if(editMode === 'update'){
            getOneData();
        }        
    }, []);

    const insertNotice = async () => {
        const formData = new FormData();
        formData.append("tbNm", "NOTICE");
        formData.append("data", JSON.stringify(data));
        Object.values(attachments)
            .forEach((attachment) => formData.append("attachments", attachment));
        try {
            const response = await axios.post("/boot/common/noticeInsert", formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              },
            });
            if(response.data === 1) navigate("/infoInq/NoticeList")
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
                <span>* {menuKorName}을 {editMode === 'update' ? '수정합니다': '입력합니다.'}</span>
            </div>
            <table className="notice-table">
                <colgroup>
                    <col style={{ width: "25%" }} />
                    <col style={{ width: "75%" }} />
                </colgroup>
                <tbody>
                    {edit.columns.map((column, index) => {
                        return (
                            <tr key={index}>
                                <td className="input-column">{column.label}</td>
                                {column.name === "ttl" ? (
                                    <td>
                                        <TextBox
                                            id={column.dataField}
                                            name={column.dataField}
                                            value={noticeTtl}
                                            placeholder={column.placeholder}
                                            onValueChanged={(e) => {
                                                setData({ ...data, [column.dataField]: e.value });
                                            }}
                                        />
                                    </td>
                                ) : column.name === "setting" ? (
                                    <td>
                                        {column.checkType.map((check) => {
                                            return (
                                                <div key={check.dataField} className="checkbox-wrapper">
                                                    <div className="checkbox-label">{check.label}:</div>
                                                    <CheckBox
                                                        className="checkSpace"
                                                        defaultValue={
                                                            check.dataField === "useYn" ? true : false
                                                        }
                                                        onValueChanged={(e) => {
                                                            setNoticeTypeChk({
                                                                ...noticeTypeChk,
                                                                [check.dataField]: e.value,
                                                            });
                                                        }}
                                                    />
                                                    {check.dataField === "moveToRefer" ? (
                                                        <></>
                                                    ) : check.dataField === "imprtnc" ? (
                                                        <CustomDateRangeBox
                                                            columnId={check.type.endDt}
                                                            onStartDateChange={handleStartDateChange}
                                                            onEndDateChange={handleEndDateChange}
                                                        />
                                                    ) : (
                                                        <CustomDatePicker
                                                            id={check.dataField}
                                                            placeholder="공지 종료일자"
                                                            name="useEndYmd"
                                                            value={useEndYmd}
                                                            onSelect={handleUseYnDateChg}
                                                        />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </td>
                                ) : column.name === "cn" ? (
                                    <td>
                                        <HtmlEditBox
                                            column={column}
                                            data={data}
                                            setData={setData}
                                            value={noticeCn}
                                        />
                                    </td>
                                ) : (
                                    <td>
                                        <FileUploader
                                            multiple={true}
                                            accept="*/*"
                                            uploadMode="useForm"
                                            onValueChanged={handleAttachmentChange}
                                        />
                                    </td>
                                )}
                            </tr>
                        );
                    }, data)}
                </tbody>
            </table>

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
                    // onClick={(e) => {
                    //     let res = e.validationGroup.validate();
                    //     if (!res.isValid) {
                    //         res.brokenRules[0].validator.focus();
                    //     }
                    // }}
                    onClick={onClick}
                />
            </div>
        </div>
    );
};
export default NoticeInput;