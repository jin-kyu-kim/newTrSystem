import React from "react";
import Button from "devextreme-react/button";

const button = {
    borderRadius: '5px',
    width: '100px',
    marginTop: '20px',
    marginRight: '15px'
}

const ProjectExpanseExcel = () => {
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
            <div>
            <Button style={button} text="파일 선택"></Button>
                <Button style={button} text="업로드" type='default'></Button>
            </div>
        </div>
);
};

export default ProjectExpanseExcel;