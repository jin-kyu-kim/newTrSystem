import React, { useState, useEffect } from "react";
import EmpCultHealthCostManageJson from "./EmpCultHealthCostManageJson.json";
import ApiRequest from "../../utils/ApiRequest";
import { Workbook } from "exceljs";
import { exportDataGrid } from "devextreme/excel_exporter";
import { saveAs } from 'file-saver';
import { Button } from "devextreme-react";
import { useNavigate } from "react-router-dom";
import { Popup } from "devextreme-react";
import { useModal } from "../../components/unit/ModalContext";
import SearchInfoSet from "components/composite/SearchInfoSet";
import EmpCultHealthCostManagePop from "./EmpCultHealthCostManagePop";
import EmpCultHealthCostDetailPop from "./EmpCultHealthCostDetailPop";
import CustomEditTable from "components/unit/CustomEditTable";
import "./EmpCultHealthCostManage.css";

const EmpCultHealthCostManage = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState([]);
  const { keyColumn, queryId, tableColumns, wordWrap, searchInfo, groupingColumn } = EmpCultHealthCostManageJson;
  const [isManagePopupVisible, setIsManagePopupVisible] = useState(false);
  const [isDetailPopupVisible, setIsDetailPopupVisible] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState();
  const [selectedItem, setSelectedItem] = useState([]);
  const { handleOpen } = useModal();

  let now = new Date();
  let firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  let lastMonth = new Date(firstDayOfMonth.setDate(firstDayOfMonth.getDate() - 1)); // 전월 말일
  const [param, setParam] = useState({
    "empFlnm": null,
    "empno": null,
    "clturPhstrnActMngYm": lastMonth.getFullYear() + ('0' + (lastMonth.getMonth() + 1)).slice(-2),
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
    if (initParam.year) {
      setParam({
        ...param,
        empFlnm: initParam.empFlnm !== undefined ? initParam.empFlnm : null,
        empno: initParam.empno !== undefined ? initParam.empno : null,
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
    setDisabled(response[0]?.ddlnYn === 'Y');
  }

  const handleMove = () => {
    navigate("/fnnrMng/EmpCultHealthCostManageDeadLine");
  }

  const handleDeadLine = async () => {
    const btnChk = window.confirm(param.clturPhstrnActMngYm + " 문화체련비를 마감하시겠습니까?")
    if (btnChk && validateMonth()) {
      const updateParam = [
        { tbNm: "CLTUR_PHSTRN_ACT_MNG" },
        { ddlnYn: "Y" },
        { clturPhstrnActMngYm: param.clturPhstrnActMngYm }
      ]
      const response = await ApiRequest("/boot/common/commonUpdate", updateParam);
      if (response > 0) {
        searchDdlnYn();
        handleOpen("마감되었습니다.")
      }
    }
  };

  const validateMonth = () => {
    const errors = [];
    let paramMonth = new Date(parseInt(param.clturPhstrnActMngYm.substring(0, 4), 10),
      parseInt(param.clturPhstrnActMngYm.substring(4, 6), 10) - 1, 1);
    if (paramMonth > now) {
      handleOpen("계산과 마감이 불가능한 월입니다.")
      errors.push('Invalid month');
    }
    return errors.length === 0;
  };

  const padNumber = (num) => {
    return num.toString().padStart(2, '0');
  };

  const formattedDateTime = `${now.getFullYear()}_` +
    `${padNumber(now.getMonth() + 1)}_` +
    `${padNumber(now.getDate())}`

  const onExporting = (e) => {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Main sheet');
    exportDataGrid({
      component: e.component,
      worksheet,
      autoFilterEnabled: true,
    }).then(() => {
      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), '문화체련비 관리 목록' + formattedDateTime + '.xlsx');
      });
    });
  };

  const onRowClick = (e) => {
    if (e.rowType === 'group') {
      if (e.data && e.data.key) {
        setSelectedRowData({
          empId: e.data.items[0].empId,
          empFlnm: e.data.key.substring(9).trim()
        });
        setIsManagePopupVisible(true);
      } else {
        console.error('데이터가 존재하지 않습니다.');
      }
    }
  };

  const onBtnClick = (button, rowData) => {
    setSelectedRowData({
      empId: rowData.data.empId,
      empFlnm: rowData.data.empFlnm.substring(9).trim(),
      clturPhstrnSeCd: rowData.data.clturPhstrnSeCd
    });
    setIsDetailPopupVisible(true);
  }

  const closeManagePopup = () => {
    pageHandle();
    setIsManagePopupVisible(false);
  };

  const closeDetailPopup = () => {
    pageHandle();
    setIsDetailPopupVisible(false);
  };

  const handleCalculate = async () => {
    const btnChk = window.confirm(param.clturPhstrnActMngYm + " 문화체련비 지급액을 계산하시겠습니까?")
    if (btnChk && validateMonth()) {
      try {
        const response = await ApiRequest("/boot/financialAffairMng/updateDpstAmt", {
          "clturPhstrnActMngYm": param.clturPhstrnActMngYm
        });
        if (response) {
          handleOpen('저장되었습니다.');
          pageHandle();
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSave = async () => {
    const btnChk = window.confirm("작성한 지급금액을 저장하시겠습니까?")
    if (btnChk && validateMonth()) {
      try {
        const response = await ApiRequest("/boot/financialAffairMng/saveDpstAmt", selectedItem);
        if (response) {
          handleOpen('저장되었습니다.');
          pageHandle();
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  const onSelection = (e) => {
    setSelectedItem(e.selectedRowsData);
  };

  const validateNumberBox = (data, value) => {
    const errors = [];
    if (value > data.cyfdAmt + data.clmAmt || value > 200000) {
      handleOpen('지급 가능한 금액보다 큽니다.');
      errors.push('Too large amount');
    }
    return errors.length === 0;
  };

  return (
    <div>
      <style>
        {`
        .dx-datagrid-group-opened {
          display: none !important;
        }
      `}
      </style>

      <div>
        <div style={{display: 'flex'}}>
          <div className='title'>문화체련비 관리 목록</div>
          <div style={{ marginTop: "7px", marginLeft: "20px" }}>
            <Button onClick={handleCalculate} disabled={disabled} type='default'>지급 계산</Button>
            <Button onClick={handleMove} style={{ marginLeft: "10px" }}>마감 목록</Button>
            <Button onClick={handleDeadLine} disabled={disabled} style={{ marginLeft: "10px" }} type='danger'>전체 마감</Button>
          </div>
        </div>
        <div className="title-desc">* 직원의 문화체련비를 조회 합니다.</div>

        <div className='EmpCultHealthCostManage'>
          <div style={{ marginBottom: "20px" }}>
            <SearchInfoSet props={searchInfo} callBack={searchHandle} />
          </div>

          <CustomEditTable
            keyColumn={keyColumn}
            columns={tableColumns}
            values={values}
            paging={false}
            summary={true}
            groupingColumn={groupingColumn}
            excel={true}
            onExcel={onExporting}
            wordWrap={wordWrap}
            onRowClick={onRowClick}
            noEdit={true}
            onBtnClick={onBtnClick}
            onSelection={onSelection}
            validateNumberBox={validateNumberBox}
          />
        </div>
        <Button onClick={handleSave} disabled={disabled} type='default' style={{ width: "100px" }}>저장</Button>
      </div>

      <Popup
        width={700}
        height={600}
        visible={isManagePopupVisible}
        onHiding={closeManagePopup}
        showCloseButton={true}
      >
        <EmpCultHealthCostManagePop value={selectedRowData} year={param.clturPhstrnActMngYm.substring(0, 4)} />
      </Popup>
      <Popup
        width={1000}
        height={700}
        visible={isDetailPopupVisible}
        onHiding={closeDetailPopup}
        showCloseButton={true}
      >
        <EmpCultHealthCostDetailPop value={selectedRowData} ym={param.clturPhstrnActMngYm} disabled={disabled} />
      </Popup>
    </div>
  );
};
export default EmpCultHealthCostManage;