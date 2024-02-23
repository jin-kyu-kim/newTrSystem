import { useEffect, useState, } from "react";

import EmpVacUseListJson from "./EmpVacUseListJson.json";
import ApiRequest from "../../../utils/ApiRequest";
import CustomTable from "../../../components/unit/CustomTable";
import SearchEmpVacSet from "../../../components/composite/SearchEmpVacSet";
import "react-datepicker/dist/react-datepicker.css";
import DataGrid, { Column, Pager, Paging, Summary, TotalItem, Export} from "devextreme-react/data-grid";
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import { exportDataGrid } from 'devextreme/excel_exporter';

const EmpVacUseList = () => {

    const [values, setValues] = useState([]);
    const [param, setParam] = useState([]);

    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    
    //=============== JSON데이터 넣어두기=======================================
    const {keyColumn, queryId, tableColumns, searchParams} = EmpVacUseListJson;

    //=============== 최초 렌더링시 조회=======================================
    useEffect(() => {
        if(!Object.values(param).every((value) => value === "")) {
            pageHandle();
        };
        
    }, [param]);

    //=============== 검색 조회=======================================
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

    //=============== 페이징 처리===========================================
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        setParam({
            ...param,
            currentPage: newPage + 1,
            startVal: (newPage - 1) * pageSize,
        });
    };

    //============== 페이지 사이즈 변경=======================================
    const handlePageSizeChange = (e) => {
        setPageSize(e.value * 1);
        setParam({
            ...param,
            currentPage: 1,
            startVal: 0,
            pageSize: e.value * 1,
        });
    };


    //============== 정보 검색해오기(Back단으로 정보던지기)===========================================
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
    //============== 데이터그리드 엑셀로 내보내기===========================================
    const onExporting = (e) => {
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('Main sheet');
        exportDataGrid({
          component: e.component,
          worksheet,
          autoFilterEnabled: true,
        }).then(() => {
          workbook.xlsx.writeBuffer().then((buffer) => {
            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'DataGrid.xlsx');
          });
        });
      };
    
    //============== 테이블 그리기===========================================
    //===========화면 그리는 부분================================================
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
             <SearchEmpVacSet callBack={searchHandle} props={searchParams} />
            </div>
            <div>
                검색된 건 수 : {totalItems} 건
            </div>


            <CustomTable keyColumn={keyColumn} columns={tableColumns} values={values} paging={true}  onExporting={onExporting}>
            <Export enabled={true} /> </CustomTable>
        </div>
    );
};

export default EmpVacUseList;