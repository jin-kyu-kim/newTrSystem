import React, { useEffect, useState, useCallback, } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { Button } from "devextreme-react/button";

import CustomComboBox from "../../components/unit/CustomComboBox";
import ApiRequest from "utils/ApiRequest";

import Form, {
    Item, GroupItem, Label, FormTypes, SimpleItem
  } from 'devextreme-react/form';



const ElecAtrzForm = () => {
    const navigate = useNavigate();
    const location = useLocation(); 

    const [prjctId , setPrjctId] = useState("")
    const [formList, setFormList] = useState([])

    useEffect(() => {
        setPrjctId(location.state ? location.state.prjctId : "");

        retrieveForm();
        console.log(formList)

    }, []);

    useEffect(() => {
        // renderForm();
    }, [formList])

    const retrieveForm = async () => {

        const param = [
            { tbNm: "ELCTRN_ATRZ_DOC_FORM" },
            { useYn: "Y" }
        ]
        try {
            const response = await ApiRequest("/boot/common/commonSelect", param);
            setFormList(response);
        } catch (error) {
            console.error(error)
        }
    }


    const prjctList = {
        tbNm: "PRJCT",
        valueExpr: "prjctId",
        displayExpr: "prjctNm",
        name: "prjctId",
    }

    const handleChgState = (e) => {
        console.log(e)
        setPrjctId(e.value)

    }

    const validateForm = useCallback((e) => {
        e.component.validate();
    }, []);

    const renderForm = () => {
        console.log(formList)

        const result = [];
        formList.map((item) => {
            console.log("item", item);
        });

        return (
            <div>1</div>
        );

    }

    const onFormClick = async () => {
        console.log("onDocuClick")
        console.log(prjctId)
        navigate("../elecAtrz/ElecAtrzNewReq", {state: {prjctId: prjctId}});
    }

    const onExample = async () => {
        console.log("onExample")
    }


    return (
        <div className="container">
            <hr/>
            <Form
                onContentReady={validateForm}
                formData={formList}
            >
                <Item
                >
                    <div>
                        <h4>1. 프로젝트 / 팀 선택</h4>
                    </div>
                    <div style={{width: "50%"}}>
                        <CustomComboBox props={prjctList} value={prjctId} onSelect={handleChgState} label="프로젝트" required={true} placeholder="프로젝트를 선택해주세요"/>
                    </div>
                    <div>
                        <h4>2. 서식 선택</h4>
                    </div>
                </Item>
                <GroupItem
                    colCount={4}
                    caption="※ 계약"
                >
                    <Item>
                        <div style={{minHeight: "100px"}}>
                            <div 
                                style={{textAlign: "center"
                                        , padding: "20px"
                                        , minHeight:"100px"
                                        , minWidth: "100px"
                                        , width: "100%"
                                        , border: "solid black 1px"
                                        , cursor: "pointer",
                                        hover: {backgroundColor: "red"}}}   
                            >
                                <div style={{textAlign: "left", marginBottom: "20px"}} onClick={onExample}>
                                    미리보기
                                </div>

                                <div onClick={onFormClick} style={{marginBottom: "20px"}}>
                                    계약서 품의 (외주인력-계약직/계약직업체/프리랜서)
                                </div>
                                <div>
                                    <Button text={"미리보기"} onClick={onExample}/>
                                    <Button text={"기안하기"} onClick={onFormClick}/>
                                </div>
                            </div>
                        </div>
                    </Item>
                    <Item>
                        <div>1</div>
                    </Item>
                    <Item>
                        <div>1</div>
                    </Item>
                    <Item>
                        <div>1</div>
                    </Item>
                </GroupItem>
                <GroupItem
                    colCount={4}
                    caption="※ 경비"
                >
                  <Item>
                        <div style={{minHeight: "100px"}}>
                            <div 
                                style={{textAlign: "center"
                                        , padding: "20px"
                                        , minHeight:"100px"
                                        , minWidth: "100px"
                                        , width: "100%"
                                        , border: "solid black 1px"
                                        , cursor: "pointer",
                                        hover: {backgroundColor: "red"}}}   
                            >
                                <div style={{textAlign: "left", marginBottom: "20px"}} onClick={onExample}>
                                    미리보기
                                </div>

                                <div onClick={onFormClick} style={{marginBottom: "20px"}}>
                                    계약서 품의 (외주인력-계약직/계약직업체/프리랜서)
                                </div>
                                <div>
                                    <Button text={"미리보기"} onClick={onExample}/>
                                    <Button text={"기안하기"} onClick={onFormClick}/>
                                </div>
                            </div>
                        </div>
                    </Item>
                    <Item>
                        <div style={{minHeight: "100px"}}>
                            <div 
                                style={{textAlign: "center"
                                        , padding: "20px"
                                        , minHeight:"100px"
                                        , minWidth: "100px"
                                        , width: "100%"
                                        , border: "solid black 1px"
                                        , cursor: "pointer",
                                        hover: {backgroundColor: "red"}}}   
                            >
                                <div style={{textAlign: "left", marginBottom: "20px"}} onClick={onExample}>
                                    미리보기
                                </div>

                                <div onClick={onFormClick} style={{marginBottom: "20px"}}>
                                    계약서 품의 (외주인력-계약직/계약직업체/프리랜서)
                                </div>
                                <div>
                                    <Button text={"미리보기"} onClick={onExample}/>
                                    <Button text={"기안하기"} onClick={onFormClick}/>
                                </div>
                            </div>
                        </div>
                    </Item>
                    <Item>
                        <div style={{minHeight: "100px"}}>
                            <div 
                                style={{textAlign: "center"
                                        , padding: "20px"
                                        , minHeight:"100px"
                                        , minWidth: "100px"
                                        , width: "100%"
                                        , border: "solid black 1px"
                                        , cursor: "pointer",
                                        hover: {backgroundColor: "red"}}}   
                            >
                                <div style={{textAlign: "left", marginBottom: "20px"}} onClick={onExample}>
                                    미리보기
                                </div>

                                <div onClick={onFormClick} style={{marginBottom: "20px"}}>
                                    계약서 품의 (외주인력-계약직/계약직업체/프리랜서)
                                </div>
                                <div>
                                    <Button text={"미리보기"} onClick={onExample}/>
                                    <Button text={"기안하기"} onClick={onFormClick}/>
                                </div>
                            </div>
                        </div>
                    </Item>
                    <Item>
                        <div style={{minHeight: "100px"}}>
                            <div 
                                style={{textAlign: "center"
                                        , padding: "20px"
                                        , minHeight:"100px"
                                        , minWidth: "100px"
                                        , width: "100%"
                                        , border: "solid black 1px"
                                        , cursor: "pointer",
                                        hover: {backgroundColor: "red"}}}   
                            >
                                <div style={{textAlign: "left", marginBottom: "20px"}} onClick={onExample}>
                                    미리보기
                                </div>

                                <div onClick={onFormClick} style={{marginBottom: "20px"}}>
                                    계약서 품의 (외주인력-계약직/계약직업체/프리랜서)
                                </div>
                                <div>
                                    <Button text={"미리보기"} onClick={onExample}/>
                                    <Button text={"기안하기"} onClick={onFormClick}/>
                                </div>
                            </div>
                        </div>
                    </Item>
                    <Item>
                        <div style={{minHeight: "100px"}}>
                            <div 
                                style={{textAlign: "center"
                                        , padding: "20px"
                                        , minHeight:"100px"
                                        , minWidth: "100px"
                                        , width: "100%"
                                        , border: "solid black 1px"
                                        , cursor: "pointer",
                                        hover: {backgroundColor: "red"}}}   
                            >
                                <div style={{textAlign: "left", marginBottom: "20px"}} onClick={onExample}>
                                    미리보기
                                </div>

                                <div onClick={onFormClick} style={{marginBottom: "20px"}}>
                                    계약서 품의 (외주인력-계약직/계약직업체/프리랜서)
                                </div>
                                <div>
                                    <Button text={"미리보기"} onClick={onExample}/>
                                    <Button text={"기안하기"} onClick={onFormClick}/>
                                </div>
                            </div>
                        </div>
                    </Item>
                </GroupItem>
                <GroupItem
                    colCount={4}
                    caption="※ 지급"
                >
                    <Item>
                        {renderForm}
                    </Item>
                    <SimpleItem 
                        dataField="gnrlAtrzTtl"
                    />
                </GroupItem>
            </Form>
        </div>
    );
}

export default ElecAtrzForm;