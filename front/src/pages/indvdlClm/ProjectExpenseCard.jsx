import React, {useEffect, useState} from "react";
import CustomDateRangeBox from "../../components/unit/CustomDateRangeBox";
import Box, {Item} from "devextreme-react/box";
import {Button} from "devextreme-react/button";
import CustomCdComboBox from "../../components/unit/CustomCdComboBox";
import DataGrid, {
    Column,
    Selection
} from 'devextreme-react/data-grid';
import {TextBox} from "devextreme-react";
import AutoCompleteProject from "../../components/unit/AutoCompleteProject";
import {useCookies} from "react-cookie";

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
    const [searchParam, setSearchParam] = useState();
    const [cardValue, setCardValue] = useState();
    const [cookies] = useCookies([]);

    const handleStartDateChange = (value) => {
        setSearchParam({...searchParam, bgngYmd: value});
    };
    const handleEndDateChange = (value) => {
        setSearchParam({...searchParam, endYmd: value});
    };
    const handleSrchValue = ({name, value}) => {
        setSearchParam({...searchParam, [name] : value});
    };
    const handleChgValue = ({name, value}) => {
        setCardValue({...searchParam, [name] : value});
    };

    useEffect(() => {
        const jsonValue = props.excel;
        const list = [];
        for(let i = 1; i < jsonValue?.length; i++){
            const data = {
                "utztnDt" : "",
                "useOffic" : jsonValue[i].__EMPTY_6,
                "utztnAmt" : "",
                "lotteCardSn" : "",
                "regEmpId" : cookies.userInfo.empId,
                "empId" : cookies.userInfo.empId,
                "aplyYm" : "",
                "aplyOdr" : "",
                "ctAtrzSeCd" : ""
            };
            list.push(data);
        }
        setCardValue(list);
    }, []);

    const handleSubmit = () => {

    };

    const projectCell = (e) => {
        return (<AutoCompleteProject
            placeholderText="프로젝트 명"
            onValueChange={(e) => handleChgValue({name: "prjctId", value: e.value})}
        />);
    }
    const expanseCell = (e) => {
        return (<CustomCdComboBox
            param="VTW045"
            placeholderText="[비용코드 선택]"
            name="expensCd"
            onSelect={handleChgValue}
            value={searchParam?.expensCd}
            showClearButton={true}
        />);
    }
    const purposeCell = (e) => {
        return (<TextBox
            onValueChanged={(e) => handleChgValue({name: "ctPrpos", value: e.value})}
            placeholder='용도'
            showClearButton={true}
        ></TextBox>);
    }
    const attendCell = (e) => {
        return (<TextBox
            onValueChanged={(e) => handleChgValue({name: "ATDRN", value: e.value})}
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
                <Button style={button} text="선택한 사용내역 등록하기"/>
            </div>
            <div style={fontSize}>
                <p> ※ 일괄적용 버튼 클릭 시 체크박스로 선택한 항목 중 가장 위에서 선택한 항목으로 일괄적용 됩니다.<br/>
                    <span style={{color: "red"}}>※ 사용금액이 20만원 이상일 경우<br/>
                        1. '전자결재 > 경비 사전 보고'를 작성후 승인 받으시기 바랍니다.<br/>
                        2. TR 제출시 승인받은 '결재 사전 보고' 결재문서를 출력하여 함께 제출하시기 바랍니다.
                    </span>
                </p>
            </div>
            <DataGrid dataSource={cardValue} showBorders={true} style={{width: "100%"}}>
                <Selection mode="multiple" />
                <Column dataField="utztnDt" caption="사용일시" width={120} />
                <Column dataField="useOffic" caption="사용처" width={120}/>
                <Column dataField="utztnAmt" caption="금액" width={120}/>
                <Column caption="프로젝트" cellRender={projectCell}/>
                <Column caption="경비코드" cellRender={expanseCell}/>
                <Column caption="용도" cellRender={purposeCell}/>
                <Column caption="참석자" cellRender={attendCell}/>
            </DataGrid>
        </div>
    );
};

export default ProjectExpenseCard;