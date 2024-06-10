import React, { useState } from "react";
import Button from "devextreme-react/button";
import TagBox from 'devextreme-react/tag-box';
import SelectBox from "devextreme-react/select-box";
import NumberBox from 'devextreme-react/number-box';
import ToggleButton from 'pages/sysMng/ToggleButton';
import { TextBox } from 'devextreme-react';

const CellRender = ({ col, props, handleYnVal, onBtnClick, cellRenderConfig, validateNumberBox }) => {
    const [isChangeData, setIsChangeData] = useState(false);

    const { getCdList, isPrjctIdSelected, hasError, chgPlaceholder, comboList, cdList,
        expensCd, setValidationErrors, setComboBox } = cellRenderConfig ?? {};

    const onKeyDownEvent = (e) => {
        if(e.event.originalEvent.key === 'Enter'){
            e.event.stopPropagation();
        }
    }

    if (col.cellType === 'button') {
        return (<Button text={col.button.text} name={col.button.name} type={col.button.type}
            onClick={() => onBtnClick(col.button, props)} />)

    } else if (col.cellType === 'toggle') {
        return (<ToggleButton callback={handleYnVal} data={props} colData={col} />);

    } else if (col.cellType === 'selectBox') {
        return (
            <SelectBox
                dataSource={getCdList ? (col.key === 'prjctId' ? comboList[col.key] : cdList[props.data.cardUseSn]) : comboList[col.key]}
                displayExpr={col.displayExpr}
                onKeyDown={onKeyDownEvent}
                keyExpr={col.valueExpr}
                placeholder={col.placeholder}
                searchEnabled={true}
                showClearButton={true}
                onValueChanged={(e) => {
                    setComboBox(e.value, props, col);
                }}
                disabled={col.key === 'expensCd' && !isPrjctIdSelected[props.data.cardUseSn]}
            />
        );
    } else if (col.cellType === 'textBox' && col.key === 'atdrn' && expensCd[props.data.cardUseSn] === 'VTW04531') {
        return (
            <TagBox
                dataSource={comboList['emp']}
                placeholder={chgPlaceholder ? chgPlaceholder(col, props.data.cardUseSn) : col.placeholder}
                onKeyDown={onKeyDownEvent}
                searchEnabled={true}
                showClearButton={true}
                showSelectionControls={true}
                displayExpr='displayValue'
                applyValueMode="useButtons"
                style={{ backgroundColor: hasError && hasError(props.data.cardUseSn, col.key) ? '#FFCCCC' : '' }}
                onValueChanged={(newValue) => {
                    props.data[col.key] = newValue.value
                    hasError && setValidationErrors(prevErrors => prevErrors.filter(error => !(error.cardUseSn === props.data.cardUseSn && error.field === col.key)));
                }}
            />
        );
    } else if (col.cellType === 'textBox') {
        return (
            <TextBox
                name={col.key}
                onKeyDown={onKeyDownEvent}
                value={props.data[col.key]}
                placeholder={chgPlaceholder ? chgPlaceholder(col, props.data.cardUseSn) : col.placeholder}
                style={{ backgroundColor: hasError && hasError(props.data.cardUseSn, col.key) ? '#FFCCCC' : '' }}
                onValueChanged={(newValue) => {
                    props.data[col.key] = newValue.value
                    hasError && setValidationErrors(prevErrors => prevErrors.filter(error => !(error.cardUseSn === props.data.cardUseSn && error.field === col.key)));
                }} >
            </TextBox>
        );
        
    } else if (col.cellType === 'fileCell') {
        let atchList = props?.data.atchmnfl;
        const fileDir = atchList[0]?.fileStrgCours ? atchList[0]?.fileStrgCours.substring(8) : null;

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
                name={col.key}
                format="#,##0"
                onKeyDown={onKeyDownEvent}
                value={props.data[col.key]}
                placeholder={chgPlaceholder ? chgPlaceholder(col, props.data.cardUseSn) : col.placeholder}
                style={{ backgroundColor: hasError && hasError(props.data.cardUseSn, col.key) ? '#FFCCCC' : '' }}
                onValueChanged={(newValue) => {
                    hasError && setValidationErrors(prevErrors => prevErrors.filter(error => !(error.cardUseSn === props.data.cardUseSn && error.field === col.key)));
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