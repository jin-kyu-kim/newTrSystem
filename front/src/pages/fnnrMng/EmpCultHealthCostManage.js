import React from 'react';
import DataGrid, { Column, Editing, Paging } from 'devextreme-react/data-grid';
import 'devextreme/dist/css/dx.light.css';

class App extends React.Component {
  state = {
    dataSource: [
      { id: 1, field1: 'Value 1', field2: 'Value A' },
      { id: 2, field1: 'Value 1', field2: 'Value A' },
      { id: 3, field1: 'Value 2', field2: 'Value A' },
      { id: 4, field1: 'Value 2', field2: 'Value B' },
    ]
  };

  render() {
    return (
      <DataGrid
        dataSource={this.state.dataSource}
        showBorders={true}
        cellMergingEnabled={true}
      >
        <Column dataField="field1" caption="field1" />
        <Column dataField="field2"  caption="Field 2" />
       
      </DataGrid>
    );
  }
}

export default App;