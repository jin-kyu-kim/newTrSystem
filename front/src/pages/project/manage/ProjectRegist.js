import { useMemo, useEffect, useState } from "react";
import CustomCdComboBox from "../../../components/unit/CustomCdComboBox";
import uuid from 'react-uuid'
import ApiRequest from "../../../utils/ApiRequest";

import ProjectRegistJson from "./ProjectRegistJson.json"
import CustomLabelValue from "../../../components/unit/CustomLabelValue"
import Button from "devextreme-react/button";

import { useCookies } from "react-cookie";

const ProjectRegist = ({prjctId, onHide, revise}) => {
    const {labelValue} = ProjectRegistJson;

    const [readOnly, setReadOnly] = useState(revise);

    const [data, setData] = useState([]);
    const [stleCd, setStleCd] = useState();
    const [cookies, setCookie] = useCookies(["userInfo", "userAuth"]);
    
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
    }, []);

    useEffect(() => {

        if(data.prjctId != null) {
            setData({
                ...data,
                prjctStleCd : stleCd,
                beffatPbancDdlnYmd : null,
                expectOrderYmd: null,
                propseDdlnYmd: null,
                propsePrsntnYmd: null,
                ctrtYmd: null,
                bizEndYmd: null,
                stbleEndYmd: null,
                igiYmd: null,
            })
        }

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

            setData({
                ...data,
                prjctStleCd : stleCd,
                [name] : value
            });
        }
    }

    const handleChgStleCd = ({value}) => {

        if(!readOnly) {
            setStleCd(value);
        }
    };

    const readOnlyChg = () => {

        if(readOnly) {
            setReadOnly(false);

        } else {
            setReadOnly(true);
        }
    }

    const onPopup = () => {
        
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
            data
        ];
        try {
            const response = await ApiRequest("/boot/common/commonInsert", param);
            console.log(response);

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
                                <CustomLabelValue props={labelValue.beffatPbancDdlnYmd} onSelect={handleChgDate} value={data.beffatPbancDdlnYmd} readOnly={readOnly}/>
                                <CustomLabelValue props={labelValue.expectOrderYmd} onSelect={handleChgDate} value={data.expectOrderYmd} readOnly={readOnly}/>
                                <CustomLabelValue props={labelValue.propseDdlnYmd} onSelect={handleChgDate} value={data.propseDdlnYmd} readOnly={readOnly}/>
                                <CustomLabelValue props={labelValue.propsePrsntnYmd} onSelect={handleChgDate} value={data.propsePrsntnYmd} readOnly={readOnly}/>
                            </div>
                            <div className="dx-fieldset">
                              <CustomLabelValue props={labelValue.stbleEndYmd} onSelect={handleChgDate} value={data.stbleEndYmd} readOnly={readOnly}/>
                            </div>  
                        </div>
                    )
                } else if(data.prjctStleCd === "VTW01802") {
                    result.push(
                        <div className="project-regist-content">
                            <div className="dx-fieldset">
                                <CustomLabelValue props={labelValue.beffatPbancDdlnYmd} onSelect={handleChgDate} value={data.beffatPbancDdlnYmd} readOnly={readOnly}/>
                                <CustomLabelValue props={labelValue.expectOrderYmd} onSelect={handleChgDate} value={data.expectOrderYmd} readOnly={readOnly}/>
                                <CustomLabelValue props={labelValue.propseDdlnYmd} onSelect={handleChgDate} value={data.propseDdlnYmd} readOnly={readOnly}/>
                                <CustomLabelValue props={labelValue.propsePrsntnYmd} onSelect={handleChgDate} value={data.propsePrsntnYmd} readOnly={readOnly}/>
                            </div>
                            <div className="dx-fieldset">
                                <CustomLabelValue props={labelValue.ctrtYmd} onSelect={handleChgDate} value={data.ctrtYmd} readOnly={readOnly}/>
                                <CustomLabelValue props={labelValue.bizEndYmd} onSelect={handleChgDate} value={data.bizEndYmd} readOnly={readOnly}/>
                                <CustomLabelValue props={labelValue.stbleEndYmd} onSelect={handleChgDate} value={data.stbleEndYmd} readOnly={readOnly}/>
                                <CustomLabelValue props={labelValue.igiYmd} onSelect={handleChgDate} value={data.igiYmd} readOnly={readOnly}/>
                            </div>  
                        </div>
                    )
                } else if(data.prjctStleCd === "VTW01803") {
                    result.push(
                        <div className="project-regist-content">
                            <div className="dx-fieldset">
                                <CustomLabelValue props={labelValue.ctrtYmd} onSelect={handleChgDate} value={data.ctrtYmd} readOnly={readOnly}/>
                                <CustomLabelValue props={labelValue.stbleEndYmd} onSelect={handleChgDate} value={data.stbleEndYmd} readOnly={readOnly}/>
                                <CustomLabelValue props={labelValue.bizEndYmd} onSelect={handleChgDate} value={data.bizEndYmd} readOnly={readOnly}/>
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
            {readOnly ? <><Button text="수정" onClick={readOnlyChg}/> <Button text="팝업" onClick={onPopup}/></>:
                onHide ? 
                <div>
                    <Button text="저장" onClick={onClick}/>
                    <Button onClick={onHide} text="취소"/>
                </div>
                :
                <div>
                    <Button text="저장"/>
                    <Button onClick={readOnlyChg} text="취소"/>
                </div>
            }
        </div>
    );
};

export default ProjectRegist;