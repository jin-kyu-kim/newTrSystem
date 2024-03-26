import {FileUploader} from "devextreme-react";
import Button from "devextreme-react/button";
import React from "react";
import * as XLSX from "xlsx";

const fileExtensions = ['.xlsx', '.xls', '.csv'];
const button = {
    borderRadius: '5px',
    width: '95px',
    marginLeft: '10px'
}

const ExcelUpload = (props) => {
    let jsonData = null;
    const handleAttachmentChange = (e) => {
        if (e.value.length > 0) {
            const file = e.value[0];
            const reader = new FileReader();
            reader.onload = async (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: "array", bookVBA: true });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                jsonData = XLSX.utils.sheet_to_json(sheet);
            };
            reader.readAsArrayBuffer(file);
        }
    };
    const onJsonClick =() => {
        props.setExcel(jsonData);
    }

    return(
        <div>
            <FileUploader
                selectButtonText="파일 선택"
                labelText="또는 드래그"
                uploadMode="useButton"
                accept="*/*"
                allowedFileExtensions={fileExtensions}
                onValueChanged={handleAttachmentChange}
            >
            </FileUploader>
            <Button style={button} text="업로드" type='default' onClick={onJsonClick}></Button>
        </div>
    );
};

export default ExcelUpload;