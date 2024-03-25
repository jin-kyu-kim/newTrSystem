import React, { useEffect, useCallback, useState } from 'react';
import {Button} from "devextreme-react/button";
import { Box, Item } from "devextreme-react/box";
import CustomDateRangeBox from "../unit/CustomDateRangeBox";
import AutoCompleteProject from "../unit/AutoCompleteProject";
import AutoCompleteName from "../unit/AutoCompleteName";
import {SelectBox} from "devextreme-react/select-box";
import CustomCdComboBox from "../unit/CustomCdComboBox";

const SearchOdrRange = ({ callBack, props, searchItems }) => {

    const [initParam, setInitParam] = useState([]);
    const [yearData, setYearData] = useState([]);
    const [monthData, setMonthData] = useState([]);
    const [aplyOdrVisible, setAplyOdrVisible] = useState(true);

    const yearList = [];
    const monthList = [];

    const inqMthd = [
        {
            "value": "odr",
            "text": "차수별"
        },
        {
            "value": "month",
            "text": "월별"
        }
    ];

    const odrList = [
        {
            "id": "1",
            "value": "1",
            "text": "1회차"
        },
        {
            "id": "2",
            "value": "2",
            "text": "2회차"
        }
    ];

    useEffect(() => {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        const startYear = year - 10;
        const EndYear = year + 1;


        for(let i = startYear; i <= EndYear; i++) {
            yearList.push({"value": i});
        }

        for(let i = 1; i <= 12; i++) {
            if(i < 10) {
                i = "0" + i;
            }
            monthList.push({"value": i});
        }

        let odrVal = day > 15 ? "1" : "2";
        let monthVal = month < 10 ? "0" + month : month;

        setInitParam({
            inqMthd : "odr",
            yearItem: year,
            monthItem: monthVal,
            aplyOdr: odrVal
        });

        setYearData(yearList);
        setMonthData(monthList);

        callBack(initParam);
    }, []);

    const handleStartDateChange = (newStartDate) => {
        let startYmd = newStartDate.substr(0,6);
        let startOdr = newStartDate.substr(6, 2) > 15 ? "2" : "1";

        // 시작일자가 변경될 때 수행할 로직 추가
        setInitParam({
            ...initParam,
            startYmOdr: startYmd+startOdr
        });
    };

    const handleEndDateChange = (newEndDate) => {
        let endYmd = newEndDate.substr(0, 6);
        let endOdr = newEndDate.substr(6, 2) > 15 ? "2" : "1";

        // 종료일자가 변경될 때 수행할 로직 추가
        setInitParam({
            ...initParam,
            endYmOdr: endYmd+endOdr
        });
    };

    const handleChgPrjct = (selectedOption) => {
        setInitParam({
            ...initParam,
            prjctId: selectedOption,
        });
    };

    const handleChgEmp = (selectedOption) => {
        setInitParam({
            ...initParam,
            empNo: selectedOption,
        });
    };

    const handleChgState = ({ name, value }) => {
        setInitParam({
            ...initParam,
            [name]: value
        });
    }

    // 조회방식이 월별인 경우 차수 selectbox를 숨김
    const handleInqMthd = (value) => {

        if (value === "month") {
            setAplyOdrVisible(false);
        } else {
            setAplyOdrVisible(true);
        }
    }

    const handleSubmit = () => {
        callBack(initParam);
    }

    return (
        <div className="box_search" width="100%">
            <Box direction="row" width={"100%"} height={50} >
                <Item ratio={0} baseSize={"120"}>
                    <SelectBox
                        dataSource={inqMthd}
                        name="inqMthd"
                        displayExpr={"text"}
                        valueExpr={"value"}
                        onValueChanged={(e) => {
                            handleInqMthd(e.value);
                            handleChgState({name: e.component.option("name"), value: e.value });
                        }}
                        placeholder="[조회방식]"
                        style={{margin: "0px 5px 0px 5px"}}
                        value={initParam.inqMthd}
                    />
                </Item>
                { props.yearItem &&
                    <Item ratio={0} baseSize={"120"}>
                        <SelectBox
                            dataSource={yearData}
                            name="yearItem"
                            displayExpr={"value"}
                            valueExpr={"value"}
                            onValueChanged={(e) => handleChgState({name: e.component.option("name"), value: e.value })}
                            placeholder="[연도]"
                            style={{margin: "0px 5px 0px 5px"}}
                            value={initParam.yearItem}
                        />
                    </Item>
                }
                { props.monthItem &&
                    <Item ratio={0} baseSize={"120"}>
                        <SelectBox
                            dataSource={monthData}
                            name="monthItem"
                            displayExpr={"value"}
                            valueExpr={"value"}
                            onValueChanged={(e) => handleChgState({name: e.component.option("name"), value: e.value })}
                            placeholder="[월]"
                            style={{margin: "0px 5px 0px 5px"}}
                            value={initParam.monthItem}
                        />
                    </Item>
                }
                { props.aplyOdr && aplyOdrVisible &&
                    <Item ratio={0} baseSize={"120"}>
                        <SelectBox
                            dataSource={odrList}
                            name="aplyOdr"
                            displayExpr={"text"}
                            valueExpr={"value"}
                            onValueChanged={(e) => handleChgState({name: e.component.option("name"), value: e.value })}
                            placeholder="[차수]"
                            style={{margin: "0px 5px 0px 5px"}}
                            value={initParam.aplyOdr}
                        />
                    </Item>
                }
                {/*<Item className="prjctDatePickerItem" ratio={2} visible={true}>*/}
                {/*    <CustomDateRangeBox*/}
                {/*        onStartDateChange={handleStartDateChange}*/}
                {/*        onEndDateChange={handleEndDateChange}*/}
                {/*    />*/}
                {/*</Item>*/}
                <Item className="prjctNameItem" ratio={1} visible={searchItems.prjctNameItem}>
                    <AutoCompleteProject
                        placeholderText="프로젝트 명"
                        onValueChange={handleChgPrjct}
                    />
                </Item>
                <Item className="empnoItem" ratio={1} visible={searchItems.empnoItem}>
                    <AutoCompleteName
                        placeholderText="이름"
                        onValueChange={handleChgEmp}
                        value={initParam.empNo}
                    />
                </Item>
                <Item className="expensCdItem" ratio={1} visible={searchItems.expensCdItem}>
                    <CustomCdComboBox
                        param="VTW045"
                        placeholderText="비용코드"
                        name="expensCd"
                        onSelect={(e) => handleChgState({name: "expensCd", value: e.value })}
                        value={initParam.expensCd}
                    />
                </Item>
                <Item className="searchBtnItem" ratio={1} visible={true}>
                    <Button onClick={handleSubmit} text="검색" />
                </Item>
            </Box>
        </div>
    );

}

export default SearchOdrRange;