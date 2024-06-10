import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { Container } from 'react-bootstrap';
import { useModal } from "../../components/unit/ModalContext";
import { Button } from "devextreme-react";
import ApiRequest from "utils/ApiRequest";
import CustomCdComboBox from "../../components/unit/CustomCdComboBox";
import CsServiceJson from "../sysMng/CsServiceJson.json";
import CsServiceReply from "./CsServiceReply";

const CsServiceDetail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const errId = location.state.id;
    const errPrcsSttsCd = location.state?.errPrcsSttsCd;
    const errPrcsSttsCdNm = location.state?.errPrcsSttsCdNm;
    const { detailQueryId, sysButtonGroup, dirType } = CsServiceJson.detail;
    const [ oneData, setOneData ] = useState({});
    const [ fileList, setFileList ] = useState([]);
    const [ prcsSttsCd, setPrcsSttsCd ] = useState(errPrcsSttsCd);
    const [ hasPermission, setPermission ] = useState(false);
    const [ btnVisible, setBtnVisible ] = useState(false);
    const { handleOpen } = useModal();
    const userAuth = JSON.parse(localStorage.getItem("userAuth"));
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const fileDir = fileList[0]?.fileStrgCours ? fileList[0]?.fileStrgCours.substring(8) : null;

    const getOneData = async () => {
        const params = {
            queryId: detailQueryId,
            errId: errId
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
                if (response[0].regEmpId === userInfo.empId) {
                    setBtnVisible(true);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getOneData();
        if (userAuth && Array.isArray(userAuth) && userAuth.includes("VTW04801")) {
            setPermission(true);
            setBtnVisible(true);
        } else {
            setPermission(false);
            setBtnVisible(false);
        }
    }, []);

    const deleteReference = async () => {
        const params = [{ tbNm: "ERR_MNG" }, { errId: errId }];
        const fileParams = [{ tbNm: "ATCHMNFL" }, { atchmnflId: oneData.atchmnflId }];
        try {
            const response = await ApiRequest("/boot/common/deleteWithFile", {
                params: params, fileParams: fileParams, dirType: dirType
            });
            if (response >= 1) {
                navigate("/sysMng/CsServiceList")
                handleOpen('삭제되었습니다.')
            } else { handleOpen('삭제 실패') }
        } catch (error) {
            console.log(error);
        }
    }
    const chgPrcsSttsCd = async ({ value }) => {
        if(value !== prcsSttsCd){
            const response = await ApiRequest('/boot/common/commonUpdate', [
                { tbNm: "ERR_MNG" }, { errPrcsSttsCd: value }, { errId: errId }
            ]);
            if(response >= 1){
                setPrcsSttsCd(value);
                getOneData();
                handleOpen("조치상태가 수정되었습니다.");
            }
        }
    }

    return (
        <div className="container" style={{ width: '90%' }}>
            <div className='title'>오류 게시판</div>

            <Container style={{ margin: '50px auto' }}>
                {oneData.length !== 0 ?
                    <>
                        <h2 style={{ marginBottom: "30px" }}>{oneData.errTtl}</h2>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                            {oneData.regEmpNm} | {oneData.regDt}
                            <div style={{ marginLeft: "30px", marginRight: '20px' }}> 접수상태 :</div>
                            {hasPermission ? ( 
                            <div style={{ width: '200px' }}>
                                <CustomCdComboBox param="VTW055" value={prcsSttsCd} onSelect={chgPrcsSttsCd} showClearValue={false} />
                            </div> 
                            ) : ( <div>{errPrcsSttsCdNm}</div> )}
                        </div>
                        <hr className='elecDtlLine' />
                        <div dangerouslySetInnerHTML={{ __html: oneData.errCn }} />

                        {fileList.length !== 0 && fileList.filter(file => file.realFileNm !== null && file.realFileNm !== undefined).filter(file => file.realFileNm.endsWith('.jpg') || file.realFileNm.endsWith('.jpeg') || file.realFileNm.endsWith('.png') || file.realFileNm.endsWith('.gif')).map((file, index) => (
                            <div key={index} style={{ textAlign: 'center' }}>
                                <img src={`${fileDir}/${file.strgFileNm}`}
                                    style={{ width: '80%', marginBottom: '20px' }} alt={file.realFileNm} />
                            </div>
                        ))}
                        <hr className='elecDtlLine' />

                        <div style={{ fontWeight: 'bold' }}>* 첨부파일</div>
                        {fileList.length !== 0 && fileList.filter(file => file.realFileNm !== null && file.realFileNm !== undefined).filter(file => !(file.realFileNm.endsWith('.jpg') || file.realFileNm.endsWith('.jpeg') || file.realFileNm.endsWith('.png') || file.realFileNm.endsWith('.gif'))).map((file, index) => (
                            <div key={index}>
                                <a href={`${fileDir}/${file.strgFileNm}`} download={file.realFileNm}
                                    style={{ fontSize: '18px', color: 'blue', fontWeight: 'bold' }}>{file.realFileNm}</a>
                            </div>
                        ))}
                        <hr className='elecDtlLine' />
                    </> : ''
                }
                <div className="CsServiceReplyGrid" style={{ marginBottom: '100px' }}>
                    <CsServiceReply errId={errId} />
                </div>
            </Container>

            <div style={{ textAlign: 'center', marginBottom: '100px' }}>
                {sysButtonGroup.map((button, index) => (
                    <Button
                        key={index}
                        visible={button.btnAlways ? true : btnVisible}
                        style={{ marginRight: '3px' }}
                        text={button.text}
                        type={button.type}
                        onClick={button.onClick === "deleteReference" ? () => handleOpen('삭제하시겠습니까?', deleteReference, true) : () =>
                            navigate(button.onClick, { state: button.state ? { ...button.state, id: errId } : undefined })}
                    />
                ))}
            </div>
        </div>
    );
};
export default CsServiceDetail;