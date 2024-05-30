import { useState, useEffect } from "react";
import ApiRequest from "utils/ApiRequest";

import PivotGrid, { FieldChooser, FieldPanel, Scrolling } from 'devextreme-react/pivot-grid';
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';

const ProjectExpenseCashCardReport = ({basicInfo}) => {

    const [pivotGridConfig, setPivotGridConfig] = useState({
        fields: [
            {
                caption: "프로젝트명",
                width: 10,
                dataField: "prjctNmCd",
                area: "row",
                expanded: true,
            },
            {
                caption: "지불수단",
                dataField: "ctAtrzSeCdNm",
                area: "row",
                showTotals: false,
                expanded: true,
            },
            {
                caption: "비용코드",
                dataField: "expensCdNm",
                area: "row",
                showTotals: true,
                expanded: true,
            },
            {
                caption: "상세내역(목적)",
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
                caption: "용도(참석자명단)",
                dataField: "atdrn",
                width: 60,
                area: "row",
                showTotals: false,
                expanded: true,
            },
            {
                dataField: "day",
                area: "column",
            },
            {
                caption: "금액",
                dataField: "utztnAmt",
                dataType: "number",
                area: "data",
                format: "#,###",
                showValues: true,
                summaryType: "sum",
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
                showTotalsPrior='columns'
                dataSource={dataSource}
                allowSortingBySummary={true}
                allowSorting={false}
                allowFiltering={false}
                allowExpandAll={false}
                height={"60%"}
                showBorders={true}
                showRowTotals={true}
                wordWrapEnabled={true}
                onCellPrepared={onCellPrepared}
                texts={{ grandTotal: "금액" }}
            >
                <FieldPanel
                    showRowFields={true}
                    visible={true}
                    showTotals={false}
                    showColumnFields={false}
                    showDataFields={false}
                    showFilterFields={false}
                    allowFieldDragging={false}
                    allowSorting={false}
                    wordWrapEnabled={true}
                />
                <FieldChooser enabled={false} />
                <Scrolling mode="virtual" />
            </PivotGrid>
        </div>
    )
}
export default ProjectExpenseCashCardReport;