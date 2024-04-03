import React, { useState, useEffect } from "react";
import elecAtrzManageJson from "./ElecAtrzManageJson.json";
import SearchInfoSet from "components/composite/SearchInfoSet";
import CustomTable from "components/unit/CustomTable";
import { Tooltip } from "devextreme-react";
import ApiRequest from "utils/ApiRequest";
import "../elecAtrz/ElecAtrz.css";
import { useCookies } from "react-cookie";

const ElecAtrzManage = () => {
    //========================선언구간=======================//
    const [cookies] = useCookies(["userInfo", "userAuth"]); 
    const empId = cookies.userInfo.empId;   //화면테스트 위해 작성 필요없을 시 삭제 예정
    const { keyColumn, queryId, countQueryId, baseColumns, progress, terminatedAprvrEmp, deny, atrzSquareList, searchInfo } = elecAtrzManageJson.elecManageMain;
    const [searchParam, setSearchParam] = useState({keyColumn : keyColumn, queryId : queryId});
    const [totalCount, setTotalCount] = useState([]);
    const [searchList, setSearchList] = useState([]);
    const [columnTitle, setColumnTitle]= useState(baseColumns.concat(progress));
    const [searchSetVisible, setSearchSetVisivle] = useState(false);
    const [clickBox, setClickBox] = useState([]);

    //페이징
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    //======================================================//

    //======================================================//
    useEffect(() => {
        pageHandle();
    }, []);
    
    useEffect(() => {
        //전자결재 조회
        getAtrz();
    }, [searchParam])
    
    //======================================================//

    //======================조회 이벤트======================//
    const pageHandle = async () => {
        const countParam = {
            queryId : countQueryId,
            empId: empId
        }
        const atrzParam = {
            keyColumn : keyColumn,
            queryId : queryId
        }
        try{
            const cntResp = await ApiRequest('/boot/common/queryIdSearch', countParam)
            const atrzResp = await ApiRequest('/boot/common/queryIdSearch', atrzParam)
            
            setTotalCount(cntResp);
            setSearchList(atrzResp);
        } catch(error) {
            console.log('error', error)
        }
    }
    
    //SearchInfoSet 검색
    const searchHandle = (initParam) => {
        setSearchParam({
          ...searchParam,
          ...initParam
        })
    }

    //전자결재 조회
    const getAtrz = async () => {
        console.log("searchParam : ", searchParam);
        try{
            const response = await ApiRequest('/boot/common/queryIdSearch', searchParam)
            console.log("getAtrz", response);
            setSearchList(response)
        } catch(error) {
            console.log(error)
        }
    };
    
    const getList = ({keyNm}) => {
        keyNm !== "progress" ? setSearchSetVisivle(true) : setSearchSetVisivle(false);
        setClickBox(keyNm)
        setColumnTitle(
            baseColumns.concat(elecAtrzManageJson.elecManageMain[keyNm])
        )
    }
    //======================================================//

    const ElecSquare = ({keyNm, atrzSquare}) => {
        return (
            <div id={keyNm} onClick={() => getList({keyNm})} style={(clickBox === keyNm) ? { backgroundColor: '#4473a5', color: 'white' } : { backgroundColor: atrzSquare.squareColor }} className='elec-square' >
                <div className="elec-square-text" style={{ color: (atrzSquare.text) && 'white' }}>{atrzSquare.text}</div>
                <div className="elec-square-count" style={{ color: (atrzSquare.text) && 'white' }}>
                  {totalCount.length !== 0 && (totalCount[0][keyNm] === 0 ? 0 : <span>{totalCount[0][keyNm]}</span> )} 건
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="title p-1" style={{ marginTop: "20px", marginBottom: "10px" }} ></div>
            <div className="col-md-10 mx-auto" style={{ marginBottom: "20px", display: 'flex' }}>
                <h3>전자결제(관리자)</h3>
            </div>

            <div className="elec-container">
                {atrzSquareList.map((atrzSquare) => (
                    <ElecSquare
                        keyNm = {atrzSquare.key}
                        atrzSquare={atrzSquare}
                    />
                ))}
            </div>

            <div style={{ marginTop: "20px"}}>
                <div style={{marginBottom: '15px'}}>
                    {searchSetVisible ? <SearchInfoSet callBack={searchHandle} props={searchInfo}/> : null}
                </div>
                <CustomTable
                  keyColumn={keyColumn}
                  values={searchList}
                  columns={columnTitle}
                  //paging={true}
                />
            </div>
        </div>
    );
} 

export default ElecAtrzManage;