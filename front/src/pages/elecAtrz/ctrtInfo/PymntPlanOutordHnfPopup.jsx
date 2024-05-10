import React, { useEffect, useState, useCallback } from "react";
import { Button } from "devextreme-react/button";
import CustomLabelValue from "components/unit/CustomLabelValue";
import PymntPlanOutordHnfPopupJson from "./PymntPlanOutordHnfPopupJson.json";
import NumberBox from 'devextreme-react/number-box';
import { parse, format, addMonths } from 'date-fns';
import { useModal } from "../../../components/unit/ModalContext";

const PymntPlanOutordHnfPopup = ({ prjctId, ctrtYmd, stbleEndYmd, handlePopupVisible, handlePopupData, selectedData, tableData, data, sttsCd, ctrtTyCd }) => {

    const labelValue = PymntPlanOutordHnfPopupJson.hnfCtrt.labelValue;
    labelValue.expectInptHnfId.param.queryId.prjctId = prjctId;

    const [outordEmpData, setOutordEmpData] = useState({});
    const [structuredData, setStructuredData] = useState({});   //기간 구조 데이터
    const [inputValue, setInputValue] = useState([]); //월별 값 입력을 위한 상태
    const { handleOpen } = useModal();
    let controlReadOnly = false;

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
    },[ctrtYmd, stbleEndYmd]);
 

    /* =========================  우측 input 값 담기  =========================*/
     //우측 월 값 담기
    const handleInputChange = useCallback((e) => {

        if(!outordEmpData.expectInptHnfId){
            handleOpen("계획투입인원을 먼저 선택해주세요.");
            return;
        }

        const fullId = e.element.id;
        const mm = e.component.option('value');
        const [id, key] = fullId.split('_');
        const index = inputValue.findIndex(item => item.id === id);
    
        setInputValue(currentValues => {
            const newValues = JSON.parse(JSON.stringify(currentValues));
            if (index >= 0) { // 기존 데이터 변경
                const updatedValue = { ...newValues[index], [key || 'mm']: mm };
                
                // 첫 번째 NumberBox의 mm 값이 변경될 때, ctrtAmt도 자동으로 설정
                if (!key) { // mm 값이 업데이트된 경우
                    updatedValue['ctrtAmt'] = outordEmpData.untpc * mm; //Tip. 만약 투입MM으로 비율 계산을 할 필요가 없이 단가만 넣으려면 outordEmpData.untpc로 변경
                }
    
                newValues[index] = updatedValue;
            } else { // 신규 데이터
                const newEntry = { id, [key || 'mm']: mm };
                if (!key) {
                    newEntry['ctrtAmt'] = outordEmpData.untpc * mm;  //Tip. 만약 투입MM으로 비율 계산을 할 필요가 없이 단가만 넣으려면 outordEmpData.untpc로 변경
                }
                newValues.push(newEntry);
            }
    
            // 최신 상태의 값으로 OutordEmpData 업데이트도 여기서 처리
            setOutordEmpData(currentData => ({
                ...currentData,
                hnfCtrtDtlMm: newValues,
                totalMm: calculateTotalMm(newValues),
                totAmt: calculateTotalAmt(newValues)
            }));
    
            return newValues;
        });
    
    }, [inputValue, outordEmpData, setOutordEmpData]);
    
    const calculateTotalMm = (values) => {
        if(!!values){
            const sum = values.filter(item => typeof item.mm === 'number')
                            .map(item => item.mm)
                            .reduce((acc, cur) => acc + cur, 0);
            return Number(sum.toFixed(2));
        }
    };
    
    const calculateTotalAmt = (values) => {
        if(!!values){
            const totAmt = values.map(item => (item.mm || 0) * (item.ctrtAmt || 0))
                                .reduce((acc, cur) => acc + cur, 0);
            return Number(totAmt.toFixed(2));
        }
    };
    


    /* =========================  부모 화면으로 값 던지기  =========================*/
    /**
     *  저장 시 밸리데이션 체크 
     */
    const savePlan = (e) => {
        e.preventDefault();
        
        if(!(outordEmpData.totAmt > 0)) {
            handleOpen("총액은 0 이상 입력해야 합니다.");
            return;
        }

        if(outordEmpData.usefulAmt < outordEmpData.totAmt) {
            handleOpen("총액은 가용금액을 초과할 수 없습니다.");
            return;
        }

        const isEmployeeRegistered = tableData.some(item => {
            if((item.expectInptHnfId === outordEmpData.expectInptHnfId)&&!(Object.keys(selectedData).length)) {
                handleOpen("이미 등록된 사원입니다.");
                return true; // true를 반환하여 some 메서드 반복 중단
            }
            return false;
        });
        if (isEmployeeRegistered) return; // 등록된 사원이 있으면 함수 탈출

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

        const totAmt = calculateTotalAmt(selectedData.hnfCtrtDtlMm)
        const totalMm = calculateTotalMm(selectedData.hnfCtrtDtlMm)

        selectedData.totAmt = totAmt;
        selectedData.totalMm = totalMm;

        setOutordEmpData(selectedData);
        setInputValue(selectedData.hnfCtrtDtlMm?selectedData.hnfCtrtDtlMm:[]); //수정 시 월별 값 셋팅

    }, [selectedData]);

    // 수정테이블 수정가능 여부
    const isEditable = !["VTW03702","VTW03703","VTW03704","VTW03705","VTW03706","VTW03707","VTW03405"].includes(sttsCd) 
                        && data.elctrnAtrzTySeCd !== "VTW04914";

    controlReadOnly = !isEditable
    
    return (
        <form onSubmit={savePlan}>
            <div className="popup-content">
                <div className="project-regist-content">
                    <div className="project-change-content-inner-left">
                        <div className="dx-fieldset">
                            <CustomLabelValue props={labelValue.expectInptHnfId} onSelect={handleChgState} value={outordEmpData.expectInptHnfId} readOnly={controlReadOnly}/>
                            <CustomLabelValue props={labelValue.usefulAmt} onSelect={handleChgState} readOnly={true} value={outordEmpData.usefulAmt}/>
                            <CustomLabelValue props={labelValue.inptHnfId} onSelect={handleChgState} value={outordEmpData.inptHnfId} readOnly={controlReadOnly}/>
                            <CustomLabelValue props={labelValue.outordHnfCtrtSeCd} onSelect={handleChgState} value={outordEmpData.outordHnfCtrtSeCd} readOnly={controlReadOnly}/>
                            <CustomLabelValue props={labelValue.hnfRoleCd} onSelect={handleChgState} value={outordEmpData.hnfRoleCd} readOnly={controlReadOnly}/>
                            <CustomLabelValue props={labelValue.hnfGradCd} onSelect={handleChgState} value={outordEmpData.hnfGradCd} readOnly={controlReadOnly}/>
                            <CustomLabelValue props={labelValue.tkcgJob} onSelect={handleChgState} value={outordEmpData.tkcgJob} readOnly={controlReadOnly}/>
                            <CustomLabelValue props={labelValue.untpc} onSelect={handleChgState} value={outordEmpData.untpc} readOnly={controlReadOnly}/>
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
                                                    format="#,##0.00"
                                                    onChange={handleInputChange}
                                                    readOnly={controlReadOnly}
                                                />): ''}</td>
                                            <td style={{width:"30%", padding:"5px"}}>
                                                {months[rowIndex] ? 
                                                    <NumberBox 
                                                        id={`${Object.keys(structuredData)[colIndex]}${months[rowIndex]}_ctrtAmt`} 
                                                        value ={inputValue.find(item => item.id === `${Object.keys(structuredData)[colIndex]}${months[rowIndex]}`)?.ctrtAmt || 0}
                                                        readOnly={ controlReadOnly === true ? true : false}
                                                        format="#,##0 원"
                                                        defaultValue={0}
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
                    {isEditable&& (
                        <>
                        <Button text="저장" useSubmitBehavior={true}/>
                        <Button text="취소" onClick={handlePopupVisible}/>
                        </>
                    )}
                </div>
            </div>
        </form>
        
    )
}

export default PymntPlanOutordHnfPopup;