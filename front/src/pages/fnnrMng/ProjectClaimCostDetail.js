import React, { useCallback, useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import {Button, TabPanel} from "devextreme-react";
import ApiRequest from "../../utils/ApiRequest";

import ProjectClaimCostDetailJson from "./ProjectClaimCostDetailJson.json";
import SearchPrjctCostSet from "../../components/composite/SearchPrjctCostSet";

const ProjectCostClaimDetail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const prjctId = location.state.prjctId;
    const prjctNm = location.state.prjctNm;
    const [selectedIndex, setSelectedIndex] = useState(0);

    const ProjectClaimCostDetail = ProjectClaimCostDetailJson.tabMenu;
    const searchParams = ProjectClaimCostDetailJson.searchParams;
    const [param, setParam] = useState([]);

    let year = "";
    let monthVal = "";
    let aplyOdr = 0;
    let empId = "";

    useEffect(() => {

        const param = {
            queryId: "financialAffairMngMapper.retrievePrjctCtClmSttusYMDMMAccto",
            prjctId: prjctId,
            year: year,
            monthVal: monthVal,
            aplyOdr: aplyOdr,
            empId: empId,
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
                empId: initParam.empId,
            })

            return;
        };

        setParam({

            ...param,
            year: initParam.year,
            monthVal: initParam.month,
            aplyOdr: initParam.aplyOdr,
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
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div className="container" >
                <div className="col-md-10 mx-auto" style={{ marginTop: "20px", marginBottom: "10px" }}>
                    <h1 style={{fontSize: "30px"}}>프로젝트비용청구현황</h1>
                </div>
                <div className="col-md-10 mx-auto" style={{ marginBottom: "10px" }}>
                    <span>* {prjctNm}({param.year}{param.monthVal}-{param.aplyOdr})</span>
                </div>
                <div className="wrap_search" style={{marginBottom: "20px"}}>
                    <SearchPrjctCostSet callBack={searchHandle} props={searchParams} />
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
                        itemComponent={({ data }) => { console.log(param);
                            const Component = React.lazy(() => import(`${data.url}`));
                            return (
                                <React.Suspense fallback={<div>Loading...</div>}>
                                    <Component prjctId={prjctId}
                                               prjctNm={prjctNm}
                                               year={param.year}
                                               monthVal={param.monthVal}
                                               aplyOdr={param.aplyOdr}
                                               empId={param.empId} />
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
                style={{ alignSelf: "center" }}
                onClick={() => navigate("../fnnrMng/ProjectClaimCost")}
            />
        </div>
    );
};

export default ProjectCostClaimDetail;
