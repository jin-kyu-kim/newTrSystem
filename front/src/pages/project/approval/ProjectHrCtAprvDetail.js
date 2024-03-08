import { useEffect, useState, } from "react";
import  { useLocation } from "react-router-dom";
import SearchPrjctCostSet from "../../../components/composite/SearchPrjctCostSet";
import ProjectHrCtAprvDetailJson from "./ProjectHrCtAprvDetailJson.json";
import ApiRequest from "../../../utils/ApiRequest";
import CustomTable from "../../../components/unit/CustomTable";
import CustomPopup from "components/unit/CustomPopup";
import ProjectHrCtAprvDetailPop from "./ProjectHtCtAprvDetailPop";
import { IPopoverOptions, Popover } from 'devextreme-react/popover';
import { set } from "date-fns";
import { Popup } from "devextreme-react";

const ProjectHrCtAprvDetail = () => {

    const location = useLocation();
    const prjctId = location.state.prjctId;
    const prjctNm = location.state.prjctNm;
    const { searchParams, mm, ct } = ProjectHrCtAprvDetailJson;
    
    const [param, setParam] = useState([]);
    const [mmValues, setMmValues] = useState([]);
    const [ctValues, setCtValues] = useState([]);
    const [ctPopupVisible, setCtPopupVisible] = useState(false);
    const [ctDetailParam, setCtDetailParam] = useState([]);
    const [ctDetailValues, setCtDetailValues] = useState([]);

    
    // 조회
    useEffect(() => {
        if(!Object.values(param).every((value) => value === "")) {
            handleMmAply();
            handleCtAply();
        }

    }, [param])

    const handleCtAply = async () => {

        const ctParam = {
            ...param,
            queryId: ProjectHrCtAprvDetailJson.ct.queryId,
        }

        const response = await ApiRequest("/boot/common/queryIdSearch", ctParam);
        setCtValues(response);
    }

    // 경비 조회
    const handleMmAply = async () => {

        const response = await ApiRequest("/boot/common/queryIdSearch", param);
        setMmValues(response);
    }

    const searchHandle = async (initParam) => {
        if(initParam.year == null || initParam.month == null) {

            const date = new Date();
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();

            let odrVal = day > 15 ? "2" : "1";
            let monthVal = month < 10 ? "0" + month : month;
            let aplyYm = year + monthVal;

            setParam({
                ...param,
                queryId: ProjectHrCtAprvDetailJson.mm.queryId,
                prjctId: prjctId,
                aplyYm: aplyYm,
                aplyOdr: odrVal,
                empId: initParam.empId,
            })

            return;
        };

        setParam({
            ...param,
            queryId: ProjectHrCtAprvDetailJson.mm.queryId,
            prjctId: prjctId,
            aplyYm: initParam.year + initParam.month,
            aplyOdr: initParam.aplyOdr,
            empId: initParam.empId,
        })
    }

    const onMmBtnClick = (data) => {
        console.log(data);
    }

    const onCtBtnClick = async (data) => {
        console.log(data);

        setCtDetailParam({
            ...ctDetailParam,
            empId: data.empId,
        });

        await retrieveProjectCtAplyDetail(data);
        setCtPopupVisible(true);
    }

    const retrieveProjectCtAplyDetail = async (data) => {

        const param = {
            queryId: "projectMapper.retrieveProjectCtAplyDetail",
            prjctId: prjctId,
            aplyYm: data.aplyYm,
            aplyOdr: data.aplyOdr,
            empId: data.empId
        }
        const response = await ApiRequest("/boot/common/queryIdSearch", param);
        setCtDetailValues(response);
    }

    const handleClose = () => {
        setCtPopupVisible(false);
    };

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
            <CustomTable keyColumn={mm.keyColumn} columns={mm.tableColumns} values={mmValues} paging={true} onClick={onMmBtnClick} summary={true} summaryColumn={mm.summaryColumn}/>
            <div className="" style={{ marginBottom: "10px" }}>
                <span>* 경비</span>
            </div>
            <CustomTable keyColumn={ct.keyColumn} columns={ct.tableColumns} values={ctValues} paging={true} onClick={onCtBtnClick} summary={true} summaryColumn={ct.summaryColumn}/>
            <CustomPopup props={ProjectHrCtAprvDetailJson.ctPopup} visible={ctPopupVisible} handleClose={handleClose}>
                <ProjectHrCtAprvDetailPop props={ctDetailValues} prjctNm={prjctNm} /> 
            </CustomPopup>
        </div>

    );


}

export default ProjectHrCtAprvDetail;