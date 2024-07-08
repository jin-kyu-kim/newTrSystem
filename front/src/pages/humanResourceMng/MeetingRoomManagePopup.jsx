import { useState, useEffect } from "react";
import { DateBox, SelectBox, Popup, TagBox, TextArea, Button } from "devextreme-react";
import { useModal } from "../../components/unit/ModalContext";
import ApiRequest from "utils/ApiRequest";
import Moment from "moment";
import "./MeetingRoomManage.css";

const MeetingRoomManagePopup = ({ width, height, visible, mtgRoomRsvtValue, mtgRoomRsvtAtdrnValue, mtgRoomRsvtListValue, onHiding, title, state, authState }) => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const sessionEmpId = userInfo.empId;
    const { handleOpen } = useModal();

    const [selectEmpList, setSelectEmpList] = useState();
    const [selectMtgRoomCodeList, setSelectMtgRoomCodeList] = useState();
    const [insertMtgRoomRsvtValue, setInsertMtgRoomRsvtValue] = useState({ regEmpId: sessionEmpId, mdfcnEmpId: sessionEmpId, mtgRoomRsvtSn: "" });
    const [changeEmpList, setChangeEmpList] = useState();
    const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth <= 768);
        };
        window.addEventListener('resize', handleResize);
        handleResize(); // 초기 실행 시에도 호출

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        let mtgRoomRsvtAtdrnValueArray = [];

        if (mtgRoomRsvtAtdrnValue && state === "update") {
            mtgRoomRsvtAtdrnValue.forEach(item => {
                mtgRoomRsvtAtdrnValueArray.push(item.empId);
            });
        }
        getMtgRoomCode();
        getEmpList();

        if (mtgRoomRsvtValue) {
            const commonValues = {
                mtgRoomCd: mtgRoomRsvtValue[0].mtgRoomCd,
                rsvtEmpId: mtgRoomRsvtValue[0].rsvtEmpId,
                useYmd: mtgRoomRsvtValue[0].useYmd,
                useEndYmd: mtgRoomRsvtValue[0].useYmd,
                useBgngHm: mtgRoomRsvtValue[0].useBgngHm,
                useEndHm: mtgRoomRsvtValue[0].useEndHm,
            };

            if (state === "update") {
                setInsertMtgRoomRsvtValue({
                    ...insertMtgRoomRsvtValue,
                    ...commonValues,
                    mtgRoomRsvtSn: mtgRoomRsvtValue[0].mtgRoomRsvtSn,
                    mtgTtl: mtgRoomRsvtValue[0].mtgTtl,
                    startDate: new Date(Moment(mtgRoomRsvtValue[0].useYmd + " " + mtgRoomRsvtValue[0].useBgngHm).format("yyyy-MM-DD HH:mm")),
                    endDate: new Date(Moment(mtgRoomRsvtValue[0].useYmd + " " + mtgRoomRsvtValue[0].useEndHm).format("yyyy-MM-DD HH:mm")),
                    state: state
                });
            } else if (state === "insert") {
                setInsertMtgRoomRsvtValue({
                    ...insertMtgRoomRsvtValue,
                    ...commonValues,
                    startDate: mtgRoomRsvtValue[0].startDate,
                    endDate: mtgRoomRsvtValue[0].endDate,
                    state: state
                });
            }
        }

        setChangeEmpList(mtgRoomRsvtAtdrnValueArray);
    }, [mtgRoomRsvtValue, mtgRoomRsvtAtdrnValue, state]);

    const getMtgRoomCode = async () => {
        setSelectMtgRoomCodeList(await ApiRequest('/boot/common/commonSelect', [{ tbNm: "CD" }, { upCdValue: "VTW042" }]));
    };

    const getEmpList = async () => {
        setSelectEmpList(await ApiRequest("/boot/common/queryIdSearch", { queryId: "humanResourceMngMapper.retrieveEmpList" }));
    };

    const insertMtgRoomRsvt = async () => {
        let errorMsg;
        if (!insertMtgRoomRsvtValue.mtgRoomCd) errorMsg = "회의실을 선택하세요.";
        else if (!insertMtgRoomRsvtValue.rsvtEmpId) errorMsg = "예약자를 선택하세요.";
        else if (!insertMtgRoomRsvtValue.startDate) errorMsg = "시작시간을 선택하세요.";
        else if (!insertMtgRoomRsvtValue.endDate) errorMsg = "종료시간을 선택하세요.";
        else if (!insertMtgRoomRsvtValue.mtgTtl) errorMsg = "회의내용을 입력하세요.";
        else if (insertMtgRoomRsvtValue.startDate > insertMtgRoomRsvtValue.endDate) errorMsg = "시작시간과 종료시간을 확인하세요.";
        else if (insertMtgRoomRsvtValue.useYmd !== insertMtgRoomRsvtValue.useEndYmd) errorMsg = "시작일자와 종료일자를 확인하세요.";
        else if (Moment(insertMtgRoomRsvtValue.startDate).format("YYYYMMDDHHmm") < Moment(new Date()).format("YYYYMMDDHHmm")) errorMsg = "현재시간 이전의 시간에는 예약하실 수 없습니다.";

        if (errorMsg) {
            handleOpen(errorMsg);
            return;
        }

        let mtgRoomRsvtValueFilter = mtgRoomRsvtListValue.filter(item =>
            (item.useYmd === insertMtgRoomRsvtValue.useYmd && item.mtgRoomCd === insertMtgRoomRsvtValue.mtgRoomCd && insertMtgRoomRsvtValue.mtgRoomRsvtSn !== item.mtgRoomRsvtSn) &&
            (
                (item.useBgngHm < insertMtgRoomRsvtValue.useEndHm && item.useEndHm > insertMtgRoomRsvtValue.useBgngHm) ||
                (item.useEndHm > insertMtgRoomRsvtValue.useBgngHm && item.useBgngHm < insertMtgRoomRsvtValue.useEndHm)
            )
        );
        if (mtgRoomRsvtValueFilter && mtgRoomRsvtValueFilter.length > 0) {
            handleOpen("선택하신 시간에 예약된 회의가 있습니다.\n예약현황을 확인하신 후 예약하시기 바랍니다.");
            return;

        } else {
            const insertData = [
                { insertMtgRoomRsvtValue },
                { atndEmpIdList: changeEmpList }
            ];
            try {
                const response = await ApiRequest("/boot/humanResourceMng/insertMtgRoomRsvt", insertData);

                if(response === 1) {
                    handleOpen("예약되었습니다.");
                    onHiding(false, true);
                }
            } catch (error) {
                console.log("insertMtgRoomRsvt_error : ", error);
            }
        }
    };

    const deleteMtgRoomRsvt = async () => {
        if (Moment(mtgRoomRsvtValue[0].startDate).format("YYYYMMDDHHmm") < Moment(new Date()).format("YYYYMMDDHHmm")) {
            handleOpen("회의실 예약 시작시간이 지난경우에는 취소하실 수 없습니다.");
            return;
        } else {
            try {
                await ApiRequest("/boot/humanResourceMng/deleteMtgRoomRsvt", mtgRoomRsvtValue[0].mtgRoomRsvtSn);
                handleOpen("취소되었습니다.");
                onHiding(false, true);
            } catch (error) {
                console.log("deleteMtgRoomRsvt_error : ", error);
            }
        }
    };

    function onEmpListChange(e) {
        setChangeEmpList(e);
    }

    function createMtgRoomRender() {
        return (
            <div className="popup-content">
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
                <div className="row" style={{ marginTop: "10px", marginBottom: "10px" }}>
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
                <div className="row" style={{ marginTop: "10px", marginBottom: "10px" }}>
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
                <div className="row" style={{ marginTop: "10px", marginBottom: "10px" }}>
                    <div className="col-md-2" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>회의내용</div>
                    <div className="col-md-10">
                        <TextArea
                            placeholder="회의내용을 입력하세요."
                            value={insertMtgRoomRsvtValue.mtgTtl}
                            onValueChange={(e) => setInsertMtgRoomRsvtValue({ ...insertMtgRoomRsvtValue, mtgTtl: e })}
                        />
                    </div>
                </div>
                <div className="row" style={{ marginTop: "10px", marginBottom: "10px" }}>
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
                <div style={{ display: "inline-block", float: "right", marginTop: "10px" }}>
                    {(authState === "self" || authState === "all") && (
                        <Button style={{ height: "36px", width: "80px", marginRight: "10px" }} onClick={() => { handleOpen("예약을 취소하시겠습니까?", deleteMtgRoomRsvt) }}>예약취소</Button>
                    )}
                    {authState !== "none" && (
                        <Button style={{ height: "36px", width: "80px" }} onClick={() => handleOpen("저장하시겠습니까?", insertMtgRoomRsvt)}>저장</Button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <Popup
            width={isMobileView ? '95%' : width}
            height={isMobileView ? '95%' : height}
            visible={visible}
            title={title}
            showCloseButton={true}
            contentRender={createMtgRoomRender}
            onHiding={() => { onHiding(false, false) }}
        />
    );
};
export default MeetingRoomManagePopup;