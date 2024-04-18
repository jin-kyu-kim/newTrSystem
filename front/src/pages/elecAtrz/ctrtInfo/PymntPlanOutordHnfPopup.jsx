import React, { useEffect, useState, useCallback } from "react";
import { Button } from "devextreme-react/button";
import CustomLabelValue from "components/unit/CustomLabelValue";
import PymntPlanOutordHnfPopupJson from "./PymntPlanOutordHnfPopupJson.json";
import NumberBox from 'devextreme-react/number-box';
import { parse, format, addMonths } from 'date-fns';

const PymntPlanOutordHnfPopup = ({ prjctId, ctrtYmd, stbleEndYmd, handlePopupVisible, handlePopupData, selectedData }) => {

    const labelValue = PymntPlanOutordHnfPopupJson.hnfCtrt.labelValue;
    labelValue.outordEmpId.param.queryId.prjctId = prjctId;

    const [outordEmpData, setOutordEmpData] = useState({});
    const [structuredData, setStructuredData] = useState({});   //기간 구조 데이터
    const [inputValue, setInputValue] = useState([]); //월별 값 입력을 위한 상태

    // useEffect(() => {
    //     console.log("inputValue",inputValue);
    // }, [inputValue]);


/* =========================  사업기간에 따른 우측 input box 생성  =========================*/
    const makePeriod = (ctrtYmd, stbleEndYmd) => {
        const start = parse(ctrtYmd || format(new Date(), 'yyyy-MM-dd'), 'yyyyMMdd', new Date());
        const end = stbleEndYmd ? parse(stbleEndYmd, 'yyyyMMdd', new Date()) : addMonths(start, 15);
        const periods = [];

        for (let currentDate = start; currentDate <= end; currentDate = addMonths(currentDate, 1)) {
            periods.push(format(currentDate, 'yyyy년 MM월'));
          }

        return periods;
    }

    const makeStructuredData = () => {
       const period = makePeriod(ctrtYmd,stbleEndYmd);

       const periodData = period.reduce((acc, period) => {
        const [year, month] = period.split('년 ').map((el) => el.trim());
        if (!acc[year]) {
          acc[year] = [];
        }
        acc[year].push(month.replace('월', ''));
        return acc;
      }, {});

      setStructuredData(periodData);
    }

    useEffect(() => {
        makeStructuredData();
    }
    ,[ctrtYmd, stbleEndYmd]);
 

    /* =========================  우측 input 값 담기  =========================*/
     //우측 월 값 담기
     const handleInputChange = useCallback((e) => {

        const fullId    = e.element.id; 
        const mm = e.component.option('value');
        const [id, key] = fullId.split('_'); 
        const index = inputValue.findIndex(item => item.id === id);  // 입력 값 객체의 인덱스 찾기
        const hnfCtrtDtlMm = JSON.parse(JSON.stringify(inputValue)); // 상태 변경을 위한 배열 복사

        if (index >= 0) { // 기존 데이터 변경
            const updatedValue = { ...hnfCtrtDtlMm[index] };
            
            if (key && mm !== null) { // untpc와 같은 키가 있으면 업데이트
                updatedValue[key] = mm;
            } else if (!key) { // 일반 value 업데이트
                updatedValue.mm = mm;
            }
            
            hnfCtrtDtlMm[index] = updatedValue; // 변경된 값 객체로 업데이트
                
            } else { // 신규 데이터
                if (key) { // untpc와 같은 키가 있는 신규 데이터
                    hnfCtrtDtlMm.push({ id, [key]: mm }); // 새로운 값 객체 추가
                } else { // 일반 신규 데이터
                    hnfCtrtDtlMm.push({ id, mm }); // 새로운 값 객체 추가
                }
            }

            setInputValue(hnfCtrtDtlMm); // 업데이트된 배열로 상태 설정
            setOutordEmpData(outordEmpData => ({
                ...outordEmpData,
                hnfCtrtDtlMm
            }));
        

        //총 투입 MM 값 구하기
        const sum = hnfCtrtDtlMm.filter(item => typeof item.mm === 'number')
            .map(item => item.mm)
            .reduce((acc, cur) => acc + cur, 0);
        const fixedSum = Number(sum.toFixed(2)); //js의 부동소수 이슈로 인한 자릿수 조정.


        const totAmt = hnfCtrtDtlMm
                        .map(item => (item.mm || 0) * (item.ctrtAmt || 0))
                        .reduce((acc, cur) => acc + cur, 0);

          
        // 부동 소수점 문제 해결을 위해 toFixed() 후 숫자로 변환
        const fixedTotAmt = Number(totAmt.toFixed(2));       


        //총합에 sum값을 넣어주기   
        setOutordEmpData(currentData=>({
            ...currentData,
            "totalMm" : fixedSum,
            "totAmt" : fixedTotAmt,
        })); 
    },[inputValue]);
    


    /* =========================  부모 화면으로 값 던지기  =========================*/
    /**
     *  저장 시 밸리데이션 체크 
     */
    const savePlan = (e) => {
        e.preventDefault();
        
        if(!(outordEmpData.totAmt > 0)) {
            alert("총액은 0 이상 입력해야 합니다.");
            return;
        }

        // //지급 총액이 가용금액을 초과할 경우
        if(outordEmpData.usefulAmt < outordEmpData.totAmt) {
            alert("총액은 가용금액을 초과할 수 없습니다.");
            return;
        }

        handlePopupData(outordEmpData);
        handlePopupVisible();
    }


    /**
     *  입력값 변경시 데이터 핸들링
     */
    const handleChgState = ({name, value}) => {
        setOutordEmpData(outordEmpData => ({
            ...outordEmpData,
            [name]: value
        }));
    } 

    /* =========================  부모창에서 데이터 받아오기  =========================*/
    /**
     *  부모창에서 전달 된 데이터로 셋팅
     */
    useEffect(() => {

        setOutordEmpData(selectedData);
        setInputValue(selectedData.hnfCtrtDtlMm?selectedData.hnfCtrtDtlMm:[]); //수정 시 월별 값 셋팅

    }, [selectedData]);


    
    return (
        <form onSubmit={savePlan}>
            <div className="popup-content">
                <div className="project-regist-content">
                    <div className="project-change-content-inner-left">
                        <div className="dx-fieldset">
                            <CustomLabelValue props={labelValue.outordEmpId} onSelect={handleChgState} value={outordEmpData.outordEmpId}/>
                            <CustomLabelValue props={labelValue.usefulAmt} onSelect={handleChgState} readOnly={true} value={outordEmpData.usefulAmt}/>
                            <CustomLabelValue props={labelValue.emp} onSelect={handleChgState} value={outordEmpData.empId}/>
                            <CustomLabelValue props={labelValue.outordHnfCtrtSeCd} onSelect={handleChgState} value={outordEmpData.outordHnfCtrtSeCd}/>
                            <CustomLabelValue props={labelValue.hnfRoleCd} onSelect={handleChgState} value={outordEmpData.hnfRoleCd}/>
                            <CustomLabelValue props={labelValue.hnfGradCd} onSelect={handleChgState} value={outordEmpData.hnfGradCd}/>
                            <CustomLabelValue props={labelValue.tkcgJob} onSelect={handleChgState} value={outordEmpData.tkcgJob}/>
                            <CustomLabelValue props={labelValue.untpc} onSelect={handleChgState} value={outordEmpData.untpc}/>
                            <CustomLabelValue props={labelValue.inptPrnmntYmd} onSelect={handleChgState} readOnly={true} value={outordEmpData.inptPrnmntYmd}/>
                            <CustomLabelValue props={labelValue.withdrPrnmntYmd} onSelect={handleChgState} readOnly={true} value={outordEmpData.withdrPrnmntYmd}/>
                            <CustomLabelValue props={labelValue.totAmt} onSelect={handleChgState} readOnly={true} value={outordEmpData.totAmt}/>
                        </div> 
                    </div>
                    <div className="project-change-content-inner-right">
                    <div className="dx-fieldset">
                        <div className="dx-field">
                            <div className="dx-field-value">
                            <table style={{ width: "100%", borderSpacing: "10px"}}>
                                <thead>
                                    <tr >
                                    {Object.keys(structuredData).map((year, index) => (
                                        <React.Fragment key={year}>
                                        <th key={year} style={{ width: "50px", textAlign: "center" }}> {year}년 </th>
                                        <th key={index} style={{textAlign:"center"}}> 투입MM </th>
                                        <th style={{textAlign:"center", width: "10px"}}> 단가 </th>
                                        </React.Fragment>
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
                                                    id={`${Object.keys(structuredData)[colIndex]}${months[rowIndex]}`} 
                                                    value={inputValue.find(item => item.id === `${Object.keys(structuredData)[colIndex]}${months[rowIndex]}`)?.mm || 0}
                                                    style={{ textAlign: 'right' }}
                                                    defaultValue={0}
                                                    step={0.01}
                                                    showSpinButtons={true}
                                                    showClearButton={false}
                                                    max={1}
                                                    min={0}
                                                    onChange={handleInputChange}
                                                />): ''}</td>
                                            <td style={{width:"30%", padding:"5px"}}>
                                                {months[rowIndex] ? 
                                                    <NumberBox 
                                                        id={`${Object.keys(structuredData)[colIndex]}${months[rowIndex]}_ctrtAmt`} 
                                                        value ={inputValue.find(item => item.id === `${Object.keys(structuredData)[colIndex]}${months[rowIndex]}`)?.ctrtAmt || 0}
                                                        readOnly={false}
                                                        format={"#,### 원"}
                                                        onChange={handleInputChange}
                                                        
                                                    /> : ''}
                                            </td>
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
                <div>
                    <Button text="저장" useSubmitBehavior={true}/>
                    <Button text="취소" onClick={handlePopupVisible}/>
                </div>
            </div>
        </form>
        
    )
}

export default PymntPlanOutordHnfPopup;