import React, { useEffect, useState } from 'react';
import ApiRequest from "../../utils/ApiRequest";
import '../../assets/css/Style.css'
import CustomPivotGrid from "../../components/unit/CustomPivotGrid";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";


const ProjectClaimCostYMD = ({ prjctId, prjctNm, startYmOdr, endYmOdr, empId, expensCd }) => {

    const [expenseAprvData, setExpenstAprvData] = useState([]);

    useEffect(() => {
        getExpenseAprvData();

    }, [startYmOdr, endYmOdr]);

    //경비 승인내역 조회
    const getExpenseAprvData = async () => {
        const param = {
            queryId: 'financialAffairMngMapper.retrievePrjctCtClmYMDAccto',
            prjctId: prjctId,
            empId: empId,
            startYmOdr: startYmOdr,
            endYmOdr: endYmOdr,
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

        let fileName = '';
        let startYearMonth = '';
        let startOdr = '';
        let endYearMonth = '';
        let endOdr = '';

        if(startYmOdr == endYmOdr){
            startYearMonth = startYmOdr.substr(0,6);
            startOdr = startYmOdr.substr(6,2);

            fileName = prjctNm+'.'+startYearMonth+'-'+startOdr+'_';
        } else {
            startYearMonth = startYmOdr.substr(0,6);
            startOdr = startYmOdr.substr(6,2);
            endYearMonth = endYmOdr.substr(0,6);
            endOdr = endYmOdr.substr(6,2);

            fileName = prjctNm+'.'+startYearMonth+'-'+startOdr+'~'+endYearMonth+'-'+endOdr+'_';
        }



        return fileName;
    };


    return (
        <div style={{padding: '20px'}}>
            <CustomPivotGrid
                values={dataSource}
                columnGTName={'소계'}
                blockCollapse={true}
                weekendColor={true}
                fileName={makeExcelFileName}
            />
        </div>
    );
};

export default ProjectClaimCostYMD;