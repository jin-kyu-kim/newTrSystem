import { useState, useEffect, useRef } from "react";
import { Popup } from "devextreme-react";
import ApiRequest from "utils/ApiRequest";
import axios from "axios";

// DevExtrme import
import { TextBox, Button } from "devextreme-react";

// 테이블 import
// npm install @mui/material
// npm install @emotion/styled
import { Table, TableCell, TableHead, TableRow } from '@mui/material';

// 랜덤채번 import
import uuid from "react-uuid";

const token = localStorage.getItem("token");

const EmpVacationCanclePopup = ({ width, height, visible, dataMap, empId, onHiding, title }) => {
    useEffect(() => {
        getElctrnAtrz();
        getAtrzLn();
        getRefrnMan();
    }, [])





    // 휴가전자결재정보조회
    const [selectElctrnAtrzValue, setSelectElctrnAtrzValue] = useState();
    const [selectAtrzLnList, setSelectAtrzLnList] = useState();
    const [selectRefrnManList, setSelectRefrnManList] = useState();





    const rtrcnPrvonsh = useRef(null);





    const getElctrnAtrz = async () => {
        setSelectElctrnAtrzValue(await ApiRequest('/boot/common/commonSelect', [{ tbNm: "ELCTRN_ATRZ" }, { elctrnAtrzId: dataMap.elctrnAtrzId }]));
    }

    const getAtrzLn = async () => {
        setSelectAtrzLnList(await ApiRequest('/boot/common/commonSelect', [{ tbNm: "ATRZ_LN" }, { elctrnAtrzId: dataMap.elctrnAtrzId }]));
    }

    const getRefrnMan = async () => {
        setSelectRefrnManList(await ApiRequest('/boot/common/commonSelect', [{ tbNm: "REFRN_MAN" }, { elctrnAtrzId: dataMap.elctrnAtrzId }]));
    }

    function createCancleRender() {
        return (
            <>  
                <div className="row">
                    <div><h5>* 결재 취소 정보</h5></div>
                    <div style={{ marginTop: "30px" }}>취소 사유 입력 후 결재상신 버튼을 클릭하시면 휴가취소 결재 요청이 완료됩니다.</div>
                    <div style={{ marginTop: "10px" }}>
                        <Table>
                            <TableHead>
                                <TableRow style={{ borderTop: "2px solid #CCCCCC", borderBottom: "2px solid #CCCCCC", background: "#EEEEEE" }}>
                                    <TableCell>휴가구분</TableCell>
                                    <TableCell>휴가일수</TableCell>
                                    <TableCell>시작일자</TableCell>
                                    <TableCell>종료일자</TableCell>
                                    <TableCell>신청사유</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>{dataMap.vcatnTyNm}</TableCell>
                                    <TableCell>{dataMap.vcatnDeCnt}일</TableCell>
                                    <TableCell>{dataMap.vcatnBgngYmd}</TableCell>
                                    <TableCell>{dataMap.vcatnEndYmd}</TableCell>
                                    <TableCell>{dataMap.vcatnPrvonsh}</TableCell>
                                </TableRow>
                            </TableHead>
                        </Table>
                    </div>
                    <div style={{ marginTop: "30px" }}><h5>* 취소 사유</h5></div>
                    <div style={{ marginTop: "10px" }}>
                        <TextBox
                            ref={rtrcnPrvonsh}
                            onValueChange={(e) => {
                                rtrcnPrvonsh.current = e
                            }}
                        />
                    </div>
                </div>
                <div style={{ display: "inline-block", float: "right", marginTop: "25px" }}>
                    <Button style={{ height: "48px", width: "80px", marginRight: "15px" }} onClick={onVcatnAtrzCancle}>취소요청</Button>
                </div>
            </>
        )
    }

    function createDeleteRender() {
        return (
            <>
                <div>
                    <div style={{ marginTop: "10px", height: "310px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <h5>결재중인 휴가는 취소 시 삭제됩니다. 취소하시겠습니까?</h5>
                    </div>
                </div>
                <div style={{ display: "inline-block", float: "right", marginTop: "25px" }}>
                    <Button style={{ height: "48px", width: "80px", marginRight: "15px" }} onClick={onVcatnAtrzCancle}>취소요청</Button>
                </div>
            </>
        )
    }

    function onVcatnAtrzCancle() {
        if (dataMap.atrzDmndSttsCd == "VTW03702") {
            deleteVcatnAtrz();
        } else if (dataMap.atrzDmndSttsCd == "VTW03703") {
            insertVcatnAtrz();
        }
    }

    const deleteVcatnAtrz = async () => {
        try{
            const response = await ApiRequest("/boot/indvdlClm/deleteVcatnAtrz", dataMap);
            alert("취소되었습니다.")
            onHiding(false);
        } catch (error) {
            console.log("deleteVcatnAtrz_error : ", error);
        }
    }

    const insertVcatnAtrz = async () => {
        let elctrnAtrzId = uuid();
        const formData = new FormData();

        formData.append("insertDataMap", JSON.stringify(
            { empId: empId, elctrnAtrzId: elctrnAtrzId, rtrcnElctrnAtrzId: dataMap.elctrnAtrzId, rtrcnPrvonsh: rtrcnPrvonsh.current },
        ));

        formData.append("insertElctrnAtrzMap", JSON.stringify(selectElctrnAtrzValue[0]));
        formData.append("insertVactnAtrzMap", JSON.stringify(dataMap));
        formData.append("insertAtrzLnList", JSON.stringify(selectAtrzLnList));
        formData.append("insertRefrnManList", JSON.stringify(selectRefrnManList));

        try {
            const response = await axios.post("/boot/indvdlClm/reInsertVcatnAtrz", formData, {
                headers: { 'Content-Type': 'multipart/form-data', "Authorization": `Bearer ${token}` },
            });
            alert("취소요청되었습니다.")
            onHiding(false);
        } catch (error) {
            console.log("insertVcatnAtrz_error : ", error);
        }
    }

    return (
        <>
            <Popup
                width={width}
                height={height}
                visible={visible}
                showCloseButton={true}
                contentRender={dataMap && dataMap.atrzDmndSttsCd == "VTW03702" ? createDeleteRender : createCancleRender}
                title={title}
                onHiding={(e) => {
                    onHiding(false);
                }}
            />
        </>
    )
}

export default EmpVacationCanclePopup