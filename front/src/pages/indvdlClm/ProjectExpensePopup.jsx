import React, { useEffect, useState } from "react";
import { Button } from "devextreme-react";
import { Popup } from "devextreme-react/popup";
import ProjectExpenseJson from "../indvdlClm/ProjectExpenseJson.json";
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';
import CustomPivotGrid from "../../components/unit/CustomPivotGrid";
import ApiRequest from "../../utils/ApiRequest";

const ProjectExpensePopup = ({ visible, onPopHiding, basicInfo }) => {
    const { projectExpensePopup } = ProjectExpenseJson;
    const { deptInfo, userInfo } = basicInfo.cookies;
    const [ totalInfo, setTotalInfo ] = useState({});
    const [data, setData] = useState([]);
    const empInfo = {
        empno: userInfo.empno,
        empFlnm: userInfo.empNm,
        deptNm: deptInfo[0].deptNm,
        jbpsNm: userInfo.jbpsNm
    }
    const commonParams = {
        aplyYm: basicInfo.aplyYm,
        aplyOdr: basicInfo.aplyOdr,
        empId: basicInfo.empId
    };

    useEffect(() => {
        getTotalExpense();
        getTotalTime();
        getData();
    }, []);

    const fetchApiData = async (queryId) => { // parameter 재조합
        return ApiRequest('/boot/common/queryIdSearch', {
            ...commonParams,
            queryId
        });
    };

    const getTotalTime = async () => {
        const res = await fetchApiData("indvdlClmMapper.retrieveTimeTotal");
        if (res[0] !== null) {
            setTotalInfo(prevInfo => ({
                ...prevInfo,
                totTime: res[0].totTime * 8 + ' hr.'
            }));
        }
    };

    const getTotalExpense = async () => {
        const res = await fetchApiData("indvdlClmMapper.retrieveExpenseTotal");
        if (res[0] !== null) {
            setTotalInfo(prevInfo => ({
                ...prevInfo,
                totalUtztnAmt: res[0].totalUtztnAmt,
                totalCount: res[0].totalCount + ' 개'
            }));
        }
    };

    const getData = async () => {
        try {
            const [workTimeResponse, ctrtDayResponse] = await Promise.all([
                fetchApiData("indvdlClmMapper.retrievePrjctWorkTime"),
                fetchApiData("indvdlClmMapper.retrieveCtrtDay")
            ]);
    
            const combinedData = [...workTimeResponse, ...ctrtDayResponse];
            setData(combinedData);
        } catch (error) {
            console.error('error', error);
        }
    };

    const renderTable = (pop) => {
        switch (pop.key) {
            case "basic":
                return (
                    <div className="expense-popup-table">
                        <div style={{ display: "flex" }}>
                            <div className="expense-popup-first-col">{pop.info[0].value}</div>
                            <div className="expense-popup-val-col">{basicInfo['aplyYm']}-{basicInfo['aplyOdr']}</div>
                        </div>
                        {[1, 3].map((index) => (
                            <div style={{ display: "flex" }} key={index}>
                                <div className="expense-popup-first-col">{pop.info[index].value}</div>
                                <div className="expense-popup-val-col">{empInfo[pop.info[index].key]}</div>
                                {pop.info[index + 1] && (
                                    <>
                                        <div className="expense-popup-first-col">{pop.info[index + 1].value}</div>
                                        <div className="expense-popup-val-col">{empInfo[pop.info[index + 1].key]}</div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                );
            case "total":
                return (
                    <div className="expense-popup-table">
                        <div style={{ display: "flex" }}>
                            {pop.info.map((item, index) => (
                                <React.Fragment key={index}>
                                    <div className="expense-popup-first-col">{item.value}</div>
                                    <div className="expense-popup-val-col">{totalInfo[item.key]}</div>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                );
            default:
                const dataSource = new PivotGridDataSource({
                    fields: pop.info,
                    store: data
                })
                return (
                    <CustomPivotGrid
                        values={dataSource}
                        blockCollapse={true}
                        grandTotals={true}
                    />
                )
        }
    };

    const contentArea = () => {
        return (
            <div>
                <div style={{ textAlign: 'right' }}>
                    <Button text="출력" type="success" />
                </div>

                {projectExpensePopup.map((pop) => (
                    <div>
                        <span>{pop.title}</span>
                        <div style={{ marginTop: "10px", marginBottom: "20px" }}>
                            {renderTable(pop)}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div>
            <Popup
                width={1100}
                height={1000}
                visible={visible}
                onHiding={onPopHiding}
                showCloseButton={true}
                closeOnOutsideClick={true}
                contentRender={contentArea}
                title="근무시간 비용 Report"
            ></Popup>
        </div>
    );
};
export default ProjectExpensePopup;