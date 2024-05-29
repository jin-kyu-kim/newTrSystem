import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { Container } from 'react-bootstrap';
import { useModal } from "../../components/unit/ModalContext";
import { Button } from "devextreme-react";
import ApiRequest from "utils/ApiRequest";
import NoticeJson from "../sysMng/CsServiceJson.json";
import CsServiceReply from "./CsServiceReply";
import CustomCdComboBox from "../../components/unit/CustomCdComboBox";

const CsServiceDetail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const errId = location.state.id;
    const errPrcsSttsCd = location.state?.errPrcsSttsCd;
    const errPrcsSttsCdNm = location.state?.errPrcsSttsCdNm;
    const { detailQueryId, sysButtonGroup } = NoticeJson.detail;
    const [oneData, setOneData] = useState({});
    const [fileList, setFileList] = useState([]);
    const [errorCd, setErrorCd] = useState(errPrcsSttsCd);
    const [hasPermission, setPermission] = useState(false);
    const { handleOpen } = useModal();
    const userAuth = JSON.parse(localStorage.getItem("userAuth"));
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const [btnYn , setBtnYn] = useState(false);

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
                    strgFileNm: data.strgFileNm
                }));
                if (fileList.length === 0) {
                    setFileList(prevFileList => [...prevFileList, ...tmpFileList]);
                }
                if(response[0].regEmpId === userInfo.empId){
                    setBtnYn(true);
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
            setBtnYn(true);
        } else {
            setPermission(false);
        }
    }, []);

    const deleteReference = async () => {
        const params = [{ tbNm: "ERR_MNG" }, { errId: errId }];
        const fileParams = [{ tbNm: "ATCHMNFL" }, { atchmnflId: oneData.atchmnflId }];
        try {
            const response = await ApiRequest("/boot/common/deleteWithFile", {
                params: params, fileParams: fileParams
            });
            if (response >= 1) {
                navigate("/sysMng/CsServiceList")
                handleOpen('삭제되었습니다.')
            } else { handleOpen('삭제 실패') }
        } catch (error) {
            console.log(error);
        }
    }
    const test = ({name, value}) =>{
        setErrorCd(value);
    }

    return (
        <div className="container">
            <div className="title p-1" style={{ marginTop: "20px", marginBottom: "10px" }}></div>
            <div style={{ marginRight: "20px", marginLeft: "20px", marginBottom: "50px" }}>
                <h1 style={{ fontSize: "30px" }}>오류 게시판</h1>
            </div>

            <Container style={{width: '90%', margin: '0 auto'}}>
                {oneData.length !== 0 ?
                    <>
                        <h1 style={{marginBottom: "20px"}}>{oneData.errTtl}</h1>
                       <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                        {oneData.regEmpNm} | {oneData.regDt}
                           <div style={{ marginLeft:"30px"}}> 접수상태 :</div>
                           {hasPermission ? (
                               <div style={{ width: '200px' }}>
                                   <CustomCdComboBox param="VTW055" value={errorCd} onSelect={test} showClearValue={false}/>
                               </div>
                           ) : (
                               <div>
                                   {errPrcsSttsCdNm}
                               </div>
                           )}
                        </div>
                        <hr/>
                        <div dangerouslySetInnerHTML={{__html: oneData.errCn}}/>

                        {fileList.length !== 0 && fileList.filter(file => file.realFileNm !== null && file.realFileNm !== undefined).filter(file => file.realFileNm.endsWith('.jpg') || file.realFileNm.endsWith('.jpeg') || file.realFileNm.endsWith('.png') || file.realFileNm.endsWith('.gif')).map((file, index) => (
                            <div key={index} style={{textAlign: 'center'}}>
                                <img src={`/upload/${file.strgFileNm}`}
                                     style={{width: '80%', marginBottom: '20px'}} alt={file.realFileNm}/>
                            </div>
                        ))}
                        <hr/>

                        <div style={{fontWeight: 'bold'}}>* 첨부파일</div>
                        {fileList.length !== 0 && fileList.filter(file => file.realFileNm !== null && file.realFileNm !== undefined).filter(file => !(file.realFileNm.endsWith('.jpg') || file.realFileNm.endsWith('.jpeg') || file.realFileNm.endsWith('.png') || file.realFileNm.endsWith('.gif'))).map((file, index) => (
                            <div key={index}>
                                <a href={`/upload/${file.strgFileNm}`} download={file.realFileNm}
                                   style={{fontSize: '18px', color: 'blue', fontWeight: 'bold'}}>{file.realFileNm}</a>
                            </div>
                        ))}
                        <hr/>
                    </> : ''
                }
                <div className="CsServiceReplyGrid" style={{marginBottom: '100px'}}>
                    <CsServiceReply errId={errId}/>
                </div>
            </Container>


            <div style={{textAlign: 'center', marginBottom: '100px'}}>
                {sysButtonGroup.map((button, index) => (
                    <Button
                        key={index}
                        style={{ marginRight: '3px' }}
                        text={button.text}
                        type={button.type}
                        onClick={button.onClick === "deleteReference" ? () => handleOpen('삭제하시겠습니까?', deleteReference, true) : () =>
                            navigate(button.onClick, { state: button.state ? { ...button.state, id: errId } : undefined })}
                        visible={button.btnAlways?true: btnYn}
                    />
                ))}
            </div>
        </div>
    );
};
export default CsServiceDetail;