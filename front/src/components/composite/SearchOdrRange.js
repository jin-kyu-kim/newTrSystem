import React, { useEffect, useCallback, useState } from 'react';
import {Button} from "devextreme-react/button";
import { Box, Item } from "devextreme-react/box";
import CustomDateRangeBox from "../unit/CustomDateRangeBox";
import AutoCompleteProject from "../unit/AutoCompleteProject";
import AutoCompleteName from "../unit/AutoCompleteName";

const SearchOdrRange = ({ callBack, props }) => {

    const [initParam, setInitParam] = useState([]);

    useEffect(() => {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        let odrVal = day > 15 ? "2" : "1";
        let monthVal = month < 10 ? "0" + month : month;

        setInitParam({
            startYmd: year+monthVal,
            startOdr: odrVal,
            endYmd: year+monthVal,
            endOdr: odrVal,
            prjctId: "",
            empId: "",
        });

        callBack(initParam);
    }, []);

    const handleStartDateChange = (newStartDate) => {
        let startYmd = newStartDate.substr(0,6);
        let startOdr = newStartDate.substr(6, 2) > 15 ? "2" : "1";

        // 시작일자가 변경될 때 수행할 로직 추가
        setInitParam({
            ...initParam,
            startYmd: startYmd,
            startOdr: startOdr
        });
    };

    const handleEndDateChange = (newEndDate) => {
        let endYmd = newEndDate.substr(0, 6);
        let endOdr = newEndDate.substr(6, 2) > 15 ? "2" : "1";

        // 종료일자가 변경될 때 수행할 로직 추가
        setInitParam({
            ...initParam,
            endYmd: endYmd,
            endOdr: endOdr
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
            empId: selectedOption,
        });
    };

    const handleSubmit = () => {
        callBack(initParam);
    }

    return (
        <div className="box_search" width="100%">
            <Box direction="row" width={"100%"} height={50} >
                <Item className="prjctDatePickerItem" ratio={2} visible={true}>
                    <CustomDateRangeBox
                        onStartDateChange={handleStartDateChange}
                        onEndDateChange={handleEndDateChange}
                    />
                </Item>
                {/*<Item className="prjctNameItem" ratio={1} visible={props.prjctNameItem}>*/}
                {/*<Item className="prjctNameItem" ratio={1} visible={true}>*/}
                {/*    <AutoCompleteProject*/}
                {/*        placeholderText="프로젝트 명"*/}
                {/*        onValueChange={handleChgPrjct}*/}
                {/*    />*/}
                {/*</Item>*/}
                {/*<Item className="empnoItem" ratio={1} visible={props.empnoItem}>*/}
                {/*<Item className="empnoItem" ratio={1} visible={true}>*/}
                {/*    <AutoCompleteName*/}
                {/*        placeholderText="이름"*/}
                {/*        onValueChange={handleChgEmp}*/}
                {/*        value={initParam.empId}*/}
                {/*    />*/}
                {/*</Item>*/}
                <Item className="searchBtnItem" ratio={1} visible={true}>
                    <Button onClick={handleSubmit} text="검색" />
                </Item>
            </Box>
        </div>
    );

}

export default SearchOdrRange;