import React, { useEffect, useState, useCallback } from "react";
import CustomTable from "../../../components/unit/CustomTable";
import ElecAtrzMatrlCtDetailJson from "./ElecAtrzMatrlCtDetailJson.json";
import ApiRequest from "utils/ApiRequest";

import { Popup } from "devextreme-react/popup";
import PymntPlanPopup from "./PymntPlanPopup"
import DataGrid, {
    Column,
    Scrolling
  } from "devextreme-react/data-grid";


const ElecAtrzCtrtInfoDetail = ({data, prjctId}) => {
    const {keyColumn, tableColumns} = ElecAtrzMatrlCtDetailJson;
    const [popupVisible, setPopupVisible] = useState(false);
    const [resultDates, setResultDates] = useState([]);
    const [tableData, setTableData] = useState([{matrlCtSn: 0}]);
    const test = [{'2024.03': "뭐야"}];  //그리드 기본 값

    useEffect(async() => {
        const param = [
            { tbNm : "PRJCT" },
            { prjctId : prjctId }];
        try{
            const response = await ApiRequest("/boot/common/commonSelect", param);
            const ctrtYmd = response[0].ctrtYmd;
            const stbleEndYmd = response[0].stbleEndYmd;

            function parseDate(str) {
                const year = parseInt(str.substring(0, 4), 10);
                const month = parseInt(str.substring(4, 6), 10) - 1; // 자바스크립트는 월이 0부터 시작
                const day = parseInt(str.substring(6, 8), 10);
                return new Date(year, month, day);
            }

            const startDate = parseDate(ctrtYmd);
            const endDate = parseDate(stbleEndYmd);
            
            let currentDate = new Date(startDate);
            let result=[];
            while (currentDate <= endDate) {

                const yearMonth = currentDate.toISOString().substring(0, 7).replace('-', '.');
                if (!resultDates.includes(yearMonth)) {
                    result.push(yearMonth);
                }
                currentDate.setMonth(currentDate.getMonth() + 1);
            }
            setResultDates(result);

        }catch(error){
            console.error(error);
        }
    },[]);

    useEffect(() => {
        console.log(popupVisible);
    }, [popupVisible]);

    useEffect(() => {
        console.log(tableData);
    }, [tableData]);



    /**
     *  Table 버튼 handling
     */
    const handlePopupVisible = useCallback((button, data) => {
        if(button.name === "insert") {
            setPopupVisible(prev => !prev);
        }else if(button.name === "delete"){
            console.log("삭제!!!!!!!!!!", data);
        }       
    },[popupVisible]);

    const toglePopupVisible = useCallback(() => {
        setPopupVisible(prev => !prev);
    },[]);


    /**
     * 그리드 컬럼 동적추가
     */
    // useEffect(() => {
    //     gridRows();
    // }, [resultDates]);

    const gridRows = () => {
        const result = [];
        console.log("resultDates", resultDates);
        result.push(
            <Column
            key={"total"}
            dataField={"총액"}
            caption={"총액"}
            alignment={"center"}
            fixed={true}
            /> 
        );
        resultDates.map((data) => {
            result.push(
                <Column
                    key={data}
                    dataField={data}
                    caption={data}
                    alignment={"center"}
                    fixed={false}
                    />
            );
        });
        return result;
    };

    const handlePopupData = (data) => {
        console.log("handlePopupData", data);
        data.matrlCtSn = 1;     //TODO. 증가값으로 바꿔야함. 
        setTableData(prev => [...prev, data]);
    }

    

    /**
     *  화면 표출
     */
    return (
        <div className="elecAtrzNewReq-ctrtInfo">
            <DataGrid
                dataSource={test}
                width="100%"
                height="100%"
                columnAutoWidth={true}
                >
                {gridRows()}
                <Scrolling columnRenderingMode="standard" />
            </DataGrid>

           <CustomTable
            keyColumn={keyColumn}
            columns={tableColumns}
            values={tableData}
            pagerVisible={false}
            summary={false}
            onClick={handlePopupVisible}
            />

            <Popup
                width="80%"
                height="80%"
                visible={popupVisible}
                // onHiding={toglePopupVisible}
                showCloseButton={false}
                title="지불 계획 입력"
            >
                <PymntPlanPopup prjctId={prjctId} handlePopupVisible={toglePopupVisible} handlePlanData={handlePopupData}/>
            </Popup>
        </div>
    );

}
export default ElecAtrzCtrtInfoDetail;