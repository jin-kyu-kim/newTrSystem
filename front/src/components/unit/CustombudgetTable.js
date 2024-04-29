import DataGrid, { Column } from 'devextreme-react/data-grid';

const CustombudgetTable = ({ headers, column }) => { 

    const data = [{
        ...headers.reduce((result, header) => {
          result[header.key] = column?.[header.key] ?? "";
          return result;
        }, {}),
        
      }];
    
    const applyHeaderStyle = (cellElement)=>{
        cellElement.style.textAlign = 'center';
        cellElement.style.fontWeight = 'bold';
        cellElement.style.cursor = 'default';
        cellElement.style.color ='black'
        cellElement.style.backgroundColor = '#e9ecef'
        cellElement.style.pointerEvents = 'none';
    }

  return (
    <DataGrid
        className="horizontal-datagrid"
        dataSource={data}
        showColumnLines={true}
        showRowLines={true}
        showBorders={true}
        onCellPrepared={(e) => {
        if (e.rowType === 'header') {
            applyHeaderStyle(e.cellElement);
        }
        if (e.rowType === 'data' && e.column.dataField === '') {
            applyHeaderStyle(e.cellElement);
        }
        }}      
    >   
        {headers.map(header =>(
            <Column key={header.key} dataField={header.key} caption={header.value} alignment='center'/>
        ))}
  </DataGrid>
  );
};

export default CustombudgetTable;
