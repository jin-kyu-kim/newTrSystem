import { Column, DataGrid, Editing, Lookup, MasterDetail, Selection, RequiredRule, StringLengthRule, Pager, Paging, Export } from 'devextreme-react/data-grid';
import { useCallback, useEffect, useState } from 'react';
import ApiRequest from 'utils/ApiRequest';
import CellRender from './CellRender';
import { useModal } from "../../components/unit/ModalContext";
import '../../pages/sysMng/sysMng.css'

const CustomEditTable = ({ keyColumn, columns, values, tbNm, handleYnVal, ynVal, masterDetail, doublePk, noDataText, noEdit,
    onSelection, onRowClick, callback, handleData, handleExpanding, cellRenderConfig, onBtnClick, excel, onExcel, upCdValue, onlyUpdate }) => {
    
    const { handleOpen } = useModal();
    const [cdValList, setCdValList] = useState({});

    const getCdVal = useCallback(async () => {
        try {
            let updatedCdValList = {};
            for (const cd of columns) {
                if (cd.comCd) {
                    const response = await ApiRequest('/boot/common/commonSelect', [
                        { tbNm: "CD" }, { upCdValue: cd.comCd }
                    ]);
                    updatedCdValList = {
                        ...updatedCdValList,
                        [cd.key]: response
                    };
                }
            }
            setCdValList({ ...updatedCdValList, useYn: ynVal });
        } catch (error) {
            console.log(error)
        }
    }, []);
    useEffect(() => { getCdVal(); }, []);

    const onEditRow = async (editMode, e) => {
        if (tbNm !== undefined) {
            let editInfo = {};
            let editParam = doublePk ? [{ tbNm: tbNm, snColumn: keyColumn }] : [{ tbNm: tbNm }];
            let keyInfo = doublePk ? { [keyColumn]: e.key, [doublePk.nm]: doublePk.val } : { [keyColumn]: e.key };
            let isDuplicate = false;

            switch (editMode) {
                case 'insert':
                    if (doublePk !== undefined) {
                        Object.assign(e.data, { [doublePk.nm]: doublePk.val });
                    }
                    if (!doublePk) {
                        isDuplicate = checkDuplicate(e.data[keyColumn]);
                        if (isDuplicate) return;
                    }
                    e.data = {
                        ...e.data,
                        ...upCdValue && { upCdValue },
                        ...(handleYnVal !== undefined && e.data.useYn === undefined && { useYn: 'N' })
                    };
                    editParam[1] = e.data;
                    editInfo = { url: 'commonInsert', complete: '저장' }
                    break;
                case 'update':
                    if (!doublePk) {
                        isDuplicate = checkDuplicate(e.newData[keyColumn]);
                        if (isDuplicate) return;
                    }
                    editParam[1] = e.newData;
                    editParam[2] = keyInfo;
                    editInfo = { url: 'commonUpdate', complete: '수정' }
                    break;
                default:
                    editParam[1] = keyInfo;
                    editInfo = { url: 'commonDelete', complete: '삭제' }
                    break;
            }
            const response = await ApiRequest('/boot/common/' + editInfo.url, editParam);
            if (response === 1) {
                await callback();
                handleOpen(`${editInfo.complete}되었습니다.`);
            } else {
                handleOpen(`${editInfo.complete}에 실패했습니다.`);
            }
        } else { handleData(values); }
    };

    const checkDuplicate = (newKeyValue) => {
        let isDuplicate = false;
        if (newKeyValue !== undefined) isDuplicate = values.some(item => item[keyColumn] === newKeyValue);
        if (isDuplicate) handleOpen("중복된 키 값입니다. 다른 값을 사용해주세요.");
        return isDuplicate;
    };

    const cellRender = (col, props) => {
        return (
            <CellRender
                col={col}
                props={props}
                handleYnVal={handleYnVal}
                onBtnClick={onBtnClick}
                cellRenderConfig={cellRenderConfig}
            />
        )
    };
    const otherDateFormat = doublePk && { dateSerializationFormat: "yyyyMMdd" };
    const rowEventHandlers = ynVal ? { onRowInserting: (e) => onEditRow('insert', e) } : { onRowInserted: (e) => onEditRow('insert', e) };

    const highlightRows = keyColumn === 'noticeId' && {
        onRowPrepared: (e) => {
            if (e.rowType === 'data' && [1, 3].includes(e.data.sgnalOrdr)) {
                e.rowElement.style.backgroundColor = 'rgb(255, 253, 203)';
            }
        }
    };

    return (
        <div className="wrap_table">
            <DataGrid
                {...highlightRows}
                {...otherDateFormat}
                {...rowEventHandlers}
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
                onExporting={onExcel}
                onRowExpanding={handleExpanding}
                onSelectionChanged={onSelection && ((e) => onSelection(e))}
                onRowUpdating={(e) => onEditRow('update', e)}
                onRowRemoved={(e) => onEditRow('delete', e)}
            >
                {masterDetail &&
                    <MasterDetail
                        style={{ backgroundColor: 'lightBlue' }}
                        enabled={true}
                        component={masterDetail}
                    />}
                {!noEdit &&
                    <Editing
                        mode="form"
                        allowAdding={onlyUpdate ? false : true}
                        allowDeleting={onlyUpdate ? false : true}
                        allowUpdating={true}
                        refreshMode='reshape'
                        texts={{
                            saveRowChanges: '저장',
                            cancelRowChanges: '취소',
                            confirmDeleteMessage: '삭제하시겠습니까?'
                        }}
                        form={{
                            customizeItem: function (item) {
                                if (item.dataField === "upCdValue") item.visible = false;
                            }
                        }}
                    />}
                {onSelection && <Selection mode="multiple" selectAllMode="page" />}
                {columns.map((col) => (
                    <Column
                        editorOptions={{
                            format: {
                                type: 'fixedPoint',
                                precision: 0
                            }
                        }}         
                        visible={col.visible}
                        key={col.key}
                        dataField={col.key}
                        caption={col.value}
                        dataType={col.type}
                        format={col.format}
                        width={col.width}
                        alignment={'center'}
                        groupIndex={col.grouping && 0}
                        cellRender={col.cellType && ((props) => cellRender(col, props))} >
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
                {excel && <Export enabled={true} />}
            </DataGrid>
        </div>
    );
}
export default CustomEditTable;