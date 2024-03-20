import React, { useEffect, useState, useCallback, } from "react";
import {useNavigate} from "react-router-dom";

import CustomComboBox from "../../components/unit/CustomComboBox";

import Form, {
    Item, GroupItem, Label, FormTypes,
  } from 'devextreme-react/form';

const ElecAtrzNewReq = () => {

    const navigate = useNavigate();

    const [prjctId , setPrjctId] = useState("")
    const prjctList = 
    {
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

        const result = [];

    }

    const onDocuClick = async () => {
        console.log("onDocuClick")
        console.log(prjctId)
    }

    const onExample = async () => {
        console.log("onExample")
    }


    return (
        <div className="container">
            <hr/>
            <Form
                onContentReady={validateForm}
            >
                <Item
                >
                    <div>
                        <h4>1. 프로젝트 / 팀 선택</h4>
                    </div>
                    <div style={{width: "50%"}}>
                        <CustomComboBox props={prjctList} value={prjctId} onSelect={handleChgState} label="프로젝트" required={true} placeholder="프로젝트"/>
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

                                <div onClick={onDocuClick}>
                                    계약서 품의 (외주인력-계약직/계약직업체/프리랜서)
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
                        <div>1</div>
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
                    <Item>
                        <div>1</div>
                    </Item>
                </GroupItem>
                <GroupItem
                    colCount={4}
                    caption="※ 지급"
                >

                </GroupItem>
            </Form>
        </div>
    );

}

export default ElecAtrzNewReq;