import React, { useState, useEffect } from "react";
import EmpTRCostTotalJson from "./EmpTRCostTotalJson.json";
import ApiRequest from "../../utils/ApiRequest";
import CustomTable from "components/unit/CustomTable";
import { useLocation } from "react-router-dom";
import { Workbook } from "exceljs";
import { exportDataGrid } from "devextreme/excel_exporter";
import { saveAs } from 'file-saver';
import { CheckBox } from 'devextreme-react/check-box';
import { useModal } from "../../components/unit/ModalContext";
import Button from "devextreme-react/button";
import SearchInfoSet from "components/composite/SearchInfoSet";

const EmpTRCostTotal = () => {
  const [values, setValues] = useState([]);
  const [param, setParam] = useState({});
  const { keyColumn, queryId, nameColumns, prjctColumns, summaryColumn, smallSummaryColumn, searchInfo, groupDataProject, groupDataName } = EmpTRCostTotalJson;
  const [checkBox1Checked, setCheckBox1Checked] = useState(false);
  const [checkBox2Checked, setCheckBox2Checked] = useState(false);
  const { handleOpen } = useModal();
  const [searchIsVal, setSearchIsVal] = useState(false); //검색버튼 클릭시만 활성화용
  const location = useLocation();
  const admin = location.state ? location.state.admin : undefined;
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getDate() > 15 ? date.getMonth() + 1 : date.getMonth();
  const monthVal = month < 10 ? "0" + month : month;
  const aplyYm = admin != undefined ? admin.aplyYm : year + monthVal;
  const aplyOdr = admin != undefined ? admin.aplyOdr : date.getDate() > 15 ? "1" : "2";
  const [loading, setLoading] = useState(false);


  const handleCheckBox1Change = (e) => {
    setCheckBox1Checked(e.value);
    if (e.value) {
      setCheckBox2Checked(false);
      setValues([])
    }
  };

  const handleCheckBox2Change = (e) => {
    setCheckBox2Checked(e.value);
    if (e.value) {
      setCheckBox1Checked(false);
      setValues([])
    }
  };

  useEffect(() => {
    setCheckBox1Checked(true)
    setValues([])
  }, []);

  useEffect(() => {
    if (searchIsVal) {
      if (Object.values(param).every(value => value !== undefined && !Number.isNaN(value))) {
        pageHandle();
        setSearchIsVal(false);
      }
    }
  }, [param])

  // 검색으로 조회할 때
  const searchHandle = async (initParam) => {
    setParam({
      ...initParam,
      aplyYm: initParam?.year + initParam?.month,
      aplyOdr: initParam?.aplyOdr,
      queryId: queryId,
    });
    setSearchIsVal(true);
  };

  const pageHandle = async () => {
    try {
      const response = await ApiRequest("/boot/common/queryIdSearch", param);
      setValues(response);
    } catch (error) {
      console.log(error);
    }
  };

  const padNumber = (num) => {
    return num.toString().padStart(2, '0');
  };
  const currentDateTime = new Date();
  const formattedDateTime = `${currentDateTime.getFullYear()}_` +
    `${padNumber(currentDateTime.getMonth() + 1)}_` +
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
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), '근무시간 경비 통합승인내역' + formattedDateTime + '.xlsx');
      });
    });
  };

  const executeCostUpdate = async () => {
    setLoading(true);
    try {
      const response = await ApiRequest("/boot/batchSkll/executeCostUpdate");
      if (response >= 0) {
        handleOpen("실행원가 정산이 완료되었습니다.");
      } else {
        handleOpen("실행원가 정산이 실패하였습니다. 관리자에게 문의하세요.");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const groupingCustomizeText = (e) => {
    let result = values?.filter( value => value.empId  === e.value );
    return result[0].empFlnm;
  }

  return (
    <div>
      {loading && (
        <div className="loading-overlay">
          요청 중입니다...
        </div>
      )}
      <div className="title">근무시간,경비 통합조회</div>
      <div className="title-desc">* 근무시간, 경비 통합내역을 조회합니다.</div>
      <div>
        <div className="wrap_search" style={{ marginBottom: "20px" }}>
          <SearchInfoSet props={searchInfo} callBack={searchHandle} />
        </div>
        <CheckBox
          text="프로젝트 별"
          value={checkBox1Checked}
          onValueChanged={handleCheckBox1Change}
        />

        <CheckBox style={{ marginLeft: "30px" }}
          value={checkBox2Checked}
          onValueChanged={handleCheckBox2Change}
          text="이름 별"
        />
        <Button style={{ marginLeft: "20px" }}
          onClick={executeCostUpdate}
        > 실행원가 정산</Button>

        {checkBox1Checked && (
          <CustomTable
            keyColumn={keyColumn}
            columns={prjctColumns}
            values={values}
            summary={true}
            summaryColumn={summaryColumn}
            smallSummaryColumn={smallSummaryColumn}
            grouping={true}
            groupingData={groupDataProject}
            excel={true}
            wordWrap={true}
            onExcel={onExporting}
          />
        )}


        {checkBox2Checked && (
          <CustomTable
            keyColumn={keyColumn}
            columns={nameColumns}
            values={values}
            paging={true}
            summary={true}
            summaryColumn={summaryColumn}
            smallSummary={true}
            smallSummaryColumn={smallSummaryColumn}
            grouping={true}
            groupingData={groupDataName}
            groupingCustomizeText={groupingCustomizeText}
            excel={true}
            onExcel={onExporting}
          />
        )}
      </div>
    </div>
  );
};

export default EmpTRCostTotal;
