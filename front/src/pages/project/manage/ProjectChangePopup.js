import React, {useEffect, useState} from 'react';
import { useNavigate } from "react-router-dom";

import ApiRequest from 'utils/ApiRequest';
import CustomLabelValue from '../../../components/unit/CustomLabelValue';
import CustomCdComboBox from '../../../components/unit/CustomCdComboBox';
import NumberBox from 'devextreme-react/number-box';
import Button from "devextreme-react/button";

const ProjectChangePopup = ({selectedItem, period, popupInfo, prjctId, bgtMngOdr, ctrtYmd, bizEndYmd}) => {
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState([]); //월별 값 입력을 위한 상태
    const [data, setData] = useState([]);
    const [param, setParam] = useState([]);
    const [contents, setContents] = useState([]);
    
    const [structuredData, setStructuredData] = useState({});
    // console.log("popupInfo",popupInfo);
    //기간 데이터를 받아와서 년도별로 월을 나누어서 배열로 만들어주는 함수
    useEffect(() => {
        const periodData = period.reduce((acc, period) => {
          const [year, month] = period.split('년 ').map((el) => el.trim());
          if (!acc[year]) {
            acc[year] = [];
          }
          acc[year].push(month.replace('월', ''));
          return acc;
        }, {});
        setStructuredData(periodData);
      }, [period]); 
    

    //부모창에서 받아온 데이터를 상태에 담아주는 useEffect
    useEffect(() => {
        setData(selectedItem);
    }, [selectedItem]);


    //data,param 초기값 지정
    useEffect(() => { 

        setData({
            ...data,
            "prjctId" : prjctId,
            "bgtMngOdr" : bgtMngOdr
        });

        setParam({
            ...param,
            "prjctId" : prjctId,
            "bgtMngOdr" : bgtMngOdr,
            "expensPrmpcSn" : 1, 
        });

    }, []);
    

    //좌측 일반 값 담기
    const handleChgState = ({name, value}) => {

            setData(currentData => ({
                ...currentData,
                [name] : value
            }));
            
            setParam(currentParam => ({
                ...currentParam,
                [name] : value
            }));
    };  


    //우측 월 값 담기
    const handleInputChange = (e) => {
        const id = e.element.id;
        const value = e.component.option('value');
        const index = inputValue.findIndex(item => item.id === id); // 입력 값 객체의 인덱스 찾기
        const updatedValues = [...inputValue]; // 상태 변경을 위한 배열 복사

        if (index >= 0) {
            // 기존 값 업데이트
            updatedValues[index] = { ...updatedValues[index], value };
        } else {
            // 새로운 값 객체 추가
            updatedValues.push({ id, value });
        }

        setInputValue(updatedValues); // 업데이트된 배열로 상태 설정
        
        // updatedValues를 map함수를 사용하여 각각의 value값에 있는 숫자 sum하기
        const sum = updatedValues.map(item => item.value).reduce((acc, cur) => acc + cur, 0);

        //총합에 sum값을 넣어주기
        setData(currentData=>({
            ...currentData,
            "total" : sum
        }));
    };

    //inputValue값이 변경될 때마다 param에 담아주기
    // useEffect(() => {
    //     setParam(currentParam => ({...currentParam, "months" : inputValue}));
    // }, [inputValue]);


    //param값이 변경될 때마다 콘솔에 찍어주기
    useEffect(() => {
        console.log("Updated param", param);
    }, [param]); 


    //취소버튼 클릭시
    const handleCancel = (e) => {
        navigate("../project/ProjectChange",
            {
        state: { prjctId: prjctId, bgtMngOdr: bgtMngOdr, ctrtYmd: ctrtYmd, bizEndYmd: bizEndYmd},
        })
    };

    //저장버튼 클릭시
    const handleSave = async () => {
        delete param.total;

        console.log("popupInfo.table",popupInfo.table);
        console.log("param",param);

        const paramInfo = [ 
            { tbNm: popupInfo.table },        
                param , 
        ]; 

        try {
            const response = await ApiRequest("/boot/common/commonInsert", paramInfo);
                if(response > 0) {
                    alert('데이터가 성공적으로 저장되었습니다.');
                    handleCancel();
                }    
        } catch (error) {
            console.error('Error ProjectChangePopup insert', error);
        }
    };  

    //좌측 데이터 분기
    useEffect(() => {
      if(data != null){
        if(popupInfo.menuName==="ProjectGeneralBudgetCostJson" || popupInfo.menuName==="ProjectControlBudgetCostJson"){
            setContents(
                <div className="dx-fieldset">
                    <div className="dx-field">
                        <div className="dx-field-label asterisk">비용코드</div>
                        <div className="dx-field-value">
                            <CustomCdComboBox
                                param="VTW045"
                                placeholderText="비용코드"
                                name="expensCd"
                                onSelect={handleChgState}
                                value={data.expensCd}
                            />
                        </div>
                    </div>
                    <CustomLabelValue props={popupInfo.labelValue.dtlDtls} value={data.dtlDtls} onSelect={handleChgState}/>
                    <CustomLabelValue props={popupInfo.labelValue.total} value={data.total} onSelect={handleChgState}/>
                </div>
            );
        }else if(popupInfo.menuName==="ProjectOutordCompanyCostJson"){
            setContents(
                <div className="dx-fieldset"> 
                <CustomLabelValue props={popupInfo.labelValue.outordEntrpsId} value={selectedItem != null ? selectedItem.outordEntrpsId : null} onSelect={handleChgState}/>
                    <div className="dx-field">
                        <div className="dx-field-label asterisk">역할</div>
                        <div className="dx-field-value">
                            <CustomCdComboBox
                                param="VTW006"
                                placeholderText="역할코드"
                                name="temp"
                                onSelect={handleChgState}
                                value={selectedItem != null ? selectedItem.expensCd : null}
                            />
                        </div>
                    </div>
                    <div className="dx-field">
                        <div className="dx-field-label asterisk">등급</div>
                        <div className="dx-field-value">
                            <CustomCdComboBox
                                param="VTW005"
                                placeholderText="등급코드"
                                name="temp1"
                                onSelect={handleChgState}
                                value={selectedItem != null ? selectedItem.expensCd : null}
                            />
                        </div>
                    </div>
                    <CustomLabelValue props={popupInfo.labelValue.tkcgJob} value={selectedItem != null ? selectedItem.tkcgJob : null} onSelect={handleChgState}/>
                    <CustomLabelValue props={popupInfo.labelValue.temp2} value={selectedItem != null ? selectedItem.temp2 : null} onSelect={handleChgState}/>
                    <CustomLabelValue props={popupInfo.labelValue.temp3} value={selectedItem != null ? selectedItem.temp3 : null} onSelect={handleChgState}/>
                    <CustomLabelValue props={popupInfo.labelValue.bgtMngOdr} value={selectedItem != null ? selectedItem.bgtMngOdr : null} onSelect={handleChgState}/>
                </div>
            )
        }else if(popupInfo.menuName==="ProjectOutordEmpCostJson"){
            setContents(
                <div className="dx-fieldset">
                    <CustomLabelValue props={popupInfo.labelValue.outordEmpId} value={data.outordEmpId} onSelect={handleChgState}/>
                    <div className="dx-field">    
                        <div className="dx-field-label asterisk">역할</div>
                        <div className="dx-field-value">
                            <CustomCdComboBox
                                param="VTW006"
                                placeholderText="역할"
                                name="hnfRoleCd"
                                onSelect={handleChgState}
                                value={data.hnfRoleCd}
                            />
                        </div>
                    </div>
                    <div className="dx-field">
                        <div className="dx-field-label asterisk">등급</div>
                        <div className="dx-field-value">
                            <CustomCdComboBox
                                param="VTW005"
                                placeholderText="등급"
                                name="hnfGradCd"
                                onSelect={handleChgState}
                                value={data.hnfGradCd}
                            />
                        </div>
                        
                    </div>
                    <CustomLabelValue props={popupInfo.labelValue.tkcgJob} value={data.tkcgJob} onSelect={handleChgState}/>
                    <CustomLabelValue props={popupInfo.labelValue.untpc} value={data.untpc} onSelect={handleChgState}/>
                    <CustomLabelValue props={popupInfo.labelValue.gramt} value={data.gramt} onSelect={handleChgState}/>
                    <CustomLabelValue props={popupInfo.labelValue.total} value={data.total} onSelect={handleChgState}/>
                    <CustomLabelValue props={popupInfo.labelValue.inptPrnmntYmd} value={data.inptPrnmntYmd} onSelect={handleChgState}/>
                    <CustomLabelValue props={popupInfo.labelValue.withdrPrnmntYmd} value={data.withdrPrnmntYmd} onSelect={handleChgState}/>
                </div>
            );
        }else if(popupInfo.menuName==="ProjectEmpCostJson"){
            setContents(
                <div className="dx-fieldset">
                    <CustomLabelValue props={popupInfo.labelValue.empId} value={data.empId} onSelect={handleChgState}/>
                    <div className="dx-field">    
                        <div className="dx-field-label asterisk">역할</div>
                        <div className="dx-field-value">
                            <CustomCdComboBox
                                param="VTW006"
                                placeholderText="역할"
                                name="hnfRoleCd"
                                onSelect={handleChgState}
                                value={data.hnfRoleCd}
                            />
                        </div>
                    </div> 
                    <CustomLabelValue props={popupInfo.labelValue.tkcgJob} value={data.tkcgJob} onSelect={handleChgState}/>
                    <CustomLabelValue props={popupInfo.labelValue.temp2} value={data.temp2} onSelect={handleChgState}/> 
                    <CustomLabelValue props={popupInfo.labelValue.gramt} value={data.gramt} onSelect={handleChgState}/>
                    <CustomLabelValue props={popupInfo.labelValue.total} value={data.total} onSelect={handleChgState}/>
                    <CustomLabelValue props={popupInfo.labelValue.inptPrnmntYmd} value={data.inptPrnmntYmd} onSelect={handleChgState}/>
                    <CustomLabelValue props={popupInfo.labelValue.withdrPrnmntYmd} value={data.withdrPrnmntYmd} onSelect={handleChgState}/>
                </div>
            );
        }else{
            return null;
        }
      }
    }, [popupInfo, data]); 

    return (
        <div className="popup-content">
            <div className="project-regist-content">
                <div className="project-change-content-inner-left">
                    
                    {contents}

                </div>
                <div className="project-change-content-inner-right">
                    <div className="dx-fieldset">
                        <div className="dx-field">
                            <div className="dx-field-value">
                            <table style={{ width: "100%", borderSpacing: "10px"}}>
                                <thead>
                                    <tr >
                                    {Object.keys(structuredData).map((year, index) => (
                                        <>
                                        <th key={year} style={{ width: "50px", textAlign: "center" }}> {year}년 </th>
                                        <th key={index} style={{textAlign:"center"}}> 경비 </th>
                                        </>
                                    ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.from({ length: Math.max(...Object.values(structuredData).map(months => months.length)) }).map((_, rowIndex) => (
                                    <tr key={rowIndex}>
                                        {Object.values(structuredData).map((months, colIndex) => (
                                        <>
                                        <td key={colIndex} style={{width:"10px", padding:"5px", textAlign: "center"}}>{months[rowIndex] ? `${months[rowIndex]}월` : ''}</td>
                                        <td key={months} style={{width:"50px", padding:"5px"}}>
                                            {months[rowIndex] ? 
                                            (<NumberBox 
                                            key={months[rowIndex]}
                                            id={`${Object.keys(structuredData)[colIndex]}-${rowIndex+1}`} 
                                            format="#.### 원"
                                            value={inputValue.find(item => item.id === `${Object.keys(structuredData)[colIndex]}-${rowIndex+1}`)?.value || ''}
                                            onValueChanged={handleInputChange}
                                            style={{ textAlign: 'right' }}/>   
                                            ): ''}</td>
                                        </>
                                        ))}
                                    </tr>
                                    ))}
                                </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="button-container">
                <Button text="저장" type="default" stylingMode="contained" onClick={handleSave}/>
                <Button text="취소" onClick={handleCancel}/>
            </div>
        </div>
    );
};

export default ProjectChangePopup;