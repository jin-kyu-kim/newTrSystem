import React, { useEffect, useState } from "react";
import { validateFields, hasError } from './ProjectExpenseValidate';
import SearchInfoSet from "../../components/composite/SearchInfoSet";
import CustomEditTable from 'components/unit/CustomEditTable';
import ProjectExpenseSubmit from "./ProjectExpenseSubmit";
import ProjectExpenseJson from "./ProjectExpenseJson.json";
import ProjectExpenseSendPop from './ProjectExpenseSendPop';
import ApiRequest from "../../utils/ApiRequest";
import { useModal } from "../../components/unit/ModalContext"
import { Button } from 'devextreme-react';

const ProjectExpenseCard = (props) => {
    const { keyColumn, queryId, prjctStleQueryId, prjctStlePdQueryId, tableColumns, searchInfo, placeholderAndRequired, buttonGroup } = ProjectExpenseJson.ProjectExpenseTab;
    const userInfo = JSON.parse(localStorage.getItem("userInfo"))
    const deptInfo = JSON.parse(localStorage.getItem("deptInfo"))
    const empInfo = { jbttlCd: deptInfo[0].jbttlCd, empno: userInfo.empno };
    const [cdList, setCdList] = useState([]);
    const [expensCd, setExpensCd] = useState({});
    const [comboList, setComboList] = useState({});
    const [cardUseDtls, setCardUseDtls] = useState([]);
    const [selectedItem, setSelectedItem] = useState([]);
    const [popVisible, setPopVisible] = useState(false);
    const [isPrjctIdSelected, setIsPrjctIdSelected] = useState({}); // 비용코드 활성화 조건
    const [validationErrors, setValidationErrors] = useState([]);
    const { handleOpen } = useModal();
    const [param, setParam] = useState({ queryId: queryId, empId: props.empId });

    const searchHandle = async (initParam) => {
        setParam({ ...param, ...initParam });
    };

    const chgPlaceholder = (col, lotteCardAprvNo) => {
        const currentExpensCd = expensCd[lotteCardAprvNo];
        const matchedItem = placeholderAndRequired.find(item => item.expensCd === currentExpensCd);
        return matchedItem ? (col.key === 'atdrn' ? matchedItem.atdrnPlaceholder : matchedItem.ctPrposPlaceholder)
            : col.placeholder;
    };

    useEffect(() => {
        if (!Object.values(param).every((value) => value === "")) {
            getCardUseDtls();
        }
    }, [param]);

    useEffect(() => { 
        getSelectBoxList();
        getCardUseDtls();
    }, []);

    const getSelectBoxList = async () => {
        const comBoInfo = ['prjctId', 'emp'];
        const comSelectParam = [
            { queryId: "commonMapper.autoCompleteProject", bizSttsCd: "VTW00402" },
            [{ tbNm: "EMP" }]
        ];
        try {
            for (let i = 0; i < comSelectParam.length; i++) {
                let response = await ApiRequest(comBoInfo[i] === 'prjctId' ? "/boot/common/queryIdSearch"
                    : "/boot/common/commonSelect", comSelectParam[i]);
                if (comBoInfo[i] === "emp") {
                    response = response.map(({ empId, empno, empFlnm }) => ({
                        key: empId,
                        value: empFlnm,
                        displayValue: empno + ' ' + empFlnm,
                    }));
                }
                setComboList(prevComboList => ({
                    ...prevComboList,
                    [comBoInfo[i]]: response
                }));
            }
        } catch (error) {
            console.log(error);
        }
    };

    const setComboBox = (value, props, col) =>{
        if(value) {
            if (col.key === 'prjctId') {
                getCdList(value, props.data.lotteCardAprvNo);
                props.data.prjctId = value.prjctId;
                props.data.aprvrEmpId = value.prjctMngrEmpId; // 결재자 추가
    
                setIsPrjctIdSelected(prevStts => ({
                    ...prevStts,
                    [props.data.lotteCardAprvNo]: !!value
                }));

            } else if (col.key === 'expensCd') {
                props.data.expensCd = value.expensCd;
                props.data.expensCdObject = value;

                setExpensCd(prevStts => ({
                    ...prevStts,
                    [props.data.lotteCardAprvNo]: value.expensCd
                }));
            }
        } else {
            // showClearButton을 통해 지운 경우
            if(col.key === 'prjctId'){
                props.data.prjctId = null;
                props.data.aprvrEmpId = null;
                props.data.expensCd = null;
            } else {
                props.data.expensCd = null;
                props.data.expensCdObject = null;
            }
            setIsPrjctIdSelected(prevStts => ({
                ...prevStts,
                [props.data.lotteCardAprvNo]: true
            }))
        }

        const updatedSelectedItem = selectedItem.map(item => 
            item.lotteCardAprvNo === props.data.lotteCardAprvNo ? { ...item, ...props.data } : item
        );
        updatedSelectedItem.sort((a, b) => {
            if (a.aplyYm !== b.aplyYm) {
                return b.aplyYm - a.aplyYm;
            }
            if (a.aplyOdr !== b.aplyOdr) {
                return a.aplyOdr - b.aplyOdr;
            }
            return a.cardUseSn - b.cardUseSn;
        });
        setSelectedItem(updatedSelectedItem);
    }

    const getCdList = async (prjct, lotteCardAprvNo) => {
        if(prjct === null || prjct === undefined) {
            return;
        } else {
            let queryId = prjct.prjctStleCd === 'VTW01802' ? prjctStleQueryId : prjctStlePdQueryId
            try {
                const response = await ApiRequest('/boot/common/queryIdSearch', {
                    queryId: queryId, prjctId: prjct.prjctId, multiType: true
                })
                setCdList(prevCdLists => ({
                    ...prevCdLists,
                    [lotteCardAprvNo]: response
                }));
    
            } catch (error) {
                console.log('error', error);
            }
        }
    }

    const getCardUseDtls = async () => {
        const response = await ApiRequest('/boot/common/queryIdSearch', param);
        
        const updatedResponse = response.map(item => {
            const excludeKeys = ['bizSttsCd', 'prjctMngrEmpId', 'prjctNm', 'prjctStleCd', 'prjctTag', 'cdNm'];
            
            const filteredItem = Object.keys(item).reduce((acc, key) => {
                if (!excludeKeys.includes(key)) {
                    acc[key] = item[key];
                }
                return acc;
            }, {});

            return {
                ...filteredItem,
                expensCdObject: {
                    cdNm: item.cdNm,
                    expensCd: item.expensCd,
                    lotteCardAprvNo: item.lotteCardAprvNo
                },
                aprvrEmpId: item.prjctMngrEmpId
            };
        });
        setCardUseDtls(updatedResponse);

        // 임시저장된 비용코드가 있을경우 cdList setState
        const initialCdList = updatedResponse.reduce((acc, item) => {
            if (item.expensCdObject) {
                acc[item.lotteCardAprvNo] = [item.expensCdObject];
            }
            return acc;
        }, {});
        setCdList(initialCdList)
    };

    const handleDelete = () => {
        if (selectedItem.length === 0) {
            handleOpen('선택된 항목이 없습니다.');
            return;
        }
        const param = [{ tbNm: "CARD_USE_DTLS" }];

        Promise.all(selectedItem.map(async (item) => {
            const currentParam = [...param, { 
                empId: item.empId,
                aplyYm: item.aplyYm,
                aplyOdr: item.aplyOdr,
                cardUseSn: item.cardUseSn
            }];
            try {
                const res = await ApiRequest('/boot/common/commonDelete', currentParam);
                return res;
            } catch (error) {
                console.error('error', error);
            }
        }))
        .then(results => {
            // 삭제된 항목 selectedItem과 cardUseDtls에서 제거
            const updatedCardUseDtls = cardUseDtls.filter(item => 
                !selectedItem.some(selected => selected.lotteCardAprvNo === item.lotteCardAprvNo)
            );
            setCardUseDtls(updatedCardUseDtls);
            setSelectedItem([]);
            handleOpen('삭제되었습니다.');
        })
        .catch(error => { console.error('error', error); });
    };

    const onSelection = (e) => {
        const updatedSelectedRowsData = e.selectedRowsData.map(row => {
            if (row.prjctId === null && row.expensCd === null) {
                const originalRow = cardUseDtls.find(item => item.lotteCardAprvNo === row.lotteCardAprvNo);
                return {
                    ...row,
                    prjctId: originalRow ? originalRow.prjctId : null,
                    expensCd: originalRow ? originalRow.expensCd : null,
                    expensCdObject: originalRow ? originalRow.expensCdObject : null
                };
            }
            return row;
        });
        setSelectedItem(updatedSelectedRowsData);
    };

    const sendAtrz = (selectedItem) => {
        if (selectedItem.length === 0) {
            handleOpen("선택된 사용내역이 없습니다.")
            return;
        }
        let firstPrjctId = selectedItem[0].prjctId;

        for (const item of selectedItem) {
            if (item.prjctId === null) {
                handleOpen('프로젝트를 선택해주세요.');
                return;
            }
            if (item.expensCd === null) {
                handleOpen('비용코드를 선택해주세요.');
                return;
            }
            if (item.prjctId !== firstPrjctId) {
                handleOpen('동일한 프로젝트에 대해서만 청구가 가능합니다.');
                return;
            }
        }
        setPopVisible(true);
    };
    const onPopHiding = () => { setPopVisible(false); };

    const headerCellRender = ({ column }) => (
        ['prjctId'].includes(column.dataField)
        ? <div>
            {column.caption}
            <Button text='일괄적용' type='success' onClick={() => onBulkAply(column.dataField)}
                style={{fontSize: '8pt', marginLeft: '10px'}}/>
        </div>
        : ['expensCd'].includes(column.dataField) ?<div>
                {column.caption}
                <Button text='일괄적용' type='success' onClick={() => onBulkAply(column.dataField)}
                        style={{fontSize: '8pt', marginLeft: '10px'}}/>
            </div>:
            <div>{column.caption}</div>
    );

    const onBulkAply = (field) => {
        if (selectedItem.length === 0) return;
        
        const firstSelectedRow = selectedItem[0];
        const firstFieldValue = firstSelectedRow[field];
        const firstFieldObject = firstSelectedRow[`${field}Object`];

        const updatedCardUseDtls = cardUseDtls.map(item => {
            if (selectedItem.some(selected => selected.lotteCardAprvNo === item.lotteCardAprvNo)) {
                if (field === 'prjctId') {
                    getCdList(firstFieldObject, item.lotteCardAprvNo);
                    setIsPrjctIdSelected(prevStts => ({
                        ...prevStts,
                        [item.lotteCardAprvNo]: !!firstFieldValue
                    }));
                    return {
                        ...item,
                        prjctId: firstFieldValue
                    };
                } 
                if (field === 'expensCd') {
                    return {
                        ...item,
                        expensCd: firstFieldValue,
                        expensCdObject: firstFieldObject
                    };
                }
            }
            return item;
        });
        setCardUseDtls(updatedCardUseDtls);

        // selectedItem 업데이트
        const updatedSelectedItem = selectedItem.map(item => {
            const updatedItem = updatedCardUseDtls.find(updated => updated.lotteCardAprvNo === item.lotteCardAprvNo);
            if (updatedItem) {
                onTempInsert({ key: field }, updatedItem[field], { data: updatedItem });
            }
            return updatedItem ? { ...item, ...updatedItem } : item;
        });

        setSelectedItem(updatedSelectedItem);
    };

    const onTempInsert = async (col, value, props) => {
        const param = [
            {tbNm: "CARD_USE_DTLS"},
            {[col.key]: value},
            {lotteCardAprvNo: props.data.lotteCardAprvNo}
        ]
        const updateRes = await ApiRequest('/boot/common/commonUpdate', param)
    }
    
    const cellRenderConfig = {
        getCdList, isPrjctIdSelected, setIsPrjctIdSelected, chgPlaceholder, comboList, cdList, setComboBox, onTempInsert, selectedItem, setSelectedItem, 
        expensCd, setExpensCd, setValidationErrors, hasError: (lotteCardAprvNo, fieldName) => hasError(validationErrors, lotteCardAprvNo, fieldName)
    };

    return (
        <div>
            <div className="wrap_search" style={{ margin: "20px" }}>
                <SearchInfoSet callBack={searchHandle} props={searchInfo} />
            </div>
            <ProjectExpenseSubmit selectedItem={selectedItem} getData={props.getData} ymOdrInfo={{aplyYm: props.aplyYm, aplyOdr: props.aplyOdr}}
                validateFields={() => validateFields(selectedItem, placeholderAndRequired, setValidationErrors, buttonGroup, empInfo)}
                handleDelete={handleDelete} buttonGroup={buttonGroup} sendAtrz={sendAtrz} />

            <div style={{ fontSize: 14, marginBottom: "20px" }}>
                <p style={{ marginBottom: '10px' }}> ※ 일괄적용 버튼 클릭 시 체크박스로 선택한 항목 중 가장 위에서 선택한 항목으로 일괄적용 됩니다.</p>
                <span style={{ color: "red" }}>※ 사용금액이 20만원 이상일 경우<br />
                    1. '전자결재 > 경비 사전 보고'를 작성하고 승인 받은 다음에 "현금 및 개인법인카드 청구"탭에서 신청해주세요.<br />
                    2. TR 제출시 승인받은 '결재 사전 보고' 결재문서를 출력하여 함께 제출하시기 바랍니다.
                </span>
            </div>
            <div className="wrap_table">
                <CustomEditTable
                    noEdit={true}
                    values={cardUseDtls}
                    columns={tableColumns}
                    keyColumn={keyColumn}
                    onSelection={onSelection}
                    headerCellRender={headerCellRender}
                    cellRenderConfig={cellRenderConfig}
                    defaultPageSize={10}
                    noDataText={'등록된 엑셀 사용내역이 없습니다.'}
                />
            </div>
            <ProjectExpenseSendPop
                visible={popVisible}
                onPopHiding={onPopHiding}
                selectedItem={selectedItem}
                btnName={['경비 청구', '출장비 청구']}
            />
        </div>
    );
};
export default ProjectExpenseCard;