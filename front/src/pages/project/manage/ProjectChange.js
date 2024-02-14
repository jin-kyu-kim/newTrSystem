import React, { useCallback, useState, Suspense, lazy, useMemo } from "react";
import { TabPanel } from "devextreme-react";
import { useLocation } from "react-router-dom";
import { Button } from "devextreme-react/button";
import TextArea from "devextreme-react/text-area";
import ToolbarItem from "devextreme-react/popup";

import ProjectChangeJson from "./ProjectChangeJson.json";

import LinkButton from "../../../components/unit/LinkButton.js";
import CustomPopup from "../../../components/unit/CustomPopup";

import { useCookies } from "react-cookie";
import ApiRequest from "utils/ApiRequest";

const ProjectChange = () => {
  const location = useLocation();
  const prjctId = location.state ? location.state.prjctId : null;
  const [selectedIndex, setSelectedIndex] = useState(0);

  const ProjectChangeTab = ProjectChangeJson.tab;
  const popup = ProjectChangeJson.popup;

  const [popupVisible, setPopupVisible] = useState(false);

  const [cookies, setCookie] = useCookies(["userInfo", "userAuth"]);
  const empId = cookies.userInfo.empId;
  const deptId = cookies.userInfo.deptId;


  // 탭 변경시 인덱스 설정
  const onSelectionChanged = useCallback(
    (args) => {
      if (args.name === "selectedIndex") {
        setSelectedIndex(args.value);
      }
    },[]
  );

  const itemTitleRender = (a) => <span>{a.TabName}</span>;
 
  const onPopup = () => {
    setPopupVisible(true);
  }

  const handleClose = () => {
    setPopupVisible(false);
  };

  const onSubmit = () => {
    handleSubmit();
    setPopupVisible(false);
  }

  const handleSubmit = async () => {
    const date = new Date();
    const param = [
      { tbNm: "PRJCT_ATRZ_LN"},
      { 
        prjctId: prjctId,
        empId: empId,
        deptId: deptId,
        regDt : date.toISOString().split('T')[0]+' '+date.toTimeString().split(' ')[0],
      },
    ];
    try {
      const response = await ApiRequest("/boot/prjct/insertRegistProjectAprv", param);

    } catch (error) {
      console.error('Error fetching data', error);
    }
  }

  return (
    <div>
      <div
        className="title p-1"
        style={{ marginTop: "20px", marginBottom: "10px" }}
      >
        <div style={{ marginRight: "20px", marginLeft: "20px" }}>
          <h1 style={{ fontSize: "30px" }}>프로젝트 변경</h1>
        </div>
      </div>
      <div className="buttons" align="right" style={{ margin: "20px" }}>
        <Button onClick={onPopup}>승인요청</Button>
        <LinkButton location={-1} name={"이전"} type={"normal"} />
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
          dataSource={ProjectChangeTab}
          selectedIndex={selectedIndex}
          onOptionChanged={onSelectionChanged}
          itemTitleRender={itemTitleRender}
          itemComponent={({ data }) => {
          const Component = lazy(() => import(`${data.url}`));
          if (data.index === selectedIndex){
          return (
            <Suspense fallback={<div>Loading...</div>}>
              <Component 
              prjctId={prjctId}
              revise={true}
              tabId={data.tabId}
              />
            </Suspense>
          );
          }
        }}
        />
      </div>
      <CustomPopup props={popup} visible={popupVisible} handleClose={handleClose}>
        <TextArea height="50%"/>
        <Button text="승인요청" onClick={onSubmit}/>
        <Button text="취소" onClick={handleClose}/>
      </CustomPopup>
    </div>
  );
};

export default ProjectChange;
