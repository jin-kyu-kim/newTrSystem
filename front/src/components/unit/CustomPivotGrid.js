import React from 'react';
import PivotGrid, { FieldChooser, Export, PivotGridTypes, } from 'devextreme-react/pivot-grid';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';
import { exportPivotGrid } from 'devextreme/excel_exporter';


const CustomPivotGrid = ({ values, columnGTName, blockCollapse, weekendColor, fileName }) => {

    const isDataCell = (cell) => (cell.area === 'data' && cell.rowType === 'D' && cell.columnType === 'D');

    const isTotalCell = (cell) => (cell.type === 'T' || cell.type === 'GT' || cell.rowType === 'T' || cell.rowType === 'GT' || cell.columnType === 'T' || cell.columnType === 'GT');

    const getExcelCellFormat = ({ fill, font, bold }: ConditionalAppearance) =>
        ({
            fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: fill } },
            font: { color: { argb: font }, bold },
        });

    const getConditionalAppearance = (cell): ConditionalAppearance => {
        if (isTotalCell(cell)) {
            return { fill: 'F2F2F2', font: '3F3F3F', bold: true };
        }
        const { value } = cell;
        if (value < 20000) {
            return { font: '9C0006', fill: 'FFC7CE' };
        }
        if (value > 50000) {
            return { font: '006100', fill: 'C6EFCE' };
        }
        return { font: '9C6500', fill: 'FFEB9C' };
    };

    const makeFileName = () => {
        const currentDateTime = new Date();
        const formattedDateTime = `${currentDateTime.getFullYear()}`+
            `${padNumber(currentDateTime.getMonth() + 1)}`+
            `${padNumber(currentDateTime.getDate())}`+
            `${padNumber(currentDateTime.getHours())}`+
            `${padNumber(currentDateTime.getMinutes())}`+
            `${padNumber(currentDateTime.getSeconds())}`;

        fileName = fileName+formattedDateTime;

        return fileName;
    }

    // 숫자를 두 자릿수로 만들어주는 함수
    const padNumber = (num) => {
        return num.toString().padStart(2, '0');
    };

    const onExporting = (e: PivotGridTypes.ExportingEvent) => {
        const excelName = makeFileName();
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('excelName');

        exportPivotGrid({
            component: e.component,
            worksheet,
            // customizeCell: ({ pivotCell, excelCell }) => {
            //     console.log('eee',pivotCell,excelCell);
            //     const appearance = weekendCellColor(pivotCell, 'excel');
            //     console.log('aaaa',weekendCellColor(pivotCell, 'excel'));
            //     Object.assign(excelCell, getExcelCellFormat(appearance));
            //
            //     const borderStyle = { style: 'thin', color: { argb: 'FF7E7E7E' } };
            //     excelCell.border = {
            //         bottom: borderStyle,
            //         left: borderStyle,
            //         right: borderStyle,
            //         top: borderStyle,
            //     };
            // },
        }).then(() => {
            workbook.xlsx.writeBuffer().then((buffer) => {
                saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'excelName'+'.xlsx');
            });
        });
    };

    // cell을 클릭해도 접히지 않도록 설정
    const onCellClick = (e) => {

        if (e.area === 'row' && e.cell && e.cell.expanded === true) {
            e.cancel = blockCollapse;
        }

    }

    // 토, 일요일 컬럼 색칠
    const weekendCellColor = (data, colorFor) => {

        let cell = null;
        colorFor === 'pivot' ? cell = data.cell : cell = data;

        // console.log('color',cell);

        if(weekendColor === true){
            if (data.area === 'column'){
                const date = new Date(cell.text);
                const dayOfWeek = date.getDay(); // 0: 일요일, 1: 월요일, ..., 6: 토요일

                if (dayOfWeek === 0) { // 일요일
                    if (colorFor === 'pivot') {
                        data.cellElement.style.backgroundColor = '#F6CECE';
                    } else {
                        return { font: '9C0006', fill: '#F6CECE' };
                    }
                } else if (dayOfWeek === 6) { // 토요일
                    if (colorFor === 'pivot') {
                        data.cellElement.style.backgroundColor = '#A9E2F3';
                    } else {
                        return { font: '9C0006', fill: '#A9E2F3' };
                    }
                } else {
                    if (colorFor === 'excel') {
                        return { font: '9C0006', fill: 'white' };
                    }
                }
            } else if (data.area === 'data' && cell.rowType !== 'T'){
                const date = new Date(cell.columnPath[0]);
                const dayOfWeek = date.getDay(); // 0: 일요일, 1: 월요일, ..., 6: 토요일

                if (dayOfWeek === 0) { // 일요일
                    if (colorFor === 'pivot') {
                        data.cellElement.style.backgroundColor = '#F6CECE';
                    } else {
                        return { font: '9C0006', fill: '#F6CECE' };
                    }
                } else if (dayOfWeek === 6) { // 토요일
                    if (colorFor === 'pivot') {
                        data.cellElement.style.backgroundColor = '#A9E2F3';
                    } else {
                        return { font: '9C0006', fill: '#A9E2F3' };
                    }
                }
            }
        }
    }

    const onCellPrepared = (e) => {

        // ColumnGrandTotals 명칭 변경
        if(columnGTName != null && e.area === 'column' && e.cell.type === 'GT' && e.cell.text === 'Grand Total'){
            e.cell.text = columnGTName;
            e.cellElement.innerText = columnGTName;
        }

        // 날짜 컬럼 렌더링을 위한 null 데이터 display : none 처리
        // console.log('ee',e.area, e.cell);
        // if (e.area === 'row' && e.cell && e.cell.text && e.cell.text.includes('null_')) {
        //     // console.log(e);
        //     e.cellElement.style.display = 'none';
        // } else if (e.area === 'data' && e.cell && e.cell.rowPath && e.cell.rowPath[0].includes('null_')) {
        //     e.cellElement.style.display = 'none';
        // }

        // row collapse block 상태일 때 화살표 아이콘 삭제
        if(blockCollapse === true && e.area === 'row' && e.cell.expanded === true){

            const childNodes = e.cellElement.childNodes;
            Array.from(childNodes).forEach(node => {
                if (node.classList.contains('dx-expand-icon-container')) {
                    node.remove();
                }
            });

            const children = e.cellElement.childNodes;
            Array.from(children).forEach(node => {
                if (node.classList.contains('dx-expand-icon-container')) {
                    node.remove();
                }
            });

        }

        weekendCellColor(e, 'pivot');

    };

    return (
        <PivotGrid
            allowSortingBySummary={true}
            allowSorting={true}
            allowFiltering={true}
            allowExpandAll={true}
            showColumnTotals={false}
            showColumnGrandTotals={true}
            showRowGrandTotals={false}
            dataSource={values}
            showBorders={true}
            onExporting={onExporting}
            onCellPrepared={onCellPrepared}
            onCellClick={onCellClick}
        >
            <FieldChooser enabled={false} />
            <Export enabled={true} />
        </PivotGrid>
    );
}
export default CustomPivotGrid;

