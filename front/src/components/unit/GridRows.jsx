import {Column} from "devextreme-react/data-grid";
import { CheckBox } from "devextreme-react";
import React from 'react';
import {Button} from "devextreme-react/button";

const GridRows = ( {columns, editRow, handleYnVal, onClick, handleCheckBoxChange, checkBoxValue}) => {

    const result = [];

    const ButtonRender = (button, data, onClick) => {
        let disabled = false;
        if(button.able != null && data != null && button.able.value !== undefined && data[button.able.key] != button.able.value){
            disabled = true;
        } else if(button.able != null && data != null  && button.able.exceptValue !== undefined && data[button.able.key] == button.able.exceptValue){
            disabled = true;
        } else if (button.time){
            const date = new Date();
            const month = date.getMonth() + 1;
            let firstDayOfMonth = new Date( date.getFullYear(), date.getMonth() , 1 );
            let lastMonth = new Date(firstDayOfMonth.setDate( firstDayOfMonth.getDate() - 1 )); // 전월 말일
            const day = date.getDate();
            let monthVal = month < 10 ? "0" + month : month;
            let lastMonthVal = (lastMonth.getMonth() + 1) < 10 ? "0" + (lastMonth.getMonth() + 1) : lastMonth.getMonth() + 1;

            if(day > 15){
                if(data["aplyYm"] !== date.getFullYear()+monthVal || data["aplyOdr"] !== 1){
                    disabled = true;
                }
            } else {
                if(data["aplyYm"] !== lastMonth.getFullYear()+lastMonthVal || data["aplyOdr"] !== 2){
                    disabled = true;
                }
            }
        }
        return(
            <Button name = {button.name} text={button.text} onClick={(e) => {onClick(button, data)}} disabled={disabled}/>
        )
    }

    const ButtonsRender = (buttons, data, onClick) => {
        let button = null;
        let disabled = false;
        buttons.forEach((item) => {
            if (data != null && data[item.visible.key] === item.visible.value ) {
                button = item;
                if(item.able != null && typeof item.able.value != "boolean" && data[item.able.key] !== item.able.value){
                    disabled = true;
                } else if (item.able != null && item.able.value === true && data[item.able.key]){
                    disabled = true;
                } else if (button.time){
                    const date = new Date();
                    const month = date.getMonth() + 1;
                    let firstDayOfMonth = new Date( date.getFullYear(), date.getMonth() , 1 );
                    let lastMonth = new Date(firstDayOfMonth.setDate( firstDayOfMonth.getDate() - 1 )); // 전월 말일
                    const day = date.getDate();
                    let monthVal = month < 10 ? "0" + month : month;
                    let lastMonthVal = (lastMonth.getMonth() + 1) < 10 ? "0" + (lastMonth.getMonth() + 1) : lastMonth.getMonth() + 1;

                    if(day > 15){
                        if(data["aplyYm"] !== date.getFullYear()+monthVal || data["aplyOdr"] !== 1){
                            disabled = true;
                        }
                    } else {
                        if(data["aplyYm"] !== lastMonth.getFullYear()+lastMonthVal || data["aplyOdr"] !== 2){
                            disabled = true;
                        }
                    }
                }
            }
        });
        if(button != null){
            return(
                <Button name = {button.name} text={button.text} onClick={(e) => {onClick(button, data)}} disabled={disabled}/>
            )
        }
    }

    // 날짜 형식을 변환하는 함수
    const formatDate = (dateStr) => {
      return `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`;
    };
    
    const DateCell = (data) => {
        return <span>{formatDate(data.value)}</span>;
    };


    for (let i = 0; i < columns.length; i++) {
      const { key, value, width, alignment, button, buttons, visible, toggle, subColumns, chkBox , grouping, currency, unit, dateFormat } = columns[i];

      if(subColumns){
        /*===============헤더 하위 뎁스 컬럼 설정===================*/
        //columns 서브컬럼 단위로 재설정
        const columns = subColumns;
          result.push(
            
            <Column
              key={key}
              dataField={key}
              caption={value}
              width={width}
              alignment={alignment}
            > 
                {GridRows({columns, onClick, handleCheckBoxChange, checkBoxValue})}
            </Column>
        );
      } else if(button){
        /*=====================버튼 설정=========================*/
        result.push(
          <Column
            key={key}
            dataField={key}
            caption={value}
            width={width}
            alignment={alignment || 'center'}
            cellRender={({ data }) => ButtonRender(button, data, onClick)}
          >
          </Column>
        );
      } else if(buttons){
          /*=====================데이터 값에 따라 버튼 선택=========================*/
          result.push(
              <Column
                  key={key}
                  dataField={key}
                  caption={value}
                  width={width}
                  alignment={alignment || 'center'}
                  cellRender={({ data }) => ButtonsRender(buttons, data, onClick)}
              >
              </Column>
          );
      } else if(chkBox){
        /*=====================헤더 체크박스 설정====================*/
        const CheckBoxHeaderCellComponent = ({ data, idColumn, handleCheckBoxChange, checkBoxValue }) => {
          return(
              <CheckBox 
                text={value} 
                name={key} 
                visible={true} 
                alignment={alignment} 
                onValueChanged={(e) => handleCheckBoxChange(e, key)} 
                /*value={checkBoxValue[key] == "true" ? true : false}*/
                value={checkBoxValue[key]}
              />
          );
        }

        // const handleCheckBoxChange = (e) => {
        // }

        result.push(
          <Column
            key={key}
            dataField={key}
            width={width}
            alignment={alignment || 'center'}
            caption={value}
            allowSorting={false}
            headerCellRender={({ data, key }) => (
              <CheckBoxHeaderCellComponent data={data} idColumn={key} handleCheckBoxChange={handleCheckBoxChange} checkBoxValue={checkBoxValue}/>
            )}
          >
          </Column>
        );
      }else if(currency){
        /*=====================금액 자리수 표시=========================*/
        result.push(
          <Column
            key={key}
            dataField={key}
            caption={value}
            width={width}
            alignment={alignment || 'center'}
            format="#,##0 원"
          >
          </Column>
        );
      } else if(unit) {
          /*=====================단위 표시=========================*/
          result.push(
              <Column
                  key={key}
                  dataField={key}
                  caption={value}
                  width={width}
                  alignment={alignment || 'center'}
                  format={(value) => `${value} ${unit}`}
              >
              </Column>
          );
      } else if(dateFormat){
        /*=====================날짜 표시=========================*/
        result.push(
          <Column
              key={key}
              dataField={key}
              caption={value}
              width={width}
              alignment={alignment || 'center'}
              cellRender={DateCell}
          >
          </Column>
      );
      }
      else {
        /*=====================일반 셀 설정=========================*/
          result.push(
            <Column
              key={key}
              dataField={key}
              caption={value}
              width={width}
              alignment={alignment || 'center'}
             
              
            >
            </Column>
          );
      }

    }

    return result;
}

export default GridRows;