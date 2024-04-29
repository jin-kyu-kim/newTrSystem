import React from 'react';
import Scheduler from 'devextreme-react/scheduler';
import CustomPivotGrid from "../../components/unit/CustomPivotGrid";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";

const ProjectClaimCostIndividualCtPop = ({props, prjctNm, startYmOdr, endYmOdr, data}) => {

    const dataSource = new PivotGridDataSource({
        fields: [{
            caption: '직원명',
            dataField: 'empFlnm',
            width: 70,
            area: 'row',
            expanded: true,
        }, {
            caption: '프로젝트명',
            dataField: 'prjctNm',
            width: 250,
            area: 'row',
            expanded: true,
            showTotals: false,
        }, {
            caption: '비용코드',
            dataField: 'cdNm',
            width: 150,
            area: 'row',
            expanded: true,
        },  {
            caption: '상세내역',
            dataField: 'empDetail',
            width: 250,
            area: 'row',
        }, {
            dataField: 'pivotDate',
            width: 70,
            area: 'column',
        }, {
            groupName: 'date',
            groupInterval: 'year',
            expanded: true,
        }, {
            groupName: 'date',
            groupInterval: 'month',
            expanded: true,
        }, {
            caption: '금액',
            dataField: 'utztnAmt',
            dataType: 'number',
            summaryType: 'sum',
            format: 'fixedPoint',
            area: 'data',
            customizeText: function(cellInfo) {
                return cellInfo.valueText === '0'  ? '' : cellInfo.valueText;
            }
        }],
        store: props,
        retrieveFields: false,
    });

    return (
        <div>
            <div className="" style={{marginBottom: "10px"}}>
                <div>
                    <span>* {prjctNm} ({startYmOdr.substr(0, 6)}-{startYmOdr.substr(6, 1)}~{endYmOdr.substr(0, 6)}-{endYmOdr.substr(6, 1)}) 경비 승인내역 </span>
                    <br/>
                </div>
            </div>
            <br/>
            <CustomPivotGrid
                values={dataSource}
                columnGTName={'소계'}
                blockCollapse={true}
                weekendColor={true}
            />
        </div>
    )
        ;

}
export default ProjectClaimCostIndividualCtPop;