import { Button } from 'devextreme-react';
import React, { useEffect, useState, useCallback, } from 'react';
import { useNavigate } from 'react-router-dom';
import vtwPng from "../../assets/img/vtw.png";
import { Link } from 'react-router-dom';
import { Item, Form, GroupItem } from 'devextreme-react/form';
import HtmlEditBox from "components/unit/HtmlEditBox";
import CustomCdComboBox from "components/unit/CustomCdComboBox";

const ElecAtrzNewForm = ({}) => {
    const navigate = useNavigate();

    const positions = ['Y', 'N'];
    const positionEditorOptions = { items: positions, searchEnabled: true, value: '' };

    return (
        <div className="container" style={{ marginTop: "30px" }}>
            <div>
                <h1>신규 양식 작성</h1>
                <p>* <u>양식 구분</u>, <u>결재 유형</u>, <u>보고서 작성여부</u>, <u>보고서 문서양식</u>, <u>보안등급</u>은 저장 후 <strong>수정 및 삭제 할 수 없습니다.</strong></p>
                <p>* 잘못 작성했을 경우 작성한 양식을 사용하지 않음으로 변경 후 신규 작성 하시기 바랍니다.</p>
            </div>

            <div style={{margin:'20px'}} className="buttons" align="right">
                <Button text="Contained" type="default" stylingMode="contained" onClick={(e)=>navigate("/mngrMenu/ElecAtrzFormManage")}>저장</Button>
                <Button text="Contained" type="danger" stylingMode="contained" onClick={(e)=>navigate("/mngrMenu/ElecAtrzFormManage")}>결재선 설정</Button>
                <Button text="Contained" type="normal" stylingMode="contained" onClick={(e)=>navigate("/mngrMenu/ElecAtrzFormManage")}>목록</Button>
            </div>


            <Form labelLocation="left" id="form"  >
                <GroupItem colCount={2} caption="신규 양식">
                   
                        <Item dataField="문서 사용 여부" 
                              editorType="dxSelectBox" 
                              label={{ text: "문서 사용 여부" }}
                              editorOptions ={positionEditorOptions} />

                        <Item dataField="화면 표시 여부" 
                              editorType="dxSelectBox" 
                              label={{ text: "화면 표시 여부" }}
                              editorOptions ={positionEditorOptions} />
   
                        <Item dataField="양식 구분" 
                              editorType="dxSelectBox" 
                              label={{ text: "양식 구분" }} 
                        >
                            <CustomCdComboBox
                                param="VTW034"
                                placeholderText="[양식구분]"
                                name=""
                                onSelect={""}
                                value={""}
                            />
                        </Item>

                        <Item dataField="결재유형" 
                              editorType="dxSelectBox" 
                              label={{ text: "결재유형" }} >
                            <CustomCdComboBox
                                param="VTW049"
                                placeholderText="[결재유형]"
                                name=""
                                onSelect={""}
                                value={""}
                            />
                        </Item>

                        <Item dataField="보고서 작성여부" 
                              editorType="dxSelectBox" 
                              label={{ text: "보고서 작성여부" }}
                              editorOptions ={positionEditorOptions} />

                </GroupItem>
            </Form>

            <Form labelLocation="left" id="form2" >
                <Item dataField="양식 제목" 
                    label={{ text: "양식 제목" }} />
            </Form>
            <h5 style={{marginTop:'20px'}}>작성 가이드</h5>
            <hr></hr>
            <HtmlEditBox
                column={""}
                data={""}
                setData={""}
                value={""}
                placeholder={""}
            />
            <h5 style={{marginTop:'20px'}}>내용</h5>
            <hr></hr>
            <HtmlEditBox
                column={""}
                data={""}
                setData={""}
                value={""}
                placeholder={""}
            />
        </div>


    )
}

export default ElecAtrzNewForm;