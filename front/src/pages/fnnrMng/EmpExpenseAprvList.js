import React, { useCallback, useState, useEffect } from "react";
import {Button, TabPanel} from "devextreme-react";
import ApiRequest from "../../utils/ApiRequest";

import SearchOdrRange from "../../components/composite/SearchOdrRange";
import EmpExpenseAprvListJson from "./EmpExpenseAprvListJson.json";

const EmpExpenseAprvList = () => {

  const [selectedIndex, setSelectedIndex] = useState(0);

  const EmpExpenseAprvList = EmpExpenseAprvListJson.tabMenu;
  const searchParams = EmpExpenseAprvListJson.searchParams;
  const [param, setParam] = useState([]);

  let year = "";
  let monthVal = "";
  let aplyOdr = 0;

  useEffect(() => {

    const param = {
      queryId: "financialAffairMngMapper.retrieveExpensAprvDtlsPrjctAccto",
      startYm: year+monthVal,
      startOdr: aplyOdr,
      endYm: year+monthVal,
      endOdr: aplyOdr,
    };

    const response = ApiRequest("/boot/common/queryIdSearch", param);

  }, []);

  const searchHandle = async (initParam) => {
      console.log('iii',initParam);
    if(initParam.year == null || initParam.month == null) {

      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();

      let odrVal = day > 15 ? "1" : "2";
      let monthVal = month < 10 ? "0" + month : month;

      setParam({
        ...param,
          startYm: year+monthVal,
          startOdr: odrVal,
          endYm: year+monthVal,
          endOdr: odrVal,
      })

      return;
    };

    setParam({

      ...param,
        startYm: initParam.startYm,
        startOdr: initParam.startOdr,
        endYm: initParam.endYm,
        endOdr: initParam.endOdr,
    })
  }


  const onSelectionChanged = useCallback(
      (args) => {
        if (args.name === "selectedIndex") {
          setSelectedIndex(args.value);
        }
      },
      [setSelectedIndex]
  );

  const itemTitleRender = (a) => <span>{a.TabName}</span>;

  return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div className="container">
              <div className="col-md-10 mx-auto" style={{marginTop: "20px", marginBottom: "10px"}}>
                  <h1 style={{fontSize: "30px"}}>경비 승인내역</h1>
              </div>
              <div className="col-md-10 mx-auto" style={{marginBottom: "10px"}}>
                  <span>* 일자 선택 시 해당 일자가 속한 차수 기준 검색</span>
              </div>
              <div className="wrap_search" style={{marginBottom: "20px"}}>
                  {/*<SearchPrjctCostSet callBack={searchHandle} props={searchParams}/>*/}
                  <SearchOdrRange callBack={searchHandle} props={searchParams}/>
              </div>
              <div
                  style={{
                      marginTop: "20px",
                      marginBottom: "10px",
                      width: "100%",
                      height: "100%",
                  }}
              >
                  <TabPanel
                      height="auto"
                      width="auto"
                      dataSource={EmpExpenseAprvList}
                      selectedIndex={selectedIndex}
                      onOptionChanged={onSelectionChanged}
                      itemTitleRender={itemTitleRender}
                      animationEnabled={true}
                      itemComponent={({data}) => {
                          const Component = React.lazy(() => import(`${data.url}`));
                          return (
                              <React.Suspense fallback={<div>Loading...</div>}>
                                  <Component startYm={param.startYm}
                                             startOdr={param.startOdr}
                                             endYm={param.endYm}
                                             endOdr={param.endOdr} />
                              </React.Suspense>
                          );
                      }}
                  />
              </div>
          </div>
      </div>
  );

};

export default EmpExpenseAprvList;
