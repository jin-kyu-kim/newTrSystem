import { useState, useEffect } from "react";
import ApiRequest from "utils/ApiRequest";
import { Button } from "devextreme-react";
import CustomTable from "components/unit/CustomTable";
import DeptManageJson from  "./DeptManageJson.json";
import moment from "moment";
import TreeView from 'devextreme-react/tree-view';
import { Popup } from "devextreme-react";
import DeptManagePop from './DeptManagePop';
import CustomLabelValue from "components/unit/CustomLabelValue";
import uuid from "react-uuid";
import { useModal } from "../../components/unit/ModalContext";

const DeptManage = ({callBack}) => {
  const [param, setParam] = useState({});
  const [values, setValues] = useState([]);                         //부서목록트리
  const [hnfValues, setHnfValues] = useState([]);                   //부서인력정보 목록
  const { listQueryId, hnfQueryId, hnfKeyColumn, hafTableColumns, labelValue } = DeptManageJson; //부서인력목록용 json data
  const [deptHnfParam, setDeptHnfParam] = useState({});             //부서인력정보 검색용 세팅
  const [deptInfo, setDeptInfo] = useState({});                     //팝업 및 상세정보에 넘길 정보 셋팅용
  const [empPopup, setEmpPop] = useState(false);                     //부서내 직원관리 팝업 세팅
  const [totalItems, setTotalItems] = useState(0);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const userAuth = JSON.parse(localStorage.getItem("userAuth"));
  const [value, setValue] = useState('contains');
  const empId = userInfo.empId;
  const date = new Date();
  const now = date.toISOString().split("T")[0] + " " + date.toTimeString().split(" ")[0];
  const gnfdDate = moment().format('YYYYMMDD'); //현재 년월일
  const [deptId, setDeptId] = useState();        //부서id
  const [deptNm, setDeptNm] = useState();       //부서명 설정용
  const [upDeptId, setUpDeptId] = useState({});   //상위부서 설정용
  const [deptMngrEmpFlnm, setDeptMngrEmpFlnm] = useState({});   //부서장네임 설정용
  const [deptBgngYmd, setDeptBgngYmd] = useState();     //부서시작일자
  const [deptEndYmd, setDeptEndYmd] = useState();       //부서종료일자
  const [deptHnfSet, setDeptHnfSet] = useState({}); //부서장 등록시 설정용
  const { handleOpen } = useModal();
  
  //-------------------------- 초기 설정 ----------------
  useEffect(() => {
    setParam({
      ...param,
      queryId: listQueryId,
    });
    setDeptId(null);
    setDeptNm(null);
    setUpDeptId({});
    setDeptMngrEmpFlnm({});
    setDeptBgngYmd(null);
    setDeptEndYmd(null);
  }, []);

  useEffect(() => {
    if (!Object.values(param).every((value) => value === "")) {
      pageHandle();
    }
  }, [param]);

  useEffect(() => { //setParam 이후에 함수가 실행되도록 하는 useEffect
    if (deptHnfParam.deptId !== undefined) {
      deptHnfListHandle();
    }
  }, [deptHnfParam]);
  

  //-------------------------- 이벤트 영역 -----------

  const pageHandle = async () => { //부서 목록 조회
    try {
      const response = await ApiRequest("/boot/common/queryIdSearch", param);
      setValues(response);
      setTotalItems(response[0].totalItems);
    } catch (error) {
      console.log(error);
    }
  };


  const deptListTree = (e) => { //부서목록 트리 아이템 클릭이벤트
    if (e.itemData.deptId !== null) {
        setDeptId(e.itemData.deptId);
        setDeptNm(e.itemData.deptNm);
        setUpDeptId({deptId: e.itemData.upDeptId});
        setDeptMngrEmpFlnm({ empId: e.itemData.empFlnm });
        setDeptBgngYmd(e.itemData.deptBgngYmd);
    }

    setDeptHnfParam({               //부서인력정보 조회용 셋팅
      deptId: e.itemData.deptId,
      queryId: hnfQueryId,
      deptNm: e.itemData.deptNm,
    });
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

  //input박스 데이터 변경시 data에 새로 저장됨
  const handleChgState = ({ name, value }) => {
    if (name === "deptNm") {
      setDeptNm(value);
    } else if (name === "upDeptId") {
      setUpDeptId(value);
    } else if (name === "deptBgngYmd") {
      setDeptBgngYmd(value);
    } 
    setDeptInfo({
      ...deptInfo,
      [name]: value,
    });
  };
  //==================상위부서 변경시==================
  const handleUpDeptChgState = ({ name, value }) => {
    console.log(name,value)
    setUpDeptId({
      ...upDeptId,
      [name]: value,
    });
  };
  //==================부서장명 변경시==================
  const handleMngrChgState = ({ name, value }) => {
    console.log(name,value)
    setDeptMngrEmpFlnm({
      ...deptMngrEmpFlnm,
      [name]: value,
    });
  };

  const newDept = () => {               //신규등록버튼 이벤트
    reset();
    setDeptHnfParam({});
  };

  //==================================부서정보 등록버튼 이벤트===================================
  const insertDept = async () => {     //부서등록
    if (deptNm === null) {
      handleOpen("부서명을 입력해주세요");
      return;
    } else if (!upDeptId.deptId) {
      handleOpen("상위부서를 선택해주세요");
      return;
    } else if (!deptMngrEmpFlnm.empId) {
      handleOpen("부서장을 선택해주세요");
      return;
    } else if (deptBgngYmd === null) {
      handleOpen("부서 시작일자를 입력해주세요");
      return;
    }else{
      const isconfirm = window.confirm("부서정보를 등록하시겠습니까?");
      if (isconfirm) {
        const param = [
          { tbNm: "DEPT" }, 
          { 
            deptId: uuid(),
            endYn: "N",
            regEmpId: empId,
            regDt: now,
            deptNm: deptNm,
            upDeptId: upDeptId.deptId,
            deptBgngYmd: deptBgngYmd,
          }
        ];
        
        try {
          const response = await ApiRequest("/boot/common/commonInsert", param);
          if (response > 0) {
            setDeptHnfSet({ deptId: param[1].deptId });
          }
        } catch (error) {
          console.error("Error fetching data", error);
        }
      } else {
        return;
      }
    }
  };

  useEffect(() => {
    if (deptHnfSet.deptId !== null && deptHnfSet.deptId !== undefined) {
      deptMngrSearch();
    }
  }, [deptHnfSet])

  const deptMngrSearch = async () => {  //부서장 사번 검색
    const paramSearchMngr = { queryId: "infoInqMapper.retrieveEmpList", empId: deptMngrEmpFlnm.empId };
    try {
      const responseMngr = await ApiRequest("/boot/common/queryIdSearch", paramSearchMngr);
      if (responseMngr[0].empId === deptMngrEmpFlnm.empId) {
        insertDeptInst(responseMngr);
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const insertDeptInst = async (responseMngr) => {  //부서장등록
    const InsertParam = [
      { tbNm: "DEPT_HNF" },
      {
        deptId: deptHnfSet.deptId,
        empId: deptMngrEmpFlnm.empId,
        jbttlCd: "VTW01001",
        empno: responseMngr[0].empno,
        deptGnfdYmd: gnfdDate,
        regDt: now,
        regEmpId: empId,        
      },
    ];

    const InsertHistParam = [ //히스토리 정보
      { tbNm: "DEPT_HNF_HIST", snColumn: "DEPT_HNF_HIST_SN", snSearch: { deptId: deptHnfSet.deptId, empId: deptMngrEmpFlnm.empId } },
      {
        deptId: deptHnfSet.deptId,
        empId: deptMngrEmpFlnm.empId,
        jbttlCd: "VTW01001",
        empno: responseMngr[0].empno,
        deptGnfdYmd: gnfdDate,
        regDt: now,
        regEmpId: empId,        
      },
    ];

    try {
      const response = await ApiRequest("/boot/common/commonInsert", InsertParam); //부서장발령인서트
      const histResponse = await ApiRequest("/boot/common/commonInsert", InsertHistParam); //발령 히스토리 인서트
      if (response > 0 && histResponse > 0) {
        handleOpen("등록되었습니다.");
        reset();
        setDeptHnfParam({});
        pageHandle();
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  //==================================부서정보 수정버튼 이벤트===================================
  const editDept = async () => {
    if (deptNm === null || deptNm === "") {
      handleOpen("부서명을 입력해주세요");
      return;
    } else if (!upDeptId.deptId) {
      handleOpen("상위부서를 선택해주세요");
      return;
    } else if (deptBgngYmd === null) {
      handleOpen("부서 시작일자를 입력해주세요");
      return;
    } else if (upDeptId.deptId === deptId){
      handleOpen("상위부서 선택이 잘못되었습니다.");
    }
    const isconfirm = window.confirm("부서정보를 변경하시겠습니까?");
    if (isconfirm) {

      for (const value of hnfValues) {
        if (value.jbttlCd === "VTW01001") {
          if (value.empId !== deptMngrEmpFlnm.empId) {
            handleOpen("부서장 변경은 인력관리 팝업에서 진행해주시기 바랍니다.")
            setDeptMngrEmpFlnm({ empId: value.empId });
            return;
          }
        }
      }

      const updateParam = [
        { tbNm: "DEPT" },
        {  
          deptNm: deptNm,
          upDeptId: upDeptId.deptId,
          deptBgngYmd: deptBgngYmd,
          mdfcnEmpId: empId, 
          mdfcnDt: now,
        },
        { deptId: deptId }
      ];

      try {
        const response = await ApiRequest("/boot/common/commonUpdate", updateParam);
        if (response> 0 ) {
          handleOpen("변경되었습니다.");
          reset();
          pageHandle(); 
        }
      } catch (error) {
        console.error("Error fetching data", error);
      }
    } else {
      return;
    }
  };

  //=================부서 직원 관리 팝업 버튼 이벤트============================
  const empPopupView = () => {
    setEmpPop(true);
  };

  const empHandleClose = () => {
    setEmpPop(false);
    pageHandle();
  };
  //=================부서 사용종료 버튼 이벤트======================================
  const deptEndOfUse = async () => {
    console.log("부서정보",values)

    for (const value of values) {
      if (value.upDeptId === deptId) {
        handleOpen("하위부서가 존재합니다. \n 하위부서 해제 후 사용종료 바랍니다.")
          return;
        }
      }

      const isconfirm = window.confirm("부서를 사용종료 처리하시겠습니까? \n (사용종료시 배정된 인력들이 모두 발령해제됩니다.)" );
      if (isconfirm) {
  
        const updateParam = [
          { tbNm: "DEPT" },
          {  
            endYn: "Y",
            deptEndYmd: gnfdDate,
            mdfcnEmpId: empId, 
            mdfcnDt: now,
          },
          { deptId: deptId }
        ];
  
        const paramDelHnf = [ { tbNm: "DEPT_HNF" }, { deptId: deptId } ];
  
        const histParam = [
          { tbNm: "DEPT_HNF_HIST" },
          { 
            deptGnfdRmvYmd : gnfdDate,
            mdfcnEmpId: empId, 
            mdfcnDt: now,
          },
          { deptId: deptId }
        ];
  
        try {
          const response = await ApiRequest("/boot/common/commonUpdate", updateParam);
          const responseDelHist = await ApiRequest("/boot/common/commonUpdate", histParam);
          const responseDelHnf = await ApiRequest("/boot/common/commonDelete", paramDelHnf);
          if (response > 0 ) {
            handleOpen("사용종료되었습니다.");
            reset();
            pageHandle(); 
          }
        } catch (error) {
          console.error("Error fetching data", error);
        }
      } else {
        return;
      }

  };
 //=================부서 삭제 버튼 이벤트======================================
  const deleteDept = async () => {        //부서삭제버튼 이벤트
    const isconfirm = window.confirm("부서정보를 삭제하시겠습니까?");
    if (isconfirm) {
      const paramDel = [ { tbNm: "DEPT" }, { deptId: deptId } ];
      const paramDelHnf = [ { tbNm: "DEPT_HNF" }, { deptId: deptId } ];
      const paramDelHist = [ { tbNm: "DEPT_HNF_HIST" }, { deptId: deptId } ];
      deleteDeptHist(paramDel, paramDelHnf, paramDelHist);
    }  
  };

  const deleteDeptHist = async (paramDel, paramDelHnf, paramDelHist) => { //삭제axios
    try {
      const responseDelHist = await ApiRequest("/boot/common/commonDelete", paramDelHist);
      const responseDelHnf = await ApiRequest("/boot/common/commonDelete", paramDelHnf);
      const responseDel = await ApiRequest("/boot/common/commonDelete", paramDel);
      if (responseDel > 0  ) {
        handleOpen("삭제되었습니다.");
        reset();
        setDeptHnfParam({});
        pageHandle();
      } else {
        handleOpen("특정 프로젝트에 부서가 속해있거나 하위부서가 존재합니다.\n수정이나 삭제 후 시도하십시요.");
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };


 //=================부서가 현재 프로젝트 진행중인지 확인용======================================
  const deptProject = async () => {
    try{
      const response = await ApiRequest("/boot/common/commonSelect",[{ tbNm: "PRJCT" }, { deptId : deptId}]);
      console.log("이거뭐임???",response.length)
      if (response.length > 0 ) {
        handleOpen("특정 프로젝트에 부서가 속해있습니다.\n수정이나 삭제 후 시도하십시요.");
        return;
      } else {
        deptEndOfUse();
      }
    }catch(error){
      console.error("Error fetching data", error);
    }
  };
 

  //=============================datareset============================
  const reset = () => {
    setDeptId(null);
    setDeptNm(null);
    setUpDeptId({});
    setDeptMngrEmpFlnm({});
    setDeptBgngYmd(null);
    setDeptEndYmd(null);
    setDeptHnfSet({});
    setHnfValues([]);
  };

  //============================화면그리는부분===================================
  return (
    <div style={{ marginLeft: "1%", marginRight: "1%" }}>
      <div className="mx-auto" style={{ marginTop: "20px", marginBottom: "10px" }}>
        <h1 style={{ fontSize: "30px" }}>부서관리</h1>
      </div>
      <div className="mx-auto" style={{ marginBottom: "10px" }}>
        <span>* 부서목록을 조회합니다.</span>
      </div>
      <div style={{ marginBottom: "20px" }}>
      </div>
      <div>검색된 건 수 : {totalItems} 건 </div>
      <div className="tableContainer" style={tableContainerStyle}>
        <div className="deptListContainer" style={deptListContainerStyle}>
          <div className="deptListTable" style={deptListStyle}>
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
              expandedExpr="totalItems"
              onItemClick={deptListTree}
            />
          </div>
        </div>
        <div className="deptDetailContainer" style={deptDetailContainerStyle}>
          <div className="deptDetailTable" style={deptDetailStyle}>
            <div className="detailButtonContainer" style={buttonContainerStyle}> 
              <p><strong>* 부서상세정보 </strong></p>
              {deptId != null ? (
                <div className="buttonContainer" style={buttonContainerStyle}>
                  <Button style={editButtonStyle} onClick={newDept} text="신규등록" />
                  <Button style={editButtonStyle} onClick={editDept} text="수정" />
                  <Button style={editButtonStyle} onClick={deptProject} text="부서사용종료" />
                  <Button style={deleteButtonStyle} onClick={deleteDept} text="삭제" />
                </div>
              ) : 
              <div className="buttonContainer" style={buttonContainerStyle}>
                <Button style={editButtonStyle} onClick={insertDept} text="등록" />
              </div>
              }
            </div>
            <CustomLabelValue props={labelValue.deptNm} onSelect={handleChgState} value={deptNm} />
            <CustomLabelValue props={labelValue.deptId} onSelect={handleUpDeptChgState} value={upDeptId.deptId} />
            <CustomLabelValue props={labelValue.empId} onSelect={handleMngrChgState} value={deptMngrEmpFlnm.empId} />
            <CustomLabelValue props={labelValue.deptBgngYmd} onSelect={handleChgState} value={deptBgngYmd}/>
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
                deferRendering={false}
              >
                <DeptManagePop data={hnfValues} deptId={deptHnfParam.deptId} deptNm={deptHnfParam.deptNm} callBack={deptHnfListHandle}/>
              </Popup>
              {deptHnfParam.deptId != null ? (
                <Button style={addButtonStyle} text="관리" onClick={empPopupView}/>
              ) : null}
            </div>
            <CustomTable keyColumn={hnfKeyColumn} columns={hafTableColumns} values={hnfValues} paging={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

const tableContainerStyle = {
  display: "flex",
};

// 좌측 부서 목록 컨테이너 스타일
const deptListContainerStyle = {
  width: '40%', // 좌측 영역 너비 조정
  overflowY: 'auto', // Y축 스크롤 자동 생성
  maxHeight: '200vh', // 최대 높이를 뷰포트 높이로 제한
  overflowX: 'hidden', // X축 스크롤 숨김
  whiteSpace: 'nowrap', // 줄바꿈을 하지 않아 트리뷰에 긴 이름이 있을 때도 깨지지 않도록 설정
  border: '1px solid #ccc', // 테두리 추가
  borderRadius: '8px', // 테두리 반경 추가
  padding: '10px', // 내부 여백 추가
  backgroundColor: '#f9f9f9', // 배경색 추가
};

// 우측 상세 정보 컨테이너 스타일
const deptDetailContainerStyle = {
  width: '60%', // 우측 영역 너비 조정
  display: 'flex',
  flexDirection: 'column',
};

const deptListStyle = {
  minWidth: "480px",
};

// 각 테이블 배치
const deptDetailStyle = {
  flex: "1",
  marginLeft: "20px", // 각 div 사이의 간격을 조절합니다.
  marginTop: "40px",
};

// 버튼 배치
const buttonContainerStyle = {
  display: "flex",
  justifyContent: 'space-between',
  alignItems: 'center'
};

// 부서 상세 버튼
const editButtonStyle = {
  marginRight: "10px",
  marginBottom: "10px",
}

const deleteButtonStyle = {
  marginRight: "20px",
  marginBottom: "10px",
}

// 인력 추가 버튼
const addButtonStyle = {
  marginRight: "10px",
  marginBottom: "10px",
}

export default DeptManage;
