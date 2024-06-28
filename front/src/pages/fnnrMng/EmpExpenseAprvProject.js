import React, { useEffect, useState } from 'react';
import ApiRequest from "../../utils/ApiRequest";
import CustomPivotGrid from "../../components/unit/CustomPivotGrid";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";

const EmpExpenseAprvProject = ({ prjctId, aplyYm, aplyOdr }) => {

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
            prjctId: prjctId,
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
    
            const hasExpenseData = matchingRowData.length > 0;
            
            if (!hasExpenseData) {
                combinedData.push({
                    pivotDate: pivotDate,
                });
            } else {
                for (const row of matchingRowData) {
                    combinedData.push({
                        pivotDate: pivotDate,
                        prjctNm: row.prjctNm,
                        expensCd: row.expensCd,
                        prjctDetail: row.prjctDetail,
                        utztnAmt: row.utztnAmt,
                        prjctCdIdntfr: row.prjctCdIdntfr
                    });
                }
            }
        }
    
        return combinedData;
    };
    
    function getProjectName (e){
        let selectedData = data.find(item => item.prjctCdIdntfr === e);
        return selectedData.prjctNm ? selectedData.prjctNm : ""
    }

    const dataSource = new PivotGridDataSource({
        fields: [{
            caption: '프로젝트명',
            dataField: 'prjctCdIdntfr',
            width: 120,
            area: 'row',
            expanded: true,
            customizeText: function(e) {
                return getProjectName(e.value);
            }
        }, {
            caption: '비용코드',
            dataField: 'expensCd',
            width: 150,
            area: 'row',
            expanded: true,
        }, {
            caption: '상세내역',
            dataField: 'prjctDetail',
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

        let fileName = '경비승인내역.프로젝트별.';
        let fileNameYm = aplyYm;
        let fileNameOdr = '';

        if(aplyOdr != '')
            fileNameOdr = '-'+aplyOdr;

        fileName = fileName+fileNameYm+fileNameOdr+'_';

        return fileName;
    }

    return (
        <div className='singleStickyTotal' style={{padding: '20px'}}>
            <CustomPivotGrid
                values={dataSource}
                columnGTName={'소계'}
                blockCollapse={true}
                weekendColor={true}
                isExport={true}
                grandTotals={false}
                sorting={true}
                fileName={makeExcelFileName}
            />
        </div>
    );
};

export default EmpExpenseAprvProject;