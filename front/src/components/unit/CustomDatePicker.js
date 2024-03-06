import { DateBox } from "devextreme-react/date-box";
import { Validator, RequiredRule } from "devextreme-react/validator";


const CustomDatePicker = ({ onSelect, label, placeholder, value, name, readOnly, required }) => {
    
    
    const validate = () => {
        if(required) {
            return (
                <RequiredRule message={`${label}은 필수 입력 값입니다.`}/>
            )
        }
    }

    return (
        <DateBox
            key={name}
            value={value}
            placeholder={placeholder}
            dateSerializationFormat="yyyyMMdd"
            displayFormat="yyyy-MM-dd"
            type="date"
            onValueChanged={(e) => {
                onSelect({name: name, value: e.value})
            }}
            readOnly={readOnly}
        >
            <Validator>{validate()}</Validator>
        </DateBox>
    );
}
export default CustomDatePicker;