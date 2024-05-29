import React, { useState } from "react";
import { Button } from "devextreme-react/button";
import { TextBox } from "devextreme-react/text-box";
import AtrzLnTable from "components/unit/AtrzLnTable";
import ApprovalPopup from "components/unit/ApprovalPopup";
import logoImg from "../../../assets/img/vtwLogo.png";
import '../ElecAtrz.css'

const ElecAtrzTitleInfo = ({ sttsCd, refer, atrzLnEmpList, getAtrzLn, contents, onClick, formData, prjctData, onHandleAtrzTitle, atrzParam }) => {
  const [popVisible, setPopVisible] = useState(false);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const onAtrzLnPopup = async () => {
    setPopVisible(true);
  }

  const onPopHiding = async (aprvrEmpList) => {
    setPopVisible(false);
    getAtrzLn(aprvrEmpList)
  }

  const setButtons = () => {
    let buttonsToRender;

    const defaultButtons = ['print', 'docHist', 'list'];
    const buttonIdToShow = {
      'VTW00801': ['aprv', 'rjct', 'print', 'docHist', 'list'],
      'VTW03702': ['print', 'cancel', 'reAtrz', 'docHist', 'list'],
      'VTW03703': ['print', 'update', 'cancel', 'reAtrz', 'docHist', 'list'],
      'VTW03704': ['reAtrz', 'list', 'docHist']
    };

    if (onHandleAtrzTitle) {
      buttonsToRender = contents; // 기안 작성페이지의 경우 모든 contents 렌더
    } else {
      const currentButtons = ((refer === null || refer === undefined) && buttonIdToShow[sttsCd]) || defaultButtons;
      buttonsToRender = contents.filter(item => currentButtons.includes(item.id));
    }
    return buttonsToRender.map((item, index) => (
      <Button id={item.id} text={item.text} type={item.type} style={{ marginRight: '6px' }} 
       key={index} onClick={item.id === 'onAtrzLnPopup' ? onAtrzLnPopup : onClick} />
    ));
  };

  return (
    <div style={{fontSize: '16px'}}>
      <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: '3%', marginLeft: '2%', marginRight: '2%' }}>
        <div style={{ float: "left", marginRight: "auto" }}><img src={logoImg} style={{ width: '50%', marginBottom: '20px' }} /></div>
        <div style={{ display: "inline-block" }}>{setButtons()}</div>
      </div>

      {
        sttsCd === "VTW03705" ?
        <>
          <h3 style={{ textAlign: "center", textDecoration: "line-through"}}>{formData.gnrlAtrzTtl}</h3>
          <h3 style={{ textAlign: "center", color: "red"}}>결재 취소된 문서</h3>
        </>
        :
        sttsCd === "VTW03706" ?
        <>
          <h3 style={{ textAlign: "center", textDecoration: "line-through"}}>{formData.gnrlAtrzTtl}</h3>
          <h3 style={{ textAlign: "center", color: "red"}}>결재 변경된 문서</h3>
        </>
        :
        <h3 style={{ textAlign: "center" }}>{formData.gnrlAtrzTtl}{sttsCd === "VTW05405" || formData.atrzHistSeCd === "VTW05405" ? " - 결재취소" : ""}</h3>

      }
      <div style={{ display: "flex", marginTop: "3%", marginLeft: '2%', marginRight: '2%' }}>
        <div style={{ flex: 4 }}>
          <table>
            <tr>
              <td style={{fontWeight: 'bold'}}>문서번호</td>
              <td> : </td>
              <td>{formData.atrzDmndSttsCd === "VTW03701" || sttsCd === "VTW05407" || sttsCd === "VTW05406" || sttsCd === "VTW05405" ? "" : formData.elctrnAtrzDocNo}</td>
            </tr>
            <tr>
              <td style={{fontWeight: 'bold'}}>프로젝트</td>
              <td> : </td>
              <td>
                [{prjctData.prjctCdIdntfr}] {prjctData.prjctNm}
              </td>
            </tr>
            <tr>
              <td style={{fontWeight: 'bold'}}>기안자</td>
              <td> : </td>
              <td>{formData.atrzDmndEmpNm == null ? userInfo.empNm : formData.atrzDmndEmpNm}</td>
            </tr>
            <tr>
              <td style={{fontWeight: 'bold'}}>기안일자</td>
              <td> : </td>
              <td>{formData.atrzDmndSttsCd === "VTW03701" || sttsCd === "VTW05407" || sttsCd === "VTW05406" || sttsCd === "VTW05405" ? "" : formData.regDt}</td>
            </tr>
          </table>
        </div>

        <div style={{ flex: 3.5 }}>
          <AtrzLnTable
            atrzLnEmpList={atrzLnEmpList}
            bottomNm={'합의'}
          />
        </div>
      </div>
      <div className="elecAtrzNewReq-title" style={{ marginTop: "2%" }}>
        <div className="dx-fieldset">
          <div className="dx-field">
            <div className="dx-field-label" style={{ width: "5%", fontWeight: 'bold' }}>참 조</div>
            <TextBox
              className="dx-field-value"
              readOnly={true}
              style={{ width: "100%" }}
              value={atrzLnEmpList?.filter((item) => item.approvalCode === 'VTW00706')
                .map(item => item.listEmpFlnm).join('; ')}
            />
          </div>

          <div className="dx-field">
            <div className="dx-field-label" style={{ width: "5%", fontWeight: 'bold' }}>제 목</div>
            {
              sttsCd === "VTW05405" ? 
              <div className="dx-field-label" style={{ width: "120px", fontWeight: 'bold' }}>▶취소결재◀</div>
              : sttsCd === "VTW05406"?
              <div className="dx-field-label" style={{ width: "120px", fontWeight: 'bold' }}>▶결재변경◀</div>
              :
              <></>
            }
            <TextBox
              className="dx-field-value"
              style={{ width: "100%" }}
              value={atrzParam.title}
              onValueChanged={onHandleAtrzTitle}
              readOnly={sttsCd === "VTW05405" || sttsCd === "VTW03702" || sttsCd === "VTW03703" || formData.atrzHistSeCd === "VTW05405" ||  sttsCd === "VTW00801" || sttsCd === "VTW03705" || sttsCd === "VTW00802"? (sttsCd === "VTW05407" ? false : true) : false}
            />
          </div>

          {getAtrzLn &&
            <ApprovalPopup
              visible={popVisible}
              atrzLnEmpList={atrzLnEmpList}
              onHiding={onPopHiding}
            />}

        </div>
      </div>
      <hr className='elecDtlLine' />
    </div>
  );
};

export default ElecAtrzTitleInfo;