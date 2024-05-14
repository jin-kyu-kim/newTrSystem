import { Button } from 'devextreme-react/button';
import { Popup } from "devextreme-react";

const CustomModal = ({ open, close, message, onClick, isStepOne }) => {

    const popupStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '400px',
        height: 'auto',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        background: '#fff',
        padding: '20px'
    };

    const buttonContainerStyle = {
        marginTop: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0 10px'
    };

    const handleOnClick = () => {
        onClick();
        if (isStepOne) {
            close();
        }
    };

    return (
        <Popup
            visible={open}
            onHiding={close}
            width={400}
            height="auto"
            showTitle={false}
            contentRender={() => (
                <div>
                    <div style={{
                        fontSize: '18px',
                        marginBottom: '10px'
                    }}>
                        {message}
                    </div>

                    <div style={buttonContainerStyle}>
                        {onClick !== undefined &&
                            <Button
                                text='확인'
                                stylingMode="contained"
                                type="default"
                                onClick={() => handleOnClick()}
                                style={{
                                    width: '45%',
                                    backgroundColor: 'rgb(128, 184, 245)',
                                    color: 'white'
                                }}
                            />}
                        <Button
                            text={onClick !== undefined ? '취소' : '확인'}
                            stylingMode="contained"
                            type="default"
                            onClick={close}
                            style={{
                                width: onClick !== undefined ? '45%' : '100%',
                                backgroundColor: onClick !== undefined ? 'rgb(241, 150, 150)' : 'rgb(187, 200, 247)',
                                color: 'white'
                            }}
                        />
                    </div>
                </div>
            )}
            style={popupStyle}
        />
    );
}
export default CustomModal;