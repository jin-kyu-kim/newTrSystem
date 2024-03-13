import DataGrid, { Column, Pager, Paging, Summary, TotalItem, Editing, RequiredRule } from "devextreme-react/data-grid";
import { Button } from "devextreme-react/button";
import ToggleButton from "../../pages/sysMng/ToggleButton"

const CustomTable = ({ keyColumn, pageSize, columns, values, onRowDblClick, paging, summary, summaryColumn, 
                      handleYnVal, editRow, onEditRow, onClick,onRowClick }) => {

  const gridRows = () => {
    const result = [];
    for (let i = 0; i < columns.length; i++) {
      const { key, value, width, alignment, button, visible, toggle } = columns[i];
      if (button) {
        result.push(
          <Column
            key={key}
            dataField={key}
            caption={value}
            width={width}
            alignment={alignment || 'center'}
            cellRender={({ data }) => buttonRender(button, data)}>
          </Column>
        );
      } else {
        if (!visible) {
          result.push(
            <Column
              key={key}
              dataField={key}
              caption={value}
              width={width}
              alignment={alignment || 'center'}>
              {editRow && <RequiredRule message="필수 입력 항목입니다" />}
            </Column>
          );
        }
        if (toggle) {
          result.push(
            <Column
              key={key}
              dataField={key}
              caption={value}
              width={width}
              alignment={alignment || 'center'}
              cellRender={({ data, key }) => (
                <ToggleButton callback={handleYnVal} data={data} idColumn={key} />
              )} />
          );
        }
      }
    }
    return result;
  }

  const buttonRender = (button, data) => {
    return(
      <Button text={button} onClick={() => {onClick(data)}}/>
      
    )
  }

  return (
    <div className="wrap_table">
      <DataGrid
        keyExpr={keyColumn}
        id={"dataGrid"}
        className={"table"}
        dataSource={values}
        showBorders={true}
        showColumnLines={false}
        focusedRowEnabled={true}
        columnAutoWidth={false}
        noDataText=""
        onRowDblClick={onRowDblClick}
        onRowClick={onRowClick}
        onRowInserted={(e) => onEditRow('insert', e)}
        onRowUpdating={(e) => onEditRow('update', e)}
        onRowRemoved={(e) => onEditRow('delete', e)}
        onCellPrepared={(e) => {
          if (e.rowType === 'header') {
            e.cellElement.style.textAlign = 'center';
            e.cellElement.style.fontWeight = 'bold';
          }
        }}
      >
        {editRow &&
          <Editing
            mode="row"
            allowAdding={true}
            allowDeleting={true}
            allowUpdating={true}
          />
        }
        
        <Paging defaultPageSize={pageSize} enabled={paging} />
        <Pager
          displayMode="full"
          showNavigationButtons={true}
          showInfo={false}
          showPageSizeSelector={true}
          allowedPageSizes={[20, 50, 80, 100]}
        />
        {gridRows()}

        {summary&&
          <Summary>
            {summaryColumn.map(item => (
              <TotalItem
                key={item.key}
                column={item.value}
                summaryType={item.type}
                displayFormat={item.format}
                valueFormat={{ type: 'fixedPoint', precision: 0 }} // 천 단위 구분자 설정
              />
            ))}
          </Summary>
        }

      </DataGrid>
    </div>
  );
};

export default CustomTable;
