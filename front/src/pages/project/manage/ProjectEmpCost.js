import { useEffect, useState } from "react";

import ProjectEmpCostJson from "./ProjectEmpCostJson.json";

import CustomCostTable from "components/unit/CustomCostTable";
import Box, { Item } from "devextreme-react/box";
import ApiRequest from "../../../utils/ApiRequest";
import { format, parse } from 'date-fns';

const ProjectEmpCost = ({ prjctId, ctrtYmd, stbleEndYmd, bgtMngOdr, bgtMngOdrTobe, deptId, targetOdr, bizSttsCd, atrzLnSn}) => {
  const [values, setValues] = useState([]);
  let groupingDtl = [];

  useEffect(() => {
    const runOrder = async() => {
      await EmpCostDtl();
      await EmpCost();
    };
    runOrder();
  }, []);

  const EmpCostDtl = async () => {

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
      { tbNm: "MMNY_INPT_MM" },
      { prjctId: prjctId,
        bgtMngOdr: bgtMngOdrTobe,
        inptYm : ctrtYmdPrarm.replace("-","")+"_BETWEEN_"+stbleEndYmdPrarm.replace("-",""),
      },    
    ];

  try {
    const response = await ApiRequest("/boot/common/commonSelect", param);

    response.reduce((acc, item) => {
      // mmnyLbrcoPrmpcSn 값으로 그룹핑
      acc[item.mmnyLbrcoPrmpcSn] = acc[item.mmnyLbrcoPrmpcSn] || [];
      acc[item.mmnyLbrcoPrmpcSn].push(item);
      groupingDtl = acc;
      return acc;
    }, {});
    console.log(groupingDtl);
    console.log(response);

  } catch (error) {
    console.error(error);
  }
};

  const EmpCost = async () => {

    const param = {
      queryId: "projectMapper.retrieveMmnyHnfPrmpc",
      prjctId: prjctId,
      bgtMngOdr: bgtMngOdrTobe,
    }

    try {
      const response = await ApiRequest("/boot/common/queryIdSearch", param);
 
        //월별정보 및 총 합계 response에 추가
        for(let j=0; j<Object.keys(groupingDtl).length; j++){
          let total = 0;
          let gramt = 0;
          for(let k=0; k<Object.values(groupingDtl)[j].length; k++){
            response[j][format(parse(Object.values(groupingDtl)[j][k].inptYm, 'yyyyMM', new Date()), 'yyyy년 MM월')] = Object.values(groupingDtl)[j][k].expectMm;
            response[j][format(parse(Object.values(groupingDtl)[j][k].inptYm, 'yyyyMM', new Date()), 'yyyy년 MM월') + '_untpc'] = Object.values(groupingDtl)[j][k].untpc;
            total += Object.values(groupingDtl)[j][k].expectMm;
            gramt += (Object.values(groupingDtl)[j][k].untpc)*(Object.values(groupingDtl)[j][k].expectMm);
          }
          const fixedSum = Number(total.toFixed(2)); //js의 부동소수 이슈로 인한 자릿수 조정.
          response[j].total = fixedSum;     
          response[j].gramt = gramt;
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
                            <h5>자사인력을 입력합니다.</h5>
                            <div> * "인력추가" 버튼을 클릭하여 내용을 입력할 수 있습니다. </div>
                            <div> * "수정" 버튼을 클릭하여 내용을 수정할 수 있습니다.</div>
                            <div> * "입력/수정" 후 저장버튼 클릭 시 자동저장됩니다.</div>
                            <div> * "삭제" 버튼을 클릭하여 데이터를 삭제할 수 있습니다.</div>
                        </div>
                    </Item>
                </Box>
          <div>
            <p style={{ textAlign: "right", marginBottom: "0px" }}>
            검색 (성명, 역할, 담당업무, 예정일, 맨먼스등 다양하게 검색가능) 
            </p>
            <CustomCostTable
              columns={ProjectEmpCostJson.tableColumns}
              values={values}
              prjctId={prjctId}
              costTableInfoJson={ProjectEmpCostJson}
              ctrtYmd={ctrtYmd}
              stbleEndYmd={stbleEndYmd}
              bgtMngOdrTobe={bgtMngOdrTobe}
              bgtMngOdr={bgtMngOdr}
              json={ProjectEmpCostJson}
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

export default ProjectEmpCost;
