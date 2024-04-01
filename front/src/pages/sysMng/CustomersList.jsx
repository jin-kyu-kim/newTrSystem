import { useState, useEffect } from "react";
import SearchInfoSet from 'components/composite/SearchInfoSet';
import CustomEditTable from 'components/unit/CustomEditTable';
import ApiRequest from '../../utils/ApiRequest';
import SysMng from './SysMngJson.json';

const CustomersList = () => {
    const [values, setValues] = useState([]);
    const [param, setParam] = useState({});
    const [totalItems, setTotalItems] = useState(0);
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
        try {
            const response = await ApiRequest("/boot/common/queryIdSearch", param);
            setValues(response);
            if (response.length !== 0) {
                setTotalItems(response[0].totalItems);
            } else {
                setTotalItems(0);
            }
        } catch (error) {
            console.log(error);
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
            if(response === 1) pageHandle();
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
                <CustomEditTable
                    tbNm={tbNm}
                    ynVal={ynVal}
                    values={values}
                    keyColumn={keyColumn}
                    columns={tableColumns}
                    handleYnVal={handleYnVal}
                    callback={pageHandle}
                  />
            </div>
        </div>
    );
};
export default CustomersList;