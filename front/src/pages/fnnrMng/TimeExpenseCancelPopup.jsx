import React, { useState, useEffect } from "react";
import CustomEditTable from 'components/unit/CustomEditTable';
import { Popup } from "devextreme-react";
import { Button } from "devextreme-react";
import ApiRequest from "utils/ApiRequest";
import TimeExpenseCancelPopupJson from "./TimeExpenseCancelPopupJson.json";
const TimeExpenseCancelPopup = ({visible, onPopHiding, type, data}) => {

    const { mmQueryId, ctQueryId, mmKeyColumn, mmColumns, ctKeyColumn, ctColumns } = TimeExpenseCancelPopupJson;
    const [values, setValues] = useState([]);
    const [ selectedDataList, setSelectedDataList ] = useState([]);
    const mdfcnDt = new Date().toISOString().split('T')[0]+' '+new Date().toTimeString().split(' ')[0];

    /** 유저 정보 */
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const userAuth = JSON.parse(localStorage.getItem("userAuth"));
    const deptInfo = JSON.parse(localStorage.getItem("deptInfo"));

    const empId = userInfo.empId;
    const deptId = deptInfo.length != 0 ? deptInfo[0].deptId : null;


    useEffect(() => {
        retrieveCancelList();
    }, [data, type]);

    const retrieveCancelList = async () => {
        const param = {
            queryId: type === "ct" ? ctQueryId : mmQueryId,
            empId: data.empId,
            aplyYm: data.aplyYm,
            aplyOdr: data.aplyOdr
        }

        const response = await ApiRequest("/boot/common/queryIdSearch", param);
        setValues(response);
    }

    const onSelection = (e) => {
        setSelectedDataList(e.selectedRowsData);
    }

    const mmCancel = async () => {

        /**
         * 1. PRJCT_MM_ATRZ 수정
         * 승인된 건에 대하여 승인 / 반려를 결재중으로 수정한다.
         * 
         * 2. PRJCT_INDVDL_CT_MM 수정
         * 완료 상태를 N으로 수정한다.
        */

        if(selectedDataList.length <= 0) {
            return;
        }

        
        const mmAtrzParams = selectedDataList.map(selectedData => (
            [
                { tbNm: "PRJCT_MM_ATRZ" },
                {
                    atrzDmndSttsCd: "VTW03702",
                    aprvrEmpId: null,
                    aprvYmd: null,
                    mdfcnDt: mdfcnDt,
                    mdfcnEmpId: empId
                },
                {
                    prjctId: selectedData.prjctId,
                    empId: selectedData.empId,
                    aplyYm: selectedData.aplyYm,
                    aplyOdr: selectedData.aplyOdr,
                    aplyYmd: selectedData.aplyYmd,
                    atrzDmndSttsCd: "VTW03703"
                }
            ]
        ));


        const indvdlCtMmParams = selectedDataList.map(selectedData => (
            [
                { tbNm: "PRJCT_INDVDL_CT_MM" },
                {
                    mmAtrzCmptnYn: "N"
                },
                {
                    prjctId: selectedData.prjctId,
                    empId: selectedData.empId,
                    aplyYm: selectedData.aplyYm,
                    aplyOdr: selectedData.aplyOdr,
                    mmAtrzCmptnYn: "Y"
                }
            ]
        ));

        try {
            const mmAtrzResponse = await ApiRequest("/boot/financialAffairMng/cancelMmCtAtrz", mmAtrzParams);

            if(mmAtrzResponse > 0) {
                const indvdlCtMmResponse = await ApiRequest("/boot/financialAffairMng/cancelMmCtAtrz", indvdlCtMmParams);
                alert("시간 취소에 성공했습니다.");
                onPopHiding();
            }
        } catch (error) {
            alert("취소에 실패했습니다.")
        }
    }

    const ctCancel = async () => {

        /**
         * 1. PRJCT_CT_ATRZ 수정
         * 승인된 건에 대하여 승인 / 반려를 결재중으로 수정한다.
         * 
         * 2. PRJCT_INDVDL_CT_MM 수정
         * 완료 상태를 N으로 수정한다.
        */

        if(selectedDataList.length <= 0) {
            return;
        }

        
        const ctAtrzParams = selectedDataList.map(selectedData => (
            [
                { tbNm: "PRJCT_CT_ATRZ" },
                {
                    atrzDmndSttsCd: "VTW03702",
                    aprvrEmpId: null,
                    aprvYmd: null,
                    mdfcnDt: mdfcnDt,
                    mdfcnEmpId: empId
                },
                {
                    prjctId: selectedData.prjctId,
                    empId: selectedData.empId,
                    aplyYm: selectedData.aplyYm,
                    aplyOdr: selectedData.aplyOdr,
                    atrzDmndSttsCd: "VTW03703",
                    prjctCtAplySn: selectedData.prjctCtAplySn,
                }
            ]
        ));


        const indvdlCtMmParams = selectedDataList.map(selectedData => (
            [
                { tbNm: "PRJCT_INDVDL_CT_MM" },
                {
                    ctAtrzCmptnYn: "N"
                },
                {
                    prjctId: selectedData.prjctId,
                    empId: selectedData.empId,
                    aplyYm: selectedData.aplyYm,
                    aplyOdr: selectedData.aplyOdr,
                    ctAtrzCmptnYn: "Y"
                }
            ]
        ));

        try {
            const mmAtrzResponse = await ApiRequest("/boot/financialAffairMng/cancelMmCtAtrz", ctAtrzParams);

            if(mmAtrzResponse > 0) {
                const indvdlCtMmResponse = await ApiRequest("/boot/financialAffairMng/cancelMmCtAtrz", indvdlCtMmParams);
                alert("시간 취소에 성공했습니다.");
                onPopHiding();
            }
        } catch (error) {
            alert("취소에 실패했습니다.")
        }

    }

    const renderMmList = () => {
        return (
            <div className="container">
                <div className="cancel-popup-table">
                    <div style={{ display: "flex" }}>
                        <CustomEditTable
                            keyColumn={mmKeyColumn}
                            values={values}
                            columns={mmColumns}
                            noEdit={true}
                            onSelection={onSelection}
                        />
                    </div>
                </div>
                <div className="cancel-popup-button">
                    <Button onClick={mmCancel}>시간 취소</Button>
                    <Button className="cancel-popup-button-close" onClick={onPopHiding}>닫기</Button>
                </div>
            </div>
        )
    }

    const renderCtList = () => {

        return(
            <div className="cancel-popup-content container">
                <div>전자결재 - 경비청구로 승인받은 데이터는 표출되지 않습니다.</div>
                <br/>
                <div className="cancel-popup-table">
                    <div style={{ display: "flex" }}>
                        <CustomEditTable
                            keyColumn={ctKeyColumn}
                            values={values}
                            columns={ctColumns}
                            noEdit={true}
                            onSelection={onSelection}
                        />
                    </div>
                </div>
                <div className="cancel-popup-button">
                    <Button onClick={ctCancel}>비용 취소</Button>
                    <Button className="cancel-popup-button-close" onClick={onPopHiding}>닫기</Button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div>
                <Popup
                    width="70%"
                    height="60%"
                    visible={visible}
                    onHiding={onPopHiding}
                    showCloseButton={true}
                    contentRender={type === "ct" ? renderCtList : renderMmList}
                    title={type === "ct" ? "비용 취소" : "시간 취소"}
                    />
            </div>

        </>
    );

}
export default TimeExpenseCancelPopup;