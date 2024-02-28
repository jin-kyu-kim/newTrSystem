import { useMemo, useEffect, useState } from "react";
import CustomCdComboBox from "../../../components/unit/CustomCdComboBox";
import uuid from 'react-uuid'
import ApiRequest from "../../../utils/ApiRequest";

import ProjectRegistJson from "./ProjectRegistJson.json"
import CustomLabelValue from "../../../components/unit/CustomLabelValue"
import Button from "devextreme-react/button";

import { useCookies } from "react-cookie";
import { set } from "date-fns";

const ProjectRegist = ({prjctId, onHide, revise}) => {
    const labelValue = ProjectRegistJson.labelValue;
    const updateColumns = ProjectRegistJson.updateColumns;

    const [readOnly, setReadOnly] = useState(revise);

    const [data, setData] = useState([]);
    const [stleCd, setStleCd] = useState();
    const [cookies, setCookie] = useCookies(["userInfo", "userAuth"]);
    const [updateParam, setUpdateParam] = useState([]);

    const [beffatPbancDdlnYmd, setBeffatPbancDdlnYmd] = useState();
    const [expectOrderYmd, setExpectOrderYmd] = useState();
    const [propseDdlnYmd, setPropseDdlnYmd] = useState();  
    const [propsePrsntnYmd, setPropsePrsntnYmd] = useState();  
    const [ctrtYmd, setCtrtYmd] = useState(); 
    const [bizEndYmd, setBizEndYmd] = useState();
    const [stbleEndYmd, setStbleEndYmd] = useState();
    const [igiYmd, setIgiYmd] = useState();

    const empId = cookies.userInfo.empId;
    const deptId = cookies.userInfo.deptId;

    useEffect(() => {
        if(prjctId != null) {
            BaseInfoData();
        } else {
            const date = new Date();

            setData({
                ...data,
                prjctId : uuid(),
                prjctMngrEmpId : empId,
                deptId : deptId,
                bizSttsCd: "VTW00401",
                regDt : date.toISOString().split('T')[0]+' '+date.toTimeString().split(' ')[0]
            })
        }

        setUpdateParam(updateColumns);
    }, []);

    useEffect(() => {
        const date = new Date();

            setData({
                ...data,
                prjctStleCd : stleCd,
                prjctId : uuid(),
                prjctMngrEmpId : empId,
                deptId : deptId,
                bizSttsCd: "VTW00401",
                regDt : date.toISOString().split('T')[0]+' '+date.toTimeString().split(' ')[0]
            })
            setBeffatPbancDdlnYmd(null);
            setExpectOrderYmd(null);
            setPropseDdlnYmd(null);
            setPropsePrsntnYmd(null);
            setCtrtYmd(null);
            setBizEndYmd(null);
            setStbleEndYmd(null);
            setIgiYmd(null);

    }, [stleCd]);

    const BaseInfoData = async () => {
        const param = [ 
            { tbNm: "PRJCT" }, 
            { 
            prjctId: prjctId, 
            }, 
        ]; 
        try {
            const response = await ApiRequest("/boot/common/commonSelect", param);
            setData(response[0]);
            setBeffatPbancDdlnYmd(response[0].beffatPbancDdlnYmd);
            setExpectOrderYmd(response[0].expectOrderYmd);
            setPropseDdlnYmd(response[0].propseDdlnYmd);
            setPropsePrsntnYmd(response[0].propsePrsntnYmd);
            setCtrtYmd(response[0].ctrtYmd);
            setBizEndYmd(response[0].bizEndYmd);
            setStbleEndYmd(response[0].stbleEndYmd);
            setIgiYmd(response[0].igiYmd);

        } catch (error) {
            console.error('Error fetching data', error);
        }
    };

    const handleChgState = ({name, value}) => {

        if(!readOnly) {

            setData({
                ...data,
                [name] : value
            });
        }
    };

    const handleChgDate = ({name, value}) => {

        if(!readOnly) {
            if(name === "beffatPbancDdlnYmd") {
                setBeffatPbancDdlnYmd(value);
            } else if(name === "expectOrderYmd") {
                setExpectOrderYmd(value);
            } else if(name === "propseDdlnYmd") {
                setPropseDdlnYmd(value);
            } else if(name === "propsePrsntnYmd") {
                setPropsePrsntnYmd(value);
            } else if(name === "ctrtYmd") {
                setCtrtYmd(value);
            } else if(name === "bizEndYmd") {
                setBizEndYmd(value);
            } else if(name === "stbleEndYmd") {
                setStbleEndYmd(value);
            } else if(name === "igiYmd") {
                setIgiYmd(value);
            }
        }
    }

    const handleChgStleCd = ({value}) => {

        if(!readOnly) {
            setStleCd(value);
        }
    };

    const onClickUdt = async () => {
        const isconfirm = window.confirm("프로젝트 기본정보를 수정 하시겠습니까?");
        if(isconfirm){
            setReadOnly(false);
        }
    }

    // 수정 중 취소 버튼 클릭
    const onClickUdtCncl = async () => {
        const isconfirm = window.confirm("프로젝트 기본정보를 수정을 취소 하시겠습니까?");
        if(isconfirm){
            BaseInfoData();
            setReadOnly(true);
        }
    }

    const onClickChgSave = async () => {
        const isconfirm = window.confirm("수정한 내용을 저장 하시겠습니까?");
        if(isconfirm){
            updateProject();
        }
    }

    const updateProject = async () => {
        const mdfcnDt = new Date().toISOString().split('T')[0]+' '+new Date().toTimeString().split(' ')[0];

        const colums = {
            ...updateParam,
            mdfcnEmpId: empId,
            mdfcnDt: mdfcnDt,
        };

        // updataParam 안의 key와 data의 key랑 같은 거에 test에 data의 value를 넣어준다.
        for (const key in data) {
            if(data.hasOwnProperty(key) && updateParam.hasOwnProperty(key)) {
                colums[key] = data[key];
            }
        }

        const param = [
            { tbNm: "PRJCT" },
            { 
                ...colums,
                beffatPbancDdlnYmd: beffatPbancDdlnYmd,
                expectOrderYmd: expectOrderYmd,
                propseDdlnYmd: propseDdlnYmd,
                propsePrsntnYmd: propsePrsntnYmd,
                ctrtYmd: ctrtYmd,
                bizEndYmd: bizEndYmd,
                stbleEndYmd: stbleEndYmd,
                igiYmd: igiYmd
            },
            {
                prjctId: prjctId,
            }
        ];
        try {
            const response = await ApiRequest("/boot/common/commonUpdate", param);

            if(response > 0) {
                alert('성공적으로 수정되었습니다.');
                BaseInfoData();
                setReadOnly(true);
            }
        } catch (error) {
            console.error('Error fetching data', error);
        }
    }

    const onClick = () => {
        
        const isconfirm = window.confirm("프로젝트 등록을 하시겠습니까?");
        if(isconfirm){
            insertProject();
        }

    }

    const insertProject = async () => {
        const param = [
            { tbNm: "PRJCT" },
            {
                ...data,
                beffatPbancDdlnYmd: beffatPbancDdlnYmd,
                expectOrderYmd: expectOrderYmd,
                propseDdlnYmd: propseDdlnYmd,
                propsePrsntnYmd: propsePrsntnYmd,
                ctrtYmd: ctrtYmd,
                bizEndYmd: bizEndYmd,
                stbleEndYmd: stbleEndYmd,
                igiYmd: igiYmd
            }
        ];
        try {
            const response = await ApiRequest("/boot/common/commonInsert", param);

            if(response > 0) {
                onHide();
            }

        } catch (error) {
            console.error('Error fetching data', error);
        }
    }

    const setPrjctCalendar = () => {
        const result = [];
            if(data.prjctStleCd) {
                if(data.prjctStleCd === "VTW01801") {
                    result.push(
                        <div className="project-regist-content">
                            <div className="dx-fieldset">
                                <CustomLabelValue props={labelValue.beffatPbancDdlnYmd} onSelect={handleChgDate} value={beffatPbancDdlnYmd} readOnly={readOnly}/>
                                <CustomLabelValue props={labelValue.expectOrderYmd} onSelect={handleChgDate} value={expectOrderYmd} readOnly={readOnly}/>
                                <CustomLabelValue props={labelValue.propseDdlnYmd} onSelect={handleChgDate} value={propseDdlnYmd} readOnly={readOnly}/>
                                <CustomLabelValue props={labelValue.propsePrsntnYmd} onSelect={handleChgDate} value={propsePrsntnYmd} readOnly={readOnly}/>
                            </div>
                            <div className="dx-fieldset">
                              <CustomLabelValue props={labelValue.stbleEndYmd} onSelect={handleChgDate} value={stbleEndYmd} readOnly={readOnly}/>
                            </div>  
                        </div>
                    )
                } else if(data.prjctStleCd === "VTW01802") {
                    result.push(
                        <div className="project-regist-content">
                            <div className="dx-fieldset">
                                <CustomLabelValue props={labelValue.beffatPbancDdlnYmd} onSelect={handleChgDate} value={beffatPbancDdlnYmd} readOnly={readOnly}/>
                                <CustomLabelValue props={labelValue.expectOrderYmd} onSelect={handleChgDate} value={expectOrderYmd} readOnly={readOnly}/>
                                <CustomLabelValue props={labelValue.propseDdlnYmd} onSelect={handleChgDate} value={propseDdlnYmd} readOnly={readOnly}/>
                                <CustomLabelValue props={labelValue.propsePrsntnYmd} onSelect={handleChgDate} value={propsePrsntnYmd} readOnly={readOnly}/>
                            </div>
                            <div className="dx-fieldset">
                                <CustomLabelValue props={labelValue.ctrtYmd} onSelect={handleChgDate} value={ctrtYmd} readOnly={readOnly}/>
                                <CustomLabelValue props={labelValue.bizEndYmd} onSelect={handleChgDate} value={bizEndYmd} readOnly={readOnly}/>
                                <CustomLabelValue props={labelValue.stbleEndYmd} onSelect={handleChgDate} value={stbleEndYmd} readOnly={readOnly}/>
                                <CustomLabelValue props={labelValue.igiYmd} onSelect={handleChgDate} value={igiYmd} readOnly={readOnly}/>
                            </div>  
                        </div>
                    )
                } else if(data.prjctStleCd === "VTW01803") {
                    result.push(
                        <div className="project-regist-content">
                            <div className="dx-fieldset">
                                <CustomLabelValue props={labelValue.ctrtYmd} onSelect={handleChgDate} value={ctrtYmd} readOnly={readOnly}/>
                                <CustomLabelValue props={labelValue.stbleEndYmd} onSelect={handleChgDate} value={stbleEndYmd} readOnly={readOnly}/>
                                <CustomLabelValue props={labelValue.bizEndYmd} onSelect={handleChgDate} value={bizEndYmd} readOnly={readOnly}/>
                            </div>
                        </div>
                    )
                }
            } else {
                result.push(
                    <div>
                        <p>프로젝트 형태를 선택하지 않아 일정을 작성할 수 없습니다.</p>
                        <p>프로젝트를 선택해주세요.</p>
                    </div>
                )
            }

        return result;
    }

    return (
        <div className="popup-content">
            <div className="project-regist-content">
                <div className="project-regist-content-inner">
                    <h3>* 기본정보</h3>
                    <div className="dx-fieldset">
                        <CustomLabelValue props={labelValue.prjctNm} onSelect={handleChgState} value={data.prjctNm} readOnly={readOnly}/>
                        <div className="dx-field">
                            <div className="dx-field-label asterisk">프로젝트 형태</div>
                            <div className="dx-field-value">
                                <CustomCdComboBox
                                    param="VTW018"
                                    placeholderText="프로젝트 형태"
                                    name="prjctStleCd"
                                    onSelect={handleChgStleCd}
                                    value={data.prjctStleCd}
                                    readOnly={readOnly}
                                />
                            </div>
                        </div>
                        <CustomLabelValue props={labelValue.dept} onSelect={handleChgState} value={data.deptId} readOnly={readOnly} defaultValue={deptId} />
                        <CustomLabelValue props={labelValue.emp} onSelect={handleChgState} value={data.prjctMngrEmpId} readOnly={true} defaultValue={empId}/>
                    </div>
                </div>
                <div className="project-regist-content-inner">
                    <h3>* 예산 </h3>
                    <div className="dx-fieldset">
                        <CustomLabelValue props={labelValue.totBgt} onSelect={handleChgState} value={data.totBgt} readOnly={readOnly}/>
                        <CustomLabelValue props={labelValue.bddprPc} onSelect={handleChgState} value={data.bddprPc} readOnly={readOnly}/>
                        <CustomLabelValue props={labelValue.mmnySlsAm} onSelect={handleChgState} value={data.mmnySlsAm} readOnly={readOnly}/>
                        <div className="dx-field">
                            <div className="dx-field-label">사업수행유형</div>
                            <div className="dx-field-value">
                                <CustomCdComboBox
                                    param="VTW013"
                                    placeholderText="사업수행유형"
                                    name="bizFlfmtTyCd"
                                    onSelect={handleChgState}
                                    value={data.bizFlfmtTyCd}
                                    readOnly={readOnly}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="project-regist-content">
                <div className="project-regist-content-inner">
                    <h3>* 고객정보</h3>
                    <div className="dx-fieldset">
                        <CustomLabelValue props={labelValue.ctmmnyInfo} onSelect={handleChgState} value={data.ctmmnyNo} readOnly={readOnly}/>
                        <CustomLabelValue props={labelValue.picFlnm} onSelect={handleChgState} value={data.picFlnm} readOnly={readOnly}/>
                        <CustomLabelValue props={labelValue.picTelno} onSelect={handleChgState} value={data.picTelno} readOnly={readOnly}/>
                        <CustomLabelValue props={labelValue.picEml} onSelect={handleChgState} value={data.picEml} readOnly={readOnly}/>
                    </div>
                </div>
                <div className="project-regist-content-inner">
                    <h3>* 프로젝트 일정</h3>
                    <div className="project-regist-content">
                        {setPrjctCalendar()}
                    </div>
                </div>
            </div>
            {readOnly ? <Button text="수정" onClick={onClickUdt}/>:
                onHide ? 
                <div>
                    <Button text="저장" onClick={onClick}/>
                    <Button text="취소" onClick={onHide} />
                </div>
                :
                <div>
                    <Button text="저장" onClick={onClickChgSave}/>
                    <Button text="취소" onClick={onClickUdtCncl} />
                </div>
            }
        </div>
    );
};

export default ProjectRegist;