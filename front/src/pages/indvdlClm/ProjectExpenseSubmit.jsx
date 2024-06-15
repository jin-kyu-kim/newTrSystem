import { useEffect, useState } from "react";
import { Button } from 'devextreme-react/button'
import { useModal } from "../../components/unit/ModalContext";
import ApiRequest from "utils/ApiRequest";

const ProjectExpenseSubmit = ({ selectedItem, validateFields, handleDelete, buttonGroup, getData, sendAtrz, ymOdrInfo }) => {
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
    
    try {
      const updatedSelectedItem = selectedItem.map(item => ({
        ...item,
        aplyYm: ymOdrInfo.aplyYm,
        aplyOdr: ymOdrInfo.aplyOdr,
      }));

      let result;
      const ynUpdated = await updateYn(updatedSelectedItem);

      if (ynUpdated) {
        result = await insertCtMm(updatedSelectedItem);
      }
      if(result) setIsComplete(true);

    } catch (error) {
      console.error("error", error);
    }
  };

  // CARD_USE_DTLS - PRJCT_CT_INPT_PSBLTY_YN: "N"
  const updateYn = async (items) => {
    try {
      if(items[0].cardUseSn){
        const updates = items.map(item => ApiRequest("/boot/common/commonUpdate", [
          { tbNm: "CARD_USE_DTLS" },
          { prjctCtInptPsbltyYn: "N" },
          { lotteCardAprvNo: item.lotteCardAprvNo }
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
  const insertCtMm = async (items) => {
    const param = items.map((item) => ({
      ...setParam(item)
    }));

    const updatedData = items.map(({ utztnDtFormat, ...rest }) => {
      const ctStlmSeCd = rest.ctStlmSeCd || "VTW01903";
      return { ...rest, ctStlmSeCd };
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
        <Button onClick={btn.onClick === 'handleDelete' ? () => handleOpen(btn.msg, () => handleDelete())
         : btn.onClick === 'handleSubmit' ? () => handleOpen(btn.msg, handleSubmit, true) 
         : () => sendAtrz(selectedItem) } 
          useSubmitBehavior={true} type={btn.type} text={btn.text} 
          style={{marginRight: '10px'}} key={index} />
      ))}
    </div>
  );
};
export default ProjectExpenseSubmit;