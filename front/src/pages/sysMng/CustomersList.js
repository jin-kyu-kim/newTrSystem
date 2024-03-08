import { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";

import SearchInfoSet from 'components/composite/SearchInfoSet';
import CustomTable from 'components/unit/CustomTable';
import ApiRequest from '../../utils/ApiRequest';
import SysMng from './SysMngJson.json';

const CustomersList = () => {
    const [values, setValues] = useState([]);
    const [param, setParam] = useState({}); // 검색
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(20);
    const { keyColumn, queryId, tableColumns, searchInfo } = SysMng.customersJson;

    useEffect(() => {
        if (!Object.values(param).every((value) => value === "")) {
            pageHandle();
        }
    }, [param]);

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

    const handleYnVal = async (idColumn, useYn) => {
        const ynParam = [
            { tbNm: "CTMMNY_INFO" },
            { useYn: useYn },
            { ctmmnyId: idColumn } 
        ];
        try {
            const response = await ApiRequest('/boot/common/commonUpdate', ynParam);
        } catch (error) {
            console.log(error)
        }
    }

    const onEditRow = async (editMode, e) => {
        const editParam = [{tbNm: "CTMMNY_INFO"}];
        let editInfo = {};
        switch (editMode){
            case 'insert':
                editParam[1] = e.data;
                editInfo = {url:'commonInsert', complete:'저장'}
            break;
            case 'update':
                editParam[1] = e.newData;
                editParam[2] = {ctmmnyId: e.key};
                editInfo = {url:'commonUpdate', complete:'수정'}
            break;
            case 'delete':
                editParam[1] = {ctmmnyId: e.key};
                editInfo = {url:'commonDelete', complete:'삭제'}
            break;
        }
        try{
            const response = await ApiRequest('/boot/common/' + editInfo.url, editParam);
            response === 1 ? alert(editInfo.complete + "되었습니다.") : alert(editInfo.complete + "에 실패했습니다.")
        } catch(error){
            console.log(error)
        }
    }

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
                <SearchInfoSet callBack={searchHandle} props={searchInfo} />
            </div>

            <div>검색된 건 수 : {totalItems} 건</div>
            <div style={{ marginBottom: '100px' }}>
                <CustomTable
                    keyColumn={keyColumn}
                    columns={tableColumns}
                    values={values}
                    handleYnVal={handleYnVal}
                    editRow={true}
                    onEditRow={onEditRow}
                    pageSize={pageSize}
                    paging={true}
                />
            </div>
        </div>
    );
};
export default CustomersList;