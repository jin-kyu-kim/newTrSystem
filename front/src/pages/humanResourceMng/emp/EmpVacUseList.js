import { useEffect, useState, } from "react";

import EmpVacUseListJson from "./EmpVacUseListJson.json";
import ApiRequest from "../../../utils/ApiRequest";
import CustomTable from "../../../components/unit/CustomTable";
// import SearchEmpSet from "../../../components/composite/SearchEmpSet";
import "react-datepicker/dist/react-datepicker.css";

const EmpVacUseList = () => {


    const [values, setValues] = useState([]);
    const [param, setParam] = useState([]);

    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    
    
    const {keyColumn, queryId, tableColumns, searchParams} = EmpVacUseListJson;

    useEffect(() => {
        if(!Object.values(param).every((value) => value === "")) {
            pageHandle();
        };
    }, [param]);

    // 검색 조회
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
    }

    // 페이징 처리
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        setParam({
            ...param,
            currentPage: newPage + 1,
            startVal: (newPage - 1) * pageSize,
        });
    };

    // 페이지 사이즈 변경
    const handlePageSizeChange = (e) => {
        setPageSize(e.value * 1);
        setParam({
            ...param,
            currentPage: 1,
            startVal: 0,
            pageSize: e.value * 1,
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


    return (
        <div className="container">
            <div
                className="title p-1"
                style={{ marginTop: "20px", marginBottom: "10px" }}
            >
                <h1 style={{ fontSize: "30px" }}>휴가사용내역</h1>

            </div>
            <div className="col-md-10 mx-auto" style={{ marginBottom: "10px" }}>
            <span>* 직원의 휴가정보를 조회합니다.</span>  
            </div>
            <div className="wrap_search" style={{ marginBottom: "20px" }}>
           
            {/* <SearchEmpSet callBack={searchHandle} props={searchParams} /> */}
        
            </div>
            <div>
                검색된 건 수 : {totalItems} 건
            </div>
            <CustomTable keyColumn={keyColumn} columns={tableColumns} values={values} paging={true} />
        </div>
    );
};

export default EmpVacUseList;