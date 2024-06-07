import React, { useState, useEffect, useRef } from "react";
import EmpInfoJson from "./EmpInfoJson.json";
import ApiRequest from "utils/ApiRequest";
import { Button } from "devextreme-react";
import { Item, Form, GroupItem, } from "devextreme-react/form";
import CustomEditTable from "components/unit/CustomEditTable";
import printJS from "print-js";

const EmpInfoPop = ({ naviEmpId }) => {
  /*유저세션*/
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [degree, setDegree] = useState([]);
  const componentRef = useRef();

  const { EmpDegree, EmpLanguage, EmpLicense, EmpEduHist, EmpCareer, prjctHist } = EmpInfoJson;

  const EmpDegreeData = { queryId: EmpDegree.queryId, keyColumn: EmpDegree.keyColumn, tableColumns: EmpDegree.tableColumns };
  const EmpLanguageData = { queryId: EmpLanguage.queryId, keyColumn: EmpLanguage.keyColumn, tableColumns: EmpLanguage.tableColumns };
  const EmpLicenseData = { queryId: EmpLicense.queryId, keyColumn: EmpLicense.keyColumn, tableColumns: EmpLicense.tableColumns };
  const EmpEduHistData = { queryId: EmpEduHist.queryId, keyColumn: EmpEduHist.keyColumn, tableColumns: EmpEduHist.tableColumns };
  const EmpCareerData = { queryId: EmpCareer.queryId, keyColumn: EmpCareer.keyColumn, tableColumns: EmpCareer.tableColumns };
  const prjctHistData = { queryId: prjctHist.queryId, keyColumn: prjctHist.keyColumn, tableColumns: prjctHist.tableColumns };

  let empId;

  if (naviEmpId.length !== 0) {
    empId = naviEmpId;
  } else {
    empId = userInfo.empId;
  }

  /* 기본 정보 */
  useEffect(() => {
    pageDegree();
  }, []);

  const pageDegree = async () => {
    const params = [
      { queryId: "infoInqMapper.retrieveEmpBassInfo", empId: empId }
      , { queryId: EmpDegreeData.queryId, empId: empId }
      , { queryId: EmpLanguage.queryId, empId: empId }
      , { queryId: EmpLicense.queryId, empId: empId }
      , { queryId: EmpEduHist.queryId, empId: empId }
      , { queryId: EmpCareer.queryId, empId: empId }
      , { queryId: prjctHist.queryId, empId: empId }
    ]
    try {
      const response = await ApiRequest("/boot/informaiton/empInfo", params);
      if (response.length !== 0) setDegree(response);
    } catch (error) {
      console.log(error);
    }
  };

  const sections = [
    { title: "* 학력", data: degree.EmpDegree, keyColumn: EmpDegreeData.keyColumn, columns: EmpDegreeData.tableColumns },
    { title: "* 외국어능력", data: degree.EmpLanguage, keyColumn: EmpLanguageData.keyColumn, columns: EmpLanguageData.tableColumns },
    { title: "* 자격면허", data: degree.EmpLicense, keyColumn: EmpLicenseData.keyColumn, columns: EmpLicenseData.tableColumns },
    { title: "* 교육이력", data: degree.EmpEduHist, keyColumn: EmpEduHistData.keyColumn, columns: EmpEduHistData.tableColumns },
    { title: "* 경력", data: degree.EmpCareer, keyColumn: EmpCareerData.keyColumn, columns: EmpCareerData.tableColumns },
    { title: "* 프로젝트", data: degree.PrjctHist, keyColumn: prjctHistData.keyColumn, columns: prjctHistData.tableColumns }
  ];

  const printTable = () => {
    printJS({
      printable: 'printableTable',
      type: 'html',
      style: `
        body, html {
            width: 100%;
            height: auto;
        }
        .dx-datagrid-rowsview {
            overflow: visible !important;
            height: auto !important;
        }
        .editGridStyle {
            width: 100% !important;
            overflow: visible !important;
            page-break-inside: avoid;
        }
        table {
            table-layout: auto !important;
            width: 100% !important;
            margin: 0 auto; // Center table
        }
      `,
      targetStyles: ['*']
    });
  };
  const formItemStyle = {
    marginBottom: "10px" // 각 폼 아이템의 하단 마진을 설정하여 아이템 간의 간격을 확보
    , width: "100"
  };

  return (
    <React.Fragment>
      <div style={{ marginTop: "20px", marginBottom: "20px", display: "flex", justifyContent: "flex-end" }}>
        <Button text='출력' type='success' icon='print' onClick={printTable} />
      </div>
      <div style={{ padding: "20px", width: "100%", border: '1px solid #dad8d8' }} >
        <div className="container" style={{ padding: "20px" }}>
          <div ref={componentRef} style={{ padding: "20px", width: "100%" }} id="printableTable">
            <p>
              <strong>* 직원 기본정보</strong>
            </p>
            <Form colCount={2} minColWidth={50}>
              <GroupItem>
                <Item dataField="성명" editorType="dxTextBox" editorOptions={{ value: degree.BaseData?.empFlnm, readOnly: true, width: "80%" }} style={formItemStyle} />
                <Item dataField="전화번호" editorType="dxTextBox" editorOptions={{ value: degree.BaseData?.telno, readOnly: true, width: "80%" }} style={formItemStyle} />
              </GroupItem>
              <GroupItem>
                <Item dataField="소속" editorType="dxTextBox" editorOptions={{ value: degree.BaseData?.deptNm, readOnly: true, width: "80%" }} style={formItemStyle} />
                <Item dataField="이메일" editorType="dxTextBox" editorOptions={{ value: degree.BaseData?.eml, readOnly: true, width: "80%" }} style={formItemStyle} />
              </GroupItem>
            </Form>
            {sections.map((section, index) => (
              <div key={index}>
                <p style={{ marginTop: "20px", marginBottom: "20px" }}>
                  <strong>{section.title}</strong>
                </p>
                <CustomEditTable
                  values={section.data}
                  keyColumn={section.keyColumn}
                  columns={section.columns}
                  callback={pageDegree}
                  noEdit={true}
                />
              </div>
            ))}
          </div>
          &nbsp;
        </div>
      </div>
    </React.Fragment>
  );
};
export default EmpInfoPop;