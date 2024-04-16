import React, { useEffect, useState } from "react";
import { Button } from "devextreme-react/button";
import CustomLabelValue from "components/unit/CustomLabelValue";
import PymntPlanOutordHnfPopupJson from "./PymntPlanOutordHnfPopupJson.json";
import NumberBox from 'devextreme-react/number-box';
import { parse, format, addMonths } from 'date-fns';

const PymntPlanOutordHnfPopup = ({ prjctId, ctrtYmd, stbleEndYmd }) => {

    const labelValue = PymntPlanOutordHnfPopupJson.matrlCtrt.labelValue;
    const outordEmpIdParam = labelValue.outordEmpId;
    outordEmpIdParam.param.queryId.prjctId = prjctId;

    const [outordEmpData, setOutordEmpData] = useState({});
    const [structuredData, setStructuredData] = useState({});   //기간 구조 데이터
    

    ///////////////////// 사업기간에 따른 우측 input box 생성 /////////////////////
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
    //////////////////////////////////////////////////////////////////////////////



    /**
     *  입력값 변경시 데이터 핸들링
     */
    const handleChgState = ({name, value}) => {
        // console.log(name, value)
        setOutordEmpData(outordEmpData => ({
            ...outordEmpData,
            [name]: value
        }));
    } 
    
    return (
        <form>
            <div className="popup-content">
                <div className="project-regist-content">
                    <div className="project-change-content-inner-left">
                        <div className="dx-fieldset">
                            <CustomLabelValue props={outordEmpIdParam} onSelect={handleChgState} value={outordEmpData.outordEmpId}/>
                            <CustomLabelValue props={labelValue.usefulAmt} onSelect={handleChgState} readOnly={true} value={outordEmpData.usefulAmt}/>
                            <CustomLabelValue props={labelValue.emp} onSelect={handleChgState} value={outordEmpData.empId}/>
                            <CustomLabelValue props={labelValue.outordHnfCtrtSeCd} onSelect={handleChgState} value={outordEmpData.outordHnfCtrtSeCd}/>
                            <CustomLabelValue props={labelValue.hnfRoleCd} onSelect={handleChgState} value={outordEmpData.hnfRoleCd}/>
                            <CustomLabelValue props={labelValue.hnfGradCd} onSelect={handleChgState} value={outordEmpData.hnfGradCd}/>
                            <CustomLabelValue props={labelValue.tkcgJob} onSelect={handleChgState} value={outordEmpData.tkcgJob}/>
                            <CustomLabelValue props={labelValue.untpc} onSelect={handleChgState} value={outordEmpData.untpc}/>
                            <CustomLabelValue props={labelValue.inptPrnmntYmd} onSelect={handleChgState} readOnly={true} value={outordEmpData.inptPrnmntYmd}/>
                            <CustomLabelValue props={labelValue.withdrPrnmntYmd} onSelect={handleChgState} readOnly={true} value={outordEmpData.withdrPrnmntYmd}/>
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
                                        <>
                                        <th key={year} style={{ width: "50px", textAlign: "center" }}> {year}년 </th>
                                        <th key={index} style={{textAlign:"center"}}> 투입MM </th>
                                        <th style={{textAlign:"center", width: "10px"}}> 비용 </th>
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
                                            id={`${Object.keys(structuredData)[colIndex]}${months[rowIndex]}`} 
                                            // value={inputValue.find(item => item.id === `${Object.keys(structuredData)[colIndex]}${months[rowIndex]}`)?.value || 0}
                                            // onValueChanged={handleInputChange}
                                            style={{ textAlign: 'right' }}
                                            defaultValue={0}
                                            showSpinButtons={true}
                                            showClearButton={false}
                                            />): ''}</td>
                                            <td style={{width:"20%", padding:"5px"}}>
                                                {months[rowIndex] ? 
                                                <NumberBox 
                                                    // value= {data.mmnyLbrcoPrmpcSn ? 
                                                    //         transformedData.find(item => item.id === `${Object.keys(structuredData)[colIndex]}${months[rowIndex]}_untpc`)?.value || 0 
                                                    //         : data.userDfnValue}
                                                    readOnly={true}
                                                    format={"#,### 원"}
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
                    <Button text="취소" />
                </div>
            </div>
        </form>
        
    )
}

export default PymntPlanOutordHnfPopup;