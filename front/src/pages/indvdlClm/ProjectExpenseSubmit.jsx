import { useEffect, useState } from "react";
import { Button } from 'devextreme-react/button'
import ApiRequest from "utils/ApiRequest";

const ProjectExpenseSubmit = ({ selectedItem, sendTbInfo, validateFields, handleDelete, buttonGroup, getData }) => {
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
      getData();
    }
  }, [completedCount]);


  const handleSubmit = async () => {
    const validationResults = await validateFields();
    if (!validationResults.isValid) {
      validationResults.messages.length !== 0 && alert(validationResults.messages.join('\n'));
      return;
    }

    if (!window.confirm("등록하시겠습니까?")) return;

    // try {
    //   const ynUpdated = await updateYn();

    //   if (ynUpdated) {
    //     const mmInserted = await insertMM();
    //     if (mmInserted) await insertValue();
    //   }
    // } catch (error) {
    //   console.error("error", error);
    // }
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
      ...setParam(item),
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
  
    const updatedRowsData = selectedItem.map(({ utztnDtFormat, ...rest }) => rest);
  
    for (const item of updatedRowsData) {
      const atdrnString = item.atdrn.map(person => person.value).join(',');
      const requestBody = [{ ...tbInfo }, { ...item, atdrn: atdrnString, ctAtrzSeCd: "VTW01903" }];
  
      try {
        await ApiRequest("/boot/common/commonInsert", requestBody);
        const maxSn = await getPrjctCtAplySn(item);
        snArray.push(maxSn);

        // 참석자 별도 insert
        for (const person of item.atdrn) {
          const atdrnRes = await ApiRequest("/boot/common/commonInsert", [
              { tbNm: "PRJCT_CT_ATDRN", snColumn: "PRJCT_CT_ATDRN_SN" },
              { 
                prjctCtAplySn: maxSn, atndEmpId: person.key, atndEmpFlnm: person.value,
                ...setParam(item)
              }
          ]);
        }
      } catch (error) {
        console.error("insertValueAndFetchSn error", error);
        break;
      }
    }
    setPrjctCtAplySn(snArray);
  };

  const getPrjctCtAplySn = async (oneRow) => {
    const param = setParam(oneRow, {queryId: "indvdlClmMapper.retrievePrjctCtAplySn"})
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
    let i = 0;

    for (const sn of prjctCtAplySn) {
      const getParam = setParam(selectedItem[i++]);

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

  const setParam = (oneRow, additionalProps) => {
    const baseProps = {
      prjctId: oneRow.prjctId,
      empId: oneRow.empId,
      aplyYm: oneRow.aplyYm,
      aplyOdr: oneRow.aplyOdr,
    };
    return { ...baseProps, ...additionalProps };
  }; 

  return (
    <div style={{marginBottom: '20px'}}>
      {buttonGroup.map((btn, index) => (
        <Button onClick={btn.onClick === 'handleDelete' ? handleDelete : handleSubmit} 
          useSubmitBehavior={true} type={btn.type} text={btn.text} 
          style={{marginRight: '10px'}} key={index} />
      ))}
    </div>
  );
};
export default ProjectExpenseSubmit;