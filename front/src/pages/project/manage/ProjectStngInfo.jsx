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

  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const { keyColumn, queryId, tableColumns, popup, searchInfo } = ProjectStngInfoJson;

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
      if (response.length !== 0) {
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleYnVal = async (e) => {
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
    console.log(e.value)
    console.log(e.key);
    console.log(e.value);
    console.log("눌럿당 ㅋ");
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
          popup={popup}
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