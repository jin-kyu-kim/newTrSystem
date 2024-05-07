import { useState, useEffect, useRef, useCallback} from "react";
import { useLocation } from "react-router-dom";
import Button from "devextreme-react/button";
import ApiRequest from "utils/ApiRequest";
import CustomTable from "components/unit/CustomTable";

const TimeExpenseClosingList = () => {

    const location = useLocation();

    const props = location.state.props;

    useEffect(() => {
        console.log(props)
        retrieveClosingList();
    }, []);

    const retrieveClosingList = async () => {
        const param ={
            queryId: "financialAffairMngMapper.retrieveClosingList",
            aplyYm: props.aplyYm,
            aplyOdr: props.aplyOdr
        }
    }

    /**
     * 이전페이지
     * 근무시간비용 입력 현황 페이지로 이동
     */
    const toListPage = async () => {

    }

    /**
     * 엑셀 다운로드
     * 데이터를 엑셀 형태로 다운로드
     */
    const downExcelSheet = async () => {

    }

    /**
     * 마감 취소
     * 해당 차수 마감한 것을 취소한다.
     */
    const cancelClose = async () => {

    }


    return (
        <div className="container">
            <div className="" style={{ marginTop: "20px", display: "flex", justifyContent: "flex-start" }}>
                <div style={{ float: "left", marginRight: "auto" }}>
                    <Button>이전페이지</Button>
                    <Button>엑셀다운로드</Button>
                </div>
                <div style={{ display: "inline-block" }}>
                    <Button>마감취소</Button>
                </div>
            </div>
            <div>
                {/* <CustomTable 
                    keyColumn={keyColumn}
                    columns={tableColumns}
                    values={}
                    paging={false}
                    wordWrap={true}
                /> */}
                
            </div>            
        </div>
    );
};

export default TimeExpenseClosingList;
