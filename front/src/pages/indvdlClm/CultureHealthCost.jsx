import React, {useEffect, useState} from "react";
import CultureHealthCostReg from "./CultureHealthCostReg";
import PivotGrid, {FieldChooser, Scrolling} from "devextreme-react/pivot-grid";
import ApiRequest from "../../utils/ApiRequest";
import {useCookies} from "react-cookie";
import {SelectBox} from "devextreme-react";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";

const CultureHealthCost = () => {

    const [cookies] = useCookies([]);
    const [pivotGridConfig, setPivotGridConfig] = useState({
        fields: [
            {
                dataField: "category",
                area: "row",
                showTotals: false,
                expanded: true
            },
            {
                dataField: "name",
                area: "row",
                showTotals: false,
                expanded: true
            },
            {
                dataField: "month",
                area: "column",
                showTotals: false,
                expanded: true
            },
            {
                dataField: "data",
                summaryType: "sum",
                area: "data",
                format: "fixedPoint",
                customizeText: function(cellInfo) {
                    return cellInfo.valueText.startsWith('0dt') ?
                        cellInfo.valueText.substring(3,7)+"."+cellInfo.valueText.substring(7,9)+"."+cellInfo.valueText.substring(9,11) : cellInfo.valueText;
                },
                expanded: true
            }
        ],
        store: [],
    });
    const dataSource = new PivotGridDataSource(pivotGridConfig);
    let now = new Date();
    const [year, setYear] = useState(now.getFullYear());

    useEffect(() => {
        if(year != null){
            searchTable();
        }
    }, [year]);

    const searchTable = async () => {
        try{
            const param = { empId: cookies.userInfo.empId, clmYm: year }
            const response = await ApiRequest('/boot/indvdlClm/retrieveClturPhstrnActCt', param);
            setPivotGridConfig({
                ...pivotGridConfig,
                store: response,
            });
        } catch (error) {
            console.log(error);
        }
    }

    function getYearList(startYear, endYear) {
        const yearList = [];
        let startDate = parseInt(new Date(String(new Date().getFullYear() - startYear)).getFullYear());
        let endDate = parseInt(new Date().getFullYear() + endYear);

        for (startDate; startDate <= endDate; startDate++) {
            yearList.push(startDate);
        }

        return yearList;
    }

    const onCellClick = (e) => {
        if (e.area === 'row' && e.cell && e.cell.expanded === true) {
            e.cancel = true;
        }
    }

    const onCellPrepared = (e) => {
        if(e.area === "row" && e.cell.text === "01"){
            const textNode = e.cellElement.childNodes[0];
            textNode.textContent = "청구";
        } else if (e.area === "row" && e.cell.text === "02"){
            const textNode = e.cellElement.childNodes[0];
            textNode.textContent = "지급";
        } else if (e.area === "row" && e.cell.text === "03"){
            const textNode = e.cellElement.childNodes[0];
            textNode.textContent = "지급날짜";
        } else if (e.area === "row" && e.cell.text === "04"){
            const textNode = e.cellElement.childNodes[0];
            textNode.textContent = "잔액";
        }

        if( e.area === 'row' && e.cell.expanded === true){
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
            <div
                className="title p-1"
                style={{marginTop: "20px", marginBottom: "10px"}}
            >
                <h1 style={{fontSize: "40px"}}>문화체련비</h1>
            </div>
            <div className="col-md-2" style={{marginLeft: "2%", marginBottom: "2%"}}>
                <SelectBox
                    placeholder="[년도]"
                    defaultValue={now.getFullYear()}
                    dataSource={getYearList(10, 1)}
                    onValueChange={(e) => {
                        setYear(e)
                    }}/>
            </div>
            <div style={{margin: "2%"}}>
                <PivotGrid
                    dataSource={dataSource}
                    allowSortingBySummary={true}
                    height={450}
                    showBorders={true}
                    allowFiltering={false}
                    allowSorting={false}
                    allowExpandAll={true}
                    showRowTotals={false}
                    showColumnGrandTotals={false}
                    showRowGrandTotals={false}
                    onCellPrepared={onCellPrepared}
                    onCellClick={onCellClick}
                >
                    <FieldChooser enabled={false}/>
                    <Scrolling mode="virtual"/>
                </PivotGrid>
            </div>
            <CultureHealthCostReg year={year}></CultureHealthCostReg>
        </div>
    );
};

export default CultureHealthCost;