import { Button } from 'devextreme-react';
import React, { useEffect, useState, useCallback, } from 'react';
import { useNavigate } from 'react-router-dom';
import vtwPng from "../../assets/img/vtw.png";
import { Link } from 'react-router-dom';
import Box, { Item, Form, GroupItem } from 'devextreme-react/form';
import HtmlEditBox from "components/unit/HtmlEditBox";

const ElecAtrzNewForm = ({}) => {
    const navigate = useNavigate();
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
                            //   editorOptions={{ width: 200 }} 
                              label={{ text: "문서 사용 여부" }} />

                        <Item dataField="화면 표시 여부" 
                              editorType="dxSelectBox" 
                            //   editorOptions={{ width: 200 }} 
                              label={{ text: "화면 표시 여부" }} />
   
                        <Item dataField="양식 구분" 
                              editorType="dxSelectBox" 
                            //   editorOptions={{ width: 200 }} 
                              label={{ text: "양식 구분" }} />

                        <Item dataField="결재유형" 
                              editorType="dxSelectBox" 
                            //   editorOptions={{ width: 200 }} 
                              label={{ text: "결재유형" }} />

                        <Item dataField="보고서 작성여부" 
                              editorType="dxSelectBox" 
                            //   editorOptions={{ width: 200 }} 
                              label={{ text: "보고서 작성여부" }} />

                        <Item dataField="보고서 문서 양식" 
                              editorType="dxSelectBox" 
                            //   editorOptions={{ width: 200 }} 
                              label={{ text: "보고서 문서 양식" }} />

                        <Item dataField="보안등급" 
                              editorType="dxSelectBox" 
                            //   editorOptions={{ width: 500 }} 
                              label={{ text: "보안등급" }} />
                </GroupItem>
            </Form>

            <Box direction="col" width="100%" >
                <Item ratio={1}>
                    <p><strong> * 1급 </strong>: 문서 내용이 암호화 되기 때문에 데이터 베이스가 유출 되더라도 개인키가 없이 문서를 읽을 수 없습니다.(추후 추가예정)</p>
                    <p> 개인키 생성은 정보조회 개인정보에서 가능합니다. (추후 추가예정)</p>
                    <p><strong> * 2급 </strong>: 결재선에 등록된 인원만 확인 가능.</p>
                    <p><strong> * 3급 </strong>: 2급 문서 확인 가능 인원 + 관리자</p>
                    <p><strong> * 4급 </strong>: 3급 문서 확인 가능 인원 + 결재시 입력했던 프로젝트 PM 까지 확인 가능.</p>
                    <p><strong> * 5급 </strong>: 4급 문서 확인 가능 인원 + 결재시 입력했던 프로젝트 맴버까지 확인가능.</p>
                    <p><strong> * 6급 </strong>: 결재문서 번호를 알고 있는 모든 인원들이 확인 가능.</p>
                </Item>     
            </Box>
            <Form labelLocation="left" id="form2" >
                <Item dataField="양식 제목" 
                    editorType="dxSelectBox" 
                //   editorOptions={{ width: 200 }} 
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