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
import AutoCompleteProject from "../../components/unit/AutoCompleteProject";
import {useCookies} from "react-cookie";
import ProjectExpenseSubmit from "./ProjectExpenseSubmit";

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
    const [selectedItem, setSelectedItem] = useState();

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
        let aplyDate = null;
        let now = new Date();
        let dateNum = Number(now.getDate());
        if(dateNum <= 15){
            let firstDayOfMonth = new Date( now.getFullYear(), now.getMonth() , 1 );
            let lastMonth = new Date ( firstDayOfMonth.setDate( firstDayOfMonth.getDate() - 1 ) );
            aplyDate = {
                "aplyYm": lastMonth.getFullYear()+('0' + (lastMonth.getMonth()+1)).slice(-2),
                "aplyOdr": 2
            }
        } else if (16 <= dateNum){
            aplyDate = {
                "aplyYm": now.getFullYear()+('0' + (now.getMonth()+1)).slice(-2),
                "aplyOdr": 1
            }
        }

        const jsonValue = props.excel;
        const list = [];
        for(let i = 1; i < jsonValue?.length; i++){
            const date = jsonValue[i].__EMPTY_4;
            const time = jsonValue[i].__EMPTY_5;
            const data = {
                "utztnDt" : date.substring(2,4)+date.substring(5,7)+date.substring(8,10)+time.substring(0,2)+time.substring(3,5)+time.substring(6,8),
                "useOffic" : jsonValue[i].__EMPTY_6,
                "utztnAmt" : jsonValue[i].__EMPTY_7,
                "lotteCardSn" : jsonValue[i].__EMPTY_1,
                "regEmpId" : cookies.userInfo.empId,
                "empId" : cookies.userInfo.empId,
                "aplyYm" : aplyDate.aplyYm,
                "aplyOdr" : aplyDate.aplyOdr,
                "ctAtrzSeCd" : "VTW01903"
            };
            list.push(data);
        }
        setCardValue(list);
    }, []);

    const onSelectionChanged = useCallback((e) => {
        const selectedRowsData = e.selectedRowsData;
        setSelectedItem(selectedRowsData);
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
            <DataGrid dataSource={cardValue} onSelectionChanged={onSelectionChanged} showBorders={true} style={{width: "100%"}}>
                <Selection mode="multiple" />
                <Column dataField="utztnDt" caption="사용일시" minwidth={130} />
                <Column dataField="useOffic" caption="사용처" minwidth={120}/>
                <Column dataField="utztnAmt" caption="금액" minwidth={120}/>
                <Column caption="프로젝트" cellRender={projectCell}/>
                <Column caption="경비코드" cellRender={expanseCell}/>
                <Column caption="용도" cellRender={purposeCell}/>
                <Column caption="참석자" cellRender={attendCell}/>
            </DataGrid>
        </div>
    );
};

export default ProjectExpenseCard;