import React, { useCallback, useState, useEffect } from "react";
import {Button, TabPanel} from "devextreme-react";
import ApiRequest from "../../utils/ApiRequest";

import SearchOdrRange from "../../components/composite/SearchOdrRange";
import EmpExpenseAprvListJson from "./EmpExpenseAprvListJson.json";

const EmpExpenseAprvList = () => {

    const [selectedIndex, setSelectedIndex] = useState(0);

    const EmpExpenseAprvList = EmpExpenseAprvListJson.tabMenu;
    const searchParams = EmpExpenseAprvListJson.searchParams;
    const [param, setParam] = useState([]);
    const [searchItems, setSearchItems] = useState([]);

    let year = "";
    let monthVal = "";
    let aplyOdr = 0;


    useEffect(() => {

        const param = {
            queryId: "financialAffairMngMapper.retrieveExpensAprvDtls",
            year: year,
            monthVal: monthVal,
            aplyOdr: aplyOdr,
        };

        const response = ApiRequest("/boot/common/queryIdSearch", param);

    }, []);

    const searchHandle = async (initParam) => {

        if(initParam.yearItem == null || initParam.monthItem == null) {

            const date = new Date();
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();

            let odrVal = day > 15 ? "1" : "2";
            let monthVal = month < 10 ? "0" + month : month;

            setParam({
                ...param,
                year: year,
                monthVal: monthVal,
                aplyOdr: odrVal,
                // dateList: generateDates(year, monthVal, odrVal)
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
                year: initParam.yearItem,
                monthVal: initParam.monthItem,
                aplyOdr: '',
                empNo: empNo,
                expensCd: expensCd
                // dateList: generateDates(initParam.yearItem, initParam.monthItem, '')
            })
        } else {

            setParam({
                ...param,
                prjctId: prjctId,
                year: initParam.yearItem,
                monthVal: initParam.monthItem,
                aplyOdr: initParam.aplyOdr,
                empNo: empNo,
                expensCd: expensCd
                // dateList: generateDates(initParam.yearItem, initParam.monthItem, initParam.aplyOdr)
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
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div className="container">
                <div className="col-md-10 mx-auto" style={{marginTop: "20px", marginBottom: "10px"}}>
                    <h1 style={{fontSize: "30px"}}>경비 승인내역</h1>
                </div>
                <div className="col-md-10 mx-auto" style={{marginBottom: "10px"}}>
                    <span>* 차수별, 월별 검색</span>
                </div>
                <div className="wrap_search" style={{marginBottom: "20px"}}>
                    <SearchOdrRange callBack={searchHandle} props={searchParams} searchItems={searchItems} />
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
                                               year={param.year}
                                               monthVal={param.monthVal}
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
