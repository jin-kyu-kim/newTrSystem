import React, { useState } from "react";
import uuid from "react-uuid";
import { FileUploader, TextBox } from "devextreme-react";
import { Validator, RequiredRule } from 'devextreme-react/validator'
import CheckBox from "devextreme-react/check-box";
import "../../assets/css/Style.css";

import CustomDateRangeBox from "components/unit/CustomDateRangeBox";
import CustomDatePicker from "components/unit/CustomDatePicker";
import HtmlEditBox from "components/unit/HtmlEditBox";

const BoardInputForm = ({ edit, data, setData, setAttachments }) => {
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
        // 상단 표시 게시글 시작일
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

    return (
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
                                        showClearButton={true}
                                        onValueChanged={(e) => {
                                            setData({ ...data, [column.dataField]: e.value });
                                        }}>
                                        <Validator>
                                            <RequiredRule message='제목은 필수입니다' />
                                        </Validator>
                                    </TextBox>
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
                                        placeholder='내용을 입력하세요'
                                    />
                                </td>
                            ) : (
                                <td>
                                    <FileUploader
                                        multiple={true}
                                        accept="*/*"
                                        uploadMode="useForm"
                                        onValueChanged={handleAttachmentChange}
                                        maxFileSize={1048576}
                                    />
                                    {/* <span className="note">
                                        {'파일 용량은 '}
                                        <span>10MB</span>까지 가능합니다.
                                    </span> */}
                                </td>
                            )}
                        </tr>
                    );
                }, data)}
            </tbody>
        </table>
    );
}
export default BoardInputForm;