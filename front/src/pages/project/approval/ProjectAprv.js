import { useState, useEffect } from "react";

import ProjectJson from "./ProjectAprvJson.json"
import ApiRequest from "../../../utils/ApiRequest";
import SearchPrjctSet from "../../../components/composite/SearchPrjctSet";
import CustomTable from "../../../components/unit/CustomTable";

import "react-datepicker/dist/react-datepicker.css";

const ProjectAprv = () => {
  const [values, setValues] = useState([]);
  const [param, setParam] = useState({});

  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const {menuName, queryId, tableColumns, searchParams} = ProjectJson;

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
    });
  };
  // 폐이징 할때
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setParam({
      ...param,
      currentPage: newPage * 1,
      startVal: (newPage - 1) * pageSize,
    });
  };

  // 페이지 사이즈 변경
  const handlePageSizeChange = (e) => {
    console.log(e)
    setPageSize(e.value * 1);
    setParam({
        ...param,
        currentPage: 1,
        startVal: 0,
        pageSize: e.value * 1,
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

  const onRowDblClick = () => {
    
  }


  return (
    <div className="container">
      <div
        className="title p-1"
        style={{ marginTop: "20px", marginBottom: "10px" }}
      >
        <h1 style={{ fontSize: "40px" }}>프로젝트 승인</h1>
      </div>
      <div className="col-md-10 mx-auto" style={{ marginBottom: "10px" }}>
        <span>* 프로젝트 승인 내역을 조회 합니다.</span>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <SearchPrjctSet callBack={searchHandle} props={searchParams}/>
      </div>
      <div>검색된 건 수 : {totalItems} 건</div>
      <CustomTable  menuName={menuName} columns={tableColumns} values={values} onRowDblClick={onRowDblClick} pagerVisible={true}/>
    </div>
  );
};

export default ProjectAprv;
