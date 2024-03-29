import React, { useState, useEffect, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import  EmpCultHealthCostManageJson from "./EmpCultHealthCostManageJson.json";
import ApiRequest from "../../utils/ApiRequest";
import CustomTable from "components/unit/CustomTable";
import { Workbook } from "exceljs";
import { exportDataGrid } from "devextreme/excel_exporter";
import { saveAs } from 'file-saver';
import SearchInfoSet from "components/composite/SearchInfoSet";
import { Button } from "devextreme-react";
import { useNavigate } from "react-router-dom";
import { Popup } from "devextreme-react";
import EmpCultHealthCostManagePop from "./EmpCultHealthCostManagePop";

const EmpCultHealthCostManage = () => {
  const [values, setValues] = useState([]);
  const [param, setParam] = useState({});
  const { keyColumn, queryId, tableColumns, prjctColumns , summaryColumn , wordWrap, searchInfo } = EmpCultHealthCostManageJson;
  const navigate = useNavigate();
  const [isGroupPopupVisible, setIsGroupPopupVisible] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);


  useEffect(() => {
  }, []);

  const pageHandle = async (initParam) => {
    console.log(initParam)
    

    const updateParam = {
      ...initParam,
      queryId: queryId,
    }
   
    
    try {
     
      const response = await ApiRequest("/boot/common/queryIdSearch", updateParam);
    
        setValues(response);
     
    } catch (error) {
      console.log(error);
    }
  };


 const handleMove=() => {
   
    navigate("/fnnrMng/EmpCultHealthCostManageDeadLine");
}


  const handleDeadLine = () => {
    const btnChk = window.confirm("문화체련비를 마감하시겠습니까?")
    if (btnChk) {
      alert("마감되었습니다.")
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
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), '문화체련비 관리 목록'+formattedDateTime+'.xlsx');
      });
    });
  };

  const onRowClick = (e) => {   //직원목록 로우 클릭 이벤트
    if (e.rowType === 'group') {
      console.log("그룹 모달이 과연 될까? ㅋ")
      setSelectedGroup(values); // 선택한 그룹 정보를 상태 변수에 저장
      setIsGroupPopupVisible(true);
    }
   
  };

  const closeGroupPopup = () => {
    setSelectedGroup(null); // 선택한 그룹 정보 초기화
    setIsGroupPopupVisible(false);
  };









  return (
    <div className="container">
    <div 
      className="title p-1"
      style={{ marginTop: "20px", marginBottom: "10px",  display: "flex"}}
    >
      <h6 style={{ fontSize: "40px" }}>문화체련비 관리 목록</h6>
      <div style={{marginTop: "7px", marginLeft: "20px"}}><Button onClick={handleMove}>마감 목록</Button> <Button onClick={handleDeadLine} style = {{backgroundColor: "#B40404", color: "#fff"}}>  전체 마감</Button> </div>
    </div>
    <div className="col-md-10 mx-auto" style={{ marginBottom: "10px" }}>
      <span>* 직원의 문화체련비를 조회 합니다.</span>
    </div>

    <div>
    <div style={{ marginBottom: "20px" }}>
    <SearchInfoSet 
                    props={searchInfo}
                  callBack={pageHandle}
                /> 
      </div>
     
      <Popup
  visible={isGroupPopupVisible}
  onHiding={closeGroupPopup}
  width={700}
  height={600}
> 

<Button text="닫기" onClick={closeGroupPopup} />

  <EmpCultHealthCostManagePop empId = {"0c4a515e-11d1-78e7-3ade-4f85fcaf1472"} />
  {/* 선택한 그룹의 정보 출력 */}
</Popup>
      <CustomTable
        keyColumn={keyColumn}
        columns={tableColumns}
        values={values}
        paging={true}
        excel={true}
        onExcel={onExporting}
        wordWrap={wordWrap}
        onRowClick={onRowClick}
       
      />  




        </div>
</div>
  );
};

export default EmpCultHealthCostManage;
