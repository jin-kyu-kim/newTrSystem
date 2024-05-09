import { useState, useEffect, useRef, useCallback} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "devextreme-react/button";
import ApiRequest from "utils/ApiRequest";
import CustomTable from "components/unit/CustomTable";
import { Workbook } from "exceljs";
import { exportDataGrid } from "devextreme/excel_exporter";
import { saveAs } from 'file-saver';

import TimeExpenseClosingListJson from "./TimeExpenseClosingListJson.json";

const TimeExpenseClosingList = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const props = location.state.props;
    const [values, setValues] = useState([]);
    const {keyColumn, columns, summaryColumn} = TimeExpenseClosingListJson;

    useEffect(() => {
        retrieveClosingList();
    }, []);

    const retrieveClosingList = async () => {
        const param ={
            queryId: "financialAffairMngMapper.retrieveClosingList",
            aplyYm: props.aplyYm,
            aplyOdr: props.aplyOdr
        }

        try {
            const response = await ApiRequest("/boot/common/queryIdSearch", param);
            setValues(response);
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * 이전페이지
     * 근무시간비용 입력 현황 페이지로 이동
     */
    const toListPage = () => {
        navigate("/fnnrMng/TimeExpenseInsertSttus");
    }

    /**
     * 마감 취소
     * 해당 차수 마감한 것을 취소한다.
     */
    const cancelClose = async () => {
        const confirm = window.confirm("차수 마감을 취소하시겠습니까?");

        if(confirm) {
            // 마감 롤백 Y -> N
           const result =  await cancelCloseAply();
           if(result > 0) {
            alert("마감 취소에 성공하셨습니다")
            navigate("/fnnrMng/TimeExpenseInsertSttus");
           }
        } else {
            return;
        }
        
    }

    const cancelCloseAply = async () => {
        const param = {
          queryId: "financialAffairMngMapper.updateDdlnYn",
          ddlnYn: "N",
          aplyYm: props.aplyYm,
          aplyOdr: props.aplyOdr,
          state: "UPDATE"
        }
    
        try {
          const response = await ApiRequest("/boot/common/queryIdDataControl", param);
          return response
        } catch(error) {
          console.error(error);
        }
      }



    const padNumber = (num) => {
        return num.toString().padStart(2, '0');
    };
    const currentDateTime = new Date();
    const formattedDateTime = `${currentDateTime.getFullYear()}_` + `${padNumber(currentDateTime.getMonth() + 1)}_` + `${padNumber(currentDateTime.getDate())}`

    const onExporting = (e) => {
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('Main sheet');
        exportDataGrid({
            component: e.component,
            worksheet,
            autoFilterEnabled: true,
        }).then(() => {
            workbook.xlsx.writeBuffer().then((buffer) => {
            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), '근무시간 경비 통합승인내역'+formattedDateTime+'.xlsx');
            });
        });
    };


    return (
        <div className="container">
            <div className="" style={{ marginTop: "20px", display: "flex", justifyContent: "flex-start" }}>
                <div style={{ float: "left", marginRight: "auto" }}>
                    <Button onClick={toListPage}>이전페이지</Button>
                </div>
                <div style={{ display: "inline-block" }}>
                    <Button onClick={cancelClose}>마감취소</Button>
                </div>
            </div>
            <div>
                <CustomTable 
                    keyColumn={keyColumn}
                    columns={columns}
                    values={values}
                    summary={true} 
                    summaryColumn={summaryColumn}
                    paging={false}
                    wordWrap={true}
                    excel={true}
                    onExcel={onExporting}
                />
            </div>            
        </div>
    );
};

export default TimeExpenseClosingList;
