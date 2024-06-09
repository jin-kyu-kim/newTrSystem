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
  const { keyColumn, queryId, tableColumns, searchInfo, inputList } = ProjectOutordJson.ProjectOutordEmpJson;
  const [ values, setValues] = useState([]);
  const [ param, setParam] = useState({});
  const [ totalItems, setTotalItems] = useState(0);
  const [ fileList, setFileList ] = useState([]);
  const [ attachments, setAttachments] = useState(fileList);
  const [ deleteFiles, setDeleteFiles] = useState([{ tbNm: "ATCHMNFL" }]);
  const fileDir = fileList[0]?.fileStrgCours ? fileList[0]?.fileStrgCours.substring(8) : null;
  const [ outordEmpValue, setOutordEmpValue] = useState({}); // selected 데이터
  const [ empMax, setEmpMax] = useState({});   // 사번 MAX값
  const { handleOpen } = useModal();
  const fileUploaderRef = useRef(null); // 파일 업로드용 ref
  
  useEffect(() => {
    if (!Object.values(param).every((value) => value === "")) {
      pageHandle();
    }
  }, [param]);

  const searchHandle = async (initParam) => {
    setParam({ ...initParam, queryId: queryId });
  };

  const pageHandle = async () => {
    try {
      const response = await ApiRequest("/boot/common/queryIdSearch", param);
      if (response.length !== 0) {
        setValues(response);
        setTotalItems(response[0].totalItems);
      } else {
        setValues([]);
        setTotalItems(0);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const attachFileDelete = (deleteItem) => {
    setDeleteFiles([...deleteFiles, { atchmnflId: deleteItem.atchmnflId ,atchmnflSn: deleteItem.atchmnflSn, strgFileNm: deleteItem.strgFileNm }]);
    setFileList(fileList.filter(item => item !== deleteItem));
  }

  const handleChgValue = (name, value) => {
    setOutordEmpValue({ ...outordEmpValue, [name]: value });
  };

  const handleChgCd = (e) => {
    setOutordEmpValue({ ...outordEmpValue, [e.name]: e.value });
  };

  const changeAttchValue = (e) => {
    setOutordEmpValue({ 
      ...outordEmpValue, 
      atchmnflId: (outordEmpValue.atchmnflId !== null) ? outordEmpValue.atchmnflId : uuid()
    });
    setAttachments(e.value)
  }

  const clearFiles = () => {
    let fileUploader = fileUploaderRef.current.instance;
    fileUploader.reset();
  };

  const resetForm = () => {
    clearFiles();
    const nullifiedState = Object.keys(outordEmpValue).reduce((acc, key) => {
      acc[key] = null;
      return acc;
    }, {});
    setOutordEmpValue(nullifiedState);
    setFileList([]);
  };

  const focusTextBox = () => {
    const element = document.querySelector('.partner-insert-area');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getAttachment = async (attachId) => {
    const res = await ApiRequest('/boot/common/commonSelect', [
      { tbNm: "ATCHMNFL" }, { atchmnflId: attachId }
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
    const { totalItems, fileNm, gradNm, ...restData } = e.data;
    setOutordEmpValue(restData);
    
    if(e.data.atchmnflId !== null){
      getAttachment(e.data.atchmnflId);
    } else{
      setFileList([]);
    }
  };
  const validateFields = (obj) => {
    const requiredFields = ["outordHnfOgdpNm", "empFlnm"];
    for (let field of requiredFields) {
      if (!obj[field] || obj[field].trim() === "") {
        return false;
      }
    }
    return true;
  };

  const saveOutordEmp = async () => {
    if (!validateFields(outordEmpValue)) {
      handleOpen("필수 필드를 모두 입력해주세요.");
      return;
    }
    if (outordEmpValue.empId === "" || outordEmpValue.empId === null || outordEmpValue.empId === undefined) {
      const empMaxValue = await empnoHandle();
      handleOpen("저장하시겠습니까?", () => saveEmpValue(empMaxValue), false);
    } else {
      handleOpen("수정하시겠습니까?", () => saveEmpValue(), false);
    }
  };

  const empnoHandle = async () => { // max값 채번
    try {
      const response = await ApiRequest("/boot/common/queryIdSearch", { empnoChk: "VKP", queryId: "humanResourceMngMapper.retrieveEmpnoMax", });
      if(response.length !== 0){
        setEmpMax(response[0].empnoChk);
        return response[0].empnoChk;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const saveEmpValue = async (empMaxValue) => {
    const isInsert = empMaxValue !== undefined;
    const data = {
      ...outordEmpValue,
      ...(isInsert && { empId: uuid() }),
      ...(isInsert && { empno: empMaxValue }),
      ...(isInsert && { hdofSttsCd: 'VTW00301' }),
      ...(isInsert && { empTyCd: 'VTW00203' }),
      dirType: ProjectOutordJson.dirType
    };
    const formData = new FormData();

    formData.append("tbNm", JSON.stringify({ tbNm: "EMP" }));
    formData.append("data", JSON.stringify(data));
    if(!isInsert) {
      formData.append("idColumn", JSON.stringify({empId: outordEmpValue.empId}));
      formData.append("deleteFiles", JSON.stringify(deleteFiles));
    }
    Object.values(attachments).forEach((attachment) => formData.append("attachments", attachment));
    try {
      const token = localStorage.getItem("token")
      const response = await axios.post("/boot/common/insertlongText", formData, {
        headers: { 'Content-Type': 'multipart/form-data', "Authorization": `Bearer ${token}` },
      });

      const action = !isInsert ? '수정' : '등록';
      if (response.data >= 1) {
        handleOpen(`${action}되었습니다.`);
        setEmpMax({});
        resetForm();
        pageHandle();
      } else{
        handleOpen(`${action}에 실패했습니다.`);
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  }

  const deleteOutEmp = (e, data) => {
    handleOpen("삭제하시겠습니까?", () => deleteEmpValue(e, data));
  };

  const deleteEmpValue = async (e, data) => {
    const deleteParam = [{ tbNm: "EMP" }, { empId: data.empId }];
    const fileParams = [{ tbNm: "ATCHMNFL" }, { atchmnflId: data.atchmnflId }];
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
                key={item.key}
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
          text="입력화면이동"
          type="default"
          onClick={() => focusTextBox()}
        />
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

      <div className='partner-insert-area'>
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
              <span onClick={() => attachFileDelete(file)} className='deleteIconBtn'>X</span>
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