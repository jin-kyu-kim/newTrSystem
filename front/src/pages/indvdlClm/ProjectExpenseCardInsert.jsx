import { useEffect, useState } from "react";
import { Button } from 'devextreme-react/button'
import ApiRequest from "utils/ApiRequest";

const ProjectExpenseCardInsert = ({ selectedItem, sendTbInfo, button }) => {
  const [completedCount, setCompletedCount] = useState(0);
  const [prjctCtAplySn, setPrjctCtAplySn] = useState(null);

  useEffect(() => {
    if (prjctCtAplySn !== undefined && prjctCtAplySn !== null) insertAtrzValue();
  }, [prjctCtAplySn]);

  useEffect(() => {
    if (selectedItem.length > 0 && completedCount === selectedItem.length) {
      window.location.reload();
      alert("등록되었습니다.");
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
    else{ updateYn(); }
  };

  /** CARD_USE_DTLS - PRJCT_CT_INPT_PSBLTY_YN 값 => "N" */
  const updateYn = async () => {
    try{
      let res;
      for (const item of selectedItem) {
        res = await ApiRequest("/boot/common/commonUpdate", [
          { tbNm: "CARD_USE_DTLS" },
          { prjctCtInptPsbltyYn: "N" },
          { cardUseSn: item.cardUseSn }
        ]);
      }
      if(res === 1) insertMM();
    } catch(error){
      console.log('error', error);
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
      if(res === 1) insertValue();
    } catch(error) {
      console.log('error', error);
    }
  };

  /** PRJCT_CT_APLY (프로젝트비용신청) - insert */
  const insertValue = async () => {
    const tbInfo = { tbNm: sendTbInfo.tbNm, snColumn: sendTbInfo.snColumn };
    const newArray = selectedItem.map(({ aprvNo, cardUseSn, ...rest }) => ([
      { ...tbInfo }, { ...rest, ctAtrzSeCd: "VTW01903" }
    ]));
    try {
      let res;
      for (let i = 0; i < newArray.length; i++) {
        res = await ApiRequest("/boot/common/commonInsert", newArray[i]);
        if(res === 1) getPrjctCtAplySn();
      }
    } catch (error) {
      console.error("API 요청 에러:", error);
    }
  };

  const getPrjctCtAplySn = async () => {
    const param = setParam(selectedItem, {queryId: "indvdlClmMapper.retrievePrjctCtAplySn"})
    try {
      const response = await ApiRequest("/boot/common/queryIdSearch", param);
      setPrjctCtAplySn(response[0].prjctCtAplySn);
    } catch (error) {
      console.log(error);
    }
  };

  /** PRJCT_CT_ATRZ (프로젝트비용결재) - insert */
  const insertAtrzValue = async () => {
    const atrzParams = { tbNm: sendTbInfo.atrzTbNm };
    const param = setParam(selectedItem, {prjctCtAplySn: prjctCtAplySn})
    try {
      const res = await ApiRequest("/boot/common/commonInsert", [
        {...atrzParams}, {...param}
      ]);
      setCompletedCount(prev => prev + 1);
    } catch (error) {
      console.error("API 요청 에러:", error);
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