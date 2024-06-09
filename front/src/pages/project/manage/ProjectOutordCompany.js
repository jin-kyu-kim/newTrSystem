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
    const [ values, setValues ] = useState([]);
    const [ param, setParam ] = useState({});
    const [ totalItems, setTotalItems ] = useState(0);
    const [ fileList, setFileList ] = useState([]);
    const fileDir = fileList[0]?.fileStrgCours ? fileList[0]?.fileStrgCours.substring(8) : null;
    const [ outordCompanyValue, setOutordCompanyValue ] = useState({}); //외주업체 insert 및 클릭이벤트 값설정용
    const [ attachments, setAttachments ] = useState([]);
    const { keyColumn, queryId, tableColumns, searchInfo, inputList } = ProjectOutordJson.ProjectOutordCompnayJson;
    const [ deleteFiles, setDeleteFiles ] = useState([{ tbNm: "ATCHMNFL" }]);
    const { handleOpen } = useModal();
    const fileUploaderRef = useRef(null); //파일 업로드용 ref
    const insertRef = useRef(null); // textbox focus용 ref
    const rules = { X: /[02-9]/ };
    
    useEffect(() => {
        if (!Object.values(param).every((value) => value === "")) {
            pageHandle();
        }
    }, [param]);

    useEffect(() => {
        setOutordCompanyValue({
            outordEntrpsId: null,
            outordEntrpsNm: null,
            brno: "",
            picFlnm: null,
            telno: "",
            addr: null,
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
            }
        } catch (error) {
            console.log(error);
        }
    };

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
        setOutordCompanyValue({
            outordEntrpsId: null,
            outordEntrpsNm: null,
            brno: "",
            picFlnm: null,
            telno: "",
            addr: null,
            atchmnflId: null
        });
    };

    const focusTextBox = () => {
        const element = document.querySelector('.partner-insert-area');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
    };
    useEffect(() => {
        if(outordCompanyValue.atchmnflId !== null){
            getAttachment();
        } else{
            setFileList([]);
        }
    }, [outordCompanyValue])
    
    const getAttachment = async () => {
        const res = await ApiRequest('/boot/common/commonSelect', [
            { tbNm: "ATCHMNFL" }, { atchmnflId: outordCompanyValue.atchmnflId }
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
        setOutordCompanyValue({
            outordEntrpsId: e.data.outordEntrpsId,
            outordEntrpsNm: e.data.outordEntrpsNm,
            atchmnflId: e.data.atchmnflId,
            brno: e.data.brno,
            picFlnm: e.data.picFlnm,
            telno: e.data.telno,
            addr: e.data.addr,
        });
    };

    //================저장버튼 이벤트==================================================
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
                handleOpen("저장하시겠습니까?", insertCompanyValue, false);
            } else {
                handleOpen("저장하시겠습니까?", updateCompanyValue, false);
            }
        }
    };

    const insertCompanyValue = async () => {
        const insertData = ({
            outordEntrpsId: uuid(),
            outordEntrpsNm: outordCompanyValue.outordEntrpsNm,
            brno: outordCompanyValue.brno,
            picFlnm: outordCompanyValue.picFlnm,
            telno: outordCompanyValue.telno,
            addr: outordCompanyValue.addr,
            atchmnflId: outordCompanyValue.atchmnflId,
            dirType: ProjectOutordJson.dirType
        });
        const formData = new FormData();

        formData.append("tbNm", JSON.stringify({ tbNm: "OUTORD_ENTRPS" }));
        formData.append("data", JSON.stringify(insertData));
        Object.values(attachments).forEach((attachment) => formData.append("attachments", attachment));
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post("/boot/common/insertlongText", formData, {
                headers: { 'Content-Type': 'multipart/form-data', "Authorization": `Bearer ${token}` },
            });
            if (response.data >= 1) {
                handleOpen("저장되었습니다.");
                resetForm();
                pageHandle();
            }
        } catch (error) {
            console.error("Error fetching data", error);
        }
    }

    const updateCompanyValue = async () => {
        const updateData = ({
            outordEntrpsNm: outordCompanyValue.outordEntrpsNm,
            brno: outordCompanyValue.brno,
            picFlnm: outordCompanyValue.picFlnm,
            telno: outordCompanyValue.telno,
            addr: outordCompanyValue.addr,
            atchmnflId: outordCompanyValue.atchmnflId,
            dirType: ProjectOutordJson.dirType
        });
        const formData = new FormData();

        formData.append("tbNm", JSON.stringify({ tbNm: "OUTORD_ENTRPS" }));
        formData.append("data", JSON.stringify(updateData));
        formData.append("deleteFiles", JSON.stringify(deleteFiles));
        formData.append("idColumn", JSON.stringify({ outordEntrpsId: outordCompanyValue.outordEntrpsId }));
        Object.values(attachments).forEach((attachment) => formData.append("attachments", attachment));

        try {
            const token = localStorage.getItem("token")
            const response = await axios.post("/boot/common/insertlongText", formData, {
                headers: { 'Content-Type': 'multipart/form-data', "Authorization": `Bearer ${token}` },
            });
            if (response.data >= 1) {
                handleOpen("저장되었습니다.");
                resetForm();
                pageHandle();
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
                    onClick={deleteCompany}
                    wordWrap={true}
                />
            </div>

            <div className='partner-insert-area' ref={insertRef}>
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
                    {outordCompanyValue.outordEntrpsId !== null && 
                        fileList.length !== 0 && fileList.filter(file => file.realFileNm !== null && file.realFileNm !== undefined).filter(file => !(file.realFileNm.endsWith('.jpg') || file.realFileNm.endsWith('.jpeg') || file.realFileNm.endsWith('.png') || file.realFileNm.endsWith('.gif'))).map((file, index) => (
                      <div key={index}>
                        <a href={`${fileDir}/${file.strgFileNm}`} download={file.realFileNm} style={{ fontSize: '18px', color: 'blue', fontWeight: 'bold' }}>{file.realFileNm}</a>
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