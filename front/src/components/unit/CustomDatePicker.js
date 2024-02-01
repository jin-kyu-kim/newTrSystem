import { DateBox } from "devextreme-react/date-box";


const CustomDatePicker2 = ({ onSelect, placeholder, value, name, readOnly }) => {
    
    
    return (
        <DateBox
            value={value}
            placeholder={placeholder}
            dateSerializationFormat="yyyyMMdd"
            displayFormat="yyyy-MM-dd"
            type="date"
            onValueChanged={(e) => {
                onSelect({name: name, value: e.value})
            }}
            readOnly={readOnly}
        />
    );
}
export default CustomDatePicker2;