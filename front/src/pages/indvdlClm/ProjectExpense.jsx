import React, {useCallback, useEffect, useState} from "react";
import {TabPanel} from "devextreme-react";
import ProjectExpenseJson from "./ProjectExpenseJson.json"
import {useCookies} from "react-cookie";

const ProjectExpense = () => {
  const ExpenseInfo = ProjectExpenseJson.ExpenseInfo;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const onSelectionChanged = useCallback(
      (args) => {
          if (args.name === "selectedIndex") {
              setSelectedIndex(args.value);
          }
      },
      [setSelectedIndex]
  );
  const [cookies] = useCookies([]);
  const [excel, setExcel] = useState();
  const [cardValue, setCardValue] = useState();

  useEffect(() => {
      let aplyDate = null;
      let now = new Date();
      let dateNum = Number(now.getDate());
      if(dateNum <= 15){
          let firstDayOfMonth = new Date( now.getFullYear(), now.getMonth() , 1 );
          let lastMonth = new Date ( firstDayOfMonth.setDate( firstDayOfMonth.getDate() - 1 ) );
          aplyDate = {
              "aplyYm": lastMonth.getFullYear()+('0' + (lastMonth.getMonth()+1)).slice(-2),
              "aplyOdr": 2
          }
      } else if (16 <= dateNum){
          aplyDate = {
              "aplyYm": now.getFullYear()+('0' + (now.getMonth()+1)).slice(-2),
              "aplyOdr": 1
          }
      }
      const list = [];
      for(let i = 1; i < excel?.length; i++){
          const date = excel[i].__EMPTY_4;
          const time = excel[i].__EMPTY_5;
          const data = {
              "utztnDt" : date.substring(2,4)+date.substring(5,7)+date.substring(8,10)+time.substring(0,2)+time.substring(3,5)+time.substring(6,8),
              "useOffic" : excel[i].__EMPTY_6,
              "utztnAmt" : excel[i].__EMPTY_7,
              "regEmpId" : cookies.userInfo.empId,
              "empId" : cookies.userInfo.empId,
              "aplyYm" : aplyDate.aplyYm,
              "aplyOdr" : aplyDate.aplyOdr,
              "ctAtrzSeCd" : "VTW01903",
              "prjctId": null,
              "expensCd": null,
              "ctPrpos": null,
              "ATDRN": null,
          };
          list.push(data);
      }
      setCardValue(list);
  }, [excel]);

  const itemTitleRender = (a) => <span>{a.TabName}</span>;

  return (
      <div className="container">
          <TabPanel
              height="auto"
              width="auto"
              dataSource={ExpenseInfo}
              selectedIndex={selectedIndex}
              onOptionChanged={onSelectionChanged}
              itemTitleRender={itemTitleRender}
              animationEnabled={true}
              itemComponent={({ data }) => {
                  const Component = React.lazy(() => import(`${data.url}`));
                  return (
                      <React.Suspense fallback={<div>Loading...</div>}>
                          <Component excel={excel} setExcel={setExcel} cardValue={cardValue} setCardValue={setCardValue} />
                      </React.Suspense>
                  );
              }}
          />
      </div>
  );
};

export default ProjectExpense;