import React, {useEffect, useState} from 'react';
import { useNavigate } from "react-router-dom";

import ApiRequest from 'utils/ApiRequest';
import CustomLabelValue from '../../../components/unit/CustomLabelValue';
import CustomCdComboBox from '../../../components/unit/CustomCdComboBox';
// import DataGrid, { Column, Editing } from 'devextreme-react/data-grid';
import Button from "devextreme-react/button";

const ProjectChangePopup = ({selectedItem, period, labelValue, popupInfo, onHide, prjctId}) => {

    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState({}); //월별 값 입력을 위한 상태
    const [data, setData] = useState([]);
    const [param, setParam] = useState([]);
    const [contents, setContents] = useState([]);
    const [structuredData, setStructuredData] = useState({});

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

    // const handleReload = () => {
    //     window.location.reload();
    // };

    useEffect(() => { 

        setData({
            ...data,
            "prjctId" : prjctId
        });

        setParam({
            ...param,
            "prjctId" : prjctId
        });

    }, []);
      
    const handleChgState = ({name, value}) => {

            setData({
                ...data,
                [name] : value
            });
            
            setParam({
                ...param,
                [name] : value
            })
    };  

    const handleInputChange = (e) => {
        const { id, value } = e.target; // 이벤트에서 id와 value 추출

        setInputValue({
            ...inputValue,
            [id] : value
        });

        setParam({
            ...param,
            "months" : inputValue
        })
    };

    useEffect(() => {
        console.log("Updated param", param);
    }, [param]); 

    const handleClick = (e) => {
        navigate("../project/ProjectChange",
            {
        state: { prjctId: prjctId },
        })
    };

    const handleSave = async () => {

        
        const param = [ 
            { tbNm: "EXPENS_MNBY_PRMPC_DTLS" }, 
            { 
                prjctId: prjctId,
            }, 
        ]; 


        try {
            const response = await ApiRequest("/boot/prjct/insertExpenNorPrmpc", param);
            // handleClick();
            console.log("response",response);    
        } catch (error) {
            console.error('Error ProjectChangePopup insert', error);
        }

        console.log("저장",param);
    };  


    useEffect(() => {
    // const contents = () => {
        // const result = [];
      if(data != null){
        if(popupInfo.menuName==="ProjectGeneralBudgetCostJson" || popupInfo.menuName==="ProjectControlBudgetCostJson"){
            setContents(
                // result.push(
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
                    <CustomLabelValue props={popupInfo.labelValue.bgtMngOdr} value={data.bgtMngOdr} onSelect={handleChgState}/>
                </div>
            );
        }else if(popupInfo.menuName==="ProjectOutordCompanyCostJson"){
            setContents(
                // result.push(
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
        }else if(popupInfo.menuName==="ProjectEmpCostJson"){
        }else{
        }
      }
        // return result;
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
                                        <td key={colIndex} style={{width:"10px", padding:"5px"}}>{months[rowIndex] ? `${months[rowIndex]}월` : ''}</td>
                                        <td key={months} style={{width:"50px", padding:"5px"}}>
                                            {months[rowIndex] ? 
                                            (
                                            <input id={`${Object.keys(structuredData)[colIndex]}-${rowIndex+1}`} 
                                                type='number' 
                                                value={inputValue[`${Object.keys(structuredData)[colIndex]}-${rowIndex+1}`] || ''} 
                                                onChange={handleInputChange}/>
                                            )
                                            : ''}</td>
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
                <button className="btn btn-primary" onClick={handleSave}>저장</button>
                <Button text="취소" onClick={handleClick}/>
            </div>
        </div>
    );
};

export default ProjectChangePopup;