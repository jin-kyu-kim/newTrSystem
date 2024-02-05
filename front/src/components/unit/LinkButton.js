import { Button } from "devextreme-react/button";
import { useNavigate } from 'react-router-dom';

const LinkButton = ({ name , type, stylingMode, location, prjctId}) => {
    const navigate = useNavigate ();

    const handleClick = (e) => {
        navigate(location,
            {
        state: { prjctId: prjctId },
        })
      };

return (
    <Button
        width={50}
        text="Contained"
        type={type}
        stylingMode={stylingMode}
        onClick={handleClick}
        style={{ margin : '2px' }} 
        >
        {name}
    </Button>
    )
}

export default LinkButton;