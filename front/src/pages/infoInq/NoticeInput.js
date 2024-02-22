import React, { useState, useCallback, useEffect } from "react";
import { useCookies } from "react-cookie";
import uuid from 'react-uuid'
import { useLocation, useNavigate } from "react-router";
import { TextBox, FileUploader, Button } from "devextreme-react";
import HtmlEditor, {
    Toolbar,
    MediaResizing,
    ImageUpload,
    Item,
} from "devextreme-react/html-editor";
import CheckBox from "devextreme-react/check-box";

import CustomDateRangeBox from "components/unit/CustomDateRangeBox";
import "../../assets/css/Style.css";
import ApiRequest from "utils/ApiRequest";

const NoticeInput = () => {
    const navigate = useNavigate();

    const [cookies, setCookie] = useCookies(["userInfo", "userAuth"]);
    const empId = cookies.userInfo.empId;
    const date = new Date();

    const [noticeTtl, setNoticeTtl] = useState("");
    const [noticeCn, setNoticeCn] = useState("");
    const [attachments, setAttachments] = useState([]);
    const [data, setData] = useState({
        noticeId: uuid(),
        noticeTtl: "",
        noticeCn: "",
        regEmpId: empId,
        regDt : date.toISOString().split('T')[0]+' '+date.toTimeString().split(' ')[0]
    });

    const [isMultiline, setIsMultiline] = useState(true);
    const multilineChanged = useCallback(
        (e) => {
            setIsMultiline(e.value);
        },
        [setIsMultiline]
    );
    const handleAttachmentChange = (e) => {
        setAttachments(e.value);
    };
    const handleStartDateChange = (newStartDate) => {
        // 시작일자가 변경될 때 수행할 로직 추가
        setData({
            ...data,
            imprtncNtcBgngYmd: newStartDate,
        });
    };
    const handleEndDateChange = (newEndDate) => {
        // 종료일자가 변경될 때 수행할 로직 추가
        setData({
            ...data,
            imprtncNtcEndYmd: newEndDate,
        });
    };
    
    const onClick = () => {
        const isconfirm = window.confirm("공지사항을 등록하시겠습니까?");
        if (isconfirm) {
            insertNotice();
        }
    }

    const insertNotice = async () => {
        const param = [
            { tbNm: "NOTICE" },
            data
        ];
        try {
            // const response = await ApiRequest("/boot/common/commonSelect", param);
            // setData(response[0]);
        } catch (error) {
            console.error('Error fetching data', error);
        }
    }

    return (
        <div className="container">
            <div
                className="title p-1"
                style={{ marginTop: "20px", marginBottom: "10px" }}
            >
                <h1 style={{ fontSize: "40px" }}>공지사항</h1>
            </div>
            <div className="col-md-10 mx-auto" style={{ marginBottom: "10px" }}>
                <span>* 공지사항을 입력합니다.</span>
            </div>

            <table className="notice-table">
                <colgroup>
                    <col style={{ width: "25%" }} />
                    <col style={{ width: "75%" }} />
                </colgroup>

                <tbody>
                    <tr>
                        <td className="input-column">제목</td>
                        <td>
                            {/* <TextBox
                                id="noticeTtl"
                                value={noticeTtl}
                                onValueChanged={onChangeValue}
                                placeholder="제목"
                            /> */}
                            <input type='text' value={noticeTtl}
                                onChange={(e) => setNoticeTtl(e.target.value)}
                                style={{ width: '100%' }} />
                        </td>
                    </tr>
                    <tr>
                        <td className="input-column">설정</td>
                        <td>

                            <div className="checkbox-wrapper">
                                <div className="checkbox-label">
                                    상단공지:
                                </div>
                                <CheckBox className='checkSpace' />
                                <CustomDateRangeBox
                                    onStartDateChange={handleStartDateChange}
                                    onEndDateChange={handleEndDateChange}
                                />
                            </div>
                            <div className="checkbox-wrapper">
                                <div className="checkbox-label">
                                    메인화면 팝업 공지:
                                </div>

                                <CheckBox className='checkSpace' />
                                <CustomDateRangeBox
                                    onStartDateChange={handleStartDateChange}
                                    onEndDateChange={handleEndDateChange}
                                />
                            </div>
                            <div className="checkbox-wrapper">
                                <div className="checkbox-label">
                                    공지 표시여부:
                                </div>
                                <CheckBox className='checkSpace' />
                                <CustomDateRangeBox
                                    onStartDateChange={handleStartDateChange}
                                    onEndDateChange={handleEndDateChange}
                                />
                            </div>
                            <div className='checkbox-wrapper'>
                                <div className="checkbox-label">
                                    자료실로 이관:
                                </div>
                                <CheckBox />
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td className="input-column">내용</td>
                        <td>
                            <div>
                                {/* Html Editor */}
                                <HtmlEditor
                                    height="725px"
                                    defaultValue=""
                                    value={noticeCn}
                                    onChange={(e) => setNoticeCn(e.target.value)}
                                    placeholder="내용"
                                >
                                    <MediaResizing enabled={true} />
                                    <ImageUpload fileUploadMode="base64" />
                                    <Toolbar multiline={isMultiline}>
                                        <Item name="undo" />
                                        <Item name="redo" />
                                        <Item name="separator" />
                                        <Item
                                            name="size"
                                            acceptedValues={sizeValues}
                                            options={fontSizeOptions}
                                        />
                                        <Item
                                            name="font"
                                            acceptedValues={fontValues}
                                            options={fontFamilyOptions}
                                        />
                                        <Item name="separator" />
                                        <Item name="bold" />
                                        <Item name="italic" />
                                        <Item name="strike" />
                                        <Item name="underline" />
                                        <Item name="separator" />
                                        <Item name="alignLeft" />
                                        <Item name="alignCenter" />
                                        <Item name="alignRight" />
                                        <Item name="alignJustify" />
                                        <Item name="separator" />
                                        <Item name="orderedList" />
                                        <Item name="bulletList" />
                                        <Item name="separator" />
                                        <Item
                                            name="header"
                                            acceptedValues={headerValues}
                                            options={headerOptions}
                                        />
                                        <Item name="separator" />
                                        <Item name="color" />
                                        <Item name="background" />
                                        <Item name="separator" />
                                        <Item name="link" />
                                        <Item name="separator" />
                                        <Item name="clear" />
                                        <Item name="codeBlock" />
                                        <Item name="blockquote" />
                                        <Item name="separator" />
                                    </Toolbar>
                                </HtmlEditor>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td className="input-column">첨부파일</td>
                        <td>
                            <FileUploader
                                multiple={true}
                                accept="image/*" // 허용되는 파일 유형
                                uploadMode="useForm" // 업로드 모드 설정 - form데이터와 함께 제출
                                onValueChanged={handleAttachmentChange}
                            />
                        </td>
                    </tr>
                </tbody>
            </table>

            <div className="wrap_btns inputFormBtn">
                <Button
                    id="button"
                    text="목록"
                    className="btn_submit filled_gray"
                    onClick={() => navigate('/infoInq/NoticeList')}
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

{/* HtmlEditor 속성 */ }
const sizeValues = ["8pt", "10pt", "12pt", "14pt", "18pt", "24pt", "36pt"];
const fontValues = [
    "Arial",
    "Courier New",
    "Georgia",
    "Impact",
    "Lucida Console",
    "Tahoma",
    "Times New Roman",
    "Verdana",
];
const headerValues = [false, 1, 2, 3, 4, 5];
const fontSizeOptions = {
    inputAttr: {
        "aria-label": "Font size",
    },
};
const fontFamilyOptions = {
    inputAttr: {
        "aria-label": "Font family",
    },
};
const headerOptions = {
    inputAttr: {
        "aria-label": "Font family",
    },
};

