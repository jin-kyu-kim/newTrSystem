import React, { useEffect, useState } from 'react';
import ApiRequest from "../../utils/ApiRequest";
import CustomPivotGrid from "../../components/unit/CustomPivotGrid";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";

const EmpExpenseAprvProject = ({ prjctId, year, monthVal, aplyOdr }) => {

    const [expenseAprvData, setExpenstAprvData] = useState([]);

    useEffect(() => {
        getExpenseAprvData();

    }, [year, monthVal, aplyOdr]);

    //경비 승인내역 조회
    const getExpenseAprvData = async () => {
        const param = {
            queryId: 'financialAffairMngMapper.retrieveExpensAprvDtls',
            prjctId: prjctId,
            aplyYm: year+monthVal,
            aplyOdr: aplyOdr,
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
            caption: '비용코드',
            dataField: 'expensCd',
            width: 150,
            area: 'row',
            expanded: true,
        }, {
            caption: '상세내역',
            dataField: 'prjctDetail',
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
            area: 'data',
        }],
        store: expenseAprvData,
        retrieveFields: false,
    });

    const makeExcelFileName = () => {

        let fileName = '경비승인내역.프로젝트별.';
        let fileNameYm = year+monthVal;
        let fileNameOdr = '';

        if(aplyOdr != '')
            fileNameOdr = '-'+aplyOdr;

        fileName = fileName+fileNameYm+fileNameOdr+'_';

        return fileName;
    }

    // 숫자를 두 자릿수로 만들어주는 함수
    const padNumber = (num) => {
        return num.toString().padStart(2, '0');
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

export default EmpExpenseAprvProject;