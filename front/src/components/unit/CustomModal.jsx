import { Button } from 'devextreme-react/button';
import { Box, Typography } from '@mui/material';
import Modal from '@mui/material/Modal';

const CustomModal = ({ open, close, message, onClick }) => {

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '0px solid #000',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        p: 3,
        pt: 5,
        pb: 5,
    };
    
    const buttonStyle = {
        mt: 5,
        display: 'flex',
        justifyContent: 'space-between',
        px: 2
    };

    const handleConfirm = () => {
        if (onClick) {
            onClick();
        }
        close();
    };

    return (
        <Modal
            open={open}
            onClose={close}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2" textAlign="center" >
                    {message}
                </Typography>

                <Box sx={buttonStyle}>
                    {onClick !== undefined && 
                        <Button
                            text='확인'
                            stylingMode="contained"
                            type="default"
                            onClick={handleConfirm}
                            style={{ width: '45%', backgroundColor: 'rgb(128, 184, 245)', color: 'white' }}
                        /> }
                    
                    <Button
                        text={onClick !== undefined ? '취소' : '확인'}
                        stylingMode="contained"
                        type="default"
                        onClick={close}
                        style={{ width: onClick !== undefined ? '45%' : '100%', color: 'white',
                            backgroundColor: onClick !== undefined ? 'rgb(241, 150, 150)' : 'rgb(187, 200, 247)' }}
                    />
                </Box>
            </Box>
        </Modal>
    );
}
export default CustomModal;