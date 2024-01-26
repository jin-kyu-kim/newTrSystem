import DataGrid, { Column } from 'devextreme-react/data-grid';

const CustomHorizontalTable = ({ headers, column }) => { 
  const data = headers.reduce((result, header, index) => {
    // 홀수 인덱스일 때만 새로운 로우 생성
    //4열 [Header, Column, Header, Column] 구조
    if (index % 2 === 0) {
      result.push({
        header: header.value,
        column : column[header.key],
        header1: headers[index + 1]?.value,
        column1 : column[headers[index + 1]?.key],
      });
    }
    return result;
  }, []);

  const cellRender = (data) => {
    // 각 셀에 대한 스타일을 설정
    return (
      <div style={{ margin: '0', padding: '5px', fontWeight: 'bold' }}>
        {data.value}
      </div>
    );
  };

  return (
    <DataGrid
      dataSource={data}
      showBorders={true}
      showColumnHeaders={false} // 최상단 헤더를 숨기는 설정
      showRowLines={true}       // 로우마다 분할 선을 보이도록 설정
      showColumnLines={true}    // 컬럼마다 분할 선을 보이도록 설정
    >
      <Column dataField="header" caption="Header" cellRender={cellRender } alignment="center" width={250}/>
      <Column dataField="column" caption="Column" />
      <Column dataField="header1" caption="Header1" cellRender={cellRender } alignment="center" width={250}/>
      <Column dataField="column1" caption="Column1" />
    </DataGrid>
  );
};

export default CustomHorizontalTable;
