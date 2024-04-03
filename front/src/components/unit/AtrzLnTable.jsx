import { Table, TableBody, TableCell, TableRow } from "@mui/material";
import '../../pages/elecAtrz/ElecAtrz.css'

const AtrzLnTable = ({atrzLnEmpList, bottomNm}) => {
  const approvalCodes = ['VTW00702', 'VTW00703', 'VTW00704', 'VTW00705'];
  
  const renderEmp = (cd) => {
    return(
        atrzLnEmpList.filter(emp => emp.approvalCode === cd)
        .map(emp => emp.empFlnm).join('; ')
    );
  };
  const hasEmp = (cd) => {
    return atrzLnEmpList.some(emp => emp.approvalCode === cd);
  }

  return (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell rowSpan={4} style={{ ...cellStyle, ...grayBackground }}>결재선</TableCell>
            {['검토', '확인', '심사', '승인'].map((text, index) => (
                <TableCell key={index} style={{ ...cellStyle, ...grayBackground }}>{text}</TableCell>
            ))}
        </TableRow>

        <TableRow>
          {approvalCodes.map((code) => (
            <TableCell
              key={code}
              className={`diagonal-line-cell ${hasEmp(code) ? 'cell-with-data' : ''}`} 
              style={cellStyle}
            />
          ))}
        </TableRow>

        {/* 추가된 결재자가 나타나는 행 */}
        <TableRow>
          {approvalCodes.map((code) => (
            <TableCell key={code} style={cellStyle}>
              {renderEmp(code)}
            </TableCell>
          ))}
        </TableRow>
        
        {/* 승인, 반려 완료후 승인일자가 , 반려일자가 나타나는 행 */}
        <TableRow>
          {approvalCodes.map((code) => (
            <TableCell key={code} style={cellStyle}>
              
            </TableCell>
          ))}
        </TableRow>
        
        <TableRow>
            <TableCell style={{ ...cellStyle, ...grayBackground }}>{bottomNm}</TableCell>
            <TableCell colSpan={4} style={{ border: '1px solid black', textAlign: 'center' }}>
                {renderEmp(bottomNm === '참조' ? 'VTW00706' : 'VTW00707')}
            </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};
export default AtrzLnTable;

const cellStyle = { border: '1px solid black', textAlign: 'center', height: '50px' };
const grayBackground = { background: '#e1dfdf' };