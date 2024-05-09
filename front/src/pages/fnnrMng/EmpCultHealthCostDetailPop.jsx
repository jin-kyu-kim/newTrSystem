import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import "bootstrap/dist/css/bootstrap.min.css";
import EmpCultHealthCostDetailPopJson from "./EmpCultHealthCostDetailPopJson.json";
import ApiRequest from "../../utils/ApiRequest";
import CustomEditTable from "../../components/unit/CustomEditTable";

function EmpCultHealthCostDetailPop({value, ym}) {
  const [cookies, setCookie] = useCookies(["userInfo", "deptInfo"]);
  const sessionEmpId = cookies.userInfo.empId 
  
  const [values, setValues] = useState([]);
  const [param, setParam] = useState({});

  const { keyColumn, queryId, tableColumns, masterColumns } = EmpCultHealthCostDetailPopJson;

  useEffect(() =>{
    setParam({
        ...param,
       queryId: queryId,
       empId: value?.empId,
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
                    tmpElement.empId = value?.empId;
                    tmpElement.sessionEmpId = sessionEmpId;
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

  // const onChangeValue = (changeValue) => {
  //   setValues([...changeValue])
  // }
  //
  // useEffect(() => {
  //   updateClturPhstrnActct();
  // }, [values])
  //
  // const updateClturPhstrnActct = async() =>{
  //   await ApiRequest('/boot/financialAffairMng/updateClturPhstrnActct', values);
  // }

  return (
      <div className="container">
          <h3 style={{fontSize: "20px"}}>문화체련비 상세청구내역 ({value?.empFlnm})</h3>
          <CustomEditTable
              keyColumn={keyColumn}
              columns={tableColumns}
              values={values}
              paging={true}
              onlyUpdate={true}
              // masterDetail={masterColumns}
              // handleData={onChangeValue}
          />
      </div>
  );
};

export default EmpCultHealthCostDetailPop;