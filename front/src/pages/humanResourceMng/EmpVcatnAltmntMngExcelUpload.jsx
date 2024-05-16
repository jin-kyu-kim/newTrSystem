import { useEffect, useState, useRef } from 'react';

import { Popup, FileUploader, Button } from "devextreme-react";

// 엑셀업로드
// npm install xlsx
import * as XLSX from 'xlsx'

import { useModal } from "components/unit/ModalContext";
import ApiRequest from "utils/ApiRequest";
import CustomTable from "components/unit/CustomTable";



const EmpVcatnAltmntMngExcelUpload = ({ onHiding, visible }) => {
    const { handleOpen } = useModal();
    
    
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));


    const popupRef = useRef(null);

    useEffect(() => {
        getEmpList();
        getExcelAttachFile();
    }, [])





    // 직원목록조회
    const [selectEmpList, setSelectEmpList] = useState();

    // 직원목록조회
    const getEmpList = async () => {
        setSelectEmpList(await ApiRequest("/boot/common/queryIdSearch", { queryId: "humanResourceMngMapper.retrieveEmpList" }));
    }





    // 엑셀업로드 첨부파일조회
    const [selectExcelAttachFile, setSelectExcelAttachFile] = useState();

    // 엑셀업로드 첨부파일조회
    const getExcelAttachFile = async () => {
        try {
            setSelectExcelAttachFile(await ApiRequest('/boot/common/commonSelect', [ { tbNm: "ATCHMNFL" }, { atchmnflId: "a75e2f32-0a30-cf43-c3ab-5f36b65daae6" } ]));
        } catch (error) {
            console.log("selectData_error : ", error);
        }
    };




    // 엑셀업로드정보
    const [insertVcatnList, setInsertVcatnList] = useState();





    // 엑셀업로드
    const handleFileUpload = (event) => {
        const file = event.value[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });

            // 첫 번째 시트를 가져옴
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];

            // 셀 데이터를 파싱하여 출력
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            let errorMsg = "";
            let pushData = [];
            let pushFlag = true;

            jsonData.map((item, index, data) => {
                let findData = [];

                if (index != 0) {
                    if (selectEmpList.find(findItem => String(findItem.empno) == String(item[2]))) {
                        findData = selectEmpList.find(findItem => String(findItem.empno) == String(item[2]));
                        pushFlag = true;
                    } else if(item[2] == undefined){
                        pushFlag = false;
                    } else {
                        errorMsg += item[2] + " ";
                        pushFlag = false;
                    }

                    handleOpen("[ " + errorMsg + "]는 등록되지 않은 사번입니다.");

                    if (pushFlag) {
                        pushData.push({
                            flag: item[0],
                            vcatnYr: item[1],
                            empId: findData.empId,
                            empno: item[2],
                            empFlnm: findData.empFlnm,
                            jobNm: findData.jbpsNm,
                            altmntDaycnt: item[3],
                            useDaycnt: item[4],
                            remndrDaycnt: item[5],
                            altmntBgngYmd: item[6],
                            altmntUseEndYmd: item[7],
                            regEmpId: userInfo.empId,
                            mdfcnEmpId: userInfo.empId,
                            newVcatnYn: item[0] == "회계휴가" ? "N" : "Y",
                        })
                    }
                }
            })

            setInsertVcatnList(pushData);
        };

        reader.readAsArrayBuffer(file);

        popupRef.current.instance.on(createRenderData);
    }


    const onSaveClick = async() => {
        try {
            const response = await ApiRequest("/boot/humanResourceMng/insertVcatnMngExcel", insertVcatnList);
            handleOpen("저장되었습니다.");
            onHiding(false);
        } catch (error) {
            console.log("insertVcatnMngExcel_error : ", error);
        }
    }

    function onExeclDownload(){
        // 2024.05.16 (박지환)
        // 파일이 TRsystem/upload 경로에 저장되어 절대경로로 접근이 불가능해보임
        // 현재 upload 폴더에 파일 임의로 복사하여 사용중이며 추후 절대경로로 변경 필요함
        const downloadFile = document.createElement("a");
        downloadFile.href = "/upload/" + `${selectExcelAttachFile[0].strgFileNm}`;      // 해당경로변경필요
        downloadFile.download = `${selectExcelAttachFile[0].realFileNm}`;

        document.body.appendChild(downloadFile);
        downloadFile.click();
        document.body.removeChild(downloadFile);
    }


    // 렌더링
    function createRenderData() {
        return (
            <>
                <div>
                    <span>엑셀업로드 시 우측의 파일을 사용하여 업로드하세요.</span>
                        <Button 
                            style={{marginLeft: "20px"}}
                            text="파일다운로드"
                            onClick={onExeclDownload}
                        />
                </div>
                <div className="row" style={{ marginTop: "5px" }}>
                    <FileUploader
                        selectButtonText="파일선택"
                        multiple={false}
                        showFileList={false}
                        labelText=""
                        uploadMode="useButton"
                        onValueChanged={handleFileUpload}
                    />
                </div>
                <div style={{ marginTop: "20px" }}>
                    {
                        insertVcatnList && insertVcatnList.length > 0
                            ?
                            <CustomTable
                                keyColumn={"empno"}
                                columns={listTableColumns}
                                values={insertVcatnList}
                            />
                            : <></>
                    }
                </div>
                {
                    insertVcatnList && insertVcatnList.length > 0
                        ?
                        <div div className="row" style={{ display: "inline-block", float: "right", marginTop: "25px" }}>
                            <div style={{ display: "inline-block", float: "right", marginTop: "25px" }}>
                                <Button style={{ height: "48px", width: "60px" }} onClick={() => handleOpen("저장하시겠습니까?", onSaveClick)}>저장</Button>
                            </div>
                        </div>
                        : <></>
                }
            </>
        )
    }

    return (
        <div>
            <Popup
                title={"엑셀업로드"}
                width={"80%"}
                height={"80%"}
                visible={visible}
                showCloseButton={true}
                ref={popupRef}
                contentRender={createRenderData}
                onHiding={() => {
                    onHiding(false);
                }}

            />
        </div>
    )
};

export default EmpVcatnAltmntMngExcelUpload;


const listTableColumns = [
    { "key": "flag", "value": "휴가구분" },
    { "key": "vcatnYr", "value": "휴가배정년도" },
    { "key": "empno", "value": "사번" },
    { "key": "empFlnm", "value": "성명" },
    { "key": "jobNm", "value": "직위" },
    { "key": "altmntDaycnt", "value": "배정일수" },
    { "key": "useDaycnt", "value": "사용일수" },
    { "key": "remndrDaycnt", "value": "잔여일수" },
    { "key": "altmntBgngYmd", "value": "시작일자" },
    { "key": "altmntUseEndYmd", "value": "종료일자" },
]
