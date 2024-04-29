import { useEffect, useState } from "react";

import projectChangeConsortiumJson from "./ProjectChangeConsortiumJson.json"

import CustomAddTable from "../../../components/unit/CustomAddTable";
import Box, {Item} from "devextreme-react/box";
import ApiRequest from "../../../utils/ApiRequest";

const ProjectChangeConsortium = ({ prjctId, ctrtYmd, stbleEndYmd, bgtMngOdr, bgtMngOdrTobe, deptId, targetOdr, bizSttsCd, atrzLnSn }) => {
    const [values, setValues] = useState([]);
    const [cdValues, setCdValues] = useState([]);
    const { manuName, tableColumns} = projectChangeConsortiumJson;

    useEffect(() => {
        Consortium();
        ConsortiumBizCd();
    }, []);

    const Consortium = async () => {
        const param = [
            { tbNm:"PRJCT_CNSRTM" },
            { prjctId: prjctId },
        ];
        try {
            const response = await ApiRequest("/boot/common/commonSelect", param);
            setValues(response);
        } catch(error) {
            console.error(error);
        }
    } 
    
    const ConsortiumBizCd = async () => {

        const param = {
            queryId: "projectMapper.retrievePrjctCnsrtmCd",
            upCdValue: "VTW013",
            useYn: "Y"
        }
        try {
            const response = await ApiRequest("/boot/common/queryIdSearch", param);
            setCdValues(response);
        } catch(error) {
            console.error(error);
        }
    }

    return (
        <>
            <div className="container" style={{ marginTop: "50px" }}>
                <div style={{padding:'20px'}}>

                <Box direction="col" width="100%" height={150}>
                    <Item ratio={1}>
                        <div className="rect demo-dark header">
                            <h5>컨소시엄구성을 입력합니다.</h5>
                            <div> * + 버튼을 클릭하여 내용을 입력할 수 있습니다. </div>
                            <div> * <a className="dx-link dx-link-save dx-icon-save dx-link-icon" style={{textDecoration: 'none'}} /> 버튼을 클릭하여 입력한 내용을 저장할 수 있습니다.</div>
                            <div> * <a className="dx-link dx-link-edit dx-icon-edit dx-link-icon" style={{textDecoration: 'none'}} /> 버튼을 클릭하여 내용을 수정할 수 있습니다.</div>
                            <div> * 입력/수정 후 저장버튼 클릭 시 자동저장됩니다.</div>
                            <div> * <a className="dx-link dx-link-delete dx-icon-trash dx-link-icon" style={{textDecoration: 'none'}} /> 버튼을 클릭하여 데이터를 삭제할 수 있습니다.</div>
                        </div>
                    </Item>
                </Box>
                <CustomAddTable 
                    manuName={manuName} 
                    columns={tableColumns} 
                    values={values} 
                    prjctId={prjctId}
                    json={projectChangeConsortiumJson}
                    bgtMngOdr={bgtMngOdr}
                    bgtMngOdrTobe={bgtMngOdrTobe}
                    deptId={deptId} 
                    targetOdr={targetOdr} 
                    bizSttsCd={bizSttsCd} 
                    atrzLnSn={atrzLnSn}
                    cdValues={cdValues}
                    ctrtYmd={ctrtYmd}
                    stbleEndYmd={stbleEndYmd}
                    />
                </div>
            </div>
        </>
    )
}

export default ProjectChangeConsortium;