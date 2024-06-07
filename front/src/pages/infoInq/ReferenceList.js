import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiRequest from "../../utils/ApiRequest";
import NoticeJson from "../infoInq/NoticeJson.json";
import SearchInfoSet from 'components/composite/SearchInfoSet';
import CustomEditTable from "components/unit/CustomEditTable";

const ReferenceList = () => {
    const { keyColumn, queryId, tableColumns, searchInfo, referInsertPage } = NoticeJson;
    const [ values, setValues ] = useState([]);
    const [ param, setParam ] = useState({});
    const [ totalItems, setTotalItems ] = useState(0);
    const [ isLoading, setIsLoading ] = useState(false);
    const navigate = useNavigate();
    
    useEffect(() => {
        if (!Object.values(param).every((value) => value === "")) {
            pageHandle();
        }
    }, [param]);

    const searchHandle = async (initParam) => {
        setParam({
            ...initParam,
            type: 'refer',
            queryId: queryId
        });
    };

    const pageHandle = async () => {
        setIsLoading(true);
        try {
            const response = await ApiRequest("/boot/common/queryIdSearch", param);
            
            if (response.length !== 0) {
                setValues(response);
                setTotalItems(response[0].totalItems);               
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
        navigate("/infoInq/ReferenceDetail", {state: { id: e.key }});
    };

    return (
        <div className="container">
            <div className='title'>자료실</div>
            <div className='title-desc'>* 자료실을 조회합니다.</div>
            <div style={{ marginBottom: "20px" }}>
                <SearchInfoSet 
                    props={searchInfo}
                    insertPage={referInsertPage}
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
export default ReferenceList;