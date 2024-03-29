import { Column, DataGrid, Editing, Lookup, MasterDetail, Selection, RequiredRule, StringLengthRule, Pager, Paging } from 'devextreme-react/data-grid';
import { useCallback, useEffect, useRef, useState } from 'react';
import ToggleButton from 'pages/sysMng/ToggleButton';
import ApiRequest from 'utils/ApiRequest';
import '../../pages/sysMng/sysMng.css'
import moment from 'moment';
import { useCookies } from 'react-cookie';

const CustomEditTable = ({ keyColumn, columns, values, tbNm, handleYnVal, masterDetail, doublePk, 
    noEdit, onSelection, onRowClick, removeAdd, callback, handleData }) => {
    const [ cookies ] = useCookies(["userInfo", "userAuth"]);
    const [ cdValList, setCdValList ] = useState({});
    const empId = cookies.userInfo.empId;
    const ynVal= useRef({useYn: false});
    const date = moment();

    useEffect(() => {
        getCdVal();
    }, [])

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
            setCdValList(updatedCdValList);
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
                        Object.assign(e.data, {
                            [doublePk.nm]: doublePk.val
                        });
                    }
                    if(!doublePk){
                        isDuplicate = checkDuplicate(e.data[keyColumn]);
                        if (isDuplicate) return;
                    }
                    handleYnVal !== undefined 
                        ? (e.data = {...e.data, regDt: date.format('YYYY-MM-DD'), regEmpId: empId, ...ynVal.current})
                        : e.data = {...e.data, regDt: date.format('YYYY-MM-DD'), regEmpId: empId}
                    editParam[1] = e.data;
                    editInfo = { url: 'commonInsert', complete: '저장' }
                    break;
                case 'update':
                    if(!doublePk){
                        isDuplicate = checkDuplicate(e.newData[keyColumn]);
                        if (isDuplicate) return;
                    }
                    handleYnVal !== undefined 
                        ? (e.newData = {...e.newData, mdfcnDt: date.format('YYYY-MM-DD'), mdfcnEmpId: empId, ...ynVal.current})
                        : e.newData = {...e.newData, mdfcnDt: date.format('YYYY-MM-DD'), mdfcnEmpId: empId}
                    editParam[1] = e.newData;
                    editParam[2] = keyInfo;
                    editInfo = { url: 'commonUpdate', complete: '수정' }
                    break;
                case 'delete':
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
        } else {
            handleData(values);
        }
    }

    const checkDuplicate = (newKeyValue) => {
        let isDuplicate = false;
        if(newKeyValue !== undefined) isDuplicate = values.some(item => item[keyColumn] === newKeyValue);
        if(isDuplicate) alert("중복된 키 값입니다. 다른 키 값을 사용해주세요.");
        return isDuplicate;
    };

    const getYnVal = (e) => {
        ynVal.current = e.data;
    }

    const buttonRender = (e, col, edit) => {
        if (col.editType === 'toggle') {
            return (
                edit !== undefined ? <ToggleButton callback={getYnVal} data={e}/>
                : <ToggleButton callback={handleYnVal} data={e} />
            )
        }
    }

    return (
        <div className="wrap_table">
            <DataGrid
                className='editGridStyle'
                keyExpr={keyColumn}
                dataSource={values}
                showBorders={true}
                focusedRowEnabled={true}
                columnAutoWidth={true}
                wordWrapEnabled={true}
                repaintChangesOnly={true}
                noDataText=''
                onRowClick={onRowClick}
                onSelectionChanged={onSelection && ((e) => onSelection(e))}
                onRowInserted={(e) => onEditRow('insert', e)}
                onRowUpdating={(e) => onEditRow('update', e)}
                onRowRemoving={(e) => onEditRow('delete', e)}
                onCellPrepared={(e) => {
                    if (e.rowType === 'header') {
                        e.cellElement.style.textAlign = 'center';
                        e.cellElement.style.fontWeight = 'bold';
                    }}}
                onRowPrepared={(e) => {
                    if (e.rowType === 'data' && [1, 3].includes(e.data.sgnalOrdr)) {
                        e.rowElement.style.backgroundColor = 'rgb(255, 253, 203)';
                    }
                }}
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
                    allowAdding={removeAdd ? false : true}
                    allowDeleting={true}
                    allowUpdating={true}
                    refreshMode='reshape'
                    texts={{
                        saveRowChanges: '저장',
                        cancelRowChanges: '취소'
                    }} />
                }
                {onSelection && <Selection mode="multiple" selectAllMode="page"/>}
                {columns.map((col) => (
                    <Column
                        key={col.key}
                        dataField={col.key}
                        caption={col.value}
                        dataType={col.type}
                        format={col.format}
                        alignment={'center'}
                        cellRender={col.button ? (e) => buttonRender(e, col) : undefined}
                        editCellRender={col.button ? (e) => buttonRender(e, col, 'edit') : undefined}
                    >
                        {col.editType === 'selectBox' ? 
                            <Lookup 
                                dataSource={cdValList[col.key]}
                                displayExpr='cdNm'
                                valueExpr='cdValue'
                            />
                        : null}
                        {col.isRequire && <RequiredRule message={`${col.value}는 필수항목입니다`}/>}
                        {col.length && <StringLengthRule max={col.length} message={`최대입력 길이는 ${col.length}입니다`}/>}
                    </Column>
                ))}
                <Paging defaultPageSize={20} />
                <Pager
                    displayMode="full"
                    showNavigationButtons={true}
                    showInfo={false}
                    showPageSizeSelector={true}
                    allowedPageSizes={[20, 50, 80, 100]}
                />
            </DataGrid>
        </div>
    );
}
export default CustomEditTable;