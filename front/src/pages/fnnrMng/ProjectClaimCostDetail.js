import React, { useCallback, useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import {Button, TabPanel} from "devextreme-react";
import ApiRequest from "../../utils/ApiRequest";

import ProjectClaimCostDetailJson from "./ProjectClaimCostDetailJson.json";
import SearchInfoSet from "../../components/composite/SearchInfoSet";

const ProjectClaimCostDetail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const prjctId = location.state.prjctId;
    const prjctNm = location.state.prjctNm;
    const [selectedIndex, setSelectedIndex] = useState(0);

    const ProjectClaimCostDetail = ProjectClaimCostDetailJson.tabMenu;
    const searchInfo = ProjectClaimCostDetailJson.searchInfo;
    const [param, setParam] = useState([]);

    let year = "";
    let monthVal = "";
    let aplyOdr = 0;
    let empId = "";

    let startYmd = '';
    let startOdr = '';
    let endYmd = '';
    let endOdr = '';

    useEffect(() => {

        const param = {
            queryId: "financialAffairMngMapper.retrievePrjctCtClmSttusIndvdlMMAccto",
            prjctId: prjctId,
            startYmOdr: year+monthVal+aplyOdr,
            endYmOdr: year+monthVal+aplyOdr,
            empId: empId,
        };

        const response = ApiRequest("/boot/common/queryIdSearch", param);

    }, []);

    const searchHandle = async (initParam) => {

        if(initParam.startYmOdr == null && initParam.endYmOdr == null) {

            const date = new Date();
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();

            let odrVal = day > 15 ? "1" : "2";
            let monthVal = month < 10 ? "0" + month : month;

            setParam({
                ...param,
                startYmOdr: year+monthVal+odrVal,
                endYmOdr: year+monthVal+odrVal,
                empId: initParam.empId,
            })

            return;
        } else if(initParam.startYmOdr !== null && initParam.endYmOdr == null) {

            startYmd = initParam.startYmOdr.substr(0, 6);
            startOdr = initParam.startYmOdr.substr(6, 1) > 15 ? "2" : "1";
            endYmd = initParam.startYmOdr.substr(0, 6);
            endOdr = initParam.startYmOdr.substr(6, 1) > 15 ? "2" : "1";

        } else if(initParam.startYmOdr == null && initParam.endYmOdr !== null) {

            startYmd = initParam.endYmOdr.substr(0, 6);
            startOdr = initParam.endYmOdr.substr(6, 1) > 15 ? "2" : "1";
            endYmd = initParam.endYmOdr.substr(0, 6);
            endOdr = initParam.endYmOdr.substr(6, 1) > 15 ? "2" : "1";

        } else if(initParam.startYmOdr !== null && initParam.endYmOdr !== null) {

            startYmd = initParam.startYmOdr.substr(0, 6);
            startOdr = initParam.startYmOdr.substr(6, 1) > 15 ? "2" : "1";
            endYmd = initParam.endYmOdr.substr(0, 6);
            endOdr = initParam.endYmOdr.substr(6, 1) > 15 ? "2" : "1";

        };

        setParam({

            ...param,
            startYmOdr: startYmd+startOdr,
            endYmOdr: endYmd+endOdr,
            empId: initParam.empId,
        })

    }

    // 탭 변경시 인덱스 설정
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
        <div >
            <div style={{ padding: "20px" }}>
                <div className="col-md-10 mx-auto" style={{marginTop: "20px", marginBottom: "10px"}}>
                    <h1 style={{fontSize: "30px"}}>프로젝트비용청구현황</h1>
                    <span>* 선택하신 일자가 속한 차수 기준으로 검색됩니다.</span><br/>
                    <span>* 일자를 하나만 선택하실 경우 해당 일자가 속한 하나의 차수만 조회됩니다.</span>
                    {/*<span>* {prjctNm}({param.startYmOdr.substr(0, 6)}-{param.startYmOdr.substr(6, 1)}~{param.endYmOdr.substr(0, 6)}-{param.endYmOdr.substr(6, 1)})</span>*/}
                </div>
                <div className="wrap_search" style={{marginBottom: "20px"}}>
                    <SearchInfoSet callBack={searchHandle} props={searchInfo}/>
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
                        dataSource={ProjectClaimCostDetail}
                        selectedIndex={selectedIndex}
                        onOptionChanged={onSelectionChanged}
                        itemTitleRender={itemTitleRender}
                        animationEnabled={true}
                        itemComponent={({data}) => {
                            const Component = React.lazy(() => import(`${data.url}`));
                            return (
                                <React.Suspense fallback={<div>Loading...</div>}>
                                    <Component prjctId={prjctId}
                                               prjctNm={prjctNm}
                                               startYmOdr={param.startYmOdr}
                                               endYmOdr={param.endYmOdr}
                                               empId={param.empId}/>
                                </React.Suspense>
                            );
                        }}
                    />
                </div>

            </div>
            <Button
                id="button"
                text="목록"
                className="btn_submit filled_gray"
                style={{alignSelf: "center"}}
                onClick={() => navigate("../fnnrMng/ProjectClaimCost")}
            />
        </div>
    );
};

export default ProjectClaimCostDetail;
