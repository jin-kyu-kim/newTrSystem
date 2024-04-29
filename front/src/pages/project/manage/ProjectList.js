import { useState, useEffect, useCallback } from "react";

import ProjectJson from "../manage/ProjectListJson.json";
import ApiRequest from "../../../utils/ApiRequest";
import SearchPrjctSet from "../../../components/composite/SearchPrjctSet";
import CustomTable from "../../../components/unit/CustomTable";

import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { Button } from "devextreme-react";
import { useCookies } from "react-cookie";

const ProjectList = () => {
  const [values, setValues] = useState([]);
  const [param, setParam] = useState({});

  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [cookies] = useCookies(["userInfo", "userAuth"]);


  const userEmpId = cookies.userInfo.empId;
  const navigate = useNavigate();

  const { keyColumn, queryId, tableColumns, searchParams, popup } = ProjectJson;

  useEffect(() => {
    if (!Object.values(param).every((value) => value === "")) {
      pageHandle();
    }
  }, [param]);

  // 검색으로 조회할 때
  const searchHandle = async (initParam) => {
    setTotalPages(1);
    setCurrentPage(1);
    setParam({
      ...initParam,
      queryId: queryId,
      currentPage: currentPage,
      startVal: 0,
      pageSize: pageSize,
      empId: userEmpId,
    });
  };

  const pageHandle = async () => {
    try {
      const response = await ApiRequest("/boot/common/queryIdSearch", param);
      setValues(response);
      if (response.length !== 0) {
        setTotalPages(Math.ceil(response[0].totalItems / pageSize));
        setTotalItems(response[0].totalItems);
      } else {
        setTotalPages(1);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onRowClick = (e) => {

    navigate("/project/ProjectDetail", 
              {state: { prjctId: e.key
                      , prjctNm: e.data.prjctNm
                      , totBgt: e.data.totBgt
                      , bgtMngOdr: e.data.bgtMngOdr
                      , ctrtYmd: e.data.ctrtYmd
                      , stbleEndYmd: e.data.stbleEndYmd
                      , bgtMngOdrTobe: e.data.bgtMngOdrTobe 
                      , bizSttsCd: e.data.bizSttsCd
                      , deptId : e.data.deptId}})
  };

  return (
    <div className="container">
      <div
        className="title p-1"
        style={{ marginTop: "20px", marginBottom: "10px" }}
      >
        <h1 style={{ fontSize: "40px" }}>프로젝트 관리</h1>
      </div>
      <div className="col-md-10 mx-auto" style={{ marginBottom: "10px" }}>
        <span>* 프로젝트를 조회합니다.</span>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <SearchPrjctSet
          callBack={searchHandle}
          props={searchParams}
          popup={popup}
        />
      </div>

      <div>검색된 건 수 : {totalItems} 건</div>
      <CustomTable
        keyColumn={keyColumn}
        pageSize={pageSize}
        columns={tableColumns}
        values={values}
        onRowClick={onRowClick}
        paging={true}
      />
    </div>
  );
};

export default ProjectList;
