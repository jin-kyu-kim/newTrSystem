import Button from "devextreme-react/button";
import { useState, useEffect } from "react";
import axios from "axios";
import { TbX } from "react-icons/tb";
import CustomTable from "../../../components/unit/CustomTable"
import CustomHorizontalTable from "../../../components/unit/CustomHorizontalTable";
const ModifyPwd = () => {
    return (
        <div>
            <p>* 비밀번호를 수정합니다. (8자리~20자리, 숫자/영문자/특수문자포함하여야 합니다.)</p>
            <form>
                <table>
                    <colgroup>
                        <col width="25%"/>
                        <col width="75%"/>
                    </colgroup>
                    <tbody>
                        <tr>
                            <th>현재비밀번호</th>
                            <td>
                                <input placeholder="현재비밀번호"/>
                            </td>
                        </tr>
                        <tr>
                            <th>새 비밀번호</th>
                            <td>
                                <input placeholder="현재비밀번호"/>
                            </td>
                        </tr>
                        <tr>
                            <th>새 비밀번호(확인)</th>
                            <td>
                                <input placeholder="현재비밀번호"/>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div>
                    <Button>저장</Button>
                </div>
                <div>
                </div>
            </form>
        </div>

    );
};

export default ModifyPwd;