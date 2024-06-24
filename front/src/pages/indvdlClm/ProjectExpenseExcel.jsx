import React, { useEffect, useState } from "react";
import ExcelUpload from "../../components/unit/ExcelUpload";
import Button from "devextreme-react/button";
import ApiRequest from "../../utils/ApiRequest";
import { useModal } from "../../components/unit/ModalContext";

const button = {
    width: '95px',
    borderRadius: '5px',
    marginLeft: '10px'
}

const ProjectExpenseExcel = (props) => {
    const empId = props.empId;
    const aplyYm = props.aplyYm;
    const aplyOdr = props.aplyOdr;

    const [excel, setExcel] = useState();
    const [aprvNoList, setAprvNoList] = useState([]);

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const hours = String(currentDate.getHours()).padStart(2, "0");
    const minutes = String(currentDate.getMinutes()).padStart(2, "0");
    const seconds = String(currentDate.getSeconds()).padStart(2, "0");
    const formattedDate = `${year}${month}${day}${hours}${minutes}${seconds}`;
    const { handleOpen } = useModal();

    useEffect(() => {
        const getCardUseDtl = async () => {
            // 중복검사를 위한 기존 list
            try {
                const response = await ApiRequest('/boot/common/commonSelect', [
                    { tbNm: "CARD_USE_DTLS" }, { empId }
                ]);
                if (response.length !== 0) {
                    const tmpList = response
                        .filter(item => item.prjctCtInptPsbltyYn === "Y")
                        .map(item => item.lotteCardAprvNo);
                    setAprvNoList(tmpList);
                }
            } catch (error) {
                console.log('error', error);
            }
        };
        getCardUseDtl();
    }, []);

    const onClick = async () => {
        if (excel === undefined) {
            handleOpen("파일을 등록해주세요.");
            return;
        }
        let param = [];

        param.push({
            tbNm: "CARD_USE_DTLS",
            snColumn: "CARD_USE_SN",
            snSearch: { empId, aplyYm, aplyOdr }
        });

        if (excel[0].__EMPTY_4 === "승인일자" && excel[0].__EMPTY_5 === "승인시간") {
            
            for (let i = excel.length -1; i > 0; i--) {
                const lotteCardAprvNo = excel[i].__EMPTY_20; // aprvNo[승인번호] -> __EMPTY_20

                // 기존 aprvList에 승인번호가 포함되어 있지 않은 경우만 처리
                if (!aprvNoList.includes(lotteCardAprvNo)) {
                    let utztnAmt = excel[i].__EMPTY_7;

                    utztnAmt = typeof utztnAmt === 'string' ? parseFloat(utztnAmt.replace(/,/g, "")) : utztnAmt;
                    
                    if(utztnAmt > 0){
                        const date = excel[i].__EMPTY_4.replace(/\./g, "");
                        const time = excel[i].__EMPTY_5.replace(/:/g, "");
    
                        const data = {
                            empId, aplyYm, aplyOdr,
                            "utztnDt": date + time,
                            "useOffic": excel[i].__EMPTY_6,
                            "utztnAmt": utztnAmt,
                            "lotteCardAprvNo": excel[i].__EMPTY_20,
                            "prjctCtInptPsbltyYn": "Y",
                            "regEmpId": props.empId,
                            "regDt": formattedDate,
                            "ctStlmSeCd": "VTW01903"
                        };
                        param.push(data);
                    }
                }
            }
            try {
                if (param.length === 1) {
                    handleOpen('이미 등록된 사용내역입니다.');
                    return;
                }
                const response = await ApiRequest("/boot/common/commonInsert", param);
                if (response === 1) {
                    props.setIndex(1);
                    handleOpen("등록되었습니다.")
                }
            } catch (error) {
                handleOpen("오류가 발생했습니다.");
                console.error(error);
            }
        } else {
            handleOpen("롯데법인카드 홈페이지에서 다운로드한 엑셀파일 양식과 동일해야 합니다.");
        }
    }

    return (
        <div style={{ marginLeft: '5%', marginTop: '7%' }}>
            <span style={{ fontSize: 18 }}>롯데카드 법인카드 사용내역 엑셀을 업로드 합니다.<br />
                <span style={{ fontSize: 14 }}>
                    <br />
                    1. <a href="https://corp.lottecard.co.kr/app/LCMANAA_V100.lc" target="_blank">롯데법인카드 홈페이지</a> > 이용조회 > 승인내역조회에서 조회 후 저장한 엑셀파일을 업로드 합니다.<br />
                    2. 엑셀 파일을 업로드 후 롯데법인카드 내역 청구 탭에서 선택하여 청구하시면 됩니다.<br />
                </span>
            </span>
            <ExcelUpload excel={excel} setExcel={setExcel} />
            <Button style={button} text="업로드" type='default' onClick={onClick} ></Button>
        </div>
    );
};
export default ProjectExpenseExcel;