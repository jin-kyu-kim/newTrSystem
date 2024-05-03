import { useState, useEffect, useRef, useLayoutEffect } from "react";
import SearchInfoSet from "components/composite/SearchInfoSet";
import CustomEditTable from "components/unit/CustomEditTable";
import ApiRequest from "../../utils/ApiRequest";
import SysMng from "./SysMngJson.json";
import "../../pages/sysMng/sysMng.css";

const TrsCode = () => {
  const { keyColumn, queryId, tableColumns, childTableColumns, searchInfo, tbNm, ynVal } = SysMng.trsCodeJson;
  const [expandedRowKey, setExpandedRowKey] = useState(null);
  const [values, setValues] = useState([]);
  const [param, setParam] = useState({});
  const [childList, setChildList] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const child = useRef("");

  useEffect(() => {
    if (!Object.values(param).every((value) => value === "")) {
      pageHandle();
    }
  }, [param]);

  const searchHandle = async (initParam) => {
    setParam({
      ...initParam,
      queryId: queryId,
    });
  };

  const pageHandle = async () => {
    try {
      const response = await ApiRequest("/boot/common/queryIdSearch", param);

      if (response.length !== 0) {
        setValues(response);
        setTotalItems(response[0].totalItems);

      } else setTotalItems(0);
    } catch (error) {
      console.log(error);
    }
  };

  const handleYnVal = async (e) => {
    const ynParam = [{ tbNm: "CD" }, e.data, { cdValue: e.key }];
    const response = await ApiRequest("/boot/common/commonUpdate", ynParam);
  };

  useLayoutEffect(() => {
    getChildList(child.current);
  }, [child.current]);

  const getChildList = async (key) => {
    try {
      const response = await ApiRequest("/boot/common/commonSelect", [
        { tbNm: "CD" },
        { upCdValue: key },
      ]);
      setChildList(response);
    } catch (error) {
      console.log("error", error);
    }
  };

  // masterDetail - 하나의 row만 열기
  const handleExpanding = (e) => {
    child.current = e.key;

    if (expandedRowKey !== e.key) {
      e.component.collapseRow(expandedRowKey);
      setChildList([]);
      setExpandedRowKey(e.key);
    }
  };

  const masterDetail = (e) => {
    const upCdValue = e.data.data.cdValue;
    return (
      <CustomEditTable
        tbNm={tbNm}
        values={childList}
        columns={childTableColumns}
        keyColumn={keyColumn}
        ynVal={ynVal}
        upCdValue={upCdValue}
        callback={pageHandle}
        handleYnVal={handleYnVal}
        noDataText={'하위코드가 존재하지 않습니다.'}
      />
    );
  };

  return (
    <div className="container" style={{ marginBottom: '100px' }}>
      <div className="title p-1" style={{ marginTop: "20px", marginBottom: "10px" }} >
        <h1 style={{ fontSize: "40px" }}>코드 관리</h1>
      </div>
      <div className="col-md-10 mx-auto" style={{ marginBottom: "10px" }}>
        <span>* 코드를 조회합니다.</span>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <SearchInfoSet callBack={searchHandle} props={searchInfo} />
      </div>

      <div>검색된 건 수 : {totalItems} 건</div>
      <CustomEditTable
        tbNm={tbNm}
        values={values}
        columns={tableColumns}
        keyColumn={keyColumn}
        ynVal={ynVal}
        callback={pageHandle}
        handleYnVal={handleYnVal}
        masterDetail={masterDetail}
        handleExpanding={handleExpanding}
      />
    </div>
  );
};
export default TrsCode;