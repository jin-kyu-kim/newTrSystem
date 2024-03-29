import {FileUploader} from "devextreme-react";
import React from "react";
import * as XLSX from "xlsx";

const fileExtensions = ['.xlsx', '.xls', '.csv'];

const ExcelUpload = (props) => {
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
                labelText="또는 드래그"
                uploadMode="useButton"
                accept="*/*"
                allowedFileExtensions={fileExtensions}
                onValueChanged={handleAttachmentChange}
            />
        </div>
    );
};

export default ExcelUpload;