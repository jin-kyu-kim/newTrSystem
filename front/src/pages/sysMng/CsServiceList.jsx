import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiRequest from "../../utils/ApiRequest";
import CsServiceJson from "../sysMng/CsServiceJson.json";
import SearchInfoSet from 'components/composite/SearchInfoSet';
import CustomEditTable from "components/unit/CustomEditTable";

const CsServiceList = () => {
    const [ values, setValues ] = useState([]);
    const [ totalItems, setTotalItems ] = useState(0);
    const [ isLoading, setIsLoading ] = useState(false);
    const navigate = useNavigate();
    const { keyColumn, queryId, tableColumns, searchInfo, systemInsertPage } = CsServiceJson;
    const [ param, setParam ] = useState({});


    useEffect(() => {
            pageHandle();
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

            if (response.length !== 0) {
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

    return (
        <div className="container">
            <div className="title p-1" style={{ marginTop: "20px", marginBottom: "10px" }} >
                <h1 style={{ fontSize: "40px" }}>오류신고게시판</h1>
            </div>
            <div className="col-md-10 mx-auto" style={{ marginBottom: "10px" }}>
                <span>* 오류신고를 조회합니다.</span>
            </div>
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
                noDataText={'등록된 게시글이 없습니다.'}
            /> }
        </div>
    );
}
export default CsServiceList;