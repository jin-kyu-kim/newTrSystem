import React, { useState, useCallback, } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { TabPanel } from "devextreme-react";
import Button from "devextreme-react/button";

import ApiRequest from "utils/ApiRequest";
import ProjectAprvDetailJson from "./ProjectAprvDetailJson.json";
import LinkButton from "components/unit/LinkButton";

const ProjectAprvDetail = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const prjctId = location.state.id;
    const atrzLnSn = location.state.atrzLnSn;
    const totBgt = location.state.totBgt;
    const bgtMngOdr = location.state.bgtMngOdr;
    const ProjectAprvDetail = ProjectAprvDetailJson;

    const [selectedIndex, setSelectedIndex] = useState(0);

    // 탭 변경 시 인덱스 설정
    const onSelectionChanged = useCallback(
        (args) => {
            if(args.name === "selectedIndex") {
                setSelectedIndex(args.value);
            }
        },
        [selectedIndex]
    );

    // 탭 이름 렌더링
    const itemTitleRender = (a) => <span>{a.TabName}</span>;

    return (
        <div>
            <div
                className="title p-1"
                style={{ marginTop: "20px", marginBottom: "10px" }}
            >
                <div style={{ marginRight: "20px", marginBottom: "10px" }}>
                    <h1 style={{ fontSize: "30px" }}>프로젝트 승인 내역</h1>
                    <div>{location.state.prjctNm}</div>
                </div>
            </div>
            <div className="buttons" align="right" style={{ margin: "20px" }}>
                <Button text="승인"/>
                <Button text="반려"/>
                <LinkButton location={-1} name={"목록"} type={"normal"} stylingMode={"outline"}/>
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
                    dataSource={ProjectAprvDetail}
                    selectedIndex={selectedIndex}
                    onOptionChanged={onSelectionChanged}
                    itemTitleRender={itemTitleRender}
                    animationEnabled={true}
                    itemComponent = {
                        ({ data }) => {
                            const Component = React.lazy(() => import(`../${data.url}.js`));
                            return (
                                <React.Suspense fallback={<div>Loading...</div>}>
                                    <Component prjctId={prjctId} atrzLnSn={atrzLnSn}/>
                                </React.Suspense>
                            );
                        }
                    }
                />
            </div>
        </div>


    )

}

export default ProjectAprvDetail;