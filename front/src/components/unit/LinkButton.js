import { Button } from "devextreme-react/button";
import { useNavigate } from 'react-router-dom';

const LinkButton = ({ location, name }) => {
    const navigate = useNavigate ();

    const handleClick = () => {
        //페이지 이동
        navigate(location);
      };

return (
    <Button
        width={50}
        text="Contained"
        type="normal"
        stylingMode="outlined"
        onClick={handleClick}
        style={{ margin : '2px' }} // 원하는 스타일 직접 지정
        >
        {name}
    </Button>
    )
}

export default LinkButton;