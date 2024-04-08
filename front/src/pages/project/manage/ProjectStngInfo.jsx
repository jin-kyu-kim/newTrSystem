import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import  ProjectStngInfoJson from "./ProjectStngInfoJson.json";
import ApiRequest from "../../../utils/ApiRequest";
import SearchEmpSet from "components/composite/SearchInfoSet";
import CustomTable from "components/unit/CustomTable";
import CustomEditTable from "components/unit/CustomEditTable";

function ProjectStngInfo( prjctId ) {
  const [values, setValues] = useState([]);
  const [param, setParam] = useState({});
  const [ynParam, setYnParam] = useState({});
  const { keyColumn, queryId,queryId2, tableColumns, searchInfo } = ProjectStngInfoJson;

  useEffect(() => {
    if (!Object.values(param).every((value) => value === "")) {
      pageHandle();
    }
  }, [param]);

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
      console.log(response);
      console.log(values);
      if (response.length !== 0) {
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleYnVal = async (e) => {
    console.log(e.key)
    const ynParam = 
      { queryId : queryId2, empno : e.key}
    ;
    try {
      const response = await ApiRequest("/boot/common/queryIdSearch", ynParam);
      console.log("결과결과", response[0]);
      if (response.length !== 0) {
        const param2 = [
          { tbNm: "PRJCT_MNG_AUTHRT" },
          {prjctMngAuthrtCd:'VTW05202'},
          {empno : e.key},
      ]
        const response2 = await ApiRequest("/boot/common/commonUpdate",param2)
        console.log("진짜결과결고", response2[0]);
      } else {
      }
    } catch (error) {
    }


    // const ynParam = [
    //     { tbNm: "CTMMNY_INFO" },
    //     e.data,
    //     { ctmmnyId: e.key }
    // ];
    // try {
    //     const response = await ApiRequest('/boot/common/commonUpdate', ynParam);
    //     if(response === 1) pageHandle();
    // } catch (error) {
    //     console.log(error)
    // }

    // try {
    //   const response = await ApiRequest("/boot/common/queryIdSearch",ynParam)
    // }
    // catch{

    // }
    if(e.name === "readYn" && e.data.useYn =="Y"){



    //   console.log(e.name);
    // console.log(e.data);
    // console.log(e.key);
    // console.log(prjctId);

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