import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { Container } from 'react-bootstrap';
import { Button } from "devextreme-react";
import ApiRequest from "utils/ApiRequest";
import NoticeJson from "../infoInq/NoticeJson.json"
import axios from 'axios';

const NoticeDetail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const noticeId = location.state.id;
    const { detailQueryId, buttonGroup } = NoticeJson.detail;
    
    const [oneData, setOneData] = useState({});
    const [fileList, setFileList] = useState([]);
    const [filesUrl, setFilesUrl] = useState([]);

    const getOneData = async () => {
        const params = {
            queryId: detailQueryId,
            noticeId: noticeId
        }
        try {
            const response = await ApiRequest("/boot/common/queryIdSearch", params);
            if (response.length !== 0) {
                setOneData(response[0]);
                const tmpFileList = response.map((data) => ({
                    realFileNm: data.realFileNm,
                    fileStrgCours: data.fileStrgCours,
                    strgFileNm: data.strgFileNm
                }));
                setFileList(prevFileList => [...prevFileList, ...tmpFileList])
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getOneData();
    }, []);

    useEffect(() => {
        if (fileList.length !== 0 && filesUrl.length === 0) {
            getFile();
        }
    }, [fileList]);

    const deleteNotice = async () => {
        const params = [{ tbNm: "NOTICE" }, { noticeId: noticeId }]
        try {
            const response = await ApiRequest("/boot/common/commonDelete", params);
            if (response === 1) {
                navigate("/infoInq/NoticeList")
            } else { alert('삭제 실패') }
        } catch (error) {
            console.log(error);
        }
    }
    const getFile = async () => {
        const newUrls = [];
        for (let i = 0; i < fileList.length; i++) {
            try {
                const response = await axios.post('/boot/common/getFile', fileList[i], {
                    responseType: 'arraybuffer'
                });
                const filename = response.headers['content-disposition'];
                const extension = filename.match(/filename="(.+)"/);
                const type = extension ? extension[1] : 'unknown';

                const blob = new Blob([response.data], { type: response.headers['content-type'] });
                const url = URL.createObjectURL(blob);
                newUrls.push({ url: url, filename: type });

            } catch (error) {
                console.error('Error: ', error);
            }
        }
        setFilesUrl(newUrls)
    }

    return (
        <div className="container">
            <div
                className="title p-1"
                style={{ marginTop: "20px", marginBottom: "10px" }}
            ></div>
            <div style={{ marginRight: "20px", marginLeft: "20px", marginBottom: "50px" }}>
                <h1 style={{ fontSize: "30px" }}>공지사항</h1>
            </div>
            <Container style={{ width: '90%', margin: '0 auto' }}>
                {oneData.length !== 0 ?
                    <>
                        <h1 style={{ marginBottom: "20px" }}>{oneData.noticeTtl}</h1>
                        <div>{oneData.regEmpId} | {oneData.regDt}</div><hr />
                        <div dangerouslySetInnerHTML={{ __html: oneData.noticeCn }} />

                        {filesUrl.map((file, index) => (
                            <div key={index}>
                                {console.log('file',file)}
                                {file.filename.endsWith('.jpg') || file.filename.endsWith('.jpeg') || file.filename.endsWith('.png') || file.filename.endsWith('.gif') ? (
                                    <img src={file.url} alt={file.filename} style={{ width: '100%', marginBottom:'20px' }} />
                                ) : (
                                    <>
                                        <h4>* 첨부파일 </h4>
                                        <a href={file.url} download={file.filename} style={{fontSize:'24px', color:'green', fontWeight:'bold'}}>{file.filename}</a>
                                    </>
                                )}
                            </div>
                        ))}
                        <hr />
                    </>
                    : ''
                }
            </Container>
            <div style={{ textAlign: 'center' }}>
                {buttonGroup.map((button, index) => (
                    <Button
                        key={index}
                        style={{ marginRight: '3px' }}
                        text={button.text}
                        type={button.type}
                        onClick={button.onClick === "deleteNotice" ? deleteNotice : () =>
                            navigate(button.onClick, { state: button.state ? { ...button.state, id: noticeId } : undefined })}
                    />
                ))}
            </div>
        </div>
    );
};
export default NoticeDetail;