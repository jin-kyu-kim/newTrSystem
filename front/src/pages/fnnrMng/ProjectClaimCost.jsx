import { useState, useEffect } from "react";
import ProjectCostClaimListJson from "./ProjectCostClaimListJson.json";
import ApiRequest from "../../utils/ApiRequest";
import SearchInfoSet from "../../components/composite/SearchInfoSet";
import CustomTable from "../../components/unit/CustomTable";

import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { Button } from "devextreme-react/button";

const ProjectClaimCost = () => {
  const [values, setValues] = useState([]);
  const [param, setParam] = useState({});

  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const navigate = useNavigate();

  const { keyColumn, queryId, tableColumns, searchInfo, wordWrap } = ProjectCostClaimListJson;

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

  const onClick = (button, data) => {
    if (button.name === "prjctId") {
      navigate("/fnnrMng/ProjectClaimCostDetail", {
        state: {
          prjctId: data.prjctId,
          prjctNm: data.prjctNm,
        }
      });
    }
  };

  const buttonRender = (button, data) => {
    return (
      <Button name={button.name} text={button.text} onClick={(e) => onClick(button, data)} />
    );
  }

  return (
    <div>
      <div className='title'>프로젝트비용청구현황</div>
      <div className="title-desc">* 프로젝트를 조회합니다.</div>
      <div style={{ marginBottom: "20px" }}>
        <SearchInfoSet callBack={searchHandle} props={searchInfo} />
      </div>

      <div>검색된 건 수 : {totalItems} 건</div>
      <CustomTable
        keyColumn={keyColumn}
        pageSize={pageSize}
        columns={tableColumns}
        values={values}
        buttonRender={buttonRender}
        onClick={onClick}
        paging={true}
        wordWrap={wordWrap}
      />
    </div>
  );
};
export default ProjectClaimCost;