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
import { useCookies } from "react-cookie";

const DeptManage = ({callBack}) => {

  const [param, setParam] = useState({});
  const [values, setValues] = useState([]);                         //부서목록트리
  const [hnfValues, setHnfValues] = useState([]);                   //부서인력정보 목록
  const { listQueryId,hnfQueryId, hnfKeyColumn, hafTableColumns, labelValue} = DeptManageJson; //부서인력목록용 json data
  const [deptHnfParam, setDeptHnfParam] = useState({});             //부서인력정보 검색용 세팅
  const [deptInfo, setDeptInfo] = useState({});                     //팝업 및 상세정보에 넘길 정보 셋팅용
  const [empPopup,setEmpPop] = useState(false);                     //부서내 직원관리 팝업 세팅
  const [totalItems, setTotalItems] = useState(0);
  const [cookies, setCookie] = useCookies(["userInfo", "userAuth"]);
  const [value, setValue] = useState('contains');
  const empId = cookies.userInfo.empId;
  const date = new Date();
  const now =  date.toISOString().split("T")[0] +" " +date.toTimeString().split(" ")[0];
  const startday = moment().format('YYYYMMDD'); //현재 년월일 (부서 시작일자 자동 세팅용)
  const [deptId,setDeptId] = useState();
  const [deptNm, setDeptNm] = useState();
  const [upDeptId, setUpDeptId] = useState();
  const [deptMngrEmpFlnm, setDeptMngrEmpFlnm] = useState();  
  const [deptBgngYmd, setDeptBgngYmd] = useState();  
  const [deptEndYmd, setDeptEndYmd] = useState(); 

  //-------------------------- 초기 설정 ----------------
    useEffect(() => {
        setParam({
          ...param,
          queryId: listQueryId,
        });
        setDeptId(null);
        setDeptNm(null);
        setUpDeptId(null);
        setDeptMngrEmpFlnm(null);
        setDeptBgngYmd(null);
        setDeptEndYmd(null);
        
    }, []);

    useEffect(() => {
        pageHandle();
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
        setUpDeptId(e.itemData.upDeptId);
        setDeptMngrEmpFlnm(e.itemData.deptMngrEmpFlnm);
        setDeptBgngYmd(e.itemData.deptBgngYmd);
        setDeptEndYmd(e.itemData.deptEndYmd);
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
    if(name === "deptNm") {
      setDeptNm(value);
  } else if(name === "upDeptId") {
    setUpDeptId(value);
  } else if(name === "deptMngrEmpFlnm") {
    setDeptMngrEmpFlnm(value);
  } else if(name === "deptBgngYmd") {
    setDeptBgngYmd(value);
  } else if(name === "deptEndYmd") {
    setDeptEndYmd(value);
  } 
    setDeptInfo({
        ...deptInfo,
        [name]: value,
      });
  };
 
  const newDept = () => {               //신규등록버튼 이벤트
    reset();
    setDeptHnfParam({});
  };

  const insertDept = async() => {         //부서정보 등록버튼 이벤트

    if(deptNm === null) {
      alert("부서명을 입력해주세요");
        return;
    } else if(deptBgngYmd === null) {
      alert("부서 시작일자를 입력해주세요");
      return;
    } else if(deptEndYmd === null) {
      alert("부서 종료일자를 입력해주세요");
      return;
    } 
    else{
    const isconfirm = window.confirm("부서정보를 등록하시겠습니까?");
    if (isconfirm) {
      const param = [
      { tbNm: "DEPT" }, 
      { 
        deptId: uuid(),
        endYn: "N",
        regEmpId : empId,
        regDt: now,
        deptNm:deptNm,
        upDeptId:upDeptId,
        deptBgngYmd: deptBgngYmd,
        deptEndYmd:deptEndYmd
      }];

    if(deptNm === null) {
      alert("부서명을 입력해주세요");
        return;
    } else if(deptBgngYmd === null) {
      alert("부서 시작일자를 입력해주세요");
      return;
    } else if(deptEndYmd === null) {
      alert("부서 종료일자를 입력해주세요");
      return;
    } 
      try {
        const response = await ApiRequest("/boot/common/commonInsert", param);
          if (response > 0) {
            alert("등록되었습니다.");
            reset();
            setDeptHnfParam({});
            pageHandle();
          }
      } catch (error) {
        console.error("Error fetching data", error);
      }
    }else{
      return;
    }
  };    
  };

  const editDept = async() => {
    const isconfirm = window.confirm("부서정보를 변경하시겠습니까?");
    if (isconfirm) {
      const updateParam =[
        { tbNm: "DEPT" },
        {  
          deptNm:deptNm,
          upDeptId:upDeptId,
          deptBgngYmd: deptBgngYmd,
          deptEndYmd:deptEndYmd, 
          mdfcnEmpId : empId, 
          mdfcnDt: now,
        },
        { deptId: deptId}]

        try {
          const response = await ApiRequest("/boot/common/commonUpdate", updateParam);
          if (response > 0 ) {
            alert("변경되었습니다.");
            reset();
            pageHandle(); 
          }
      } catch (error) {
        console.error("Error fetching data", error);
      }


      }
    else{
        return;
      }
  };
//=================부서 직원 관리 팝업 버튼 이벤트============================
  const empPopupView = () =>{
    setEmpPop(true)
  };
  const empHandleClose = () => {
    setEmpPop(false)
  }


  const deleteDept = async () => {        //부서삭제버튼 이벤트
    const isconfirm = window.confirm("부서정보를 삭제하시겠습니까?");
    if (isconfirm) {
      const paramDel =[ { tbNm: "DEPT" },{ deptId: deptId} ]
      const paramDelHnf =[ { tbNm: "DEPT_HNF" },{ deptId: deptId} ]
      const paramDelHist =[ { tbNm: "DEPT_HNF_HIST" },{ deptId: deptId} ]
      deleteDeptHist(paramDel,paramDelHnf,paramDelHist);
    }  
  };

    const deleteDeptHist = async (paramDel,paramDelHnf,paramDelHist) => { //삭제axios
      try {
        const responseDelHist = await ApiRequest("/boot/common/commonDelete", paramDelHist);
        const responseDelHnf = await ApiRequest("/boot/common/commonDelete", paramDelHnf);
        const responseDel = await ApiRequest("/boot/common/commonDelete", paramDel);
          if (responseDel > 0  ) {
            alert("삭제되었습니다.");
            reset();
            pageHandle();
          }else{
            alert("특정 프로젝트에 부서가 속해있거나 하위부서가 존재합니다.\n수정이나 삭제 후 시도하십시요.");
          }
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

//=============================datareset============================
    const reset = () => {
      setDeptId(null);
      setDeptNm(null);
      setUpDeptId(null);
      setDeptMngrEmpFlnm(null);
      setDeptBgngYmd(null);
      setDeptEndYmd(null);
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
                <Button style={deleteButtonStyle} onClick={deleteDept} text="삭제" />
              </div>
            ) : 
            <div className="buttonContainer" style={buttonContainerStyle}>
                <Button style={editButtonStyle} onClick={insertDept} text="등록" />
              </div>
            }
            </div>
              <CustomLabelValue props={labelValue.deptNm} onSelect={handleChgState} value={deptNm} />
              <CustomLabelValue props={labelValue.upDeptId} onSelect={handleChgState} value={upDeptId} />
              <CustomLabelValue props={labelValue.deptMngrEmpFlnm} onSelect={handleChgState} value={deptMngrEmpFlnm} readOnly={true}/>
              <CustomLabelValue props={labelValue.deptBgngYmd} onSelect={handleChgState} value={deptBgngYmd}/>
              <CustomLabelValue props={labelValue.deptEndYmd} onSelect={handleChgState} value={deptEndYmd}/>
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

export default DeptManage;
