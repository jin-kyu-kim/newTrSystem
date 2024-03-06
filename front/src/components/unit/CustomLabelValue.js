import { TextBox } from "devextreme-react/text-box";
import CustomComboBox from "./CustomComboBox";
import { useEffect } from "react";
import { NumberBox } from "devextreme-react";
import CustomDatePicker from "./CustomDatePicker";
import { Validator, RequiredRule, } from "devextreme-react/validator";

const CustomLabelValue = ({props, onSelect, value, readOnly}) => {

    const placeholder = props.placeholder;
    const required = props.required;

    const labelValue = () => {
        const result = [];
        if(props.type === "TextBox") {
            result.push(
                <TextBox
                    key={props.name}
                    placeholder={placeholder}
                    showClearButton={true}
                    value={value}
                    readOnly={readOnly}
                    onValueChanged={(e) => {
                        onSelect({name: props.name, value: e.value})
                    }}
                >
                    <Validator>{validate()}</Validator>
                </TextBox>
            )
        } else if (props.type === "ComboBox") {
            result.push(
                <CustomComboBox 
                    label={props.label}
                    props={props.param} 
                    onSelect={onSelect} 
                    placeholder={placeholder} 
                    value={value} 
                    readOnly={readOnly}
                    required={required}
                />
            )
        } else if (props.type === "NumberBox") {
            result.push(
                <NumberBox
                    key={props.name}
                    defaultValue={0}
                    placeholder={placeholder}
                    showClearButton={true}
                    value={value}
                    readOnly={readOnly}
                    name={props.name}
                    onValueChanged={(e) => {
                        onSelect({name: props.name, value: e.value})
                    }}
                >
                    <Validator>{validate()}</Validator>
                </NumberBox>
                
            )
        } else if (props.type === "DateBox") {
            result.push(
                <CustomDatePicker
                    key={props.name}
                    label={props.label}
                    placeholder={placeholder}
                    value={value}
                    name={props.name}
                    readOnly={readOnly}
                    onSelect={onSelect}
                    required={required}
                />
            )
        }
        return result;
    }

    const validate = () => {
        if(props.required) {
            return (
                <RequiredRule message={`${props.label}은 필수 입력 값입니다.`}/>
            )
        }
    }

    return (
        <div className="dx-field">
            {props.required ? 
            <div className="dx-field-label asterisk">{props.label}</div>
            :
            <div className="dx-field-label">{props.label}</div>
            }
            <div className="dx-field-value">
                {labelValue()}
            </div>
        </div>
    );
}
export default CustomLabelValue