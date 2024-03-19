import React, { useCallback, useState, useEffect } from "react";
import DataGrid, {Column, Export} from 'devextreme-react/data-grid';
import { DateBox } from 'devextreme-react';
import { useNavigate, useLocation } from 'react-router-dom';
import {Button, TabPanel} from "devextreme-react";
import ApiRequest from "../../utils/ApiRequest";

import EmpExpenseAprvListJson from "./EmpExpenseAprvListJson.json";
import SearchPrjctCostSet from "../../components/composite/SearchPrjctCostSet";

const EmpExpenseAprvList = () => {

  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const EmpExpenseAprvList = EmpExpenseAprvListJson.tabMenu;
  const searchParams = EmpExpenseAprvListJson.searchParams;
  const [param, setParam] = useState([]);

  let year = "";
  let monthVal = "";
  let aplyOdr = 0;
  let empId = "";

  useEffect(() => {

    const param = {
      queryId: "financialAffairMngMapper.retrievePrjctCtClmSttusYMDMMAccto",
      year: year,
      monthVal: monthVal,
      aplyOdr: aplyOdr,
    };

    const response = ApiRequest("/boot/common/queryIdSearch", param);

  }, []);

  const searchHandle = async (initParam) => {
    if(initParam.year == null || initParam.month == null) {

      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();

      let odrVal = day > 15 ? "2" : "1";
      let monthVal = month < 10 ? "0" + month : month;

      setParam({
        ...param,
        year: year,
        monthVal: monthVal,
        aplyOdr: odrVal,
      })

      return;
    };

    setParam({

      ...param,
      year: initParam.year,
      monthVal: initParam.month,
      aplyOdr: initParam.aplyOdr,
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
          <div className="wrap_search" style={{marginBottom: "20px"}}>
            <SearchPrjctCostSet callBack={searchHandle} props={searchParams}/>
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
                        <Component year={param.year}
                                   monthVal={param.monthVal}
                                   aplyOdr={param.aplyOdr}/>
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
