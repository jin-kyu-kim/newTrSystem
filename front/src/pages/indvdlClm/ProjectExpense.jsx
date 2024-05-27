import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, TabPanel } from "devextreme-react";
import ProjectExpenseJson from "./ProjectExpenseJson.json"
import ProjectExpensePopup from './ProjectExpensePopup';
import CustomTable from 'components/unit/CustomTable';
import ApiRequest from "../../utils/ApiRequest";
import SearchInfoSet from 'components/composite/SearchInfoSet';
import { useModal } from "../../components/unit/ModalContext";

const ProjectExpense = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { ExpenseInfo, keyColumn, ctAplyTableColumns, elcKeyColumn, columnCharge, buttonsConfig,
        aplyAndAtrzCtQueryId, dmndSttsQueryId, groupingColumn, groupingData, searchInfo } = ProjectExpenseJson.ProjectExpenseMain;
    const [ index, setIndex ] = useState(0);
    const [ atrzDmndSttsCnt, setAtrzDmndSttsCnt ] = useState({}); // 상태코드별 데이터 개수
    const [ indivdlList, setIndivdlList ] = useState([]); // 차수 청구내역 (table1)
    const [ ctAply, setCtAply ] = useState([]); // 차수 청구내역 (table1)
    const [ ctAtrz, setCtAtrz ] = useState([]); // 전자결재 청구내역 (table2)
    const [ changeColumn, setChangeColumn ] = useState([]); // 결재상태 컬럼 -> 버튼렌더를 위해 필요
    const [ ctAtrzCmptnYn, setCtAtrzCmptnYn ] = useState(); // 비용결재완료여부
    const [ mmAtrzCmptnYn, setMmAtrzCmptnYn ] = useState(); // 근무시간여부
    const admin = location.state ? location.state.admin : undefined;
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const empId = admin != undefined ? admin.empId : userInfo.empId;
    const [ popVisible, setPopVisible ] = useState(false);
    const [ histYmOdr, setHistYmOdr ] = useState({});
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getDate() > 15 ? date.getMonth() + 1 : date.getMonth();
    const monthVal = month < 10 ? "0" + month : month;
    const aplyYm = admin != undefined ? admin.aplyYm : year + monthVal;
    const aplyOdr = admin != undefined ? admin.aplyOdr : date.getDate() > 15 ? "1" : "2";
    const { handleOpen } = useModal();
    const itemTitleRender = (a) => <span>{a.TabName}</span>;
    const onSelectionChanged = useCallback(
        (args) => {
            if (args.name === "selectedIndex") setIndex(args.value);
        }, [setIndex]
    );
    useEffect(() => { getData(); }, []);

    useEffect(() => { // 결재상태에 따른 컬럼 list변경
        const columns = atrzDmndSttsCnt.ctReg > 0 ? 'ctAplyBtnColumns' : (atrzDmndSttsCnt.rjct > 0 ? 'rjctCnColumns' : 'ctAplyStrColumns');
        setChangeColumn(ctAplyTableColumns.concat(ProjectExpenseJson.ProjectExpenseMain[columns]));
    }, [atrzDmndSttsCnt]);

    const searchHandle = async (initParam) => {
        setHistYmOdr({
            aplyYm: initParam?.year + initParam?.month,
            aplyOdr: initParam?.aplyOdr,
            empId: empId,
            isHist: true
        })
        if (Object.keys(initParam).length !== 0) setPopVisible(true);
    };

    const getData = async () => {
        const apiInfo = [
            { url: "commonSelect", param: [{ tbNm: "PRJCT_INDVDL_CT_MM" }, { empId, aplyYm, aplyOdr }], setter: setCtAtrzCmptnData },
            { url: "queryIdSearch", param: { queryId: aplyAndAtrzCtQueryId, empId, aplyYm, aplyOdr, aply: 'aply' }, setter: setCtAply }, // 비용 청구내역
            { url: "queryIdSearch", param: { queryId: aplyAndAtrzCtQueryId, empId, aplyYm, aplyOdr, atrz: 'atrz' }, setter: setCtAtrz }, // 전자결재 내역
            { url: "queryIdSearch", param: { queryId: dmndSttsQueryId, empId, aplyYm, aplyOdr }, setter: setCtAtrzDmndSttsData } // 결재요청상태코드별 건수
        ];
        const promises = apiInfo.map(api => ApiRequest(`/boot/common/${api.url}`, api.param));
        const results = await Promise.all(promises);

        results.forEach((result, index) => {
            apiInfo[index].setter(result);
        });
    };

    const setCtAtrzCmptnData = (data) => {
        if (data.length !== 0) {
            setIndivdlList(data);
            setCtAtrzCmptnYn(data?.every(item => item.ctAtrzCmptnYn === null) ? null : data.some(item => item.ctAtrzCmptnYn === 'N') ? 'N' : 'Y');
            setMmAtrzCmptnYn(data?.every(item => item.mmAtrzCmptnYn === null) ? null : data.some(item => item.mmAtrzCmptnYn === 'Y') ? 'Y' : 'N');
        }
    };

    const setCtAtrzDmndSttsData = (data) => {
        setAtrzDmndSttsCnt(data[0]);
    };

    const prjctCtAtrzUpdate = async (data) => {
        if(data.name === 'onAprvDmndRtrcnClick'){
            const requests = ctAply.map(async (item) => {
                if (item.atrzDmndSttsCd === 'VTW03704') { // 반려일경우 반려사유, 결재자 NULL
                    try {
                        const response = await ApiRequest('/boot/common/commonUpdate', [
                            { tbNm: "PRJCT_CT_ATRZ" }, 
                            { aprvrEmpId: null, rjctPrvonsh: null, rjctYmd: null },
                            { prjctId: item.prjctId, empId: item.empId, aplyYm: item.aplyYm, aplyOdr: item.aplyOdr, atrzDmndSttsCd: item.atrzDmndSttsCd }
                        ]);
                        return response;
                    } catch (error) {
                        return null;
                    }
                }
            });
            const responses = await Promise.all(requests);
        };

        const param = {
            queryId: "indvdlClmMapper.updatePrjctCtAtrzStts",
            state: "UPDATE",
            actionType: data.actionType, // PRJCT_CT_ATRZ : 결재요청상태 update (입력마감 / 승인요청)
            empId, aplyYm, aplyOdr
        };
        if (ctAply.length !== 0) {
            const response = await ApiRequest("/boot/common/queryIdDataControl", param);
        }
        const updateStts = ctAply.length === 0
            ? (data.name === 'onInptDdlnClick' ? 'Y' : (data.name === 'onAprvDmndRtrcnClick' ? null : undefined))
            : (data.name === 'onInptDdlnClick' ? 'N' : (data.name === 'onInptDdlnRtrcnClick' ? null : undefined));
        if (updateStts !== undefined) updateCtAtrzCmptnYn(updateStts);
        getData();
        handleOpen(data.completeMsg);
    };

    const updateCtAtrzCmptnYn = async (status) => {
        const param = [
            { tbNm: "PRJCT_INDVDL_CT_MM" },
            { ctAtrzCmptnYn: status },
            { empId, aplyYm, aplyOdr }
        ];
        const response = await ApiRequest("/boot/common/commonUpdate", param);
        if (response >= 1) getData();
    };

    const onClickAction = async (onClick) => {
        if (onClick.name === 'onPrintClick') {
            setHistYmOdr(null)
            setPopVisible(true);
        } else {
            if (ctAtrzCmptnYn === undefined && mmAtrzCmptnYn === undefined) {
                handleOpen('경비청구 건수가 없을 경우 근무시간을 먼저 승인 요청 해주시기 바랍니다.')
                return;
            } else if(ctAtrzCmptnYn === null && mmAtrzCmptnYn === 'Y') {
                handleOpen('경비청구 건수가 없을 경우 바로 승인이 완료되며 입력 및 수정이 불가능합니다.')
            }
            prjctCtAtrzUpdate(onClick);
        }
    };
    const onPopHiding = async () => { setPopVisible(false); }

    const getButtonsShow = () => {
        if (ctAply?.length === 0) { // 비용청구가 없으면서 근무시간은 존재하는 경우
            if (ctAtrzCmptnYn === null) return buttonsConfig.default;
            if (ctAtrzCmptnYn === 'N') return buttonsConfig.hasApprovals;
            if (ctAtrzCmptnYn === 'Y' && mmAtrzCmptnYn === 'Y') return buttonsConfig.completed;
        } else {
            if (atrzDmndSttsCnt.rjct === 0 && atrzDmndSttsCnt.aprv > 0 && atrzDmndSttsCnt.inptDdln === 0 && atrzDmndSttsCnt.ctReg === 0) return buttonsConfig.completed;
            if (atrzDmndSttsCnt.aprvDmnd > 0 || atrzDmndSttsCnt.rjct > 0) return buttonsConfig.hasApprovals;
            if (atrzDmndSttsCnt.inptDdln > 0) return buttonsConfig.noApprovals;
        }
        return buttonsConfig.default;
    };

    const onBtnClick = async (btn, props) => {
        if (btn.name === 'atrzDmndSttsCd') { // aply, atrz, atdrn row삭제
            if (window.confirm("삭제하시겠습니까?")) {
                const param = { prjctId: props.prjctId, prjctCtAplySn: props.prjctCtAplySn, 
                    empId: props.empId, aplyYm: props.aplyYm, aplyOdr: props.aplyOdr };

                // PRJCT_INDVDL_CT_MM의 mmAtrzCmptnYn이 null이면 삭제, null이 아니면 삭제 불가
                const matches = (item) => 
                    item.aplyYm === props.aplyYm &&
                    item.aplyOdr === props.aplyOdr &&
                    item.prjctId === props.prjctId &&
                    item.empId === props.empId;
    
                const indivTarget = indivdlList.find(matches);
                const aplyTarget = ctAply.filter(matches);

                const tables = ["PRJCT_CT_ATRZ", "PRJCT_CT_ATDRN", "PRJCT_CT_APLY"];
                const deleteRow = async () => {
                    for (const tbNm of tables) {
                        try {
                            await ApiRequest("/boot/common/commonDelete", [{ tbNm }, param]);
                        } catch (error) {
                            throw error;
                        }
                    }
                };
                const allDelete = async () => {
                    try {
                        await deleteRow();
            
                        const { prjctCtAplySn, ...rest } = param;
                        if (indivTarget?.mmAtrzCmptnYn === null && aplyTarget.length === 1) {
                            await ApiRequest('/boot/common/commonDelete', [
                                { tbNm: "PRJCT_INDVDL_CT_MM" }, rest
                            ]);
                        }
                        const cardResult = await ApiRequest('/boot/common/commonUpdate', [
                            { tbNm: "CARD_USE_DTLS" },
                            { prjctCtInptPsbltyYn: "Y" },
                            { lotteCardAprvNo: props.lotteCardAprvNo }
                        ]);
            
                        if (cardResult) {
                            handleOpen("삭제되었습니다.");
                            getData();
                        }
                    } catch (error) {
                        console.error("Error:", error);
                    }
                };
                allDelete();
            }
        } else { // 문서이동
            navigate("/elecAtrz/ElecAtrzDetail", {state: {data: props}})
        }
    }

    const calculateCustomSummary = (options) => {
        const storeInfo = options.component.getDataSource().store()._array
        let utztnAmt = 0;

        storeInfo.forEach((item) => {
            if (item.atrzDmndSttsCd !== 'VTW03704') {
                utztnAmt += item.utztnAmt;
            }
        });
        const totalAmt = utztnAmt;

        if (options.summaryProcess ==="finalize") {
            if (options.name === "utztnAmt") {
                options.totalValue = totalAmt;
            }
        }
    }

    const groupingCustomizeText = (e) => {
        const mapping = { "VTW01902": "개인현금지급", "VTW01903": "개인법인카드" };
        return mapping[e.value] || "기업법인카드";
    }

    const RenderTopTable = ({ title, keyColumn, columns, values }) => {
        return (
            <div style={{ marginBottom: '20px' }}>
                <span>{title}</span>
                <CustomTable
                    keyColumn={keyColumn}
                    columns={columns}
                    values={values}
                    wordWrap={true}
                    onClick={onBtnClick}
                    grouping={groupingColumn}
                    groupingData={groupingData}
                    noDataText={'등록된 청구내역이 없습니다.'}
                    groupingCustomizeText={groupingCustomizeText}
                    calculateCustomSummary={calculateCustomSummary}
                />
            </div>
        );
    };

    return (
        <div>
            <div style={{ marginLeft: '2%', marginRight: '2%', marginBottom: '10%' }}>
                <div className="mx-auto" style={{ display: 'flex', marginTop: "20px", marginBottom: "30px" }}>
                    <h1 style={{ fontSize: "30px", marginRight: "20px" }}>프로젝트비용</h1>
                    {getButtonsShow().map(({ onClick, text, type }, index) => (
                        <Button key={index} text={text} type={type} style={{ marginRight: '5px' }}
                            onClick={onClick.name !== 'onPrintClick' ? () => handleOpen(onClick.msg, () => onClickAction(onClick))
                                : () => onClickAction(onClick)} />))}
                </div>

                <div style={{ marginBottom: '50px', width: 600 }}>
                    {admin != undefined ? <></> :
                        <SearchInfoSet
                            callBack={searchHandle}
                            props={searchInfo}
                        />}
                </div>
                {admin != undefined ?
                    <RenderTopTable title={`*${admin.empno} ${aplyYm}-${aplyOdr} 차수 TR 청구 내역`} keyColumn={keyColumn} columns={changeColumn} values={ctAply} /> :
                    <RenderTopTable title={`* ${aplyYm}-${aplyOdr} 차수 TR 청구 내역`} keyColumn={keyColumn} columns={changeColumn} values={ctAply} />}
                <RenderTopTable title='* 전자결재 청구 내역' keyColumn={elcKeyColumn} columns={columnCharge} values={ctAtrz} />

                {atrzDmndSttsCnt.ctReg > 0 || ctAtrzCmptnYn === null || ctAtrzCmptnYn === undefined
                    ? <TabPanel
                        dataSource={ExpenseInfo}
                        selectedIndex={index}
                        onOptionChanged={onSelectionChanged}
                        itemTitleRender={itemTitleRender}
                        animationEnabled={true}
                        itemComponent={({ data }) => {
                            const Component = React.lazy(() => import(`${data.url}`));
                            return (
                                <React.Suspense fallback={<div>Loading...</div>}>
                                    <Component
                                        empId={empId}
                                        aplyYm={aplyYm}
                                        aplyOdr={aplyOdr}
                                        setIndex={setIndex}
                                        getData={getData}
                                    />
                                </React.Suspense>
                            );
                        }} />
                    : <div style={{
                        height: "250px",
                        borderRadius: "5px",
                        background: "#F2F2F2",
                        display: "flex",
                        alignItems: "center"
                    }}><span style={{ marginLeft: '200px', fontSize: '16pt' }}>입력 마감되었습니다.</span></div>}
            </div>
            <ProjectExpensePopup
                visible={popVisible}
                onPopHiding={onPopHiding}
                aprvInfo={atrzDmndSttsCnt}
                noDataCase={{ cnt: ctAply.length, yn: mmAtrzCmptnYn }}
                mmAtrzCmptnYn={mmAtrzCmptnYn}
                basicInfo={histYmOdr !== null ? histYmOdr : { aplyYm, aplyOdr, empId }}
            />
        </div>
    );
};
export default ProjectExpense;