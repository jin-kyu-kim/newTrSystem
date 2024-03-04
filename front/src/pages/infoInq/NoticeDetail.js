import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { Container, Card } from 'react-bootstrap';
import { Button } from "devextreme-react";
import Gallery from 'devextreme-react/gallery';
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
    }, []);

    const DownloadLink = ({ url, fileName }) => {
        const handleDownload = () => {
            // 파일 다운로드 로직
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            link.click();
        };
        return (
            <Button
                onClick={handleDownload}
                style={{ marginBottom: '10px' }}
                icon="download"
            >
                {fileName}
            </Button>
        );
    };

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

    return (
        <div className="container">
            <div
                className="title p-1"
                style={{ marginTop: "20px", marginBottom: "10px" }}
            ></div>
            <div style={{ marginRight: "20px", marginLeft: "20px" }}>
                <h1 style={{ fontSize: "30px" }}>공지사항</h1>
            </div>
            <Container>
                <Card className="mb-4">
                    <Card.Body>
                        {oneData.length !== 0 ?
                            <>
                                <Card.Title>{oneData[0].noticeTtl}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">
                                    {oneData[0].regEmpId} | {oneData[0].regDt}
                                </Card.Subtitle>
                                <hr />
                                <Card.Text><div dangerouslySetInnerHTML={{ __html: oneData[0].noticeCn }} /></Card.Text><hr />
                                <p>첨부 파일:</p>
                                {oneData.map((data, index) => (
                                    data.realFileNm && data.fileStrgCours && (
                                        <>
                                            {data.realFileNm.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                                                <div>
                                                    <img src={data.fileStrgCours} alt="첨부 이미지" className="img-fluid" />
                                                    <Gallery
                                                        id={`gallery-${index}`}
                                                        dataSource={data.fileStrgCours}
                                                        height={300}
                                                    />
                                                </div>
                                            ) : (
                                                <DownloadLink url={data.fileStrgCours} fileName={data.realFileNm} />
                                            )}
                                        </>
                                    )
                                ))}
                            </>
                            : <></>
                        }
                    </Card.Body>
                </Card>
            </Container>

            {buttonGroup.map((button, index) => {
                <Button
                key={index}
                id={"button" + button.id}
                text={button.text}
                type={button.type}
                onClick={button.onClick === "deleteNotice" ? deleteNotice : () => navigate(button.onClick, { state: button.state })}
              />
            })}
        </div>
    );
};
export default NoticeDetail;