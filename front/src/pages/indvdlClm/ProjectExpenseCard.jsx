import React, { useEffect, useState } from "react";
import { DataGrid, Column, Selection } from 'devextreme-react/data-grid';
import { Button } from "devextreme-react/button";
import { TextBox } from 'devextreme-react';
import TagBox from 'devextreme-react/tag-box';
import SelectBox from "devextreme-react/select-box";
import ProjectExpenseCardJson from "./ProjectExpenseCardJson.json";
import SearchInfoSet from "../../components/composite/SearchInfoSet";
import ProjectExpenseCardInsert from "./ProjectExpenseCardInsert";
import ApiRequest from "../../utils/ApiRequest";

const ProjectExpenseCard = (props) => {
    const button = {
        borderRadius: '5px',
        width: 'auto',
        marginTop: '20px',
        marginRight: '15px'
    }
    const searchInfo = ProjectExpenseCardJson.searchInfo;
    const sendTbInfo = {tbNm: "PRJCT_CT_APLY", snColumn: "PRJCT_CT_APLY_SN", atrzTbNm: "PRJCT_CT_ATRZ"}
    const { keyColumn, queryId, cdListQueryId, tableColumns, wordWrap, placeholderAndRequired } = ProjectExpenseCardJson;
    const [ comboList, setComboList ] = useState({});
    const [ cdList, setCdList ] = useState([]);
    const [ expensCd, setExpensCd ] = useState({});
    const [ cardUseDtls, setCardUseDtls ] = useState([]);
    const [ selectedItem, setSelectedItem ] = useState([]);
    const [ isPrjctIdSelected, setIsPrjctIdSelected ] = useState({}); // 비용코드 활성화 조건
    const [ param, setParam ] = useState({
        queryId: queryId,
        empId: props.empId,
        aplyYm: props.aplyYm,
        aplyOdr: props.aplyOdr
    });
    useEffect(() => {
        if (!Object.values(param).every((value) => value === "")) {
            getCardUseDtls();
        }
    }, [param]);
    useEffect(() => { getSelectBoxList(); }, []);

    const searchHandle = async (initParam) => {
        setParam({ ...param,  ...initParam });
    };
    const comBoList = ['prjctId', 'emp'];
    const comSelectParam = [
        [{ tbNm: "PRJCT" }, { bizSttsCd: "VTW00402"}],
        [{ tbNm: "EMP" }]
    ];
    const getSelectBoxList = async () => {
        try {
            for(let i=0; i<comSelectParam.length; i++){
                let response = await ApiRequest("/boot/common/commonSelect", comSelectParam[i]);
                if(comSelectParam[i][0].tbNm === "EMP"){
                    response = response.map(({ empId, empno, empFlnm }) => ({
                        key: empFlnm,
                        value: empno+' '+empFlnm,
                    }));
                }
                setComboList(prevComboList => ({
                    ...prevComboList,
                    [comBoList[i]]: response
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
        try{
            const response = await ApiRequest('/boot/common/queryIdSearch', param);
            setCardUseDtls(response);
        }catch (error){
            console.log(error);
        }
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
    const chgPlaceholder = (col, cardUseSn) => {
        const currentExpensCd = expensCd[cardUseSn];
        const matchedItem = placeholderAndRequired.find(item => item.expensCd === currentExpensCd);
        return matchedItem ? matchedItem.placeholder : col.placeholder;
    };

    const batchSelect = (field) => {
        if (selectedItem.length === 0) {
            alert("선택된 항목이 없습니다.");
            return;
          }
    }

    return (
        <div className="container">
            <div className="wrap_search" style={{margin: "20px"}}>
                <SearchInfoSet callBack={searchHandle} props={searchInfo}/>
            </div>
            <div style={{marginBottom: 20}}>
                <Button style={button} type='danger' text="선택한 사용내역 삭제하기" onClick={handleDelete} />
                <Button style={button} type='default' text="선택한 사용내역 전자결재 작성"/>
                <ProjectExpenseCardInsert text="선택한 사용내역 등록하기" selectedItem={selectedItem} 
                        sendTbInfo={sendTbInfo} button={button} />
            </div>
            <div style={{fontSize: 14}}>
                <p> ※ 일괄적용 버튼 클릭 시 체크박스로 선택한 항목 중 가장 위에서 선택한 항목으로 일괄적용 됩니다.<br/>
                    <span style={{color: "red"}}>※ 사용금액이 20만원 이상일 경우<br/>
                        1. '전자결재 > 경비 사전 보고'를 작성후 승인 받으시기 바랍니다.<br/>
                        2. TR 제출시 승인받은 '결재 사전 보고' 결재문서를 출력하여 함께 제출하시기 바랍니다.
                    </span>
                </p>
            </div>
            <div className="wrap_table">
                <DataGrid
                    keyExpr={keyColumn}
                    id={"dataGrid"}
                    className={"table"}
                    dataSource={cardUseDtls}
                    showBorders={true}
                    focusedRowEnabled={true}
                    wordWrapEnabled={wordWrap}
                    onSelectionChanged={onSelection}
                >
                    <Selection mode="multiple" />
                    {tableColumns.map((col) => (
                        <Column
                            key={col.key}
                            width={col.width}
                            alignment={'center'}
                            dataField={col.key}
                            caption={col.value}
                            // headerCellRender={['expensCd', 'prjctId'].includes(col.key) && ((props) => (
                            //     <div>
                            //         <span>{col.key === 'prjctId' ? '프로젝트' : '비용코드'}</span><br/>
                            //         <Button hint="선택 된 첫번째 체크박스의 항목으로 일괄적용 됩니다." 
                            //             type="success" text="일괄적용" onClick={() => batchSelect(col.key)}
                            //         />
                            //     </div>)
                            // )}
                            cellRender={col.type && ((props) => {
                                if (col.type === 'selectBox') {
                                    return (
                                        <SelectBox
                                            dataSource={col.key === 'prjctId' ? comboList[col.key] : cdList[props.data.cardUseSn]}
                                            displayExpr={col.displayExpr}
                                            keyExpr={col.valueExpr}
                                            placeholder={col.placeholder}
                                            onValueChanged={(newValue) => {
                                                props.data[col.key] = newValue.value[col.valueExpr]
                                                if (col.key === 'prjctId') {
                                                    getCdList(newValue.value[col.valueExpr], props.data.cardUseSn);
                                                    setIsPrjctIdSelected(prevStts => ({
                                                        ...prevStts,
                                                        [props.data.cardUseSn]: !!newValue.value})); // 선택된 값이 없으면 falsy
                                                } else{
                                                    setExpensCd(prevStts => ({
                                                        ...prevStts,
                                                        [props.data.cardUseSn]: newValue.value[col.valueExpr]}));
                                                }
                                            }}
                                            disabled={col.key === 'expensCd' && !isPrjctIdSelected[props.data.cardUseSn]}
                                        />
                                    )
                                } else if (col.type === 'textBox') {
                                    return (
                                        <TextBox
                                            placeholder={chgPlaceholder(col, props.data.cardUseSn)}
                                            name={col.key}
                                            onValueChanged={(newValue) => {
                                                props.data[col.key] = newValue.value
                                            }} />) 
                                } else{
                                    return(
                                        <TagBox
                                            dataSource={comboList['emp']}
                                            placeholder={col.placeholder}
                                            searchEnabled={true}
                                            showClearButton={true}
                                            showSelectionControls={true}
                                            displayExpr='value'
                                            applyValueMode="useButtons"
                                            onValueChanged={(newValue) => 
                                                props.data[col.key] = newValue.value.map(item => item.key).join(',') 
                                            }
                                        /> )}
                                })} >
                        </Column>
                    ))}
                </DataGrid>
            </div>
        </div>
    );
};
export default ProjectExpenseCard;