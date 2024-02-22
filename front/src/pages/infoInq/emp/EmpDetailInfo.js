import React, { useCallback, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { TabPanel } from "devextreme-react";
import { useLocation } from "react-router-dom";
import ApiRequest from "../../../utils/ApiRequest";
import { useCookies } from "react-cookie";

import EmpDetailInfoJson from "./EmpDetailInfoJson.json";

import Button from "devextreme-react/button";

const EmpDetailInfo = () => {
    
    const navigate = useNavigate();
    const location = useLocation();

    const [selectedIndex, setSelectedIndex] = useState(0);
    
    const EmpDetailInfo = EmpDetailInfoJson;

    /*유저세션*/
    const [cookies, setCookie] = useCookies(["userInfo", "userAuth"]);
    
    const empId = cookies.userInfo.empId;
    const deptId = cookies.userInfo.deptId;
   
    //탭 변경시 인덱스 설정 
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
        <div>
        <div
          className="title p-1"
          style={{ marginTop: "20px", marginBottom: "10px" }}
        >
          <div style={{ marginRight: "20px", marginLeft: "20px" }}>
            <h1 style={{ fontSize: "30px" }}>개인정보관리</h1>
          </div>
        </div>
        <div className="buttons" align="right" style={{ margin: "20px" }}>
          <Button
            width={110}
            text="Contained"
            type="default"
            stylingMode="contained"
            style={{ margin: "2px" }}
          >
            전체이력조회출력
          </Button>
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
            dataSource={EmpDetailInfo}
            selectedIndex={selectedIndex}
            onOptionChanged={onSelectionChanged}
            itemTitleRender={itemTitleRender}
            animationEnabled={true}
            itemComponent={({ data }) => {
            const Component = React.lazy(() => import(`${data.url}`));
            console.log(data);
            return (
                <React.Suspense fallback={<div>Loading...</div>}>
                    <Component/>
                </React.Suspense>
            );
          }}
          />
        </div>
      </div>
    );
};

export default EmpDetailInfo;