import { useState, useEffect } from "react";
import DataGrid, { Column } from 'devextreme-react/data-grid'
import CustomTable from "../../components/unit/CustomTable";
import SearchInfoSet from "components/composite/SearchInfoSet"
import ApiRequest from '../../utils/ApiRequest';
import ToggleButton from './ToggleButton';
import SysMng from './SysMngJson.json';

const TrsCodeList = () => {
    const [values, setValues] = useState([]);
    const [param, setParam] = useState({}); // cud 전달 객체
    const [oneData, setOneData] = useState([]); // 특정 상위코드의 하위목록
    const [selectedRowKey, setSelectedRowKey] = useState(null);

    const [totalItems, setTotalItems] = useState(0);
    const [currentPage] = useState(1);
    const [pageSize] = useState(20);
    const { keyColumn, queryId, tableColumns, childTableColumns, searchInfo } = SysMng.trsCodeJson;

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
            startVal: 0,
            pageSize: pageSize,
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
    const handleYnVal = async (idColumn, useYn) => {
        const ynParam = [
            { tbNm: "CD" },
            { useYn: useYn },
            { cdValue: idColumn } // index2는 id값
        ];
        try {
            const response = await ApiRequest('/boot/common/commonUpdate', ynParam);
        } catch (error) {
            console.log(error)
        }
    }
    const getOneData = async (e) => {
        const upCd = [
            { tbNm: "CD" },
            { upCdValue: e.key }
        ];
        try {
            const response = await ApiRequest('/boot/common/commonSelect', upCd);
            setOneData(response)
        } catch (error) {
            console.log(error)
        }
    }
    const onRowClick = (e) => {
        setSelectedRowKey(e.key);
        getOneData(e);
    }
    const onUpRouUpdate = (e) => {
    }
    return (
        <div className="container">
            <div
                className="title p-1"
                style={{ marginTop: "20px", marginBottom: "10px" }}
            >
                <h1 style={{ fontSize: "40px" }}>권한코드</h1>
            </div>
            <div className="col-md-10 mx-auto" style={{ marginBottom: "10px" }}>
                <span>* 권한코드를 조회합니다.</span>
            </div>
            <div style={{ marginBottom: "20px" }}>
                <SearchInfoSet callBack={searchHandle} props={searchInfo} upCdList={values} />
            </div>

            <div>검색된 건 수 : {totalItems} 건</div>
            <CustomTable
                keyColumn={keyColumn}
                columns={tableColumns}
                values={values}
                handleYnVal={handleYnVal}
                onRowClick={onRowClick}
                pageSize={pageSize}
                paging={true}
            />
            {selectedRowKey && (
                <DataGrid
                    keyExpr={keyColumn}
                    dataSource={oneData}
                >
                    {childTableColumns.map((item) => (
                        item.toggle ?
                            <Column dataField={item.key} caption={item.value}
                                alignment={'center'}
                                cellRender={({ data }) => (
                                    <ToggleButton callback={handleYnVal} data={data} />
                                )}
                            /> :
                            <Column dataField={item.key} caption={item.value}
                                alignment={'center'}
                            />
                    ))}
                </DataGrid>
            )}
        </div>
    );
}
export default TrsCodeList;