import { useEffect, useState } from "react";

import ProjectControlBudgetCostJson from "./ProjectControlBudgetCostJson.json";

import CustomCostTable from "components/unit/CustomCostTable";
import Box, { Item } from "devextreme-react/box";
import ApiRequest from "../../../utils/ApiRequest";
import { format,parse } from 'date-fns';

const ProjectControlBudgetCost = ({ prjctId, ctrtYmd, stbleEndYmd, bgtMngOdr, bgtMngOdrTobe, deptId, targetOdr, bizSttsCd, atrzLnSn }) => {
  const [values, setValues] = useState([]); 
  let groupingDtl = [];

  useEffect(() => {
    const runOrder = async() => {
      await ControlBudgetDtl();
      await ControlBudget();
    };
    runOrder();
  }, []);

  const ControlBudgetDtl = async () => {
    function adjustMonth(dateStr, monthsToAdd) {
      if (!dateStr) return ""; // 날짜 문자열이 없으면 빈 문자열 반환
      const [year, month, day] = dateStr.split('-').map(Number);
      const date = new Date(year, month - 1, day); // month는 0부터 시작하므로 -1
      date.setMonth(date.getMonth() + monthsToAdd);
      const newYear = date.getFullYear();
      const newMonth = ('0' + (date.getMonth() + 1)).slice(-2); // month는 0부터 시작하므로 +1
      return `${newYear}-${newMonth}`;
    }
  
    // 날짜 문자열 초기화
    const copyCtrtYmd = ctrtYmd ? JSON.parse(JSON.stringify(ctrtYmd)) : "";
    const copyStbleEndYmd = stbleEndYmd ? JSON.parse(JSON.stringify(stbleEndYmd)) : "";
    
    // 날짜 조정
    const ctrtYmdPrarm = adjustMonth(copyCtrtYmd, -1); // -1달
    const stbleEndYmdPrarm = adjustMonth(copyStbleEndYmd, 1); // +1달

    const param = [
      { tbNm: "EXPENS_MNBY_PRMPC_DTLS" },
      { prjctId: prjctId,
        bgtMngOdr: bgtMngOdrTobe,
        expensCd: ProjectControlBudgetCostJson.cdBetween,
        useYm : ctrtYmdPrarm.replace("-","")+"&"+stbleEndYmdPrarm.replace("-",""),
      }, 
    ];

  try {
    const response = await ApiRequest("/boot/common/commonSelect", param);
      response.reduce((acc, item) => {
        //expensPrmpcSn 값으로 그룹핑
        acc[item.expensPrmpcSn] = acc[item.expensPrmpcSn] || [];
        acc[item.expensPrmpcSn].push(item);
        groupingDtl = acc;
        return acc;
    }, {});

  } catch (error) {
    console.error(error);
  }
};

  const ControlBudget = async () => {
    const param = [
      { tbNm: "EXPENS_PRMPC" },
      { prjctId: prjctId,
        bgtMngOdr: bgtMngOdrTobe,
        expensCd: "VTW04528_BETWEEN_VTW04535"
      }, 
    ];
    try {
      const response = await ApiRequest("/boot/common/commonSelect", param);
      //월별정보 및 총 합계 response에 추가
              
      for(let j=0; j<Object.keys(groupingDtl).length; j++){
        let total = 0;
        for(let k=0; k<Object.values(groupingDtl)[j].length; k++){
          response[j][format(parse(Object.values(groupingDtl)[j][k].useYm, 'yyyyMM', new Date()), 'yyyy년 MM월')] = Object.values(groupingDtl)[j][k].expectCt;
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
                            <h5>통제성경비를 입력합니다.</h5>
                            <div> * "인력추가" 버튼을 클릭하여 내용을 입력할 수 있습니다. </div>
                            <div> * "수정" 버튼을 클릭하여 내용을 수정할 수 있습니다.</div>
                            <div> * "입력/수정" 후 저장버튼 클릭 시 자동저장됩니다.</div>
                            <div> * "삭제" 버튼을 클릭하여 데이터를 삭제할 수 있습니다.</div>
                        </div>
                    </Item>
                </Box>
          <div>
            <p style={{ textAlign: "right", marginBottom: "0px" }}>
              검색 (비용코드, 상세내역 등 다양하게 검색가능)
            </p>
            <CustomCostTable
              columns={ProjectControlBudgetCostJson.tableColumns}
              values={values}
              prjctId={prjctId}
              ctrtYmd={ctrtYmd}
              stbleEndYmd={stbleEndYmd}
              bgtMngOdrTobe={bgtMngOdrTobe}
              bgtMngOdr={bgtMngOdr}
              json={ProjectControlBudgetCostJson}
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

export default ProjectControlBudgetCost;
