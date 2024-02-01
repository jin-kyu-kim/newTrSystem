import { TextBox } from "devextreme-react/text-box";
import CustomComboBox from "./CustomComboBox";
import { useEffect } from "react";
import { NumberBox } from "devextreme-react";
import CustomDatePicker from "./CustomDatePicker";

const CustomLabelValue = ({props, onSelect, value, readOnly}) => {

    const placeholder = props.placeholder

    const test = () => {
        const result = [];
        if(props.type === "TextBox") {
            result.push(
                <TextBox
                    placeholder={placeholder}
                    showClearButton={true}
                    value={value}
                    readOnly={readOnly}
                    onValueChanged={(e) => {
                        onSelect({name: props.name, value: e.value})
                    }}
                />
            )
        } else if (props.type === "ComboBox") {
            result.push(
                <CustomComboBox 
                    props={props.param} 
                    onSelect={onSelect} 
                    placeholder={placeholder} 
                    value={value} 
                    readOnly={readOnly}
                />
            )
        } else if (props.type === "NumberBox") {
            result.push(
                <NumberBox 
                    defaultValue=""
                    placeholder={placeholder}
                    showClearButton={true}
                    value={value}
                    readOnly={readOnly}
                    name={props.name}
                    onValueChanged={(e) => {
                        onSelect({name: props.name, value: e.value})
                    }}
                />
            )
        } else if (props.type === "DateBox") {
            result.push(
                <CustomDatePicker
                    placeholder={placeholder}
                    value={value}
                    name={props.name}
                    readOnly={readOnly}
                    onSelect={onSelect}
                />
            )
        }
        return result;
    }


    return (
        <div className="dx-field">
            {props.required ? 
            <div className="dx-field-label asterisk">{props.label}</div>
            :
            <div className="dx-field-label">{props.label}</div>
            }
            <div className="dx-field-value">
                {test()}
            </div>
        </div>
    );
}
export default CustomLabelValue