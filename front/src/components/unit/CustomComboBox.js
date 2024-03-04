import { useState, useEffect } from "react";

import SelectBox from "devextreme-react/select-box"
import ApiRequest from "../../utils/ApiRequest";

const CustomComboBox = ({props, onSelect, placeholder, value, readOnly}) => {

    const [values, setValues] = useState([]);

    useEffect(() => {
        let param;

        if(props) {

            if(props.queryId) {
                param = props.queryId
            }else{
                param = [
                    { tbNm: props.tbNm },
                    props.condition ? props.condition : {}
                ];
            }
            getValues(param);
        }
    }, []);

    const getValues = async (param) => {
        let response;

        try {
            if(props.queryId) {
                response = await ApiRequest("/boot/common/queryIdSearch", param);
            }else{
                response = await ApiRequest("/boot/common/commonSelect", param);
            }
            setValues(response);

        } catch(error) {
            console.error(error);
        }
    }   

    return (
        <SelectBox
            key={props.name}
            dataSource={values}
            valueExpr={props.valueExpr}
            displayExpr={props.displayExpr}
            placeholder={placeholder}
            onValueChanged={(e)=> {
                if(props.queryId) {
                    const selectedItem = values.find(item => item[props.name] === e.value);
                    if(selectedItem) {
                        [props.name, props.name2, props.name3].forEach(propName => {
                            onSelect({name: propName, value: selectedItem[propName]});
                        });
                    }
                } else {
                    onSelect({name: props.name, value: e.value});
                }
            }}
            searchEnabled={true}
            value={value}
            readOnly={readOnly}
            showClearButton={props.clearButton}
        />
    );

}
export default CustomComboBox;