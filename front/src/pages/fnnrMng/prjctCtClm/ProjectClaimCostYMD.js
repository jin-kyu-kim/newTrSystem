import React, { useEffect, useState } from 'react';
import DataGrid, {Column, Export} from 'devextreme-react/data-grid';
import ProjectClaimCostYMDJson from '../prjctCtClm/ProjectClaimCostYMDJson.json';
import ApiRequest from "../../../utils/ApiRequest";
import {Workbook} from "exceljs";
import {exportDataGrid} from "devextreme/excel_exporter";
import { saveAs } from 'file-saver';
import '../../../assets/css/Style.css'


const ProjectClaimCostYMD = ({ prjctId, prjctNm, year, monthVal, aplyOdr, empId }) => {
    const { keyColumn, queryId } = ProjectClaimCostYMDJson;
    const [empMMData, setEmpMMData] = useState([]);
    const [empCostData, setEmpCostData] = useState([]);

    // 날짜 출력 함수
    const generateDates = (year, monthVal, aplyOdr) => {

        const formattedDates = [];

        if(aplyOdr == 1){
            for (let day = 1; day <= 15; day++) {
                const formattedDay = day < 10 ? `0${day}` : `${day}`;
                const formattedDate = `${year}${monthVal}${formattedDay}`;
                formattedDates.push(formattedDate);
            }
        } else if (aplyOdr == 2){
            const lastDay =  new Date(year, monthVal, 0).getDate();
            for (let day = 16; day <= lastDay; day++) {
                const formattedDay = `${day}`;
                const formattedDate = `${year}${monthVal}${formattedDay}`;
                formattedDates.push(formattedDate);
            }
        }

        return formattedDates;
    };


    useEffect(() => {
        getEmpMMData();
        getEmpCostData();
    }, [year, monthVal, aplyOdr, empId]);

    // 수행인력 컬럼 데이터 조회
    const getEmpMMData = async () => {
        const param = {
            queryId: queryId.empMMQueryId,
            prjctId: keyColumn.value,
            aplyYm: year+monthVal,
            aplyOdr: aplyOdr,
            empId: empId

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
            prjctId: keyColumn.value,
            aplyYm: year+monthVal,
            aplyOdr: aplyOdr,
            empId: empId
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
        const generatedDates = generateDates(year, monthVal, aplyOdr);
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

    const getEmpMMDataForDate = (date) => {
        const filteredEmpMMData = empMMData.filter((m) => m.aplyYmd === date);
        return filteredEmpMMData.map((m) => `${m.empFlnm} / ${m.md} / ${m.mmAtrzCmptnYn}`).join(', ');
    };

    const getEmpCostDataForDate = (date) => {
        const filteredEmpCostData = empCostData.filter((m) => m.utztnDt === date);
        return filteredEmpCostData.map((m) => `${m.empFlnm} / ${m.expensCd} / ${m.utztnAmt} / (${m.useOffic}) / 상세내역 : ${m.cdPrpos} / 목적 : ${m.atdrn} / ${m.ctAtrzCmptnYn}`).join(', ');
    };

    const rowData = generateDates(year, monthVal, aplyOdr ).map((date) => ({
        cliamDate: date,
        empMM: getEmpMMDataForDate(date),
        empCost: getEmpCostDataForDate(date)
    }));

    // 엑셀 출력
    const onExporting = (e) => {
        const currentDateTime = new Date();
        const formattedDateTime = `${currentDateTime.getFullYear()}`+
            `${padNumber(currentDateTime.getMonth() + 1)}`+
            `${padNumber(currentDateTime.getDate())}`+
            `${padNumber(currentDateTime.getHours())}`+
            `${padNumber(currentDateTime.getMinutes())}`+
            `${padNumber(currentDateTime.getSeconds())}`;
        if (e.component) {
            const workbook = new Workbook();
            const worksheet = workbook.addWorksheet(`${prjctNm}.${year}${monthVal}-${aplyOdr}_${formattedDateTime.substring(0, 6)}`);
            exportDataGrid({
                component: e.component,
                worksheet,
                autoFilterEnabled: true,
            }).then(() => {
                workbook.xlsx.writeBuffer().then((buffer) => {
                    saveAs(new Blob([buffer],
                            { type: 'application/octet-stream' }),
                        `${prjctNm}.${year}${monthVal}-${aplyOdr}_${formattedDateTime}.xlsx`);
                });
            });
        }
    };

    // 숫자를 두 자릿수로 만들어주는 함수
    const padNumber = (num) => {
        return num.toString().padStart(2, '0');
    };

    return (
        <div style={{padding: '20px'}}>
            <div className='container'>
                <DataGrid
                    dataSource={rowData}
                    showBorders={true}
                    showColumnLines={true}
                    onExporting={onExporting}
                    onCellPrepared={(e) => {
                        if (e.rowType === 'header') {
                            e.cellElement.style.textAlign = 'center';
                            e.cellElement.style.fontWeight = 'bold';
                        }
                    }}
                >
                    <Column
                        dataField="cliamDate"
                        caption="날짜"
                        cellRender={(data) => claimDateCellRender(data)}
                        width="150"
                    />
                    <Column
                        dataField="empMM"
                        caption="수행인력"
                        cellRender={(data) => empMMCellRender(data)}
                        width="250"
                    />
                    <Column
                        dataField="empCost"
                        caption="경비"
                        cellRender={(data) => empCostCellRender(data)}/>
                    <Export enabled={true} />
                </DataGrid>
            </div>
        </div>
    );
};

export default ProjectClaimCostYMD;