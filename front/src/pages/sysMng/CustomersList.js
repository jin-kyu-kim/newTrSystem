import { useState, useEffect, useCallback } from "react";

import ApiRequest from '../../utils/ApiRequest';
import CustomersJson from './CustomersJson.json';
import CustomTable from "../../components/unit/CustomTable";
import CustomHorizontalTable from '../../components/unit/CustomHorizontalTable';

import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { Button } from "devextreme-react";
import SearchCustomersSet from "components/composite/SearchCustomersSet"
import RowCustomersSet from "components/composite/RowCustomersSet"


const CustomersList = () => {

    const [values, setValues] = useState([]);

    
  const [baseInfoData, setBaseInfoData] = useState([]);
    //로우 클릭했을때 넣을 데이터 셋
    const [oneData, setOneData] = useState([]);
    const [param, setParam] = useState({});

    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    const { keyColumn, queryId, tableColumns, searchParams, Cnsrtm } = CustomersJson;
    // const [json, setJson] = useState(CustomersJson);
    
    useEffect(() => {
        console.log(CustomersJson);
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
            // console.log(response);
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
        values.map((oneData) => {
            if (oneData.ctmmnyId === e.data.ctmmnyId) {
                const headers = oneData.ctmmnyId 
                const updatedData = { ...oneData };
                setOneData(updatedData);
                console.log("Clicked data:", headers);
                console.log("Clicked data:", updatedData);
            }
        });
    };

    return (
        <div className="container">
            <div
                className="title p-1"
                style={{ marginTop: "20px", marginBottom: "10px" }}
            >
                <h1 style={{ fontSize: "40px" }}>고객사 관리</h1>
            </div>
            <div className="col-md-10 mx-auto" style={{ marginBottom: "10px" }}>
                <span>* 고객사를 조회합니다.</span>
            </div>
            <div style={{ marginBottom: "20px" }}>
                <SearchCustomersSet callBack={searchHandle} props={searchParams} /> 
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

            <div>
                <div>고객사정보를 입력/수정합니다.</div>
                <CustomHorizontalTable headers={Cnsrtm} column={oneData}/>   
            </div>
            <div style={{ marginBottom: "20px" }}>
            <div>다시그림</div>
                <RowCustomersSet callBack={searchHandle} props={setOneData} />


            </div>
             
        </div>
            
    );
};

export default CustomersList;