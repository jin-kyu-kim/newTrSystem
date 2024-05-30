import { useEffect, useState, } from "react";

import EmpVacUseListJson from "./EmpVacUseListJson.json";
import ApiRequest from "../../utils/ApiRequest";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "devextreme-react/button";
import DataGrid, { Column, Pager, Paging, Summary, TotalItem, Export} from "devextreme-react/data-grid";
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import { exportDataGrid } from 'devextreme/excel_exporter';
import Box, {Item} from "devextreme-react/box"
import CustomDateRangeBox from "../../components/unit/CustomDateRangeBox";
import AutoCompleteName from "../../components/unit/AutoCompleteName";
import CustomTable from "components/unit/CustomTable";
import SearchInfoSet from "components/composite/SearchInfoSet";

const EmpVacUseList = (callBack,props) => {

    const [values, setValues] = useState([]);
    const [param, setParam] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [initParam, setInitParam] = useState({     
      vcatnBgngYmd: null, //시작일자
      vcatnEndYmd: null, //끝일자
      empno: null,  // 사번
    });
    
    //=============== JSON데이터 넣어두기=======================================
    const {keyColumn, queryId, tableColumns, searchInfo} = EmpVacUseListJson;
    
    //=============== 조회=======================================
    useEffect(() => {
      setParam ({
        queryId : queryId
      }) 
    }, []);
    
    useEffect(() => {
        if(!Object.values(param).every((value) => value === "")) {
            pageHandle();
        };
        
    }, [param]);

    //=============== 검색 조회=======================================
    const searchHandle = async (initParam) => {
      console.log(initParam);
        setParam({
            ...initParam,
            queryId: queryId,
        });
    }


    //============== 정보 검색해오기(Back단으로 정보던지기)===========================================
    const pageHandle = async () => {
        try {
            const response = await ApiRequest("/boot/common/queryIdSearch", param);
            setValues(response);

            if (response.length !== 0) {
                setTotalPages(Math.ceil(response[0].totalItems / pageSize));
                setTotalItems(response[0].totalItems);
            } else {
                setTotalPages(1);
            }
        } catch (error) {
            console.log(error);
        }
    };
    //============== 데이터그리드 엑셀로 내보내기===========================================
    const onExporting = (e) => {
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('Main sheet');
        exportDataGrid({
          component: e.component,
          worksheet,
          autoFilterEnabled: true,
        }).then(() => {
          workbook.xlsx.writeBuffer().then((buffer) => {
            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), '휴가사용내역.xlsx');
          });
        });
      };
    //============== 서치셋 세팅============================================
  
    
    const handleStartDateChange = (newStartDate) => {
   
      // 시작일자가 변경될 때 수행할 로직 추가
      
      setInitParam({ 
        ...initParam,
        vcatnBgngYmd: newStartDate,
      });
    };
    const handleEndDateChange = (newEndDate) => {

      // 종료일자가 변경될 때 수행할 로직 추가
      
      setInitParam({
        ...initParam,
        vcatnEndYmd: newEndDate
      });
    };
  
  // 성명변환
  const handleChgEmp = (selectedOption) => {
    setInitParam({
      ...initParam,
      empno: selectedOption,
    });
  };
  
    const handleSubmit = () => {
      setParam({
        vcatnBgngYmd: initParam.vcatnBgngYmd, //시작일자
        vcatnEndYmd: initParam.vcatnEndYmd, //끝일자
        empno: initParam.empno,  // 사번
        queryId: queryId,
        currentPage: currentPage,
      })
      //callBack(initParam);
    };
  
    
    //============== 테이블 그리기===========================================
    const gridRows = () => {
      const result = [];
      for(let i = 0; i < tableColumns.length; i++) {
          const { key, value, width, alignment, button } = tableColumns[i];
          if(button) {
            result.push(
              <Column 
                key={key} 
                dataField={key} 
                caption={value} 
                width={width} 
                alignment={alignment || 'center'}
                cellRender={() => buttonRender(button)}>
              </Column>
          );
          } else {
            result.push(
                <Column 
                  key={key} 
                  dataField={key} 
                  caption={value} 
                  width={width} 
                  alignment={alignment || 'center'}>
                </Column>
            );
          }
      }
      return result;
    }

    const buttonRender = (button) => {
      return(
        <Button text={button}/>
      )
      }
    //===========화면 그리는 부분================================================
    return (
            <div style={{ marginLeft: "1%", marginRight: "1%" }}>
            <div className="mx-auto" style={{ marginTop: "20px", marginBottom: "10px" }}>
                  <h1 style={{ fontSize: "30px" }}>휴가사용내역</h1>
            </div>
            <div className="mx-auto" style={{ marginBottom: "10px" }}>
                  <span>* 휴가사용내역을 조회합니다.</span>
            </div>
            {/*----------------서치셋 구간---------------------------------------------------------------- */}
            <div className="box_search" style={{ marginBottom: "20px" }} width="60%" >
            <SearchInfoSet callBack={searchHandle} props={searchInfo} />
            </div>
            {/*----------------서치셋 구간---------------------------------------------------------------- */}
            <div>
                검색된 건 수 : {totalItems} 건
            </div>
            {/*----------------테이블 구간---------------------------------------------------------------- */}
                <CustomTable keyColumn={keyColumn} columns={tableColumns} values={values} paging={true} excel={true} onExcel={onExporting}/> 
            {/*----------------테이블 구간---------------------------------------------------------------- */}   
        </div>
    );
};

export default EmpVacUseList;