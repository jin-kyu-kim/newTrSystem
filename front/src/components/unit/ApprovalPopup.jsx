import { useState, useEffect } from "react";

import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

import { DataGrid, Popup, Button, TagBox, TextBox } from "devextreme-react";

import CustomEmpComboBox from "../unit/CustomEmpComboBox"
import ApiRequest from "../../utils/ApiRequest";

const ApprovalPopup = ( {visible, onHiding, atrzValue} ) => {

    console.log("다른화면에서 넘어오는 값 atrzValue : ", atrzValue)

    let tablBodyCodeValue = [];     //테이블에 나타날 결재상태코드
    let tablBodyAtrzValue = [];     //테이블에 나타날 결재권자(가공 후)

    //테이블에 나타날 결재권자
    const [bodyAtrzValue, setBodyAtrzValue] = useState(atrzValue); //가공 전

    //직원콤보박스에서 고른 직원
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

    /*초기 변수값 설정 나중에 바꿔야함*/
    useEffect(() => {
        setBodyAtrzValue(atrzValue)
    }, [atrzValue])
    
    useEffect(() => {
        pageHandle(searchCodeParam);
    }, [searchCodeParam])

    useEffect(() => {
        pageHandle(searchEmpParam);
    }, [searchEmpParam])

    // 결재상태코드조회
    const pageHandle = async (initParam) => {
        try {
            if(initParam.searchType === "approvalCode" ) {
                setSelectCodeValue(await ApiRequest("/boot/common/queryIdSearch", initParam)); 
            } else if(initParam.searchType === "empList" ) {
                setSelectEmpValue(await ApiRequest("/boot/common/queryIdSearch", initParam));
            }

        } catch (error) {
            console.log(error);
        }
    };
    
    //SelectBox 성명 변경
    const onSelectEmpFlnmChg = (e) => {
        setSelectValue({
            ...selectValue,
            empno : e[0].empno,
            empId : e[0].empId,
            empFlnm: e[0].empFlnm,
            jbpsNm: e[0].jbpsNm,
            listEmpFlnm : e[0].listEmpFlnm
        })
    }
    
    //+버튼시 추가
    const onAddButtonClick = (approvalCode) => {
        const addBodyAtrzValue = {
            approvalCode: approvalCode,
            empId : selectValue.empId,
            empFlnm : selectValue.empFlnm,
            jbpsNm : selectValue.jbpsNm,
            listEmpFlnm : selectValue.listEmpFlnm
        }
        //BodyAtrzValue setState
        setBodyAtrzValue([...bodyAtrzValue, addBodyAtrzValue]);
    }

    function onSelectAtrz(selectCodeValue, selectEmpValue, tablBodyCodeValue , tablBodyAtrzValue, changeAppovalValue, changeValue, codeIndex){

        tablBodyAtrzValue.splice(codeIndex, 1, changeValue);
    
        bodyRender(selectCodeValue, selectEmpValue, tablBodyCodeValue, tablBodyAtrzValue);
    }

    /*onValueChange 삭제 이벤트*/
    const onDeleteTagBox = (e) => {
        alert("삭제");
        console.log("deleteBox")
        console.log("e : ", e);
        console.log("tablBodyAtrzValue*** : ", tablBodyAtrzValue);
        console.log("bodyAtrzValue*** : ", bodyAtrzValue);

        if(bodyAtrzValue.length > 1 && bodyAtrzValue){
            for(let i = 0; i < bodyAtrzValue.length; i++){
                const delApprovalCd = e.ApprovalPopup;
                const delEmpId = e.empId;
                const listEmpFlnm = e.listEmpFlnm;
 

            }
        }

    }
    /*
        TagBox 렌더링 
    */
    const createTagBox = (codeIndex, value) => {
        console.log("single : ", value)
        return(
            <>
                <TagBox
                    key={value.empId}
                    name={value.empId}
                    clearButton={true}
                    dataSource={selectEmpValue}
                    displayExpr="listEmpFlnm"
                    showSelectionControls={true}
                    value={value}
                    valueExpr={value.empId}
                    stylingMode="underlined"
                    onValueChange={(e) => {onDeleteTagBox(value)}}
                    // onValueChange={onSelectAtrz}
                    // onValueChange={onDeleteTagBox}
                />
            </>
        )   
    }

    const tableHeaderData = [
        { value: "입력", width: "70px" },
        { value: "결재단계", width: "100px" },
        { value: "결재권자" },
    ];

    /*
        table header 렌더링
    */
    const createTableHeader = () => {
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

    /*
        table body 변수 설정
    */
    const createApprovalTableBody = () => {
        tablBodyCodeValue = [];
        selectCodeValue.map((item, index) => {
            tablBodyCodeValue.push({
                approvalCode: selectCodeValue[index].cdValue,
                atrzLnNm: ""
            })
            if(bodyAtrzValue && bodyAtrzValue.length > 0){
                tablBodyAtrzValue[index] = (
                    bodyAtrzValue.filter(item => item.approvalCode === selectCodeValue[index].cdValue)
                )
            }
        });

        return (
            bodyRender(selectCodeValue, selectEmpValue, tablBodyCodeValue, tablBodyAtrzValue)
        );   
    }

    /*
        tablebody렌더링
    */
    const bodyRender = (selectCodeValue, selectEmpValue, tablBodyCodeValue, tablBodyAtrzValue) => {
        console.log("tablBodyAtrzValue V :", tablBodyAtrzValue);
        return (
            <>
                {tablBodyCodeValue.map((codeItem, codeIndex) => (
                    <>
                        <TableRow>
                            <TableCell>
                                <div>
                                    <Button
                                        text="+"
                                        name={codeItem.approvalCode}
                                        onClick={(e) => { onAddButtonClick(codeItem.approvalCode, codeIndex) }}
                                    />
                                </div>
                            </TableCell>
                            <TableCell style={{ textAlign: "center" }}>
                                <div>
                                    {selectCodeValue[codeIndex] ? selectCodeValue[codeIndex].cdNm : ""}
                                </div>
                            </TableCell>
                            <TableCell style={{ textAlign: "center" }}>
                                {tablBodyAtrzValue[codeIndex].length > 1 ? 
                                    tablBodyAtrzValue[codeIndex].map((item, index) => (createTagBox(codeIndex, [tablBodyAtrzValue[codeIndex][index]]))) : createTagBox(codeIndex, tablBodyAtrzValue[codeIndex])}
                                {/*createTagBox(codeIndex, tablBodyAtrzValue[codeIndex])*/}
                            </TableCell>
                        </TableRow>
                    </>
                ))}
            </>
        )
    }

    /*
        전체 팝업창 렌더링
    */
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
                            {createApprovalTableBody()}
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
