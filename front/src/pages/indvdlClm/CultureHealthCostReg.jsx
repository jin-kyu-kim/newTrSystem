import React, {useCallback, useEffect, useRef, useState} from "react";
import Button from "devextreme-react/button";
import CultureHealthCostJson from "./CultureHealthCostJson.json";
import {FileUploader} from "devextreme-react";
import DataGrid, {Column} from 'devextreme-react/data-grid';
import uuid from "react-uuid";
import ApiRequest from "../../utils/ApiRequest";
import {useCookies} from "react-cookie";
import axios from "axios";
import CustomLabelValue from "../../components/unit/CustomLabelValue";

const empListContainerStyle = {
    width: "65%",
    marginTop: "20px",
};
const empDetailContainerStyle = {
    width: "35%",
    display: "flex",
    flexDirection: "column",
    marginTop: "20px",
};
const fontSize = {
    fontSize: 14
}
const button = {
    borderRadius: '5px',
    width: '80px',
    marginTop: '20px',
    marginRight: '15px'
}

const CultureHealthCostReg = () => {
    const [cookies] = useCookies([]);
    const [values, setValues] = useState([]);
    const [attachments, setAttachments] = useState([]);
    const fileUploaderRef = useRef(null);
    const [selectedItem, setSelectedItem] = useState(null);
    let now = new Date();
    const Json = CultureHealthCostJson;
    const {labelValue} = Json;
    const [initParam, setInitParam] = useState({
        "clmAmt": 0,
        "clmYmd": now.getFullYear()+('0' + (now.getMonth() + 1)).slice(-2)+('0' + now.getDate()).slice(-2),
        "empId": cookies.userInfo.empId,
        "regEmpId": cookies.userInfo.empId
    });

    useEffect(() => {
        searchTable();
    }, []);

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
        setInitParam({
            ...initParam,
            atchmnflId: uuid()
        });
    };

    const clearFiles = () => {
        let fileUploader = fileUploaderRef.current.instance;
        fileUploader.reset();
    };

    const searchTable = async () => {
        const params = {
            queryId: Json.queryId,
            empId: cookies.userInfo.empId
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
                        tmpElement.month = getLastMonth(element.clmYmd);
                        tmpElement.clmYmd = element.clmYmd;
                        tmpElement.clmAmt = element.clmAmt;
                        tmpElement.actIem = element.actIem;
                        tmpElement.clturPhstrnSeCd = element.clturPhstrnSeCd;
                        tmpElement.actPurps = element.actPurps;
                        tmpElement.frcsNm = element.frcsNm;
                        tmpElement.rm = element.rm;
                        if(element.atchmnflId !== null){
                            tmpElement.atchmnflId = element.atchmnflId;
                            tmpElement.atchmnfl = [];
                            tmpElement.atchmnfl.push({
                                atchmnflId: element.atchmnflId,
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

    const validateData = () => {
        let maxSize = 0;
        attachments.map((file) => {
            if (file !== null) {
                maxSize += file.size;
            }
        })
        const errors = [];
        if (maxSize !== 0 && maxSize > 1048576) {
            alert('업로드 가능한 용량보다 큽니다')
            errors.push('Exceeded size limit');
        }
        return errors.length === 0;
    };

    const handleSubmit = async() => {
        const confirmResult = window.confirm("등록하시겠습니까?");
        if (confirmResult) {
            const formData = new FormData();
            const test = {tbNm: "CLTUR_PHSTRN_ACT_CT_REG", snColumn: "clturPhstrnActCtSn", snSearch:{empId: cookies.userInfo.empId}}
            formData.append("tbNm", JSON.stringify(test));
            formData.append("data", JSON.stringify(initParam));
            Object.values(attachments)
                .forEach((attachment) => formData.append("attachments", attachment));
            try {
                if (validateData()) {
                    const response = await axios.post("/boot/common/insertlongText", formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        },
                    })
                    if (response.status === 200) {
                        onResetClick()
                        searchTable();
                        window.alert("등록되었습니다.")
                    }
                }
            } catch (error) {
                console.error("API 요청 에러:", error);
                throw error;
            }
        }
    };

    const onFocusedRowChanged = useCallback((e) => {
        setSelectedItem(e.row.data);
    }, []);

    const onDeleteClick = async() => {
        const confirmResult = window.confirm("삭제하시겠습니까?");
        if (confirmResult) {
            try {
                const paramCh = [{ tbNm: "CLTUR_PHSTRN_ACT_CT_REG" }, { empId: selectedItem.empId, clturPhstrnActCtSn: selectedItem.clturPhstrnActCtSn }]
                const responseCh = await ApiRequest("/boot/common/commonDelete", paramCh);
                if (responseCh === 1) {
                    const paramAt = [{ tbNm: "ATCHMNFL" }, { atchmnflId: selectedItem.atchmnflId }]
                    await ApiRequest("/boot/common/commonDelete", paramAt);
                    searchTable();
                    window.alert("삭제되었습니다.")
                }
            } catch (error) {
                console.error("API 요청 에러:", error);
                console.log(error);
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
            "actPurps": null,
            "frcsNm": null,
            "empId": cookies.userInfo.empId,
            "regEmpId": cookies.userInfo.empId,
            "atchmnflId": null
        })
    }

    const fileCell = (e) => {
        let atchList = e.data.atchmnfl;
        if (atchList != null) {
            return (<div>
                {atchList.map((item, index) => (
                    <div key={index}>
                        <a href={`/upload/${item.strgFileNm}`} download={item.realFileNm}>{item.realFileNm}</a>
                    </div>
                ))}
            </div>);
        }
    }

    return (
        <div className="container">
            <div style={{display: "flex"}}>
                <div className="empListContainer" style={empListContainerStyle}>
                    <div className="empListTable" style={{minWidth: "480px"}}>
                        <div style={{height: "310px"}}>
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
                        <DataGrid
                            keyExpr={'clturPhstrnActCtSn'}
                            dataSource={values}
                            onFocusedRowChanged={onFocusedRowChanged}
                            focusedRowEnabled={true}
                        >
                            <Column dataField='month' caption='대상월' minWidth={30} alignment="center"/>
                            <Column dataField='clmYmd' caption='청구일자' minWidth={30} alignment="center"/>
                            <Column dataField='clmAmt' caption='금액' minWidth={30} alignment="center"/>
                            <Column dataField='actIem' caption='항목' minWidth={30} alignment="center"/>
                            <Column dataField='actPurps' caption='목적' minWidth={30} alignment="center"/>
                            <Column dataField='rm' caption='비고' minWidth={100} alignment="center"/>
                            <Column dataField='frcsNm' caption='가맹점' minWidth={100} alignment="center"/>
                            <Column caption='첨부' minWidth={100} cellRender={fileCell} alignment="center"/>
                        </DataGrid>
                    </div>
                    <div style={{display: "flex", justifyContent: "flex-end"}}>
                        <Button text="삭제" onClick={onDeleteClick} disabled={!selectedItem} type='danger' style={button}></Button>
                    </div>
                </div>
                <div style={empDetailContainerStyle}>
                    <div style={{height: "290px", marginLeft: "15px"}}>
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
                    <div className="dx-fieldset" style={{width: '100%'}}>
                        <span style={{color: "red", fontSize: 14, fontWeight: "bold"}}>*법인카드로 결제한 날짜를 입력해 주세요.</span>
                        <CustomLabelValue props={labelValue.clmYmd} onSelect={handleChgValue}
                                          value={initParam?.clmYmd}/>
                        <CustomLabelValue props={labelValue.clmAmt} onSelect={handleChgValue}
                                          value={initParam?.clmAmt}/>
                        <CustomLabelValue props={labelValue.clturPhstrnSeCd} onSelect={handleChgValue}
                                          value={initParam?.clturPhstrnSeCd}/>
                        <CustomLabelValue props={labelValue.actIem} onSelect={handleChgValue}
                                          value={initParam?.actIem}/>
                        <CustomLabelValue props={labelValue.actPurps} onSelect={handleChgValue}
                                          value={initParam?.actPurps}/>
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
                    </div>
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