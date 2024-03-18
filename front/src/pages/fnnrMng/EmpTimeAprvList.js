import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import  EmpTimeAprvListJson from "./EmpTimeAprvListJson.json";
import ApiRequest from "../../utils/ApiRequest";
import CustomFivotTable from "components/unit/CustomFivotTable";
import SearchPrjctCostSet from "../../components/composite/SearchPrjctCostSet";
import { Workbook } from "exceljs";
import { saveAs } from 'file-saver';
import { exportDataGrid } from 'devextreme/excel_exporter';
import CustomTable from "components/unit/CustomTable";

function EmpTimeAprvList() {
  const [values, setValues] = useState([]);
  const [param, setParam] = useState({});

  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const { keyColumn, queryId, tableColumns, searchParams } = EmpTimeAprvListJson;

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
        setTotalItems(0);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const padNumber = (num) => {
    return num.toString().padStart(2, '0');
};
  const currentDateTime = new Date();
        const formattedDateTime = `${currentDateTime.getFullYear()}_`+
            `${padNumber(currentDateTime.getMonth() + 1)}_`+
            `${padNumber(currentDateTime.getDate())}`

  const onExporting = (e) => {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Main sheet');
    exportDataGrid({
      component: e.component,
      worksheet,
      autoFilterEnabled: true,
    }).then(() => {
      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), '근무시간 승인내역'+formattedDateTime+'.xlsx');
      });
    });
  };

  return (
    <div className="container">
      <div
        className="title p-1"
        style={{ marginTop: "20px", marginBottom: "10px" }}
      >
        <h1 style={{ fontSize: "40px" }}>근무시간 승인내역 조회</h1>
      </div>
      <div className="col-md-10 mx-auto" style={{ marginBottom: "10px" }}>
        <span>* 근무시간 승인내역을 조회합니다.</span>
      </div>
      <div style={{ marginBottom: "20px" }}>
      <SearchPrjctCostSet callBack={searchHandle} props={searchParams} />
      </div>
      <CustomTable
        keyColumn={keyColumn}
        pageSize={pageSize}
        columns={tableColumns}
        values={values}
        paging={true}
        excel={true}
        onExcel={onExporting}
      />
      
    </div>
  );
};

export default EmpTimeAprvList;