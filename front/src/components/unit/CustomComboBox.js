import { useState, useEffect } from "react";

import SelectBox from "devextreme-react/select-box"
import ApiRequest from "../../utils/ApiRequest";

const CustomComboBox = ({props, onSelect, placeholder, value, readOnly}) => {

    const [values, setValues] = useState([]);

    useEffect(() => {
        let param;

        if(props) {
            param = [
                { tbNm: props.tbNm },
                {},
            ];

            getValues(param);
        }
    }, []);

    const getValues = async (param) => {
        try {
            const response = await ApiRequest("/boot/common/commonSelect", param);
            setValues(response);
        } catch(error) {
            console.error(error);
        }
    }   

    return (
        <SelectBox
            key={props.label}
            dataSource={values}
            valueExpr={props.valueExpr}
            displayExpr={props.displayExpr}
            placeholder={placeholder}
            onValueChanged={(e)=> {
                onSelect({name: props.name, value : e.value});
            }}
            searchEnabled={true}
            value={value}
            readOnly={readOnly}
        />
    );

}
export default CustomComboBox;