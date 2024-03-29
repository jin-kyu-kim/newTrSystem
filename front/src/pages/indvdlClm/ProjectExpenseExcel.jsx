import React, {useState} from "react";
import ExcelUpload from "../../components/unit/ExcelUpload";
import Button from "devextreme-react/button";
import {useCookies} from "react-cookie";
import ApiRequest from "../../utils/ApiRequest";

const button = {
    borderRadius: '5px',
    width: '95px',
    marginLeft: '10px'
}

const ProjectExpenseExcel = (props) => {

    const [cookies] = useCookies([]);
    const [excel, setExcel] = useState();

    const onClick = async () => {
        let aplyDate = null;
        let now = new Date();
        let dateNum = Number(now.getDate());
        if (dateNum <= 15) {
            let firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            let lastMonth = new Date(firstDayOfMonth.setDate(firstDayOfMonth.getDate() - 1));
            aplyDate = {
                "aplyYm": lastMonth.getFullYear() + ('0' + (lastMonth.getMonth() + 1)).slice(-2),
                "aplyOdr": 2
            }
        } else if (16 <= dateNum) {
            aplyDate = {
                "aplyYm": now.getFullYear() + ('0' + (now.getMonth() + 1)).slice(-2),
                "aplyOdr": 1
            }
        }
        const param = [];
        param.push({
            tbNm: "CARD_USE_DTLS",
            snColumn: "CARD_USE_SN",
            snSearch: {empId: cookies.userInfo.empId, aplyYm: aplyDate.aplyYm, aplyOdr: aplyDate.aplyOdr}
        });
        for (let i = 1; i < excel?.length; i++) {
            const date = excel[i].__EMPTY_4;
            const time = excel[i].__EMPTY_5;
            const data = {
                "empId": cookies.userInfo.empId,
                "aplyYm": aplyDate.aplyYm,
                "aplyOdr": aplyDate.aplyOdr,
                "utztnDt": date.substring(0, 4) + date.substring(5, 7) + date.substring(8, 10) + time.substring(0, 2) + time.substring(3, 5) + time.substring(6, 8),
                "useOffic": excel[i].__EMPTY_6,
                "utztnAmt": excel[i].__EMPTY_7,
                "aprvNo": excel[i].__EMPTY_20,
                "prjctCtInptPsbltyYn": "Y",
                "regEmpId": cookies.userInfo.empId,
                "ctStlmSeCd": "VTW01903"
            };
            param.push(data);
        }
        try {
            const response = await ApiRequest("/boot/common/commonInsert", param);
            if (response === 1) {
                // window.location.reload();
                props.setIndex(1);
                window.alert("등록되었습니다.")
            }
        } catch (error) {
            window.alert("오류가 발생했습니다.");
            console.error(error);
        }
    }

    return(
        <div className="container" style={{margin: '4%'}}>
            <span style={{fontSize: 18}}>롯데카드 법인카드 사용내역 엑셀을 업로드 합니다.<br/>
                <span style={{fontSize: 14}}>
                    <br/>
                    1. <a href="https://corp.lottecard.co.kr/app/LCMANAA_V100.lc">롯데법인카드 홈페이지</a> > 이용조회 > 승인내역조회에서 조회 후 저장한 엑셀파일을 업로드 합니다.<br/>
                    2. 엑셀 파일을 업로드 후 롯데법인카드 내역 청구 탭에서 선택하여 청구하시면 됩니다.<br/>
                    ※ 승인번호가 같은 경우 기존 데이터를 수정합니다.
                </span>
            </span>
            <ExcelUpload excel={excel} setExcel={setExcel}/>
            <Button style={button} text="업로드" type='default' onClick={onClick}></Button>
        </div>
    );
};

export default ProjectExpenseExcel;