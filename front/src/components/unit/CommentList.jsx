import React from 'react';
import DataGrid, { Column, Editing, Form } from 'devextreme-react/data-grid';
import { useModal } from "./ModalContext";

const CommentList = ({ comments, changeData})=>{
    const { handleOpen } = useModal();
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const empId = userInfo.empId;
    const empNm =userInfo.empNm;
    const onRowInserted = (e) => {
        changeData(e, 'Insert');
    };

    const onRowUpdated = (e) => {
        if(e.data.empId !== empId ){
            handleOpen("본인의 데이터만 삭제 가능합니다.");
            return false;
        }else{
            changeData(e, 'Update');
        }
    };

    const onRowRemoved = (e) => {
        if(e.data.empId !== empId ){
            handleOpen("본인의 데이터만 삭제 가능합니다.");
            return false;
        }else{
            changeData(e, 'Delete');
        }
    };
    const getNextId = () => {
        if (comments.length === 0) {
            return 1;
        }
        const ids = comments.map(comment => comment.errDtlSn);
        return Math.max(...ids) + 1;
    };
    const onInitNewRow = (e) => {
        e.data.empId = empId;
        e.data.empNm = empNm;
        e.data.errDtlSn = getNextId();
    };
    const isEditingAllowed = (rowData) => {
        return rowData.empId === empId;
    };

    return (
        <DataGrid
            dataSource={comments}
            keyExpr="errDtlSn"
            showBorders={true}
            wordWrapEnabled={true}
            onCellPrepared={(e) => {
                e.cellElement.style.wordBreak = 'break-all' // 줄바꿈 대상에 숫자 포함
            }}
            onRowInserted={onRowInserted}
            onRowUpdated={onRowUpdated}
            onRowRemoved={onRowRemoved}
            onInitNewRow={onInitNewRow}
            noDataText='등록된 댓글이 없습니다.'
        >
            <Editing
                mode="row"
                allowUpdating={true}
                allowAdding={true}
                allowDeleting={true}
                texts={{
                    saveRowChanges: '저장',
                    cancelRowChanges: '취소',
                    confirmDeleteMessage: '삭제하시겠습니까?'
                }}
            >
                <Form>
                    <Form.OptionName dataField="empId" />
                    <Form.OptionName dataField="dtlAnswer" editorType="dxTextArea" editorOptions={{ maxLength: 200 }} />
                </Form>
            </Editing>
            <Column dataField="dtlAnswer" caption="댓글" editorOptions={{ maxLength: 200 }} />
            <Column dataField="empNm" caption="작성자" width="15%" allowEditing={false}/>
            <Column dataField="regDt" caption="작성일시" width="15%" allowEditing={false}/>
            <Column
                type="buttons"
                buttons={[
                    {
                        name: 'edit',
                        visible: (options) => isEditingAllowed(options.row.data),
                    },
                    {
                        name: 'delete',
                        visible: (options) => isEditingAllowed(options.row.data),
                    },
                ]}
            />
        </DataGrid>
    );
}
export default CommentList