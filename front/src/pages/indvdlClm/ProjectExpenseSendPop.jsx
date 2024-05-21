import { Popup } from "devextreme-react/popup";
import { Button } from "@mui/material";
import { useNavigate } from 'react-router-dom';

const ProjectExpenseSendPop = ({ visible, onPopHiding, selectedItem, btnName }) => {
    const navigate = useNavigate();
    
    const onClickBtn = (btnNm) => {
        const formData = {
            selectedData: selectedItem,
            elctrnAtrzTySeCd: 'VTW04907',
            gnrlAtrzTtl: btnNm
        }
        navigate('/elecAtrz/ElecAtrzNewReq', {state: {prjctId: selectedItem[0]?.prjctId, formData: formData}})
    }

    const buttonContainerStyle = {
        marginTop: '30px',
        display: 'flex',
        justifyContent: 'center',
        gap: '20px'
    };

    const buttonStyle = {
        width: '150px',
        height: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px',
        fontWeight: 'bold'
    };

    const content = () => {
        return (
            <div style={buttonContainerStyle}>
                {btnName.map(btnNm => (
                    <Button 
                    variant='contained' 
                    color='warning'
                    sx={buttonStyle}
                    onClick={() => onClickBtn(btnNm)}
                >
                    {btnNm}
                </Button>
                ))}
            </div>
        )
    }

    return (
        <Popup
            visible={visible}
            onHiding={onPopHiding}
            closeOnOutsideClick={true}
            showTitle={false}
            width={350}
            height={200}
            contentRender={content}
        />
    )
}
export default ProjectExpenseSendPop;