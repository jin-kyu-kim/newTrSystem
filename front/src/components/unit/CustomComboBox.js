import { useState, useEffect } from "react";

import SelectBox from "devextreme-react/select-box"
import ApiRequest from "../../utils/ApiRequest";
import { Validator, RequiredRule, } from "devextreme-react/validator";

const CustomComboBox = ({props, onSelect, label, placeholder, value, readOnly, required, customParam}) => {

    const [values, setValues] = useState([]);

    useEffect(() => {
        let param;

        if(props) {

            if(props.queryId && !customParam) {
                param = props.queryId
            } else if (props.queryId && customParam) {
                param = customParam
            } else{
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
    
    const validate = () => {
        if(required) {
            return (
                <RequiredRule message={`${label}은 필수 입력 값입니다.`}/>
            )
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
                        props.values.forEach(propName => {
                            onSelect({name: propName, value: selectedItem[propName]});
                        });
                    }
                    else{
                        props.values.forEach(propName => {
                            onSelect({name: propName, value: undefined});
                        });
                    }
                } else {
                    const selectedItem = values.find(item => item[props.valueExpr] === e.value);
   
                    if(props.nameNm && selectedItem){
                        onSelect({name: props.nameNm, value: selectedItem.cdNm});
                    }
                    
                    onSelect({name: props.name, value: e.value});
                }
            }}
            searchEnabled={true}
            value={value}
            readOnly={readOnly}
            showClearButton={true}
        >
            <Validator>{validate()}</Validator>
        </SelectBox>
    );

}
export default CustomComboBox;