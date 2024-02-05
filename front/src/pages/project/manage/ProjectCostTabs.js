import React, { useCallback, useState, Suspense } from "react";
import { TabPanel } from "devextreme-react";
import ProjectCostTabsJson from "./ProjectCostTabsJson.json";

<<<<<<< HEAD
const ProjectCostTabs = ({ projId }) => {
=======
const ProjectCostTabs = ({ prjctId }) => {
>>>>>>> 5541971b518343d668f6eb2f1dc3997b9fa4cbce
  const [selectedIndex, setSelectedIndex] = useState(0);

  const projectCost = ProjectCostTabsJson;

  const onSelectionChanged = useCallback(
    (args) => {
      if (args.name === "selectedIndex") {
        setSelectedIndex(args.value);
      }
    },
    [setSelectedIndex]
  );

  const costTitleRender = (a) => <span>{a.TabName}</span>;

  return (
    <div
      style={{
        marginTop: "5px",
        marginBottom: "10px",
        marginLeft: "10px",
        width: "100%",
        height: "100%",
      }}
    >
      <TabPanel
        dataSource={projectCost}
        selectedIndex={selectedIndex}
        onOptionChanged={onSelectionChanged}
        itemTitleRender={costTitleRender}
        itemComponent={({ data }) => {
          const Component = React.lazy(() => import(`${data.url}`));
          return (
            <React.Suspense fallback={<div>Loading...</div>}>
<<<<<<< HEAD
              <Component projId={projId} />
=======
              <Component prjctId={prjctId} />
>>>>>>> 5541971b518343d668f6eb2f1dc3997b9fa4cbce
            </React.Suspense>
          );
        }}
      />
    </div>
  );
};

export default ProjectCostTabs;
