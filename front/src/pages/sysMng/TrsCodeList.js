import { useState, useEffect, useCallback } from "react";

import ApiRequest from '../../utils/ApiRequest';
import TrsCodeJson from './TrsCodeJson.json';
//import TrsCodeChildJson from './TrsCodeJson.json';
import CustomTable from "../../components/unit/CustomTable";


import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { Button } from "devextreme-react";
import SearchTrsCodeSet from "components/composite/SearchTrsCodeSet"


const TrsCodeList = () => {

    const [values, setValues] = useState([]);
    const [param, setParam] = useState({});
    const [childCode, setChildCode] = useState({});

    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    const navigate = useNavigate();

    const { keyColumn, queryId, tableColumns, searchParams, popup } = TrsCodeJson;

    
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
    // useEffect(() => {
    //     const childCodeData = async () => {
    //       const child = [ 
    //         { upCdValue: "upCdValue" }, 
    //      ]; 
    //       try {
    //         const response = await ApiRequest("/boot/common/queryIdSearch", param);
    //         setChildCode(response[0]);     
    //       } catch (error) {
    //         console.error('Error fetching data', error);
    //       }
    //     };
    //     childCodeData();
    //   }, []);
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
    


     const onRowDblClick = (e) => {
    //     const clickedCodeValue = e.data.parentCdValue;
    //     setSelectedCode(clickedCodeValue);
       };

    return (
        <div className="container">
            <div
                className="title p-1"
                style={{ marginTop: "20px", marginBottom: "10px" }}
            >
                <h1 style={{ fontSize: "40px" }}>권한코드</h1>
            </div>
            <div className="col-md-10 mx-auto" style={{ marginBottom: "10px" }}>
                <span>* 권한코드를 조회합니다.</span>
            </div>
            <div style={{ marginBottom: "20px" }}>
                <SearchTrsCodeSet callBack={searchHandle} props={searchParams} /> 
            </div>

            <div>검색된 건 수 : {totalItems} 건</div>
            <CustomTable
                keyColumn={keyColumn}
                pageSize={pageSize}
                columns={tableColumns}
                values={values}
                onRowDblClick={onRowDblClick}
                paging={true}
            />
        </div>
        
    );
}
export default TrsCodeList;