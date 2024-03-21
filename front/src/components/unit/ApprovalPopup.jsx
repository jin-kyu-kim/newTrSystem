import { useState, useEffect } from "react";

import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

import { DataGrid, Popup, Button, TagBox } from "devextreme-react";

import CustomEmpComboBox from "../unit/CustomEmpComboBox"
import ApiRequest from "../../utils/ApiRequest";


const ApprovalPopup = ({ visible, prjctId, deptId, onHiding }) => {
    // 회의실코드
    const [selectCodeValue, setSelectCodeValue] = useState([]);
    const [searchCodeParam, setSearchCodeParam] = useState({
        queryId: "humanResourceMngMapper.retrieveCodeList",
        searchType: "approvalCode",
        upCdValue: "VTW007"
    });

    // 회의실코드조회
    useEffect(() => {
        if (!Object.values(searchCodeParam).every((value) => value === "")) {
            pageHandle(searchCodeParam);
        };
    }, [searchCodeParam])


    // 결재선 지정 시 선택된 데이터
    const [selectValue, setSelectValue] = useState([]);

    // 조회
    const pageHandle = async (initParam) => {
        try {
            if (initParam.searchType == "approvalCode") {
                const response = await ApiRequest("/boot/common/queryIdSearch", initParam);
                
                for(let index in response){
                    tableBodyData.push({
                        approvalCode: response[index].cdNm
                    })

                    // console.log("tableBodyData : ", tableBodyData);
                }

                // setSelectCodeValue(await ApiRequest("/boot/common/queryIdSearch", initParam));
            }
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

    const tableHeaderData = [
        { value: "입력", width: "30px"},
        { value: "결재단계", width: "100px" },
        { value: "결재권자" },
    ];

    const tableBodyData = [
        // { 
        //     approvalCode: "", 
        //     approvalPerson: {
        //         empId:"",
        //         empFlnm:""
        //     }
        // }
    ];


    const createRenderData = () => {
        return (
            <>
                <div>
                    결재자를 검색 후 입력 버튼을 이용해 결재권자를 설정합니다.
                </div>
                <div style={{ width: "300px", marginTop:"15px" }}>
                    <CustomEmpComboBox
                        value={selectValue.empId}
                        readOnly={false}
                        onValueChange={onSelectEmpFlnmChg}
                        useEventBoolean={true}
                        showClearButton={true}
                    />
                </div>

                <div style={{marginTop:"15px"}}>
                    <Table>
                        <TableHead>
                            {tableHeaderData.map((item, index) => (
                                <TableCell width={tableHeaderData[index].width} style={{textAlign:"center", backgroundColor:"#EEEEEE", border:"1px solid #CCCCCC"}}>
                                    {tableHeaderData[index].value}
                                </TableCell>
                            ))}
                        </TableHead>
                        <TableBody>
                            {tableBodyData.map((item, index) => (
                                <TableRow>
                                    <TableCell>
                                        {tableBodyData[index].approvalCode}
                                    </TableCell>
                                </TableRow>
                                // <TableRow>
                                //     <TableCell>
                                //         <Button 
                                //             text="+"
                                //             width={"30px"}
                                //         />
                                //     </TableCell>
                                //     <TableCell style={{textAlign:"center"}}>
                                //         {selectCodeValue[index].cdNm}
                                //     </TableCell>
                                //     <TableCell>
                                //         <TagBox
                                //             showClearButton={true}
                                //             stylingMode="outlined"
                                //             placeholder=""
                                //         />
                                //     </TableCell>
                                // </TableRow>
                            ))}
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