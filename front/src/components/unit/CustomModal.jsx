import { Button } from 'devextreme-react/button';
import { Popup } from "devextreme-react";

const CustomModal = ({ open, close, message, onClick, isStepOne }) => {

    const buttonContainerStyle = {
        marginTop: '50px',
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0 10px'
    };

    const handleOnClick = () => {
        if (isStepOne) {
            onClick();
            close();
        } else {
            onClick();
            close();
        }
    };

    return (
        <Popup
            visible={open}
            onHiding={close}
            width={350}
            height='auto'
            showTitle={false}
            contentRender={() => (
                <div>
                    <div style={{
                        fontSize: '18px',
                        marginTop: '20px',
                        marginBottom: '10px',
                        textAlign: 'center'
                    }}>
                        {message}
                    </div>

                    <div style={buttonContainerStyle}>
                        {onClick !== undefined &&
                            <Button
                                text='확인'
                                stylingMode="contained"
                                type="default"
                                onClick={handleOnClick}
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
        />
    );
}
export default CustomModal;