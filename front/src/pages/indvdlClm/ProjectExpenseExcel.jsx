import React, { useState } from "react";
import ExcelUpload from "../../components/unit/ExcelUpload";
import Button from "devextreme-react/button";
import ApiRequest from "../../utils/ApiRequest";

const button = {
    borderRadius: '5px',
    width: '95px',
    marginLeft: '10px'
}

const ProjectExpenseExcel = (props) => {

    const [excel, setExcel] = useState();

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const hours = String(currentDate.getHours()).padStart(2, "0");
    const minutes = String(currentDate.getMinutes()).padStart(2, "0");
    const seconds = String(currentDate.getSeconds()).padStart(2, "0");

    const formattedDate = `${year}${month}${day}${hours}${minutes}${seconds}`;

    const onClick = async () => {
        if (excel === undefined){
            window.alert("파일을 등록해주세요.");
            return;
        }

        let param = [];

        param.push({
            tbNm: "CARD_USE_DTLS",
            snColumn: "CARD_USE_SN",
            snSearch: {
                empId: props.empId,
                aplyYm: props.aplyYm,
                aplyOdr: props.aplyOdr
            }
        });

        if(excel[0].__EMPTY_4 === "승인일자" && excel[0].__EMPTY_5 === "승인시간") {
            for (let i = 1; i < excel?.length; i++) {

                if(!excel[i].__EMPTY_7.includes('-')){

                    const utztnAmt = excel[i].__EMPTY_7.replace(/,/g, "");
                    const date = excel[i].__EMPTY_4.replace(/\./g, "");
                    const time = excel[i].__EMPTY_5.replace(/:/g, "");

                    const data = {
                        "empId": props.empId,
                        "aplyYm": props.aplyYm,
                        "aplyOdr": props.aplyOdr,
                        "utztnDt": date+time,
                        "useOffic": excel[i].__EMPTY_6,
                        "utztnAmt": utztnAmt,
                        "aprvNo": excel[i].__EMPTY_20,
                        "prjctCtInptPsbltyYn": "Y",
                        "regEmpId": props.empId,
                        "regDt": formattedDate,
                        "ctStlmSeCd": "VTW01903"
                    };

                    param.push(data);
                }
            }
            try {
                const response = await ApiRequest("/boot/common/commonInsert", param);

                if (response === 1) {
                    props.setIndex(1);
                    window.alert("등록되었습니다.")
                }
            } catch (error) {
                window.alert("오류가 발생했습니다.");
                console.error(error);
            }

        } else {
            window.alert("롯데법인카드 홈페이지에서 다운로드한 엑셀파일 양식과 동일해야 합니다.");
        }
    }

    return(
        <div className="container" style={{margin: '4%'}}>
            <span style={{fontSize: 18}}>롯데카드 법인카드 사용내역 엑셀을 업로드 합니다.<br/>
                <span style={{fontSize: 14}}>
                    <br/>
                    1. <a href="https://corp.lottecard.co.kr/app/LCMANAA_V100.lc" target="_blank">롯데법인카드 홈페이지</a> > 이용조회 > 승인내역조회에서 조회 후 저장한 엑셀파일을 업로드 합니다.<br/>
                    2. 엑셀 파일을 업로드 후 롯데법인카드 내역 청구 탭에서 선택하여 청구하시면 됩니다.<br/>
                </span>
            </span>
            <ExcelUpload excel={excel} setExcel={setExcel}/>
            <Button style={button} text="업로드" type='default' onClick={onClick} ></Button>
        </div>
    );
};

export default ProjectExpenseExcel;