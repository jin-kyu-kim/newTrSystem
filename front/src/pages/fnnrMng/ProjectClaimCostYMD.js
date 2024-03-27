import React, { useEffect, useState } from 'react';
import ApiRequest from "../../utils/ApiRequest";
import '../../assets/css/Style.css'
import CustomPivotGrid from "../../components/unit/CustomPivotGrid";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";


const ProjectClaimCostYMD = ({ prjctId, prjctNm, year, monthVal, aplyOdr, expensCd }) => {

    const [expenseAprvData, setExpenstAprvData] = useState([]);

    useEffect(() => {
        getExpenseAprvData();

    }, [year, monthVal, aplyOdr]);

    //경비 승인내역 조회
    const getExpenseAprvData = async () => {
        const param = {
            queryId: 'financialAffairMngMapper.retrievePrjctCtClmYMDAccto',
            prjctId: prjctId,
            aplyYm: year+monthVal,
            aplyOdr: aplyOdr,
            expensCd: expensCd
        };
        try{
            const response = await ApiRequest('/boot/common/queryIdSearch', param);
            setExpenstAprvData(response);
        }catch (error){
            console.log(error);
        }
    };

    const dataSource = new PivotGridDataSource({
        fields: [{
            caption: '프로젝트명',
            dataField: 'prjctNm',
            width: 250,
            area: 'row',
            expanded: true,
        }, {
            caption: '직원명',
            dataField: 'empFlnm',
            width: 150,
            area: 'row',
            expanded: true,
        }, {
            caption: '비용코드',
            dataField: 'cdNm',
            width: 350,
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
            width: 70,
            area: 'data',
            customizeText: function(cellInfo) {
                return cellInfo.valueText === '0'  ? '' : cellInfo.valueText;
            }
        }, {
            caption: '근무시간',
            dataField: 'md',
            dataType: 'number',
            summaryType: 'sum',
            format: 'fixedPoint',
            width: 70,
            area: 'data',
            customizeText: function(cellInfo) {
                return cellInfo.valueText === '0'  ? '' : cellInfo.valueText;
            }
        }],
        store: expenseAprvData,
        retrieveFields: false,
    });

    const makeExcelFileName = () => {

        const fileName = prjctNm+'.'+year+monthVal+'-'+aplyOdr+'_';

        return fileName;
    };


    return (
        <div style={{padding: '20px'}}>
            <div className='container'>
                <CustomPivotGrid
                    values={dataSource}
                    columnGTName={'소계'}
                    blockCollapse={true}
                    weekendColor={true}
                    fileName={makeExcelFileName}
                />
            </div>
        </div>
    );
};

export default ProjectClaimCostYMD;