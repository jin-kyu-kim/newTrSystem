import React, {useCallback, useState} from "react";
import {TabPanel} from "devextreme-react";
import ProjectExpenseJson from "./ProjectExpenseJson.json"

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
  const [excel, setExcel] = useState();
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
                          <Component excel={excel} setExcel={setExcel} />
                      </React.Suspense>
                  );
              }}
          />
      </div>
  );
};

export default ProjectExpense;