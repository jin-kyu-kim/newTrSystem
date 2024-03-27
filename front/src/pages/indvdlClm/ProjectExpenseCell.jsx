import React, {useEffect, useState} from "react";
import CustomTable from "../../components/unit/CustomTable";
import Json from "./ProjectExpenseJson.json"
import ApiRequest from "../../utils/ApiRequest";
import {useCookies} from "react-cookie";

const ProjectExpenseCell = () => {
    const {keyColumn, columnValue, columnCharge} = Json;
    const [values, setValues] = useState([]);
    const [charge, setCharge] = useState([]);
    const [pageSize] = useState(10);
    const [cookies] = useCookies([]);
    let aplyDate = null;

    useEffect(() => {
        let now = new Date();
        let dateNum = Number(now.getDate());
        if(dateNum <= 15){
            let firstDayOfMonth = new Date( now.getFullYear(), now.getMonth() , 1 );
            let lastMonth = new Date ( firstDayOfMonth.setDate( firstDayOfMonth.getDate() - 1 ) );
            aplyDate = {
                "aplyYm": lastMonth.getFullYear()+('0' + (lastMonth.getMonth()+1)).slice(-2),
                "aplyOdr": 2
            }
        } else if (16 <= dateNum){
            aplyDate = {
                "aplyYm": now.getFullYear()+('0' + (now.getMonth()+1)).slice(-2),
                "aplyOdr": 1
            }
        }
    }, []);

    useEffect(() => {
        searchValue();
    }, [aplyDate]);

    const searchValue = async () => {
        try{
            const param = {
                queryId: "projectExpenseMapper.retrievePrjctCtAplyList",
                empId: cookies.userInfo.empId,
                aplyYm: aplyDate?.aplyYm,
                aplyOdr: aplyDate?.aplyOdr
            };
            const response = await ApiRequest("/boot/common/queryIdSearch", param);

            const tempCharge = [];
            response.forEach((value) => {
                if(value?.elctrnAtrzId != null){
                    tempCharge.push(value);
                }
            });
            setCharge(tempCharge);
            setValues(response);
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div>
            <div className="mx-auto" style={{marginTop: "20px", marginBottom: "30px"}}>
                <h1 style={{fontSize: "30px"}}>프로젝트비용</h1>
            </div>
            <p>* TR 청구 내역</p>
            <CustomTable
                keyColumn={keyColumn}
                pageSize={pageSize}
                columns={columnValue}
                values={values}
                paging={true}
            />
            <p>* 전자결재 청구 내역</p>
            <CustomTable
                keyColumn={keyColumn}
                pageSize={pageSize}
                columns={columnCharge}
                values={charge}
                paging={true}
            />
        </div>
    );
};

export default ProjectExpenseCell;