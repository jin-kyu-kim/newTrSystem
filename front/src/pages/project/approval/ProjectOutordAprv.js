import React, { useEffect, useState, } from 'react';
import { useNavigate } from 'react-router-dom';

import SearchPrjctSet from "../../../components/composite/SearchPrjctSet";
import ApiRequest from "../../../utils/ApiRequest";
import CustomTable from "../../../components/unit/CustomTable";
import ProjectOutordAprvJson from "./ProjectOutordAprvJson.json";

const ProjectOutordAprv = () => {

    const [values, setValues] = useState([]);
    const [param, setParam] = useState({});
  
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    const { keyColumn, queryId, tableColumns, searchParams, popup } = ProjectOutordAprvJson;
    const navigate = useNavigate();

    useEffect(() => {
            if (!Object.values(param).every((value) => value === "")) {
                pageHandle();
            }
    }, [param]);
    
    // 검색으로 조회할 때
    const searchHandle = async (initParam) => {
        setTotalPages(1);
        setCurrentPage(1);
        setParam({
            ...initParam,
            queryId: queryId,
            currentPage: currentPage,
            startVal: 0,
            pageSize: pageSize,
        });
    };

    const pageHandle = async () => {
        try {
            const response = await ApiRequest("/boot/common/queryIdSearch", param);
            setValues(response);
            if (response.length !== 0) {
                setTotalPages(Math.ceil(response[0].totalItems / pageSize));
                setTotalItems(response[0].totalItems);
            } else {
                setTotalPages(1);
            }
        } catch (error) {   
            console.log(error);
        }
    };
    
    const onBtnClick = (data) => {
        console.log(data);
        console.log("onBtnClick");

        navigate("/project/ProjectOutordAprvDetail", { state: {
            prjctId: data.prjctId,
        }})
    }

    return (
        <div className="container">
            <div
                className="title p-1"
                style={{ marginTop: "20px", marginBottom: "10px" }}
            >
                <h1 style={{ fontSize: "40px" }}>외주비용승인</h1>
            </div>
            <div className="col-md-10 mx-auto" style={{ marginBottom: "10px" }}>
                <span>* 프로젝트를 조회합니다.</span>
            </div>
            <div className="wrap_search" style={{ marginBottom: "20px" }}>
                <SearchPrjctSet callBack={searchHandle} props={searchParams} />
            </div>
            <div>
                검색된 건 수 : {totalItems} 건
            </div>
            <CustomTable keyColumn={keyColumn} columns={tableColumns} values={values} paging={true} onClick={onBtnClick}/>
        </div>
    );

}
export default ProjectOutordAprv;