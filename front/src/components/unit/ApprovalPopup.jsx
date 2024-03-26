import { useState, useEffect } from "react";

import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

import { DataGrid, Popup, Button, TagBox, TextBox } from "devextreme-react";

import CustomEmpComboBox from "../unit/CustomEmpComboBox"
import ApiRequest from "../../utils/ApiRequest";

let tablBodyCodeValue = [];
let tablBodyAtrzValue = [];

function onSelectAtrz(selectCodeValue, selectEmpValue, tablBodyCodeValue, tablBodyAtrzValue, changeAppovalValue, changeValue, codeIndex){

    tablBodyAtrzValue.splice(codeIndex, 1, changeValue);

    render(selectCodeValue, selectEmpValue, tablBodyCodeValue, tablBodyAtrzValue);
}

function onAddButtonClick() {
    // console.log(e);
}

const tableHeaderData = [
    { value: "입력", width: "70px" },
    { value: "결재단계", width: "100px" },
    { value: "결재권자" },
];

function createTableHeader() {
    return (
        <>
            {tableHeaderData.map((item, index) => (
                <TableCell
                    key={"header" + index}
                    style={{ textAlign: "center", backgroundColor: "#EEEEEE", border: "1px solid #CCCCCC", width: tableHeaderData[index].width }}>
                    {tableHeaderData[index].value}
                </TableCell>
            ))}
        </>
    )
}



const render = (selectCodeValue, selectEmpValue, tablBodyCodeValue, tablBodyAtrzValue) =>{
    console.log("tablBodyAtrzValue : ", tablBodyAtrzValue);
    return (
        <>
            {tablBodyCodeValue.map((codeItem, codeIndex) => (
                <>
                    <TableRow>
                        <TableCell>
                            <div>
                                <Button
                                    text="+"
                                    onClick={(e) => { onAddButtonClick("addButton" + codeIndex) }}
                                />
                            </div>
                        </TableCell>
                        <TableCell style={{ textAlign: "center" }}>
                            <div>
                                {selectCodeValue ? selectCodeValue[codeIndex].cdNm : ""}
                            </div>
                        </TableCell>
                        <TableCell style={{ textAlign: "center" }}>
                            <TagBox
                                dataSource={selectEmpValue}
                                value={tablBodyAtrzValue[codeIndex]}
                                // valueExpr="empId"
                                displayExpr="listEmpFlnm"
                                stylingMode="underlined"
                                onValueChange={(e) => {onSelectAtrz(
                                    selectCodeValue, 
                                    selectEmpValue, 
                                    tablBodyCodeValue, 
                                    tablBodyAtrzValue, 
                                    selectCodeValue[codeIndex].cdValue,
                                    e,
                                    codeIndex
                                    )}
                                }
                                // onValueChange={onSelectAtrz}
                            />
                        </TableCell>
                    </TableRow>
                </>
            ))}
        </>
    )
}


const ApprovalPopup = ({ visible, onHiding, atrzValue }) => {
    const [selectValue, setSelectValue] = useState({empId: ""});

    // 결재상태코드
    const [selectCodeValue, setSelectCodeValue] = useState([]);
    const [searchCodeParam, setSearchCodeParam] = useState({
        queryId: "humanResourceMngMapper.retrieveCodeList",
        searchType: "approvalCode",
        upCdValue: "VTW007"
    });

    // 직원목록
    const [selectEmpValue, setSelectEmpValue] = useState([]);
    const [searchEmpParam, setSearchEmpParam] = useState({ 
        queryId: "humanResourceMngMapper.retrieveEmpList", 
        searchType: "empList" 
    });

    useEffect(() => {
        pageHandle(searchCodeParam);
    }, [searchCodeParam])

    useEffect(() => {
        pageHandle(searchEmpParam);
    }, [searchEmpParam])


    // 결재상태코드조회
    const pageHandle = async (initParam) => {
        try {
            if(initParam.searchType == "approvalCode" ) setSelectCodeValue(await ApiRequest("/boot/common/queryIdSearch", initParam));
            else if(initParam.searchType == "empList" ) setSelectEmpValue(await ApiRequest("/boot/common/queryIdSearch", initParam));
        } catch (error) {
            console.log(error);
        }
    };

    // 우측의 SelectBox 성명 변경
    function onSelectEmpFlnmChg(e) {
        setSelectValue({
            ...selectValue,
            empno: e[0].empno,
            empId: e[0].empId,
        })
    }

    function createTableBody() {
        selectCodeValue.map((item, index) => {
            tablBodyCodeValue.push({
                approvalCode: selectCodeValue[index].cdValue,
                atrzLnNm: ""
            })
            tablBodyAtrzValue.push(
                atrzValue.filter(item => item.approvalCode == selectCodeValue[index].cdValue)
            )
        });
    
        return (
            render(selectCodeValue, selectEmpValue, tablBodyCodeValue, tablBodyAtrzValue)
        );
    }
    


    const createRenderData = () => {
        return (
            <>
                <div>
                    결재자를 검색 후 입력 버튼을 이용해 결재권자를 설정합니다.
                </div>
                <div style={{ width: "400px", marginTop: "15px" }}>
                    <CustomEmpComboBox
                        value={selectValue.empId}
                        readOnly={false}
                        useEventBoolean={true}
                        showClearButton={true}
                        onValueChange={onSelectEmpFlnmChg}
                    />
                </div>

                <div style={{ marginTop: "15px" }}>
                    <Table>
                        <TableHead>
                            {createTableHeader()}
                        </TableHead>
                        <TableBody>
                            {createTableBody()}
                        </TableBody>
                    </Table>
                </div>
            </>
        )
    }

    return (
        <>
            <Popup
                width={"900px"}
                height={"850px"}
                title={"* 결재선 지정"}
                visible={visible}
                showCloseButton={true}
                contentRender={createRenderData}
                onHiding={(e) => {
                    onHiding(false);
                }}

            />
        </>
    )
}

export default ApprovalPopup;
