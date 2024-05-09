import { TextBox } from 'devextreme-react';
import Button from "devextreme-react/button";
import TagBox from 'devextreme-react/tag-box';
import SelectBox from "devextreme-react/select-box";
import ToggleButton from 'pages/sysMng/ToggleButton';
import React from "react";

const CellRender = ({ col, props, handleYnVal, onBtnClick, cellRenderConfig }) => {

    const {getCdList, isPrjctIdSelected, setIsPrjctIdSelected, hasError, chgPlaceholder, comboList, cdList,
        expensCd, setExpensCd, setValidationErrors} = cellRenderConfig ?? {};
    
    if(col.cellType === 'button') {
        return(<Button text={col.button.text} name={col.button.name} type={col.button.type}
            onClick={() => onBtnClick(col.button, props)} />)

    } else if (col.cellType === 'toggle') {
        return ( <ToggleButton callback={handleYnVal} data={props} colData={col} /> );

    } else if (col.cellType === 'selectBox') {
        return (
            <SelectBox
                dataSource={getCdList ? (col.key === 'prjctId' ? comboList[col.key] : cdList[props.data.cardUseSn]) : comboList[col.key]}
                displayExpr={col.displayExpr}
                keyExpr={col.valueExpr}
                placeholder={col.placeholder}
                onValueChanged={(newValue) => {
                    props.data[col.key] = newValue.value[col.valueExpr]

                    if (col.key === 'prjctId') {
                        getCdList(newValue.value[col.valueExpr], props.data.cardUseSn);
                        setIsPrjctIdSelected(prevStts => ({
                            ...prevStts,
                            [props.data.cardUseSn]: !!newValue.value
                        })); // 선택된 값이 없으면 falsy

                    } else {
                        setExpensCd(prevStts => ({
                            ...prevStts,
                            [props.data.cardUseSn]: newValue.value[col.valueExpr]
                        }));
                    }
                }}
                disabled={col.key === 'expensCd' && !isPrjctIdSelected[props.data.cardUseSn]}
            />
        );
    } else if (col.cellType === 'textBox' && col.key === 'atdrn' && expensCd[props.data.cardUseSn] === 'VTW04531') {
        return (
            <TagBox
                dataSource={comboList['emp']}
                placeholder={chgPlaceholder ? chgPlaceholder(col, props.data.cardUseSn) : col.placeholder}
                searchEnabled={true}
                showClearButton={true}
                showSelectionControls={true}
                displayExpr='displayValue'
                applyValueMode="useButtons"
                style={{ backgroundColor: hasError(props.data.cardUseSn, col.key) ? '#FFCCCC' : '' }}
                onValueChanged={(newValue) => {
                    props.data[col.key] = newValue.value
                    setValidationErrors(prevErrors => prevErrors.filter(error => !(error.cardUseSn === props.data.cardUseSn && error.field === col.key)));
                }}
            />
        );
    } else if (col.cellType === 'textBox') {
        return (
            <TextBox
                name={col.key}
                value={props.data[col.key]}
                placeholder={chgPlaceholder ? chgPlaceholder(col, props.data.cardUseSn) : col.placeholder}
                style={{ backgroundColor: hasError(props.data.cardUseSn, col.key) ? '#FFCCCC' : '' }}
                onValueChanged={(newValue) => {
                    props.data[col.key] = newValue.value
                    setValidationErrors(prevErrors => prevErrors.filter(error => !(error.cardUseSn === props.data.cardUseSn && error.field === col.key)));
                }} >
            </TextBox>
        );
    } else if (col.cellType === 'fileCell') {
        let atchList = props?.data.atchmnfl;
        if (atchList != null) {
            return (<div>
                {atchList.map((item, index) => (
                    <div key={index} style={{whiteSpace: 'pre-wrap'}}>
                        <a href={`/upload/${item.strgFileNm}`} download={item.realFileNm}>{item.realFileNm}</a>
                    </div>
                ))}
            </div>);
        }
    }
}
export default CellRender;