import { Column, DataGrid, Editing, Lookup, MasterDetail, Pager, Paging } from 'devextreme-react/data-grid';
import ToggleButton from 'pages/sysMng/ToggleButton';
import ApiRequest from 'utils/ApiRequest';
import '../../pages/sysMng/sysMng.css'
import { useCallback, useEffect, useState } from 'react';

const CustomEditTable = ({ keyColumn, columns, values, tbNm, handleYnVal, masterDetail, allowKeyChg, doublePk }) => {
    const [ cdValList, setCdValList ] = useState({});

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
        const editParam = [{ tbNm: tbNm }];
        let editInfo = {};
        let keyInfo = doublePk ? { [keyColumn]: e.key, [doublePk.nm]: doublePk.val } : { [keyColumn]: e.key };

        switch (editMode) {
            case 'insert':
                editParam[1] = e.data;
                editInfo = { url: 'commonInsert', complete: '저장' }
                break;
            case 'update':
                console.log('e.newData', e.newData)
                editParam[1] = e.newData;
                editParam[2] = keyInfo;
                editInfo = { url: 'commonUpdate', complete: '수정' }
                break;
            default:
                editParam[1] = keyInfo;
                editInfo = { url: 'commonDelete', complete: '삭제' }
                break;
        }
        try {
            const response = await ApiRequest('/boot/common/' + editInfo.url, editParam);
            response === 1 ? alert(editInfo.complete + "되었습니다.") : alert(editInfo.complete + "에 실패했습니다.")
        } catch (error) {
            console.log(error)
        }
    }

    const buttonRender = (e, col) => {
        if (col.editType === 'toggle') {
            return (
                <ToggleButton callback={handleYnVal} data={e.data} idColumn={e.key} />
            )
        }
    }

    return (
        <div className="wrap_table">
            <DataGrid
                keyExpr={keyColumn}
                dataSource={values}
                showBorders={true}
                focusedRowEnabled={true}
                columnAutoWidth={true}
                wordWrapEnabled={true}
                onRowInserted={(e) => onEditRow('insert', e)}
                onRowUpdating={(e) => onEditRow('update', e)}
                onRowRemoving={(e) => onEditRow('delete', e)}
                onCellPrepared={(e) => {
                    if (e.rowType === 'header') {
                        e.cellElement.style.textAlign = 'center';
                        e.cellElement.style.fontWeight = 'bold';
                    }
            }}>
                {masterDetail && 
                <MasterDetail
                    enabled={true}
                    component={masterDetail}
                 />}

                <Editing
                    mode="form"
                    allowAdding={true}
                    allowDeleting={true}
                    allowUpdating={true}
                    refreshMode='reshape'
                    texts={{
                        saveRowChanges: '저장',
                        cancelRowChanges: '취소',
                        addRow: '새로운 데이터 추가'
                    }}
                />
                {columns.map((col) => (
                    <Column
                        key={col.key}
                        dataField={col.key}
                        caption={col.value}
                        dataType={col.type}
                        alignment={'center'}
                        allowEditing={allowKeyChg && col.key === keyColumn ? false : true}
                        cellRender={col.button ? (e) => buttonRender(e, col) : undefined}
                        editCellRender={col.button ? (e) => buttonRender(e, col) : undefined}
                    >
                        {col.editType === 'selectBox' ? 
                            <Lookup 
                                dataSource={cdValList[col.key]}
                                displayExpr='cdNm'
                                valueExpr='cdValue'
                            />
                        : null}
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