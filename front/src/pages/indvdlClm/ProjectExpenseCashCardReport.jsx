import { useState, useEffect, useRef,useCallback} from "react";
import ApiRequest from "utils/ApiRequest";

import PivotGrid, { FieldChooser, FieldPanel, Scrolling } from 'devextreme-react/pivot-grid';
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';

const ProjectExpenseCashCardReport = ({basicInfo}) => {

    const [pivotGridConfig, setPivotGridConfig] = useState({
        fields: [
            {
                caption: "프로젝트 명(코드)",
                width: 80,
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
            const response = await ApiRequest("/boot/financialAffairMng/retrieveCtData", param);
        
            console.log(response);
        
            setPivotGridConfig({
                ...pivotGridConfig,
                store: response,
            });
        } catch (error) {
            console.error(error);
        }
    }

    const dataSource = new PivotGridDataSource(pivotGridConfig);

    return (
    <div style={{ marginBottom: "20px" }}>
        <span>* 현금 및 개인법인카드 사용비용</span>
        <PivotGrid
            id="sales"
            dataSource={dataSource}
            allowSortingBySummary={true}
            allowSorting={false}
            allowFiltering={false}
            allowExpandAll={false}
            height={"60%"}
            showBorders={true}
            showRowTotals={true}
            wordWrapEnabled={true}
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
