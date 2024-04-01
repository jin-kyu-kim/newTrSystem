import { useState, useEffect } from "react";

import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

import { DataGrid, Popup, Button, TagBox, TextBox } from "devextreme-react";

import CustomEmpComboBox from "../unit/CustomEmpComboBox"
import ApiRequest from "../../utils/ApiRequest";

/*
INPUT, OUTPUT 
EX)
atrzValue(결재권자) : 
[
{approvalCode: 'VTW00706', empId: '7951782e-d3df-e0c4-5123-a38c5f4686b6', empFlnm: '이진원', jbpsNm: '이사', listEmpFlnm: '경영지원팀 이진원 이사'},
{approvalCode: 'VTW00706', empId: 'ca74f678-8520-10ab-4429-e7593b2ff009', empFlnm: '안주리', jbpsNm: '차장', listEmpFlnm: '경영지원팀 안주리 차장'}
]
*/
const ApprovalPopup = ( {visible, onHiding, atrzValue} ) => {
    console.log("atrzValue", atrzValue);
    //=======================선언구간========================//
    let tablBodyAtrzValue = []; //테이블에 나타날 결재권자(가공 후)
    
    //테이블에 나타날 결재권자
    const [bodyAtrzValue, setBodyAtrzValue] = useState(atrzValue); //가공 전
    //직원콤보박스에서 고른 직원
    const [selectValue, setSelectValue] = useState({empId: ""});
    // 결재상태코드
    const [selectCodeValue, setSelectCodeValue] = useState([]);

    const searchCodeParam = {
        queryId: "humanResourceMngMapper.retrieveCodeList",
        upCdValue: "VTW007"
    };
    //=======================================================//

    //=======================================================//
    useEffect(() => {
        pageHandle(searchCodeParam);
    }, [])

    // 결재상태코드조회
    const pageHandle = async (searchCodeParam) => {
        try {
            setSelectCodeValue(await ApiRequest("/boot/common/queryIdSearch", searchCodeParam));
        } catch (error) {
            console.log(error);
        }
    };
    //=======================================================//

    //======================이벤트===========================//
    //SelectBox 성명 변경
    const onSelectEmpFlnmChg = (data) => {
        setSelectValue({
                ...selectValue,
                empno : data[0].empno,
                empId : data[0].empId,
                empFlnm: data[0].empFlnm,
                jbpsNm: data[0].jbpsNm,
                listEmpFlnm : data[0].listEmpFlnm
            })
        }
    
    //+버튼시 추가
    const onAddButtonClick = (data, addApprovalCode, codeIndex) => {
        //===================유효성검사======================//

        let isSelectChk = true;
        let isDuplicateChk = true;

        //선택한사람 없을 때
        if(selectValue.empId === null || selectValue.empId === ""){
            isSelectChk = false;
            alert("결재자를 입력해주세요");
        }

        //1. 기안, 검토, 확인, 심사, 승인 은 단 한명만 가능
        //as-is 검토 확인 심사 승인
        if(isSelectChk === true && (addApprovalCode === "VTW00701" || addApprovalCode === "VTW00702" || addApprovalCode === "VTW00703" || addApprovalCode === "VTW00704" || addApprovalCode === "VTW00705")){
            for(let i = 0; i < bodyAtrzValue.length; i++){
                if((bodyAtrzValue[i].approvalCode === addApprovalCode) && bodyAtrzValue[i].empId === selectValue.empId){
                    isDuplicateChk = false;
                    alert("이미 해당 결제단계에 등록되어 있습니다.");
                } else if(bodyAtrzValue[i].approvalCode === addApprovalCode){
                    isDuplicateChk = false;
                    alert("기안, 검토, 확인, 심사, 승인 단계 결재권자는 한명만 설정할 수 있습니다. 삭제 후 설정하시기 바랍니다.");
                }
            }
        }

        //2.같은 결재단계에 동일인 안 됨
        if(isSelectChk === true && ( addApprovalCode === "VTW00706" || addApprovalCode === "VTW00707"))
            for(let i = 0; i < bodyAtrzValue.length; i++){
                if((bodyAtrzValue[i].approvalCode === addApprovalCode) && (bodyAtrzValue[i].empId === selectValue.empId)){
                    isDuplicateChk = false;
                    alert("이미 해당 결제단계에 등록되어 있습니다.");
            }
        }
       //===================================================//

        if(isDuplicateChk === true && isSelectChk === true){
            const addBodyAtrzValue = {
                approvalCode: addApprovalCode,
                empId : selectValue.empId,
                empFlnm : selectValue.empFlnm,
                jbpsNm : selectValue.jbpsNm,
                listEmpFlnm : selectValue.listEmpFlnm
            }

            setBodyAtrzValue([...bodyAtrzValue, addBodyAtrzValue]);
        }
    }
    
    /*onValueChange 삭제 이벤트*/
    const onDeleteTagBox = (data, codeIndex) => {
        tablBodyAtrzValue[codeIndex] = data;

        let tmpBodyAtrzValue = [];

        for(let i = 0; i < tablBodyAtrzValue.length; i++){
            for(let j = 0; j < tablBodyAtrzValue[i].length; j++){
                tmpBodyAtrzValue.push(tablBodyAtrzValue[i][j]);
            }
        }

        setBodyAtrzValue([...tmpBodyAtrzValue]);
    }


    //=======================================================//

    //================== 화면 렌더링 =========================//
    //TagBox 렌더링
    const createTagBox = (codeIndex, value) => {
        return(
            <>
                <TagBox
                    clearButton={true}
                    displayExpr="listEmpFlnm"
                    showSelectionControls={true}
                    value={value}
                    stylingMode="underlined"
                    onValueChange={(e) => {onDeleteTagBox(e, codeIndex)}}
                    searchEnabled={false}
                />
            </>
        )   
    }

    /*
        header 값세팅
    */
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

    //바디변수설정
    const createApprovalTableBody = () => {
        selectCodeValue.map((item, index) => {
            if(bodyAtrzValue && bodyAtrzValue.length > 0){
                tablBodyAtrzValue[index] = (
                    bodyAtrzValue.filter(item => item.approvalCode === selectCodeValue[index].cdValue)
                )
            }
        });

        return (
            bodyRender(selectCodeValue, tablBodyAtrzValue)
        );   
    }

   //바디렌더링
    const bodyRender = (selectCodeValue, tablBodyAtrzValue) => {
        return (
            <>
                {selectCodeValue.map((codeItem, codeIndex) => (
                    <>
                        <TableRow>
                            <TableCell>
                                <div>
                                    <Button
                                        text="+"
                                        name={codeItem.cdValue}
                                        onClick={(e) => { onAddButtonClick(e, codeItem.cdValue, codeIndex) }}
                                    />
                                </div>
                            </TableCell>
                            <TableCell style={{ textAlign: "center" }}>
                                <div>
                                    {selectCodeValue[codeIndex] ? selectCodeValue[codeIndex].cdNm : ""}
                                </div>
                            </TableCell>
                            <TableCell style={{ textAlign: "center" }}>

                                {createTagBox(codeIndex, tablBodyAtrzValue[codeIndex])}
                            </TableCell>
                        </TableRow>
                    </>
                ))}
            </>
        )
    }

    //팝업창 렌더링
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
                <div style={{ marginTop: "15px", display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        text="Close"
                        onClick = {(e) => {onHiding(bodyAtrzValue)}}
                    />
                </div>
            </>
        )
    }

    return (
            <>
                <Popup
                    onClose={true}
                    width={"900px"}
                    height={"850px"}
                    title={"* 결재선 지정"}
                    visible={visible}
                    showCloseButton={true}
                    contentRender={createRenderData}
                    onHiding={(e) => {onHiding(bodyAtrzValue)}}
                />
            </>
        )

}

export default ApprovalPopup;