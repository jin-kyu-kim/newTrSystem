import React, { useEffect, useState, useCallback, } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { Button } from "devextreme-react/button";

import CustomComboBox from "../../components/unit/CustomComboBox";
import ApiRequest from "utils/ApiRequest";
import ElectAtrzRenderForm from "./ElectAtrzRenderForm";

import Form, {
    Item, GroupItem, Label, FormTypes, SimpleItem
  } from 'devextreme-react/form';



const ElecAtrzForm = () => {
    const navigate = useNavigate();
    const location = useLocation(); 

    const [prjctId , setPrjctId] = useState("")
    const [formList, setFormList] = useState([])
    const [prjctList, setPrjctList] = useState([])

    useEffect(() => {
        setPrjctId(location.state ? location.state.prjctId : "");

        retrieveForm();
        retrievePrjctList();
        console.log(formList)

    }, []);

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

    const retrievePrjctList = async () => {

        const param = [
            { tbNm: "PRJCT" },
            {}
        ]
        try {
            const response = await ApiRequest("/boot/common/commonSelect", param);
            setPrjctList(response);
        } catch (error) {
            console.error(error)
        }
    }

    const handleChgState = (e) => {
        console.log(e)
        setPrjctId(e.value)

    }

    const validateForm = useCallback((e) => {
        e.component.validate();
    }, []);

    const onFormClick = async (data) => {
        if(prjctId === "") {
            alert("프로젝트를 먼저 선택해주세요.");
            return;
        }
        navigate("../elecAtrz/ElecAtrzNewReq", {state: {prjctId: prjctId, formData: data, atrzFormDocSn: data.atrzFormDocSn ,title: data.gnrlAtrzTtl}});
    }

    const onExample = async (data) => {
        console.log(data)
    }

    const validationRules = {
        prjct: [{ type: 'required', message: '프로젝트는 필수로 선택해야합니다.' }],
    };

    return (

        <div className="container">
                              <div>
                    <h4>1. 프로젝트 / 팀 선택</h4>
                    </div>
            <Form
                onContentReady={validateForm}
            >
                <Item
                    editorType="dxSelectBox"
                    validationRules={validationRules.prjct}
                    editorOptions={{
                        items: prjctList,
                        value: prjctId,
                        displayExpr: "prjctNm",
                        valueExpr: "prjctId",
                        onValueChanged: handleChgState
                    }}
                >
                </Item>
            </Form>

            
            {/* <div>
                <h4>1. 프로젝트 / 팀 선택</h4>
            </div>
            <div style={{width: "50%"}}>
                <CustomComboBox props={prjctList} value={prjctId} onSelect={handleChgState} label="프로젝트" required={true} placeholder="프로젝트를 선택해주세요"/>
            </div> */}
            <div>
                <h4>2. 서식 선택</h4>
            </div>
                <ElectAtrzRenderForm formList={formList} onExample={onExample} onFormClick={onFormClick}/>
        </div>

        //     {/* <hr/>
        //     <Form
        //     >
        //         <Item
        //         >
        //             <div>
        //                 <h4>1. 프로젝트 / 팀 선택</h4>
        //             </div>
        //             <div style={{width: "50%"}}>
        //                 <CustomComboBox props={prjctList} value={prjctId} onSelect={handleChgState} label="프로젝트" required={true} placeholder="프로젝트를 선택해주세요"/>
        //             </div>
        //             <div>
        //                 <h4>2. 서식 선택</h4>
        //             </div>
        //         </Item>
        //     </Form>
        //     <Form
        //     >
        //         <GroupItem
        //             colCount={4}
        //             caption="※ 계약"
        //         >
        //             <Item>
        //                 <div style={{minHeight: "100px"}}>
        //                     <div 
        //                         style={{textAlign: "center"
        //                                 , padding: "20px"
        //                                 , minHeight:"100px"
        //                                 , minWidth: "100px"
        //                                 , width: "100%"
        //                                 , border: "solid black 1px"
        //                                 , cursor: "pointer",
        //                                 hover: {backgroundColor: "red"}}}   
        //                     >
        //                         <div style={{textAlign: "left", marginBottom: "20px"}} onClick={onExample}>
        //                             미리보기
        //                         </div>

        //                         <div onClick={onFormClick} style={{marginBottom: "20px"}}>
        //                             계약서 품의 (외주인력-계약직/계약직업체/프리랜서)
        //                         </div>
        //                         <div>
        //                             <Button text={"미리보기"} onClick={onExample}/>
        //                             <Button text={"기안하기"} onClick={onFormClick}/>
        //                         </div>
        //                     </div>
        //                 </div>
        //             </Item>
        //             <Item>
        //                 <div>1</div>
        //             </Item>
        //             <Item>
        //                 <div>1</div>
        //             </Item>
        //             <Item>
        //                 <div>1</div>
        //             </Item>
        //         </GroupItem>
        //         <GroupItem
        //             colCount={4}
        //             caption="※ 경비"
        //         >
        //           <Item>
        //                 <div style={{minHeight: "100px"}}>
        //                     <div 
        //                         style={{textAlign: "center"
        //                                 , padding: "20px"
        //                                 , minHeight:"100px"
        //                                 , minWidth: "100px"
        //                                 , width: "100%"
        //                                 , border: "solid black 1px"
        //                                 , cursor: "pointer",
        //                                 hover: {backgroundColor: "red"}}}   
        //                     >
        //                         <div style={{textAlign: "left", marginBottom: "20px"}} onClick={onExample}>
        //                             미리보기
        //                         </div>

        //                         <div onClick={onFormClick} style={{marginBottom: "20px"}}>
        //                             계약서 품의 (외주인력-계약직/계약직업체/프리랜서)
        //                         </div>
        //                         <div>
        //                             <Button text={"미리보기"} onClick={onExample}/>
        //                             <Button text={"기안하기"} onClick={onFormClick}/>
        //                         </div>
        //                     </div>
        //                 </div>
        //             </Item>
        //             <Item>
        //                 <div style={{minHeight: "100px"}}>
        //                     <div 
        //                         style={{textAlign: "center"
        //                                 , padding: "20px"
        //                                 , minHeight:"100px"
        //                                 , minWidth: "100px"
        //                                 , width: "100%"
        //                                 , border: "solid black 1px"
        //                                 , cursor: "pointer",
        //                                 hover: {backgroundColor: "red"}}}   
        //                     >
        //                         <div style={{textAlign: "left", marginBottom: "20px"}} onClick={onExample}>
        //                             미리보기
        //                         </div>

        //                         <div onClick={onFormClick} style={{marginBottom: "20px"}}>
        //                             계약서 품의 (외주인력-계약직/계약직업체/프리랜서)
        //                         </div>
        //                         <div>
        //                             <Button text={"미리보기"} onClick={onExample}/>
        //                             <Button text={"기안하기"} onClick={onFormClick}/>
        //                         </div>
        //                     </div>
        //                 </div>
        //             </Item>
        //             <Item>
        //                 <div style={{minHeight: "100px"}}>
        //                     <div 
        //                         style={{textAlign: "center"
        //                                 , padding: "20px"
        //                                 , minHeight:"100px"
        //                                 , minWidth: "100px"
        //                                 , width: "100%"
        //                                 , border: "solid black 1px"
        //                                 , cursor: "pointer",
        //                                 hover: {backgroundColor: "red"}}}   
        //                     >
        //                         <div style={{textAlign: "left", marginBottom: "20px"}} onClick={onExample}>
        //                             미리보기
        //                         </div>

        //                         <div onClick={onFormClick} style={{marginBottom: "20px"}}>
        //                             계약서 품의 (외주인력-계약직/계약직업체/프리랜서)
        //                         </div>
        //                         <div>
        //                             <Button text={"미리보기"} onClick={onExample}/>
        //                             <Button text={"기안하기"} onClick={onFormClick}/>
        //                         </div>
        //                     </div>
        //                 </div>
        //             </Item>
        //             <Item>
        //                 <div style={{minHeight: "100px"}}>
        //                     <div 
        //                         style={{textAlign: "center"
        //                                 , padding: "20px"
        //                                 , minHeight:"100px"
        //                                 , minWidth: "100px"
        //                                 , width: "100%"
        //                                 , border: "solid black 1px"
        //                                 , cursor: "pointer",
        //                                 hover: {backgroundColor: "red"}}}   
        //                     >
        //                         <div style={{textAlign: "left", marginBottom: "20px"}} onClick={onExample}>
        //                             미리보기
        //                         </div>

        //                         <div onClick={onFormClick} style={{marginBottom: "20px"}}>
        //                             계약서 품의 (외주인력-계약직/계약직업체/프리랜서)
        //                         </div>
        //                         <div>
        //                             <Button text={"미리보기"} onClick={onExample}/>
        //                             <Button text={"기안하기"} onClick={onFormClick}/>
        //                         </div>
        //                     </div>
        //                 </div>
        //             </Item>
        //             <Item>
        //                 <div style={{minHeight: "100px"}}>
        //                     <div 
        //                         style={{textAlign: "center"
        //                                 , padding: "20px"
        //                                 , minHeight:"100px"
        //                                 , minWidth: "100px"
        //                                 , width: "100%"
        //                                 , border: "solid black 1px"
        //                                 , cursor: "pointer",
        //                                 hover: {backgroundColor: "red"}}}   
        //                     >
        //                         <div style={{textAlign: "left", marginBottom: "20px"}} onClick={onExample}>
        //                             미리보기
        //                         </div>

        //                         <div onClick={onFormClick} style={{marginBottom: "20px"}}>
        //                             계약서 품의 (외주인력-계약직/계약직업체/프리랜서)
        //                         </div>
        //                         <div>
        //                             <Button text={"미리보기"} onClick={onExample}/>
        //                             <Button text={"기안하기"} onClick={onFormClick}/>
        //                         </div>
        //                     </div>
        //                 </div>
        //             </Item>
        //         </GroupItem>
        //         <GroupItem
        //         colCount={2}
        //             caption="※ 지급"
        //         >
        //             <Item>
                        
        //             </Item>
        //         </GroupItem>
        //     </Form>
        //         <ElectAtrzRenderForm props={formList}/>
        // </div> */}
    );
}

export default ElecAtrzForm;