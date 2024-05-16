import CustomEditTable from 'components/unit/CustomEditTable';
import SysMng from './SysMngJson.json'
import EmpJson from '../infoInq/EmpListJson.json'
import SearchInfoSet from 'components/composite/SearchInfoSet';
import { useEffect, useState } from 'react';
import ApiRequest from 'utils/ApiRequest';

const EmpAuth = () => {
    const { keyColumn, tableColumns, tbNm, ynVal } = SysMng.empAuthJson;
    const { searchInfo } = EmpJson;
    const [ values, setValues ] = useState([]);
    const [ param, setParam ] = useState({});
    const [ totalItems, setTotalItems ] = useState(0);
    const [ isLoading, setIsLoading ] = useState(false);

    useEffect(() => {
        if (!Object.values(param).every((value) => value === "")) {
            pageHandle();
        }
    }, [param]);

    const searchHandle = async (initParam) => {
        setParam({
            ...initParam,
            queryId: "sysMngMapper.authCdList"
        });
    };

    const handleYnVal = async (e) => {
        let param = [
            { tbNm: "USER_AUTHRT" },
            { empId: e.key.empId, authrtCd: e.name }
        ]
        const response = ApiRequest(e.data.useYn === 'Y' ? '/boot/common/commonInsert' : '/boot/common/commonDelete', param);
        console.log('response', response)
    };

    const pageHandle = async () => {
        setIsLoading(true);
        try {
            const response = await ApiRequest("/boot/common/queryIdSearch", param);
            if (response.length !== 0) {
                setValues(response);
                setTotalItems(response[0].totalItems);
            } else {
                setTotalItems(0);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="col-md-10 mx-auto" style={{ marginTop: "20px", marginBottom: "10px" }}>
                <h1 style={{ fontSize: "30px" }}>접근권한관리</h1>
            </div>
            <div className="col-md-10 mx-auto" style={{ marginBottom: "10px" }}>
                <span>* 직원정보를 조회 합니다.</span>
            </div>
            <div style={{ marginBottom: "50px" }}>
                <SearchInfoSet callBack={searchHandle} props={searchInfo} />
                <div style={{marginTop: '20px', marginLeft: '20px'}}>검색된 건 수 : {totalItems} 건</div>
            </div>

            {isLoading ? <></> : 
                <CustomEditTable
                    tbNm={tbNm}
                    keyColumn={keyColumn}
                    values={values}
                    columns={tableColumns}
                    noEdit={true}
                    ynVal={ynVal}
                    handleYnVal={handleYnVal}
                    noDataText={'데이터가 없습니다'}
                /> }
            
        </div>
    )
};
export default EmpAuth;