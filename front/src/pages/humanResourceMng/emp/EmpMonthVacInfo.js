import {useEffect, useState} from 'react';
import 'devextreme/dist/css/dx.light.css';
import Calendar from "../../../components/unit/Calendar"
import ApiRequest from "../../../utils/ApiRequest";
import EmpMonthVacInfoJson from "./EmpMonthVacInfo.json"


const {keyColumn, queryId, data} = EmpMonthVacInfoJson;

const EmpMonthVacInfo = () => {
    const [param, setParam] = useState([]);
    const [values, setValues] = useState([]);

    const data = [];

    useEffect(() => {
        setParam({
            queryId: queryId,
        });
    },[]);

    useEffect(() => {
        if(!Object.values(param).every((value) => value === "")) {
            pageHandle();
        };
    }, [param]);

    const pageHandle = async () => {
        try {
            const response = await ApiRequest("/boot/common/queryIdSearch", param);
            setValues(response);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="container">
            <div className="mx-auto" style={{ marginTop: "20px", marginBottom: "10px" }}>
                <h1 style={{ fontSize: "30px" }}>월별휴가정보</h1>
            </div>
            <div className="mx-auto" style={{ marginBottom: "10px" }}>
                <span>* 직원의 월별 휴가정보를 조회합니다.</span>
            </div>
            {/* <div className="col-md-10 mx-auto" style={{ marginBottom: "10px" }}>
                <span>년도_월_성명_검색버튼</span>
            </div> */}
            <div className="mx-auto" style={{ marginBottom: "20px", marginTop: "30px"}}>
                <Calendar values={values}/>
            </div>
        </div>
        );
}

export default EmpMonthVacInfo;
