import {Button} from "devextreme-react/button";

const ButtonRender = (button, data, onClick) => {
    return(
        <Button name={button.name} text={button.text} onClick={(e) => {onClick(button, data)}}/>
        
      )
}

export default ButtonRender;