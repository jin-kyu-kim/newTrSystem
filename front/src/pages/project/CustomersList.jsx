import { useState, useEffect } from "react";
import SearchInfoSet from 'components/composite/SearchInfoSet';
import CustomEditTable from 'components/unit/CustomEditTable';
import ApiRequest from '../../utils/ApiRequest';
import SysMng from '../sysMng/SysMngJson.json';

const CustomersList = () => {
    const [ values, setValues ] = useState([]);
    const [ param, setParam ] = useState({});
    const [ totalItems, setTotalItems ] = useState(0);
    const [ isLoading, setIsLoading ] = useState(false);
    const { keyColumn, queryId, tableColumns, searchInfo, tbNm, ynVal } = SysMng.customersJson;

    useEffect(() => {
        if (!Object.values(param).every((value) => value === "")) {
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

    const handleYnVal = async (e) => {
        const ynParam = [
            { tbNm: "CTMMNY_INFO" },
            e.data,
            { ctmmnyId: e.key }
        ];
        try {
            const response = await ApiRequest('/boot/common/commonUpdate', ynParam);
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="container">
            <div className="title p-1" style={{ marginTop: "20px", marginBottom: "10px" }} >
                <h1 style={{ fontSize: "40px" }}>고객사 관리</h1>
            </div>
            <div className="col-md-10 mx-auto" style={{ marginBottom: "10px" }}>
                <span>* 고객사를 조회합니다.</span>
            </div>
            <div style={{ marginBottom: "20px" }}>
                <SearchInfoSet callBack={searchHandle} props={searchInfo} />
            </div>

            <div>검색된 건 수 : {totalItems} 건</div>
            <div style={{ marginBottom: '100px' }}>

            {isLoading ? <></>
            : <CustomEditTable
                tbNm={tbNm}
                values={values}
                columns={tableColumns}
                keyColumn={keyColumn}
                callback={pageHandle}
                ynVal={ynVal}
                handleYnVal={handleYnVal}
                noDataText={'등록된 데이터가 없습니다.'}
            /> }
            </div>
        </div>
    );
};
export default CustomersList;