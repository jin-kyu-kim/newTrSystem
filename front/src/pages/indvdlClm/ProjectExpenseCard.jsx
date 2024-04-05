import React, { useEffect, useState } from "react";
import { Button } from "devextreme-react/button";
import ProjectExpenseSubmit from "./ProjectExpenseSubmit";
import ProjectExpenseCardJson from "./ProjectExpenseCardJson.json";
import SearchInfoSet from "../../components/composite/SearchInfoSet";
import { DataGrid, Column, Selection } from 'devextreme-react/data-grid';
import SelectBox from "devextreme-react/select-box";
import ApiRequest from "../../utils/ApiRequest";
import { TextBox } from 'devextreme-react';
import CustomEditTable from 'components/unit/CustomEditTable';

const ProjectExpenseCard = (props) => {
    const button = {
        borderRadius: '5px',
        width: 'auto',
        marginTop: '20px',
        marginRight: '15px'
    }
    const searchInfo = ProjectExpenseCardJson.searchInfo;
    const { keyColumn, queryId, tableColumns, wordWrap } = ProjectExpenseCardJson;
    const [ comboList, setComboList ] = useState([]);
    const [ cardUseDtls, setCardUseDtls ] = useState([]);
    const [ selectedItem, setSelectedItem ] = useState([]);
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

    useEffect(() => { 
        getPrjctList(); 
        getCdVal();
    }, []);

    const getPrjctList = async () => {
        try {
            const response = await ApiRequest("/boot/common/commonSelect", [
                { tbNm: "PRJCT" }, { bizSttsCd: "VTW00402"},
            ]);
            const processedData = response.map(({ prjctId, prjctNm }) => ({
                key: prjctId,
                value: prjctNm,
            }));
            setComboList({  
                ...comboList,
                prjctId: processedData 
            })
        } catch (error) {
            console.log(error);
        }
    };

    const getCdVal = async () => {
        try {
            const response = await ApiRequest("/boot/common/commonSelect", [{ tbNm: "CD" }, { upCdValue: "VTW045"}]);
            setComboList({
                ...comboList,
                expensCd: response
            })
        } catch (error) {
            console.log(error);
        }
    };

    const getCardUseDtls = async () => {
        try{
            const response = await ApiRequest('/boot/common/queryIdSearch', param);
            setCardUseDtls(response);
        }catch (error){
            console.log(error);
        }
    };

    const searchHandle = async (initParam) => {
        setParam({
            ...param,
            ...initParam
        });
    }

    const handleDelete = async (e) => {
        let deleteSnList = '';
        if(window.confirm('선택한 결제내역을 삭제하시겠습니까? 삭제 후 재등록 시 수동으로 입력하셔야 합니다.')){
            for(let i = 0; i < selectedItem.length; i++){
                deleteSnList = deleteSnList + selectedItem[i].cardUseSn + ','
            }
            deleteSnList = deleteSnList.slice(0, -1);
        } else {
            e.cancel = true;
        }
    }

    const onSelection = (e) => {
        setSelectedItem(e.selectedRowsData);
    }

    return (
        <div className="container">
            <div className="wrap_search" style={{margin: "20px"}}>
                <SearchInfoSet callBack={searchHandle} props={searchInfo}/>
            </div>
            <div style={{marginBottom: 20}}>
                <Button style={button} type='danger' text="선택한 사용내역 삭제하기" onClick={handleDelete} />
                <Button style={button} type='default' text="선택한 사용내역 전자결재 작성"/>
                <ProjectExpenseSubmit text="선택한 사용내역 등록하기" value={selectedItem} tbNm="PRJCT_CT_APLY"
                    snColumn="PRJCT_CT_APLY_SN" atrzTbNm="PRJCT_CT_ATRZ"/>
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
                    showColumnLines={false}
                    focusedRowEnabled={true}
                    columnAutoWidth={true}
                    noDataText=""
                    wordWrapEnabled={wordWrap}
                    onSelectionChanged={onSelection}
                >
                    <Selection mode="multiple" />
                    {tableColumns.map((col) => (
                        <Column
                            key={col.key}
                            dataField={col.key}
                            caption={col.value}
                            cellRender={col.type && ((props) => {
                                if (col.type === 'selectBox') {
                                    return (
                                        <SelectBox
                                            dataSource={comboList[col.key]}
                                            displayExpr={col.displayExpr}
                                            keyExpr={col.valueExpr}
                                            placeholder={col.placeholder}
                                            onValueChanged={(newValue) => 
                                                props.data[col.key] = newValue.value[col.valueExpr]
                                            }
                                        />
                                    )
                                } else {
                                    return (
                                        <TextBox
                                            placeholder={col.placeholder}
                                            name={col.key}
                                            onValueChanged={(newValue) => 
                                                props.data[col.key] = newValue.value
                                            }
                                        />
                                    ) 
                                }
                            })} >
                        </Column>
                    ))}

                </DataGrid>
            </div>
        </div>
    );
};
export default ProjectExpenseCard;