import React from 'react';
import { saveAs } from 'file-saver-es';
import { Workbook } from 'exceljs';
import { exportPivotGrid } from 'devextreme/excel_exporter';
import PivotGrid, { FieldChooser, Export, PivotGridTypes, FieldPanel, } from 'devextreme-react/pivot-grid';

const CustomPivotGrid = ({ values, columnGTName, blockCollapse, weekendColor, fileName, sorting, filtering, 
    isExport, grandTotals, width, customColor, grandTotalText }) => {

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
            worksheet
            
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

        if(weekendColor === true){
            if (data.area === 'column'){
                const date = new Date(cell.text);
                const dayOfWeek = date.getDay(); // 0: 일요일, 1: 월요일, ..., 6: 토요일

                if (dayOfWeek === 0) { // 일요일
                    if (colorFor === 'pivot') {
                        data.cellElement.style.backgroundColor = customColor ? customColor : '#F6CECE';
                    } else {
                        return { font: '9C0006', fill: customColor ? customColor : '#F6CECE' };
                    }
                } else if (dayOfWeek === 6) { // 토요일
                    if (colorFor === 'pivot') {
                        data.cellElement.style.backgroundColor = customColor ? customColor : '#A9E2F3';
                    } else {
                        return { font: '9C0006', fill: customColor ? customColor : '#A9E2F3' };
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
                        data.cellElement.style.backgroundColor = customColor ? customColor : '#F6CECE';
                    } else {
                        return { font: '9C0006', fill: customColor ? customColor : '#F6CECE' };
                    }
                } else if (dayOfWeek === 6) { // 토요일
                    if (colorFor === 'pivot') {
                        data.cellElement.style.backgroundColor = customColor ? customColor : '#A9E2F3';
                    } else {
                        return { font: '9C0006', fill: customColor ? customColor : '#A9E2F3' };
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
        if(e.area === 'column'){
            e.cellElement.style.fontWeight = 'bold'
            e.cellElement.style.color = 'black'
            e.cellElement.style.backgroundColor = '#f0f0f0'
        }

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
        // 날짜에서 일자만 추출하여 표시
        if (e.area === 'column' && e.cell.text && !isNaN(Date.parse(e.cell.text))) {
            const date = new Date(e.cell.text);
            e.cellElement.innerText = date.getDate().toString();
        }
        weekendCellColor(e, 'pivot');
    };

    return (
        <PivotGrid
            width={width}
            showTotalsPrior='columns'
            allowSortingBySummary={true}
            allowSorting={sorting}
            allowFiltering={filtering}
            allowExpandAll={true}
            showColumnTotals={false}
            showColumnGrandTotals={true}
            showRowGrandTotals={grandTotals}
            dataSource={values}
            showBorders={true}
            onExporting={onExporting}
            onCellClick={onCellClick}
            onCellPrepared={onCellPrepared}
            texts={{ grandTotal: grandTotalText }}
        >
            <FieldPanel
                showRowFields={true}
                visible={true}
                showTotals={false}
                showColumnFields={false}
                showDataFields={false}
                showFilterFields={false}
                allowFieldDragging={false}
            />
            <FieldChooser enabled={false} />
            <Export enabled={isExport} />
        </PivotGrid>
    );
}
export default CustomPivotGrid;