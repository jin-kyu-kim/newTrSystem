import React, { useEffect, useState } from "react";
import { Button } from "devextreme-react/button";
import { TextBox } from "devextreme-react/text-box";
import AtrzLnTable from "components/unit/AtrzLnTable";
import ApprovalPopup from "components/unit/ApprovalPopup";
import { useCookies } from 'react-cookie';

const ElecAtrzTitleInfo = ({ sttsCd, atrzLnEmpList, getAtrzLn, contents, onClick, formData, prjctData, onHandleAtrzTitle, atrzParam, deptId }) => {
  const [popVisible, setPopVisible] = useState(false);
  const [cookies] = useCookies(["userInfo", "userAuth", "deptInfo"]);
  const [deptNm, setDeptNm] = useState("");

  const onAtrzLnPopup = async () => {
    setPopVisible(true);
  }

  const onPopHiding = async (aprvrEmpList) => {
    setPopVisible(false);
    getAtrzLn(aprvrEmpList)
  }

  const setButtons = () => {
    let buttonsToRender;
    if (onHandleAtrzTitle) {
      buttonsToRender = contents; // 기안 작성페이지의 경우 모든 contents 렌더
    } else {
      const defaultButtons = ['print', 'docHist'];
      const buttonIdToShow = {
        'VTW00801': ['aprv', 'rjct', 'print', 'docHist'],
        'VTW03701': ['reAtrz', 'print', 'docHist'],
      };
      const currentButtons = buttonIdToShow[sttsCd] || defaultButtons;
      buttonsToRender = contents.filter(item => currentButtons.includes(item.id));
    }

    return buttonsToRender.map((item, index) => (
      <Button id={item.id} text={item.text} type={item.type} style={{ marginRight: '3px' }} 
       key={index} onClick={item.id === 'onAtrzLnPopup' ? onAtrzLnPopup : onClick} />
    ));
  };

    useEffect(() => {
      if(onHandleAtrzTitle){
        const deptList = cookies.deptInfo;
        const dept = deptList.find(item => item.deptId === deptId);
        setDeptNm(dept.deptNm);
      }
    }, []);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-start" }}>
        <div style={{ float: "left", marginRight: "auto" }}>로고</div>
        <div style={{ display: "inline-block" }}>{setButtons()}</div>
      </div>

      <h3 style={{ textAlign: "center" }}>{formData.gnrlAtrzTtl}</h3>
      <div style={{ display: "flex", marginTop: "20px", marginLeft: "90px", fontSize: '18px' }}>
        <div style={{ flex: 4 }}>
          <table>
            <tr>
              <td>문서번호</td>
              <td> : </td>
              <td>{formData.elctrnAtrzId}</td>
            </tr>
            <tr>
              <td>프로젝트</td>
              <td> : </td>
              <td>
                [{prjctData.prjctCdIdntfr}] {prjctData.prjctNm}
              </td>
            </tr>
            <tr>
              <td>기안자</td>
              <td> : </td>
              <td>{formData.deptNm == null ? deptNm : formData.deptNm} / {formData.atrzDmndEmpNm == null ? cookies.userInfo.empNm : formData.atrzDmndEmpNm}</td>
            </tr>
            <tr>
              <td>기안일자</td>
              <td> : </td>
              <td>{formData.regDt}</td>
            </tr>
          </table>
        </div>

        <div style={{ flex: 3, marginRight: "50px" }}>
          <AtrzLnTable
            atrzLnEmpList={atrzLnEmpList}
            bottomNm={'합의'}
          />
        </div>
      </div>
      <div className="elecAtrzNewReq-title" style={{ marginTop: "20px" }}>
        <div className="dx-fieldset">
          <div className="dx-field">
            <div className="dx-field-label" style={{ width: "5%" }}>참 조</div>
            <TextBox
              className="dx-field-value"
              readOnly={true}
              style={{ width: "95%" }}
              value={atrzLnEmpList.filter((item) => item.approvalCode === 'VTW00706')
                .map(item => item.listEmpFlnm).join('; ')}
            />
          </div>

          <div className="dx-field">
            <div className="dx-field-label" style={{ width: "5%" }}>제 목</div>
            <TextBox
              className="dx-field-value"
              style={{ width: "95%" }}
              value={atrzParam.title}
              onValueChanged={onHandleAtrzTitle}
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
      <hr />
    </>
  );
};

export default ElecAtrzTitleInfo;