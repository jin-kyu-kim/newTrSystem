import { useEffect, useState } from 'react';

import { Button, SelectBox } from 'devextreme-react';

import Calendar from "components/unit/Calendar"
import ApiRequest from "utils/ApiRequest";


import EmpMonthVacInfoJson from "./EmpMonthVacInfoJson.json"
import CustomEmpComboBox from "components/unit/CustomEmpComboBox"

/**
 * @param {number} startYear 현재년도 기준 화면에 보여줄 (현재년도 - startYear)
 * @param {number} endYear 현재년도 기준 화면에 보여줄 (현재년도 + endYear)
 * @returns 시작년도부터 시작년도 + endYear 까지의 1차원 배열반환
 */
function getYearList(startYear, endYear) {
    const yearList = [];
    let startDate = parseInt(new Date(String(new Date().getFullYear() - startYear)).getFullYear());
    let endDate = parseInt(new Date().getFullYear() + endYear);

    for (startDate; startDate <= endDate; startDate++) {
        yearList.push(startDate);
    }

    return yearList;
}

/**
 * @returns 01~12월 배열반환
 */
function getMonthList() {
    const monthList = [];

    for (let i = 1; i <= 12; i++) {
        if (i < 10) {
            monthList.push({
                key: i,
                value: "0" + i,
            });
        } else {
            monthList.push({
                key: i,
                value: i
            });
        }
    }

    return monthList;

}

const { queryId } = EmpMonthVacInfoJson;

const EmpMonthVacInfo = () => {
    const [param, setParam] = useState({queryId: queryId, searchYear: new Date().getFullYear(), searchMonth: new Date().getMonth() + 1});
    const [values, setValues] = useState([]);
    const [searchParam, setSearchParam] = useState({ empId: "", searchDate: "", searchYear: new Date().getFullYear(), searchMonth: new Date().getMonth() + 1 });

    // 조회
    useEffect(() => {
        if (!Object.values(param).every((value) => value === "")) {
            pageHandle(param);
        };
    }, [param]);

    useEffect(() => {
        if (!Object.values(searchParam).every((value) => value === "") && searchParam.searchBoolean == true) {
            pageHandle(searchParam);
        };
    }, [searchParam])

    // 조회
    const pageHandle = async (initParam) => {
        try {
            const response = await ApiRequest("/boot/common/queryIdSearch", initParam);
            setValues(response);
        } catch (error) {
            console.log(error);
        }
    };

    /**
     * @param {string} param 검색조건으로 설정할 key값
     * @param {*} e 검색조건으로 설정할 value값
     */
    function onSearchChg(param, e) {
        setSearchParam({
            ...searchParam,
            [param]: e,
            searchBoolean: false,
        })
    }

    /**
     * @param {*} e 
     * @description CustomComboBox 값 셋팅
     */
    function onSelectEmpFlnmChg(e) {
        setSearchParam({
            ...searchParam,
            empId: e[0].empId,
            searchBoolean: false,
        })
    }

    // 검색실행
    const searchHandle = () => {
        setSearchParam({
            ...searchParam,
            queryId: queryId,
            searchBoolean: true,
        });
    }


    return (
        <div className="">
            <div className="mx-auto" style={{ marginTop: "20px", marginBottom: "10px" }}>
                <h1 style={{ fontSize: "30px" }}>월별휴가정보</h1>
            </div>
            <div className="mx-auto" style={{ marginBottom: "10px" }}>
                <span>* 직원의 월별 휴가정보를 조회합니다.</span>
            </div>
            <div className="row">
                <div className="col-md-2" style={{ marginRight: "-20px" }}>
                    <SelectBox
                        placeholder="[년도]"
                        defaultValue={new Date().getFullYear()}
                        dataSource={getYearList(10, 1)}
                        onEnterKey={searchHandle}
                        onValueChange={(e) => { onSearchChg("searchYear", e) }}
                    />
                </div>
                <div className="col-md-1" style={{ marginRight: "-20px" }}>
                    <SelectBox
                        dataSource={getMonthList()}
                        defaultValue={(new Date().getMonth() + 1)}
                        valueExpr="key"
                        displayExpr="value"
                        placeholder=""
                        onEnterKey={searchHandle}
                        onValueChange={(e) => { onSearchChg("searchMonth", e) }}
                    />
                </div>
                <div className="col-md-3" style={{ marginRight: "-20px" }}>
                    <CustomEmpComboBox
                        value={searchParam.empId}
                        readOnly={false}
                        useEventBoolean={true}
                        showClearButton={true}
                        onValueChange={onSelectEmpFlnmChg}
                    />
                </div>
                <div className="col-md-1">
                    <Button
                        onClick={searchHandle} text="검색" style={{ height: "48px", width: "50px" }}
                    />
                </div>
            </div>
            <div className="mx-auto" style={{ marginBottom: "20px", marginTop: "30px" }}>
                <Calendar
                    values={values}
                    headerToolbar={{
                        left: '',
                        center: 'title',
                        right: ''
                    }}
                    initialView="dayGridMonth"
                    initCssValue="monthStyle"
                    clickEventValue="false"
                    searchEvent={searchParam}
                />
            </div>
        </div>
    );
}

export default EmpMonthVacInfo;