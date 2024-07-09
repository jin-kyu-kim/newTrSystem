import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "devextreme-react";
import ElecAtrzManageHistList from "./ElecAtrzManageAttchList";
import ElecAtrzManageAttchList from "./ElecAtrzManageAttchList";
import elecAtrzManageJson from "./ElecAtrzManageJson.json";
import SearchInfoSet from "components/composite/SearchInfoSet";
import CustomStore from 'devextreme/data/custom_store';
import CustomTable from "components/unit/CustomTable";
import ApiRequest from "utils/ApiRequest";
import "../elecAtrz/ElecAtrz.css";

const ElecAtrzManage = () => {
    const navigate = useNavigate();
    const { keyColumn, queryId, countQueryId, atchmnFlPopupqueryId, baseColumns, progress, atrzSquareList, searchInfo } = elecAtrzManageJson.elecManageMain;
    const [ searchParam, setSearchParam ] = useState({ keyColumn: keyColumn, queryId: queryId, searchType: "progress", startVal: 0, pageSize: 20 });
    const [ totalCount, setTotalCount ] = useState([]);
    const [ columnTitle, setColumnTitle ] = useState(baseColumns.concat(progress));
    const [ searchSetVisible, setSearchSetVisivle ] = useState(false);
    const [ clickBox, setClickBox ] = useState('progress');

    const [isAtchmnFlPopupVisible, setIsAtchmnFlPopupVisible] = useState(false);
    const [isDocHistPopupVisible, setIsDocHistPopupVisible] = useState(false);

    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [pageIndex, setPageIndex] = useState(0);

    useEffect(() => {
        pageHandle();
    }, [searchParam, pageIndex]);

    const pageHandle = async () => {
        const countParam = { queryId: countQueryId }
        try {
            const cntResp = await ApiRequest('/boot/common/queryIdSearch', countParam)
            const atrzResp = await ApiRequest('/boot/common/queryIdSearch', searchParam)
            setTotalCount(cntResp);

            if (clickBox === "progress") {
                setTotalItems(cntResp[0].progress)
            } else if (clickBox === "terminatedAprvrEmp") {
                setTotalItems(cntResp[0].terminatedAprvrEmp)
            } else if (clickBox === "deny") {
                setTotalItems(cntResp[0].deny)
            }

            if (atrzResp.length !== 0) {
            } else {
                setTotalPages(1);
            }
        } catch (error) {
            console.log('error', error)
        }
    }

    const searchHandle = (initParam) => {
        setSearchParam({
            ...searchParam,
            ...initParam,
            queryId: queryId,
            keyColumn: keyColumn,
            searchType: clickBox,
            startVal: 0,
            pageSize: 20
        })
    }

    const getList = (keyNm, sttsCd) => {
        setSearchParam({
            queryId: queryId,
            keyColumn: keyColumn,
            searchType: keyNm,
            startVal: 0,
            pageSize: 20,
            sttsCd: sttsCd
        })
        keyNm !== "progress" ? setSearchSetVisivle(true) : setSearchSetVisivle(false);
        setClickBox(keyNm)
        setColumnTitle(
            baseColumns.concat(elecAtrzManageJson.elecManageMain[keyNm])
        )
    }

    const [atchmnFlId, setAtchmnFlId] = useState([]);

    //팝업 호출 이벤트
    const onBtnClick = (button, data) => {
        if (button.name === "atchmnFl") {
            let popupParam = {
                queryId: atchmnFlPopupqueryId,
                elctrnAtrzId: data.elctrnAtrzId
            }
            setIsAtchmnFlPopupVisible(true);

            popupHandle(popupParam)
        } else if (button.name === "docHist") {
            setIsDocHistPopupVisible(true);
        }
    }

    const popupHandle = async (popupParam) => {
        try {
            const response = await ApiRequest('/boot/common/queryIdSearch', popupParam);
            setAtchmnFlId(response[0])
        } catch (error) {
            console.log('error', error)
        }
    }

    const onAtchmnFlHidePopup = () => {
        setIsAtchmnFlPopupVisible(false);
    }

    const onRowClick = (e) => {
        navigate('/elecAtrz/ElecAtrzDetail', { state: { data: e.data, sttsCd: searchParam.sttsCd, prjctId: e.data.prjctId } });
    }

    const ElecSquare = ({ keyNm, atrzSquare }) => {
        return (
            <div id={keyNm} onClick={() => getList(keyNm, atrzSquare.sttsCd)} style={(clickBox === keyNm) ? { backgroundColor: '#4473a5', color: 'white' } : { backgroundColor: atrzSquare.squareColor }} className='elec-square' >
                <div className="elec-square-text" style={{ color: (atrzSquare.text) && 'white' }}>{atrzSquare.text}</div>
                <div className="elec-square-count" style={{ color: (atrzSquare.text) && 'white' }}>
                    {totalCount.length !== 0 && (totalCount[0][keyNm] === 0 || totalCount[0][keyNm] === null ? 0 : <span>{totalCount[0][keyNm]}</span>)} 건
                </div>
                <Tooltip
                    target={`#${keyNm}`}
                    showEvent="mouseenter"
                    hideEvent="mouseleave"
                    position="top"
                    hideOnOutsideClick={false}>
                    <div className='elecTooltip'>{atrzSquare.toolTip}</div>
                </Tooltip>
            </div>
        );
    }

    const onPageIndexChanged = (e) => {
        setPageIndex(e.pageIndex + 1);
    };

    const customStore = new CustomStore({
        key: "elctrnAtrzDocNo",
        load: async (loadOptions) => {
            const { skip, take } = loadOptions;
            const pageIndex = (skip / take) + 1;

            try {
                const { data, totalCount } = await fetchData(pageIndex, take);
                return {
                    data,
                    totalCount,
                };
            } catch (error) {
                console.error('CustomStore 로드 중 에러:', error);
                throw error;
            }
        }
    });

    const fetchData = async (pageIndex, pageSize) => {
        try {
            const response = await ApiRequest('/boot/common/queryIdSearch', {
                ...searchParam,
                startVal: (pageIndex - 1) * pageSize,
                pageSize: pageSize,
            });
            return {
                data: response,
                totalCount: totalItems,
            };
        } catch (error) {
            console.error('데이터를 가져오는 중 에러 발생:', error);
            return {
                data: [],
                totalCount: 0,
            };
        }
    };

    const pagination = { pageSize: pageSize, pageIndex: pageIndex }

    return (
        <div>
            <div className="title p-1" style={{ marginTop: "20px", marginBottom: "10px" }} ></div>
            <div className="col-md-10 mx-auto" style={{ marginBottom: "20px", display: 'flex' }}>
                <h3>전자결재(관리자)</h3>
            </div>

            <div className="elec-container">
                {atrzSquareList.map((atrzSquare) => (
                    <ElecSquare
                        keyNm={atrzSquare.key}
                        atrzSquare={atrzSquare}
                    />
                ))}
            </div>

            <div style={{ marginTop: "20px", marginBottom: "20px" }}>
                <div style={{ marginBottom: '15px' }}>
                    {searchSetVisible ? <SearchInfoSet callBack={searchHandle} props={searchInfo} /> : null}
                </div>
                <CustomTable
                    keyColumn={keyColumn}
                    pageSize={pageSize}
                    dataSource={customStore}
                    columns={columnTitle}
                    pagination={pagination}
                    onRowClick={onRowClick}
                    paging={true}
                    onClick={onBtnClick}
                    wordWrap={true}
                    onOptionChanged={onPageIndexChanged}
                    remoteOperations={true}
                    showPageSizeSelector={false}
                />
            </div>
            <ElecAtrzManageHistList
            />
            {isAtchmnFlPopupVisible &&
                <ElecAtrzManageAttchList
                    width={"500px"}
                    height={"500px"}
                    visible={isAtchmnFlPopupVisible}
                    attachId={atchmnFlId}
                    title={"전자결재 파일 첨부"}
                    onHiding={onAtchmnFlHidePopup}
                />}
        </div>
    );
}
export default ElecAtrzManage;