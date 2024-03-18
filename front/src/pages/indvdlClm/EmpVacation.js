import { useEffect, useState } from 'react';
import Moment from "moment"     // npm install moment
import SelectBox from "devextreme-react/select-box";
import { Button } from "devextreme-react/button";
import TextBox from "devextreme-react/text-box";
import { DateBox } from 'devextreme-react/date-box';
import CustomEmpComboBox from "components/unit/CustomEmpComboBox"
import CustomTable from "components/unit/CustomTable";
import AutoCompleteProject from "components/unit/AutoCompleteProject";
import EmpVacationJson from "../indvdlClm/EmpVacation.json"
import ApiRequest from "../../utils/ApiRequest";

const textAlign = {
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "14px"
}

const { listQueryId, listKeyColumn, listTableColumns } = EmpVacationJson;

// 현재년도
const nowYear = new Date().getFullYear();

// 회계년도
const flagYear = Moment().format('YYYYMMDD') > nowYear + "0401" ? nowYear : nowYear - 1

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


const EmpVacation = () => {
    // 휴가목록조회
    const [selectVcatnListValue, setSelectVcatnListValue] = useState([]);
    const [searchVcatnListParam, setSearchVcatnListParam] = useState({
        searchType: "vcatnList",
        queryId: "indvdlClmMapper.retrieveVcatnListInq",
        searchYear: flagYear,
        isSearch: true
    });

    // 휴가코드조회
    const [searchCodeParam, setSearchCodeParam] = useState({
        queryId: "humanResourceMngMapper.retrieveCodeList",
        searchType: "vcatnCode",
        upCdValue: "VTW012"
    });
    const [selectCodeValue, setSelectCodeValue] = useState([]);

    // 휴가신청저장정보
    const [insertVcatnValue, setInsertVcatnValue] = useState({  });

    // 회의실예약정보조회
    useEffect(() => {
        if (!Object.values(searchVcatnListParam).every((value) => value === "")) {
            pageHandle(searchVcatnListParam);
        };
    }, [searchVcatnListParam]);

    // 회의실코드조회
    useEffect(() => {
        if (!Object.values(searchCodeParam).every((value) => value === "")) {
            pageHandle(searchCodeParam);
        };
    }, [searchCodeParam])

    // 회의실코드조회
    useEffect(() => {
        if (!Object.values(searchCodeParam).every((value) => value === "")) {
            pageHandle(searchCodeParam);
        };
    }, [searchCodeParam])

    // 조회
    const pageHandle = async (initParam) => {
        try {
            if (initParam.searchType == "vcatnList" && initParam.isSearch == true) setSelectVcatnListValue(await ApiRequest("/boot/common/queryIdSearch", initParam));
            else if (initParam.searchType == "vcatnCode") setSelectCodeValue(await ApiRequest("/boot/common/queryIdSearch", initParam));
            // else if (initParam.searchType == "mtgRoomRsvtAtdrn") setSelectMtgRoomRsvtAtdrnValue(await ApiRequest("/boot/common/queryIdSearch", initParam));
            // else if (initParam.searchType == "empList") setSelectEmpValue(await ApiRequest("/boot/common/queryIdSearch", initParam));
        } catch (error) {
            console.log("async_error : ", error);
        }
    };

    // 휴가목록 검색조건 설정
    function onSearchVcatnParam(param, e) {
        setSearchVcatnListParam({
            ...searchVcatnListParam,
            searchYear: e,
            isSearch: false,
        })
    }

    // 검색버튼
    function onSearchClick(e) {
        setSearchVcatnListParam({
            ...searchVcatnListParam,
            isSearch: true
        })
    }

    // 프로젝트ID 설정
    function onValueChange(e) {
        setInsertVcatnValue({
            ...insertVcatnValue,
            prjctId: e,
        })
    }

    // 휴가정보 저장정보 설정
    function onInsertVcatnValue(param, e) {
        let vcatnDeCnt = "";

        // 날짜 parsing
        if(param == "vcatnBgngYmd" || param == "vcatnEndYmd") e = Moment(e).format('YYYYMMDD');

        // 휴가일수 
        if(param == "vcatnBgngYmd" && insertVcatnValue.vcatnEndYmd != undefined){
            vcatnDeCnt = insertVcatnValue.vcatnEndYmd - e + 1 + "일"
        } else if(param == "vcatnEndYmd" && insertVcatnValue.vcatnBgngYmd != undefined){
            vcatnDeCnt = e - insertVcatnValue.vcatnBgngYmd + 1 + "일"
        } else if(insertVcatnValue.vcatnEndYmd != undefined && insertVcatnValue.vcatnBgngYmd != undefined){
            vcatnDeCnt = insertVcatnValue.vcatnEndYmd - insertVcatnValue.vcatnBgngYmd + 1 + "일"
        } 

        setInsertVcatnValue({
            ...insertVcatnValue,
            vcatnDeCnt: vcatnDeCnt,
            [param]: e,
        })
    }

    // 휴가목록 선택
    function onRowClick() {
        alert("휴가 전자결재화면 이동");
    }

    // if (insertVcatnValue.vcatnEndYmd < insertVcatnValue.vcatnBgngYmd) {
    //     alert("휴가종료일자는 휴가시작일자보다 빠를 수 없습니다.")
    //     return;
    // }

    useEffect(() => {
        console.log("insertVcatnValue : ", insertVcatnValue);
    }, [insertVcatnValue])

    return (
        <div className="" style={{ marginLeft: "7%", marginRight: "7%" }}>
            <div className="mx-auto" style={{ marginTop: "20px", marginBottom: "10px" }}>
                <h1 style={{ fontSize: "30px" }}>휴가</h1>
            </div>
            <div className="mx-auto" style={{ marginBottom: "10px" }}>
                <h5>* 휴가 등록 및 현황을 조회합니다.</h5>
            </div>
            <div className="row" style={{ marginTop: "20px" }}>
                <div className="col-md-2" style={{ marginRight: "-20px" }}>
                    <SelectBox
                        placeholder="[년도]"
                        defaultValue={flagYear}
                        dataSource={getYearList(10, 1)}
                        onValueChange={(e) => { onSearchVcatnParam("vcatnYr", e) }} />
                </div>
                <div className="col-md-1">
                    <Button
                        text="검색"
                        onClick={onSearchClick}
                        style={{ height: "48px", width: "50px" }}
                    />
                </div>
                <div style={{ marginTop: "10px" }}>
                    <span>※검색시 휴가신청에 작성한 내용은 삭제됩니다.</span>
                </div>

                <div style={{ display: "flex", marginTop: "30px" }}>
                    <div style={{ width: "60%", marginRight: "25px" }}>
                        <div style={{ marginTop: "30px" }}>
                            <h5>* 휴가 정보</h5>
                        </div>
                        <div style={{ marginTop: "5px" }}>
                            <span>사용기한 내에 사용하지 않은 연차는 소멸됩니다.</span>
                        </div>
                        <div style={{ marginTop: "30px" }}>
                            
                        </div>
                        <div style={{ marginTop: "10px" }}>
                            <h5>* 휴가신청 목록</h5>
                        </div>
                        <div style={{ marginTop: "10px" }}>
                            <span>1.리스트를 선택시 상세보기가 가능합니다.</span><br />
                            <span>2.결재가 진행되지 않았을 경우 내용수정이 가능합니다.</span><br />
                            <span>3.결재 취소는 결재 완료 후 가능합니다.</span>
                        </div>
                        {
                            true 
                            ?
                            <div style={{ marginTop: "20px" }}>
                                <span style={{fontWeight:"bold", color:"red"}}>공가 파일 미첨부! </span>
                                <span>아래 '파일첨부' 버튼을 통해 공가 증빙서류를 첨부해 주세요.</span>
                            </div>
                            :
                            <></>
                        }
                        <div style={{ marginTop: "30px" }}>
                            <CustomTable
                                keyColumn={listKeyColumn}
                                columns={listTableColumns}
                                values={selectVcatnListValue}
                                onRowClick={onRowClick}
                            />
                        </div>
                    </div>
                    <div style={{ width: "40%" }}>
                        <div style={{ marginTop: "30px" }}>
                            <h5>* 휴가신청</h5>
                        </div>
                        <div style={{ marginTop: "10px" }}>
                            <span>1.프로젝트를 입력하면 프로젝트별 기본 결재선이 자동으로 세팅됩니다.</span><br />
                            <span>2.프로젝트 재 검색시 휴가기간, 파일첨부는 다시 작성해야합니다.</span>
                        </div>
                        <div style={{ marginTop: "30px" }}>
                            
                        </div>
                        <div className="row" style={{ marginTop: "30px" }}>
                            <div className="col-md-2" style={textAlign}>소속</div>
                            <div className="col-md-10">
                                <TextBox value="소속" readOnly={true} />
                            </div>
                        </div>
                        <div className="row" style={{ marginTop: "5px" }}>
                            <div className="col-md-2" style={textAlign}>기안자</div>
                            <div className="col-md-10">
                                <TextBox value="기안자" readOnly={true} />
                            </div>
                        </div>
                        <div className="row" style={{ marginTop: "5px" }}>
                            <div className="col-md-2" style={textAlign}>프로젝트</div>
                            <div className="col-md-10">
                                <AutoCompleteProject
                                    placeholderText="프로젝트를 선택해주세요"
                                    onValueChange={onValueChange}
                                />
                            </div>
                        </div>
                        <div className="row" style={{ marginTop: "5px" }}>
                            <div className="col-md-2" style={textAlign}>휴가유형</div>
                            <div className="col-md-10">
                                <SelectBox
                                    dataSource={selectCodeValue}
                                    placeholder="휴가유형을 선택해주세요"
                                    valueExpr="cdValue"
                                    displayExpr="cdNm"
                                    stylingMode="underlined"
                                    onValueChange={(e) => { onInsertVcatnValue("vcatnTyCd", e) }}
                                />
                            </div>
                        </div>

                        {
                            insertVcatnValue.vcatnTyCd != "VTW01202" && insertVcatnValue.vcatnTyCd !== "VTW01203" 
                            ? 
                            <div className="row" style={{ marginTop: "5px" }}>
                                <div className="col-md-2" style={textAlign}>휴가기간</div>
                                <div className="col-md-4">
                                    <DateBox
                                        stylingMode="underlined"
                                        value={insertVcatnValue.vcatnBgngYmd}
                                        onValueChange={(e) => { onInsertVcatnValue("vcatnBgngYmd", e) }}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <DateBox
                                        stylingMode="underlined"
                                        value={insertVcatnValue.vcatnEndYmd}
                                        onValueChange={(e) => { onInsertVcatnValue("vcatnEndYmd", e) }}
                                    />
                                </div>
                                <div className="col-md-2">
                                    <TextBox
                                        onValueChange={(e) => { onInsertVcatnValue("vcatnDeCnt", e) }}
                                        value={insertVcatnValue.vcatnDeCnt != "" ? insertVcatnValue.vcatnDeCnt : ""}
                                    />
                                </div>
                            </div>
                            :
                            <div className="row" style={{ marginTop: "5px" }}>
                                <div className="col-md-2" style={textAlign}>휴가기간</div>
                                <div className="col-md-4">
                                    <DateBox
                                        stylingMode="underlined"
                                        value={insertVcatnValue.vcatnEndYmd}
                                        onValueChange={(e) => { onInsertVcatnValue("vcatnEndYmd", e) }}
                                    />
                                </div>
                                <div className="col-md-2">
                                    <TextBox
                                        onValueChange={(e) => { onInsertVcatnValue("vcatnDeCnt", 0.5) }}
                                        value={"0.5일"}
                                    />
                                </div>
                            </div>
                        }

                        <div className="row" style={{ marginTop: "5px" }}>
                            <div className="col-md-2" style={textAlign}>사유</div>
                            <div className="col-md-10">
                                <TextBox
                                    placeholder="사유"
                                    stylingMode="underlined"
                                    onValueChange={(e) => { onInsertVcatnValue("vcatnPrvonsh", e) }}
                                />
                            </div>
                        </div>
                        <div className="row" style={{ marginTop: "5px" }}>
                            <div className="col-md-2" style={textAlign}>비상연락망</div>
                            <div className="col-md-10">
                                <TextBox
                                    placeholder="비상연락망"
                                    stylingMode="underlined"
                                    onValueChange={(e) => { onInsertVcatnValue("emgncCttpc", e) }}
                                />
                            </div>
                        </div>
                        <div className="row" style={{ marginTop: "5px" }}>
                            <div className="col-md-2" style={textAlign}>비고</div>
                            <div className="col-md-10">
                                <TextBox
                                    placeholder="비고"
                                    stylingMode="underlined"
                                    onValueChange={(e) => { onInsertVcatnValue("rm", e) }}
                                />
                            </div>
                        </div>
                        <div className="row" style={{ marginTop: "5px" }}>
                            <div className="col-md-2" style={textAlign}>첨부</div>
                            <div className="col-md-10">
                                <TextBox placeholder="첨부파일영역" stylingMode="underlined" />
                            </div>
                        </div>
                        <div style={{ display: "inline-block", float: "right", marginTop: "25px" }}>
                            <Button style={{ height: "48px", width: "120px", marginRight: "15px" }} >결재선지정</Button>
                            <Button style={{ height: "48px", width: "70px", marginRight: "15px" }} >저장</Button>
                        </div>
                    </div>
                </div>
            </div>
            <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
        </div>
    )
}

export default EmpVacation;