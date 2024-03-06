import { useEffect, useState, } from "react";
import  { useLocation } from "react-router-dom";
import SearchPrjctCostSet from "../../../components/composite/SearchPrjctCostSet";
import ProjectHrCtAprvDetailJson from "./ProjectHrCtAprvDetailJson";
import ApiRequest from "../../../utils/ApiRequest";
import CustomTable from "../../../components/unit/CustomTable";

const ProjectHrCtAprvDetail = () => {

    const location = useLocation();
    const prjctId = location.state.prjctId;
    const prjctNm = location.state.prjctNm;
    const { searchParams, mm, ct } = ProjectHrCtAprvDetailJson;
    
    const [param, setParam] = useState([]);
    const [mmValues, setMmValues] = useState([]);

    // 수행인력 조회
    useEffect(() => {
        console.log("useEffect");


        
    },[]);
    
    useEffect(() => {
        if(param.length == 0){
            console.log(param);
            handleAplyMm();    
        }

    }, [param])

    // 경비 조회
    const handleAplyMm = async () => {
        const param = {
            queryId: ProjectHrCtAprvDetailJson.mm.queryId,
            prjctId: prjctId,
            aplyOdr: 1
        }

        const response = await ApiRequest("/boot/common/queryIdSearch", param);
        setMmValues(response);
        console.log(response);
    }

    const searchHandle = async (initParam) => {
        console.log("searchHandle");
        console.log(initParam);

        console.log(initParam.year + initParam.month);
        console.log(initParam.year)

        if(initParam.year == null || initParam.month == null) {
            setParam({
                ...param,
                aplyNm: initParam.year + initParam.month,
                aplyOdr: initParam.aplyOdr,
                empId: initParam.empId,
            })

            return;
        };

        setParam({
            ...param,
            aplyNm: initParam.year + initParam.month,
            aplyOdr: initParam.aplyOdr,
            empId: initParam.empId,
        })
    }

    const onBtnClick = (e) => {
        console.log(e.component.option("value").data);
    }


    return (
        <div className="container">
            <div
                className="title p-1"
                style={{ marginTop: "20px", marginBottom: "10px" }}
            >
                <h1 style={{ fontSize: "40px" }}>프로젝트 비용승인</h1>
            </div>
            <div className="" style={{ marginBottom: "10px" }}>
                <span>* 프로젝트: {prjctNm}</span>
            </div>
            <div className="wrap_search" style={{ marginBottom: "20px" }}>
                <SearchPrjctCostSet callBack={searchHandle} props={searchParams} />
            </div>
            <div className="" style={{ marginBottom: "10px" }}>
                <span>* 수행인력</span>
            </div>
            <CustomTable keyColumn={mm.keyColumn} columns={mm.tableColumns} values={mmValues} paging={true} onBtnClick={onBtnClick} summary={true} summaryColumn={mm.summaryColumn}/>
            <div className="" style={{ marginBottom: "10px" }}>
                <span>* 경비</span>
            </div>
        </div>
    );


}

export default ProjectHrCtAprvDetail;