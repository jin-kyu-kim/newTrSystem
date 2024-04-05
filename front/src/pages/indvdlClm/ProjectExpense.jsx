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

    const deleteValue = (e) => {
        const confirmResult = window.confirm("삭제하시겠습니까?");
        if (confirmResult) {

        }
    };

    const itemTitleRender = (a) => <span>{a.TabName}</span>;

    return (
        <div className="container">
            <div>
                <div className="mx-auto" style={{marginTop: "20px", marginBottom: "30px"}}>
                    <h1 style={{fontSize: "30px"}}>프로젝트비용</h1>
                </div>
                <p>* TR 청구 내역</p>
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
        </div>
    );
};

export default ProjectExpense;