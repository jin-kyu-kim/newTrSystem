import React, { createContext, useContext, useMemo, useState } from 'react';
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

  const value = useMemo(() => ({
    handleOpen,
    handleClose
  }), []);

  return (
    <ModalContext.Provider value={value}>
      {children}
      <CustomModal open={open} close={handleClose} message={message} onClick={onClick} isStepOne={isStepOne} />
    </ModalContext.Provider>
  );
};