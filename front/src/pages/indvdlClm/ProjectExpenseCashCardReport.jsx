import { useState, useEffect } from "react";
import ApiRequest from "utils/ApiRequest";

import PivotGrid, { FieldChooser, FieldPanel, Scrolling } from 'devextreme-react/pivot-grid';
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';
import { BackgroundColor } from 'devextreme-react/cjs/chart';

const ProjectExpenseCashCardReport = ({basicInfo}) => {

    const [pivotGridConfig, setPivotGridConfig] = useState({
        fields: [
            {
                caption: "프로젝트",
                dataField: "prjctNmCd",
                area: "row",
                expanded: true,
            },
            {
                caption: "지불",
                dataField: "ctStlmSeCdNm",
                area: "row",
                showTotals: false,
                expanded: true,
            },
            {
                caption: "비용",
                dataField: "expensCdNm",
                area: "row",
                showTotals: true,
                expanded: true
            },
            {
                caption: "상세내역",
                dataField: "ctPrpos",
                customizeText: function (cellInfo) {
                    if(cellInfo.value != null) {
                        return cellInfo.value.substring(2);
                    }
                },
                area: "row",
                showTotals: false,
                expanded: true,
            },
            {
                caption: "용도",
                dataField: "atdrn",
                area: "row",
                showTotals: false,
                expanded: true,
            },
            {
                dataField: "day",
                area: "column",
                showTotals: false
            },
            {
                caption: "금액",
                dataField: "utztnAmt",
                dataType: "number",
                area: "data",
                format: "#,###",
                showValues: true,
                summaryType: "sum"
            }
        ],
        store: [],
    });

    useEffect(() => {
        retrieveCtData(basicInfo);

    }, [basicInfo]);

    const retrieveCtData = async (basicInfo) => {
        const param = {
            empId: basicInfo.empId,
            aplyYm: basicInfo.aplyYm,
            aplyOdr: basicInfo.aplyOdr,
        }
    
        try {
            const response = await ApiRequest("/boot/indvdlClm/retrieveCtData", param);
            setPivotGridConfig({
                ...pivotGridConfig,
                store: response,
            });
        } catch (error) {
            console.error(error);
        }
    }

    const dataSource = new PivotGridDataSource(pivotGridConfig);

    const onCellPrepared = (e) => {
        e.cellElement.style.fontSize = '12pt'
        // row collapse block 상태일 때 화살표 아이콘 삭제
        if(e.area === 'row' && e.cell.expanded === true){
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
    };

    return (
        <div style={{ marginBottom: "20px" }}>
            <PivotGrid
                id="sales"
                width={'100%'}
                height={"60%"}
                dataSource={dataSource}
                allowSortingBySummary={true}
                showTotalsPrior='columns'
                showBorders={true}
                allowSorting={false}
                showRowTotals={true} 
                showColumnTotals={false}
                allowFiltering={false}
                allowExpandAll={false}
                wordWrapEnabled={true}
                showColumnGrandTotals={true}
                onCellPrepared={onCellPrepared}
                texts={{ grandTotal: "총계" }}
                style={{transform: 'scale(0.9)', maxWidth: '100px', fontWeight: 'bold'}}
            >
                <FieldPanel
                    visible={true}
                    allowSorting={false}
                    showRowFields={true}
                    showDataFields={false}
                    wordWrapEnabled={true}
                    showColumnFields={false}
                    showFilterFields={false}
                    allowFieldDragging={false}
                />
                <FieldChooser enabled={false} />
                <Scrolling mode="virtual" />
            </PivotGrid>
        </div>
    )
}
export default ProjectExpenseCashCardReport;