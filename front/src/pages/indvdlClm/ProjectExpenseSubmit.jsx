import { useEffect, useState } from "react";
import { Button } from 'devextreme-react/button'
import ApiRequest from "utils/ApiRequest";
import { useModal } from "../../components/unit/ModalContext";

const ProjectExpenseSubmit = ({ selectedItem, validateFields, handleDelete, buttonGroup, getData }) => {
  const [ isComplete, setIsComplete ] = useState(false);
  const { handleOpen } = useModal();
  useEffect(() => {
    if (selectedItem.length > 0 && isComplete) {
      handleOpen("등록되었습니다.");
      getData();
    }
  }, [isComplete]);

  const handleSubmit = async () => {
    const validationResults = await validateFields();

    if (!validationResults.isValid) {
      validationResults.messages.length !== 0 && handleOpen(validationResults.messages.join('\n'));
      return;
    }

    if (!window.confirm("등록하시겠습니까?")) return;

    try {
      let result;
      const ynUpdated = await updateYn();

      if (ynUpdated) {
        result = await insertCtMm();
      }
      if(result) setIsComplete(true);

    } catch (error) {
      console.error("error", error);
    }
  };

  // CARD_USE_DTLS - PRJCT_CT_INPT_PSBLTY_YN: "N"
  const updateYn = async () => {
    try {
      if(selectedItem[0].cardUseSn){
        const updates = selectedItem.map(item => ApiRequest("/boot/common/commonUpdate", [
          { tbNm: "CARD_USE_DTLS" },
          { prjctCtInptPsbltyYn: "N" },
          { cardUseSn: item.cardUseSn }
        ]));
        await Promise.all(updates);
      }
      return true;

    } catch (error) {
      console.error('updateYn error', error);
      return false;
    }
  };

  // [PRJCT_INDVDL_CT_MM, PRJCT_CT_APLY, PRJCT_CT_ATRZ] - insert
  const insertCtMm = async () => {
    const param = selectedItem.map((item) => ({
      ...setParam(item)
    }));

    const updatedData = selectedItem.map(({ utztnDtFormat, ...rest }) => {
      const ctAtrzSeCd = rest.ctAtrzSeCd || "VTW01903";
      return { ...rest, ctAtrzSeCd };
    });
    const allParam = [ {param}, {updatedData} ];

    try{
      const response = await ApiRequest("/boot/indvdlClm/insertPrjctMM", allParam);
      if(response > 0){
        return true; 
      }
    } catch(error) {
      console.log('error', error);
      return false;
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