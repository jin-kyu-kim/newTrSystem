import React, {useEffect, useState} from 'react';
import { useNavigate } from "react-router-dom";

import ApiRequest from 'utils/ApiRequest';
import CustomLabelValue from '../../../components/unit/CustomLabelValue';
import CustomCdComboBox from '../../../components/unit/CustomCdComboBox';
import NumberBox from 'devextreme-react/number-box';
import Button from "devextreme-react/button";
import { TextBox } from 'devextreme-react';

const ProjectChangePopup = ({selectedItem, period, popupInfo, prjctId, bgtMngOdrTobe, ctrtYmd, bizEndYmd, transformedData}) => {
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState(transformedData); //월별 값 입력을 위한 상태
    const [data, setData] = useState([]);
    const [param, setParam] = useState([]);
    const [contents, setContents] = useState([]);   
    const [structuredData, setStructuredData] = useState({});

    useEffect(() => {  
        console.log("data",data);
    }, [data]);

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
        if(selectedItem){
            setData(selectedItem);
        }
    }, [selectedItem]);

    useEffect(() => {
        if(transformedData){
            setInputValue(transformedData);
        }
    }, [transformedData]);


    //data초기값 지정
    useEffect(() => { 
        if(!selectedItem){
            setData({
                ...data,
                "prjctId" : prjctId,
                "bgtMngOdr" : bgtMngOdrTobe
            });
        }
    }, []);
    
    //좌측 일반 값 담기
    const handleChgState = ({name, value}) => {
            setData(currentData => ({
                ...currentData,
                [name] : value
            }));
    };  

    //우측 월 값 담기
    const handleInputChange = (e) => {
        const id  = e.element.id;   //사용월
        const value  = e.component.option('value');
        const index = inputValue.findIndex(item => item.id === id); // 입력 값 객체의 인덱스 찾기
        const updatedValues = JSON.parse(JSON.stringify(inputValue)); // 상태 변경을 위한 배열 복사

        if (index >= 0 ) {   //변경해야하는 데이터
            if(e.event){
                updatedValues[index] = { ...updatedValues[index], value : value !== null ? value : 0 }; // 변경된 값 객체 업데이트
            }

        } else {    //신규 데이터      
                updatedValues.push({ id, value });    // 새로운 값 객체 추가                 
        }

        setInputValue(updatedValues); // 업데이트된 배열로 상태 설정
       

        // updatedValues를 map함수를 사용하여 각각의 value값에 있는 숫자 sum하기
        const sum = updatedValues.filter(item => typeof item.value === 'number')
        .map(item => item.value)
        .reduce((acc, cur) => acc + cur, 0);
        const fixedSum = Number(sum.toFixed(2)); //js의 부동소수 이슈로 인한 자릿수 조정.
        let multifulSum;
        if(data.userDfnValue){
            multifulSum = fixedSum * data.userDfnValue;
        }

        //총합에 sum값을 넣어주기
        setData(currentData=>({
            ...currentData,
            "total" : fixedSum,
            ...(data.userDfnValue ? { "gramt" : multifulSum } : {}),
        })); 
    };


    //취소버튼 클릭시
    const handleCancel = (e) => {
        navigate("../project/ProjectChange",
            {
        state: { prjctId: prjctId, bgtMngOdrTobe: bgtMngOdrTobe, ctrtYmd: ctrtYmd, bizEndYmd: bizEndYmd},
        })
    };

    const getNumber = async() => {
        const paramInfo = {
          queryId: "projectMapper.retrieveChgPrmpcOdr",
          prjctId: prjctId,
          bgtMngOdr: bgtMngOdrTobe,
          [popupInfo.keyColumn] : popupInfo.keyColumn
        };
    
        try {
          const response = await ApiRequest("/boot/common/queryIdSearch", paramInfo);
              if(response.length > 0) {       
                return response[0];
              }    
        } catch (error) {
            console.error('Error ProjectChangePopup insert', error);
        }
      }

    //저장버튼 클릭시
    const handleSave = () => {
        //수정일 경우
        if(data[popupInfo.keyColumn]){
            setParam(currentParam => {
                const newData = {
                    ...data,
                    }; 
                delete newData.total; // total 속성 삭제
                popupInfo.CdComboboxColumnNm.forEach((columnName) => {
                    delete newData[columnName];
                });
                return {
                    ...currentParam,
                    ...newData,
                };
            });

        //신규일 경우
        }else{
            let order= 0;
            const result = getNumber().then((value) => {
                if(value != null){
                    order = value[popupInfo.keyColumn];
                }
                order++
                    
                setParam(currentParam => {
                    const newData = {
                        ...data,
                        [popupInfo.keyColumn] : order,
                        "prjctId" : prjctId,
                        "bgtMngOdr" : bgtMngOdrTobe,
                        }; 
                    const pkColumns = pick(newData, popupInfo.pkColumns);
                    const nomalColumns = pick(newData, popupInfo.nomalColumns);
                    return {
                        ...currentParam,
                        ...pkColumns,
                        ...nomalColumns,
                    };
                });
            });
        }
    };  

    useEffect(() => {

        if(data[popupInfo.keyColumn]){
            //수정일 경우
            const runOrder = async() => {
                if(Object.keys(param).length > 0){
                    await onRowUpdateing(); 
                    await onRowUpdateingMonthData();
                }};
            runOrder();
        }else{
            //신규일 경우
            const runOrder = async() => {
                if(Object.keys(param).length > 0){
                    await onRowInserting(); 
                    await onRowInsertingMonthData();
                }};
            runOrder();
        }
      }, [param]);
    
    const onRowInserting = async() => {
        
        //api param 설정
        const paramInfo = [
            { tbNm: popupInfo.table },
            param,
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
    }

    const onRowInsertingMonthData = async() => {

        const pkColumns = pick(param, popupInfo.pkColumnsDtl);

        const makeParam = inputValue.map(item => ({
            ...pkColumns,
            [popupInfo.nomalColumnsDtlYm] : item.id,
            [popupInfo.nomalColumnsDtlValue] : item.value,
            ...(data.jbpsCd ? { "jbpsCd" : data.jbpsCd } : {}),
        }));

        //api param 설정
        const paramInfo = [
            { tbNm: popupInfo.subTable },
            ...makeParam
        ];

        try {
            const response = await ApiRequest("/boot/common/commonInsert", paramInfo);
                if(response > 0) {
                console.log(response);
                }    
        } catch (error) {
            console.error('Error ProjectChangePopup insert', error);
        }
}


const onRowUpdateing = async() => {
    const paramNor = pick(param, popupInfo.nomalColumns);
    const paramKey = pick(param, popupInfo.pkColumns);
        
    //api param 설정
    const paramInfo = [
        { tbNm: popupInfo.table },
        paramNor,
        paramKey
    ];

    try {
        const response = await ApiRequest("/boot/common/commonUpdate", paramInfo);
            if(response > 0) {
            alert('데이터가 성공적으로 수정되었습니다.');
            handleCancel();
            }    
    } catch (error) {
        console.error('Error ProjectChangePopup insert', error);
    }
}

const onRowUpdateingMonthData = async() => {

    const pkColumns = pick(param, popupInfo.pkColumnsDtl);

    const makeParam = inputValue.map(item => ({
        // ...pkColumns,
        [popupInfo.nomalColumnsDtlYm] : item.id,
        [popupInfo.nomalColumnsDtlValue] : item.value
    }));

    //api param 설정
    const paramInfo = [
        {queryId: "projectMapper.updateChgPrmpcMdfcn"},
        { tbNm: popupInfo.subTable },
        [...makeParam],
        pkColumns,
    ];

    try {
        const response = await ApiRequest("/boot/prjct/updateChgPrmpcMdfcn", paramInfo);
    } catch (error) {
        console.error('Error ProjectChangePopup insert', error);
    }
}

    //배열에서 특정 키만 추출
    const pick = (source, keys) => {
        const result = {};
        keys.forEach(key => {
        if (key in source) {
            result[key] = source[key];
        }
        });
        return result;
    };

    //좌측 데이터 분기
    useEffect(() => {
      if(data != null){
        //통제성경비, 일반경비
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
                                between={popupInfo.cdBetween}
                            />
                        </div>
                    </div>
                    <CustomLabelValue props={popupInfo.labelValue.dtlDtls} value={data.dtlDtls} onSelect={handleChgState}/>
                    <CustomLabelValue props={popupInfo.labelValue.total} value={data.total} onSelect={handleChgState}/>
                </div>
            );
        //외주인력
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
        //자사인력
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
                    <CustomLabelValue props={popupInfo.labelValue.gramt} value={data.gramt} onSelect={handleChgState} readOnly={popupInfo.labelValue.gramt.readOnly}/>
                    <CustomLabelValue props={popupInfo.labelValue.total} value={data.total} onSelect={handleChgState} readOnly={popupInfo.labelValue.total.readOnly}/>
                    <CustomLabelValue props={popupInfo.labelValue.inptPrnmntYmd} value={data.inptPrnmntYmd} onSelect={handleChgState}/>
                    <CustomLabelValue props={popupInfo.labelValue.withdrPrnmntYmd} value={data.withdrPrnmntYmd} onSelect={handleChgState}/>
                </div>
            );
        }else{
            return null;
        }
      }
    }, [popupInfo, data]); 

    const addInput =(e)=>{
        if(e === "title"){
            if(popupInfo.menuName==="ProjectEmpCostJson"){
                return(
                    <th style={{textAlign:"center", width: "10px"}}> 단가 </th>
                )
            }
        }else{
            if(popupInfo.menuName==="ProjectEmpCostJson"){
                return(
                    <td style={{width:"20%", padding:"5px"}}><TextBox value={data.userDfnValue}/></td>
                )
            }
        }
    }

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
                                        <th key={index} style={{textAlign:"center"}}> {popupInfo.popupFormat} </th>
                                        {addInput("title")}
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
                                            id={`${Object.keys(structuredData)[colIndex]}-${months[rowIndex]}`} 
                                            format={popupInfo.popupNumberBoxFormat}
                                            value={inputValue.find(item => item.id === `${Object.keys(structuredData)[colIndex]}-${months[rowIndex]}`)?.value || 0}
                                            onValueChanged={handleInputChange}
                                            style={{ textAlign: 'right' }}
                                            defaultValue={0}
                                            showSpinButtons={true}
                                            step={popupInfo.popupStep}
                                            showClearButton={false}
                                            />): ''}</td>
                                            {addInput()}
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