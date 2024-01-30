import { TextBox } from "devextreme-react/text-box";
import CustomComboBox from "./CustomComboBox";
import { useEffect } from "react";
import { NumberBox } from "devextreme-react";

const CustomLabelValue = ({props, onSelect}) => {

    const placeholder = props.placeholder

    const test = () => {
        const result = [];
        if(props.type === "TextBox") {
            result.push(
                <TextBox
                    placeholder={placeholder}
                    showClearButton={true}
                    
                />
            )
        } else if (props.type === "ComboBox") {
            result.push(
                <CustomComboBox props={props.param} onSelect={onSelect} placeholder={placeholder} />
            )
        } else if (props.type === "NumberBox") {
            result.push(
                <NumberBox 
                    defaultValue=""
                    placeholder={placeholder}
                    showClearButton={true}
                />
            )
        } else if (props.type === "DateBox") {

        }
        return result;
    }


    return (
        <div className="dx-field">
            <div className="dx-field-label asterisk">{props.label}</div>
            <div className="dx-field-value">
                {test()}
            </div>
        </div>
    );
}
export default CustomLabelValue