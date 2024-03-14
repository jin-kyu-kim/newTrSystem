import React, { useEffect, useState } from "react";
import { DateBox, DateRangeBox, FileUploader, TextBox } from "devextreme-react";
import { Validator, RequiredRule } from 'devextreme-react/validator'
import CheckBox from "devextreme-react/check-box";
import uuid from "react-uuid";
import HtmlEditBox from "components/unit/HtmlEditBox";
import "../../assets/css/Style.css";

const BoardInputForm = ({ edit, data, setData, attachments, setAttachments, attachFileDelete, editMode, newAttachments, setNewAttachments }) => {
    const handleAttachmentChange = (e) => {
        setAttachments(e.value);
        setData({
            ...data, 
            atchmnflId: editMode === 'update' ? data.atchmnflId : uuid()
        })
    };

    const [typeChk, setTypeChk] = useState({
        imprtnc: false,
        useYn: true,
        moveToRefer: false,
    });

    const chkSgnalOrdr = () => {
        let sgnalOrdr = 0;
        let useYn = "Y";

        if (typeChk.imprtnc && typeChk.moveToRefer) {
            sgnalOrdr = 3
        } else if (typeChk.moveToRefer) {
            sgnalOrdr = 2
        } else if (typeChk.imprtnc) {
            sgnalOrdr = 1
        }
        if (!typeChk.useYn) {
            useYn = "N"
        }
        setData({ ...data, sgnalOrdr: sgnalOrdr, useYn: useYn });
    }

    useEffect(() => {
        if (typeChk.imprtnc || typeChk.moveToRefer || typeChk.useYn) chkSgnalOrdr();
    }, [typeChk.imprtnc, typeChk.moveToRefer, typeChk.useYn])

    useEffect(() => {
        if (editMode === 'update' && data.noticeTtl !== undefined) {
            setNewAttachments([...attachments]);
        }
    }, [editMode, data.noticeTtl]);

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
                                            <div className="checkbox-label">{check.label}:</div>
                                            <CheckBox
                                                className="checkSpace"
                                                defaultValue={check.dataField === "useYn" ? true : (
                                                    check.dataField === "imprtnc" && data.imprtncNtcBgngYmd ? true : false)}
                                                onValueChanged={(e) => {
                                                    setTypeChk({
                                                        ...typeChk,
                                                        [check.dataField]: e.value
                                                    })
                                                }}
                                            />
                                            {check.dataField === "moveToRefer" ? (
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
                                            (<img src={`/upload/${item.strgFileNm}`} style={{ width: '20%', marginBottom: '20px' }} alt={item.realFileNm} />)
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