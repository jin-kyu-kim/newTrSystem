import {FileUploader} from "devextreme-react";
import React from "react";
import * as XLSX from "xlsx";
import { useModal } from "./ModalContext";

const ExcelUpload = (props) => {

    const fileExtensions = ['.xlsx', '.xls', '.csv'];
    const { handleOpen } = useModal();

    const handleAttachmentChange = (e) => {
        if (e.value.length > 0) {
            const file = e.value[0];
            const reader = new FileReader();
            reader.onload = async (e) => {

                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: "array", bookVBA: true });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                let jsonData = XLSX.utils.sheet_to_json(sheet);
                props.setExcel(jsonData);
            };
            reader.readAsArrayBuffer(file);
        }
    };

    return(
        <div>
            <FileUploader
                selectButtonText="파일 선택"
                labelText=""
                uploadMode="useButton"
                accept=".xlsx, .xls, .csv"
                showClearButton={false}
                allowedFileExtensions={fileExtensions}
                onValueChanged={(e) => {
                    if (e.value && e.value.length > 0) {
                        const file = e.value[0];
                        if (file && fileExtensions.includes(`.${file.name.split('.').pop()}`)) {
                            handleAttachmentChange(e);
                        } else if (file && !fileExtensions.includes(`.${file.name.split('.').pop()}`)) {
                            handleOpen('파일은 .xlsx, .xls, .csv 형식만 업로드 가능합니다.');
                            return ;
                        }
                    }
                }}
            />
        </div>
    );
};

export default ExcelUpload;