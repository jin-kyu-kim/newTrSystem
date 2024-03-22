import React from 'react';
import PivotGrid, { FieldChooser, Export, PivotGridTypes, } from 'devextreme-react/pivot-grid';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';
import { exportPivotGrid } from 'devextreme/excel_exporter';


const CustomPivotGrid = ({ values }) => {

    const isDataCell = (cell) => (cell.area === 'data' && cell.rowType === 'D' && cell.columnType === 'D');

    const isTotalCell = (cell) => (cell.type === 'T' || cell.type === 'GT' || cell.rowType === 'T' || cell.rowType === 'GT' || cell.columnType === 'T' || cell.columnType === 'GT');

    const getExcelCellFormat = ({ fill, font, bold }: ConditionalAppearance) =>
        ({
            fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: fill } },
            font: { color: { argb: font }, bold },
        });

    const getCssStyles = ({ fill, font, bold }: ConditionalAppearance) =>
        ({
            'background-color': `#${fill}`,
            color: `#${font}`,
            'font-weight': bold ? 'bold' : undefined,
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

    const onExporting = (e: PivotGridTypes.ExportingEvent) => {
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('Sales');

        exportPivotGrid({
            component: e.component,
            worksheet,
            customizeCell: ({ pivotCell, excelCell }) => {
                if (isDataCell(pivotCell) || isTotalCell(pivotCell)) {
                    const appearance = getConditionalAppearance(pivotCell);
                    Object.assign(excelCell, getExcelCellFormat(appearance));
                }

                const borderStyle = { style: 'thin', color: { argb: 'FF7E7E7E' } };
                excelCell.border = {
                    bottom: borderStyle,
                    left: borderStyle,
                    right: borderStyle,
                    top: borderStyle,
                };
            },
        }).then(() => {
            workbook.xlsx.writeBuffer().then((buffer) => {
                saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Sales.xlsx');
            });
        });
    };

    const pivotGridOptions = {
        dataSource: values,
        onCellPrepared: function(e) {

            // 토, 일요일 컬럼 색칠
            if (e.area === 'column'){
                const date = new Date(e.cell.text);
                const dayOfWeek = date.getDay(); // 0: 일요일, 1: 월요일, ..., 6: 토요일

                if (dayOfWeek === 0) { // 일요일
                    e.cellElement.style.backgroundColor = '#F6CECE';
                } else if (dayOfWeek === 6) { // 토요일
                    e.cellElement.style.backgroundColor = '#A9E2F3';
                }
            } else if (e.area === 'data' && e.cell.rowType !== 'T'){
                const date = new Date(e.cell.columnPath[0]);
                const dayOfWeek = date.getDay(); // 0: 일요일, 1: 월요일, ..., 6: 토요일

                if (dayOfWeek === 0) { // 일요일
                    e.cellElement.style.backgroundColor = '#F6CECE';
                } else if (dayOfWeek === 6) { // 토요일
                    e.cellElement.style.backgroundColor = '#A9E2F3';
                }
            }
        }
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
            {...pivotGridOptions}
        >
            <FieldChooser enabled={false} />
            <Export enabled={true} />
        </PivotGrid>
    );
}
export default CustomPivotGrid;

