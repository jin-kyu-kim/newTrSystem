import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import EmpCultHealthCostDetailPopJson from "./EmpCultHealthCostDetailPopJson.json";
import ApiRequest from "../../utils/ApiRequest";
import CustomEditTable from "../../components/unit/CustomEditTable";

function EmpCultHealthCostDetailPop({value, ym, disabled}) {
  
  const [values, setValues] = useState([]);
  const [param, setParam] = useState({});

  const { keyColumn, queryId, tableColumns } = EmpCultHealthCostDetailPopJson;

  useEffect(() =>{
    setParam({
        ...param,
       queryId: queryId,
       empId: value?.empId,
       clturPhstrnSeCd: value?.clturPhstrnSeCd,
       ym: ym
    })

  }, [value])

  useEffect(() => {
    if (!Object.values(param).every((value) => value === "")) {
      pageHandle();
    }
  }, [param]);

  const pageHandle = async () => {
    try {
      const response = await ApiRequest("/boot/common/queryIdSearch", param);
        if (response.length !== 0) {
            const tmpList = [];
            const tmpValueList = [];
            response.forEach((element)=>{
                let tmpElement = {
                    empId: element.empId,
                    clturPhstrnActCtSn: element.clturPhstrnActCtSn,
                };

                if(!tmpList.includes(JSON.stringify(tmpElement))){
                    tmpList.push(JSON.stringify(tmpElement));
                    tmpElement.clmAmt = element.clmAmt;
                    tmpElement.clturPhstrnSeCd = element.clturPhstrnSeCd;
                    tmpElement.actIem = element.actIem;
                    tmpElement.rm = element.rm;
                    if(element.atchmnflId !== null){
                        tmpElement.atchmnflId = element.atchmnflId;
                        tmpElement.atchmnfl = [];
                        tmpElement.atchmnfl.push({
                            atchmnflId: element.atchmnflId,
                            atchmnflSn: element.atchmnflSn,
                            realFileNm: element.realFileNm,
                            strgFileNm: element.strgFileNm

                        });
                    }
                    tmpValueList.push(tmpElement);
                }else{
                    let index = tmpList.indexOf(JSON.stringify(tmpElement));
                    let copyIndex = tmpValueList[index];
                    copyIndex.atchmnfl.push({
                        atchmnflId: element.atchmnflId,
                        atchmnflSn: element.atchmnflSn,
                        realFileNm: element.realFileNm,
                        strgFileNm: element.strgFileNm
                    });
                    tmpValueList[index] = copyIndex;
                }
            })
            setValues(tmpValueList);
        } else {
            setValues([]);
        }
    } catch (error) {
      console.error(error);
    }
  };

  return (
      <div className="container">
          <h3 style={{fontSize: "20px"}}>문화체련비 상세청구내역 ({value?.empFlnm})</h3>
          <CustomEditTable
              keyColumn={keyColumn}
              columns={tableColumns}
              values={values}
              paging={true}
              onlyUpdate={true}
              noEdit={disabled}
          />
      </div>
  );
};

export default EmpCultHealthCostDetailPop;