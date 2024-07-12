import { useState, useEffect, useRef, useCallback} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "devextreme-react/button";
import ApiRequest from "utils/ApiRequest";
import CustomTable from "components/unit/CustomTable";
import { Workbook } from "exceljs";
import { exportDataGrid } from "devextreme/excel_exporter";
import { saveAs } from 'file-saver';

import TimeExpenseClosingListJson from "./TimeExpenseClosingListJson.json";
import { useModal } from "../../components/unit/ModalContext";

const TimeExpenseClosingList = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const props = location.state.props;
    const [values, setValues] = useState([]);
    const {keyColumn, columns, summaryColumn} = TimeExpenseClosingListJson;
    const { handleOpen } = useModal();

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
            handleOpen("마감 취소에 성공하셨습니다")
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
            customizeCell: ({ gridCell, excelCell }) => {
                // 모든 셀의 테두리를 검은색으로 지정
                excelCell.border = {
                    top: { style: 'thin', color: { argb: 'FF000000' } },
                    left: { style: 'thin', color: { argb: 'FF000000' } },
                    bottom: { style: 'thin', color: { argb: 'FF000000' } },
                    right: { style: 'thin', color: { argb: 'FF000000' } }
                };

                // 헤더를 제거
                if (gridCell.rowType === 'header') {
                    gridCell.skip = true;
                }
            },
        }).then(() => {
            worksheet.spliceRows(1, 1);

            worksheet.eachRow((row, rowIndex) => {
                row.getCell('G').value = row.getCell('E').value;
                row.getCell('E').value = null;
                row.getCell('F').value = null;
                row.getCell('G').border = {
                    top: { style: 'thin', color: { argb: 'FF000000' } },
                    left: { style: 'thin', color: { argb: 'FF000000' } },
                    bottom: { style: 'thin', color: { argb: 'FF000000' } },
                    right: { style: 'thin', color: { argb: 'FF000000' } }
                };

                // 원래 E와 F 셀에도 테두리 추가
                row.getCell('E').border = {
                    top: { style: 'thin', color: { argb: 'FF000000' } },
                    left: { style: 'thin', color: { argb: 'FF000000' } },
                    bottom: { style: 'thin', color: { argb: 'FF000000' } },
                    right: { style: 'thin', color: { argb: 'FF000000' } }
                };

                row.getCell('F').border = {
                    top: { style: 'thin', color: { argb: 'FF000000' } },
                    left: { style: 'thin', color: { argb: 'FF000000' } },
                    bottom: { style: 'thin', color: { argb: 'FF000000' } },
                    right: { style: 'thin', color: { argb: 'FF000000' } }
                };
            });

            // 각 열의 최대 너비를 계산하여 설정
            worksheet.columns.forEach(column => {
                let maxLength = 10; // 최소 너비 설정
                column.eachCell({ includeEmpty: true }, cell => {
                    const columnLength = cell.value ? cell.value.toString().length : 10;
                    if (columnLength > maxLength) {
                        maxLength = columnLength;
                    }
                });
                column.width = maxLength + 2; // 약간의 여백 추가
            });

            worksheet.pageSetup = {
                paperSize: 9, // A4
                fitToWidth: 1,
                fitToHeight: 0,
                margins: {
                    left: 0.25,   // 왼쪽 여백
                    right: 0.25,  // 오른쪽 여백
                    top: 0.25,    // 위쪽 여백
                    bottom: 0.25, // 아래쪽 여백
                    header: 0.1,  // 헤더 여백
                    footer: 0.1   // 풋터 여백
                },
                scale: 75,
            };

            workbook.xlsx.writeBuffer().then((buffer) => {
                saveAs(new Blob([buffer], { type: 'application/octet-stream' }), '근무시간 경비 통합승인내역' + props.aplyYm+'-'+props.aplyOdr + '.xlsx');
            });
        });

        e.cancel = true; // 기본 동작 취소
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
