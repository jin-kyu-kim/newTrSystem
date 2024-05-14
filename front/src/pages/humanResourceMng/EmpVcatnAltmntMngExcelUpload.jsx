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

    const popupRef = useRef(null);

    useEffect(() => {
        getEmpList();
    }, [])
    
    



    // 직원목록조회
    const [selectEmpList, setSelectEmpList] = useState();

    // 직원목록조회
    const getEmpList = async () => {
        setSelectEmpList(await ApiRequest("/boot/common/queryIdSearch", { queryId: "humanResourceMngMapper.retrieveEmpList" }));
    }





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
                
                if(index != 0){
                    if(selectEmpList.find(findItem => String(findItem.empno) == String(item[2]))){
                        findData = selectEmpList.find(findItem => String(findItem.empno) == String(item[2]));
                        pushFlag = true;
                    } else {
                        errorMsg += item[2] + " ";
                        pushFlag = false;
                    }

                    handleOpen("[ " + errorMsg + "]는 등록되지 않은 사번입니다.");

                    if(pushFlag){
                        pushData.push({
                            flag: item[0],         
                            vcatnYr: item[1],         
                            empno: item[2],         
                            empFlnm: findData.empFlnm,         
                            jobNm: findData.jbpsNm,         
                            altmntDaycnt: item[3],         
                            useDaycnt: item[4],         
                            remndrDaycnt: item[5],         
                            startDay: item[6],         
                            endDay: item[7],         
                        })
                    }
                }
            })

            setInsertVcatnList(pushData);
        };

        reader.readAsArrayBuffer(file);

        popupRef.current.instance.on(createRenderData);
    }





    // 렌더링
    function createRenderData() {
        console.log("insertVcatnList : ", insertVcatnList);
        return (
            <>
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
                <div style={{marginTop: "20px"}}>
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
    {"key": "flag", "value": "휴가구분"},
    {"key": "vcatnYr", "value": "휴가배정년도"},
    {"key": "empno", "value": "사번"},
    {"key": "empFlnm", "value": "성명"},
    {"key": "jobNm", "value": "직위"},
    {"key": "altmntDaycnt", "value": "배정일수"},
    {"key": "useDaycnt", "value": "사용일수"},
    {"key": "remndrDaycnt", "value": "잔여일수"},
    {"key": "startDay", "value": "시작일자"},
    {"key": "endDay", "value": "종료일자"},
]
