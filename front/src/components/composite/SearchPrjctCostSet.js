import React, { useEffect, useState } from "react";
import { SelectBox } from "devextreme-react/select-box";
import { Box, Item } from "devextreme-react/box";
import { Button } from "devextreme-react/button";
import CustomComboBox from "components/unit/CustomComboBox";

const SearchPrjctCostSet = ({ callBack, props, excelDownload }) => {
    const [initParams, setInitParams] = useState([]);
    const [yearData, setYearData] = useState([]);
    const [monthData, setMonthData] = useState([]);
    
    const yearList = [];
    const monthList = [];

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

    const empList = {
        tbNm: "EMP",
        valueExpr: "empId",
        displayExpr: "empFlnm",
        name: "empId",
    }

    useEffect(() => {

        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();


        const startYear = year - 5;
        const EndYear = year + 5;


        for(let i = startYear; i <= EndYear; i++) {
            yearList.push({"value": i});
        }

        for(let i = 1; i <= 12; i++) {
            if(i < 10) {
                i = "0" + i;
            }
            monthList.push({"value": i});
        }

        let odrVal = day > 15 ? "2" : "1";
        let monthVal = month < 10 ? "0" + month : month;

        setInitParams({
            yearItem: year,
            monthItem: monthVal,
            aplyOdr: odrVal
        });

        setYearData(yearList);
        setMonthData(monthList);

        callBack(initParams);

    }, []);

    const handleChgState = ({ name, value }) => {
        setInitParams({
            ...initParams,
            [name]: value
        })
    }

    const btnClick = () => {
        callBack(initParams);
    }

    return (
        <div className="box_search" width="100%">
            <Box
                direction="row"
                width={"100%"}
                height={50}
            >
                <Item visible={props.yearItem} ratio={0} baseSize={"120"}>
                    <SelectBox 
                        dataSource={yearData}
                        name="yearItem"
                        displayExpr={"value"}
                        valueExpr={"value"}
                        onValueChanged={(e) => handleChgState({name: e.component.option("name"), value: e.value })}
                        placeholder="[연도]"
                        style={{margin: "0px 5px 0px 5px"}}
                        value={initParams.yearItem}
                    />
                </Item>
                <Item visible={props.monthItem} ratio={0} baseSize={"120"}>
                    <SelectBox
                        dataSource={monthData}
                        name="monthItem"
                        displayExpr={"value"}
                        valueExpr={"value"}
                        onValueChanged={(e) => handleChgState({name: e.component.option("name"), value: e.value })}
                        placeholder="[월]"
                        style={{margin: "0px 5px 0px 5px"}}
                        value={initParams.monthItem}
                    />
                </Item>
                <Item visible={props.aplyOdr} ratio={0} baseSize={"120"}>
                    <SelectBox
                        dataSource={odrList}
                        name="aplyOdr"
                        displayExpr={"text"}
                        valueExpr={"value"}
                        onValueChanged={(e) => handleChgState({name: e.component.option("name"), value: e.value })}
                        placeholder="[차수]"
                        style={{margin: "0px 5px 0px 5px"}}
                        value={initParams.aplyOdr}
                    />
                </Item>
                <Item visible={props.empNm} ratio={0} baseSize={"150"}>
                    <CustomComboBox props={empList} onSelect={handleChgState} placeholder="기안자성명" value={initParams.empId}/>
                </Item>
                <Item visible={props.searchBtn} ratio={0} baseSize={"100"}>
                    <Button text="검색" onClick={btnClick}/>
                </Item>
                <Item visible={props.excelDownloadBtn} ratio={0} baseSize={"150"}>
                    <Button text="엑셀다운로드" onClick={excelDownload}/>
                </Item>
            </Box>
        </div>
    );
    
}

export default SearchPrjctCostSet;
