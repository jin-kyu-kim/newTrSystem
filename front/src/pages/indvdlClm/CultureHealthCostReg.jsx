import React, {useCallback, useEffect, useRef, useState} from "react";
import Button from "devextreme-react/button";
import CultureHealthCostJson from "./CultureHealthCostJson.json";
import {FileUploader} from "devextreme-react";
import DataGrid, {Column} from 'devextreme-react/data-grid';
import uuid from "react-uuid";
import ApiRequest from "../../utils/ApiRequest";
import axios from "axios";
import CustomLabelValue from "../../components/unit/CustomLabelValue";
import {useModal} from "../../components/unit/ModalContext";
import "./CultureHealthCostReg.css";

const fontSize = {
    fontSize: 14
}
const button = {
    borderRadius: '5px',
    width: '80px',
    marginTop: '20px',
    marginRight: '15px'
}

const CultureHealthCostReg = (props) => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const token = localStorage.getItem("token");
    const [values, setValues] = useState([]);
    const [attachments, setAttachments] = useState([]);
    const fileUploaderRef = useRef(null);
    const deleteFiles = useRef([{tbNm: "ATCHMNFL"}]);
    const [selectedItem, setSelectedItem] = useState(null);
    let selectedClmAmt = useRef(0);
    let selectedClturPhstrnSeCd = useRef(null);
    const { handleOpen } = useModal();
    let now = new Date();
    const Json = CultureHealthCostJson;
    const {labelValue} = Json;
    const [initParam, setInitParam] = useState({
        "clmAmt": 0,
        "clmYmd": now.getFullYear()+('0' + (now.getMonth() + 1)).slice(-2)+('0' + now.getDate()).slice(-2),
        "empId": userInfo.empId,
        "regEmpId": userInfo.empId
    });

    useEffect(() => {
        if(props.year != null){
            searchTable();
        }
    }, [props.year]);

    const getDate = (time) => {
        return time.getFullYear()+"/"+('0' + (time.getMonth() + 1)).slice(-2)+"/"+('0' + time.getDate()).slice(-2)
    }

    const getLastMonth = (time) => {
        if (typeof time === 'string'){
            time = new Date(time.slice(0,4)+"/"+time.slice(4,6)+"/"+time.slice(6));
        }
        let firstDayOfMonth = new Date( time.getFullYear(), time.getMonth() , 1 );
        let lastMonth = new Date ( firstDayOfMonth.setDate( firstDayOfMonth.getDate() - 1 ) );
        return lastMonth.getFullYear()+"/"+('0' + (lastMonth.getMonth()+1)).slice(-2);
    }

    const getTargetMonth = (time) => {
        let lastMonth = getLastMonth(time);
        let dateNum = Number(time.getDate());
        return dateNum > 5 ? time.getFullYear() + "/" + ('0' + (time.getMonth() + 1)).slice(-2)
            : lastMonth + ", " + time.getFullYear() + "/" + ('0' + (time.getMonth() + 1)).slice(-2);
    }

    const handleChgValue = ({name, value}) => {
        setInitParam(initParam => ({
            ...initParam,
            [name] : value
        }));
    };

    const handleAttachmentChange = (e) => {
        setAttachments(e.value);
        if(e.value.length === 0) {
            setInitParam({
                ...initParam,
                atchmnflId: null
            });
        } else {
            setInitParam({
                ...initParam,
                atchmnflId: uuid()
            });
        }
    };

    const clearFiles = () => {
        let fileUploader = fileUploaderRef.current.instance;
        fileUploader.reset();
    };

    const searchTable = async () => {
        const params = {
            queryId: Json.queryId,
            empId: userInfo.empId,
            clmYmd: props.year
        }
        try{
            const response = await ApiRequest("/boot/common/queryIdSearch", params);
            if (response.length !== 0) {
                const tmpList = [];
                const tmpValueList = [];
                response.forEach((element)=>{
                    let tmpElement = {
                        empId: element.empId,
                        clturPhstrnActCtSn: element.clturPhstrnActCtSn,
                    };

                    if(!tmpList.includes(JSON.stringify(tmpElement))){
                        tmpList.push(JSON.stringify(tmpElement));
                        tmpElement.month = element.clmYmd.substring(0, 4)+"/"+element.clmYmd.substring(4, 6);
                        tmpElement.clmYmd = element.clmYmd;
                        tmpElement.clmAmt = element.clmAmt;
                        tmpElement.actIem = element.actIem;
                        tmpElement.clturPhstrnSeCd = element.clturPhstrnSeCd;
                        tmpElement.frcsNm = element.frcsNm;
                        tmpElement.rm = element.rm;
                        if(element.atchmnflId !== null){
                            tmpElement.atchmnflId = element.atchmnflId;
                            tmpElement.atchmnfl = [];
                            tmpElement.atchmnfl.push({
                                atchmnflId: element.atchmnflId,
                                atchmnflSn: element.atchmnflSn,
                                realFileNm: element.realFileNm,
                                strgFileNm: element.strgFileNm

                            });
                        }
                        tmpValueList.push(tmpElement);
                    }else{
                        let index = tmpList.indexOf(JSON.stringify(tmpElement));
                        let copyIndex = tmpValueList[index];
                        copyIndex.atchmnfl.push({
                            atchmnflId: element.atchmnflId,
                            atchmnflSn: element.atchmnflSn,
                            realFileNm: element.realFileNm,
                            strgFileNm: element.strgFileNm
                        });
                        tmpValueList[index] = copyIndex;
                    }
                })
                setValues(tmpValueList);
            } else {
                setValues([]);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const validateUser = () => {
        const errors = [];
        if (userInfo.empTyCd !== 'VTW00201') {
            handleOpen('등록이 불가능한 사용자입니다.');
            errors.push('Invalid user');
        }
        return errors.length === 0;
    };

    const validateFile = () => {
        let maxSize = 0;
        attachments.map((file) => {
            if (file !== null) {
                maxSize += file.size;
            }
        })
        const errors = [];
        if (maxSize !== 0 && maxSize > 1048576) {
            handleOpen('업로드 가능한 용량보다 큽니다.');
            errors.push('Exceeded size limit');
        }
        return errors.length === 0;
    };

    const validateData = () => {
        const errors = [];
        const year = initParam.clmYmd.substring(0, 4);
        const month = initParam.clmYmd.substring(4, 6) - 1;
        const day = initParam.clmYmd.substring(6, 8);
        const clmYmd = new Date(year, month, day);

        if (now.getDate() >5) {
            if(now.getFullYear() !== clmYmd.getFullYear() || now.getMonth() !== clmYmd.getMonth()){
                handleOpen('등록 불가능한 일자입니다.');
                errors.push('Wrong Date');
            }
        }else{
            let firstDayOfMonth = new Date( now.getFullYear(), now.getMonth() , 1 );
            let lastMonth = new Date ( firstDayOfMonth.setDate( firstDayOfMonth.getDate() - 1 ) );
            if(!(now.getFullYear() === clmYmd.getFullYear() && now.getMonth() === clmYmd.getMonth()) &&
                !(lastMonth.getFullYear() === clmYmd.getFullYear() && lastMonth.getMonth() === clmYmd.getMonth())){
                handleOpen('등록 불가능한 일자입니다.');
                errors.push('Wrong Date');
            }
        }

        if (!initParam.clmYmd || !initParam.clmAmt || !initParam.clturPhstrnSeCd
            || !initParam.actIem || !initParam.frcsNm || !initParam.frcsNm) {
            handleOpen('입력되지 않은 항목이 있습니다.');
            errors.push('Data required');
        }

        return errors.length === 0;
    };

    const validateDate = () => {
        const errors = [];
        const year = selectedItem.clmYmd.substring(0, 4);
        const month = selectedItem.clmYmd.substring(4, 6) - 1;
        const day = selectedItem.clmYmd.substring(6, 8);
        const clmYmd = new Date(year, month, day);

        if (now.getDate() >5) {
            if(now.getFullYear() !== clmYmd.getFullYear() || now.getMonth() !== clmYmd.getMonth()){
                handleOpen('수정/삭제 불가능한 일자입니다.');
                errors.push('Wrong Date');
            }
        }else{
            let firstDayOfMonth = new Date( now.getFullYear(), now.getMonth() , 1 );
            let lastMonth = new Date ( firstDayOfMonth.setDate( firstDayOfMonth.getDate() - 1 ) );
            if(!(now.getFullYear() === clmYmd.getFullYear() && now.getMonth() === clmYmd.getMonth()) &&
                !(lastMonth.getFullYear() === clmYmd.getFullYear() && lastMonth.getMonth() === clmYmd.getMonth())){
                handleOpen('수정/삭제 불가능한 일자입니다.');
                errors.push('Wrong Date');
            }
        }

        return errors.length === 0;
    }

    const handleSubmit = async() => {
        const confirmResult = window.confirm("등록하시겠습니까?");
        if (confirmResult) {
            if (validateData() && validateFile() && validateUser()) {
                if(!initParam.clturPhstrnActCtSn){
                    try{
                        const formData = new FormData();
                        const tbData = {tbNm: "CLTUR_PHSTRN_ACT_CT_REG", snColumn: "clturPhstrnActCtSn", snSearch:{empId: initParam.empId}}
                        formData.append("tbNm", JSON.stringify(tbData));
                        formData.append("data", JSON.stringify(initParam));
                        Object.values(attachments)
                            .forEach((attachment) => formData.append("attachments", attachment));

                        const response = await axios.post("/boot/common/insertlongText", formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                                "Authorization": `Bearer ${token}`
                            },
                        })
                        if (response.status === 200) {
                            await ApiRequest('/boot/indvdlClm/plusClturPhstrnActCt', initParam);
                            onResetClick();
                            searchTable();
                            handleOpen('등록되었습니다.');
                        }
                    }catch (error){
                        console.error("API 요청 에러:", error);
                    }
                } else {
                    const formData = new FormData();
                    const tbData = {tbNm: "CLTUR_PHSTRN_ACT_CT_REG", snColumn: "clturPhstrnActCtSn", snSearch:{empId: userInfo.empId}}
                    formData.append("tbNm", JSON.stringify(tbData));
                    if(attachments.length > 0){
                        formData.append("data", JSON.stringify({
                            "clmAmt": initParam.clmAmt,
                            "clmYmd": initParam.clmYmd,
                            "clturPhstrnSeCd": initParam.clturPhstrnSeCd,
                            "actIem": initParam.actIem,
                            "frcsNm": initParam.frcsNm,
                            "atchmnflId": initParam.atchmnflId
                        }));
                        formData.append("deleteFiles", JSON.stringify(deleteFiles.current));
                    } else {
                        formData.append("data", JSON.stringify({
                            "clmAmt": initParam.clmAmt,
                            "clmYmd": initParam.clmYmd,
                            "clturPhstrnSeCd": initParam.clturPhstrnSeCd,
                            "actIem": initParam.actIem,
                            "frcsNm": initParam.frcsNm,
                        }));
                        formData.append("deleteFiles", JSON.stringify([{tbNm: "ATCHMNFL"}]));
                    }
                    formData.append("idColumn", JSON.stringify({empId: initParam.empId, clturPhstrnActCtSn: initParam.clturPhstrnActCtSn}));
                    Object.values(attachments)
                        .forEach((attachment) => formData.append("attachments", attachment));
                    const response = await axios.post("/boot/common/insertlongText", formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            "Authorization": `Bearer ${token}`
                        },
                    })
                    if (response.status === 200) {
                        if(selectedClmAmt.current !== initParam.clmAmt || selectedClturPhstrnSeCd !== initParam.clturPhstrnActCtSn){
                            let param = initParam;
                            param.selectedClmAmt = selectedClmAmt.current;
                            param.selectedClturPhstrnSeCd = selectedClturPhstrnSeCd.current;
                            await ApiRequest('/boot/indvdlClm/editClturPhstrnActCt', param);
                        }
                        deleteFiles.current = [{tbNm: "ATCHMNFL"}];
                        onResetClick();
                        searchTable();
                        setSelectedItem(null);
                        handleOpen('수정되었습니다.');
                    }
                }
                props.searchGrid();
            }
        }
    };

    const onFocusedRowChanged = useCallback((e) => {
        setSelectedItem(e.row.data);
    }, []);

    const onDeleteClick = async() => {
        if (validateDate()) {
            const confirmResult = window.confirm("삭제하시겠습니까?");
            if (confirmResult) {
                onResetClick();
                try {
                    const paramCh = [{ tbNm: "CLTUR_PHSTRN_ACT_CT_REG" }, { empId: selectedItem.empId, clturPhstrnActCtSn: selectedItem.clturPhstrnActCtSn }]
                    const responseCh = await ApiRequest("/boot/common/commonDelete", paramCh);
                    if (responseCh === 1) {
                        const paramMn = { empId: selectedItem.empId, clmYmd: selectedItem.clmYmd, clturPhstrnSeCd: selectedItem.clturPhstrnSeCd, clmAmt: selectedItem.clmAmt }
                        const responseMn = await ApiRequest('/boot/indvdlClm/minusClturPhstrnActCt', paramMn);
                        if (responseMn === 1) {
                            const paramAt = [{ tbNm: "ATCHMNFL" }, { atchmnflId: selectedItem.atchmnflId }]
                            if(selectedItem.atchmnflId != null){
                                await ApiRequest("/boot/common/commonDelete", paramAt);
                                searchTable();
                            }
                            props.searchGrid();
                            searchTable();
                            setSelectedItem(null);
                            handleOpen('삭제되었습니다.');
                        }
                    }
                } catch (error) {
                    console.error("API 요청 에러:", error);
                }
            }
        }
    };

    const onUpdateClick = async() => {
        if(validateDate()){
            deleteFiles.current = [{tbNm: "ATCHMNFL"}];
            selectedClmAmt.current = selectedItem.clmAmt;
            selectedClturPhstrnSeCd.current = selectedItem.clturPhstrnSeCd;
            setInitParam(selectedItem);
            if(selectedItem.atchmnfl){
                for(let i = 0; i < selectedItem.atchmnfl.length; i++){
                    deleteFiles.current.push({ atchmnflId: selectedItem.atchmnfl[i].atchmnflId,
                        atchmnflSn: selectedItem.atchmnfl[i].atchmnflSn, strgFileNm: selectedItem.atchmnfl[i].strgFileNm });
                }
            }
        }
    };

    const onResetClick = () => {
        clearFiles();
        setInitParam({
            "clmAmt": 0,
            "clmYmd": now.getFullYear()+('0' + (now.getMonth() + 1)).slice(-2)+('0' + now.getDate()).slice(-2),
            "clturPhstrnSeCd": null,
            "actIem": null,
            "frcsNm": null,
            "empId": userInfo.empId,
            "regEmpId": userInfo.empId,
            "atchmnflId": null
        })
    }

    const fileCell = (e) => {
        let atchList = e.data.atchmnfl;
        if (atchList != null) {
            return (<div>
                {atchList.map((item, index) => (
                    <div key={index} style={{whiteSpace: 'pre-wrap'}}>
                        <a href={`/upload/${item.strgFileNm}`} download={item.realFileNm}>{item.realFileNm}</a>
                    </div>
                ))}
            </div>);
        }
    }

    return (
        <div>
            <div className="itemBox" style={{display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: "2%"}}>
                <div className="itemBottom" style={{width: "63%"}}>
                    <p><strong>* 청구 목록 </strong></p>
                    <span style={fontSize}>
                            1. 입력, 수정, 삭제 가능 조건 <br/>
                              <strong>매달 1일 부터 5일 : 이전달과 현재달 청구 건</strong><br/>
                              <strong>매달 6일부터 말일 : 현재 달 청구 건</strong><br/>
                            <br/>
                               * 현재날짜 : <span
                                style={{color: "red"}}>{getDate(now)}</span><br/>
                            * 입력, 수정 및 삭제 가능한 청구대상 월 : <span style={{color: "red"}}>{getTargetMonth(now)}</span><br/>
                        </span>
                </div>
                <div className="itemTop" style={{width: "35%"}}>
                    <p><strong>* 문화 체련비 등록</strong></p>
                    <div style={fontSize}>
                        <p>1. 체력 향상과 문화 교육을 위해 지원하는 경비입니다.</p>
                        <p>2. 월 20만원 한도로 지급된 법인카드를 통해서만 이용 가능합니다.</p>
                        <p>3. <strong>체력단련비 : 헬스/요가/수영/필라테스</strong>와 같이 월단위 이상 수강/강습을 지원합니다.<br/>
                            <strong>(일회성 경비나 쿠폰은 문화비로 전환하여 지급합니다.)</strong><br/></p>
                        <p>4. <strong>문화비 :</strong> 문화 교육과 어학 강습을 지원하며 월 단위 이상 관인학원에 한합니다.<br/>
                            <strong>(문화비의 경우 매월 상여로 처리하며 연말정산 시 본인이 세금을 부담합니다.)</strong></p>
                    </div>
                </div>
            </div>
            <div className="itemBox" style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                <div className="itemBottom" style={{width: "63%"}}>
                    <DataGrid
                        keyExpr={'clturPhstrnActCtSn'}
                        dataSource={values}
                        onFocusedRowChanged={onFocusedRowChanged}
                        focusedRowEnabled={true}
                        wordWrapEnabled={true}
                    >
                        <Column dataField='month' caption='대상월' alignment="center"/>
                        <Column dataField='clmYmd' caption='청구일자' alignment="center" dataType="date" format="yyyy-MM-dd"/>
                        <Column dataField='clmAmt' caption='금액' alignment="center" format={"#,###"}/>
                        <Column dataField='actIem' caption='항목' alignment="center"/>
                        <Column dataField='rm' caption='비고' alignment="center"/>
                        <Column dataField='frcsNm' caption='가맹점' alignment="center"/>
                        <Column caption='첨부' minWidth={150} cellRender={fileCell} alignment="center"/>
                    </DataGrid>
                    <div style={{display: "flex", justifyContent: "flex-end"}}>
                        <Button text="수정" onClick={onUpdateClick} disabled={!selectedItem} style={button}></Button>
                        <Button text="삭제" onClick={onDeleteClick} disabled={!selectedItem} type='danger' style={button}></Button>
                    </div>
                </div>
                <div className="itemTop" style={{width: "35%"}}>
                    <span style={{color: "red", fontSize: 14, fontWeight: "bold"}}>*법인카드로 결제한 날짜를 입력해 주세요.</span>
                    <CustomLabelValue props={labelValue.clmYmd} onSelect={handleChgValue}
                                      value={initParam?.clmYmd}/>
                    <CustomLabelValue props={labelValue.clmAmt} onSelect={handleChgValue}
                                      value={initParam?.clmAmt}/>
                    <CustomLabelValue props={labelValue.clturPhstrnSeCd} onSelect={handleChgValue}
                                      value={initParam?.clturPhstrnSeCd}/>
                    <CustomLabelValue props={labelValue.actIem} onSelect={handleChgValue}
                                      value={initParam?.actIem}/>
                    <CustomLabelValue props={labelValue.frcsNm} onSelect={handleChgValue}
                                      value={initParam?.frcsNm}/>
                    <FileUploader
                        selectButtonText="파일 선택"
                        labelText="또는 드래그"
                        multiple={true}
                        accept="*/*"
                        uploadMode="useButton"
                        onValueChanged={handleAttachmentChange}
                        maxFileSize={1.5 * 1024 * 1024 * 1024}
                        ref={fileUploaderRef}
                    >
                    </FileUploader>
                    <div style={{display: "flex", justifyContent: "flex-end"}}>
                        <Button style={button} type='default' text="저장" onClick={handleSubmit}></Button>
                        <Button style={button} text="초기화" onClick={onResetClick}></Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CultureHealthCostReg;