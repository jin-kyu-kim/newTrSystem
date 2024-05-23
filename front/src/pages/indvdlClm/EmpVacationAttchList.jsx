import { useState, useEffect } from "react";
import { Popup, FileUploader, Button } from "devextreme-react";

// 랜덤채번 import
import uuid from "react-uuid";

import ApiRequest from "utils/ApiRequest";
import { useModal } from "components/unit/ModalContext";

import axios from "axios";

const EmpVacationAttchList = ({ visible, attachId, onHiding, elctrnAtrzId }) => {
    const { handleOpen } = useModal();

    // 첨부파일조회
    useEffect(() => {
        selectData();
    }, [])

    // 첨부파일조회
    const [attachListValue, setAttachListValue] = useState([]);

    // 첨부파일조회
    const selectData = async () => {
        try {
            const response = await ApiRequest('/boot/common/commonSelect', [ { tbNm: "ATCHMNFL" }, { atchmnflId: attachId } ]);
            setAttachListValue(response);
        } catch (error) {
            console.log("selectData_error : ", error);
        }
    };




    // 첨부파일저장
    const [insertAttachListValue, setInsertAttachListValue] = useState();

    // 첨부파일삭제
    const [deleteAttachListValue, setDeleteAttachListValue] = useState([{tbNm: "ATCHMNFL"}]);




    
    function changeAttchValue(e) {
        setInsertAttachListValue(e.value);
    }





    // 첨부파일삭제
    function onDelete(attachValue) {
        let existAttachList = attachListValue.filter(item => item.atchmnflSn != attachValue.atchmnflSn);
        let deleteAttachList = attachListValue.filter(item => item.atchmnflSn == attachValue.atchmnflSn)[0];
        setAttachListValue(existAttachList);
        setInsertAttachListValue(existAttachList);

        let deleteData = [
            { tbNm: "ATCHMNFL" }, 
            { atchmnflId: deleteAttachList.atchmnflId ,atchmnflSn: deleteAttachList.atchmnflSn, strgFileNm: deleteAttachList.strgFileNm }
        ];

        onDeleteClick(deleteData);
    }

    // 첨부파일삭제
    const onDeleteClick = async (deleteData) => {
        const formData = new FormData();

        formData.append("tbNm", JSON.stringify({tbNm: "VCATN_ATRZ"}));
        formData.append("idColumn", JSON.stringify({elctrnAtrzId: elctrnAtrzId}));
        formData.append("deleteFiles", JSON.stringify(deleteData));

        if(insertAttachListValue && insertAttachListValue.length > 0 ) Object.values(insertAttachListValue).forEach((insertAttachList) => formData.append("attachments", insertAttachList));

        if(attachId){
            formData.append("data", JSON.stringify({atchmnflId: attachId}));
        } else {
            formData.append("data", JSON.stringify({atchmnflId : uuid()}));
        }

        const responseAttach = await axios.post("/boot/common/insertlongText", formData, {
            headers: { 'Content-Type': 'multipart/form-data', "Authorization": `Bearer ${localStorage.getItem("token")}` },
        });
    }





    // 첨부파일저장
    const onSaveClick = async () => {
        const formData = new FormData();

        formData.append("tbNm", JSON.stringify({tbNm: "VCATN_ATRZ"}));
        formData.append("idColumn", JSON.stringify({elctrnAtrzId: elctrnAtrzId}));
        formData.append("deleteFiles", JSON.stringify(deleteAttachListValue));

        try{
            if(insertAttachListValue && insertAttachListValue.length > 0 ) Object.values(insertAttachListValue).forEach((insertAttachList) => formData.append("attachments", insertAttachList));

            if(attachId){
                formData.append("data", JSON.stringify({atchmnflId: attachId}));
            } else {
                formData.append("data", JSON.stringify({atchmnflId : uuid()}));
            }

            const responseAttach = await axios.post("/boot/common/insertlongText", formData, {
                headers: { 'Content-Type': 'multipart/form-data', "Authorization": `Bearer ${localStorage.getItem("token")}` },
            });
            handleOpen("저장되었습니다.")
            onHiding(false)
        } catch {
            handleOpen("저장에 실패했습니다.")
        }
    }





    // 화면렌더링
    function createRenderData() {
        const renderData = [];
        
        for (let i = 0; i < attachListValue.length; i++) {
            renderData.push(
                <div key={"attachList" + i} style={{ marginTop: "10px" }}>
                    <a key={"attachLink" + i} style={{ fontSize: "16px" }} href={`/upload/${attachListValue[i].strgFileNm}`} download={attachListValue[i].realFileNm}>{attachListValue[i].realFileNm}</a>
                    <button style={buttonStyle} onClick={() => { onDelete(attachListValue[i]) }}>X</button>
                </div>
            )
        }

        return (
            <>
                <div>{renderData}</div>
                <div>
                    <FileUploader
                        selectButtonText="첨부파일"
                        multiple={true}
                        labelText=""
                        uploadMode="useButton"
                        onValueChanged={changeAttchValue}
                    />
                </div>
                <div style={{ display: "inline-block", float: "right", marginTop: "25px" }}>
                    <Button style={{ height: "48px", width: "60px", marginRight: "15px"}} onClick={onSaveClick}>저장</Button>
                </div>
            </>
        )
    }


    return (
        <div>
            <Popup
                width={"500px"}
                height={"500px"}
                visible={visible}
                showCloseButton={true}
                contentRender={createRenderData}
                title={"전자결재 파일 첨부"}
                onHiding={() => { onHiding(false) }}
            />
        </div>
    )
}

export default EmpVacationAttchList;

const buttonStyle = {
    backgroundColor: "transparent",
    color: "red",
    border: "none",
    cursor: "pointer",
    padding: 0,
    marginLeft: "15px",
}