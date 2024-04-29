import { useMemo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import CustomCdComboBox from "../../../components/unit/CustomCdComboBox";
import uuid from 'react-uuid'
import ApiRequest from "../../../utils/ApiRequest";

import ProjectRegistJson from "./ProjectRegistJson.json"
import CustomLabelValue from "../../../components/unit/CustomLabelValue"
import Button from "devextreme-react/button";

import { useCookies } from "react-cookie";
import { set } from "date-fns";
import { TextBox } from "devextreme-react/text-box";

const ProjectRegist = ({prjctId, onHide, revise, bgtMngOdrTobe}) => {
    const labelValue = ProjectRegistJson.labelValue;
    const updateColumns = ProjectRegistJson.updateColumns;
    const navigate = useNavigate();
    const [readOnly, setReadOnly] = useState(revise);

    const [data, setData] = useState([]);
    const [stleCd, setStleCd] = useState();
    const [cookies, setCookie] = useCookies(["userInfo", "userAuth"]);
    const [updateParam, setUpdateParam] = useState([]);
    const [prjctCdIdntfr, setPrjctCdIdntfr] = useState();
    const [ctmmnyId, setCtmmnyId] = useState();

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
        const date = new Date();

            setData({
                ...data,
                prjctStleCd : stleCd,
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

    useEffect(() => {
        createPrjctCdIdntfr(ctmmnyId);
        setData({
            ...data,
            ctmmnyId : ctmmnyId,
        });

    }, [ctmmnyId]);

    useEffect(() => {
        if(prjctId != null) {
            BaseInfoData();
        } else {
            const date = new Date();

            setData({
                ...data,
                prjctId: uuid(),
                prjctMngrEmpId: empId,
                deptId: deptId,
                bizSttsCd: "VTW00401",
                regEmpId: empId,
                regDt: date.toISOString().split('T')[0]+' '+date.toTimeString().split(' ')[0]
            })
        }

        setUpdateParam(updateColumns);
    }, []);

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
            setPrjctCdIdntfr(response[0].prjctCdIdntfr);

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

    /**
     * 프로젝트 수정
     */
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
                igiYmd: igiYmd,
                prjctCdIdntfr: prjctCdIdntfr
            },
            {
                prjctId: prjctId,
            }
        ];
        try {
            const response = await ApiRequest("/boot/common/commonUpdate", param);

            if(response > 0) {
                alert('성공적으로 수정되었습니다.');

                navigate("../project/ProjectChange",
                {
                    state: { prjctId: prjctId, 
                             bgtMngOdrTobe: bgtMngOdrTobe, 
                             ctrtYmd: ctrtYmd.substr(0, 4) + '-' + ctrtYmd.substr(4, 2) + '-' + ctrtYmd.substr(6, 2), 
                             stbleEndYmd: stbleEndYmd.substr(0, 4) + '-' + stbleEndYmd.substr(4, 2) + '-' + stbleEndYmd.substr(6, 2)},
                })
                
            }
        } catch (error) {
            console.error('Error fetching data', error);
        }
    }

    const onClick = (e) => {
        e.preventDefault();

        if(prjctId != null) {
            const isconfirm = window.confirm("수정한 내용을 저장 하시겠습니까?");
            if(isconfirm){
                updateProject();
            }
        } else {
            const isconfirm = window.confirm("프로젝트 등록을 하시겠습니까?");
            if(isconfirm){
                insertProject();
            } else {
                console.log("취소");
                return;
            }
        }
    }

    /**
     * 프로젝트 등록
     */
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
                igiYmd: igiYmd,
                prjctCdIdntfr: prjctCdIdntfr
            }
        ];
        try {
            console.log(param)
            const response = await ApiRequest("/boot/common/commonInsert", param);

            if(response > 0) {

                handlePrjctMngAuth().then((value) => {
                    if(value > 0) {
                        alert('프로젝트가 등록되었습니다.');
                    } else {
                        alert('프로젝트 등록에 실패하였습니다.');
                    }
                })

                onHide();
            }

        } catch (error) {
            console.error('Error fetching data', error);
        }
    }

    /**
     * 프로젝트 권한 테이블 insert
     */
    const handlePrjctMngAuth = async () => {

        const date = new Date();

        const param = [
            { tbNm: "PRJCT_MNG_AUTHRT" },
            { 
                prjctId: data.prjctId,
                empId: data.prjctMngrEmpId,
                prjctMngAuthrtCd: "VTW05202",
                regEmpId: empId,
                regDt: date.toISOString().split('T')[0]+' '+date.toTimeString().split(' ')[0]
            }
        ]

        const response = await ApiRequest("/boot/common/commonInsert", param);
        return response

    }

    /**
     * 고객사 정보변경 프로젝트 코드 생성
     */
    const handleChgCtmmny = ({value}) => {
        // 고객사 정보변경에 따른 프로젝트 코드를 생성
        if(!readOnly) {
            setCtmmnyId(value);
        }
    }

    /**
     * 고객사 정보변경에 따른 프로젝트 코드를 생성
     */
    const createPrjctCdIdntfr = async (value) => {
        if(value === undefined) return;

        const param = {
            queryId: "projectMapper.retrievePrjctCdIdntfr",
            ctmmnyId: value
        }

        try {
            await ApiRequest("/boot/common/queryIdSearch", param).then((response) => {

                setPrjctCdIdntfr(value + response[0].prjctCdSn);
            });
        } catch (error) {
            console.error('Error fetching data', error);
        }
    }

    /**
     * 프로젝트 일정
     */
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
        <form onSubmit={onClick}>
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
                                    required={true}
                                    label="프로젝트 형태"
                                />
                            </div>
                        </div>
                        <CustomLabelValue props={labelValue.dept} onSelect={handleChgState} value={data.deptId} readOnly={readOnly} defaultValue={deptId} />
                        <CustomLabelValue props={labelValue.emp} onSelect={handleChgState} value={data.prjctMngrEmpId} readOnly={true} defaultValue={empId}/>
                        <div className="dx-field">
                            <div className="dx-field-label asterisk">프로젝트 코드</div>
                            <div className="dx-field-value">
                            <TextBox value={prjctCdIdntfr} readOnly={true}/>
                            </div>
                        </div>
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
                        <CustomLabelValue props={labelValue.ctmmnyInfo} onSelect={handleChgCtmmny} value={data.ctmmnyId} readOnly={readOnly}/>
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
                    <Button text="저장" useSubmitBehavior={true}/>
                    <Button text="취소" onClick={onHide} />
                </div>
                :
                <div>
                    <Button text="저장"useSubmitBehavior={true}/>
                    <Button text="취소" onClick={onClickUdtCncl} />
                </div>
            }
        </div>
        </form>
    );
};

export default ProjectRegist;