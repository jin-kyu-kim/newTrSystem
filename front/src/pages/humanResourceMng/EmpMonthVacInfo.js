import { useEffect, useState } from 'react';
import 'devextreme/dist/css/dx.light.css';
import Calendar from "../../components/unit/Calendar"
import AutoCompleteName from "../../components/unit/AutoCompleteName"
import ApiRequest from "../../utils/ApiRequest";
import EmpMonthVacInfoJson from "./EmpMonthVacInfo.json"
import Box, { Item } from "devextreme-react/box"
import { Button } from "devextreme-react/button";
import { SelectBox } from 'devextreme-react';
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

            // 휴가테이블 구조상 2일이상의 휴가인 경우 커스텀하여 휴가일수(vcatnDeCnt) 데이터 추가
            for (let i = 0; i < response.length; i++) {
                if (response[i].vcatnDeCnt > 1) {
                    for (let j = 1; j < response[i].vcatnDeCnt; j++) {
                        response.push({
                            title: response[i].title,
                            date: String(parseInt(response[i].date) + j)
                        });
                    }
                }
            }
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

    // useEffect(() => {
    //     console.log("searchParam : ", searchParam);
    // }, [searchParam])

    return (
        <div className="container">
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
                        onValueChange={(e) => { onSearchChg("searchMonth", e) }}
                    />
                </div>
                <div className="col-md-3" style={{ marginRight: "-20px" }}>
                    <CustomEmpComboBox
                        value={searchParam.empId}
                        readOnly={false}
                        onValueChange={onSelectEmpFlnmChg}
                        useEventBoolean={true}
                        showClearButton={true}
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
                        // left: 'prevYear,nextYear',
                        // center: 'title',
                        // right: 'prev,next'
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