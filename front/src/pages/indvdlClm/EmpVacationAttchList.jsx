import { useState, useEffect } from "react";
import { Popup } from "devextreme-react";
import ApiRequest from "../../utils/ApiRequest";


const EmpVacationAttchList = ({ width, height, visible, attachId, onHiding, title }) => {
    const [attachListValue, setAttachListValue] = useState({});
    const [attachListParam, setAttachListParam] = useState({queryId: "indvdlClmMapper.retrieveAtchmnflInq", atchmnflId: attachId});

    const renderData = [];

    useEffect(() => {
        if (attachListParam.atchmnflId != null && attachListParam.attachId != "" && attachListParam.attachId != undefined) {
            selectData(attachListParam);
        }
    }, [attachListParam])

    // 첨부파일조회
    const selectData = async (initParam) => {
        try {
            setAttachListValue(await ApiRequest("/boot/common/queryIdSearch", {queryId: "indvdlClmMapper.retrieveAtchmnflInq", atchmnflId: initParam}));
        } catch (error) {
            console.log(error);
        }
    };
    
    useEffect(() => {
        if (attachId != null && attachId != "" && attachId != undefined) {
            selectData(attachId)
        }
    }, [attachId])

    
    useEffect(() => {
        for (let i = 0; i < attachListValue.length; i++){
            renderData.push(
                <>
                    <div style={{marginTop: "10px"}}>
                        <a style = {{fontSize: "16px"}} href={`/upload/${attachListValue[i].strgFileNm}`} download={attachListValue[i].realFileNm}>{attachListValue[i].realFileNm}</a>
                    </div>
                </>
            )
        }
    }, [attachListValue])

    function createRenderData(){
        return(
            <>
                <div>{renderData}</div>
            </>
        )
    }


    return (
        <>
            <Popup
                width={width}
                height={height}
                visible={visible}
                showCloseButton={true}
                contentRender={createRenderData}
                title={title}
                onHiding={(e) => {
                    onHiding(false);
                }}
                
            />
        </>
    )
}

export default EmpVacationAttchList