import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "devextreme-react";
import { useCookies } from "react-cookie";
import ApiRequest from '../../../utils/ApiRequest';
import EmpProjectHistJson from "./EmpProjectHistJson.json";
import CustomTable from "../../../components/unit/CustomTable";
import CustomDatePicker from "../../../components/unit/CustomDatePicker";
import DataGrid, { Column, Editing } from 'devextreme-react/data-grid';

const EmpProjectHist = () => {
    const [projectHist, setProjectHist] = useState([]);
    const [selectProjectHist, setSelectProjectHist] = useState([]);
    const empProjectHistJson = EmpProjectHistJson;
    const {keyColumn, tableColumns} = EmpProjectHistJson.prjctHist;

    /*유저세션*/
    const [cookies, setCookie] = useCookies(["userInfo", "userAuth"]);
    
    const empId = cookies.userInfo.empId;
    const deptId = cookies.userInfo.deptId;

    /* 프로젝트 이력정보 */
    useEffect(() => {
        const projectHistData = async()=>{
        const param = [
            {tbNm: "EMP_PRJCT_HIST"},
            {
                empId : empId
            }
        ];
        try{
            const response = await ApiRequest("/boot/common/commonSelect", param);
            setProjectHist(response);
        } catch(error){
            console.error('Error fetching data', error);
        }
        };
        projectHistData();
    }, []);

    /* 프로젝트 이력 로우 클릭 시*/
    const onRowHistClick = (e) => {
        const selectPrjctHist = async() => {
            const param = [
                {tbNm: "EMP_PRJCT_HIST"},
                {
                    empId : empId
                }
            ];
            try{
                const response = await ApiRequest("/boot/common/commonSelect", param);
                setSelectProjectHist(response);
            } catch(error){
                console.error('Error fetching data', error);
            }
        };
        selectPrjctHist();
    };

    return (
        <div className = "container">
            <div className="title p-1" style={{ marginTop: "20px", marginBottom: "10px" }}>
                <h1 style={{ fontSize: "40px" }}>프로젝트 이력</h1>
            </div>
            <div style = {{ marginBottom: "20px" }}>
            <CustomTable
                keyColumn={keyColumn}
                columns={tableColumns}
                values={projectHist}
                paging={true}
                onRowDbClick={onRowHistClick}
            />
            </div>
            <div style = {{ marginBottom: "20px" }}>
            </div>
        </div>
    );
};

export default EmpProjectHist;


