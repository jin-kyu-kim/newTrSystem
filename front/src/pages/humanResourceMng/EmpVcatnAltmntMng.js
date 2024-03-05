import { useEffect, useState } from 'react';
import CustomTable from "components/unit/CustomTable";
import { NumberBox } from "devextreme-react/number-box";
import SelectBox from "devextreme-react/select-box";
import TextBox from "devextreme-react/text-box";
import { DateBox } from 'devextreme-react/date-box';
import { Button } from "devextreme-react";
import Box, { Item } from "devextreme-react/box"
import ApiRequest from "../../utils/ApiRequest";
import EmpVcatnAltmntMngJson from "../humanResourceMng/EmpVcatnAltmntMng.json"

const { listQueryId, listKeyColumn, listTableColumns } = EmpVcatnAltmntMngJson;

const divStyle = {
    marginTop: "10px"
}

const textAlign = {
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
}

const EmpVcatnAltmntMng = () => {
    const [param, setParam] = useState([]);
    const [listValues, setListValues] = useState([]);
    const [selectValue, setSelectValue] = useState([]);
    const [searchParam, setSearchParam] = useState({ empno: "" });

    useEffect(() => {
        setParam({
            queryId: listQueryId,
        });
    }, [])

    useEffect(() => {
        if (!Object.values(param).every((value) => value === "")) {
            pageHandle(param);
        }
    }, [param]);

    // 검색실행
    const searchHandle = () => {
        setParam({
            queryId: listQueryId,
            // empno: searchParam.empno
        });
    }

    const pageHandle = async (initParam) => {
        try {
            setListValues(await ApiRequest("/boot/common/queryIdSearch", initParam));
        } catch (error) {
            console.log(error);
        }
    };

    function onRowDblClick(e) {
        setSelectValue({
            empno: e.data.empno,
            empFlnm: e.data.empFlnm,
            jobNm: e.data.jobNm,
            deptNm: e.data.deptNm,
            vcatnAltmntDaycnt: e.data.vcatnAltmntDaycnt,
            useDaycnt: e.data.useDaycnt,
            remainDaycnt: e.data.remainDaycnt,
            hdofSttsNm: e.data.hdofSttsNm
        })
    }

    function onValueChange(e){
        console.log("selectValue : ", selectValue);
        console.log("e : ", e);
        setSelectValue({
            empno: selectValue.empno,
            empFlnm: selectValue.empFlnm,
            jobNm: selectValue.jobNm,
            deptNm: selectValue.deptNm,
            vcatnAltmntDaycnt: selectValue.vcatnAltmntDaycnt,
            useDaycnt: selectValue.useDaycnt,
            remainDaycnt: e,
            hdofSttsNm: selectValue.hdofSttsNm
        })
    }

    useEffect(() => {
        // console.log("selectValue : ", selectValue);
    },[selectValue])

    return (
        <div className="" style={{ marginLeft: "10%", marginRight: "10%" }}>
            <div className="mx-auto" style={{ marginTop: "20px", marginBottom: "10px" }}>
                <h1 style={{ fontSize: "30px" }}>월별휴가정보</h1>
            </div>
            <div className="mx-auto" style={{ marginBottom: "10px" }}>
                <span>* 직원의 월별 휴가정보를 조회합니다.</span>
            </div>

            <Box direction="flex">
                <Item className="" ratio={1}>
                    <SelectBox placeholder="년도" />
                </Item>
                <Item className="" ratio={1}>
                    <TextBox placeholder="사번" />
                </Item>
                <Item className="" ratio={1}>
                    <TextBox placeholder="성명" />
                </Item>
                <Item className="" ratio={1}>
                    <SelectBox placeholder="직위" />
                </Item>
                <Item className="" ratio={1}>
                    <SelectBox placeholder="소속" />
                </Item>
                <Item className="" ratio={1}>
                    <SelectBox placeholder="재직" />
                </Item>
                <Item className="searchBtnItem" ratio={1}>
                    <Button onClick={searchHandle} text="검색" style={{ height: "48px", width: "50px" }} />
                </Item>
            </Box>

            <div style={{ display: "flex", marginTop: "30px" }}>
                <div style={{ width: "65%", marginRight: "25px" }}>
                    <div style={divStyle}><h4>* 직원목록</h4></div>
                    <div style={divStyle}>직원목록을 클릭시 휴가 배정 정보를 수정 할 수있습니다.</div>
                    <div style={divStyle}>
                        <CustomTable
                            keyColumn={listKeyColumn}
                            columns={listTableColumns}
                            values={listValues}
                            onRowDblClick={onRowDblClick}
                        />
                    </div>
                </div>
                <div style={{ width: "35%" }}>
                    <div style={divStyle}><h4>* 개인별 휴가 배정 입력</h4></div>
                    <div style={divStyle}>휴가 배정일을 입력 시 사용일 및 잔여일은 자동 계산됩니다.</div>
                    <div style={{ marginTop: "10px", flexDirection: "row" }}>
                        <div className="row">
                            <div className="col-md-2" style={textAlign}>성명</div>
                            <div className="col-md-10">
                                <TextBox value={selectValue.empFlnm} readOnly="ture"/>
                            </div>
                        </div>
                        <div style={{ marginTop: "20px", fontSize: "11px" }}>*회계년도기준</div>
                        <div className="row">
                            <div className="col-md-2" style={textAlign}>사용일수</div>
                            <div className="col-md-4">
                                <TextBox value={selectValue.useDaycnt} readOnly="true"/>
                            </div>
                            <div className="col-md-2" style={textAlign}>배정일수</div>
                            <div className="col-md-4">
                                <NumberBox
                                    step={0.5} showSpinButtons={true} showClearButton={true} value={selectValue.remainDaycnt} onValueChange={onValueChange}
                                />
                            </div>
                        </div>
                        <div style={{ marginTop: "20px", fontSize: "11px" }}>*입사년도기준</div>
                        <div className="row">
                            <div className="col-md-2" style={textAlign}>사용일수</div>
                            <div className="col-md-4"><TextBox readOnly="true"/></div>
                            <div className="col-md-2" style={textAlign}>배정일수</div>
                            <div className="col-md-4"><NumberBox
                                step={0.5} showSpinButtons={true} showClearButton={true} defaultValue={""}
                            />
                            </div>
                        </div>
                        <div className="row" style={divStyle}>
                            <div className="col-md-2" style={textAlign}>사용기한</div>
                            <div className="col-md-4"><DateBox /></div>
                            <div className="col-md-2" style={textAlign}>~</div>
                            <div className="col-md-4"><DateBox /></div>
                        </div>
                        <div style={{display: "inline-block", float: "right", marginTop:"15px"}}>
                            <Button style={{ height: "48px", width: "70px", marginRight:"15px"}}>저장</Button>
                            <Button style={{ height: "48px", width: "70px" }}>초기화</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmpVcatnAltmntMng;
