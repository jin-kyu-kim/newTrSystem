import React, {useCallback, useEffect, useState} from "react";
import CustomDateRangeBox from "../../components/unit/CustomDateRangeBox";
import Box, {Item} from "devextreme-react/box";
import {Button} from "devextreme-react/button";
import CustomCdComboBox from "../../components/unit/CustomCdComboBox";
import DataGrid, {
    Column,
    Selection
} from 'devextreme-react/data-grid';
import {TextBox} from "devextreme-react";
import ProjectExpenseSubmit from "./ProjectExpenseSubmit";
import SelectBox from "devextreme-react/select-box";
import ApiRequest from "../../utils/ApiRequest";

const button = {
    borderRadius: '5px',
    width: 'auto',
    marginTop: '20px',
    marginRight: '15px'
}
const fontSize = {
    fontSize: 14
}
const ProjectExpenseCard = (props) => {
    const [cdVal, setCdVal] = useState([]);
    const [suggestionsData, setSuggestionsData] = useState([]);
    const [searchParam, setSearchParam] = useState();
    const [selectedItem, setSelectedItem] = useState();

    useEffect(() => {
        getCode();
        fetchData();
    }, []);

    const getCode = async () => {
        try {
            const response = await ApiRequest("/boot/common/commonSelect", [{ tbNm: "CD" }, { upCdValue: "VTW045"}]);
            const updatedCdValues = response.map((item) => ({
                cdValue: item.cdValue,
                cdNm: item.cdNm,
            }));
            setCdVal(updatedCdValues);
        } catch (error) {
            console.log(error);
        }
    }

    const fetchData = async () => {
        try {
            const response = await ApiRequest("/boot/common/commonSelect", [{ tbNm: "PRJCT" }, {}]);
            const processedData = response.map(({ prjctId, prjctNm }) => ({
                key: prjctId,
                value: prjctNm,
            }));
            setSuggestionsData(processedData);
        } catch (error) {
            console.log(error);
        }
    };

    const handleStartDateChange = (value) => {
        setSearchParam({...searchParam, bgngYmd: value});
    };
    const handleEndDateChange = (value) => {
        setSearchParam({...searchParam, endYmd: value});
    };
    const handleSrchValue = ({name, value}) => {
        setSearchParam({...searchParam, [name] : value});
    };
    const handleChgValue = (e) => {
        let copyValue = [...props.cardValue];
        let copyData = e.data;
        copyData[e.name] = e.value;
        copyValue[e.rowIndex] = copyData;
        props.setCardValue(copyValue);
    };

    const onSelectionChanged = useCallback((e) => {
        const selectedRowsData = e.selectedRowsData;
        setSelectedItem(selectedRowsData);
    }, []);

    const handleSubmit = async () => {

    };

    const projectCell = (cell) => {
        return (<SelectBox
            dataSource={suggestionsData}
            valueExpr="key"
            displayExpr="value"
            placeholderText="프로젝트 명"
            onValueChanged={(e) => handleChgValue({name: "prjctId", rowIndex: cell.rowIndex, data: cell.data, value: e.value})}
            value={cell.data.prjctId}
            showClearButton={true}
        />);
    }

    const expanseCell = (cell) => {
        return (<SelectBox
            dataSource={cdVal}
            displayExpr="cdNm"
            valueExpr="cdValue"
            placeholderText="[비용코드 선택]"
            onValueChanged={(e) => handleChgValue({name: "expensCd", rowIndex: cell.rowIndex, data: cell.data, value: e.value})}
            value={cell.data.expensCd}
            showClearButton={true}
        />);
    }
    const purposeCell = (cell) => {
        return (<TextBox
            value={cell.data.ctPrpos}
            onValueChanged={(e) => handleChgValue({name: "ctPrpos", rowIndex: cell.rowIndex, data: cell.data, value: e.value})}
            placeholder='용도'
            showClearButton={true}
        ></TextBox>);
    }
    const attendCell = (cell) => {
        return (<TextBox
            value={cell.data.ATDRN}
            onValueChanged={(e) => handleChgValue({name: "ATDRN", rowIndex: cell.rowIndex, data: cell.data, value: e.value})}
            placeholder='참석자'
            showClearButton={true}
        ></TextBox>);
    }
    return (
        <div className="container">
            <div style={{marginBottom: 20, width: "100%"}}>
                <Box
                    direction="row"
                    style={{width: "100%", height: 25, border: "0px"}}
                >
                    <Item ratio={3}>
                        <CustomDateRangeBox
                            onStartDateChange={handleStartDateChange}
                            onEndDateChange={handleEndDateChange}
                        />
                    </Item>
                    <Item ratio={2}>
                        <CustomCdComboBox
                            param="VTW011"
                            placeholderText="[이용시간별 조회]"
                            name="useTime"
                            onSelect={handleSrchValue}
                            value={searchParam?.useTime}
                            showClearButton={true}
                        />
                    </Item>
                    <Item ratio={2}>
                        <TextBox
                            onValueChanged={(e) => handleSrchValue({name: "useOffic", value: e.value})}
                            placeholder='이용가맹점'
                            showClearButton={true}
                        ></TextBox>
                    </Item>
                    <Item ratio={1}>
                        <Button onClick={handleSubmit} text="검색"/>
                    </Item>
                </Box>
            </div>
            <div style={{marginBottom: 20}}>
                <Button style={button} type='danger' text="선택한 사용내역 삭제하기"/>
                <Button style={button} type='default' text="선택한 사용내역 전자결재 작성"/>
                <ProjectExpenseSubmit text="선택한 사용내역 등록하기" value={selectedItem} tbNm="PRJCT_CT_APLY" snColumn="PRJCT_CT_APLY_SN"/>
            </div>
            <div style={fontSize}>
                <p> ※ 일괄적용 버튼 클릭 시 체크박스로 선택한 항목 중 가장 위에서 선택한 항목으로 일괄적용 됩니다.<br/>
                    <span style={{color: "red"}}>※ 사용금액이 20만원 이상일 경우<br/>
                        1. '전자결재 > 경비 사전 보고'를 작성후 승인 받으시기 바랍니다.<br/>
                        2. TR 제출시 승인받은 '결재 사전 보고' 결재문서를 출력하여 함께 제출하시기 바랍니다.
                    </span>
                </p>
            </div>
            <DataGrid dataSource={props.cardValue} onSelectionChanged={onSelectionChanged} showBorders={true} style={{width: "100%", marginBottom: '4%'}}>
                <Selection mode="multiple" />
                <Column dataField="utztnDt" caption="사용일시" />
                <Column dataField="useOffic" caption="사용처"/>
                <Column dataField="utztnAmt" caption="금액"/>
                <Column caption="프로젝트" cellRender={projectCell}  width={250}/>
                <Column caption="경비코드" cellRender={expanseCell} width={200}/>
                <Column caption="용도" cellRender={purposeCell}/>
                <Column caption="참석자" cellRender={attendCell} width={250}/>
            </DataGrid>
        </div>
    );
};

export default ProjectExpenseCard;