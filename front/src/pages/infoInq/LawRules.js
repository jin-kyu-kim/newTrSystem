
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import LawRulesJson from "./LawRulesJson.json";
import ApiRequest from "../../utils/ApiRequest";
import 'react-tabs/style/react-tabs.css';
import "react-datepicker/dist/react-datepicker.css";
import LawRulesTabs from "./LawRulesTabs";


const LawRules = () => {
  const [values, setValues] = useState([]);
  const [param, setParam] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [tabIndex, setTabIndex] = useState(0);
  const handleTabChange = (index) => {
    setTabIndex(index);
  };

  const [initParam, setInitParam] = useState({
    empno: "",
    empFlnm: "",
    jbpsNm: "",
    deptNm: "",
    telNo: "",
    hodfSttsNm: "",
  });

  const handleChgState = ({ name, value }) => {
    setInitParam({
      ...initParam,
      [name]: value,
    });
  };
  const { keyColumn, queryId, tableColumns, searchParams, popup } = LawRulesJson;

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

  // SelectBox 변경
  const pageHandle = async () => {
    try {
      const response = await ApiRequest("/boot/common/queryIdSearch", param);
      setValues(response);
     
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">
    <div className="title p-1" style={{ marginTop: "20px", marginBottom: "10px" }}>
      <h1 style={{ fontSize: "40px" }}>법제도 인력 지원요청</h1>
    </div>
    <div className="col-md-10 mx-auto" style={{ marginBottom: "10px" }}>
      <span>* 법제도 인력 지원을 요청하는 화면입니다.</span>
      <br></br>
      <span style={{ marginBottom: "540px" }}>* 요청서를 작성 하시면 법제도 관리자가 확인 후 연락 드립니다.</span>

      <div style={{ marginTop: "30px" }}>
        <LawRulesTabs tabIndex={tabIndex} handleTabChange={setTabIndex} />
      </div>
    </div>
    {/* 나머지 컴포넌트 코드 */}
  </div>
);
};

export default LawRules;