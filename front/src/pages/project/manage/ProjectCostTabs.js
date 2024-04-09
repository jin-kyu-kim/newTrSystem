import React, { useCallback, useState, lazy, Suspense } from "react";
import { TabPanel } from "devextreme-react";
import ProjectCostTabsJson from "./ProjectCostTabsJson.json";

const ProjectCostTabs = ({ prjctId, bgtMngOdr, ctrtYmd, stbleEndYmd, atrzDmndSttsCd }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  console.log(bgtMngOdr)
  console.log(prjctId)

  const projectCost = ProjectCostTabsJson;

  const onSelectionChanged = useCallback(
    (args) => {
      if (args.name === "selectedIndex") {
        setSelectedIndex(args.value);
      }
    },
    []
  );

  const costTitleRender = (a) => <span>{a.TabName}</span>;

  const selectedTab = projectCost[selectedIndex];

  // Lazy loading을 위해 동적으로 컴포넌트 로딩
  const LazyLoadedComponent = lazy(() => import(`${selectedTab.url}`));

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
          if (data === selectedTab) {
            return (
              <Suspense fallback={<div>Loading...</div>}>
                <LazyLoadedComponent prjctId={prjctId} ctrtYmd={ctrtYmd} stbleEndYmd={stbleEndYmd} bgtMngOdr={bgtMngOdr} atrzDmndSttsCd={atrzDmndSttsCd}/>
              </Suspense>
            );
          } else {
            return null;
          }
        }}
      />
    </div>
  );
};

export default ProjectCostTabs;
