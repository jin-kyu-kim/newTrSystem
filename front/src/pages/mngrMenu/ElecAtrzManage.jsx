import React, { useState, useEffect } from "react";
import elecAtrzManageJson from "./ElecAtrzManageJson.json";
import SearchInfoSet from "components/composite/SearchInfoSet";
import CustomTable from "components/unit/CustomTable";
import { Tooltip } from "devextreme-react";
import ApiRequest from "utils/ApiRequest";

const ElecAtrzManage = () => {
    //========================선언구간=======================//
    const { keyColumn, queryId, baseColumns, atrzSquareList, searchInfo } = elecAtrzManageJson.elecManageMain;
    const [param, setParam] = useState({}); //searchParam
    const [totalCount, setTotalCount] = useState([]);
    const [searchList, setSearchList] = useState([]);
    //======================================================//

    //=====================화면호출시init====================//
    useEffect(() => {
        getAllCount();
    }, []);

    useEffect(() => {
        const param = {
            keyColumn : keyColumn,
            queryId : queryId
        }

        const getAtrz = async() => {
            try{
                const response = await ApiRequest('/boot/common/queryIdSearch', param)
                setSearchList(response)
            } catch(error) {
                console.log(error)
            }
        }
    },[param])
    //======================================================//

    //======================조회 이벤트======================//
    //건수 조회 
    const getAllCount = async() => {
        try{
            const response = await ApiRequest('/boot/common/queryIdSearch', {})
            setTotalCount(response);
        } catch(error) {
            console.log('error', error)
        }
    }

    //SearchInfoSet 검색
    const searchHandle = async (initParam) => {
        setParam({
            ...param,
            ...initParam
        })
    }
    //======================================================//
    const ElecSquare = ({key, atrzSquare}) => {
        return (
            <div id={key} style={{  marginTop: "20px", backgroundColor: atrzSquare.squareColor }} className='elec-square' >
                <div className="elec-square-text" style={{ color: (atrzSquare.text) && 'white' }}>{atrzSquare.text}</div>
                <div className="elec-square-count" style={{ color: (atrzSquare.text) && 'white' }}>
                  {} 건
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="title p-1" style={{ marginTop: "20px", marginBottom: "10px" }} ></div>
            <div className="col-md-10 mx-auto" style={{ marginBottom: "20px", display: 'flex' }}>
                <h3>전자결재(관리자)</h3>
            </div>

            <div className="elec-container">
                {atrzSquareList.map((atrzSquare, index) => (
                    <ElecSquare
                        key={atrzSquare.key}
                        atrzSquare={atrzSquare}
                    />
                ))}
            </div>

            <div style={{ marginTop: "20px"}}>
                <div style={{marginBottom: '15px'}}><SearchInfoSet callBack={searchHandle} props={searchInfo}/></div>
                <CustomTable
                  keyColumn={keyColumn}
                  values={searchList}
                  columns={baseColumns}
                />
            </div>
        </div>
    );
} 

export default ElecAtrzManage;