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
    const [ isLoading, setIsLoading ] = useState(false);

    useEffect(() => {
        if (!Object.values(param).every((value) => value === "")) {
            pageHandle();
        }
    }, []);

    const searchHandle = async (initParam) => {
        setParam({
            ...initParam,
            tbNm: tbNm
        });
    };

    const handleYnVal = async (e) => {
        const ynParam = [{ tbNm: "CD" }, e.data, { cdValue: e.key }];
        const response = await ApiRequest("/boot/common/commonUpdate", ynParam);
    };

    const pageHandle = async () => {
        setIsLoading(true);
        try {
            const response = await ApiRequest("/boot/common/commonSelect", param);
            console.log('res', response)

            if (response.length !== 0) {
                setValues(response);
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
            <div style={{ marginBottom: "20px" }}>
                <SearchInfoSet callBack={searchHandle} props={searchInfo} />
            </div>

            {isLoading ? <></> : 
                <CustomEditTable
                tbNm={tbNm}
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