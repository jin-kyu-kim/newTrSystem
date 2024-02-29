import { useState, useEffect, useCallback } from "react";
import ApiRequest from "utils/ApiRequest";
import { Button } from "devextreme-react";
import CustomTable from "components/unit/CustomTable";
import DeptManageJson from  "./DeptManageJson.json";
import SearchHumanResourceMngtSet from "components/composite/SearchHumanResoureceMngSet";
import DeptRegist from "./DeptRegist";
import CustomPopup from "components/unit/CustomPopup";

const DeptManage = ({callBack}) => {
  const [values, setValues] = useState([]);
  const [values2, setValues2] = useState([]);
  const [values3, setValues3] = useState([]);
  const [param, setParam] = useState({});
  const { listQueryId, searchParams, listKeyColumn, listTableColumns,       //부서목록조회 
          downDeptQueryId, downDeptTableColumns,                            //하위부서목록
          hnfQueryId, hnfKeyColumn, hafTableColumns,                        //부서인력목록
          popup } = DeptManageJson; 
  const [deptParam2, setDeptParam2] = useState({});
  const [deptParam3, setDeptParam3] = useState({});

  const [deptInfo, setDeptInfo] = useState([]);
  const [isPopup, setPopup] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [initParam, setInitParam] = useState({});

  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [hnfPageSize, setHnfPageSize] = useState(20);
  const [downDeptPageSize, setDownDeptPageSize] = useState(20);

  // const [readOnly, setReadOnly] = useState(true);

  //========================테이블 배치

  //화면 전체 배치
  const tableContainerStyle = {
    display: "flex",
  };

  //전체 부서 목록 배치
  const deptListContainerStyle = {
    width: "50%", // 왼쪽 영역의 너비를 반으로 설정
    marginTop: "20px",
  };

  const deptListStyle = {
    minWidth: "480px",
  };

  //우측 전체 배치
  const deptDetailContainerStyle = {
    width: "50%", // 오른쪽 영역의 너비를 반으로 설정
    display: "flex",
    flexDirection: "column",
    marginBottom: "20px",
  };

  //각 테이블 배치
  const deptDetailStyle = {
    flex: "1",
    marginLeft: "20px", // 각 div 사이의 간격을 조절합니다.
    marginTop: "40px",
  };

  //버튼 배치
  const buttonContainerStyle = {
    display: "flex",
    justifyContent: 'space-between',
    alignItems: 'center'
  };
  
  //부서 상세 버튼
  const editButtonStyle={
    marginRight:"10px",
    marginBottom:"10px",
  }

  const deleteButtonStyle ={
    marginRight:"20px",
    marginBottom:"10px",
  }

  //인력 추가 버튼
  const addButtonStyle ={
    marginRight:"10px",
    marginBottom:"10px",
  }

  //========================부서 목록 조회
  useEffect(() => {
    if (!Object.values(param).every((value) => value === "")) {
      pageHandle();
    }
  }, [param]);

  const searchHandle = async (initParam) => {
    setTotalPages(1);
    setCurrentPage(1);
    setParam({
      ...initParam,
      queryId: listQueryId,
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
        console.log("건수: " + totalItems);
        setTotalPages(Math.ceil(response[0].totalItems / pageSize));
        setTotalItems(response[0].totalItems);
      } else {
        setTotalItems(0);
        setTotalPages(1);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //========================부서 상세 정보

  // useEffect(() => {
  //   callBack(initParam);
  // }, []);

  //부서 정보 수정 
  const editDept = () => {
    setPopup(true);
  };

  const handleClose = () => {
    setPopupVisible(false);
  };

  const onHide = () => {
    callBack(initParam);
    setPopupVisible(false);
  }
  
  //부서 삭제
  const deleteDept = async () => {
    const isconfirm = window.confirm("이 부서를 삭제하시겠습니까?");

    if (isconfirm) {
      console.log("부서 삭제 : " + deptInfo.deptId);
      // if (response > 0) {
        setDeptInfo([]);
      // }
    }
    
  };


 //========================하위 부서 목록
  const deptDownListHandle = async () => {
    try {
      const response2 = await ApiRequest(
        "/boot/common/queryIdSearch",
        deptParam2
      );
      setValues2(response2);
    } catch (error) {
      console.log(error);
    }
  };

   //========================부서인력 목록
  const deptHnfListHandle = async () => {
    try {
      const response3 = await ApiRequest(
        "/boot/common/queryIdSearch",
        deptParam3
      );
      setValues3(response3);
    } catch (error) {
      console.log(error);
    }
  };


  //부서목록에서 로우 클릭시 발생하는 이벤트
  const onRowDblClick = (e) => {
    for (const value of values) {
      if (value.deptId === e.data.deptId) {
        setDeptInfo(value);
        break;
      }
    }

    setDeptParam2({
      deptId: e.data.deptId,
      queryId: downDeptQueryId,
    });

    setDeptParam3({
      deptId: e.data.deptId,
      queryId: hnfQueryId,
    });
  };

  //setParam 이후에 함수가 실행되도록 하는 useEffect  
  useEffect(() => {
    if (deptParam2.deptId !== undefined) {
      deptDownListHandle();
    }
  }, [deptParam2]);

  useEffect(() => {
    if (deptParam3.deptId !== undefined) {
      deptHnfListHandle();
    }
  }, [deptParam3]);
  
  return (
    <div className="container">
      <div
        className="title p-1"
        style={{ marginTop: "20px", marginBottom: "10px" }}
      >
        <h1 style={{ fontSize: "40px" }}>부서 관리</h1>
      </div>
      <div className="col-md-10 mx-auto" style={{ marginBottom: "10px" }}>
        <span>* 부서를 조회합니다.</span>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <SearchHumanResourceMngtSet
          callBack={searchHandle}
          props={searchParams}
          popup={popup}
        />
      </div>
      <div>검색된 건 수 : {totalItems} 건</div>

      <div className="tableContainer" style={tableContainerStyle}>
        <div className="deptListContainer" style={deptListContainerStyle}>
          <div className="deptListTable" style={deptListStyle}>
            <CustomTable
              keyColumn={listKeyColumn}
              pageSize={pageSize}
              columns={listTableColumns}
              values={values}
              paging={true}
              onRowDblClick={onRowDblClick}
            />
          </div>
        </div>
        <div className="deptDetailContainer" style={deptDetailContainerStyle}>
          <div className="deptDetailTable" style={deptDetailStyle}>
          <div className="detailButtonContainer" style={buttonContainerStyle}> 
            <p>
            <strong>* 부서상세정보 </strong>
            </p>
            {deptInfo.deptId != null ? (
              <div className="buttonContainer" style={buttonContainerStyle}>
                <Button style={editButtonStyle} onClick={editDept} text="수정" />
                <Button style={deleteButtonStyle} onClick={deleteDept} text="삭제" />
              </div>
            ) : null}
            </div>
            <DeptRegist 
              deptInfo={deptInfo} 
              deptId={deptInfo.deptId}
              isNew={false}
            />
          </div>
          <div className="deptDownListTable" style={deptDetailStyle}>
            <p>
              <strong>* 하위부서목록 </strong>
            </p>
            <CustomTable
              keyColumn={listKeyColumn}
              pageSize={downDeptPageSize}
              columns={downDeptTableColumns}
              values={values2}
              paging={true}
            />
          </div>
          <div className="deptHnfListTable" style={deptDetailStyle}>
            <div className="deptHnfButtonContainer" style={buttonContainerStyle}> 
            <p>
              <strong>* 부서인력정보 </strong>
            </p>
            {deptInfo.deptId != null ? (
                <Button style={addButtonStyle} text="관리" />
            ) : null}
            </div>
            <CustomTable
              keyColumn={hnfKeyColumn}
              pageSize={hnfPageSize}
              columns={hafTableColumns}
              values={values3}
              paging={true}
            />
          </div>
          {/* 부서 수정 버튼 클릭시 활성화 되는 팝업 - 개발 필요 */}
          {isPopup ?
           <CustomPopup props={popup} visible={popupVisible} handleClose={handleClose} >
             <DeptRegist 
              onHide={onHide}
              deptInfo={deptInfo} 
              deptId={deptInfo.deptId}
              isNew={false}/> 
           </CustomPopup>
           : <></>
          }
        </div>
      </div>
    </div>
  );
};

export default DeptManage;
