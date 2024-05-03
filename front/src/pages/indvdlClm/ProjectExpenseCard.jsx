import React, { useEffect, useState } from "react";
import { validateFields, hasError } from './ProjectExpenseValidate';
import SearchInfoSet from "../../components/composite/SearchInfoSet";
import CustomEditTable from 'components/unit/CustomEditTable';
import ProjectExpenseSubmit from "./ProjectExpenseSubmit";
import ProjectExpenseJson from "./ProjectExpenseJson.json";
import ApiRequest from "../../utils/ApiRequest";

const ProjectExpenseCard = (props) => {
    const { keyColumn, queryId, cdListQueryId, tableColumns, searchInfo, placeholderAndRequired, buttonGroup } = ProjectExpenseJson.ProjectExpenseTab;
    const [ cdList, setCdList ] = useState([]);
    const [ expensCd, setExpensCd ] = useState({});
    const [ comboList, setComboList ] = useState({});
    const [ cardUseDtls, setCardUseDtls ] = useState([]);
    const [ selectedItem, setSelectedItem ] = useState([]);
    const [ isPrjctIdSelected, setIsPrjctIdSelected ] = useState({}); // 비용코드 활성화 조건
    const [ validationErrors, setValidationErrors ] = useState([]);
    const [ param, setParam ] = useState({
        queryId: queryId,
        empId: props.empId,
        aplyYm: props.aplyYm,
        aplyOdr: props.aplyOdr
    });
    
    const searchHandle = async (initParam) => {
        setParam({ ...param,  ...initParam });
    };

    const chgPlaceholder = (col, cardUseSn) => { 
        const currentExpensCd = expensCd[cardUseSn];
        const matchedItem = placeholderAndRequired.find(item => item.expensCd === currentExpensCd);
        return matchedItem ? (col.key === 'atdrn' ? matchedItem.atdrnPlaceholder : matchedItem.ctPrposPlaceholder)
            : col.placeholder;
    };

    useEffect(() => {
        if (!Object.values(param).every((value) => value === "")) {
            getCardUseDtls();
        }
    }, [param]);

    useEffect(() => { getSelectBoxList(); }, []);

    const getSelectBoxList = async () => {
        const comBoInfo = ['prjctId', 'emp'];
        const comSelectParam = [ 
            [{ tbNm: "PRJCT" }, { bizSttsCd: "VTW00402"}], 
            [{ tbNm: "EMP" }] 
        ];
        try {
            for(let i=0; i<comSelectParam.length; i++){
                let response = await ApiRequest("/boot/common/commonSelect", comSelectParam[i]);
                if(comSelectParam[i][0].tbNm === "EMP"){
                    response = response.map(({ empId, empno, empFlnm }) => ({
                        key: empId,
                        value: empFlnm,
                        displayValue: empno+' '+empFlnm,
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

    const getCdList = async (prjctId, cardUseSn) => {
        try{
            const response = await ApiRequest('/boot/common/queryIdSearch', {
                queryId: cdListQueryId, prjctId: prjctId
            })
            setCdList(prevCdLists => ({
                ...prevCdLists,
                [cardUseSn]: response
            }));
        } catch(error) {
            console.log('error', error);
        }
    }

    const getCardUseDtls = async () => {
        setCardUseDtls(await ApiRequest('/boot/common/queryIdSearch', param));
    };

    const handleDelete = () => {
        const param = [{tbNm: "CARD_USE_DTLS"}];
        
        if(window.confirm('선택한 결제내역을 삭제하시겠습니까? 삭제 후 재등록 시 수동으로 입력하셔야 합니다.')){
            
            Promise.all(selectedItem.map(async (item) => {
                const currentParam = [...param, { cardUseSn: item.cardUseSn }];
                try {
                    const res = await ApiRequest('/boot/common/commonDelete', currentParam);
                } catch(error) {
                    console.error('error', error);
                }
            }))
            .then(results => {
                getCardUseDtls();
                alert('삭제되었습니다.');
            })
            .catch(error => { console.error('error', error); });
        } else return null;
    };

    const onSelection = (e) => {
        setSelectedItem(e.selectedRowsData);
    };

    const bulkApply = (values, col) => {
        console.log('values', values)
    };

    const cellRenderConfig = {getCdList, isPrjctIdSelected, setIsPrjctIdSelected, chgPlaceholder, comboList, cdList,
        expensCd, setExpensCd, setValidationErrors, hasError: (cardUseSn, fieldName) => hasError(validationErrors, cardUseSn, fieldName)};

    return (
        <div className="container">
            <div className="wrap_search" style={{margin: "20px"}}>
                <SearchInfoSet callBack={searchHandle} props={searchInfo}/>
            </div>
            <ProjectExpenseSubmit selectedItem={selectedItem} getData={props.getData}
                validateFields={() => validateFields(selectedItem, placeholderAndRequired, setValidationErrors, buttonGroup)} 
                handleDelete={handleDelete} buttonGroup={buttonGroup} />
            
            <div style={{fontSize: 14, marginBottom: "20px"}}>
                <p style={{marginBottom: '10px'}}> ※ 일괄적용 버튼 클릭 시 체크박스로 선택한 항목 중 가장 위에서 선택한 항목으로 일괄적용 됩니다.</p>
                <span style={{color: "red"}}>※ 사용금액이 20만원 이상일 경우<br/>
                    1. '전자결재 > 경비 사전 보고'를 작성후 승인 받으시기 바랍니다.<br/>
                    2. TR 제출시 승인받은 '결재 사전 보고' 결재문서를 출력하여 함께 제출하시기 바랍니다.
                </span>
            </div>
            <div className="wrap_table">
                <CustomEditTable
                    noEdit={true}
                    values={cardUseDtls}
                    columns={tableColumns}
                    keyColumn={keyColumn}
                    bulkApply={bulkApply}
                    onSelection={onSelection}
                    cellRenderConfig={cellRenderConfig}
                />
            </div>
        </div>
    );
};
export default ProjectExpenseCard;