import React, { useEffect, useState, useCallback } from "react";
import { SelectBox } from "devextreme-react/select-box";
import { Box, Item } from "devextreme-react/box";
import { Button } from "devextreme-react/button";
import CustomComboBox from "components/unit/CustomComboBox";
import ApiRequest from "utils/ApiRequest";
import { TextBox } from "devextreme-react";

const SearchPrjctCostSet = ({ callBack, props }) => {
    const [initParams, setInitParams] = useState([]);
    const [yearData, setYearData] = useState([]);
    const [monthData, setMonthData] = useState([]);

    const [empData, setEmpData] = useState([]);
    const [selectedItem, setSelectedItem] = useState([])
    const [empno, setEmpno] = useState("");
    const [empnoVisible, setEmpnoVisible] = useState(false);

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

    const prjctList = {
        tbNm: "PRJCT",
        valueExpr: "prjctId",
        displayExpr: "prjctNm",
        name: "prjctId",
    }

    const hdofSttsList = [
        {
            "id": "1",
            "value": "",
            "text": "전체"
        },
        {
            "id": "2",
            "value": "VTW00301",
            "text": "재직"
        },
        {
            "id": "3",
            "value": "VTW00302",
            "text": "퇴직"
        },
        {
            "id": "4",
            "value": "VTW00303",
            "text": "휴직"
        }
    ];

    useEffect(() => {

        const date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
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

        if (month === 1) {
            if(day <= 15) {
                month = 12; // 1월인 경우 이전 연도 12월로 설정
                year--;
            } else {

            }
        } else {
            if(day <= 15) {
                month--; // 2월 이상인 경우 이전 월로 설정
            } 
        }
        console.log(month)

        let odrVal = day > 15 ? "1" : "2";
        let monthVal = month < 10 ? "0" + month : month;

        setInitParams({
            yearItem: year,
            monthItem: monthVal,
            aplyOdr: odrVal,
            hdofSttsCd: "VTW00301"
        });

        setYearData(yearList);
        setMonthData(monthList);
        retriveEmpList();

        callBack(initParams);

    }, []);

    const retriveEmpList = async () => {
        const param = [
            { tbNm: "EMP" },
            {}
        ];

        try {
            const response = await ApiRequest("/boot/common/commonSelect", param);
            setEmpData(response);
        } catch (error) {
            console.error(error);
        }
    }

    const selectionChanged = useCallback((event) => {
        if(event.selectedItem == null) {
            setEmpno("");
            setEmpnoVisible(false);
        } else {
            setEmpno(event.selectedItem.empno);
            setEmpnoVisible(true);
        }
        setSelectedItem(event.selectedItem);
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
                            value={initParams.yearItem}
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
                            value={initParams.monthItem}
                        />
                    </Item>
                }
                { props.aplyOdr &&
                    <Item ratio={0} baseSize={"120"}>
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
                }
                { props.hdofSttsCd &&
                    <Item ratio={0} baseSize={"120"}>
                        <SelectBox
                            dataSource={hdofSttsList}
                            name="hdofSttsCd"
                            displayExpr={"text"}
                            valueExpr={"value"}
                            onValueChanged={(e) => handleChgState({name: e.component.option("name"), value: e.value })}
                            placeholder="[재직상태]"
                            style={{margin: "0px 5px 0px 5px"}}
                            value={initParams.hdofSttsCd}
                        />
                    </Item>
                }
                { props.empId && 
                    <Item ratio={0} baseSize={"180"}>
                        <SelectBox
                            dataSource={empData}
                            name="empId"
                            displayExpr={"empFlnm"}
                            valueExpr={"empId"}
                            onValueChanged={(e) => handleChgState({name: e.component.option("name"), value: e.value })}
                            placeholder="사원명"
                            style={{margin: "0px 5px 0px 5px"}}
                            value={initParams.empId}
                            searchEnabled={true}
                            selectedItem={selectedItem}
                            onSelectionChanged={selectionChanged}
                            showClearButton={true}
                        />
                    </Item>
                }
                { empnoVisible && 
                    <Item ratio={0} baseSize={"100"}>
                        <TextBox
                            readOnly={true}
                            value={empno}
                            style={{margin: "0px 5px 0px 5px"}}
                            visible={empnoVisible}
                        />
                    </Item>
                }  
                { props.prjctId &&
                    <Item ratio={0} baseSize={"200"}>
                        <CustomComboBox props={prjctList} value={initParams.prjctId} onSelect={handleChgState} placeholder="프로젝트명" />
                    </Item>
                }
                <Item ratio={0} baseSize={"100"}>
                    <Button text="검색" onClick={btnClick} style={{margin: "0px 5px 0px 5px"}}/>
                </Item>
            </Box>
        </div>
    );
    
}

export default SearchPrjctCostSet;
