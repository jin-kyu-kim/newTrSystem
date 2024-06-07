import { useEffect, useState } from "react";
import { SelectBox, TextBox, DateBox, Button } from "devextreme-react";
import Moment from "moment"
import ApiRequest from "utils/ApiRequest";
import CustomTable from "components/unit/CustomTable";
import { useModal } from "components/unit/ModalContext";

function getYearList(startYear, endYear) {
    const yearList = [];
    let startDate = parseInt(new Date(String(new Date().getFullYear() - startYear)).getFullYear());
    let endDate = parseInt(new Date().getFullYear() + endYear);

    for (startDate; startDate <= endDate; startDate++) {
        yearList.push(startDate);
    }
    return yearList;
}

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

const HolidayMng = () => {
    const { handleOpen } = useModal();
    // 검색조건
    const [searchParam, setSearchParam] = useState({
        queryId: "indvdlClmMapper.retrieveMnbyYmdInq",
        aplyYm: Moment().format("YYYYMM"),
        searchYear: new Date().getFullYear(),
        searchMonth: String(new Date().getMonth() + 1).length == 1 ? "0" + String(new Date().getMonth() + 1) : String(new Date().getMonth() + 1)
    });

    // 저장정보
    const [insertParam, setInsertParam] = useState({ queryId: "sysMngMapper.updateCrtrYmd" });
    // 월별정보조회
    const [selectCrtrDateList, setSelectCrtrDateList] = useState();

    // 월별정보조회
    useEffect(() => {
        getCrtrDate(searchParam);
    }, [])

    // 월별정보조회
    const onSearch = async () => {
        let searchData = [];
        searchData.push({
            queryId: "indvdlClmMapper.retrieveMnbyYmdInq",
            aplyYm: String(searchParam.searchYear) + (String(searchParam.searchMonth).length == 1 ? "0" + String(searchParam.searchMonth) : String(searchParam.searchMonth))
        })

        getCrtrDate(searchData[0]);
    }

    // 월별정보조회
    const getCrtrDate = async (param) => {
        try {
            const response = await ApiRequest("/boot/common/queryIdSearch", param);
            setSelectCrtrDateList(response.filter(item => item.aplyYm == searchParam.aplyYm))
        } catch (error) {
            console.log("getCrtrDate_error : ", error);
        }
    }

    const onSaveClick = async () => {
        try {
            await ApiRequest("/boot/common/queryIdSearch", insertParam);
            handleOpen("저장되었습니다.");
            getCrtrDate(searchParam);
        } catch (error) {
            console.log("onSaveClick_error : ", error);
        }
    }

    return (
        <div style={{ marginLeft: "15%", marginRight: "0%" }}>
            <div className="title">휴일관리</div>

            <div className="row">
                <div style={{ marginRight: "-20px", width: "150px" }}>
                    <SelectBox
                        defaultValue={new Date().getFullYear()}
                        dataSource={getYearList(2, 0)}
                        onValueChange={(e) => {
                            setSearchParam({
                                ...searchParam, "searchYear": e,
                                aplyYm: String(e) + (String(searchParam.searchMonth).length == 1 ? "0" + String(searchParam.searchMonth) : String(searchParam.searchMonth))
                            })
                        }}
                    />
                </div>
                <div style={{ marginRight: "-20px", width: "120px" }}>
                    <SelectBox
                        defaultValue={(new Date().getMonth() + 1)}
                        dataSource={getMonthList()}
                        valueExpr="key"
                        displayExpr="value"
                        onValueChange={(e) => {
                            setSearchParam({
                                ...searchParam,
                                "searchMonth": e,
                                aplyYm: String(searchParam.searchYear) + (String(e).length == 1 ? "0" + String(e) : String(e))
                            })
                        }}
                    />
                </div>
                <div className="col-md-1">
                    <Button onClick={onSearch} text="검색" style={{ height: "48px", width: "50px" }} />
                </div>
            </div>

            <div style={{ display: "flex", marginTop: "30px" }}>
                <div style={{ width: "40%", marginRight: "25px" }}>
                    <div className='title-desc' style={{color: 'navy'}}> * 월별정보를 조회합니다.</div>
                    <div style={{ marginTop: "20px" }}>
                        <CustomTable
                            keyColumn="crtrYmd"
                            columns={listTableColumns}
                            values={selectCrtrDateList}
                            wordWrap={true}
                        />
                    </div>
                </div>
                <div style={{ width: "60%", marginRight: "25px", marginLeft: "50px" }}>
                    <div className='title-desc'> * 공휴일을 추가합니다. </div>
                    <div className="row" style={{ marginTop: "20px" }}>
                        <div className="col-md-2" style={textAlign}>일자</div>
                        <div className="col-md-6">
                            <DateBox
                                width={"200px"}
                                displayFormat="yyyy-MM-dd"
                                onValueChange={(e) => { setInsertParam({ ...insertParam, crtrYmd: Moment(e).format("YYYYMMDD") }) }}
                            />
                        </div>
                    </div>
                    <div className="row" style={{ marginTop: "20px" }}>
                        <div className="col-md-2" style={textAlign}>구분</div>
                        <div className="col-md-6">
                            <SelectBox
                                width={"200px"}
                                placeholder=""
                                dataSource={[{ id: "VTW05001", value: "근무일" }, { id: "VTW05002", value: "주말" }, { id: "VTW05003", value: "공휴일" }]}
                                valueExpr="id"
                                displayExpr="value"
                                onValueChange={(e) => { setInsertParam({ ...insertParam, hldyClCd: e }) }}
                            />
                        </div>
                    </div>
                    <div className="row" style={{ marginTop: "20px" }}>
                        <div className="col-md-2" style={textAlign}>공휴일명</div>
                        <div className="col-md-6">
                            <TextBox
                                width={"200px"}
                                onValueChange={(e) => { setInsertParam({ ...insertParam, hldyNm: e }) }}
                            />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div div className="row" style={{ display: "inline-block", marginTop: "25px", marginLeft: "20px" }}>
                            <Button text="저장" style={{ height: "48px", width: "50px", marginTop: "20px" }} onClick={onSaveClick} type='success'/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};
export default HolidayMng;

const textAlign = {
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "14px"
}

const listTableColumns = [
    { "key": "formatCrtrYmd", "value": "일자" },
    { "key": "hldyClNm", "value": "구분" },
]