import { Button } from 'devextreme-react';
import React, { useEffect, useState, useMemo, useCallback,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from "react-cookie";
import { Item, Form, GroupItem, RequiredRule } from 'devextreme-react/form';
// import { Validator, RequiredRule } from 'devextreme-react/validator';
import axios from "axios";
import HtmlEditBox from "components/unit/HtmlEditBox";
import CustomCdComboBox from "components/unit/CustomCdComboBox";
import moment from 'moment';


const positions = ['Y', 'N'];
const columns = {"docFormDc": {"dataField":"docFormDc"},"gnrlAtrzCn": {"dataField":"gnrlAtrzCn"}};

//TODO. 밸리데이션 추가하기
const ElecAtrzNewForm = ({}) => {
    const navigate = useNavigate();
    const formRef = useRef();
    const [cookies] = useCookies(["userInfo", "userAuth"]);

    const empId = cookies.userInfo.empId;
    const date = moment();

    const [formData, setFormData] = useState({
        regEmpId: empId,
        regDt: date.format('YYYY-MM-DD HH:mm:ss'),
    });

    useEffect(() => {
        console.log("formData", formData);
    }, [formData]);

    const handleChange = useCallback(({ name, value }) => { 
        setFormData(prev => ({
            ...prev, 
            [name]: value 
        }));
    }, []);

    const onClickSave = async() => {
        const result = window.confirm("저장하시겠습니까?");

        if(result){
            const param = [
                {tbNm: "ELCTRN_ATRZ_DOC_FORM", snColumn: "ATRZ_FORM_DOC_SN"},
                formData
                ]
   
            try {
                const response = await axios.post("/boot/common/commonInsert", param);
                if(response.data > 0) {
                    alert("저장되었습니다.");
                    navigate("/mngrMenu/ElecAtrzFormManage");
                }
            } catch (error) {
                console.log(error);
            }
            
        }else{
            return false;
        }
    }   

    
    return (
        <div className="container" style={{ marginTop: "30px" }}>
            <div>
                <h1>신규 양식 작성</h1>
                <p>* <u>양식 구분</u>, <u>결재 유형</u>, <u>보고서 작성여부</u>, <u>보고서 문서양식</u>, <u>보안등급</u>은 저장 후 <strong>수정 및 삭제 할 수 없습니다.</strong></p>
                <p>* 잘못 작성했을 경우 작성한 양식을 사용하지 않음으로 변경 후 신규 작성 하시기 바랍니다.</p>
            </div>

            
        <React.Fragment>
            <div style={{margin:'20px'}} className="buttons" align="right">
                <Button text="저장" type="default" stylingMode="contained" useSubmitBehavior={false} onClick={(e)=>onClickSave()}/>
                <Button text="Contained" type="normal" stylingMode="contained" onClick={(e)=>navigate("/mngrMenu/ElecAtrzFormManage")}>목록</Button>
            </div>
            <Form  ref={formRef} 
                    labelLocation="left" 
                    id="form"  
                    formData={formData}
                    showValidationSummary={true} 
                    // onSubmit={(e)=>onClickSave()}
                    validationGroup="formData" >

                <GroupItem colCount={2} caption="신규 양식">          
                    <Item dataField="useYn" 
                            editorType="dxSelectBox" 
                            label={{ text: "* 문서 사용 여부" }}
                            isRequired={true}
                            editorOptions ={{
                                items: positions,
                                placeholder: "[문서 사용 여부]",
                                onValueChanged: (e) => 
                                    handleChange({
                                        name: "useYn",
                                        value: e.value
                                    })
                                        }}   
                            validationRules={[{ type: "required", message: "문서 사용 여부는 필수 입력입니다." }]}
                    >
                    <RequiredRule message="문서 사용 여부는 필수 입력입니다." />
                    </Item>

                    <Item dataField="eprssYn" 
                            editorType="dxSelectBox" 
                            label={{ text: "* 화면 표시 여부" }}
                            validationRules={[{ type: "required", message: "화면 표시 여부는 필수 입력입니다." }]}
                            editorOptions ={{
                                items: positions,
                                placeholder: "[화면 표시 여부]",
                                onValueChanged: (e) => 
                                    handleChange({
                                        name: "eprssYn",
                                        value: e.value
                                    })
                                        }}  
                    >
                    <RequiredRule message="화면 표시 여부는 필수 입력입니다." />
                    </Item>

                    <Item dataField="docSeCd" 
                            editorType="dxSelectBox" 
                            label={{ text: "* 양식 구분" }} 
                    >
                        <CustomCdComboBox
                            param="VTW034"
                            placeholderText="[양식구분]"
                            name="docSeCd"
                            onSelect={handleChange}
                            value={formData.docSeCd}
                            required={true}
                            label={"양식구분"}
                        />
                    </Item>

                    <Item dataField="elctrnAtrzTySeCd" 
                            editorType="dxSelectBox" 
                            label={{ text: "* 결재유형" }} >
                        <CustomCdComboBox
                            param="VTW049"
                            placeholderText="[결재유형]"
                            name="elctrnAtrzTySeCd"
                            onSelect={handleChange}
                            value={formData.elctrnAtrzTySeCd}
                            required={true}
                            label={"결재유형"}
                        />
                    </Item>

                    <Item dataField="reprtUseYn" 
                            editorType="dxSelectBox" 
                            label={{ text: "보고서 작성여부" }}
                            editorOptions ={{
                                items: positions,
                                placeholder: "[보고서 작성여부]",
                                onValueChanged: (e) => 
                                    handleChange({
                                        name: "reprtUseYn",
                                        value: e.value
                                    })
                                        }}  
                    />
                </GroupItem>
            </Form>

            <Form labelLocation="left" id="form2" >
                <Item dataField="gnrlAtrzTtl" 
                    editorType="dxTextBox" 
                    label={{ text: "* 양식 제목" }}
                    validationRules={[{ type: "required", message: "양식 제목을 입력해주세요." }]}
                    editorOptions={{
                        mode: "text",
                        placeholder: "[양식 제목]",
                        onValueChanged: (e) =>
                        handleChange({
                            name: "gnrlAtrzTtl",
                            value: e.value
                        })
                    }}
                >
                <RequiredRule message="양식제목은 필수 입력입니다." />
                </Item>
            </Form>

            <h5 style={{marginTop:'20px'}}>작성 가이드</h5>
            <hr></hr>
            <div style={{marginBottom:"30px"}}>
                <HtmlEditBox
                    column={columns.docFormDc}
                    data={formData}
                    setData={setFormData}
                    value={formData.docFormDc}
                    placeholder={"작성 가이드를 입력해주세요."}
                />
                <h5 style={{marginTop:'20px'}}>내용</h5>
                <hr></hr>
                <HtmlEditBox
                    column={columns.gnrlAtrzCn}
                    data={formData}
                    setData={setFormData}
                    value={formData.gnrlAtrzCn}
                    placeholder={"작성 내용을 입력해주세요."}
                />
            </div>
        </React.Fragment>
    </div>
        


    )
}

export default ElecAtrzNewForm;