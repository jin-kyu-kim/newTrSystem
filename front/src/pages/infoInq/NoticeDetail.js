import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { Container } from 'react-bootstrap';
import { useModal } from "../../components/unit/ModalContext";
import { Button } from "devextreme-react";
import ApiRequest from "utils/ApiRequest";
import NoticeJson from "../infoInq/NoticeJson.json";

const NoticeDetail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const noticeId = location.state.id;
    const userAuth = JSON.parse(localStorage.getItem("userAuth"));
    const { detailQueryId, noticeButtonGroup, dirType } = NoticeJson.detail;
    const [ oneData, setOneData ] = useState({});
    const [ fileList, setFileList ] = useState([]);
    const [ btnVisible , setBtnVisible ] = useState(false);
    const { handleOpen } = useModal();
    const fileDir = fileList[0]?.fileStrgCours ? fileList[0]?.fileStrgCours.substring(8) : null;

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
                    strgFileNm: data.strgFileNm,
                    fileStrgCours: data.fileStrgCours
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
        if (userAuth && Array.isArray(userAuth) && userAuth.includes("VTW04801")) {
            setBtnVisible(true);
        }
    }, []);

    useEffect(() => {
        const resizeImages = () => {
            const container = document.getElementById('notice-content');
            if (container) {
                const images = container.getElementsByTagName('img');
                for (let img of images) {
                    img.style.width = '100%';
                }
            }
        };
        resizeImages();
    }, [oneData]);

    const deleteNotice = async () => {
        const params = [{ tbNm: "NOTICE" }, { noticeId: noticeId }];
        const fileParams = [{ tbNm: "ATCHMNFL" }, { atchmnflId: oneData.atchmnflId }];
        try {
            const response = await ApiRequest("/boot/common/deleteWithFile", {
                params: params, fileParams: fileParams, dirType: dirType
            });
            if (response >= 1) {
                navigate("/infoInq/NoticeList")
            } else { handleOpen('삭제 실패') }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="container" style={{ width: '90%' }}>
            <div className='title'>공지사항</div>

            <Container style={{ margin: '50px auto' }}>
                {oneData.length !== 0 ?
                    <>
                        <h2 style={{ marginBottom: "30px" }}>{oneData.noticeTtl}</h2>
                        <div>{oneData.regEmpNm} | {oneData.regDt}</div><hr className='elecDtlLine' />
                        <div id="notice-content" dangerouslySetInnerHTML={{ __html: oneData.noticeCn }} />

                        {fileList.length !== 0 && fileList.filter(file => file.realFileNm !== null && file.realFileNm !== undefined).filter(file => file.realFileNm.endsWith('.jpg') || file.realFileNm.endsWith('.jpeg') || file.realFileNm.endsWith('.png') || file.realFileNm.endsWith('.gif')).map((file, index) => (
                            <div key={index} style={{ textAlign: 'center' }}>
                                <img src={`${fileDir}/${file.strgFileNm}`}
                                    style={{ width: '80%', marginBottom: '20px' }} alt={file.realFileNm} />
                            </div>
                        ))}<hr className='elecDtlLine' />

                        <div style={{ fontWeight: 'bold' }}>* 첨부파일</div>
                        {fileList.length !== 0 && fileList.filter(file => file.realFileNm !== null && file.realFileNm !== undefined).filter(file => !(file.realFileNm.endsWith('.jpg') || file.realFileNm.endsWith('.jpeg') || file.realFileNm.endsWith('.png') || file.realFileNm.endsWith('.gif'))).map((file, index) => (
                            <div key={index}>
                                <a href={`${fileDir}/${file.strgFileNm}`} download={file.realFileNm} style={{ fontSize: '18px', color: 'blue', fontWeight: 'bold' }}>{file.realFileNm}</a>
                            </div>
                        ))}
                        <hr className='elecDtlLine' />
                    </> : ''
                }
            </Container>

            <div style={{ textAlign: 'center', marginBottom: '100px' }}>
                {noticeButtonGroup.map((button, index) => (
                    <Button
                        key={index}
                        visible={button.btnAlways ? true : btnVisible}
                        style={{ marginRight: '3px' }}
                        text={button.text}
                        type={button.type}
                        onClick={button.onClick === "deleteNotice" ? () => handleOpen('삭제하시겠습니까?', deleteNotice, true) : () =>
                            navigate(button.onClick, { state: button.state ? { ...button.state, id: noticeId } : undefined })}
                    />
                ))}
            </div>
        </div>
    );
};
export default NoticeDetail;