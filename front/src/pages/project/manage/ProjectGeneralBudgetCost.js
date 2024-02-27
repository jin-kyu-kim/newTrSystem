import { useEffect, useState } from "react";

import ProjectGeneralBudgetCostJson from "./ProjectGeneralBudgetCostJson.json";

import CustomCostTable from "components/unit/CustomCostTable";
import Box, { Item } from "devextreme-react/box";
import ApiRequest from "../../../utils/ApiRequest";
import { format } from 'date-fns';

const ProjectGeneralBudgetCost = ({ prjctId, ctrtYmd, bizEndYmd, bgtMngOdr }) => {
  const [values, setValues] = useState([]);
  let groupingDtl = [];

  useEffect(() => {
    const runOrder = async() => {
      await GeneralBudgetDtl();
      await GeneralBudget();
    };
    runOrder();
  }, []);

  
  const GeneralBudgetDtl = async () => {
    const param = [
      { tbNm: "EXPENS_MNBY_PRMPC_DTLS" },
      { prjctId: prjctId,
        bgtMngOdr: bgtMngOdr,
        expensCd: "VTW04501&VTW04527"
      }, 
    ];

  try {
    const response = await ApiRequest("/boot/common/commonSelect", param);
    response.reduce((acc, item) => {
      // expensPrmpcSn 값으로 그룹핑
      acc[item.expensPrmpcSn] = acc[item.expensPrmpcSn] || [];
      acc[item.expensPrmpcSn].push(item);
      groupingDtl = acc;
      return acc;
    }, {});
    

  } catch (error) {
    console.error(error);
  }
};

  const GeneralBudget = async () => {
      const param = [
        { tbNm: "EXPENS_PRMPC" },
        { prjctId: prjctId, 
          bgtMngOdr: bgtMngOdr,
          expensCd: ProjectGeneralBudgetCostJson.cdBetween
        }, 
      ];
    try {
      const response = await ApiRequest("/boot/common/commonSelect", param);
        //월별정보 및 총 합계 response에 추가
        for(let j=0; j<Object.keys(groupingDtl).length; j++){
          let total = 0;
          for(let k=0; k<Object.values(groupingDtl)[j].length; k++){
            response[j][format(Object.values(groupingDtl)[j][k].useYm, 'yyyy년 MM월')] = Object.values(groupingDtl)[j][k].expectCt;
            total += Object.values(groupingDtl)[j][k].expectCt;
          }    
          response[j].total = total;     
        }
        setValues(response);

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div style={{ margin: "50px" }}>
        <div style={{ padding: "20px" }}>
            
        <Box direction="col" width="100%" height={150}>
                    <Item ratio={1}>
                        <div className="rect demo-dark header">
                            <h5>일반경비를 입력합니다.</h5>
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
              검색 (비용코드, 상세내역 등 다양하게 검색가능)
            </p>
            <CustomCostTable
              keyColumn={ProjectGeneralBudgetCostJson.keyColumn}
              manuName={ProjectGeneralBudgetCostJson.manuName}
              columns={ProjectGeneralBudgetCostJson.tableColumns}
              popup={ProjectGeneralBudgetCostJson.popup}
              summaryColumn={ProjectGeneralBudgetCostJson.summaryColumn}
              values={values}
              prjctId={prjctId}
              ctrtYmd={ctrtYmd}
              bizEndYmd={bizEndYmd}
              bgtMngOdr={bgtMngOdr}
              json={ProjectGeneralBudgetCostJson}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectGeneralBudgetCost;
