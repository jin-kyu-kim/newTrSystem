import React, {useEffect, useState} from "react";
import CommentList from "../../components/unit/CommentList";
import ApiRequest from "../../utils/ApiRequest";
import notify from 'devextreme/ui/notify';

const CsServiceReply = (gridId) => {
    const [ comments, setComments ] = useState([]);
    const errId = gridId.errId
    const param = {queryId: 'sysMngMapper.retrieveErrReply' , errId : errId}
    
    useEffect(() => { getReply(); }, []);

    const changeData = async (e, editMode) => {
        let response;
        let infoMsg = '동작실패';

        if (editMode === 'Insert') {
            response = await ApiRequest("/boot/common/commonInsert", [{ tbNm: "ERR_MNG_DTL", snColumn:"ERR_DTL_SN",snSearch: {errId}}
                , {errId : errId, dtlAnswer:e.data.dtlAnswer}]);
            infoMsg = '등록 성공!';
        } else if (editMode === 'Update') {
            response = await ApiRequest("/boot/common/commonUpdate", [{ tbNm: "ERR_MNG_DTL" }, {dtlAnswer:e.data.dtlAnswer},{errId : errId,errDtlSn:e.data.errDtlSn}]);
            infoMsg = '수정 성공!';
        } else if (editMode === 'Delete') {
            response = await ApiRequest("/boot/common/commonDelete", [{ tbNm: "ERR_MNG_DTL" }, {errId : errId,errDtlSn:e.data.errDtlSn}]);
            infoMsg = '삭제 성공!';
        }

        if (response && response > 0) { // 성공 조건 검사, response 구조에 따라 조정 필요
            notify(infoMsg, 'success', 3000);
            getReply(); // 성공 후 데이터 다시 불러오기
        } else {
            notify('Action failed', 'error', 3000);
        }
    }

    const getReply = async () =>{
        const response = await ApiRequest("/boot/common/queryIdSearch", param);
        setComments(response)
    }

    return (
        <div>
            <CommentList comments={comments} setComments={setComments} changeData={changeData}/>
        </div>
    );
}
export default CsServiceReply;