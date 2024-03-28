import { useState, useEffect, useRef } from "react";
import SysMng from './SysMngJson.json';
import ApiRequest from '../../utils/ApiRequest';
import SearchInfoSet from "components/composite/SearchInfoSet"
import CustomEditTable from "components/unit/CustomEditTable";
import '../../pages/sysMng/sysMng.css'

const TrsCodeList = () => {
    const [ values, setValues] = useState([]);
    const [ param, setParam ] = useState({});
    const [ childList, setChildList ] = useState({});
    const [ child, setChild ] = useState('');
    const [ totalItems, setTotalItems ] = useState(0);
    const { keyColumn, queryId, tableColumns, childTableColumns, searchInfo, tbNm } = SysMng.trsCodeJson;

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
            } else setTotalItems(0);
        } catch (error) {
            console.log(error);
        }
    };

    const handleYnVal = async (e) => {
        const ynParam = [
            { tbNm: "CD" },
            e.data,
            { cdValue: e.key }
        ];
        try {
            const response = await ApiRequest('/boot/common/commonUpdate', ynParam);
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getChildList(child);
    }, [child])

    const getChildList = async (key) => {
        try {
            const response = await ApiRequest('/boot/common/commonSelect', [
                { tbNm: "CD" }, { upCdValue: key }
            ]);
            setChildList(response)
        } catch (error) {
            console.log('error', error)
        }
    }

    const masterDetail = (e) => {
        setChild(e.data.key)
        return (
            <CustomEditTable
                tbNm={tbNm}
                values={childList}
                keyColumn={keyColumn}
                removeAdd={true}
                columns={childTableColumns}
                handleYnVal={handleYnVal}
            />
        );

    };

    return (
        <div className="container">
            <div className="title p-1" style={{ marginTop: "20px", marginBottom: "10px" }} >
                <h1 style={{ fontSize: "40px" }}>코드 관리</h1>
            </div>
            <div className="col-md-10 mx-auto" style={{ marginBottom: "10px" }}>
                <span>* 권한코드를 조회합니다.</span>
            </div>
            <div style={{ marginBottom: "20px" }}>
                <SearchInfoSet callBack={searchHandle} props={searchInfo} upCdList={values} />
            </div>

            <div>검색된 건 수 : {totalItems} 건</div>
            <CustomEditTable
                tbNm={tbNm}
                values={values}
                allowEdit={true}
                keyColumn={keyColumn}
                columns={tableColumns}
                masterDetail={masterDetail}
                handleYnVal={handleYnVal}
                callback={pageHandle}
            />
        </div>
    );
}
export default TrsCodeList;