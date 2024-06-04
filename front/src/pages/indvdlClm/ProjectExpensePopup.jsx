import React, { useEffect, useRef, useState } from "react";
import { Button } from "devextreme-react";
import { Popup } from "devextreme-react/popup";
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';
import ProjectExpenseCashCardReport from "../indvdlClm/ProjectExpenseCashCardReport";
import ProjectExpenseJson from "../indvdlClm/ProjectExpenseJson.json";
import CustomPivotGrid from "../../components/unit/CustomPivotGrid";
import ApiRequest from "../../utils/ApiRequest";
import ReactToPrint from 'react-to-print';

const ProjectExpensePopup = ({ visible, onPopHiding, basicInfo, aprvInfoProps, ctAplyLen, popMmYn }) => {
    const { projectExpensePopup, projectExpensePopQueryIdList } = ProjectExpenseJson;
    const [ empInfo, setEmpInfo ] = useState({});
    const [ totalInfo, setTotalInfo ] = useState({});
    const [ data, setData ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const [ aprvInfo, setAprvInfo ] = useState(aprvInfoProps);
    const [ mmAtrzCmptnYn, setMmAtrzCmptnYn ] = useState(popMmYn);
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
            const indivdlYnPromise = getIndivdlYn();
            const atrzCntPromise = getAtrzCnt();
            const totalWorkTimePromise = getTotalWorkTime();
            const expenseTotalInfoPromise = getExpenseTotalInfo();
            const dailyWorkHoursPromise = getDailyWorkHours();
            
            await Promise.all([empInfoPromise, indivdlYnPromise, atrzCntPromise, totalWorkTimePromise, expenseTotalInfoPromise, dailyWorkHoursPromise]);
            setLoading(false);
        };
        if(basicInfo.empId) fetchData();
    }, [basicInfo]);

    const getEmpInfo = async () => {
        const response = await ApiRequest('/boot/common/queryIdSearch', {
            queryId: "indvdlClmMapper.retrievePopEmpInfo", empId: basicInfo.empId})
        setEmpInfo(response[0]);
    }
    const getAtrzCnt = async () => {
        const response = await fetchApiData("indvdlClmMapper.retrieveCtAtrzDmndStts");
        setAprvInfo(response[0]);
    }
    const getIndivdlYn = async () => {
        const response = await ApiRequest('/boot/common/commonSelect', [{ tbNm: "PRJCT_INDVDL_CT_MM" }, 
        { empId: basicInfo.empId, aplyYm: basicInfo.aplyYm, aplyOdr: basicInfo.aplyOdr }])
        if (response.length !== 0) {
            setMmAtrzCmptnYn(response?.every(item => item.mmAtrzCmptnYn === null) ? null : response.some(item => item.mmAtrzCmptnYn === 'N') ? 'N' : 'Y');
        } else{
            setMmAtrzCmptnYn(undefined)
        }
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
                <div style={{textAlign: 'right', marginBottom: '2%'}}><Button icon="close" onClick={onPopHiding} /></div>
                {((aprvInfo.totCnt === aprvInfo.aprv && mmAtrzCmptnYn === 'Y') || (ctAplyLen === 0 && mmAtrzCmptnYn === 'Y')
                || (aprvInfo.totCnt === (aprvInfo.aprv + aprvInfo.rjct) && mmAtrzCmptnYn === 'Y')) 
                || (basicInfo.isHist && mmAtrzCmptnYn === 'Y' && ((aprvInfo.totCnt === aprvInfo.aprv) || (aprvInfo.totCnt === (aprvInfo.aprv + aprvInfo.rjct)))) ? 
                    <div ref={contentRef}>
                        <div style={{ textAlign: 'right'}} className='printBtn' >
                            <ReactToPrint 
                                trigger={() => ( <Button text='출력' type='success' icon='print' /> )}
                                content={() => contentRef.current} 
                                pageStyle="@page { size: A3; ratio:100%; }" 
                            />
                        </div>
                        <h2 style={{marginBottom: '3%', marginTop: '3%'}}>근무시간 비용 Report</h2>
                        {projectExpensePopup.map((pop) => (
                            <div key={pop.key}>
                                <span>{pop.title}</span>
                                <div style={{ marginTop: "10px", marginBottom: "20px" }}>
                                    {renderTable(pop)}
                                </div>
                            </div>
                        ))}
                    </div>
                : (aprvInfo.aprvDmnd >= 1)
                ? <span>결재 진행중인 청구내역이 있습니다.</span>
                : mmAtrzCmptnYn === 'N' ? <span>진행중인 근무시간 요청이 있습니다. 승인 완료 후 출력하시기 바랍니다..</span> 
                : mmAtrzCmptnYn === null ? <>
                    <span style={{color: 'red'}}>아직 근무시간 승인요청을 하지 않았습니다. </span>
                    <span>요청한 뒤 승인 완료 후 출력하시기 바랍니다.</span></> 
                : <span>마감 정보가 없습니다.</span>}
            </div>
        );
    };

    return (
        <div style={{marginBottom: '100px'}}>
            <Popup
                width={"80%"}
                height={"90%"}
                visible={visible}
                onHiding={onPopHiding}
                showCloseButton={true}
                closeOnOutsideClick={true}
                contentRender={contentArea}
                showTitle={false}
            ></Popup>
        </div>
    );
};
export default ProjectExpensePopup;