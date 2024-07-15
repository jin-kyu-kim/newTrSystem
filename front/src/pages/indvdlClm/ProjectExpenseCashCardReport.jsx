import { useState, useEffect } from "react";
import ApiRequest from "utils/ApiRequest";
import PivotGrid, { FieldChooser, FieldPanel, Scrolling } from 'devextreme-react/pivot-grid';
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';

const ProjectExpenseCashCardReport = ({ basicInfo }) => {

    const [pivotGridConfig, setPivotGridConfig] = useState({
        fields: [
            {
                caption: "프로젝트",
                dataField: "prjctNmCd",
                area: "row",
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
                    if (cellInfo.value != null) {
                        return cellInfo.value.substring(4);
                    }
                },
                area: "row",
                showTotals: false,
                expanded: true,
                sortOrder :false
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


            // const filteredData = response.filter(item => item.utztnAmt !== null);

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
        if (e.area === 'column') {
            e.cellElement.style.fontWeight = 'bold'
            e.cellElement.style.color = 'black'
            e.cellElement.style.backgroundColor = '#f0f0f0'
        }
        e.cellElement.style.fontSize = '10pt'
        // row collapse block 상태일 때 화살표 아이콘 삭제
        if (e.area === 'row' && e.cell.expanded === true) {
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
        <div>
            {pivotGridConfig.store.length === 0
                ? <div style={{ textAlign: 'center', border: '1px solid lightGray', padding: '5px' }}>승인된 내역이 없습니다.</div>
                : <div style={{ marginBottom: "20px" }}>
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
                        showColumnGrandTotals={true}
                        onCellPrepared={onCellPrepared}
                        texts={{ grandTotal: "총계" }}
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
                </div>}
        </div>
    )
}
export default ProjectExpenseCashCardReport;