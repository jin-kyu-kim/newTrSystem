import { useState, useEffect, useRef } from "react";
import ApiRequest from "../../../utils/ApiRequest";
import { Button, TextBox, FileUploader,NumberBox } from "devextreme-react";
import  ProjectOutordCompanyJson from "./ProjectOutordCompanyJson.json";
import  ProjectOutordJson from "./ProjectOutordJson.json";
import SearchInfoSet from "components/composite/SearchInfoSet";
import axios from "axios";
import CustomTable from "components/unit/CustomTable";
import uuid from "react-uuid";
import { useModal } from "../../../components/unit/ModalContext";

function ProjectOutordCompany () {
    const [values, setValues] = useState([]);
    const [param, setParam] = useState({});
    const [totalItems, setTotalItems] = useState(0);
    const [outordCompanyValue, setOutordCompanyValue] = useState({}); //외주업체 insert 및 클릭이벤트 값설정용
    const [attachments, setAttachments] = useState([]);
    const {keyColumn, queryId, tableColumns, searchInfo} = ProjectOutordCompanyJson;
    const fileUploaderRef = useRef(null); //파일 업로드용 ref
    const insertRef = useRef(null); //textbox focus용 ref
    const [deleteFiles, setDeleteFiles] = useState([{tbNm: "ATCHMNFL"}]);
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const empId = userInfo.empId;
    const date = new Date();
    const now = date.toISOString().split("T")[0] + " " + date.toTimeString().split(" ")[0];
    const {handleOpen} = useModal();
    const rules = {X: /[02-9]/};
//============== 초기 조회할 때==========================================
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

//============== 검색으로 조회할 때======================================
    const searchHandle = async (initParam) => {
        setParam({
            ...initParam,
            queryId: queryId,
        });
    };

    const pageHandle = async () => {
        try {
            const response = await ApiRequest("/boot/common/queryIdSearch", param);
            setValues(response);
            setTotalItems(response[0].totalItems);
            if (response.length !== 0) {
            } else {
            }
        } catch (error) {
            console.log(error);
        }
    };
//=================컴포넌트 내용 변경시=================================================
    const handleChgValue = (name, value) => {

        if (name === 'telno' || name === 'brno') {
            const numericValue = value.replace(/\D/g, '');
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

//=================첨부파일=================================================
    const changeAttchValue = (e) => {
        setOutordCompanyValue({
            ...outordCompanyValue,
            atchmnflId: uuid()
        });
        setAttachments(e.value)
    }

//================ 첨부파일 화면 초기화=====================================
    const clearFiles = () => {
        let fileUploader = fileUploaderRef.current.instance;
        fileUploader.reset();
    };
//================폼 초기화==================================================     
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
//================테이블 로우 클릭 이벤트================================================== 
    const focusTextBox = () => {
        // 텍스트 박스로 이동합니다.
        let focusTextBox = insertRef.current.instance;
        focusTextBox.focus();
    };

    const getDetail = (e) => {
        setOutordCompanyValue({
            ...outordCompanyValue,
            outordEntrpsId: e.data.outordEntrpsId,
            outordEntrpsNm: e.data.outordEntrpsNm,
            atchmnflId: e.data.atchmnflId,
            brno: e.data.brno,
            picFlnm: e.data.picFlnm,
            telno: e.data.telno,
            addr: e.data.addr,
        });
        focusTextBox();
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
//================Insert==================================================
        const insertCompanyValue = async () => {
            const insertData =
                ({
                    outordEntrpsId: uuid(),
                    outordEntrpsNm: outordCompanyValue.outordEntrpsNm,
                    brno: outordCompanyValue.brno,
                    picFlnm: outordCompanyValue.picFlnm,
                    telno: outordCompanyValue.telno,
                    addr: outordCompanyValue.addr,
                    atchmnflId: outordCompanyValue.atchmnflId,
                    regDt: now,
                    regEmpId: empId,
                });

            const formData = new FormData();
            formData.append("tbNm", JSON.stringify({tbNm: "OUTORD_ENTRPS"}));
            formData.append("data", JSON.stringify(insertData));
            Object.values(attachments).forEach((attachment) => formData.append("attachments", attachment));
            try {
                const token = localStorage.getItem("token");
                const response = await axios.post("/boot/common/insertlongText", formData, {
                    headers: {'Content-Type': 'multipart/form-data', "Authorization": `Bearer ${token}`},
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
//================Update==================================================       
        const updateCompanyValue = async () => {
            const updateData =
                ({
                    outordEntrpsNm: outordCompanyValue.outordEntrpsNm,
                    brno: outordCompanyValue.brno,
                    picFlnm: outordCompanyValue.picFlnm,
                    telno: outordCompanyValue.telno,
                    addr: outordCompanyValue.addr,
                    atchmnflId: outordCompanyValue.atchmnflId,
                    mdfcnDt: now,
                    mdfcnEmpId: empId,
                });


            const formData = new FormData();
            formData.append("tbNm", JSON.stringify({tbNm: "OUTORD_ENTRPS"}));
            formData.append("data", JSON.stringify(updateData));
            formData.append("deleteFiles", JSON.stringify(deleteFiles));
            formData.append("idColumn", JSON.stringify({outordEntrpsId: outordCompanyValue.outordEntrpsId}));
            Object.values(attachments).forEach((attachment) => formData.append("attachments", attachment));

            try {
                const token = localStorage.getItem("token")
                const response = await axios.post("/boot/common/insertlongText", formData, {
                    headers: {'Content-Type': 'multipart/form-data', "Authorization": `Bearer ${token}`},
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
//================Delete==================================================
        const deleteCompany = (e, data) => {
            // console.log(e, data)
            handleOpen("삭제하시겠습니까?", ()=>deleteCompanyValue(e, data));
        }

        const deleteCompanyValue = async (e, data) => {
            const deleteParam = [{tbNm: "OUTORD_ENTRPS"}, {outordEntrpsId: data.outordEntrpsId}];
            const fileParams = [{tbNm: "ATCHMNFL"}, {atchmnflId: data.atchmnflId}];
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
            <div style={{marginLeft: "1%", marginRight: "1%"}}>
                <div className="mx-auto" style={{marginTop: "20px", marginBottom: "10px"}}>
                    <h1 style={{fontSize: "30px"}}>파트너 업체 관리</h1>
                </div>
                <div className="mx-auto" style={{marginBottom: "10px"}}>
                    <span>* 파트너업체를 조회합니다.</span>
                </div>
                <div style={{marginBottom: "20px"}}>
                    <SearchInfoSet callBack={searchHandle} props={searchInfo}/>
                </div>
                <div className="buttons" align="right" style={{margin: "20px"}}>
                    <Button
                        width={130}
                        text="Contained"
                        type="default"
                        stylingMode="contained"
                        style={{margin: "2px"}}
                        onClick={focusTextBox}
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
                        onRowDblClick={getDetail}
                        onClick={deleteCompany}
                        wordWrap={true}
                    />
                </div>

                <div style={{
                    padding: "20px",
                    margin: "10px",
                    border: "2px solid #CCCCCC",
                    display: 'flex',
                    height: "300px",
                    flexDirection: 'column',
                    justifyContent: "center"
                }}>
                    <h5 style={{alignItems: 'left'}}>외주업체정보를 입력/수정 합니다.</h5>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '20px',
                        marginLeft: '5px'
                    }}>
                        <TextBox
                            ref={insertRef}
                            onValueChange={(e) => {
                                handleChgValue("outordEntrpsNm", e)
                            }}
                            value={outordCompanyValue.outordEntrpsNm}
                            placeholder="업체명"
                            showClearButton={true}
                            style={{flex: 1, minWidth: '160px'}}
                        />
                        <TextBox
                            onValueChange={(e) => {
                                handleChgValue("brno", e)
                            }}
                            value={outordCompanyValue.brno}
                            placeholder="사업자등록번호"
                            showClearButton={true}
                            style={{flex: 1, minWidth: '160px'}}
                            maskRules={rules}
                        />
                        <TextBox
                            onValueChange={(e) => {
                                handleChgValue("picFlnm", e)
                            }}
                            value={outordCompanyValue.picFlnm}
                            placeholder="담당자"
                            showClearButton={true}
                            style={{flex: 1, minWidth: '160px'}}
                        />
                        <TextBox
                            onValueChange={(e) => {
                                handleChgValue("telno", e)
                            }}
                            value={outordCompanyValue.telno}
                            placeholder="전화번호"
                            showClearButton={true}
                            style={{flex: 1, minWidth: '160px'}}
                            maskRules={rules}
                        />
                        <TextBox
                            onValueChange={(e) => {
                                handleChgValue("addr", e)
                            }}
                            value={outordCompanyValue.addr}
                            placeholder="주소"
                            showClearButton={true}
                            style={{flex: 1, minWidth: '160px'}}
                        />
                    </div>
                    <div>
                        <FileUploader
                            selectButtonText="첨부파일"
                            multiple={true}
                            labelText=""
                            uploadMode="useButton"
                            onValueChanged={changeAttchValue}
                            ref={fileUploaderRef}
                        />
                    </div>
                    <div className="buttonContainer" style={{marginTop: '5px', marginLeft: '5px', alignItems: 'end'}}>
                        <Button type="default" style={{height: "48px", width: "60px", marginRight: "15px"}}
                                onClick={saveOutordC}>저장</Button>
                        <Button type="danger" style={{height: "48px", width: "60px", marginRight: "15px"}}
                                onClick={resetForm}>초기화</Button>
                    </div>
                </div>
            </div>
        );

}


export default ProjectOutordCompany;




