import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";

import ApiRequest from "../../utils/ApiRequest";
import NoticeJson from "../infoInq/NoticeJson.json";
import CustomTable from "../../components/unit/CustomTable";
import SearchInfoSet from 'components/composite/SearchInfoSet';

const NoticeList = () => {
    const [values, setValues] = useState([]);
    const [param, setParam] = useState({});
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const navigate = useNavigate();

    const { keyColumn, queryId, tableColumns, searchInfo } = NoticeJson;
    
    useEffect(() => {
        if (!Object.values(param).every((value) => value === "")) {
            pageHandle();
        }
    }, [param]);

    // 검색으로 조회할 때
    const searchHandle = async (initParam) => {
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
                setTotalItems(response[0].totalItems);
            } else {
                setTotalItems(0);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const onRowDblClick = (e) => {
        navigate("/infoInq/NoticeDetail", 
                  {state: { id: e.key }})
      };

    return (
        <div className="container">
            <div
                className="title p-1"
                style={{ marginTop: "20px", marginBottom: "10px" }}
            >
                <h1 style={{ fontSize: "40px" }}>공지사항</h1>
            </div>
            <div className="col-md-10 mx-auto" style={{ marginBottom: "10px" }}>
                <span>* 공지사항을 조회합니다.</span>
            </div>
            <div style={{ marginBottom: "20px" }}>
                <SearchInfoSet 
                    props={searchInfo}
                    callBack={searchHandle}
                /> 
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
export default NoticeList;