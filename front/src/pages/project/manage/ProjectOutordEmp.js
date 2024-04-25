import { useState, useEffect, useRef } from "react";
import ApiRequest from "../../../utils/ApiRequest";
import { Button, TextBox, FileUploader,NumberBox,DateBox } from "devextreme-react";
import  ProjectOutordEmpJson from "./ProjectOutordEmpJson.json";
import SearchOutordSet from "components/composite/SearchInfoSet";
import CustomCdComboBox from "../../../components/unit/CustomCdComboBox";
import axios from "axios";
import CustomTable from "components/unit/CustomTable";
import { useCookies } from "react-cookie";
import uuid from "react-uuid";

function ProjectOutordEmp () {
    const [values, setValues] = useState([]);
    const [param, setParam] = useState({});
    const [totalItems, setTotalItems] = useState(0);
    const [outordEmpValue,setOutordEmpValue] = useState({}); //외주업체 insert 및 클릭이벤트 값설정용
    const [attachments, setAttachments] = useState([]);
    const [empMax,setEmpMax] =useState({});   //사번 MAX값
    const { keyColumn, queryId, tableColumns ,searchInfo} = ProjectOutordEmpJson;
    const fileUploaderRef = useRef(null); //파일 업로드용 ref
    const insertRef = useRef(null); //textbox focus용 ref
    const [deleteFiles, setDeleteFiles] = useState([{tbNm: "ATCHMNFL"}]);
    const [cookies, setCookie] = useCookies(["userInfo", "userAuth"]);
    const empId = cookies.userInfo.empId;
    const date = new Date();
    const now =  date.toISOString().split("T")[0] +" " +date.toTimeString().split(" ")[0];
//============== 초기 조회할 때==========================================    
    useEffect(() => {
        if (!Object.values(param).every((value) => value === "")) {
          pageHandle();
        }
      }, [param]);
    
    useEffect(()=>{
        setOutordEmpValue({
            empId : null,
            empno : null,
            outordHnfOgdpNm : null,
            empFlnm : null,
            brdt : null,
            outordHnfGradCd : null,
            telno : null,
            eml : null,
            atchmnflId : null
        })
    },[]);

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
      const handleChgValue = ( name, value ) => {
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

//=================첨부파일=================================================
        const changeAttchValue = (e) => {
            setOutordEmpValue({
                ...outordEmpValue,
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
            setOutordEmpValue({
              empId : null,
              empno : null,
              outordHnfOgdpNm : null,
              empFlnm : null,
              brdt : null,
              outordHnfGradCd : null,
              telno : null,
              eml : null,
              atchmnflId : null
          })
        };
//================테이블 로우 클릭 이벤트================================================== 
          const focusTextBox = () => {
            // 텍스트 박스로 이동합니다.
            let focusTextBox = insertRef.current.instance; 
            focusTextBox.focus();
          };

        const getDetail = (e) => {
            setOutordEmpValue({
                ...outordEmpValue,
                empId : e.data.empId,
                empno : e.data.empno,
                outordHnfOgdpNm : e.data.outordHnfOgdpNm,
                empFlnm : e.data.empFlnm,
                brdt : e.data.brdt,
                outordHnfGradCd : e.data.outordHnfGradCd,
                atchmnflId: e.data.atchmnflId,
                picFlnm : e.data.picFlnm,
                telno : e.data.telno,
                eml : e.data.eml,
            });
            focusTextBox();
        };
//================저장버튼 이벤트==================================================     
        const saveOutordEmp = () => {
           if(outordEmpValue.outordHnfOgdpNm === null){
                alert("소속을 입력해주세요");
           }else if(outordEmpValue.empFlnm === null){
                alert("성명를 입력해주세요");
           }else if(outordEmpValue.outordHnfGradCd === null){
                alert("등급을 선택해주세요");
           }else{
            const isconfirm = window.confirm("저장하시겠습니까?");
        if (isconfirm) {
           if(outordEmpValue.empId === "" || outordEmpValue.empId === null || outordEmpValue.empId === undefined ){
            empnoHandle();
           }else{
            updateEmpValue();
           }
        } else {
            return;
        }
           }
        };
//================Insert================================================== 
        const empnoHandle = async () => { // max값 채번
          try {
            const response = await ApiRequest("/boot/common/queryIdSearch", {empnoChk : "VKP" ,queryId : "humanResourceMngMapper.retrieveEmpnoMax", });
            setEmpMax(response[0].empnoChk);    
          } catch (error) {
            console.log(error);
          }
        };

        useEffect(()=> { //채번값 설정 후 insert 이벤트 진행
          if (!Object.values(empMax).every((value) => value === "")) {
              insertEmpValue();
             }
        },[empMax])


        const insertEmpValue = async() =>{
            const insertData = 
                ({ 
                    empId : uuid(),
                    empno : empMax,
                    hdofSttsCd : 'VTW00301',
                    empTyCd : 'VTW00203',
                    empFlnm : outordEmpValue.empFlnm,
                    outordHnfOgdpNm : outordEmpValue.outordHnfOgdpNm,
                    outordHnfGradCd : outordEmpValue.outordHnfGradCd,
                    brdt : outordEmpValue.brdt,
                    telno : outordEmpValue.telno,
                    eml : outordEmpValue.eml,
                    atchmnflId : outordEmpValue.atchmnflId,
                    regDt : now,
                    regEmpId : empId,
                });

                const formData = new FormData();
                formData.append("tbNm", JSON.stringify({tbNm: "EMP"}));
                formData.append("data", JSON.stringify(insertData));
                Object.values(attachments).forEach((attachment) => formData.append("attachments", attachment));
                try {
                    const response = await axios.post("/boot/common/insertlongText", formData, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    });
                      if (response.data >= 1) {
                        alert("저장되었습니다.");
                        setEmpMax({});
                        resetForm();
                        pageHandle();
                      }
                  } catch (error) {
                    console.error("Error fetching data", error);
                  }
        } 
//================Update==================================================       
        const updateEmpValue = async() =>{
                const updateData =
                ({ 
                    empFlnm : outordEmpValue.empFlnm,
                    outordHnfOgdpNm : outordEmpValue.outordHnfOgdpNm,
                    outordHnfGradCd : outordEmpValue.outordHnfGradCd,
                    brdt : outordEmpValue.brdt,
                    telno : outordEmpValue.telno,
                    eml : outordEmpValue.eml,
                    atchmnflId : outordEmpValue.atchmnflId,
                    mdfcnDt : now,
                    mdfcnEmpId : empId,
                });
               
                 
                const formData = new FormData();
                formData.append("tbNm", JSON.stringify({tbNm: "EMP"}));
                formData.append("data", JSON.stringify(updateData));
                formData.append("deleteFiles", JSON.stringify(deleteFiles));
                formData.append("idColumn", JSON.stringify({empId : outordEmpValue.empId}));
                Object.values(attachments).forEach((attachment) => formData.append("attachments", attachment));
                
                try {
                    const response = await axios.post("/boot/common/insertlongText", formData, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    });
                      if (response.data >= 1) {
                        alert("저장되었습니다.");
                        resetForm();
                        pageHandle();
                      }
                  } catch (error) {
                    console.error("Error fetching data", error);
                  }
        }
//================Delete==================================================
        const deleteOutEmp = () => {
            const isconfirm = window.confirm("삭제하시겠습니까?");
            if (isconfirm) {
                deleteEmpValue();
                } else {
                    return;
                }
        }

        const deleteEmpValue = async() =>{

                const deleteParam = [{ tbNm: "EMP" },{empId : outordEmpValue.empId}];
                const fileParams = [{ tbNm: "ATCHMNFL" },{ atchmnflId: outordEmpValue.atchmnflId}];
                try {
                    const response = await ApiRequest("/boot/common/deleteWithFile", {params : deleteParam, fileParams: fileParams});
                    if (response >= 1) {
                        alert("삭제되었습니다.");
                        resetForm();
                        pageHandle();
                    }
                } catch (error) {
                    console.error("Error fetching data", error);
                }
        }
//================ 화면 그리는 구간=========================================
    return (
    <div className="container">

            <div className="title p-1" style={{ marginTop: "20px", marginBottom: "10px" }}>
                <h1 style={{ fontSize: "40px" }}>파트너직원관리</h1>
            </div>

            <div className="col-md-10 mx-auto" style={{ marginBottom: "10px" }}>
                <span>* 파트너 직원을 조회합니다.</span>
            </div>

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
                    onRowClick={getDetail}
                    onClick={deleteOutEmp}
                    wordWrap={true}
                    />
            </div>
               
             <div style={{ marginTop: "10px", border: "2px solid #CCCCCC",display : 'flex', height: "300px",flexDirection: 'column', justifyContent: "center"  }}>
                   <h5 style={{alignItems : 'left'}}>외주직원정보를 입력/수정 합니다.</h5>
             <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center',justifyContent: 'center', gap: '20px', marginLeft : '5px', alignItems: "center"}}>
                    <TextBox
                        ref={insertRef}
                        onValueChange={(e) => { handleChgValue("outordHnfOgdpNm", e) }}
                        value={outordEmpValue.outordHnfOgdpNm}
                        placeholder="소속"
                        showClearButton={true}
                        style={{ flex: 1, minWidth: '160px' }}
                    />
                    <TextBox
                        onValueChange={(e) => { handleChgValue("empFlnm", e) }}
                        value={outordEmpValue.empFlnm}
                        placeholder="성명"
                        showClearButton={true}
                        style={{ flex: 1, minWidth: '160px' }}
                    />
                    <DateBox
                        onValueChange={(e) => { handleChgValue("brdt", e) }}
                        value={outordEmpValue.brdt}
                        placeholder="생년월일"
                        showClearButton={true}
                        style={{ flex: 1, minWidth: '160px' }}
                    />
                    <CustomCdComboBox
                        param="VTW005"
                        placeholderText="등급"
                        name="outordHnfGradCd"
                        onSelect={handleChgCd}
                        value={outordEmpValue.outordHnfGradCd}
                        required={false}
                        style={{ flex: 1, minWidth: '160px' }}
                     />
                    <TextBox
                        onValueChange={(e) => { handleChgValue("telno", e) }}
                        value={outordEmpValue.telno}
                        placeholder="전화번호"
                        showClearButton={true}
                        style={{ flex: 1, minWidth: '160px' }}
                    />
                     <TextBox
                        onValueChange={(e) => { handleChgValue("eml", e) }}
                        value={outordEmpValue.eml}
                        placeholder="이메일"
                        showClearButton={true}
                        style={{ flex: 1, minWidth: '160px' }}
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
                    <div className="buttonContainer" style={{ marginTop: '5px',marginLeft : '5px' ,alignItems: 'left'}}>
                        <Button type = "default" style={{ height: "48px", width: "60px", marginRight: "15px" }} onClick={saveOutordEmp}>저장</Button>
                        <Button type = "danger" style={{ height: "48px", width: "60px", marginRight: "15px" }} onClick={resetForm}>초기화</Button>
                        
                    </div>
                </div>
      </div>
    );
};


export default ProjectOutordEmp;




