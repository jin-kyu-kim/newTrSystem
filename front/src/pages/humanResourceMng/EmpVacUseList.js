import { useEffect, useState, } from "react";

import EmpVacUseListJson from "./EmpVacUseListJson.json";
import ApiRequest from "../../utils/ApiRequest";
import "react-datepicker/dist/react-datepicker.css";
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import { exportDataGrid } from 'devextreme/excel_exporter';
import CustomTable from "components/unit/CustomTable";
import SearchInfoSet from "components/composite/SearchInfoSet";

const EmpVacUseList = () => {
    const [values, setValues] = useState([]);
    const [param, setParam] = useState([]);
    const [totalItems, setTotalItems] = useState(0);

    //=============== JSON데이터 넣어두기=======================================
    const {keyColumn, queryId, tableColumns, searchInfo} = EmpVacUseListJson;
    //=============== 조회=======================================
    useEffect(() => {
        if(!Object.values(param).every((value) => value === "")) {
            pageHandle();
        };
    }, [param]);

    //=============== 검색 조회=======================================
    const searchHandle = async (initParam) => {
        setParam({
            ...initParam,
            vcatnBgngYmd: initParam?.vcatnBgngYmd ?? null,
            vcatnEndYmd: initParam?.vcatnEndYmd ?? null,
            empFlnm: initParam?.empFlnm ?? null,
            queryId: queryId,
        });
    }
    //============== 정보 검색해오기(Back단으로 정보던지기)===========================================
    const pageHandle = async () => {
        try {
            const response = await ApiRequest("/boot/common/queryIdSearch", param);
            setValues(response);
            setTotalItems(response[0].totalItems)
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
            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), '휴가사용내역.xlsx');
          });
        });
      };
    //===========화면 그리는 부분================================================
    return (
            <div style={{ marginLeft: "1%", marginRight: "1%" }}>
            <div className="mx-auto" style={{ marginTop: "20px", marginBottom: "10px" }}>
                  <h1 style={{ fontSize: "30px" }}>휴가사용내역</h1>
            </div>
            <div className="mx-auto" style={{ marginBottom: "10px" }}>
                  <span>* 휴가사용내역을 조회합니다.</span>
            </div>
            {/*----------------서치셋 구간---------------------------------------------------------------- */}
            <div className="box_search" style={{ marginBottom: "20px" }} width="60%" >
            <SearchInfoSet callBack={searchHandle} props={searchInfo} />
            </div>
            {/*----------------서치셋 구간---------------------------------------------------------------- */}
            <div>
                검색된 건 수 : {totalItems} 건
            </div>
            {/*----------------테이블 구간---------------------------------------------------------------- */}
                <CustomTable keyColumn={keyColumn} columns={tableColumns} values={values} paging={true} excel={true} onExcel={onExporting}/> 
            {/*----------------테이블 구간---------------------------------------------------------------- */}   
        </div>
    );
};

export default EmpVacUseList;