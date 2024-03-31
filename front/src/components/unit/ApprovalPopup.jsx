import { useState, useEffect } from "react";

import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

import { DataGrid, Popup, Button, TagBox, TextBox } from "devextreme-react";

import CustomEmpComboBox from "../unit/CustomEmpComboBox"
import ApiRequest from "../../utils/ApiRequest";

const ApprovalPopup = ( {visible, onHiding, atrzValue} ) => {

    //=======================선언구간========================//
    let tablBodyAtrzValue = [];     //테이블에 나타날 결재권자(가공 후)
    
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
    //=======================선언구간=========================//

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
    const onAddButtonClick = (data, approvalCode, codeIndex) => {
        //===============유효성검사=================//
        console.log("tablBodyAtrzValue : ", tablBodyAtrzValue)
        console.log("data : ", data.value)
        console.log("approvalCode : ", approvalCode)
        console.log("codeIndex : ", codeIndex)
        alert("안돼")

        if(tablBodyAtrzValue[codeIndex] &&
           ( approvalCode === "VTW00701" || approvalCode === "VTW00702" || approvalCode === "VTW00704" || approvalCode === "VTW00705")){

        }
        //=========================================//

        const addBodyAtrzValue = {
            approvalCode: approvalCode,
            empId : selectValue.empId,
            empFlnm : selectValue.empFlnm,
            jbpsNm : selectValue.jbpsNm,
            listEmpFlnm : selectValue.listEmpFlnm
        }
        //BodyAtrzValue setStateF
        setBodyAtrzValue([...bodyAtrzValue, addBodyAtrzValue]);
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

    //팝업창 닫았을 떄
    const closePopup = () => {
        
    }

    //======================이벤트===========================//

    //=====================Validatation Check================//

    //추가이벤트 밸리데이션
    /*
        요구사항
        1. 기안, 검토, 심사, 승인 은 단 한명만 가능
        2. 같은결재단계에 두 명 안됨
    */
    const addValidationCheck = () => {
        //console.log("tablBodyAtrzValue : ", tablBodyAtrzValue)

        return;
    }
    //====================Validatation Check=================//

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
                                        name={codeItem.approvalCode}
                                        onClick={(e) => { onAddButtonClick(e, codeItem.approvalCode, codeIndex) }}
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
                <div style={{ marginTop: "15px" }}>
                    <Button
                        text="Close"
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
                    onHiding={(e) => {
                        onHiding(false);
                    }}
                />
            </>
        )

}

export default ApprovalPopup;
