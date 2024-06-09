import { useState, useEffect, useRef } from "react";
import { Button, TextBox, FileUploader } from "devextreme-react";
import { useModal } from "../../../components/unit/ModalContext";
import ApiRequest from "../../../utils/ApiRequest";
import ProjectOutordJson from "./ProjectOutordJson.json";
import SearchInfoSet from "components/composite/SearchInfoSet";
import uuid from "react-uuid";
import axios from "axios";
import CustomTable from "components/unit/CustomTable";

function ProjectOutordCompany() {
    const { keyColumn, queryId, tableColumns, searchInfo, inputList } = ProjectOutordJson.ProjectOutordCompnayJson;
    const [ values, setValues ] = useState([]);
    const [ param, setParam ] = useState({});
    const [ totalItems, setTotalItems ] = useState(0);
    const [ fileList, setFileList ] = useState([]); // 기존
    const [ attachments, setAttachments ] = useState(fileList); // new Attachment
    const [ deleteFiles, setDeleteFiles ] = useState([{ tbNm: "ATCHMNFL" }]);
    const fileDir = fileList[0]?.fileStrgCours ? fileList[0]?.fileStrgCours.substring(8) : null;
    const [ outordCompanyValue, setOutordCompanyValue ] = useState({}); // selected 데이터
    const { handleOpen } = useModal();
    const fileUploaderRef = useRef(null); //파일 업로드용 ref
    const rules = { X: /[02-9]/ };

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
        if (name === 'telno' || name === 'brno') {
            const numericValue = value.replace(/[^0-9-]/g, '');
            setOutordCompanyValue({
                ...outordCompanyValue,
                [name]: numericValue
            });
        } else {
            setOutordCompanyValue({
                ...outordCompanyValue,
                [name]: value
            });
        }
    };

    const changeAttchValue = (e) => {
        setOutordCompanyValue({ 
            ...outordCompanyValue, 
            atchmnflId: (outordCompanyValue.atchmnflId !== null) ? outordCompanyValue.atchmnflId : uuid()
        });
        setAttachments(e.value)
    }

    const clearFiles = () => {
        let fileUploader = fileUploaderRef.current.instance;
        fileUploader.reset();
    };

    const resetForm = () => {
        clearFiles();
        const nullifiedState = Object.keys(outordCompanyValue).reduce((acc, key) => {
            acc[key] = null;
            return acc;
        }, {});
        setOutordCompanyValue(nullifiedState);
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
        setOutordCompanyValue([])
        setOutordCompanyValue(e.data);

        if(e.data.atchmnflId !== null){
            getAttachment(e.data.atchmnflId);
        } else{
            setFileList([]);
        }
    };

    const saveOutordC = () => {
        if (outordCompanyValue.outordEntrpsNm === null) {
            handleOpen("업체명을 입력해주세요");
        } else if (outordCompanyValue.brno === "") {
            handleOpen("사업자등록번호를 입력해주세요");
        } else if (outordCompanyValue.picFlnm === null) {
            handleOpen("담당자명을 입력해주세요");
        } else if (outordCompanyValue.telno === "") {
            handleOpen("전화번호를 입력해주세요");
        } else if (outordCompanyValue.addr === null) {
            handleOpen("주소를 입력해주세요");
        } else {
            if (outordCompanyValue.outordEntrpsId === "" || outordCompanyValue.outordEntrpsId === null || outordCompanyValue.outordEntrpsId === undefined) {
                handleOpen("저장하시겠습니까?", () => insertCompanyValue('insert'), false);
            } else {
                handleOpen("수정하시겠습니까?", () => insertCompanyValue('update'), false);
            }
        }
    };

    const insertCompanyValue = async (editMode) => {
        const data = {
            ...(editMode === 'insert' && { outordEntrpsId: uuid() }),
            ...outordCompanyValue,
            dirType: ProjectOutordJson.dirType
        };
        const formData = new FormData();

        formData.append("tbNm", JSON.stringify({ tbNm: "OUTORD_ENTRPS" }));
        formData.append("data", JSON.stringify(data));
        if(editMode === 'update') {
            formData.append("idColumn", JSON.stringify({outordEntrpsId: outordCompanyValue.outordEntrpsId}));
            formData.append("deleteFiles", JSON.stringify(deleteFiles));
        }
        Object.values(attachments).forEach((attachment) => formData.append("attachments", attachment));
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post("/boot/common/insertlongText", formData, {
                headers: { 'Content-Type': 'multipart/form-data', "Authorization": `Bearer ${token}` },
            });
            if (response.data >= 1) {
                const action = editMode === 'update' ? '수정' : '등록';
                handleOpen(`${action}되었습니다.`);
                resetForm();
                pageHandle();
            } else{
                handleOpen('저장에 실패했습니다.')
            }
        } catch (error) {
            console.error("Error fetching data", error);
        }
    }

    const deleteCompany = (e, data) => {
        handleOpen("삭제하시겠습니까?", () => deleteCompanyValue(e, data));
    }

    const deleteCompanyValue = async (e, data) => {
        const deleteParam = [{ tbNm: "OUTORD_ENTRPS" }, { outordEntrpsId: data.outordEntrpsId }];
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

    return (
        <div style={{ marginLeft: "1%", marginRight: "1%" }}>
            <div className="title">파트너 업체 관리</div>
            <div className="title-desc">* 파트너업체를 조회합니다.</div>
            <div style={{ marginBottom: "20px" }}>
                <SearchInfoSet callBack={searchHandle} props={searchInfo} />
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
                    onClick={deleteCompany}
                    wordWrap={true}
                />
            </div>

            <div className='partner-insert-area'>
                <h5 style={{ alignItems: 'left', marginBottom: '20px' }}>외주업체정보를 입력/수정 합니다.</h5>
                <div className='partner-input-box'>
                    {inputList.map(item => (
                        <TextBox
                            key={item.key}
                            onValueChange={(e) => { handleChgValue(item.key, e) }}
                            value={outordCompanyValue[item.key]}
                            placeholder={item.name}
                            showClearButton={true}
                            style={{ flex: 1 }}
                            maskRules={item.maskRules && rules}
                        />
                    ))}
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
                    {fileList.length !== 0 && fileList.filter(file => file.realFileNm !== null && file.realFileNm !== undefined).map((file, index) => (
                      <div key={index}>
                        <a href={`${fileDir}/${file.strgFileNm}`} download={file.realFileNm} style={{ fontSize: '18px', color: 'blue', fontWeight: 'bold' }}>{file.realFileNm}</a>
                        <span onClick={() => attachFileDelete(file)} className='deleteIconBtn'>X</span>
                      </div>
                    ))}
                </div>
                <div className="buttonContainer" style={{ marginTop: '5px', marginLeft: '5px', alignItems: 'end' }}>
                    <Button type="default" style={{ height: "48px", width: "60px", marginRight: "15px" }}
                        onClick={saveOutordC}>저장</Button>
                    <Button type="danger" style={{ height: "48px", width: "60px", marginRight: "15px" }}
                        onClick={resetForm}>초기화</Button>
                </div>
            </div>
        </div>
    );
}
export default ProjectOutordCompany;