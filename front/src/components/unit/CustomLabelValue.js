import { TextBox } from "devextreme-react/text-box";
import CustomComboBox from "./CustomComboBox";
import { NumberBox } from "devextreme-react";
import { DateBox } from "devextreme-react/date-box";
import { Validator, RequiredRule, } from "devextreme-react/validator";

const CustomLabelValue = ({ props, onSelect, value, readOnly, onKeyDownEvent, defaultDateValue }) => {
    const placeholder = props.placeholder;
    const required = props.required;

    const labelValue = () => {
        const result = [];
        if(props.type === "TextBox") {
            result.push(
                <TextBox
                    key={props.name}
                    value={value}
                    placeholder={placeholder}
                    showClearButton={true}
                    onKeyDown={onKeyDownEvent}
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
                    key={props.label}
                    label={props.label}
                    props={props.param} 
                    onSelect={onSelect} 
                    onKeyDownEvent={onKeyDownEvent}
                    placeholder={placeholder} 
                    value={value} 
                    readOnly={readOnly}
                    required={required}
                    width={props.width}
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
                    onKeyDown={onKeyDownEvent}
                    readOnly={readOnly}
                    name={props.name}
                    onValueChanged={(e) => {
                        if(e.event && e.event.type === 'dxmousewheel'){
                            e.event.stopPropagation();
                            return;
                        }
                        onSelect({name: props.name, value: e.value})
                    }}
                    format={props.format}
                    max={props.max ? props.max : 2000000000}
                >
                    <Validator>{validate()}</Validator>
                </NumberBox>
                
            )
        } else if (props.type === "DateBox") {
            result.push(
                <DateBox 
                    key={props.name}
                    value={value ? value : defaultDateValue}
                    onKeyDown={onKeyDownEvent}
                    placeholder={props.placeholder}
                    dateSerializationFormat="yyyyMMdd"
                    displayFormat="yyyy-MM-dd"
                    type="date"
                    showClearButton={true}
                    onValueChanged={(e) => {
                        onSelect({name: props.name, value: e.value})
                    }}
                    readOnly={readOnly}
                >
                    <Validator>{validate()}</Validator>
                </DateBox>

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
            {props.required 
                ? <div className="dx-field-label asterisk">{props.label}</div>
                : <div className="dx-field-label">{props.label}</div>
            }
            <div className="dx-field-value">{labelValue()}</div>
        </div>
    );
}
export default CustomLabelValue