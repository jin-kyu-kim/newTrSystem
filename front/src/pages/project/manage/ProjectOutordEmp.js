import { useState, useEffect, useRef } from "react";
import uuid from "react-uuid";
import axios from "axios";
import ApiRequest from "../../../utils/ApiRequest";
import CustomTable from "components/unit/CustomTable";
import ProjectOutordJson from "./ProjectOutordJson.json";
import SearchOutordSet from "components/composite/SearchInfoSet";
import CustomCdComboBox from "../../../components/unit/CustomCdComboBox";
import { useModal } from "../../../components/unit/ModalContext";
import { Button, TextBox, FileUploader, DateBox } from "devextreme-react";

function ProjectOutordEmp() {
  const [ values, setValues] = useState([]);
  const [ param, setParam] = useState({});
  const [ totalItems, setTotalItems] = useState(0);
  const [ fileList, setFileList ] = useState([]);
  const fileDir = fileList[0]?.fileStrgCours ? fileList[0]?.fileStrgCours.substring(8) : null;
  const [ outordEmpValue, setOutordEmpValue] = useState({}); // 외주업체 insert 및 클릭이벤트 값설정용
  const [ attachments, setAttachments] = useState([]);
  const [ empMax, setEmpMax] = useState({});   // 사번 MAX값
  const { keyColumn, queryId, tableColumns, searchInfo, inputList } = ProjectOutordJson.ProjectOutordEmpJson;
  const [ deleteFiles, setDeleteFiles] = useState([{ tbNm: "ATCHMNFL" }]);
  const { handleOpen } = useModal();
  const fileUploaderRef = useRef(null); // 파일 업로드용 ref
  const insertRef = useRef(null); // textbox focus용 ref

  useEffect(() => {
    if (!Object.values(param).every((value) => value === "")) {
      pageHandle();
    }
  }, [param]);

  useEffect(() => {
    setOutordEmpValue({
      empId: null,
      empno: null,
      outordHnfOgdpNm: null,
      empFlnm: null,
      brdt: null,
      outordHnfGradCd: null,
      telno: null,
      eml: null,
      atchmnflId: null
    })
  }, []);

  const searchHandle = async (initParam) => {
    setParam({
      ...initParam,
      queryId: queryId,
    });
  };

  const pageHandle = async () => {
    try {
      const response = await ApiRequest("/boot/common/queryIdSearch", param);
      if (response.length !== 0) {
        setValues(response);
        setTotalItems(response[0].totalItems);
      } else {
        setValues([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChgValue = (name, value) => {
    setOutordEmpValue({
      ...outordEmpValue,
      [name]: value
    });
  };
  const handleChgCd = (e) => {
    setOutordEmpValue({
      ...outordEmpValue,
      [e.name]: e.value
    });
  };

  const changeAttchValue = (e) => {
    setOutordEmpValue({
      ...outordEmpValue,
      atchmnflId: uuid()
    });
    setAttachments(e.value)
  }

  const clearFiles = () => {
    let fileUploader = fileUploaderRef.current.instance;
    fileUploader.reset();
  };

  const resetForm = () => {
    clearFiles();
    setOutordEmpValue({
      empId: null,
      empno: null,
      outordHnfOgdpNm: null,
      empFlnm: null,
      brdt: null,
      outordHnfGradCd: null,
      telno: null,
      eml: null,
      atchmnflId: null
    })
  };

  const focusTextBox = () => {
    const element = document.querySelector('.partner-insert-area');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  useEffect(() => {
    if(outordEmpValue.atchmnflId !== null){
      getAttachment();
    } else{
      setFileList([]);
    }
  }, [outordEmpValue])

  const getAttachment = async () => {
    const res = await ApiRequest('/boot/common/commonSelect', [
      { tbNm: "ATCHMNFL" }, { atchmnflId: outordEmpValue.atchmnflId }
    ]);
    if(res.length !== 0){
      setFileList(res);
    }
  }

  const getDetail = (e) => {
    if(e.event.target.className === "dx-button-content" || e.event.target.className === "dx-button-text") {
      return;
    }
    setOutordEmpValue([])
    setOutordEmpValue({
      empId: e.data.empId,
      empno: e.data.empno,
      outordHnfOgdpNm: e.data.outordHnfOgdpNm,
      empFlnm: e.data.empFlnm,
      brdt: e.data.brdt,
      outordHnfGradCd: e.data.outordHnfGradCd,
      atchmnflId: e.data.atchmnflId,
      picFlnm: e.data.picFlnm,
      telno: e.data.telno,
      eml: e.data.eml,
    });
  };

  const saveOutordEmp = () => {
    if (outordEmpValue.outordHnfOgdpNm === null) {
      handleOpen("소속을 입력해주세요");
    } else if (outordEmpValue.empFlnm === null) {
      handleOpen("성명를 입력해주세요");
    } else if (outordEmpValue.outordHnfGradCd === null) {
      handleOpen("등급을 선택해주세요");
    } else {
      const isconfirm = window.confirm("저장하시겠습니까?");
      if (isconfirm) {
        if (outordEmpValue.empId === "" || outordEmpValue.empId === null || outordEmpValue.empId === undefined) {
          empnoHandle();
        } else {
          updateEmpValue();
        }
      } else {
        return;
      }
    }
  };

  const empnoHandle = async () => { // max값 채번
    try {
      const response = await ApiRequest("/boot/common/queryIdSearch", { empnoChk: "VKP", queryId: "humanResourceMngMapper.retrieveEmpnoMax", });
      if(response.length !== 0){
        setEmpMax(response[0].empnoChk);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => { //채번값 설정 후 insert 이벤트 진행
    if (!Object.values(empMax).every((value) => value === "")) {
      insertEmpValue();
    }
  }, [empMax])

  const insertEmpValue = async () => {
    const insertData = ({
      empId: uuid(),
      empno: empMax,
      hdofSttsCd: 'VTW00301',
      empTyCd: 'VTW00203',
      empFlnm: outordEmpValue.empFlnm,
      outordHnfOgdpNm: outordEmpValue.outordHnfOgdpNm,
      outordHnfGradCd: outordEmpValue.outordHnfGradCd,
      brdt: outordEmpValue.brdt,
      telno: outordEmpValue.telno,
      eml: outordEmpValue.eml,
      atchmnflId: outordEmpValue.atchmnflId,
      dirType: ProjectOutordJson.dirType
    });
    const formData = new FormData();
    console.log('insertData', insertData)
    formData.append("tbNm", JSON.stringify({ tbNm: "EMP" }));
    formData.append("data", JSON.stringify(insertData));
    Object.values(attachments).forEach((attachment) => formData.append("attachments", attachment));
    try {
      const token = localStorage.getItem("token")
      const response = await axios.post("/boot/common/insertlongText", formData, {
        headers: { 'Content-Type': 'multipart/form-data', "Authorization": `Bearer ${token}` },
      });
      if (response.data >= 1) {
        handleOpen("저장되었습니다.");
        setEmpMax({});
        resetForm();
        pageHandle();
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  }

  const updateEmpValue = async () => {
    const updateData = ({
      empFlnm: outordEmpValue.empFlnm,
      outordHnfOgdpNm: outordEmpValue.outordHnfOgdpNm,
      outordHnfGradCd: outordEmpValue.outordHnfGradCd,
      brdt: outordEmpValue.brdt,
      telno: outordEmpValue.telno,
      eml: outordEmpValue.eml,
      atchmnflId: outordEmpValue.atchmnflId,
      dirType: ProjectOutordJson.dirType
    });
    const formData = new FormData();

    formData.append("tbNm", JSON.stringify({ tbNm: "EMP" }));
    formData.append("data", JSON.stringify(updateData));
    formData.append("deleteFiles", JSON.stringify(deleteFiles));
    formData.append("idColumn", JSON.stringify({ empId: outordEmpValue.empId }));
    Object.values(attachments).forEach((attachment) => formData.append("attachments", attachment));

    try {
      const token = localStorage.getItem("token")
      const response = await axios.post("/boot/common/insertlongText", formData, {
        headers: { 'Content-Type': 'multipart/form-data', "Authorization": `Bearer ${token}` },
      });
      if (response.data >= 1) {
        handleOpen("수정되었습니다.");
        resetForm();
        pageHandle();
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const deleteOutEmp = () => {
    const isconfirm = window.confirm("삭제하시겠습니까?");
    if (isconfirm) {
      deleteEmpValue();
    } else {
      return;
    }
  };

  const deleteEmpValue = async () => {
    const deleteParam = [{ tbNm: "EMP" }, { empId: outordEmpValue.empId }];
    const fileParams = [{ tbNm: "ATCHMNFL" }, { atchmnflId: outordEmpValue.atchmnflId }];
    try {
      const response = await ApiRequest("/boot/common/deleteWithFile", {
        params: deleteParam, fileParams: fileParams, dirType: ProjectOutordJson.dirType
      });
      if (response >= 1) {
        handleOpen("삭제되었습니다.");
        resetForm();
        pageHandle();
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };
  const inputAreaRender = (inputList) => {
    return(
      inputList.map(item => {
        switch(item.type) {
          case 'TextBox': 
            return(
              <TextBox
                onValueChange={(e) => { handleChgValue(item.key, e) }}
                value={outordEmpValue[item.key]}
                placeholder={item.name}
                showClearButton={true}
                style={{ flex: 1 }}
              />
            )
          case 'DateBox':
            return(
              <DateBox
                onValueChange={(e) => { handleChgValue(item.key, e) }}
                value={outordEmpValue[item.key]}
                dateSerializationFormat="yyyyMMdd"
                displayFormat="yyyy-MM-dd"
                placeholder={item.name}
                showClearButton={true}
                style={{ flex: 1 }}
              />
            )
          default: 
            return(
              <div style={{ flex: 1 }}>
                <CustomCdComboBox
                  param="VTW005"
                  placeholderText={item.name}
                  name={item.key}
                  onSelect={handleChgCd}
                  value={outordEmpValue[item.key]}
                  required={false}
                />
              </div>
            )
        }
      })
    )
  }

  return (
    <div style={{ marginLeft: "1%", marginRight: "1%" }}>
      <div className="title">파트너 직원 관리</div>
      <div className="title-desc">* 파트너직원을 조회합니다.</div>
      <div style={{ marginBottom: "20px" }}>
        <SearchOutordSet callBack={searchHandle} props={searchInfo} />
      </div>
      <div className="buttons" align="right" style={{ margin: "20px" }}>
        <Button
          width={130}
          text="Contained"
          type="default"
          stylingMode="contained"
          style={{ margin: "2px" }}
          onClick={() => focusTextBox()}
        >
          입력화면이동
        </Button>
      </div>
      <div>검색된 건 수 : {totalItems} 건</div>
      <div>
        <CustomTable
          keyColumn={keyColumn}
          columns={tableColumns}
          values={values}
          paging={true}
          onRowClick={(e) => getDetail(e)}
          onClick={deleteOutEmp}
          wordWrap={true}
        />
      </div>

      <div className='partner-insert-area' ref={insertRef}>
        <h5 style={{ alignItems: 'left', marginBottom: '20px' }}>외주직원정보를 입력/수정 합니다.</h5>
        <div className='partner-input-box'>
          {inputAreaRender(inputList)}
        </div>
        <div style={{marginBottom: '30px'}}>
          <FileUploader
            selectButtonText="첨부파일"
            multiple={true}
            labelText=""
            uploadMode="useButton"
            onValueChanged={changeAttchValue}
            ref={fileUploaderRef}
          />
          {fileList.length !== 0 && fileList.filter(file => file.realFileNm !== null && file.realFileNm !== undefined).filter(file => !(file.realFileNm.endsWith('.jpg') || file.realFileNm.endsWith('.jpeg') || file.realFileNm.endsWith('.png') || file.realFileNm.endsWith('.gif'))).map((file, index) => (
            <div key={index}>
              <a href={`${fileDir}/${file.strgFileNm}`} download={file.realFileNm} style={{ fontSize: '18px', color: 'blue', fontWeight: 'bold' }}>{file.realFileNm}</a>
            </div>
           ))}
        </div>
        <div className="buttonContainer" style={{ marginTop: '5px', marginLeft: '5px', alignItems: 'left' }}>
          <Button type="default" style={{ height: "48px", width: "60px", marginRight: "15px" }} onClick={() => saveOutordEmp()}>저장</Button>
          <Button type="danger" style={{ height: "48px", width: "60px", marginRight: "15px" }} onClick={resetForm}>초기화</Button>
        </div>
      </div>
    </div>
  );
};
export default ProjectOutordEmp;