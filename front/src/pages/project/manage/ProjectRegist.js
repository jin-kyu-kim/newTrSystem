import { useState } from "react";
import { TextBox } from "devextreme-react/text-box"
import { NumberBox } from "devextreme-react";
import CustomDatePicker from "../../../components/unit/CustomDatePicker";
import CustomCdComboBox from "../../../components/unit/CustomCdComboBox";
import AutoCompleteProject from "../../../components/unit/AutoCompleteProject";
import CustomComboBox from "../../../components/unit/CustomComboBox";

import ProjectRegistJson from "./ProjectRegistJson.json"
import CustomLabelValue from "../../../components/unit/CustomLabelValue"

import Button from "devextreme-react/button";

const ProjectRegist = ({props, onClick}) => {
    // console.log(props)

    const {labelValue} = ProjectRegistJson;

    // console.log(labelValue)

    const [param, setParam] = useState([]);

    const handleChgState = ({name, value}) => {
        console.log("adsaqweqwewqe")
        // console.log(e)

        setParam({
            ...param,
            [name] : value
        })
    };

    console.log(param)

    return (
        <div className="popup-content">
            <div className="project-regist-content">
                <div className="project-regist-content-inner">
                    <h3>* 기본정보</h3>
                    <div className="dx-fieldset">
                        <CustomLabelValue props={labelValue.prjctNm}/>
                        <div className="dx-field">
                            <div className="dx-field-label asterisk">프로젝트 형태</div>
                            <div className="dx-field-value">
                                <CustomCdComboBox
                                    param="VTW018"
                                    placeholderText="프로젝트 형태"
                                    name="prjctStleCd"
                                    onSelect={handleChgState}
                                />
                            </div>
                        </div>
                        <CustomLabelValue props={labelValue.dept} onSelect={handleChgState}/>
                        <CustomLabelValue props={labelValue.emp} onSelect={handleChgState}/>
                    </div>
                </div>
                <div className="project-regist-content-inner">
                    <h3>* 예산 </h3>
                    <div className="dx-fieldset">
                        <CustomLabelValue props={labelValue.totBgt}/>
                        <CustomLabelValue props={labelValue.bddprPc}/>
                        <CustomLabelValue props={labelValue.mmnySlsAm}/>
                        <div className="dx-field">
                            <div className="dx-field-label asterisk">사업수행유형</div>
                            <div className="dx-field-value">
                                <CustomCdComboBox
                                    param="VTW018"
                                    placeholder="사업수행유형"
                                    name="prjctStleCd"
                                    onSelect={handleChgState}
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
                        <CustomLabelValue props={labelValue.ctmmnyInfo}/>
                        <CustomLabelValue props={labelValue.picFlnm}/>
                        <CustomLabelValue props={labelValue.picTelno}/>
                        <CustomLabelValue props={labelValue.picEml}/>
                    </div>
                </div>
                <div className="project-regist-content-inner">
                    <h3>* 프로젝트 일정</h3>
                </div>
            </div>
        </div>
    );
};

export default ProjectRegist;