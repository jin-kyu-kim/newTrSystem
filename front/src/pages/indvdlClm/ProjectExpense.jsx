import React, {useCallback, useState} from "react";
import {TabPanel} from "devextreme-react";
import ProjectExpenseJson from "./ProjectExpenseJson.json"
import ProjectExpenseCell from "./ProjectExpenseCell";

const ProjectExpense = () => {
  const ExpenseInfo = ProjectExpenseJson.ExpenseInfo;
  const [index, setIndex] = useState(0);
  const onSelectionChanged = useCallback(
      (args) => {
          if (args.name === "selectedIndex") {
              setIndex(args.value);
          }
      },
      [setIndex]
  );

  const itemTitleRender = (a) => <span>{a.TabName}</span>;

  return (
      <div className="container">
          <ProjectExpenseCell/>
          <TabPanel
              height="auto"
              width="auto"
              dataSource={ExpenseInfo}
              selectedIndex={index}
              onOptionChanged={onSelectionChanged}
              itemTitleRender={itemTitleRender}
              animationEnabled={true}
              itemComponent={({ data }) => {
                  const Component = React.lazy(() => import(`${data.url}`));
                  return (
                      <React.Suspense fallback={<div>Loading...</div>}>
                          <Component index={index} setIndex={setIndex}/>
                      </React.Suspense>
                  );
              }}
          />
      </div>
  );
};

export default ProjectExpense;