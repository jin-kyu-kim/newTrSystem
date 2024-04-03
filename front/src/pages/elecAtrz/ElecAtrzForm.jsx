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

    }, []);

    const retrieveForm = async () => {

        const param = [
            { tbNm: "ELCTRN_ATRZ_DOC_FORM" },
            { 
                useYn: "Y",
                eprssYn: "Y"
            }
        ]
        try {
            const response = await ApiRequest("/boot/common/commonSelect", param);
            setFormList(response);
        } catch (error) {
            console.error(error)
        }
    }

    const retrievePrjctList = async () => {

        /**
         * 만료된 프로젝트로 전자결재 상신하여 오류가 발생하는 문제
         * 프로젝트가 만료되면 전자결재 상신이 이뤄지지 않도록
         * => 현재 VTW00402 프로젝트 수행중인 프로젝트만 가져오도록 되어 있음. -> 이정도면 될지 좀 더 고민해보기.
         */
        const param = [
            { tbNm: "PRJCT" },
            { bizSttsCd: "VTW00402"}
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

    const validationRules = {
        prjct: [{ type: 'required', message: '프로젝트는 필수로 선택해야합니다.' }],
    };

    return (

        <div className="container">
            <div className="buttons" align="right" style={{ margin: "20px" }}>
            <Button
                width={110}
                text="Contained"
                type="default"
                stylingMode="contained"
                style={{ margin: "2px" }}
                onClick={() => navigate("/elecAtrz/ElecAtrz")}
            >
                목록
            </Button>
            </div>
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
                <ElectAtrzRenderForm formList={formList} onFormClick={onFormClick}/>
        </div>
    );
}

export default ElecAtrzForm;