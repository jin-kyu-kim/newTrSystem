import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import  ProjectStngInfoJson from "./ProjectStngInfoJson.json";
import ApiRequest from "../../../utils/ApiRequest";
import SearchEmpSet from "components/composite/SearchInfoSet";
import CustomTable from "components/unit/CustomTable";
import CustomEditTable from "components/unit/CustomEditTable";
import { useCookies } from "react-cookie";

function ProjectStngInfo( prjctId ) {
  const [values, setValues] = useState([]);
 
  const [ynParam, setYnParam] = useState(false);
  const { keyColumn, queryId,queryId2, tableColumns, searchInfo } = ProjectStngInfoJson;
  const [param, setParam] = useState({
     "prjctId": prjctId.prjctId
    ,"queryId": queryId});
  const [cookies] = useCookies(["userInfo", "userAuth"]);


  const mdfcnDt = new Date().toISOString().split('T')[0]+' '+new Date().toTimeString().split(' ')[0];
  const userEmpId = cookies.userInfo.empId;
 
  useEffect(() => {
      pageHandle();
  }, []);

  useEffect(() => {
    setParam({
      ...param,
      queryId: queryId,
      prjctId: prjctId.prjctId
    });
      pageHandle();
  }, [ynParam]);

  // 검색으로 조회할 때
  const searchHandle = async (initParam) => {
    setParam({
      ...initParam,
      queryId: queryId,
    });
  };

  const pageHandle = async () => {

    try {
      const response = await ApiRequest("/boot/common/queryIdSearch", param);
      setValues(response);
      if (response.length !== 0) {
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleYnVal = async (e) => {


    if(e.name === "readYn" && e.data.useYn =="Y"){
      const ynParam = 
      { queryId : queryId2, empId : e.key, prjctId: prjctId.prjctId}
    ;
    try {
      const response = await ApiRequest("/boot/common/queryIdSearch", ynParam);
      if (response.length !== 0) {
        const param2 = [
          { tbNm: "PRJCT_MNG_AUTHRT" },
          {prjctMngAuthrtCd:'VTW05201',
           mdfcnDt: mdfcnDt,
           mdfcnEmpId : userEmpId
          },
          {empId : e.key},
      ]
        const response2 = await ApiRequest("/boot/common/commonUpdate",param2)
      } else {
        const param2 = [
          { tbNm: "PRJCT_MNG_AUTHRT" },
          {prjctMngAuthrtCd:'VTW05201',
          empId : e.key,
          prjctId: prjctId.prjctId,
          regEmpId : userEmpId,
          regDt: mdfcnDt
        },
          
      ]
        const response2 = await ApiRequest("/boot/common/commonInsert",param2)
      }
    } catch (error) {
    }
  

    } else if (e.name === "readYn" && e.data.useYn =="N"){
      const ynParam = 
      { queryId : queryId2, empId : e.key, prjctId : prjctId.prjctId}
      try {
        const response = await ApiRequest("/boot/common/queryIdSearch", ynParam);
        const prjctMngAuthrtCd = response[0].prjctMngAuthrtCd
        if(prjctMngAuthrtCd === "VTW05202"){
          alert("쓰기권한이 있는 상태에서  조회권한을 해제할수 없습니다");
          setYnParam(prevYnParam => !prevYnParam);
          return;
        }else if(prjctMngAuthrtCd === "VTW05201"){
             const param2 = [
            { tbNm: "PRJCT_MNG_AUTHRT" },
            {empId : e.key, prjctId : prjctId.prjctId},
        ]
        const response2 = await ApiRequest("/boot/common/commonDelete",param2);
        }
      } catch (error) {
      }
    }
    
    else if(e.name === "writeYn" && e.data.useYn =="Y"){
      const ynParam = 
      { queryId : queryId2, empId : e.key, prjctId: prjctId.prjctId}
    ;
    try {
      const response = await ApiRequest("/boot/common/queryIdSearch", ynParam);
      if (response.length !== 0) {
      
        const param2 = [
          { tbNm: "PRJCT_MNG_AUTHRT" },
          {prjctMngAuthrtCd:'VTW05202',
           mdfcnDt: mdfcnDt,
           mdfcnEmpId : userEmpId
          },
          {empId : e.key , prjctId : prjctId.prjctId},
      ]
        const response2 = await ApiRequest("/boot/common/commonUpdate",param2)
      } else {
        const param2 = [
          { tbNm: "PRJCT_MNG_AUTHRT" },
          {prjctMngAuthrtCd:'VTW05202',
          empId : e.key,
          prjctId: prjctId.prjctId,
          regEmpId : userEmpId,
          regDt: mdfcnDt
        },
          
      ]
        const response2 = await ApiRequest("/boot/common/commonInsert",param2)
        setYnParam(prevYnParam => !prevYnParam);
       
      }
    } catch (error) {
    }
    }else if (e.name === "writeYn" && e.data.useYn =="N"){
      const ynParam = 
      { queryId : queryId2, empId : e.key, prjctId: prjctId.prjctId}
      try {
        const response = await ApiRequest("/boot/common/queryIdSearch", ynParam);
        const prjctMngAuthrtCd = response[0].prjctMngAuthrtCd
        if(prjctMngAuthrtCd === "VTW05202"){
          const param2 = [
            { tbNm: "PRJCT_MNG_AUTHRT" },
            {prjctMngAuthrtCd:'VTW05201',
             mdfcnDt: mdfcnDt,
             mdfcnEmpId : userEmpId
            },
            {empId : e.key ,  prjctId : prjctId.prjctId},
        ]
          const response2 = await ApiRequest("/boot/common/commonUpdate",param2)
          setYnParam(prevYnParam => !prevYnParam);
        }
      } catch (error) {
      }

    }
    
}
  return (
    <div className="container">
      <div
        className="title p-1"
        style={{ marginTop: "20px", marginBottom: "10px" }}
      >
      </div>
        <span>* 조회권한 : 프로젝트 원가 조회가능</span>
        <span style={{ marginTop: "20px", marginBottom: "10px" }}>* 쓰기권한 : 프로젝트 외주비 전자결재 청구가능</span>
      <div style={{ marginBottom: "30px" }}>
        <SearchEmpSet 
          callBack={searchHandle}
          props={searchInfo}
        />
      </div>

       <CustomEditTable
        keyColumn={keyColumn}
        columns={tableColumns}
        values={values}
        paging={true}
        wordWrap={true}
        noEdit={true}
        handleYnVal={handleYnVal}
       
      />  
    </div>
  );
};

export default ProjectStngInfo;