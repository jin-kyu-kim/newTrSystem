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

        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        let odrVal = day > 15 ? "2" : "1";
        let monthVal = month < 10 ? "0" + month : month;

        const param = [];
        param.push({
            tbNm: "CARD_USE_DTLS",
            snColumn: "CARD_USE_SN",
            snSearch: {empId: cookies.userInfo.empId, aplyYm: year+monthVal, aplyOdr: odrVal}
        })

        if(excel[0].__EMPTY_4 === "승인일자" && excel[0].__EMPTY_5 === "승인시간") {
            for (let i = 1; i < excel?.length; i++) {

                let utztnAmt;

                if(excel[i].__EMPTY_7.includes('-')){
                    utztnAmt = 0;
                    console.log(i,utztnAmt)
                }else {
                    utztnAmt = excel[i].__EMPTY_7.replace(/,/g, "");
                    console.log(i,utztnAmt)
                }

                const date = excel[i].__EMPTY_4;
                const time = excel[i].__EMPTY_5;

                const data = {
                    "empId": cookies.userInfo.empId,
                    "aplyYm": year+monthVal,
                    "aplyOdr": odrVal,
                    "utztnDt": date.substring(0, 4) + date.substring(5, 7) + date.substring(8, 10) + time.substring(0, 2) + time.substring(3, 5) + time.substring(6, 8),
                    "useOffic": excel[i].__EMPTY_6,
                    "utztnAmt": utztnAmt,
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
                    ※ 승인번호가 같은 경우 기존 데이터를 수정합니다.
                </span>
            </span>
            <ExcelUpload excel={excel} setExcel={setExcel}/>
            <Button style={button} text="업로드" type='default' onClick={onClick} ></Button>
        </div>
    );
};

export default ProjectExpenseExcel;