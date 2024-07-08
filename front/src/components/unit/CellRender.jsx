import React, { useEffect, useState } from "react";
import { TextBox } from 'devextreme-react';
import Button from "devextreme-react/button";
import TagBox from 'devextreme-react/tag-box';
import SelectBox from "devextreme-react/select-box";
import NumberBox from 'devextreme-react/number-box';
import ToggleButton from 'pages/sysMng/ToggleButton';

const CellRender = ({ col, props, handleYnVal, onBtnClick, cellRenderConfig, validateNumberBox }) => {
    const [ isChangeData, setIsChangeData ] = useState(false);
    const [ initialPrjctIdValue, setInitialPrjctIdValue ] = useState(null);
    const [ initialExpensCdValue, setInitialExpensCdValue ] = useState(null);
    const { getCdList, isPrjctIdSelected, hasError, chgPlaceholder, comboList, cdList, onTempInsert,
        expensCd, setValidationErrors, setComboBox, selectedItem, setSelectedItem } = cellRenderConfig ?? {};
    const [ prevExpensCd, setPrevExpensCd ] = useState(expensCd);

    useEffect(() => {
        if (col.cellType === 'selectBox' && col.key === 'prjctId') {
            const dataSource = comboList[col.key] || [];
            const value = dataSource.find(item => item.prjctId === props.data.prjctId);
            setInitialPrjctIdValue(value);
        }
    }, [comboList, props.data.prjctId, col.key, col.cellType]);

    useEffect(() => {
        if (col.cellType === 'selectBox' && col.key === 'expensCd') {
            const dataSource = cdList[props.data.lotteCardAprvNo] || [];
            const value = dataSource.find(item => item.expensCd === props.data.expensCd);
            setInitialExpensCdValue(value);
            setPrevExpensCd(expensCd)
        }
    }, [cdList, props.data.expensCd, props.data.lotteCardAprvNo, col.key, col.cellType]);

    const updateSelectedItem = (updatedData) => {
        const updatedSelectedItem = selectedItem.map(item =>
            item.lotteCardAprvNo === updatedData.lotteCardAprvNo ? { ...item, ...updatedData } : item
        );
        setSelectedItem(updatedSelectedItem);
    };
    
    const handleKeyDown = (e) => {
        if(['ArrowUp', 'ArrowDown'].includes(e.event.originalEvent.key)) e.event.stopPropagation();
    };

    useEffect(() => {
        if (col.cellType === 'selectBox' && col.key === 'expensCd') {
            const prevCd = prevExpensCd[props.data.lotteCardAprvNo]; // 기존값
            const newCd = expensCd[props.data.lotteCardAprvNo] // 변경값

            if(prevCd !== newCd){ // 비용코드값 변경이 있을때
                if(newCd === 'VTW04531') { // TagBox로 변경될 경우
                    props.data.atdrn = [];
                } else if(prevCd === 'VTW04531'){ // TagBox -> TextBox로 변경될 경우
                    props.data.atdrn = null;
                }
            }
            updateSelectedItem(props.data);
            onTempInsert({key: 'atdrn'}, props.data.atdrn, props)
        }
    }, [props.data.expensCd]);


    if (col.cellType === 'button') {
        return (<Button text={col.button.text} name={col.button.name} type={col.button.type}
            onClick={() => onBtnClick(col.button, props)} />)

    } else if (col.cellType === 'toggle') {
        return (<ToggleButton callback={handleYnVal} data={props} colData={col} />);

    } else if (col.cellType === 'selectBox') {
        const value = col.key === 'prjctId' ? initialPrjctIdValue : initialExpensCdValue;
        return (
            <SelectBox
                dataSource={getCdList ? (col.key === 'prjctId' ? comboList[col.key] : cdList[props.data.lotteCardAprvNo]) : comboList[col.key]}
                displayExpr={col.displayExpr}
                keyExpr={col.valueExpr}
                value={value} // 객체 값 설정
                placeholder={col.placeholder}
                searchEnabled={true}
                showClearButton={true}
                onValueChanged={(e) => {
                    setComboBox(e.value, props, col);
                }}
                onFocusOut={onTempInsert && (() => onTempInsert(col, props.data[col.key], props))}
                disabled={col.key === 'expensCd' && !isPrjctIdSelected[props.data.lotteCardAprvNo]}
            />
        );
    } else if (col.cellType === 'textBox' && col.key === 'atdrn' && expensCd[props.data.lotteCardAprvNo] === 'VTW04531') {
        return (
            <TagBox
                dataSource={comboList['emp']}
                placeholder={chgPlaceholder ? chgPlaceholder(col, props.data.lotteCardAprvNo) : col.placeholder}
                searchEnabled={true}
                showClearButton={true}
                showSelectionControls={true}
                displayExpr='displayValue'
                value={Array.isArray(props.data[col.key]) && props.data[col.key]}
                onFocusOut={onTempInsert && (() => onTempInsert(col, props.data[col.key], props))}
                style={{ backgroundColor: hasError && hasError(props.data.lotteCardAprvNo, col.key) ? '#FFCCCC' : '', minWidth: '190px' }}
                onValueChanged={(newValue) => {
                    props.data[col.key] = newValue.value;
                    updateSelectedItem(props.data);
                    hasError && setValidationErrors(prevErrors => prevErrors.filter(error => !(error.lotteCardAprvNo === props.data.lotteCardAprvNo && error.field === col.key)));
                }}
            />
        );
    } else if (col.cellType === 'textBox') {
        return (
            <TextBox
                name={col.key}
                value={props.data[col.key]}
                onFocusOut={onTempInsert && (() => onTempInsert(col, props.data[col.key], props))}
                placeholder={chgPlaceholder ? chgPlaceholder(col, props.data.lotteCardAprvNo) : col.placeholder}
                style={{ backgroundColor: hasError && hasError(props.data.lotteCardAprvNo, col.key) ? '#FFCCCC' : '' }}
                onValueChanged={(newValue) => {
                    props.data[col.key] = newValue.value;
                    updateSelectedItem(props.data);
                    hasError && setValidationErrors(prevErrors => prevErrors.filter(error => !(error.lotteCardAprvNo === props.data.lotteCardAprvNo && error.field === col.key)));
                }} >
            </TextBox>
        );
    } else if (col.cellType === 'fileCell') {
        let atchList = props?.data.atchmnfl;
        const fileDir = atchList && atchList[0]?.fileStrgCours ? atchList[0]?.fileStrgCours.substring(8) : null;

        if (atchList != null) {
            return (<div>
                {atchList.map((item, index) => (
                    <div key={index} style={{ whiteSpace: 'pre-wrap' }}>
                        <a href={`${fileDir}/${item.strgFileNm}`} download={item.realFileNm}>{item.realFileNm}</a>
                    </div>
                ))}
            </div>);
        }
    } else if (col.cellType === 'numberBox') {
        return (
            <NumberBox
                onKeyDown={handleKeyDown}
                name={col.key}
                format="#,##0"
                value={props.data[col.key]}
                onFocusOut={onTempInsert && (() => onTempInsert(col, props.data[col.key], props))}
                placeholder={chgPlaceholder ? chgPlaceholder(col, props.data.lotteCardAprvNo) : col.placeholder}
                style={{ backgroundColor: hasError && hasError(props.data.lotteCardAprvNo, col.key) ? '#FFCCCC' : '', minWidth: '100px' }}
                onValueChanged={(newValue) => {
                    if(newValue.event && newValue.event.type === 'dxmousewheel'){
                        newValue.event.stopPropagation();
                        return;
                    }
                    hasError && setValidationErrors(prevErrors => prevErrors.filter(error => !(error.lotteCardAprvNo === props.data.lotteCardAprvNo && error.field === col.key)));
                    if (validateNumberBox) {
                        if (validateNumberBox(props.data, newValue.value)) {
                            props.data[col.key] = newValue.value
                            setIsChangeData(!isChangeData)
                        }
                    } else {
                        props.data[col.key] = newValue.value
                        setIsChangeData(!isChangeData)
                    }
                }}
            />
        )
    }
}
export default CellRender;