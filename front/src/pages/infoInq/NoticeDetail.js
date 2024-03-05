import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { Container } from 'react-bootstrap';
import { Button } from "devextreme-react";
import ApiRequest from "utils/ApiRequest";
import NoticeJson from "../infoInq/NoticeJson.json"

const NoticeDetail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const noticeId = location.state.id;
    const { detailQueryId, buttonGroup } = NoticeJson.detail;
    const [oneData, setOneData] = useState([]);

    const getOneData = async () => {
        const params = {
            queryId: detailQueryId,
            noticeId: noticeId
        }
        try {
            const response = await ApiRequest("/boot/common/queryIdSearch", params);
            if (response.length !== 0) {
                setOneData(response);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getOneData();
        getFiles();
    }, []);

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
    const getFiles = async () => {

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
                        <h1 style={{ marginBottom: "20px" }}>{oneData[0].noticeTtl}</h1>
                        <div>{oneData[0].regEmpId} | {oneData[0].regDt}</div><hr />

                        <div dangerouslySetInnerHTML={{ __html: oneData[0].noticeCn }} />
                        {oneData.map((data, index) => (
                            data.realFileNm && data.fileStrgCours && (
                                <div key={index}>
                                    {data.realFileNm.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                                        <>
                                            <div>
                                                <img src={data.fileStrgCours} alt="첨부 이미지" className="img-fluid" />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <p>*첨부 파일:</p>
                                        </>
                                    )}
                                </div>
                            )
                        ))}<hr />
                    </>
                    : <></>
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