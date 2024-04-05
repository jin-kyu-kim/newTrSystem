import React, {useCallback, useEffect, useState} from "react";
import {Button} from "devextreme-react/button";
import ProjectExpenseSubmit from "./ProjectExpenseSubmit";
import ApiRequest from "../../utils/ApiRequest";
import ProjectExpenseCardJson from "./ProjectExpenseCardJson.json";
import SearchInfoSet from "../../components/composite/SearchInfoSet";
import DataGrid, { Column, Export, Pager, Paging, Summary, TotalItem, Selection } from "devextreme-react/data-grid";
import SelectBox from "devextreme-react/select-box";
import {CheckBox, TextBox} from "devextreme-react";
const ProjectExpenseCard = (props) => {
    const button = {
        borderRadius: '5px',
        width: 'auto',
        marginTop: '20px',
        marginRight: '15px'
    }

    const searchInfo = ProjectExpenseCardJson.searchInfo;
    const { keyColumn, tableColumns, wordWrap } = ProjectExpenseCardJson;

    const [cardUseDtls, setCardUseDtls] = useState([]);
    const [selectedItem, setSelectedItem] = useState();
    const [param, setParam] = useState([]);
    const [prjctList, setPrjctList] = useState([]);
    const [expensCdList, setExpensCdList] = useState([]);
    const [cardValue, setCardValue] = useState({});
    const [rowDataValue, setRowDataValue] = useState({});

    useEffect(() => {
        if (!Object.values(param).every((value) => value === "")) {
            getCardUseDtls();
        }

        getPrjctList();
        getExpensCdList();

    }, [param]);

    const getPrjctList = async () => {
        try {
            const response = await ApiRequest("/boot/common/commonSelect", [
                { tbNm: "PRJCT" },
                { bizSttsCd: "VTW00402"},
            ]);
            const processedData = response.map(({ prjctId, prjctNm }) => ({
                key: prjctId,
                value: prjctNm,
            }));
            setPrjctList(processedData);
        } catch (error) {
            console.log(error);
        }
    };

    const getExpensCdList = async () => {
        const param = [
            { tbNm: "CD" },
            { upCdValue: "VTW045" }
        ];
        try {
            const response = await ApiRequest("/boot/common/commonSelect", param);
            const processedData = response.map(({ cdValue, cdNm }) => ({
                key: cdValue,
                value: cdNm,
            }));

            setExpensCdList(processedData);
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

        if(initParam.startDate == null && initParam.endDate == null
            && initParam.useOffic == null && initParam.useTime == null) {

            setParam({

                ...param,
                queryId: "indvdlClmMapper.retrieveExpenseCardUseDtls",
                empId: props.empId,
                aplyYm: props.aplyYm,
                aplyOdr: props.aplyOdr,
                startDate: '',
                endDate: '',
                useOffic: '',
                useTime: '',
            })
        }

        setParam({

            ...param,
            queryId: "indvdlClmMapper.retrieveExpenseCardUseDtls",
            empId: props.empId,
            aplyYm: props.aplyYm,
            aplyOdr: props.aplyOdr,
            startDate: initParam.startDate,
            endDate: initParam.endDate,
            useOffic: initParam.useOffic,
            useTime: initParam.useTime
        })

    }

    const onSelectionChanged = (e) => {
        // console.log('e',e);
        //
        // console.log('cardValue', cardValue);
        setSelectedItem(e.selectedRowsData, cardValue)
    }

    const handleDelete = async (e) => {
        let deleteSnList = '';

        if(window.confirm('선택한 결제내역을 삭제하시겠습니까? 삭제 후 재등록 시 수동으로 입력하셔야 합니다.')){
            for(let i = 0; i < selectedItem.length; i++){
                deleteSnList = deleteSnList + selectedItem[i].cardUseSn + ','
                console.log(selectedItem[i]);

            }
            deleteSnList = deleteSnList.slice(0, -1);
            console.log(deleteSnList)

            // const response = await ApiRequest('/boot/common/commonDelete', [
            //     {tbNm: "CART_USE_DTLS"}, {cardUseSn: selectedItem, empId: props.empId}
            // ]);
            //
            // if(response === 1) alert('삭제되었습니다.')
        } else {
            e.cancel = true;
        }
    }

    const prjctIdSelectBoxCell = (rowData, rowIndex) => {

        const selectBoxValue = rowDataValue.rowIndex === rowIndex ? rowDataValue.prjctId : rowData.prjctId;

        return (
            <SelectBox
                dataSource={prjctList}
                displayExpr="value"
                placeholder='"["입력 시 사용가능한 프로젝트 전체 조회'
                valueExpr="key"
                onValueChanged={(e)=> {
                    const updatedRowData = { ...rowData, prjctId: e.value, rowIndex:rowIndex };
                    setRowDataValue(updatedRowData)
                    console.log('rowDataValue',rowDataValue)

                    handleChgValue({ name: "prjctId", value: e.value });
                }}
                value={selectBoxValue}
            />
        );

    };

    const expensCdSelectBoxCell = (rowData, rowIndex) => {

        const value = rowDataValue.rowIndex === rowIndex ? rowDataValue.expensCd : rowData.expensCd;

        return (
            <SelectBox
                dataSource={expensCdList}
                displayExpr="value"
                placeholder='[비용코드 선택]'
                valueExpr="key"
                onValueChanged={(e)=> {
                    const updatedRowData = { ...rowData, expensCd: e.value, rowIndex:rowIndex };
                    setRowDataValue(updatedRowData)
                    console.log('rowDataValue',rowDataValue)

                    handleChgValue({name: "expensCd", value: e.value});
                }}
                value={value}
            />
        );
    };

    const ctPrposTextBoxCell = () => {
        return (
            <TextBox
                value={cardValue?.ctPrpos}
                placeholder="상세내역(목적)"
                onValueChanged={(e)=> {
                    handleChgValue({name: "ctPrpos", value: e.value});
                }}
            />);
    };

    const atdrnTextBoxCell = () => {
        return (
            <TextBox
                value={cardValue?.atdrn}
                placeholder="용도(참석자명단)"
                onValueChanged={(e)=> {
                    handleChgValue({name: "atdrn", value: e.value});
                }}
            />);
    };



    const handleChgValue = ({name, value}, rowIndex) => {

        setCardValue({...rowDataValue, [name] : value, rowIndex: rowIndex});
    };

    console.log('cardValue',cardValue)
    // console.log('selectedItem', selectedItem);

    return (
        <div className="container">
            <div className="wrap_search" style={{margin: "20px"}}>
                <SearchInfoSet callBack={searchHandle} props={searchInfo}/>
            </div>
            <div style={{marginBottom: 20}}>
                <Button style={button} type='danger' text="선택한 사용내역 삭제하기" onClick={handleDelete} />
                <Button style={button} type='default' text="선택한 사용내역 전자결재 작성"/>
                <ProjectExpenseSubmit text="선택한 사용내역 등록하기" value={selectedItem} tbNm="PRJCT_CT_APLY"
                                      snColumn="PRJCT_CT_APLY_SN"/>
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
                    columnAutoWidth={false}
                    noDataText=""
                    wordWrapEnabled={wordWrap}
                    // onSelectionChanged={onSelectionChanged}
                >
                    <Selection mode="multiple" />
                    <Column
                        key="utztnDt"
                        dataField="utztnDt"
                        caption="사용일시"
                        width="150"
                        alignment="center"
                    />
                    <Column
                        key="useOffic"
                        dataField="useOffic"
                        caption="사용처"
                        width="170"
                        alignment="center"
                    />
                    <Column
                        key="utztnAmt"
                        dataField="utztnAmt"
                        caption="이용금액"
                        width="100"
                        alignment="center"
                        format="#,###"
                    />
                    <Column
                        caption="프로젝트"
                        width="280"
                        alignment="alignment"
                        cellRender={({ data, rowIndex }) => prjctIdSelectBoxCell(data, rowIndex)}
                        headerCellRender={({  }) => {
                            return (
                                <div>
                                    <span style={{margin: "5px"}}>프로젝트</span>
                                    <Button
                                        text="일괄적용"
                                        hint="선택 된 첫번째 체크박스의 항목으로 일괄적용 됩니다."
                                    />
                                </div>
                            );
                        }}
                    />
                    <Column
                        caption="비용코드"
                        width="150"
                        alignment="alignment"
                        cellRender={({ data, rowIndex }) => expensCdSelectBoxCell(data, rowIndex)}
                        headerCellRender={({  }) => {
                            return (
                                <div>
                                    <span style={{margin: "5px"}}>비용코드</span>
                                    <Button
                                        text="일괄적용"
                                        hint="선택 된 첫번째 체크박스의 항목으로 일괄적용 됩니다."
                                    />
                                </div>
                            );
                        }}
                    />
                    <Column
                        caption="상세내역(목적)"
                        width="170"
                        alignment='center'
                        cellRender={ctPrposTextBoxCell}
                    />
                    <Column
                        caption="용도(참석자명단)"
                        width="200"
                        alignment='center'
                        cellRender={atdrnTextBoxCell}
                    />
                </DataGrid>
            </div>
        </div>
    );
};

export default ProjectExpenseCard;