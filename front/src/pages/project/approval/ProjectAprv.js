import { useState, useEffect } from "react";
import ProjectJson from "./ProjectAprvJson.json"
import ApiRequest from "../../../utils/ApiRequest";
import SearchPrjctSet from "../../../components/composite/SearchPrjctSet";
import CustomTable from "../../../components/unit/CustomTable";
import "react-datepicker/dist/react-datepicker.css";
import { useLocation, useNavigate } from "react-router-dom";

const ProjectAprv = () => {
  const [values, setValues] = useState([]);
  const [param, setParam] = useState({});
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const location = useLocation();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const deptInfo = JSON.parse(localStorage.getItem("deptInfo"));
  const empId = userInfo.empId;
  const deptId = deptInfo.length != 0 ? deptInfo[0].deptId : null;
  const { keyColumn, queryId, tableColumns, searchParams } = ProjectJson;
  const navigate = useNavigate();

  useEffect(() => {
    if (!Object.values(param).every((value) => value === "")) {
      pageHandle();
    }
  }, [param]);

  const searchHandle = async (initParam) => {
    setTotalPages(1);
    setCurrentPage(1);
    setParam({
      ...initParam,
      empId: empId,
      queryId: queryId,
      currentPage: currentPage,
      startVal: 0,
      pageSize: pageSize,
      path: location.pathname
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
    navigate("/project/ProjectAprvDetail",
      {
        state: {
          id: e.data.prjctId
          , prjctNm: e.data.prjctNm
          , bgtMngOdr: e.data.bgtMngOdr
          , atrzLnSn: e.data.atrzLnSn
          , atrzSttsCd: e.data.atrzSttsCd
          , atrzStepCd: e.data.atrzStepCd
          , nowAtrzStepCd: e.data.nowAtrzStepCd
          , aprvrEmpId: e.data.aprvrEmpId
          , ctrtYmd: e.data.ctrtYmd
          , stbleEndYmd: e.data.stbleEndYmd
          , path: location.pathname
        }
      }
    );
  }

  return (
    <div>
      <div className="title">프로젝트 승인</div>
      <div className="title-desc">* 프로젝트 승인 내역을 조회 합니다.</div>
      <div style={{ marginBottom: "20px" }}>
        <SearchPrjctSet callBack={searchHandle} props={searchParams} />
      </div>
      <div>검색된 건 수 : {totalItems} 건</div>
      <CustomTable keyColumn={keyColumn} columns={tableColumns} values={values} onRowClick={onRowClick} paging={true} />
    </div>
  );
};
export default ProjectAprv;