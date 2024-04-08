import { useEffect, useState } from "react";
import { Button } from 'devextreme-react/button'
import ApiRequest from "utils/ApiRequest";

const ProjectExpenseCardInsert = ({ selectedItem, sendTbInfo, button }) => {
  const [ completedCount, setCompletedCount ] = useState(0);
  const [ prjctCtAplySn, setPrjctCtAplySn ] = useState([]);

  useEffect(() => {
    if (selectedItem.length !== 0 && prjctCtAplySn.length === selectedItem.length) {
      insertAtrzValue();
    }
  }, [prjctCtAplySn]);

  useEffect(() => {
    if (selectedItem.length > 0 && completedCount === selectedItem.length) {
      alert("등록되었습니다.");
      window.location.reload();
    }
  }, [completedCount]);

  const handleSubmit = async () => {
    if(selectedItem.length === 0) {
      alert('선택된 사용내역이 없습니다.')
      return;
    }
    if (selectedItem.some(item => item.prjctId === null)) {
      alert('프로젝트를 선택해주세요');
      return;
    }
    if (!window.confirm("등록하시겠습니까?")) return;

    try {
      const ynUpdated = await updateYn();
      if (ynUpdated) {
        const mmInserted = await insertMM();

        if (mmInserted) await insertValue();
      }
    } catch (error) {
      console.error("error", error);
    }
  };

  /** CARD_USE_DTLS - PRJCT_CT_INPT_PSBLTY_YN 값 => "N" */
  const updateYn = async () => {
    try {
      const updates = selectedItem.map(item => ApiRequest("/boot/common/commonUpdate", [
        { tbNm: "CARD_USE_DTLS" },
        { prjctCtInptPsbltyYn: "N" },
        { cardUseSn: item.cardUseSn }
      ]));
      await Promise.all(updates);
      return true;
    } catch (error) {
      console.error('updateYn error', error);
      return false;
    }
  };

  /** PRJCT_INDVDL_CT_MM (프로젝트개인비용MM) - insert */
  const insertMM = async () => {
    const param = selectedItem.map((item) => ({
      prjctId: item.prjctId,
      empId: item.empId,
      aplyYm: item.aplyYm,
      aplyOdr: item.aplyOdr,
      ctAtrzCmptnYn: "N",
      mmAtrzCmptnYn: "N",
    }));
    try{
      const res = await ApiRequest("/boot/indvdlClm/insertPrjctMM", param);
      return true;
    } catch(error) {
      console.log('insertMM  error', error);
      return false;
    }
  };

  /** PRJCT_CT_APLY (프로젝트비용신청) - insert */
  const insertValue = async () => {
    const tbInfo = { tbNm: sendTbInfo.tbNm, snColumn: sendTbInfo.snColumn };
    const snArray = []; // SN 값을 저장할 임시 배열
  
    for (const item of selectedItem) {
      const requestBody = [{ ...tbInfo }, { ...item, ctAtrzSeCd: "VTW01903" }];
  
      try {
        await ApiRequest("/boot/common/commonInsert", requestBody);
        const maxSn = await getPrjctCtAplySn();
        snArray.push(maxSn);
      } catch (error) {
        console.error("insertValueAndFetchSn error", error);
        break;
      }
    }
    setPrjctCtAplySn(snArray);
  };

  const getPrjctCtAplySn = async () => {
    const param = setParam(selectedItem, {queryId: "indvdlClmMapper.retrievePrjctCtAplySn"})
    try {
      const response = await ApiRequest("/boot/common/queryIdSearch", param);
      return response[0].prjctCtAplySn;
    } catch (error) {
      console.error("getPrjctCtAplySn error", error);
      return null;
    }
  };

  /** PRJCT_CT_ATRZ (프로젝트비용결재) - insert */
  const insertAtrzValue = async () => {
    const getParam = setParam(selectedItem);

    for (const sn of prjctCtAplySn) {
      const param = [
        { tbNm: sendTbInfo.atrzTbNm },
        { prjctCtAplySn: sn, ...getParam }
      ];
      try {
        await ApiRequest("/boot/common/commonInsert", param);
        setCompletedCount(prev => prev + 1);
      } catch (error) {
        console.error("insertAtrzValue error", error);
        break;
      }
    }
  };

  const setParam = (selectedItem, additionalProps) => {
    const baseProps = {
      prjctId: selectedItem[0].prjctId,
      empId: selectedItem[0].empId,
      aplyYm: selectedItem[0].aplyYm,
      aplyOdr: selectedItem[0].aplyOdr,
    };
    return { ...baseProps, ...additionalProps };
  }; 

  return (<Button style={button} type='normal' text="선택한 사용내역 등록하기" onClick={handleSubmit} />);
};
export default ProjectExpenseCardInsert;