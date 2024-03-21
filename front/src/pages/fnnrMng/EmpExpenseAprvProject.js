import React, { useEffect, useState } from 'react';
import DataGrid, {Column, Export} from 'devextreme-react/data-grid';
import EmpExpenseAprvProjectJson from './EmpExpenseAprvProjectJson.json';
import ApiRequest from "../../utils/ApiRequest";
import {Workbook} from "exceljs";
import {exportDataGrid} from "devextreme/excel_exporter";
import { saveAs } from 'file-saver';
import '../../assets/css/Style.css'


const EmpExpenseAprvProject = ({ year, monthVal, aplyOdr, dateList }) => {

    const { keyColumn, queryId } = EmpExpenseAprvProjectJson;
    const [expenseAprvData, setExpenstAprvData] = useState([]);


    useEffect(() => {
        getExpenseAprvData();
    }, [year, monthVal, aplyOdr]);

    //경비 승인내역 조회
    const getExpenseAprvData = async () => {
        const param = {
            queryId: queryId,
            aplyYm: year+monthVal,
            aplyOdr: aplyOdr,
        };
        try{
            const response = await ApiRequest('/boot/common/queryIdSearch', param);
            setExpenstAprvData(response);
        }catch (error){
            console.log(error);
        }
    };

    // 엑셀 출력
    const onExporting = (e) => {
    //     const currentDateTime = new Date();
    //     const formattedDateTime = `${currentDateTime.getFullYear()}`+
    //         `${padNumber(currentDateTime.getMonth() + 1)}`+
    //         `${padNumber(currentDateTime.getDate())}`+
    //         `${padNumber(currentDateTime.getHours())}`+
    //         `${padNumber(currentDateTime.getMinutes())}`+
    //         `${padNumber(currentDateTime.getSeconds())}`;
    //     if (e.component) {
    //         const workbook = new Workbook();
    //         const worksheet = workbook.addWorksheet(`.${year}${monthVal}-${aplyOdr}_${formattedDateTime.substring(0, 6)}`);
    //         exportDataGrid({
    //             component: e.component,
    //             worksheet,
    //             autoFilterEnabled: true,
    //         }).then(() => {
    //             workbook.xlsx.writeBuffer().then((buffer) => {
    //                 saveAs(new Blob([buffer],
    //                         { type: 'application/octet-stream' }),
    //                     `.${year}${monthVal}-${aplyOdr}_${formattedDateTime}.xlsx`);
    //             });
    //         });
    //     }
    };

    // 숫자를 두 자릿수로 만들어주는 함수
    const padNumber = (num) => {
        return num.toString().padStart(2, '0');
    };


    const columns = [
        { dataField: 'prjctNm', caption: '프로젝트명', width: '250' },
        { dataField: 'expensCd', caption: '비용 코드', width: '200' },
        { dataField: 'empFlnm', caption: '이름', width: '100' },
        { dataField: 'ctPrpos', caption: '상세내역', width: '200' },
        { dataField: 'atdrn', caption: '용도', width: '200' },
        { dataField: 'utztnAmt', caption: '금액(소계)', width: '100' },
        { dataField: 'bfeClm', caption: '기간외', width: '100' },
    ];

    // 날짜에 대한 열 생성
    const pushDateColumns = () => {

        dateList.forEach(date => {
            columns.push({
                dataField: date,
                caption: date, // 날짜를 열의 캡션으로 사용
                width: '130',
                calculateCellValue: rowData => {
                    return makeReturn();
                }
            });
        });

    }

    pushDateColumns();

    const makeReturn = () => {
        return 0;
    }

    return (
        <div style={{padding: '20px'}}>
            <div className='container'>
                <DataGrid
                    dataSource={expenseAprvData}
                    showBorders={true}
                    showColumnLines={true}
                    wordWrapEnabled={true}
                    onExporting={onExporting}
                    onCellPrepared={(e) => {
                        if (e.rowType === 'header') {
                            e.cellElement.style.textAlign = 'center';
                            e.cellElement.style.fontWeight = 'bold';
                        }
                    }}
                >
                    {columns.map((column, index) => (
                        <Column key={index} {...column} />
                    ))}
                    <Export enabled={true} />
                </DataGrid>
            </div>
        </div>
    );
};

export default EmpExpenseAprvProject;