import React, {useEffect, useState} from "react";
import CustomTable from "../../components/unit/CustomTable";
import Json from "./ProjectExpenseJson.json"
import ApiRequest from "../../utils/ApiRequest";
import {useCookies} from "react-cookie";
import DataGrid, {Column} from "devextreme-react/data-grid";
import {Button} from "devextreme-react";

const ProjectExpenseCell = () => {
    const {keyColumn, columnCharge} = Json;
    const [values, setValues] = useState([]);
    const [charge, setCharge] = useState([]);
    const [pageSize] = useState(10);
    const [cookies] = useCookies([]);
    let aplyDate = null;

    useEffect(() => {
        let now = new Date();
        let dateNum = Number(now.getDate());
        if(dateNum <= 15){
            let firstDayOfMonth = new Date( now.getFullYear(), now.getMonth() , 1 );
            let lastMonth = new Date ( firstDayOfMonth.setDate( firstDayOfMonth.getDate() - 1 ) );
            aplyDate = {
                "aplyYm": lastMonth.getFullYear()+('0' + (lastMonth.getMonth()+1)).slice(-2),
                "aplyOdr": 2
            }
        } else if (16 <= dateNum){
            aplyDate = {
                "aplyYm": now.getFullYear()+('0' + (now.getMonth()+1)).slice(-2),
                "aplyOdr": 1
            }
        }
    }, []);

    useEffect(() => {
        searchValue();
    }, [aplyDate]);

    const searchValue = async () => {
        try{
            const param = {
                queryId: "projectExpenseMapper.retrievePrjctCtAplyList",
                empId: cookies.userInfo.empId,
                aplyYm: aplyDate?.aplyYm,
                aplyOdr: aplyDate?.aplyOdr
            };
            const response = await ApiRequest("/boot/common/queryIdSearch", param);

            const tempCharge = [];
            response.forEach((value) => {
                if(value?.elctrnAtrzId != null){
                    tempCharge.push(value);
                }
            });
            setCharge(tempCharge);
            setValues(response);
        } catch (e) {
            console.log(e);
        }
    };

    const deleteValue = (e) => {
        const confirmResult = window.confirm("삭제하시겠습니까?");
        if (confirmResult) {

        }
    }

    const statusCell = (cell) => {
        if(cell.data.atrzDmndSttsCd === "VTW03704"){
            return (<div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                <div>
                    {cell.data.atrzDmndSttsCdNm}
                </div>
                <Button
                    icon="clearsquare"
                    style={{border: "none"}}
                    onClick={() => deleteValue(cell)}
                />
            </div>
            );
        }else{
            return (<div>
                {cell.data.atrzDmndSttsCdNm}
            </div>);
        }
    }

    return (
        <div>
            <div className="mx-auto" style={{marginTop: "20px", marginBottom: "30px"}}>
                <h1 style={{fontSize: "30px"}}>프로젝트비용</h1>
            </div>
            <p>* TR 청구 내역</p>
            <DataGrid dataSource={values} showBorders={true} style={{marginBottom: "20px"}}
                      onCellPrepared={(e) => {
                          if (e.rowType === 'header') {
                              e.cellElement.style.textAlign = 'center';
                              e.cellElement.style.fontWeight = 'bold';
                              e.cellElement.style.color = 'black';
                          }
                      }}
            >
                <Column dataField="ctAtrzSeCdNm" caption="구분" alignment="center"/>
                <Column dataField="utztnDt" caption="사용일시" alignment="center"/>
                <Column dataField="useOffic" caption="사용처" alignment="center"/>
                <Column dataField="utztnAmt" caption="금액" alignment="center"/>
                <Column dataField="prjctNm" caption="프로젝트" alignment="center"/>
                <Column dataField="expensCdNm" caption="비용코드" alignment="center"/>
                <Column dataField="ctPrpos" caption="상세내역(목적)" alignment="center"/>
                <Column dataField="atdrn" caption="용도(참석자명단)" alignment="center"/>
                <Column caption="결재상태" cellRender={statusCell} alignment="center"/>
            </DataGrid>

            <p>* 전자결재 청구 내역</p>
            <CustomTable
                keyColumn={keyColumn}
                pageSize={pageSize}
                columns={columnCharge}
                values={charge}
                paging={true}
            />
        </div>
    );
};

export default ProjectExpenseCell;