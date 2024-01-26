import DataGrid, { Column, Pager, Paging, } from "devextreme-react/data-grid";

const CustomTable = ({ columns, values, onRowDblClick, pagerVisible  }) => {

  const gridRows = () => {
    const result = [];
    for(let i = 0; i < columns.length; i++) {
        const { key, value, width, alignment } = columns[i];

        result.push(
            <Column key={key} dataField={key} caption={value} width={width} alignment={alignment || 'center'}>
            </Column>
        );
    }
    return result;
  }

  return (
    <div className="wrap_table">
    <DataGrid
        keyExpr="prjctId"
        id={"dataGrid"}
        className={"table"}
        dataSource={values}
        showBorders={true}
        showColumnLines={false}
        focusedRowEnabled={true}
        columnAutoWidth={false}
        noDataText=""
        onRowDblClick={onRowDblClick}
    >

      <Paging defaultPageSize={20} />
      <Pager
        displayMode="full"
        showNavigationButtons={true}
        showInfo={false}
        showPageSizeSelector={true}
        visible={pagerVisible}
        allowedPageSizes={[20, 50, 80, 100]}
      />

      {gridRows()}
    </DataGrid>
  </div>
  );
};

export default CustomTable;
