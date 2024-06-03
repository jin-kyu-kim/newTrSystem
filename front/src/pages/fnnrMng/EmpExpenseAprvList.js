import React, { useCallback, useState } from "react";
import EmpExpenseAprvListJson from "./EmpExpenseAprvListJson.json";
import SearchInfoSet from 'components/composite/SearchInfoSet';
import {useLocation} from "react-router-dom";
import { TabPanel } from 'devextreme-react';

const EmpExpenseAprvList = () => {
    const [ selectedIndex, setSelectedIndex ] = useState(0);
    const EmpExpenseAprvList = EmpExpenseAprvListJson.tabMenu;
    const { searchInfo } = EmpExpenseAprvListJson;
    const [ param, setParam] = useState([]);
    const [ searchItems, setSearchItems] = useState([]);
    const location = useLocation();
    const date = new Date(); 
    const year = date.getFullYear();
    const month = date.getDate() > 15 ? date.getMonth() + 1 : date.getMonth();
    const monthVal = month < 10 ? "0" + month : month;
    const admin = location.state ? location.state.admin : undefined;
    const aplyYm = admin != undefined ? admin.aplyYm : year + monthVal;
    const aplyOdr = admin != undefined ? admin.aplyOdr : date.getDate() > 15 ? "1" : "2";

    const searchHandle = async (initParam) => {
        if(initParam.year == null || initParam.month == null) {
            setParam({
                ...param,
                aplyYm: aplyYm,
                aplyOdr: aplyOdr
            })
            return;
        };
        let prjctId = '';
        if(initParam.prjctId != null)
            prjctId = initParam.prjctId[0].prjctId;

        let empNo = '';
        if(initParam.empNo != null)
            empNo = initParam.empNo;

        let expensCd = '';
        if(initParam.expensCd != null)
            expensCd = initParam.expensCd;

        if(initParam.inqMthd == "month"){
            setParam({
                ...param,
                prjctId: prjctId,
                aplyYm: initParam.year + initParam.month,
                aplyOdr: '',
                empNo: empNo,
                expensCd: expensCd
            })
        } else {
            setParam({
                ...param,
                prjctId: prjctId,
                aplyYm: initParam.year + initParam.month,
                aplyOdr: initParam.aplyOdr,
                empNo: empNo,
                expensCd: expensCd
            })
        }
    }

    const onSelectionChanged = useCallback(
        (args) => {
            if (args.name === "selectedIndex") {
                setSelectedIndex(args.value);
            } else if (args.name === "selectedItems") {
                setSearchItems(args.value[0]);
            }
        },
        [setSelectedIndex]
    );

    const itemTitleRender = (a) => <span>{a.TabName}</span>;

    return (
        <div >
            <div style={{padding: "20px"}}>
                <div className="col-md-10 mx-auto" style={{marginTop: "20px", marginBottom: "10px"}}>
                    <h1 style={{fontSize: "30px"}}>경비 승인내역</h1>
                </div>
                <div className="col-md-10 mx-auto" style={{marginBottom: "10px"}}>
                    <span>* 차수별, 월별 검색</span>
                </div>
                <div className="wrap_search" style={{marginBottom: "20px"}}>
                    <SearchInfoSet callBack={searchHandle} props={searchInfo} />
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
                        dataSource={EmpExpenseAprvList}
                        selectedIndex={selectedIndex}
                        onOptionChanged={onSelectionChanged}
                        itemTitleRender={itemTitleRender}
                        animationEnabled={true}
                        itemComponent={({data}) => {
                            const Component = React.lazy(() => import(`${data.url}`));
                            return (
                                <React.Suspense fallback={<div>Loading...</div>}>
                                    <Component prjctId={param.prjctId}
                                               empNo={param.empNo}
                                               aplyYm={param.aplyYm}
                                               aplyOdr={param.aplyOdr}
                                               expensCd={param.expensCd}/>
                                </React.Suspense>
                            );
                        }}
                    />
                </div>
            </div>
        </div>
    );
};
export default EmpExpenseAprvList;