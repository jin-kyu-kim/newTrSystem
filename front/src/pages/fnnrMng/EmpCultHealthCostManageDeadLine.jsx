import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import  EmpCultHealthCostManageJson from "./EmpCultHealthCostManageDeadLineJson.json";
import ApiRequest from "../../utils/ApiRequest";
import { Workbook } from "exceljs";
import { exportDataGrid } from "devextreme/excel_exporter";
import { saveAs } from 'file-saver';
import SearchInfoSet from "components/composite/SearchInfoSet";
import { Button } from "devextreme-react";
import CustomEditTable from "../../components/unit/CustomEditTable";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../components/unit/ModalContext";

const EmpCultHealthCostManage = () => {
  const [values, setValues] = useState([]);
  const { keyColumn, queryId, tableColumns, summaryColumn , wordWrap, searchInfo } = EmpCultHealthCostManageJson;
  const navigate = useNavigate();
  const { handleOpen } = useModal();
  let now = new Date();
  let firstDayOfMonth = new Date( now.getFullYear(), now.getMonth() , 1 );
  let lastMonth = new Date(firstDayOfMonth.setDate( firstDayOfMonth.getDate() - 1 )); // 전월 말일
  const [param, setParam] = useState({
    "empFlnm": null,
    "empno": null,
    "clturPhstrnActMngYm": lastMonth.getFullYear()+('0' + (lastMonth.getMonth() + 1)).slice(-2),
    "queryId": queryId
  });
  const [disabled, setDisabled] = useState();

  useEffect(() => {
    if (!Object.values(param).every((value) => value === "")) {
      pageHandle();
      searchDdlnYn();
    }
  }, [param]);

  const searchHandle = async (initParam) => {
    if(initParam.year){
      setParam({
        ...param,
        empFlnm: initParam.empFlnm !== undefined? initParam.empFlnm : null,
        empno: initParam.empno!== undefined? initParam.empno : null,
        clturPhstrnActMngYm: initParam.year + initParam.month,
      });
    }
  };

  const pageHandle = async () => {
    try {
      const response = await ApiRequest("/boot/common/queryIdSearch", param);
      setValues(response);
    } catch (error) {
      console.error(error);
    }
  };

  const searchDdlnYn = async () => {
    const response = await ApiRequest('/boot/common/commonSelect', [
      { tbNm: "CLTUR_PHSTRN_ACT_MNG" }, { clturPhstrnActMngYm: param.clturPhstrnActMngYm }
    ]);
    setDisabled(response[0]?.ddlnYn === 'N');
  }

  const handleMove = () => {
     navigate("/fnnrMng/EmpCultHealthCostManage");
  }

  const handleDeadLine = async () => {
    const btnChk = window.confirm(param.clturPhstrnActMngYm + " 문화체련비 마감을 취소하시겠습니까?")
    if (btnChk) {
      const updateParam =[
        { tbNm: "CLTUR_PHSTRN_ACT_MNG" },
        { ddlnYn: "N" },
        { clturPhstrnActMngYm: param.clturPhstrnActMngYm}
      ]
      const response = await ApiRequest("/boot/common/commonUpdate", updateParam);
      if (response > 0 ) {
        searchDdlnYn();
        handleOpen("마감이 취소되었습니다.")
      }
    }
  };

  const onExporting = (e) => {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Main sheet');

    exportDataGrid({
      component: e.component,
      worksheet,
      autoFilterEnabled: true,
      customizeCell: ({ gridCell, excelCell }) => {
        // 모든 셀의 테두리를 검은색으로 지정
        excelCell.border = {
          top: { style: 'thin', color: { argb: 'FF000000' } },
          left: { style: 'thin', color: { argb: 'FF000000' } },
          bottom: { style: 'thin', color: { argb: 'FF000000' } },
          right: { style: 'thin', color: { argb: 'FF000000' } }
        };

        // 헤더를 제거
        if (gridCell.rowType === 'header') {
          gridCell.skip = true;
        }
      },
    }).then(() => {
      worksheet.spliceRows(1, 1);

      worksheet.eachRow((row, rowIndex) => {
          row.getCell('G').value = row.getCell('E').value;
          row.getCell('E').value = null;
          row.getCell('F').value = null;
        row.getCell('G').border = {
          top: { style: 'thin', color: { argb: 'FF000000' } },
          left: { style: 'thin', color: { argb: 'FF000000' } },
          bottom: { style: 'thin', color: { argb: 'FF000000' } },
          right: { style: 'thin', color: { argb: 'FF000000' } }
        };

        // 원래 E와 F 셀에도 테두리 추가
        row.getCell('E').border = {
          top: { style: 'thin', color: { argb: 'FF000000' } },
          left: { style: 'thin', color: { argb: 'FF000000' } },
          bottom: { style: 'thin', color: { argb: 'FF000000' } },
          right: { style: 'thin', color: { argb: 'FF000000' } }
        };

        row.getCell('F').border = {
          top: { style: 'thin', color: { argb: 'FF000000' } },
          left: { style: 'thin', color: { argb: 'FF000000' } },
          bottom: { style: 'thin', color: { argb: 'FF000000' } },
          right: { style: 'thin', color: { argb: 'FF000000' } }
        };
      });

      // 각 열의 최대 너비를 계산하여 설정
      worksheet.columns.forEach(column => {
        let maxLength = 10; // 최소 너비 설정
        column.eachCell({ includeEmpty: true }, cell => {
          const columnLength = cell.value ? cell.value.toString().length : 10;
          if (columnLength > maxLength) {
            maxLength = columnLength;
          }
        });
        column.width = maxLength + 2; // 약간의 여백 추가
      });

      worksheet.pageSetup = {
        paperSize: 9, // A4
        fitToWidth: 1,
        fitToHeight: 0,
        margins: {
          left: 0.25,   // 왼쪽 여백
          right: 0.25,  // 오른쪽 여백
          top: 0.25,    // 위쪽 여백
          bottom: 0.25, // 아래쪽 여백
          header: 0.1,  // 헤더 여백
          footer: 0.1   // 풋터 여백
        },
        scale: 75,
      };

      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), '문화 체련비 마감목록_' + param.clturPhstrnActMngYm + '.xlsx');
      });
    });

    e.cancel = true; // 기본 동작 취소
  };

  return (
    <div>
      <div
        className="title p-1"
        style={{ marginTop: "20px", marginBottom: "10px",  display: "flex"}}
      >
        <h1 style={{ fontSize: "40px" }}>문화체련비 마감 목록</h1>
        <div style={{marginTop: "7px", marginLeft: "20px"}}>
          <Button onClick={handleMove}>관리 목록</Button>
          <Button onClick={handleDeadLine} disabled={disabled} style = {{marginLeft: "10px"}} type='danger'>마감 취소</Button>
        </div>
      </div>
      <div className="col-md-10 mx-auto" style={{ marginBottom: "10px" }}>
        <span>* 직원의 문화체련비 마감 목록을 조회 합니다.</span>
      </div>

      <div>
        <div style={{ marginBottom: "20px" }}>
          <SearchInfoSet props={searchInfo} callBack={searchHandle}/>
        </div>

        <CustomEditTable
          keyColumn={keyColumn}
          columns={tableColumns}
          values={values}
          paging={true}
          excel={true}
          onExcel={onExporting}
          wordWrap={wordWrap}
          noEdit={true}
          summary={true}
          summaryColumn={summaryColumn}
        />
    </div>
</div>
  );
};

export default EmpCultHealthCostManage;
