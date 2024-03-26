import { useState, useEffect, useCallback } from "react";
import ApiRequest from "utils/ApiRequest";
import { Button } from "devextreme-react";
import CustomTable from "components/unit/CustomTable";
import DeptManageJson from  "./DeptManageJson.json";
import SearchHumanResourceMngtSet from "components/composite/SearchHumanResoureceMngSet";
import DeptRegist from "./DeptRegist";
import CustomPopup from "components/unit/CustomPopup";
import TreeView from 'devextreme-react/tree-view';
import { Popup } from "devextreme-react";
import DeptManagePop from './DeptManagePop';

const DeptManage = ({callBack}) => {

  const [values, setValues] = useState([]);                         //부서목록트리
  const [hnfValues, setHnfValues] = useState([]);                   //부서인력정보 목록
  const [param, setParam] = useState({});
  const { listQueryId2,listQueryId, searchParams,                   //부서목록조회   json data
          hnfQueryId, hnfKeyColumn, hafTableColumns,                //부서인력목록용 json data
          popup} = DeptManageJson; 
  const [deptDetailParam, setDeptDetailParam] = useState({});                 //부서상세정보 검색용 세팅
  const [deptHnfParam, setDeptHnfParam] = useState({});             //부서인력정보 검색용 세팅

  const [deptInfo, setDeptInfo] = useState([]);                     //팝업 및 상세정보에 넘길 정보 셋팅용
  const [isPopup, setPopup] = useState(false);                      //수정팝업에 넘길것 셋팅용
  const [empPopup,setEmpPop] = useState(false);                     //부서내 직원관리 팝업 세팅
  const [newEmpPop,setNewEmpPop] = useState(false);                     //부서내 직원관리 팝업 세팅
  const [popupVisible, setPopupVisible] = useState(false);          //부서등록 팝업
  const [totalItems, setTotalItems] = useState(0);
 // const [readOnly, setReadOnly] = useState(true);

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

  //========================부서 목록 조회================================================
  const searchHandle = async (initParam) => {

    setParam({
      ...initParam,
      queryId: listQueryId,

      startVal: 0,
    });
  };

//========================부서 목록 조회================================================
  useEffect(() => {
    if (!Object.values(param).every((value) => value === "")) {
      pageHandle();
    }
  }, [param]);

  const pageHandle = async () => {
    try {
      const response = await ApiRequest("/boot/common/queryIdSearch", param);
      setValues(response);
      console.log(response);
      if (response.length !== 0) {
        setTotalItems(response[0].totalItems);
      } else {
        setTotalItems(0);
      }
    } catch (error) {
      console.log(error);
    }
  };
//=====================부서목록 검색용=============================================
  const [value, setValue] = useState('contains');
  const valueChanged = useCallback(
    (e) => {
    setValue(e.value);
    },
    [setValue],
  );
//=========================부서목록 트리 아이템 클릭이벤트 =================================
  const deptListTree = (e) => {
    setDeptDetailParam({               //부서상세정보 조회용 셋팅
      deptId: e.deptId,
      queryId: listQueryId2,
    });
  
    setDeptHnfParam({               //부서인력정보 조회용 셋팅
      deptId: e.deptId,
      queryId: hnfQueryId,
      deptNm: e.deptNm,
    });
   
  };

//========================setParam 이후에 함수가 실행되도록 하는 useEffect========================
  useEffect(() => {
    if (deptDetailParam.deptId !== undefined) {
      deptDetailHandle();
    }
    
  }, [deptDetailParam]);
  
  useEffect(() => {
    if (deptHnfParam.deptId !== undefined) {
      deptHnfListHandle();
    }
  }, [deptHnfParam]);

//========================부서상세정보 데이터 목록 조회====================================
const deptDetailHandle = async () => {
  try {
    const response = await ApiRequest("/boot/common/queryIdSearch",deptDetailParam);
    for (const value of response) {
        setDeptInfo(value);
    }
  } catch (error) {
    console.log(error);
  }
};
//=================부서 정보 수정 버튼 이벤트===============================
  const editDept = () => {
    setPopupVisible(true);
    setPopup(true);
  };
//=================부서 등록 팝업 버튼 이벤트============================
  const newDeptPopView = () =>{
    setNewEmpPop(true)
  };
  const newDeptPopHandleClose = () => {
    setNewEmpPop(false)
  } 
//=================부서 직원 관리 팝업 버튼 이벤트============================
  const empPopupView = () =>{
    setEmpPop(true)
  };
  const empHandleClose = () => {
    setEmpPop(false)
  }

//==================팝업 닫기 버튼 이벤트==================================
  const handleClose = () => {
    setPopupVisible(false);
  };

//==================팝업 닫기 버튼 이벤트=================================
  const onHide = () => {
    setPopupVisible(false);
  }
  
//===================부서 삭제 버튼 이벤트==================================
  const deleteDept = async () => {
    const isconfirm = window.confirm("이 부서를 삭제하시겠습니까?");
    if (isconfirm) {
      console.log("부서 삭제 : " + deptInfo.deptId);
      const paramDel =[ { tbNm: "DEPT" },{ deptId: deptInfo.deptId,} ]
      const paramDelHnf =[ { tbNm: "DEPT_HNF" },{ deptId: deptInfo.deptId,} ]
      const paramDelHist =[ { tbNm: "DEPT_HNF_HIST" },{ deptId: deptInfo.deptId,} ]
      deleteDeptHist(paramDel,paramDelHnf,paramDelHist);
    }  
  };

//=============================삭제axios============================
const deleteDeptHist = async (paramDel,paramDelHnf,paramDelHist) => {
  try {
    const responseDelHist = await ApiRequest("/boot/common/commonDelete", paramDelHist);
    const responseDelHnf = await ApiRequest("/boot/common/commonDelete", paramDelHnf);
    const responseDel = await ApiRequest("/boot/common/commonDelete", paramDel);
      if (responseDel > 0  ) {
        alert("삭제되었습니다.");
        setDeptInfo([]);
        pageHandle();
      }else{
        alert("특정 프로젝트에 부서가 속해있습니다.\n수정이나 삭제 후 시도하십시요.");
      }
  } catch (error) {
    console.error("Error fetching data", error);
  }
};


//========================부서인력 목록=====================================
  const deptHnfListHandle = async () => {
    try {
      const response = await ApiRequest("/boot/common/queryIdSearch", deptHnfParam );
      setHnfValues(response);
    } catch (error) {
      console.log(error);
    }
  };

//============================화면그리는부분===================================
  return (
    <div className="container">
      <div className="title p-1" style={{ marginTop: "20px", marginBottom: "10px" }}>
        <h1 style={{ fontSize: "40px" }}>부서 관리</h1>
      </div>
      <div className="col-md-10 mx-auto" style={{ marginBottom: "10px" }}>
        <span>* 부서를 조회합니다.</span>
      </div>
      <div style={{ marginBottom: "20px" }}>
      <SearchHumanResourceMngtSet callBack={searchHandle} props={searchParams} popup={popup}/>
      </div>
      <div>검색된 건 수 : {totalItems} 건 </div>
              <div div className="buttonContainer" style={buttonContainerStyle}>
                <Button style={editButtonStyle} onClick={editDept} text="부서등록(수정중)"/>
              </div>
      <div className="tableContainer" style={tableContainerStyle}>
        <div className="deptListContainer" style={deptListContainerStyle}>
          <div className="deptListTable" style={deptListStyle}>
          <Popup
              width="90%"
              height="90%"
              visible={newEmpPop}
              onHiding={newDeptPopHandleClose}
              showCloseButton={true}
            >
            <DeptRegist onHide={onHide} isNew={true}/>
            </Popup>
          <div><p><strong>* 부서목록 </strong></p></div>
            <TreeView id="deptList"
              dataSource={values}
              dataStructure="plain"
              width={300}  
              searchMode={value}
              searchEnabled={true}
              keyExpr="deptId"
              displayExpr="deptNm"
              parentIdExpr="upDeptId"
              onItemClick={(e) => { deptListTree(e.itemData) }}
              />
          </div>
        </div>
        <div className="deptDetailContainer" style={deptDetailContainerStyle}>
          <div className="deptDetailTable" style={deptDetailStyle}>
          <div className="detailButtonContainer" style={buttonContainerStyle}> 
            <p><strong>* 부서상세정보 </strong></p>
            {deptInfo.deptId != null ? (
              <div className="buttonContainer" style={buttonContainerStyle}>
                <Button style={editButtonStyle} onClick={editDept} text="수정" />
                <Button style={deleteButtonStyle} onClick={deleteDept} text="삭제" />
              </div>
            ) : null}
            </div>
              <DeptRegist deptInfo={deptInfo} deptId={deptInfo.deptId} isNew={false} />
          </div>
          <div className="deptHnfListTable" style={deptDetailStyle}>
            <div className="deptHnfButtonContainer" style={buttonContainerStyle}> 
            <p> <strong>* 부서인력정보 </strong> </p>
            <Popup
              width="90%"
              height="90%"
              visible={empPopup}
              onHiding={empHandleClose}
              showCloseButton={true}
            >
            <DeptManagePop data={hnfValues} deptId={deptHnfParam.deptId} deptNm={deptHnfParam.deptNm} callBack={deptHnfListHandle}/>
            </Popup>
            {deptInfo.deptId != null ? (
              <Button style={addButtonStyle} text="관리" onClick={empPopupView}/>
            ) : null}
          </div>
          <CustomTable keyColumn={hnfKeyColumn} columns={hafTableColumns} values={hnfValues} paging={true} />
          </div>
          {/* 부서 수정 버튼 클릭시 활성화 되는 팝업 - 개발 필요 */}
          {isPopup ?
           <CustomPopup props={popup} visible={popupVisible} handleClose={handleClose} >
             <DeptRegist  onHide={onHide} deptInfo={deptInfo} deptId={deptInfo.deptId} isNew={true} callBack={pageHandle}/> 
           </CustomPopup>
           : <></>
          }
        </div>
      </div>
    </div>
  );
};

export default DeptManage;
