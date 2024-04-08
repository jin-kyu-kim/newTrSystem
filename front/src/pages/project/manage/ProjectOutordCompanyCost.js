import { useEffect, useState } from "react";

import ProjectOutordCompanyCostJson from "./ProjectOutordCompanyCostJson.json";

import CustomAddTable from "../../../components/unit/CustomAddTable";
import Box, { Item } from "devextreme-react/box";
import ApiRequest from "../../../utils/ApiRequest";

const ProjectOutordCompanyCost = ({ prjctId, ctrtYmd, stbleEndYmd, bgtMngOdr, bgtMngOdrTobe, deptId, targetOdr, bizSttsCd, atrzLnSn }) => {
  const [values, setValues] = useState([]);
  const [cdValues, setCdValues] = useState([]);
  const { manuName, tableColumns } = ProjectOutordCompanyCostJson;

  useEffect(() => {
    OutordCompany();
    OutordCompanyList();
  }, []);

  const OutordCompany = async () => {
    const param = {
      queryId: "projectMapper.retrieveOutordEntrpsPrmpc",
      prjctId: prjctId,
      bgtMngOdr: bgtMngOdrTobe,
    };

    try {
        const response = await ApiRequest("/boot/common/queryIdSearch", param);
        setValues(response);
    } catch(error) {
        console.error(error);
    }
  }   

  const OutordCompanyList = async () => {

    const param = [
      { tbNm:"OUTORD_ENTRPS" },
      {  },
  ];

    try {
        const response = await ApiRequest("/boot/common/commonSelect", param);
        setCdValues(response);
    } catch(error) {
        console.error(error);
    }
}
 

  return (
    <>
      <div style={{ margin: "50px" }}>
        <div style={{ padding: "20px" }}>
            
        <Box direction="col" width="100%" height={150}>
                    <Item ratio={1}>
                        <div className="rect demo-dark header">
                            <h5>외주업체를 입력합니다.</h5>
                            <div> * + 버튼을 클릭하여 내용을 입력할 수 있습니다. </div>
                            <div> * <a className="dx-link dx-link-save dx-icon-save dx-link-icon" style={{textDecoration: 'none'}} /> 버튼을 클릭하여 입력한 내용을 저장할 수 있습니다.</div>
                            <div> * <a className="dx-link dx-link-edit dx-icon-edit dx-link-icon" style={{textDecoration: 'none'}} /> 버튼을 클릭하여 내용을 수정할 수 있습니다.</div>
                            <div> * 입력/수정 후 저장버튼 클릭 시 자동저장됩니다.</div>
                            <div> * <a className="dx-link dx-link-delete dx-icon-trash dx-link-icon" style={{textDecoration: 'none'}} /> 버튼을 클릭하여 데이터를 삭제할 수 있습니다.</div>
                        </div>
                    </Item>
                </Box>
          <div>
            <p style={{ textAlign: "right", marginBottom: "0px" }}>
            검색 (성명, 역할, 등급, 담당업무, 예정일, 맨먼스등 다양하게 검색가능) 
            </p>
            <CustomAddTable 
                manuName={manuName} 
                columns={tableColumns} 
                values={values} 
                prjctId={prjctId} 
                json={ProjectOutordCompanyCostJson} 
                bgtMngOdr={bgtMngOdr} 
                bgtMngOdrTobe={bgtMngOdrTobe}
                cdValues={cdValues}
                ctrtYmd={ctrtYmd}
                stbleEndYmd={stbleEndYmd}
                deptId={deptId}
                targetOdr={targetOdr}
                bizSttsCd={bizSttsCd}
                atrzLnSn={atrzLnSn}
                />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectOutordCompanyCost;
