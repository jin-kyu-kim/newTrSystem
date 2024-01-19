import { Table } from "react-bootstrap";

const CustomTable = ({ headers, tbBody }) => {
  return (
    <Table responsive bordered hover>
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index}>{header.value}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {tbBody.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {headers.map((header, columnIndex) => (
              <td key={columnIndex}>{row[header.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default CustomTable;
