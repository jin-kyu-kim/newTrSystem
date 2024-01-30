import { useState, useEffect } from "react";

import SelectBox from "devextreme-react/select-box"
import ApiRequest from "../../utils/ApiRequest";

const CustomComboBox = ({props, onSelect, placeholder}) => {


    const [values, setValues] = useState([]);

    useEffect(() => {
        // const [name, setName] = useState([]);
        let param;

        console.log(props);
        if(props) {
            // setName(props.tbNm);
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

    // console.log(values);

    return (
        <SelectBox
            dataSource={values}
            valueExpr={props.valueExpr}
            displayExpr={props.displayExpr}
            placeholder={placeholder}
            onValueChanged={(e)=> {
                onSelect({name: props.valueExpr, value : e.value});
            }}
        />
    );

}
export default CustomComboBox;