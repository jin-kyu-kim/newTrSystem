import { useEffect, useState, } from "react";
import  { useLocation } from "react-router-dom";
import SearchPrjctCostSet from "../../../components/composite/SearchPrjctCostSet";
import ProjectHrCtAprvDetailJson from "./ProjectHrCtAprvDetailJson.json";
import ApiRequest from "../../../utils/ApiRequest";
import CustomTable from "../../../components/unit/CustomTable";
import Popup from "devextreme-react/popup";
import ProjectHrCtAprvCtPop from "./ProjectHtCtAprvCtPop";
import ProjectHrCtAprvMmPop from "./ProjectHtCtAprvMmPop";

const ProjectHrCtAprvDetail = () => {

    const location = useLocation();
    const prjctId = location.state.prjctId;
    const prjctNm = location.state.prjctNm;
    const { searchParams, mm, ct } = ProjectHrCtAprvDetailJson;
    
    const [param, setParam] = useState([]);
    const [data, setData] = useState([]);
    const [mmValues, setMmValues] = useState([]);
    const [ctValues, setCtValues] = useState([]);
    const [ctPopupVisible, setCtPopupVisible] = useState(false);
    const [mmPopupVisible, setMmPopupVisible] = useState(false);
    const [ctDetailValues, setCtDetailValues] = useState([]);
    const [mmDetailValues, setMmDetailValues] = useState([]);

    
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
        if(initParam.yearItem == null || initParam.monthItem == null) {

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
            aplyYm: initParam.yearItem + initParam.monthItem,
            aplyOdr: initParam.aplyOdr,
            empId: initParam.empId,
        })
    }

    const onMmBtnClick = async (button, data) => {
        console.log(data);
        setData(data);

        await retrieveProjectMmAplyDetail(data);
        setMmPopupVisible(true);
    }

    const retrieveProjectMmAplyDetail = async (data) => {

        const param = {
            queryId: "projectMapper.retrieveProjectMmAplyDetail",
            prjctId: prjctId,
            aplyYm: data.aplyYm,
            aplyOdr: data.aplyOdr,
            empId: data.empId
        }
        const response = await ApiRequest("/boot/common/queryIdSearch", param);
        setMmDetailValues(response);
        console.log(response)
    }


    const onCtBtnClick = async (button, data) => {
        console.log(data);

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
        setMmPopupVisible(false);
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
            <Popup
                width={ProjectHrCtAprvDetailJson.popup.width}
                height={ProjectHrCtAprvDetailJson.popup.height}
                visible={ctPopupVisible}
                onHiding={handleClose}
                showCloseButton={true}
            >
                <ProjectHrCtAprvCtPop props={ctDetailValues} prjctNm={prjctNm} data={data}/> 
            </Popup>

            <Popup
                width={ProjectHrCtAprvDetailJson.popup.width}
                height={ProjectHrCtAprvDetailJson.popup.height}
                visible={mmPopupVisible}
                onHiding={handleClose}
                showCloseButton={true}
            >
                <ProjectHrCtAprvMmPop props={mmDetailValues} prjctNm={prjctNm} data={data}/>
            </Popup>
        </div>

    );


}

export default ProjectHrCtAprvDetail;