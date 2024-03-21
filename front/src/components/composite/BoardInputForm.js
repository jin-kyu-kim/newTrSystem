import React, { useEffect, useState } from "react";
import uuid from "react-uuid";
import { DateBox, DateRangeBox, FileUploader, TextBox } from "devextreme-react";
import { Validator, RequiredRule } from 'devextreme-react/validator'
import HtmlEditBox from "components/unit/HtmlEditBox";
import CheckBox from "devextreme-react/check-box";
import "../../assets/css/Style.css";

const BoardInputForm = ({ edit, data, setData, attachments, setAttachments, attachFileDelete, typeChk, setTypeChk, editMode, editType, newAttachments, setNewAttachments }) => {
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const handleAttachmentChange = (e) => {
        setAttachments(e.value);
        setData({
            ...data, 
            atchmnflId: (editMode === 'update' && data.atchmnflId !== null) ? data.atchmnflId : uuid()
        })
    };

    useEffect(() => {
        if (data.noticeTtl !== undefined) {
            setIsDataLoaded(true);
        }
    }, [data.noticeTtl]);

    useEffect(() => {
        if (editMode === 'update' && isDataLoaded) {
            setNewAttachments([...attachments]);
            setAttachments([]); // 수정시에는 새로 첨부한 파일만 받기
        }
    }, [editMode, isDataLoaded]);

    const handleDateRange = (e) => {
        setData({ ...data, imprtncNtcBgngYmd: e.value[0], imprtncNtcEndYmd: e.value[1] });
    };

    if (editMode === 'update' && data.noticeTtl === undefined) {
        return null;
    }

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
                                    value={data.noticeTtl}
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
                                            <div className="checkbox-label">{check.dataField === 'move' ? 
                                                (editType === 'notice' ? check.noticeLabel : check.referLabel) : check.label}:</div>
                                                <CheckBox
                                                    className="checkSpace"
                                                    value={check.dataField === 'imprtnc' ? typeChk.imprtnc 
                                                        : check.dataField === 'useYn' ? typeChk.useYn : typeChk.move}
                                                    onValueChanged={(e) => {
                                                        setTypeChk({ ...typeChk, [check.dataField]: e.value })
                                                    }}
                                                />
                                                {check.dataField === "move" ? (
                                                <></>
                                            ) : check.dataField === "imprtnc" ? (
                                                <DateRangeBox
                                                    value={[data.imprtncNtcBgngYmd, data.imprtncNtcEndYmd]}
                                                    displayFormat="yyyy-MM-dd"
                                                    dateSerializationFormat="yyyyMMdd"
                                                    onValueChanged={(e) => handleDateRange(e)}
                                                />
                                            ) : (
                                                <DateBox
                                                    id={check.dataField}
                                                    value={data.useEndYmd}
                                                    placeholder={check.placeholder}
                                                    dateSerializationFormat="yyyyMMdd"
                                                    displayFormat="yyyy-MM-dd"
                                                    type="date"
                                                    onValueChanged={(e) => {
                                                        setData({ ...data, [check.name]: e.value });
                                                    }}
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
                                    value={data.noticeCn}
                                    placeholder={column.placeholder}
                                />
                            </td>)
                            : (<td>
                                <span>* 파일 용량은 1.5GB</span>까지 가능합니다.
                                <FileUploader
                                    multiple={true}
                                    accept="*/*"
                                    uploadMode="useButton"
                                    onValueChanged={handleAttachmentChange}
                                    maxFileSize={1.5 * 1024 * 1024 * 1024}
                                />
                                {newAttachments[0] !== null && newAttachments.map((item, index) => (
                                    <div key={index}>
                                        {item.realFileNm && (item.realFileNm.endsWith('.jpg') || item.realFileNm.endsWith('.jpeg') || item.realFileNm.endsWith('.png') || item.realFileNm.endsWith('.gif')) ?
                                            (<img src={`/upload/${item.strgFileNm}`} style={{ width: '50%', marginBottom: '20px' }} alt={item.realFileNm} />)
                                        : <span>{item.realFileNm}</span> }
                                        {item.realFileNm && <span onClick={() => attachFileDelete(item)} style={{ fontWeight: 'bold', marginLeft: '10px', color: 'red', cursor: 'pointer' }}>X</span>}
                                    </div>
                                ))}
                            </td> )}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}
export default BoardInputForm;