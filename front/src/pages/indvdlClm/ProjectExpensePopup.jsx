import React, { useEffect, useRef, useState } from "react";
import { Button } from "devextreme-react";
import { Popup } from "devextreme-react/popup";
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';
import ProjectExpenseCashCardReport from "../indvdlClm/ProjectExpenseCashCardReport";
import ProjectExpenseJson from "../indvdlClm/ProjectExpenseJson.json";
import CustomPivotGrid from "../../components/unit/CustomPivotGrid";
import ApiRequest from "../../utils/ApiRequest";
import ReactToPrint from 'react-to-print';

const ProjectExpensePopup = ({ visible, onPopHiding, basicInfo, aprvInfo, noDataCase, mmAtrzCmptnYn }) => {
    const { projectExpensePopup, projectExpensePopQueryIdList } = ProjectExpenseJson;
    const [ empInfo, setEmpInfo ] = useState({});
    const [ totalInfo, setTotalInfo ] = useState({});
    const [ data, setData ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const contentRef = useRef(null);
    const commonParams = {
        aplyYm: basicInfo.aplyYm,
        aplyOdr: basicInfo.aplyOdr,
        empId: basicInfo.empId
    };
    const fetchApiData = async (queryId) => { // parameter 재조합
        return ApiRequest('/boot/common/queryIdSearch', {
            ...commonParams,  queryId
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const empInfoPromise = getEmpInfo();
            const totalWorkTimePromise = getTotalWorkTime();
            const expenseTotalInfoPromise = getExpenseTotalInfo();
            const dailyWorkHoursPromise = getDailyWorkHours();
            
            await Promise.all([empInfoPromise, totalWorkTimePromise, expenseTotalInfoPromise, dailyWorkHoursPromise]);
            setLoading(false);
        };
        fetchData();
    }, [basicInfo]);

    const getEmpInfo = async () => {
        const response = await ApiRequest('/boot/common/queryIdSearch', {
            queryId: "indvdlClmMapper.retrievePopEmpInfo", empId: basicInfo.empId})
        setEmpInfo(response[0]);
    }

    const getTotalWorkTime = async () => {
        const res = await fetchApiData("indvdlClmMapper.retrieveTotalWorkTime");
        if (res[0] !== null) {
            setTotalInfo(prevInfo => ({
                ...prevInfo,
                totTime: res[0].totTime + ' hrs.'
            }));
        } else setTotalInfo({totTime: null})
    };

    const getExpenseTotalInfo = async () => {
        const res = await fetchApiData("indvdlClmMapper.retrieveExpenseTotal");
        if (res[0] !== null) {
            setTotalInfo(prevInfo => ({
                ...prevInfo,
                totalUtztnAmt: res[0].totalUtztnAmt,
                totalCount: res[0].totalCount
            }));
        }
    };

    const getDailyWorkHours = async () => {
        const requests = projectExpensePopQueryIdList.map(queryId => fetchApiData(queryId));
        const results = await Promise.all(requests);
        setData(results.flat());
    }

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
            case "time":
                const dataSource = new PivotGridDataSource({
                    fields: pop.info,
                    store: data
                })
                return (
                    loading ? <></> : (
                    <CustomPivotGrid
                        values={dataSource}
                        customColor={'#f0f0f0'}
                        blockCollapse={true}
                        weekendColor={true}
                        grandTotals={true}
                        grandTotalText={'총 시간'}
                        width={'100%'}
                    />)
                )
            default:
                return( loading ? <></> : (<ProjectExpenseCashCardReport basicInfo={basicInfo} />) )
        }
    };

    const contentArea = () => {
        return (
            <div>
                {((aprvInfo.totCnt === aprvInfo.aprv && mmAtrzCmptnYn === 'Y') || (noDataCase.cnt === 0 && noDataCase.yn === 'Y')
                ||(aprvInfo.totCnt === (aprvInfo.aprv + aprvInfo.rjct) && mmAtrzCmptnYn === 'Y')) ? 
                    <div ref={contentRef} >
                        <div style={{ textAlign: 'right' }}>
                            <ReactToPrint 
                                trigger={() => ( <Button text='출력' type='success' icon='print' /> )}
                                content={() => contentRef.current} 
                                pageStyle="@page { size: A4; ratio:100%; }" 
                            />
                        </div>
                        {projectExpensePopup.map((pop) => (
                            <div key={pop.key}>
                                <span>{pop.title}</span>
                                <div style={{ marginTop: "10px", marginBottom: "20px" }}>
                                    {renderTable(pop)}
                                </div>
                            </div>
                        ))}
                    </div>
                : mmAtrzCmptnYn === 'N'
                ? <span>진행중인 근무시간 요청이 있습니다. 승인 완료 후 출력하시기 바랍니다.</span>
                : (aprvInfo.aprvDmnd >= 1) ? <span>결재 진행중인 청구내역이 있습니다.</span> 
                : mmAtrzCmptnYn === null ? <>
                    <span style={{color: 'red'}}>아직 근무시간 승인요청을 하지 않았습니다. </span>
                    <span>요청한 뒤 승인 완료 후 출력하시기 바랍니다.</span>
                </> : <></>}
            </div>
        );
    };

    return (
        <div style={{marginBottom: '100px'}}>
            <Popup
                width={"70%"}
                height={"90%"}
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