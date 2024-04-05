import React, {useCallback, useEffect, useState} from "react";
import {Button, TabPanel} from "devextreme-react";
import ProjectExpenseJson from "./ProjectExpenseJson.json"
import ApiRequest from "../../utils/ApiRequest";
import {useCookies} from "react-cookie";
import CustomTable from "../../components/unit/CustomTable";

const ProjectExpense = () => {
    const {keyColumn, ctAplyTableColumns, columnCharge} = ProjectExpenseJson;
    const ExpenseInfo = ProjectExpenseJson.ExpenseInfo;
    const [index, setIndex] = useState(0);
    const [aplyYm, setAplyYm] = useState();
    const [aplyOdr, setAplyOdr] = useState();
    const [pageSize] = useState(10);
    const [values, setValues] = useState([]);
    const [charge, setCharge] = useState([]);
    const [cookies] = useCookies([]);

    const empId = cookies.userInfo.empId;

    const date = new Date();
    const year = date.getFullYear();
    const day = date.getDate();

    const month = day > 15 ? date.getMonth() + 1 : date.getMonth();

    let odrVal = day > 15 ? "1" : "2";
    let monthVal = month < 10 ? "0" + month : month;

    const onSelectionChanged = useCallback(
        (args) => {
            if (args.name === "selectedIndex") {
                setIndex(args.value);
            }
        },
        [setIndex]
    );

    useEffect(() => {

        getCtAplyList();

        setAplyYm(year+monthVal);
        setAplyOdr(odrVal);
    }, []);

    const getCtAplyList = async () => {
        try{
            const param = {
                queryId: "projectExpenseMapper.retrievePrjctCtAplyList",
                empId: empId,
                aplyYm: year+monthVal,
                aplyOdr: odrVal
            };
            const response = await ApiRequest("/boot/common/queryIdSearch", param);

            const tempCharge = [];
            response.forEach((value) => {
                if(value?.elctrnAtrzId != null){
                    tempCharge.push(value);
                }
            });
            setCharge(tempCharge);
            setValues(response);
        } catch (e) {
            console.log(e);
        }
    };

    const statusCell = (cell) => {
        if(cell.data.atrzDmndSttsCd === "VTW03701"){
            return (<div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                    <div>
                        {cell.data.atrzDmndSttsCdNm}
                    </div>
                    <Button
                        icon="clearsquare"
                        style={{border: "none"}}
                        onClick={() => deleteValue(cell)}
                    />
                </div>
            );
        }else{
            return (<div>
                {cell.data.atrzDmndSttsCdNm}
            </div>);
        }
    };

    //입력마감 버튼 클릭
    function onInptDdlnClick() {

        const inptDDln = window.confirm('입력마감하시겠습니까?');

        if(inptDDln)
            prjctCtInptDdln();
    };

    // 비용 청구 데이터 결재요청상태 null -> 임시저장
    const prjctCtInptDdln = async () => {

        const param = {
            queryId: "indvdlClmMapper.retrievePrjctCtInptDdln",
            state: "UPDATE",
            empId: empId,
            aplyYm: aplyYm,
            aplyOdr: aplyOdr
        };

        try {
            const response = await ApiRequest("/boot/common/queryIdDataControl", param);

            if (response === 1) {
                window.location.reload();
                window.alert("마감 되었습니다.");
            }
        } catch (error) {
            console.log(error);
        }

    }

    // 승인요청 버튼 클릭
    function onAprvDmndClick() {

        const aprvDmnd = window.confirm("승인요청하시겠습니까?");

        if(aprvDmnd)
            prjctPrjctAprvDmnd();

    };

    // 비용 청구 데이터 결재요청상태 임시저장 -> 결재중
    const prjctPrjctAprvDmnd = async () => {

        const param = {
            queryId: "indvdlClmMapper.retrievePrjctAprvDmnd",
            state: "UPDATE",
            empId: empId,
            aplyYm: aplyYm,
            aplyOdr: aplyOdr
        };

        try {
            const response = await ApiRequest("/boot/common/queryIdDataControl", param);

            if (response === 1) {
                window.location.reload();
                window.alert("승인요청 되었습니다.");
            }
        } catch (error) {
            console.log(error);
        }

    }

    function onInptDdlnRtrcnClick() {

    };

    function onAprvDmndRtrcnClick() {

    }


    function onPrintClick() {

    };


    const deleteValue = (e) => {
        const confirmResult = window.confirm("삭제하시겠습니까?");

    };

    const itemTitleRender = (a) => <span>{a.TabName}</span>;

    return (
        <div className="container">
            <div>
                <div className="mx-auto" style={{marginTop: "20px", marginBottom: "30px"}}>
                    <h1 style={{fontSize: "30px"}}>프로젝트비용</h1>
                        <div>
                            <Button
                                onClick={onInptDdlnClick} text="입력마감" style={{ marginLeft: "5px", height: "48px", width: "100px" }}
                            />
                            <Button
                                onClick={onAprvDmndClick} text="승인요청" style={{ marginLeft: "5px", height: "48px", width: "100px" }}
                            />
                            <Button
                                onClick={onInptDdlnRtrcnClick} text="입력마감취소" style={{ marginLeft: "5px", height: "48px", width: "130px" }}
                            />
                            <Button
                                onClick={onAprvDmndRtrcnClick} text="승인요청취소" style={{ marginLeft: "5px", height: "48px", width: "130px" }}
                            />
                            <Button
                                onClick={onPrintClick} text="출력(팝업)" style={{ marginLeft: "5px", height: "48px", width: "120px" }}
                            />
                </div>
                <p>* {aplyYm}-{aplyOdr}차수 TR 청구 내역</p>
                <CustomTable
                    keyColumn={keyColumn}
                    pageSize={pageSize}
                    columns={ctAplyTableColumns}
                    values={values}
                    paging={true}
                    onClick={deleteValue}
                />
                <p>* 전자결재 청구 내역</p>
                <CustomTable
                    keyColumn={keyColumn}
                    pageSize={pageSize}
                    columns={columnCharge}
                    values={charge}
                    paging={true}
                />
            </div>
                <TabPanel
                    height="auto"
                    width="auto"
                    dataSource={ExpenseInfo}
                    selectedIndex={index}
                    onOptionChanged={onSelectionChanged}
                    itemTitleRender={itemTitleRender}
                    animationEnabled={true}
                    itemComponent={({data}) => {
                        const Component = React.lazy(() => import(`${data.url}`));
                        return (
                            <React.Suspense fallback={<div>Loading...</div>}>
                                <Component
                                    empId={empId}
                                    index={index}
                                    setIndex={setIndex}
                                    aplyYm={aplyYm}
                                    aplyOdr={aplyOdr}
                                />
                            </React.Suspense>
                        );
                    }}
                />
                <div style={{
                    height: "250px",
                    width: "auto",
                    margin: "50px 0 10px 0",
                    borderRadius: "5px",
                    background: "#F2F2F2",
                    display: "flex",
                    alignItems: "center"
                }}>
                    <span style={{fontSize: "20px", marginLeft: "30px"}}>입력 마감되었습니다.</span>
                </div>
            </div>
        </div>
    );
};

export default ProjectExpense;