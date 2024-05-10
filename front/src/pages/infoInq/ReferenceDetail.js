import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { Container } from 'react-bootstrap';
import { Button } from "devextreme-react";
import ApiRequest from "utils/ApiRequest";
import NoticeJson from "../infoInq/NoticeJson.json"

const ReferenceDetail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const noticeId = location.state.id;
    const { detailQueryId, referButtonGroup } = NoticeJson.detail;

    const [oneData, setOneData] = useState({});
    const [fileList, setFileList] = useState([]);

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
                    strgFileNm: data.strgFileNm
                }));
                if (fileList.length === 0) {
                    setFileList(prevFileList => [...prevFileList, ...tmpFileList]);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getOneData();
    }, []);

    const deleteReference = async () => {
        const result = window.confirm("삭제하시겠습니까?") 
        if(result){
            const params = [{ tbNm: "NOTICE" }, { noticeId: noticeId }]
            const fileParams = [{ tbNm: "ATCHMNFL" }, { atchmnflId: oneData.atchmnflId }]
            try {
                const response = await ApiRequest("/boot/common/deleteWithFile", {
                    params: params, fileParams: fileParams
                });
                if (response >= 1) {
                    navigate("/infoInq/ReferenceList")
                } else { alert('삭제 실패') }
            } catch (error) {
                console.log(error);
            }
        }
    }

    return (
        <div className="container">
            <div
                className="title p-1"
                style={{ marginTop: "20px", marginBottom: "10px" }}
            ></div>
            <div style={{ marginRight: "20px", marginLeft: "20px", marginBottom: "50px" }}>
                <h1 style={{ fontSize: "30px" }}>자료실</h1>
            </div>
            <Container style={{ width: '90%', margin: '0 auto' }}>
                {oneData.length !== 0 ?
                    <>
                        <h1 style={{ marginBottom: "20px" }}>{oneData.noticeTtl}</h1>
                        <div>{oneData.regEmpNm} | {oneData.regDt}</div><hr />
                        <div dangerouslySetInnerHTML={{ __html: oneData.noticeCn }} />

                        {fileList.length !== 0 && fileList.filter(file => file.realFileNm !== null && file.realFileNm !== undefined).filter(file => file.realFileNm.endsWith('.jpg') || file.realFileNm.endsWith('.jpeg') || file.realFileNm.endsWith('.png') || file.realFileNm.endsWith('.gif')).map((file, index) => (
                            <div key={index} style={{ textAlign: 'center' }}>
                                <img src={`/upload/${file.strgFileNm}`}
                                    style={{ width: '80%', marginBottom: '20px' }} alt={file.realFileNm} />
                            </div>
                        ))}<hr />

                        <div style={{ fontWeight: 'bold' }}>* 첨부파일</div>
                        {fileList.length !== 0 && fileList.filter(file => file.realFileNm !== null && file.realFileNm !== undefined).filter(file => !(file.realFileNm.endsWith('.jpg') || file.realFileNm.endsWith('.jpeg') || file.realFileNm.endsWith('.png') || file.realFileNm.endsWith('.gif'))).map((file, index) => (
                            <div key={index}>
                                <a href={`/upload/${file.strgFileNm}`} download={file.realFileNm} style={{ fontSize: '18px', color: 'blue', fontWeight: 'bold' }}>{file.realFileNm}</a>
                            </div>
                        ))}
                        <hr />
                    </> : ''
                }
            </Container>
            <div style={{ textAlign: 'center', marginBottom: '100px' }}>
                {referButtonGroup.map((button, index) => (
                    <Button
                        key={index}
                        style={{ marginRight: '3px' }}
                        text={button.text}
                        type={button.type}
                        onClick={button.onClick === "deleteReference" ? deleteReference : () =>
                            navigate(button.onClick, { state: button.state ? { ...button.state, id: noticeId } : undefined })}
                    />
                ))}
            </div>
        </div>
    );
};
export default ReferenceDetail;