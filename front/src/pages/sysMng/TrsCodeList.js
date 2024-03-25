import { useState, useEffect } from "react";
import SysMng from './SysMngJson.json';
import ApiRequest from '../../utils/ApiRequest';
import SearchInfoSet from "components/composite/SearchInfoSet"
import CustomEditTable from "components/unit/CustomEditTable";
import '../../pages/sysMng/sysMng.css'

const TrsCodeList = () => {
    const [ values, setValues ] = useState([]);
    const [ param, setParam ] = useState({});
    const [ childList, setChildList ] = useState([]);

    const [totalItems, setTotalItems] = useState(0);
    const [currentPage] = useState(1);
    const [pageSize] = useState(20);
    const { keyColumn, queryId, tableColumns, childTableColumns, searchInfo, tbNm } = SysMng.trsCodeJson;

    useEffect(() => {
        if (!Object.values(param).every((value) => value === "")) {
            pageHandle();
        }
    }, [param]);

    const searchHandle = async (initParam) => {
        setParam({
            ...initParam,
            queryId: queryId,
            currentPage: currentPage,
            pageSize: pageSize,
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

    const handleYnVal = async (idColumn, useYn) => {
        const ynParam = [
            { tbNm: "CD" },
            { useYn: useYn },
            { cdValue: idColumn }
        ];
        try {
            const response = await ApiRequest('/boot/common/commonUpdate', ynParam);
            setChildList(response)
        } catch (error) {
            console.log(error)
        }
    }

    const getChildList = async (e) => {
        try{
            const response = await ApiRequest('/boot/common/commonSelect', [
                { tbNm: "CD" }, { upCdValue: e.data.cdValue }
            ]);
            setChildList(response)
        } catch(error){
            console.log('error', error)
        }
    }

    const masterDetail = (e) => {
        return (
            <CustomEditTable
                tbNm={tbNm}
                values={childList}
                allowEdit={true}
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
                <h1 style={{ fontSize: "40px" }}>권한코드</h1>
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
                handleYnVal={handleYnVal}
                masterDetail={masterDetail}
                getChildList={getChildList}
            />
        </div>
    );
}
export default TrsCodeList;