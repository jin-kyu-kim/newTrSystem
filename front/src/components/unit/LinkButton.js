import { Button } from "devextreme-react/button";
import { useNavigate } from 'react-router-dom';

const LinkButton = ({ location, name , type, stylingMode}) => {
    const navigate = useNavigate ();

    const handleClick = (e) => {
        navigate(location)
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