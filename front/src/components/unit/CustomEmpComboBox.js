import { useState, useEffect } from 'react';
import SelectBox from "devextreme-react/select-box";
import ApiRequest from "../../utils/ApiRequest";

const CustomEmpComboBox = ({value, readOnly, onValueChange, useEventBoolean, showClearButton}) => {
    const [searchEmpParam, setSearchEmpParam] = useState({ queryId: "humanResourceMngMapper.retrieveEmpList", searchType: "emp" });
    const [selectEmpValue, setSelectEmpValue] = useState([]);

    useEffect(() => {
        if (!Object.values(searchEmpParam).every((value) => value === "")) {
            pageHandle(searchEmpParam);
        };
    }, [searchEmpParam])

    const pageHandle = async (initParam) => {
        try {
            if (initParam.searchType == "emp") setSelectEmpValue(await ApiRequest("/boot/common/queryIdSearch", initParam));
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <SelectBox
            placeholder="성명"
            dataSource={selectEmpValue}
            value={value}
            readOnly={readOnly}
            searchEnabled={true}
            showClearButton={showClearButton}
            displayExpr="listEmpFlnm"
            valueExpr="empId"
            stylingMode="underlined"
            onValueChange={(e) => {
                // valueExpr로 필터링 되기때문에 기존 데이터에서 전달할 값 찾아서 추가
                const selectItemValue = [];
                const selectedItem = selectEmpValue.find(item => item.empId === e);

                if(selectedItem){
                    selectItemValue.push({
                        empId: selectedItem.empId,
                        empno: selectedItem.empno,
                        empFlnm: selectedItem.empFlnm,
                        jbpsNm: selectedItem.jbpsNm,
                        listEmpFlnm: selectedItem.listEmpFlnm
                    });
                } else {
                    selectItemValue.push({
                        empId: "",
                        empno: ""
                    });
                }
                
                if(useEventBoolean == true){
                    onValueChange(selectItemValue);
                }

            }} />
    )
}

export default CustomEmpComboBox;