import { useState, useEffect } from "react";
import { Popup, FileUploader, Button } from "devextreme-react";
import { useModal } from "components/unit/ModalContext";
import uuid from "react-uuid";
import axios from "axios";
import ApiRequest from "utils/ApiRequest";

const EmpVacationAttchList = ({ visible, attachId, onHiding, elctrnAtrzId }) => {
    const [ attachListValue, setAttachListValue ] = useState([]);
    const [ insertAttachListValue, setInsertAttachListValue ] = useState(); // 첨부파일저장
    const [ deleteAttachListValue, setDeleteAttachListValue ] = useState([{ tbNm: "ATCHMNFL" }]); // 첨부파일삭제
    const { handleOpen } = useModal();

    useEffect(() => { selectData(); }, [])

    const selectData = async () => {
        try {
            const response = await ApiRequest('/boot/common/commonSelect', [{ tbNm: "ATCHMNFL" }, { atchmnflId: attachId }]);
            setAttachListValue(response);
        } catch (error) {
            console.log("selectData_error : ", error);
        }
    };

    function changeAttchValue(e) {
        setInsertAttachListValue(e.value);
    }

    // 첨부파일삭제
    function onDelete(attachValue) {
        let existAttachList = attachListValue.filter(item => item.atchmnflSn != attachValue.atchmnflSn);
        let deleteAttachList = attachListValue.filter(item => item.atchmnflSn == attachValue.atchmnflSn)[0];
        setAttachListValue(existAttachList);
        setInsertAttachListValue(existAttachList);

        setDeleteAttachListValue([...deleteAttachListValue, 
            {atchmnflId: deleteAttachList.atchmnflId ,atchmnflSn: deleteAttachList.atchmnflSn, strgFileNm: deleteAttachList.strgFileNm}]);
    }

    // 첨부파일 수정 (저장/삭제)
    const onSaveClick = async () => {
        const formData = new FormData();

        formData.append("tbNm", JSON.stringify({ tbNm: "VCATN_ATRZ" }));
        formData.append("idColumn", JSON.stringify({ elctrnAtrzId: elctrnAtrzId }));
        formData.append("deleteFiles", JSON.stringify(deleteAttachListValue));

        try {
            if (insertAttachListValue && insertAttachListValue.length > 0) Object.values(insertAttachListValue).forEach((insertAttachList) => formData.append("attachments", insertAttachList));

            if (attachId) {
                formData.append("data", JSON.stringify({ atchmnflId: attachId, dirType: 'elec' }));
            } else {
                formData.append("data", JSON.stringify({ atchmnflId: uuid(), dirType: 'elec' }));
            }
            const responseAttach = await axios.post("/boot/common/insertlongText", formData, {
                headers: { 'Content-Type': 'multipart/form-data', "Authorization": `Bearer ${localStorage.getItem("token")}` },
            });
            if(responseAttach.status === 200){
                handleOpen("저장되었습니다.")
                onHiding(false)
            }
        } catch {
            handleOpen("저장에 실패했습니다.")
        }
    }

    function createRenderData() {
        const renderData = [];
        const fileDir = attachListValue[0]?.fileStrgCours ? attachListValue[0]?.fileStrgCours.substring(8) : null;

        for (let i = 0; i < attachListValue.length; i++) {
            renderData.push(
                <div key={"attachList" + i} style={{ marginTop: "10px" }}>
                    <a key={"attachLink" + i} style={{ fontSize: "16px" }} href={`${fileDir}/${attachListValue[i].strgFileNm}`} download={attachListValue[i].realFileNm}>{attachListValue[i].realFileNm}</a>
                    <button className='deleteIconBtn' onClick={() => { onDelete(attachListValue[i]) }}>X</button>
                </div>
            )
        }

        return (
            <>
                <div>{renderData}</div>
                <FileUploader
                    selectButtonText="첨부파일 추가"
                    multiple={true}
                    labelText=""
                    uploadMode="useButton"
                    onValueChanged={changeAttchValue}
                />
                <div style={{ display: "inline-block", float: "right", marginTop: "25px" }}>
                    <Button type='success' style={{ height: "48px", width: "100px" }} onClick={() => onSaveClick()}>저장</Button>
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