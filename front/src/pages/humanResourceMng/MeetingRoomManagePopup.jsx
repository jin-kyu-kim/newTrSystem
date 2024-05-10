import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";

import ApiRequest from "utils/ApiRequest";

// 날짜관련
// npm install moment
import Moment from "moment"

// DevExtrme import
import { DateBox, SelectBox, Popup, TagBox, TextArea, Button } from "devextreme-react";
import { useModal } from "../../components/unit/ModalContext";

import { useModal } from "components/unit/ModalContext";

const MeetingRoomManagePopup = ({ width, height, visible, mtgRoomRsvtValue, mtgRoomRsvtAtdrnValue, mtgRoomRsvtListValue, onHiding, title, state, authState }) => {
    const { handleOpen } = useModal();

    // 세션설정
    const [cookies, setCookie] = useCookies(["userInfo", "deptInfo"]);
    const sessionEmpId = cookies.userInfo.empId

    const { handleOpen } = useModal();




    // 기본정보조회
    const [selectEmpList, setSelectEmpList] = useState();
    const [selectMtgRoomCodeList, setSelectMtgRoomCodeList] = useState();

    // 기본정보조회
    useEffect(() => {
        let mtgRoomRsvtAtdrnValueArray = [];

        if(mtgRoomRsvtAtdrnValue && state == "update"){
            mtgRoomRsvtAtdrnValue.map((item, index) => {
                mtgRoomRsvtAtdrnValueArray.push(mtgRoomRsvtAtdrnValue[index].empId)
            })
        }

        getMtgRoomCode();
        getEmpList();

        if(mtgRoomRsvtValue && state == "update"){
            setInsertMtgRoomRsvtValue({
                ...insertMtgRoomRsvtValue,
                mtgRoomCd: mtgRoomRsvtValue[0].mtgRoomCd,
                mtgRoomRsvtSn: mtgRoomRsvtValue[0].mtgRoomRsvtSn,
                rsvtEmpId: mtgRoomRsvtValue[0].rsvtEmpId,
                mtgTtl: mtgRoomRsvtValue[0].mtgTtl,
                useYmd: mtgRoomRsvtValue[0].useYmd,
                useEndYmd: mtgRoomRsvtValue[0].useYmd,
                useBgngHm: mtgRoomRsvtValue[0].useBgngHm,
                useEndHm: mtgRoomRsvtValue[0].useEndHm,
                startDate: new Date(Moment(mtgRoomRsvtValue[0].useYmd + " " + mtgRoomRsvtValue[0].useBgngHm).format("yyyy-MM-DD HH:mm")),
                endDate: new Date(Moment(mtgRoomRsvtValue[0].useYmd + " " + mtgRoomRsvtValue[0].useEndHm).format("yyyy-MM-DD HH:mm")),
            })
        } else if(mtgRoomRsvtValue && state == "insert"){
            setInsertMtgRoomRsvtValue({
                ...insertMtgRoomRsvtValue,
                mtgRoomCd: mtgRoomRsvtValue[0].mtgRoomCd,
                rsvtEmpId: mtgRoomRsvtValue[0].rsvtEmpId,
                useYmd: mtgRoomRsvtValue[0].useYmd,
                useEndYmd: mtgRoomRsvtValue[0].useYmd,
                useBgngHm: mtgRoomRsvtValue[0].useBgngHm,
                useEndHm: mtgRoomRsvtValue[0].useEndHm,
                startDate: mtgRoomRsvtValue[0].startDate,
                endDate: mtgRoomRsvtValue[0].endDate,
            })
        }
        setChangeEmpList(
            mtgRoomRsvtAtdrnValueArray
        )
    }, [])




    const getMtgRoomCode = async () => {
        setSelectMtgRoomCodeList(await ApiRequest('/boot/common/commonSelect', [{ tbNm: "CD" }, { upCdValue: "VTW042" }]));
    }

    const getEmpList = async () => {
        setSelectEmpList(await ApiRequest("/boot/common/queryIdSearch", { queryId: "humanResourceMngMapper.retrieveEmpList" }));
    }





    // 회의실예약저장정보
    const [insertMtgRoomRsvtValue, setInsertMtgRoomRsvtValue] = useState({ regEmpId: sessionEmpId, mdfcnEmpId: sessionEmpId, mtgRoomRsvtSn: "" });
    
    // 회의참석자저장정보
    const [changeEmpList, setChangeEmpList] = useState();





    const insertMtgRoomRsvt = async () => {
        let errorMsg;
        if (!insertMtgRoomRsvtValue.mtgRoomCd) errorMsg = "회의실을 선택하세요."
        else if (!insertMtgRoomRsvtValue.rsvtEmpId) errorMsg = "예약자를 선택하세요."
        else if (!insertMtgRoomRsvtValue.startDate) errorMsg = "시작시간을 선택하세요."
        else if (!insertMtgRoomRsvtValue.endDate) errorMsg = "종료시간을 선택하세요."
        else if (!insertMtgRoomRsvtValue.mtgTtl) errorMsg = "회의내용을 입력하세요."
        // else if (!changeEmpList || changeEmpList.length < 1) errorMsg = "회의참석자를 선택하세요."
        else if (insertMtgRoomRsvtValue.startDate > insertMtgRoomRsvtValue.endDate) errorMsg = "시작시간과 종료시간을 확인하세요."
        else if (insertMtgRoomRsvtValue.useYmd != insertMtgRoomRsvtValue.useEndYmd) errorMsg = "시작일자와 종료일자를 확인하세요."
        else if (Moment(insertMtgRoomRsvtValue.startDate).format("YYYYMMDDHHmm") < Moment(new Date()).format("YYYYMMDDHHmm")) errorMsg = "현재시간 이전의 시간에는 예약하실 수 없습니다."
        
        if (errorMsg) {
            handleOpen(errorMsg);
            return;
        }

        let mtgRoomRsvtValueFilter = mtgRoomRsvtListValue.filter(item => 
            (item.useYmd == insertMtgRoomRsvtValue.useYmd && item.mtgRoomCd == insertMtgRoomRsvtValue.mtgRoomCd && insertMtgRoomRsvtValue.mtgRoomRsvtSn != item.mtgRoomRsvtSn) && 
            ((item.useBgngHm == insertMtgRoomRsvtValue.useBgngHm) 
            || (item.useBgngHm <= insertMtgRoomRsvtValue.useBgngHm && item.useEndHm >= insertMtgRoomRsvtValue.useBgngHm) 
            || (item.useBgngHm < insertMtgRoomRsvtValue.useEndHm && item.useEndHm >= insertMtgRoomRsvtValue.useEndHm) 
            || (item.useBgngHm >= insertMtgRoomRsvtValue.useBgngHm && item.useBgngHm <= insertMtgRoomRsvtValue.useEndHm))
        )

        if(mtgRoomRsvtValueFilter && mtgRoomRsvtValueFilter.length > 0){
            handleOpen("선택하신 시간에 예약된 회의가 있습니다.\n예약현황을 확인하신 후 예약하시기 바랍니다.");
            return;
        } else {
            // const isconfirm = window.confirm("저장하시겠습니까?", "");
            // if(isconfirm){
                const insertData = [
                    { insertMtgRoomRsvtValue }, 
                    { atndEmpIdList: changeEmpList }
                ]
                try {
                    const response = await ApiRequest("/boot/humanResourceMng/insertMtgRoomRsvt", insertData);
                    handleOpen("예약되었습니다.");
                    onHiding(false, true);
                } catch (error) {
                    console.log("insertMtgRoomRsvt_error : ", error);
                }
            // } else {
            //     return;
            // }
        }
    }

    const deleteMtgRoomRsvt = async () => {
        const isconfirm = window.confirm("예약을 취소하시겠습니까?");
        if(isconfirm){
            if(Moment(mtgRoomRsvtValue[0].startDate).format("YYYYMMDDHHmm") < Moment(new Date()).format("YYYYMMDDHHmm")){
                handleOpen("회의실 예약 시작시간이 지난경우에는 취소하실 수 없습니다.");
                return;
            } else {
                try {
                    const response = await ApiRequest("/boot/humanResourceMng/deleteMtgRoomRsvt", mtgRoomRsvtValue[0].mtgRoomRsvtSn);
                    handleOpen("취소되었습니다.");
                    onHiding(false, true);
                } catch (error) {
                    console.log("deleteMtgRoomRsvtt_error : ", error);
                }
            }
        } else {
            return;
        }
    }


    function onEmpListChange(e){
        setChangeEmpList(e);
    }



    function createMtgRoomRender() {
        return (
            <>
                <div className="row">
                    <div className="col-md-2" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>회의실</div>
                    <div className="col-md-10">
                        <SelectBox
                            dataSource={selectMtgRoomCodeList}
                            valueExpr="cdValue"
                            displayExpr="cdNm"
                            placeholder="회의실을 선택하세요."
                            value={insertMtgRoomRsvtValue.mtgRoomCd}
                            onValueChange={(e) => setInsertMtgRoomRsvtValue({ ...insertMtgRoomRsvtValue, mtgRoomCd: e })}
                        />
                    </div>
                </div>
                <div className="row" style={{ marginTop: "30px", marginBottom: "30px" }}>
                    <div className="col-md-2" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>예약자</div>
                    <div className="col-md-10">
                        <SelectBox
                            dataSource={selectEmpList}
                            displayExpr="listEmpFlnm"
                            valueExpr="empId"
                            placeholder="예약자를 선택하세요."
                            searchEnabled={true}
                            value={insertMtgRoomRsvtValue.rsvtEmpId}
                            onValueChange={(e) => setInsertMtgRoomRsvtValue({ ...insertMtgRoomRsvtValue, rsvtEmpId: e })}
                        />
                    </div>
                </div>
                <div className="row" style={{ marginTop: "30px", marginBottom: "30px" }}>
                    <div className="col-md-2" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>시작시간</div>
                    <div className="col-md-4">
                        <DateBox
                            type="datetime"
                            displayFormat="yyyy-MM-dd HH:mm"
                            value={insertMtgRoomRsvtValue.startDate}
                            onValueChange={(e) => setInsertMtgRoomRsvtValue({
                                ...insertMtgRoomRsvtValue, 
                                startDate: e,
                                useYmd: Moment(e).format("YYYYMMDD"),
                                useBgngHm: Moment(e).format("HHmm"),
                            })}
                        />
                    </div>
                    <div className="col-md-2" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>종료시간</div>
                    <div className="col-md-4">
                        <DateBox
                            type="datetime"
                            displayFormat="yyyy-MM-dd HH:mm"
                            value={insertMtgRoomRsvtValue.endDate}
                            onValueChange={(e) => setInsertMtgRoomRsvtValue({
                                ...insertMtgRoomRsvtValue, 
                                endDate: e,
                                useEndYmd: Moment(e).format("YYYYMMDD"),
                                useEndHm: Moment(e).format("HHmm"),
                            })}
                        />
                    </div>
                </div>
                <div className="row" style={{ marginTop: "30px", marginBottom: "30px" }}>
                    <div className="col-md-2" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>회의내용</div>
                    <div className="col-md-10">
                        <TextArea 
                            placeholder="회의내용을 입력하세요."
                            value={insertMtgRoomRsvtValue.mtgTtl}
                            onValueChange={(e) => setInsertMtgRoomRsvtValue({ ...insertMtgRoomRsvtValue, mtgTtl: e })}
                        />
                    </div>
                </div>
                <div className="row" style={{ marginTop: "30px", marginBottom: "30px" }}>
                    <div className="col-md-2" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>회의참석자</div>
                    <div className="col-md-10">
                        <TagBox
                            dataSource={selectEmpList}
                            displayExpr="listEmpFlnm"
                            valueExpr="empId"
                            searchEnabled={true}
                            placeholder="회의참석자를 선택하세요."
                            showSelectionControls={true}
                            value={changeEmpList}
                            onValueChange={onEmpListChange}
                        />
                    </div>
                </div>
                <div style={{ display: "inline-block", float: "right", marginTop: "25px" }}>
                    {
                        authState == "self" || authState == "all"
                        ? <Button style={{ height: "48px", width: "90px", marginRight: "15px" }} onClick={deleteMtgRoomRsvt}>예약취소</Button>
                        : <></>
                    }
                    {
                        authState != "none"
                        ? <Button style={{ height: "48px", width: "60px" }} onClick={() => handleOpen("저장히시겠습니까?", insertMtgRoomRsvt)}>저장</Button>
                        : <></>
                    }
                    
                </div>
            </>
        )
    }

    return (
        <>
            <Popup
                width={width}
                height={height}
                visible={visible}
                title={title}
                showCloseButton={true}
                contentRender={createMtgRoomRender}
                onHiding={(e) => {
                    onHiding(false, false);
                }}
            />
        </>
    )
}

export default MeetingRoomManagePopup