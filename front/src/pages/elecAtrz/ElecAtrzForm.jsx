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
        navigate("../elecAtrz/ElecAtrzNewReq", {state: {prjctId: prjctId, formData: data}});
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
            <div>
                <h4>2. 서식 선택</h4>
            </div>
                <ElectAtrzRenderForm formList={formList} onExample={onExample} onFormClick={onFormClick}/>
        </div>
    );
}

export default ElecAtrzForm;