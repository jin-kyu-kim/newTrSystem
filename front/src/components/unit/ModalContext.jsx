import React, { createContext, useContext, useState } from 'react';
import CustomModal from './CustomModal';

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {

  const [ open, setOpen ] = useState(false);
  const [ message, setMessage ] = useState('');
  const [ onClick, setOnClick ] = useState(undefined);
  const [ isStepOne, setIsStepOne ] = useState(false);

  const handleClose = () => setOpen(false);
  
  const handleOpen = (msg, onClickAction, closeMode) => {
    setOpen(true);
    setMessage(msg);
    setOnClick(() => onClickAction);
    setIsStepOne(closeMode);
  };

  return (
    <ModalContext.Provider value={{ handleOpen, handleClose }}>
      {children}
      <CustomModal open={open} close={handleClose} message={message} onClick={onClick} isStepOne={isStepOne} />
    </ModalContext.Provider>
  );
};