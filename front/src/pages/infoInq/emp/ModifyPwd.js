import Button from "devextreme-react/button";
import { useState, useEffect } from "react";
import axios from "axios";
import { TiX } from "react-icons/ti";
import CustomTable from "../../../components/unit/CustomTable"
import CustomHorizontalTable from "../../../components/unit/CustomHorizontalTable";
import { BackgroundColor } from "devextreme-react/cjs/chart";
const thStyle = {
    backgroundColor: '#f5f5f5',
    color: '#666666',
    fontWeight: 'bold',
    textAlign: 'center',
    border : '1px solid #dddddd'
  };

  const inputStyle = {
    marginLeft : '10px',
    width: '80%',
    height: '80%',
    border : '1px solid #dddddd',
    borderRadius : '5px'
  }
  const tdStyle = {
    border : '1px solid #dddddd'
  }
  
const ModifyPwd = () => {
    return (
        <div style={{ marginLeft :'30px', height: '300px',display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <form>
            <p >* 비밀번호를 수정합니다. (8자리~20자리, 숫자/영문자/특수문자포함하여야 합니다.)</p>
                <table style={{width: '800px', border : '1px solid #dddddd', height : '150px'}}>
                    <colgroup>
                        <col width="25%"/>
                        <col width="75%"/>
                    </colgroup>
                    <tbody>
                        <tr>
                        <th style={thStyle}>
  현재 비밀번호
</th>
                            <td style={tdStyle}>
                                <input style={inputStyle} placeholder="현재비밀번호"/>
                            </td>
                        </tr>
                        <tr>
                            <th style={thStyle}>새 비밀번호</th>
                            <td style={tdStyle}>
                                <input style={inputStyle} placeholder="새 비밀번호"/>
                            </td>
                        </tr>
                        <tr>
                            <th style={thStyle}>새 비밀번호(확인)</th>
                            <td style={tdStyle}>
                                <input style={inputStyle} placeholder="새 비밀번호(확인)"/>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div>
                    <Button style={{backgroundColor: '#446E9B', borderRadius:'5px', color: '#fff', width:'70px', marginLeft: '360px', marginTop: '20px'}}>저장</Button>
                </div>
                <div>
                </div>
            </form>
        </div>

    );
};

export default ModifyPwd;