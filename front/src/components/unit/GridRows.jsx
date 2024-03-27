import {Column} from "devextreme-react/data-grid";
import ButtonRender from "./ButtonRender";
import { CheckBox } from "devextreme-react";
import React, { useState } from 'react';

const GridRows = ( {columns, editRow, handleYnVal, onClick}) => {

    const [isChecked, setIsChecked] = useState(true);

    const result = [];
    for (let i = 0; i < columns.length; i++) {
      const { key, value, width, alignment, button, visible, toggle, subColumns, chkBox } = columns[i];      
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
                {GridRows({columns})}
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
            cellRender={({ data }) => ButtonRender({button, data, onClick})}
          >
          </Column>
        );
      } else if(chkBox){
        /*=====================헤더 체크박스 설정====================*/
        const CheckBoxHeaderCellComponent = ({ data, callback, idColumn }) => {
          return(
              <CheckBox text={value} name={key} visible={true} alignment={alignment} onValueChange={handleCheckBoxChange}/>
          );
        }

        const handleCheckBoxChange = (e) => {
        }

        result.push(
          <Column
            key={key}
            dataField={key}
            width={width}
            alignment={alignment || 'center'}
            caption={value}
            headerCellRender={({ data, key }) => (
              <CheckBoxHeaderCellComponent callback={handleYnVal} data={data} idColumn={key}/>
            )}
          >
          </Column>
        );
      } else {
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