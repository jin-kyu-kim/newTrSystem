import DataGrid, { Column } from 'devextreme-react/data-grid';

const CustonbudgetTable = ({ headers, column }) => { 

    const data = [{
        ...headers.reduce((result, header) => {
          result[header.key] = column?.[header.key] ?? "";
          return result;
        }, {}),
        
      }];

      console.log("data! budget",data);
      console.log("data! headers",headers);

  return (
    <DataGrid
        className="horizontal-datagrid"
        dataSource={data}
        showColumnLines={true}
        showRowLines={true}
        showBorders={true}
        onCellPrepared={(e) => {
        if (e.rowType === 'header') {
            e.cellElement.style.textAlign = 'center';
            e.cellElement.style.fontWeight = 'bold';
            e.cellElement.style.cursor = 'default';
            e.cellElement.style.color ='black'
            e.cellElement.style.backgroundColor = '#e9ecef'
            e.cellElement.style.pointerEvents = 'none';
        }
        if (e.rowType === 'data' && e.column.dataField === '') {
            e.cellElement.style.textAlign = 'center';
            e.cellElement.style.fontWeight = 'bold';
            e.cellElement.style.cursor = 'default';
            e.cellElement.style.color ='black'
            e.cellElement.style.backgroundColor = '#e9ecef'
            e.cellElement.style.pointerEvents = 'none';
        }
        }}      
    >
        <Column dataField={headers[0].key} caption={headers[0].value}/>
        <Column dataField={headers[1].key} caption={headers[1].value}/>
        <Column dataField={headers[2].key} caption={headers[2].value} />
        <Column dataField={headers[3].key} caption={headers[3].value}/>
  </DataGrid>
  );
};

export default CustonbudgetTable;
