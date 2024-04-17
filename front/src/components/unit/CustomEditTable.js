import { Column, DataGrid, Editing, Lookup, MasterDetail, Selection, RequiredRule, StringLengthRule, Pager, Paging } from 'devextreme-react/data-grid';
import { useCallback, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import ApiRequest from 'utils/ApiRequest';
import CellRender from './CellRender';
import moment from 'moment';
import '../../pages/sysMng/sysMng.css'

const CustomEditTable = ({ keyColumn, columns, values, tbNm, handleYnVal, ynVal, masterDetail, doublePk, noDataText,
    noEdit, onSelection, onRowClick, callback, handleData, handleExpanding, cellRenderConfig, onBtnClick }) => {

    const [ cookies ] = useCookies(["userInfo", "userAuth"]);
    const [ cdValList, setCdValList ] = useState({});
    const empId = cookies.userInfo.empId;
    const date = moment();

    useEffect(() => { getCdVal(); }, []);
    const getCdVal = useCallback(async () => {
        try{
            let updatedCdValList = {};
            for (const cd of columns) {
                if(cd.comCd){
                    const response = await ApiRequest('/boot/common/commonSelect', [
                        {tbNm: "CD"}, {upCdValue: cd.comCd}
                    ]);
                    updatedCdValList = {
                        ...updatedCdValList,
                        [cd.key]: response
                    };
                }
            }
            setCdValList({...updatedCdValList, useYn: ynVal});
        } catch(error){
            console.log(error)
        }
    }, [])

    const onEditRow = async (editMode, e) => {
        if(tbNm !== undefined) {
            let editInfo = {};
            let editParam = doublePk ? [{tbNm: tbNm, snColumn: keyColumn}] : [{tbNm: tbNm}];
            let keyInfo = doublePk ? { [keyColumn]: e.key, [doublePk.nm]: doublePk.val } : { [keyColumn]: e.key };
            let isDuplicate = false;
            
            switch (editMode) {
                case 'insert':
                    if(doublePk !== undefined){
                        Object.assign(e.data, {[doublePk.nm]: doublePk.val} );
                    }
                    if(!doublePk){
                        isDuplicate = checkDuplicate(e.data[keyColumn]);
                        if (isDuplicate) return;
                    }
                    handleYnVal !== undefined ? e.data.useYn === undefined && (e.data = {...e.data, regDt: date.format('YYYY-MM-DD'), regEmpId: empId, useYn: "N" })
                    : e.data = {...e.data, regDt: date.format('YYYY-MM-DD'), regEmpId: empId}
                    editParam[1] = e.data;
                    editInfo = { url: 'commonInsert', complete: '저장' }
                    break;
                case 'update':
                    if(!doublePk){
                        isDuplicate = checkDuplicate(e.newData[keyColumn]);
                        if (isDuplicate) return;
                    }
                    e.newData = {...e.newData, mdfcnDt: date.format('YYYY-MM-DD'), mdfcnEmpId: empId}
                    editParam[1] = e.newData;
                    editParam[2] = keyInfo;
                    editInfo = { url: 'commonUpdate', complete: '수정' }
                    break;
                default :
                    editParam[1] = keyInfo;
                    editInfo = { url: 'commonDelete', complete: '삭제' }
                    break;
            }
            try {
                const response = await ApiRequest('/boot/common/' + editInfo.url, editParam);
                if(response === 1) {
                    alert(editInfo.complete + "되었습니다.");
                    callback();
                } else{
                    alert(editInfo.complete + "에 실패했습니다.");
                }
            } catch (error) {
                console.log(error)
            } 
        } else { handleData(values); }
    };

    const checkDuplicate = (newKeyValue) => {
        let isDuplicate = false;
        if(newKeyValue !== undefined) isDuplicate = values.some(item => item[keyColumn] === newKeyValue);
        if(isDuplicate) alert("중복된 키 값입니다. 다른 키 값을 사용해주세요.");
        return isDuplicate;
    };

    const cellRender = (col, props) => {
        return(
            <CellRender
                col={col}
                props={props}
                handleYnVal={handleYnVal}
                onBtnClick={onBtnClick}
                cellRenderConfig={cellRenderConfig}
            />     
        )
    };
    const rowEventHandlers = ynVal ? { onRowInserting: (e) => onEditRow('insert', e) } : { onRowInserted: (e) => onEditRow('insert', e) };
    
    const highlightRows = keyColumn === 'noticeId' && {onRowPrepared: (e) => {
        if (e.rowType === 'data' && [1, 3].includes(e.data.sgnalOrdr)) {
            e.rowElement.style.backgroundColor = 'rgb(255, 253, 203)';
        } 
    }};

    return (
        <div className="wrap_table">
            <DataGrid
                className='editGridStyle'
                keyExpr={keyColumn}
                dataSource={values}
                showBorders={true}
                noDataText={noDataText}
                focusedRowEnabled={true}
                columnAutoWidth={true}
                wordWrapEnabled={true}
                repaintChangesOnly={true}
                onRowClick={onRowClick}
                onRowExpanding={handleExpanding}
                {...highlightRows} 
                {...rowEventHandlers}
                onSelectionChanged={onSelection && ((e) => onSelection(e))}
                onRowUpdating={(e) => onEditRow('update', e)}
                onRowRemoving={(e) => onEditRow('delete', e)}
            >
                {masterDetail && 
                <MasterDetail
                    style={{backgroundColor: 'lightBlue'}}    
                    enabled={true}
                    component={masterDetail}
                 />}
                {!noEdit && 
                <Editing
                    mode="form"
                    allowAdding={true}
                    allowDeleting={true}
                    allowUpdating={true}
                    refreshMode='reshape'
                    texts={{
                        saveRowChanges: '저장',
                        cancelRowChanges: '취소',
                        confirmDeleteMessage: '삭제하시겠습니까?'
                    }} 
                /> }
                {onSelection && <Selection mode="multiple" selectAllMode="page"/>}
                {columns.map((col) => (
                    <Column
                        key={col.key}
                        dataField={col.key}
                        caption={col.value}
                        dataType={col.type}
                        format={col.format}
                        width={col.width}
                        alignment={'center'}
                        groupIndex={col.grouping && 0}
                        cellRender={col.cellType && ((props) => cellRender(col, props) )} >
                        {col.editType === 'selectBox' ? 
                            <Lookup 
                                dataSource={cdValList[col.key]}
                                displayExpr='cdNm'
                                valueExpr='cdValue'
                            />
                        : null}
                        {col.isRequire && <RequiredRule message={`${col.value}는 필수항목입니다`} />}
                        {col.length && <StringLengthRule max={col.length} message={`최대입력 길이는 ${col.length}입니다`} />}
                    </Column>
                ))}
                <Paging defaultPageSize={20} />
                <Pager
                    displayMode="full"
                    showNavigationButtons={true}
                    showPageSizeSelector={true}
                    allowedPageSizes={[20, 50, 80, 100]}
                />
            </DataGrid>
        </div>
    );
}
export default CustomEditTable;