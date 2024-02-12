import { Popup } from "devextreme-react";
import ProjectRegist from "../../pages/project/manage/ProjectRegist";


const CustomPopup = ({ props, children, handleClose, visible }) => {

    return (
        <Popup
        width={props.width}
        height={props.height}
        visible={visible}
        onHiding={handleClose}
        showCloseButton={true}
        title={props.title}
        
        >
            { children }
        </Popup>
    );
}
export default CustomPopup;