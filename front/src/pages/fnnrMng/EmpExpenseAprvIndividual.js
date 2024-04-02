import React, { useEffect, useState } from 'react';
import ApiRequest from "../../utils/ApiRequest";
import CustomPivotGrid from "../../components/unit/CustomPivotGrid";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";


const EmpExpenseAprvIndividual = ({ empNo, aplyYm, aplyOdr, expensCd }) => {

    const [data, setData] = useState([]);

    useEffect(() => {

        fetchData();

    }, []);

    //날짜 조회
    const getDays = async () => {
        const param = {
            queryId: 'financialAffairMngMapper.retrieveDays',
            aplyYm: aplyYm,
            aplyOdr: aplyOdr,
        };
        try{
            const response = await ApiRequest('/boot/common/queryIdSearch', param);
            return response;
        }catch (error){
            console.log(error);
        }
    };

    //경비 승인내역 조회
    const getExpenseAprvData = async () => {
        const param = {
            queryId: 'financialAffairMngMapper.retrieveExpensAprvDtls',
            empNo: empNo,
            aplyYm: aplyYm,
            aplyOdr: aplyOdr,
            expensCd: expensCd
        };
        try{
            const response = await ApiRequest('/boot/common/queryIdSearch', param);
            return response;
        }catch (error){
            console.log(error);
        }
    };

    const fetchData = async () => {
        try {
            // 두 쿼리를 실행하고 데이터를 조합하여 PivotGrid에 전달
            const [columnData, rowData] = await Promise.all([getDays(), getExpenseAprvData()]);

            // 데이터 조합
            const combinedData = combineData(columnData, rowData);
            setData(combinedData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const combineData = (columnData, rowData) => {
        const combinedData = [];

        const pivotDates = columnData.map(item => item.pivotDate);

        for (const pivotDate of pivotDates) {
            const matchingRowData = rowData.filter(item => item.utztnDt === pivotDate);

            for (const row of matchingRowData) {
                combinedData.push({
                    pivotDate: pivotDate,
                    empFlnm: row.empFlnm,
                    prjctNm: row.prjctNm,
                    expensCd: row.expensCd,
                    empDetail: row.empDetail,
                    utztnAmt: row.utztnAmt
                });
            }

            if (matchingRowData.length === 0) {
                combinedData.push({
                    pivotDate: pivotDate,
                });
            }
        }

        return combinedData;
    };

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
            dataField: 'expensCd',
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
        store: data,
        retrieveFields: false,
    });

    const makeExcelFileName = () => {

        let fileName = '경비승인내역.개인별.';
        let fileNameYm = aplyYm;
        let fileNameOdr = '';

        if(aplyOdr != '')
            fileNameOdr = '-'+aplyOdr;

        fileName = fileName+fileNameYm+fileNameOdr+'_';

        return fileName;
    }

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

export default EmpExpenseAprvIndividual;