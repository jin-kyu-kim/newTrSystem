import React from 'react';
import { useState, useEffect } from "react";
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';
import EmpTimeAprvListJson from "./EmpTimeAprvListJson.json";
import ApiRequest from "../../utils/ApiRequest";
import CustomPivotGrid from "components/unit/CustomPivotGrid";
import SearchInfoSet from "components/composite/SearchInfoSet";

const EmpTimeAprvList = () => {
  const [values, setValues] = useState([]);
  const [param, setParam] = useState({});
  const { keyColumn, queryId, tableColumns, searchInfo } = EmpTimeAprvListJson;
  const [searchIsVal, setSearchIsVal] = useState(false);

  useEffect(() => {
    if (searchIsVal) { // 검색 버튼을 클릭했을 때만 pageHandle 함수 호출
      pageHandle();
      setSearchIsVal(false); // 상태를 다시 false로 변경하여 다음 검색을 위해 준비
    }
  }, [searchIsVal]); // searchIsVal 상태가 변경될 때마다 실행

  const searchHandle = async (initParam) => {
    setParam({
      ...initParam,
      yearItem: initParam?.year,
      monthItem: initParam?.month,
      aplyOdr: initParam?.aplyOdr,
      queryId: queryId,
    });
    setSearchIsVal(true);
  };

  const pageHandle = async () => {
    try {
      const response = await ApiRequest("/boot/common/queryIdSearch", param);
      if (response.length !== 0) {
        setValues(response);
      } else {
        setValues([]);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const dataSource = new PivotGridDataSource({
    fields: [
      {
        caption: '직원명',
        width: 90,
        dataField: 'empFlnm',
        area: 'row',
        expanded: true,
      },
      {
        caption: '날짜',
        dataField: 'aplyYmd',
        area: 'column',
      },
      {
        groupName: 'date',
        groupInterval: 'month',
      },
      {
        groupName: 'date',
        groupInterval: 'day',
        expanded: true,
      },
      {
        caption: '프로젝트명',
        width: 180,
        dataField: 'prjctNm',
        area: 'row',
        expanded: true,
      },
      {
        caption: 'Sales',
        dataField: 'md',
        format: {
          type: "fixedPoint", // 소수점으로 형식화
          precision: 1 // 소수점 이하 자리수
        },
        summaryType: 'sum',
        area: 'data',
      },
    ],
    store: values,
  })

  return (
    <React.Fragment>
      <div className='singleStickyTotal'>
        <div className="title">근무시간 승인내역 조회</div>
        <div className="title-desc">* 근무시간 승인내역을 조회합니다.</div>
        <div className="wrap_search" style={{ marginBottom: "20px" }}>
          <SearchInfoSet callBack={searchHandle} props={searchInfo} />
        </div>
        <CustomPivotGrid
          weekendColor={true}
          isExport={true}
          sorting={true}
          grandTotals={false}
          values={dataSource}
        />
      </div>
    </React.Fragment>
  )
}
export default EmpTimeAprvList;