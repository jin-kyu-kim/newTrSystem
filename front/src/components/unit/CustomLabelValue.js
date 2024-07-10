import { useEffect } from 'react';
import { TextBox } from "devextreme-react/text-box";
import { DateBox } from "devextreme-react/date-box";
import { NumberBox } from "devextreme-react";
import { Validator, RequiredRule, } from "devextreme-react/validator";
import CustomComboBox from "./CustomComboBox";

const CustomLabelValue = ({ props, onSelect, value, readOnly, defaultDateValue }) => {
    const placeholder = props.placeholder;
    const required = props.required;

    useEffect(() => { // 날짜일 경우 default값이 있으면 setState
        if (props.type === "DateBox" && defaultDateValue) {
            onSelect({ name: props.name, value: defaultDateValue });
        }
    }, [defaultDateValue]);

    const labelValue = () => {
        const result = [];

        if(props.type === "TextBox") {
            result.push(
                <TextBox
                    key={props.name}
                    value={value}
                    placeholder={placeholder}
                    showClearButton={true}
                    onValueChanged={(e) => {
                        onSelect({name: props.name, value: e.value})
                    }} 
                    readOnly={readOnly}
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
                    value={value}
                    key={props.name}
                    defaultValue={0}
                    placeholder={placeholder}
                    showClearButton={true}
                    readOnly={readOnly}
                    name={props.name}
                    onValueChanged={(e) => {
                        if(e.event && e.event.type === 'dxmousewheel'){
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