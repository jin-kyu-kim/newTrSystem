import React, { useEffect, useState } from 'react';
import DataGrid, { Column } from 'devextreme-react/data-grid';
import ProjectClaimCostYMDJson from '../prjctCtClm/ProjectClaimCostYMDJson.json';
import ApiRequest from "../../../utils/ApiRequest";


const ProjectClaimCostYMD = () => {
  const { keyColumn, queryId } = ProjectClaimCostYMDJson;
  const [empMMData, setEmpMMData] = useState([]);
  const [empCostData, setEmpCostData] = useState([]);

    // 날짜 출력 함수
    const generateDates = (year, month, odr) => {
        const searchYear = year || new Date().getFullYear();
        const searchMonth = month || new Date().getMonth() + 1;
        const formattedDates = [];

        if(odr == 1){
            for (let day = 1; day <= 15; day++) {
                const formattedDay = day < 10 ? `0${day}` : `${day}`;
                const formattedDate = `${searchYear}${searchMonth}${formattedDay}`;
                formattedDates.push(formattedDate);
            }
        } else if (odr == 2){
            const lastDay = new Date(searchYear, searchMonth, 0).getDate();
            for (let day = 16; day <= lastDay; day++) {
                const formattedDay = `${day}`;
                const formattedDate = `${searchYear}${searchMonth}${formattedDay}`;
                formattedDates.push(formattedDate);
            }
        }

        return formattedDates;
    };


    useEffect(() => {
        getEmpMMData();
        getEmpCostData();
    }, []);

    // 수행인력 컬럼 데이터 조회
    const getEmpMMData = async () => {
        const param = {
            queryId: queryId.empMMQueryId,
            prjctId: keyColumn.value
        };
        try{
            const response = await ApiRequest('/boot/common/queryIdSearch', param);
            setEmpMMData(response);
        }catch (error){
            console.log(error)
        }
    };

    // 경비 컬럼 데이터 조회
    const getEmpCostData = async () => {
        const param = {
            queryId: queryId.empCostQueryId,
            prjctId: keyColumn.value
        };
        try{
            const response = await ApiRequest('/boot/common/queryIdSearch', param);
            setEmpCostData(response);
        }catch (error){
            console.log(error)
        }
    };

    // 날짜 컬럼 데이터 렌더링
    const claimDateCellRender = (data) => {
        const generatedDates = generateDates('2024', '03', 1);
        const currentDate = generatedDates[data.rowIndex];

        return (
            <div style={{ display: "flex" }}>
                    <div>{generatedDates[data.rowIndex]}</div>
            </div>
        );
    };

    // 수행인력 컬럼 데이터 렌더링
    const empMMCellRender = (data) => {
        const currentDate = data.data.cliamDate; // 현재 날짜 가져오기
        const filteredEmpMMData = empMMData.filter(m => m.aplyYmd === currentDate);

        return (
            <div className='container'>
                {filteredEmpMMData.map((m) => (
                    <div style={{display: "flex"}}>
                        <div><strong>{m.empFlnm}</strong> / </div>
                        <div>{m.md} / </div>
                        <div>{m.mmAtrzCmptnYn}</div>
                    </div>
                ))}
            </div>
        );
    }

    //경비 컬럼 데이터 렌더링
    const empCostCellRender = (data) => {
        const currentDate = data.data.cliamDate; // 현재 날짜 가져오기
        const filteredEmpCostData = empCostData.filter(m => m.utztnDt === currentDate);

        return (
            <div className='container'>
                {filteredEmpCostData.map((m) => {
                    return (
                        <div style={{display: "flex"}}>
                            <div><strong>{m.empFlnm}</strong> /</div>
                            <div>{m.expensCd} /</div>
                            <div>{m.utztnAmt} / </div>
                            <div>({m.useOffic}) / </div>
                            <div>상세내역 : {m.cdPrpos} / </div>
                            <div>목적 : {m.atdrn} / </div>
                            <div>{m.ctAtrzCmptnYn} </div>
                        </div>
                    )
                })}
            </div>
        )
    }


    const rowData = generateDates('2024', '03', 1 ).map((date) => ({ cliamDate: date }));

    return (
        <div style={{padding: '20px'}}>
            <div className='container'>
                <DataGrid dataSource={rowData} showBorders={true}>
                    <Column dataField="cliamDate" caption="날짜" cellRender={(data) => claimDateCellRender(data)}/>
                    <Column dataField="empMM" caption="수행인력" cellRender={(data) => empMMCellRender(data)}/>
                    <Column dataField="empCost" caption="경비" cellRender={(data) => empCostCellRender(data)}/>
                </DataGrid>
            </div>
        </div>
    );
};

export default ProjectClaimCostYMD;