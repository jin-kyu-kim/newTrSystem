import { Button, Popup, Tooltip, FileUploader } from "devextreme-react";
import { useEffect, useState } from "react";
import ApiRequest from "utils/ApiRequest";

const ElecAtrzManageAttchList = ({width, height, visible, attachId, onHiding, title}) => {
    const [attachListValue, setAttachListValue] = useState({});
    const [attachListParam, setAttachListParam] = useState({});

    useEffect(() => {
        selectData(attachId);
    }, [])

    const selectData = async (attachId) => {
        const param = {
                            queryId: "indvdlClmMapper.retrieveAtchmnflInq", 
                            atchmnflId : attachId
                      }
        try{
            const response = await ApiRequest("/boot/common/queryIdSearch", param);
            setAttachListValue(response);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <Popup
                visible = {visible}
                onHiding = {onHiding}
                showCloseButton={true}
                title = "첨부파일"
                width="40%"
                height="70%"
            >

            </Popup>
        </>
    )
}

export default ElecAtrzManageAttchList