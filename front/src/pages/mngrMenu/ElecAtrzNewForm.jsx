import { Button } from 'devextreme-react';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useLocation} from 'react-router-dom';
import { useCookies } from "react-cookie";
import { Item, Form, GroupItem, RequiredRule } from 'devextreme-react/form';
import ApiRequest from "utils/ApiRequest";
import HtmlEditBox from "components/unit/HtmlEditBox";
import CustomCdComboBox from "components/unit/CustomCdComboBox";
import moment from 'moment';
import uuid from "react-uuid";

const positions = ['Y', 'N'];   //사용여부 selectBox에서 사용하는 값
const columns = {"docFormDc": {"dataField":"docFormDc"},"gnrlAtrzCn": {"dataField":"gnrlAtrzCn"}};  //htmlEditBox에서 사용하는 컬럼

//TODO. 밸리데이션 미흡..수정필요
const ElecAtrzNewForm = ({}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const formRef = useRef(null);
    const [cookies] = useCookies(["userInfo", "userAuth"]);
    const empId = cookies.userInfo.empId;
    const date = moment();
    const [formData, setFormData] = useState({
        atrzFormDocId: uuid(),
        regEmpId: empId,
        regDt: date.format('YYYY-MM-DD HH:mm:ss'),
    });
    const mdfStts = location.state? 'U' : 'I'; //수정인지 신규인지 확인

    //TODO. 개발편의 위한 console.log > 삭제예정.
    useEffect(() => {
        console.log("formData", formData);
    }, [formData]);

    //수정시 넘어온 값이 있으면 셋팅
    useEffect(() => {
        if(mdfStts =='U') setFormData(location.state); 
    }, [location]);

    //입력값 변경시 formData에 저장
    const handleChange = useCallback(({ name, value }) => { 
        setFormData(prev => ({
            ...prev, 
            [name]: value 
        }));
    }, []);

    const onClickSave = async(e) => {
        //폼 밸리데이션 체크
        if (formRef.current.instance.validate().isValid) {
            const result = window.confirm("저장하시겠습니까?");
            if(result){

                let param = [];
                let request = "";

                //신규, 수정 구분에 따라 param, request 값 설정
                if(mdfStts =='I'){
                    param = [{tbNm: "ELCTRN_ATRZ_DOC_FORM"},
                                    formData ]
                    request = "/boot/common/commonInsert";
                }else{
                    const modifiedData = {...formData,
                        mdfcnEmpId: empId, 
                        mdfcnDt: date.format('YYYY-MM-DD HH:mm:ss')};
                    delete modifiedData["elctrnAtrzTySeCdNm"];
                    delete modifiedData["docSeCdNm"];
                                            
                    param = [{tbNm: "ELCTRN_ATRZ_DOC_FORM"},
                            modifiedData,
                            {"ATRZ_FORM_DOC_ID" : formData.atrzFormDocId}]
                    request = "/boot/common/commonUpdate";
                }
                
                // 서버와 통신
                try {
                    const response = await ApiRequest(request, param);
                    if(response > 0) {
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
    }   
    
    return (
        <div className="container" style={{ marginTop: "30px" }}>
            <div>
                <h1>{ mdfStts =='U' ? '양식 수정' : '신규 양식 작성'}</h1>
                <p>* <u>양식 구분</u>, <u>결재 유형</u>, <u>보고서 작성여부</u> 는 저장 후 <strong>수정 및 삭제 할 수 없습니다.</strong></p>
                <p>* 잘못 작성했을 경우 작성한 양식을 사용하지 않음으로 변경 후 신규 작성 하시기 바랍니다.</p>
            </div>

            <div style={{margin:'20px'}} className="buttons" align="right">
                <Button text="저장" type="default" stylingMode="contained" onClick={onClickSave}/>
                <Button text="Contained" type="normal" stylingMode="contained" onClick={(e)=>navigate("/mngrMenu/ElecAtrzFormManage")}>목록</Button>
            </div>
            
            <Form  ref={formRef} 
                    labelLocation="left" 
                    id="form"  
                    formData={formData}
                    showValidationSummary={true} 
                    validationGroup="formData" >

                <GroupItem colCount={2} caption="신규 양식">          
                    <Item dataField="useYn" 
                            editorType="dxSelectBox" 
                            label={{ text: "문서 사용 여부" }}
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
                    >
                    <RequiredRule message="문서 사용 여부는 필수 입력입니다." />
                    </Item>

                    <Item dataField="eprssYn" 
                            editorType="dxSelectBox" 
                            label={{ text: "* 화면 표시 여부" }}
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
                            label={{ text: "양식 구분" }}   
                    >
                        <CustomCdComboBox
                            param="VTW034"
                            placeholderText="[양식구분]"
                            name="docSeCd"
                            onSelect={handleChange}
                            value={formData.docSeCd}
                            required={true}
                            label={"양식구분"} 
                            readOnly={mdfStts === 'U' ? true : false}
                        />
                       {/* <RequiredRule message="양식 구분은 필수 입력입니다." /> */}
                    </Item>

                    <Item dataField="elctrnAtrzTySeCd" 
                            editorType="dxSelectBox" 
                            label={{ text: "결재유형" }} >
                        <CustomCdComboBox
                            param="VTW049"
                            placeholderText="[결재유형]"
                            name="elctrnAtrzTySeCd"
                            onSelect={handleChange}
                            value={formData.elctrnAtrzTySeCd}
                            required={true}
                            label={"결재유형"}
                            readOnly={mdfStts === 'U' ? true : false}
                        />
                    </Item>

                    <Item dataField="reprtUseYn" 
                            editorType="dxSelectBox" 
                            label={{ text: "보고서 작성여부" }}
                            readOnly={mdfStts === 'U' ? true : false}
                            editorOptions ={{
                                items: positions,
                                placeholder: "[보고서 작성여부]",
                                readOnly: mdfStts === 'U',
                                onValueChanged: (e) => 
                                    handleChange({
                                        name: "reprtUseYn",
                                        value: e.value
                                    })
                                        }}  
                    >
                    {/* <RequiredRule message="보고서 작성 여부는 필수 입력입니다." /> */}
                    </Item>
                </GroupItem>
            
                <Item dataField="gnrlAtrzTtl" 
                    editorType="dxTextBox" 
                    label={{ text: "양식 제목" }}
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
                {/* <RequiredRule message="양식제목은 필수 입력입니다." /> */}
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
    </div>
    )
}

export default ElecAtrzNewForm;