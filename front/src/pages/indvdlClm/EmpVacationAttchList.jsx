import { useState, useEffect } from "react";
import { Popup, FileUploader, Button } from "devextreme-react";
import ApiRequest from "../../utils/ApiRequest";
import { gridColumnLookupSelector } from "@mui/x-data-grid";

const EmpVacationAttchList = ({ visible, attachId, onHiding, elctrnAtrzId }) => {
    const [attachListValue, setAttachListValue] = useState([]);

    const [insertAttachListValue, setInsertAttachListValue] = useState();
    const [deleteAttachListValue, setDeleteAttachListValue] = useState();

    useEffect(() => {
        selectData();
    }, [])

    // 첨부파일조회
    const selectData = async () => {
        try {
            // const response = await ApiRequest("/boot/common/queryIdSearch", { queryId: "indvdlClmMapper.retrieveAtchmnflInq", atchmnflId: attachId });
            const response = await ApiRequest('/boot/common/commonSelect', [
                { tbNm: "ATCHMNFL" }, { atchmnflId: attachId }
            ]);
            setAttachListValue(response);
        } catch (error) {
            console.log("selectData_error : ", error);
        }
    };


    function onDelete(attachValue) {
        let existAttachList = attachListValue.filter(item => item.atchmnflSn != attachValue.atchmnflSn);
        let deleteAttachList = attachListValue.filter(item => item.atchmnflSn == attachValue.atchmnflSn);
        setAttachListValue(existAttachList);
        setDeleteAttachListValue([{tbNm: "ATCHMNFL"}], deleteAttachList);
    }

    function changeAttchValue(e) {
        // console.log(e);
    }

    function onSaveClick(){
        const formData = new FormData();

        formData.append("tbNm", JSON.stringify({tbNm: "VCATN_ATRZ"}));
        formData.append("idColumn", JSON.stringify({elctrnAtrzId: elctrnAtrzId}));

        // case_1)
        // 첨부파일 신규등록

        // case_2)
        // 기존 첨부파일 전체삭제

        // case_3)
        // 첨부파일 추가등록

        // case_4)
        // 기존 첨부파일 삭제 및 신규첨부파일 등록

        if(attachId){
            formData.append("deleteFiles", JSON.stringify(deleteAttachListValue));
        } else {
            formData.append("data", JSON.stringify());
        }
    }


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
                onHiding={() => {
                    onHiding(false);
                }}

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