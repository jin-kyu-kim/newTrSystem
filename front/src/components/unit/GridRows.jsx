import {Column} from "devextreme-react/data-grid";
import ButtonRender from "./ButtonRender";

const GridRows = (columns, editRow, handleYnVal, onClick) => {
    const result = [];
    for (let i = 0; i < columns.length; i++) {
      const { key, value, width, alignment, button, visible, toggle, subColumns } = columns[i];
      
      /*=====================버튼 설정=========================*/
      if (button) {
        result.push(
          <Column
            key={key}
            dataField={key}
            caption={value}
            width={width}
            alignment={alignment || 'center'}
            cellRender={({ data }) => ButtonRender(button, data)}
          >
          </Column>
        );
      }  

      /*===============헤더 하위 뎁스 컬럼 설정===================*/
      if(subColumns){
          result.push(
            <Column
              key={key}
              dataField={key}
              caption={value}
              width={width}
              alignment={alignment}
            >
                {GridRows(subColumns)}
            </Column>
        );
      } else {
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