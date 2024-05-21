import React, { useEffect, useState, useCallback, } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Form, { Item } from 'devextreme-react/form';
import { Button } from "devextreme-react/button";
import ElectAtrzRenderForm from "./ElectAtrzRenderForm";
import ApiRequest from "utils/ApiRequest";
import { useModal } from "../../components/unit/ModalContext";
import AutoCompleteProject from "../../components/unit/AutoCompleteProject";
import CustomComboBox from "components/unit/CustomComboBox";

const ElecAtrzForm = () => {
    const navigate = useNavigate();
    const location = useLocation(); 

    const [prjctId , setPrjctId] = useState("")
    const [formList, setFormList] = useState([])
    const [prjctList, setPrjctList] = useState([])
    const [deptList, setDeptList] = useState([])
    const { handleOpen } = useModal();
    const userInfo = JSON.parse(localStorage.getItem("deptInfo"));
    useEffect(() => {
        setPrjctId(location.state ? location.state.prjctId : "");

        retrieveForm();
        retrievePrjctList();
        setDeptList(userInfo);

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
            const newData = response.map(({ regDt, ...rest }) => rest);
            setFormList(newData);
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
        const param = {
            queryId: "commonMapper.autoCompleteProject"
        }
    
        try {
            const response = await ApiRequest("/boot/common/queryIdSearch", param);
            setPrjctList(response);
        } catch (error) {
            console.error(error)
        }

    }

    const handleChgPrjctState = (e) => {
        setPrjctId(e.value)
    }

    const validateForm = useCallback((e) => {
        e.component.validate();
    }, []);

    const onFormClick = async (data) => {
        if(prjctId === "") {
            handleOpen("프로젝트를 먼저 선택해주세요.");
            return;
        }
        const url = data.docSeCd === 'VTW03405' ? '../elecAtrz/ElecGiveAtrz' : '../elecAtrz/ElecAtrzNewReq';
        navigate(url, {state: {prjctId: prjctId, formData: data}});
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

            <Form
                onContentReady={validateForm}
            >
                <Item>
                    <h4>1. 프로젝트 / 팀 선택</h4>
                </Item>
                <Item
                    editorType="dxSelectBox"
                    validationRules={validationRules.prjct}
                    editorOptions={{
                        items: prjctList,
                        value: prjctId,
                        displayExpr: "prjctTag",
                        valueExpr: "prjctId",
                        searchEnabled: true, // 검색 가능 옵션 추가
                        onValueChanged: handleChgPrjctState
                    }}
                    text="프로젝트 선택"
                >
                </Item>
            </Form>
            <div style={{paddingTop: "26px", paddingBotton:"10px"}}>
                <h4>2. 서식 선택</h4>
            </div>
            <div style={{paddingTop: "26px", paddingBotton:"10px"}}>

                <ElectAtrzRenderForm formList={formList} onFormClick={onFormClick}/>
            </div>
        </div>
    );
}

export default ElecAtrzForm;