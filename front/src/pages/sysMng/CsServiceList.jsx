import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiRequest from "../../utils/ApiRequest";
import CsServiceJson from "../sysMng/CsServiceJson.json";
import SearchInfoSet from 'components/composite/SearchInfoSet';
import CustomEditTable from "components/unit/CustomEditTable";

const CsServiceList = () => {
    const { keyColumn, queryId, tableColumns, searchInfo, systemInsertPage } = CsServiceJson;
    const [ values, setValues ] = useState([]);
    const [ totalItems, setTotalItems ] = useState(0);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ param, setParam ] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        if(param.queryId){
            pageHandle();
        }
    }, [param]);

    const searchHandle = async (initParam) => {
        setParam({
            ...initParam,
            queryId: queryId
        });
    };

    const pageHandle = async () => {
        setIsLoading(true);
        try {
            const response = await ApiRequest("/boot/common/queryIdSearch", param);

            if (response) {
                setValues(response);
                setTotalItems(response.length);
            } else {
                setValues([]);
                setTotalItems(0);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    const onRowClick = (e) => {
        navigate("/sysMng/CsServiceDetail", {state: { id: e.key, errPrcsSttsCd : e.data.errPrcsSttsCd, errPrcsSttsCdNm : e.data.errPrcsSttsCdNm }});
    };

    const onCellPrepared = (e) => { // 진행상태 컬럼 색상 변경
        if(e.column.dataField === 'errPrcsSttsCdNm'){
            e.cellElement.style.color = e.data?.errPrcsSttsCd === 'VTW05503' ? 'rgb(22, 22, 247)' 
                : e.data?.errPrcsSttsCd === 'VTW05502' ? '#53a45f' : ''
            e.cellElement.style.fontWeight = ['VTW05501', 'VTW05504'].includes(e.data?.errPrcsSttsCd) ? '' : 'bold'
        }
    }

    return (
        <div className="container">
            <div className="title">오류신고게시판</div>
            <div className="title-desc">* 오류신고를 조회합니다.</div>
            <div style={{ marginBottom: "20px" }}>
                <SearchInfoSet 
                    props={searchInfo}
                    insertPage={systemInsertPage}
                    callBack={searchHandle}
                /> 
            </div>

            <div>검색된 건 수 : {totalItems} 건</div>
            {isLoading ? <></>
            : <CustomEditTable
                noEdit={true}
                values={values}
                columns={tableColumns}
                keyColumn={keyColumn}
                onRowClick={onRowClick}
                onCellPrepared={onCellPrepared}
                noDataText={'등록된 게시글이 없습니다.'}
            /> }
        </div>
    );
}
export default CsServiceList;