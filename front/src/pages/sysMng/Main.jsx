import { useState, useEffect } from "react";
import ApiRequest from "utils/ApiRequest";
import { Button } from "devextreme-react";
import CustomTable from "components/unit/CustomTable";
import moment from "moment";
import MainJson from "./MainJson"
import { useNavigate } from "react-router-dom"; 
import uuid from "react-uuid";
import { useCookies } from "react-cookie";
import {TableContainer, Table,TableRow,TableCell } from "@mui/material";
import CustomEditTable from "components/unit/CustomEditTable";
import Moment from "moment"
import { isSaturday, isSunday, startOfMonth, endOfMonth } from 'date-fns'
const Main = ({}) => {

//------------------------선언구간----------------------------------------

    const [noticeParam, setNoticeParam] = useState({});    //공지사항 조회용
    const [trAplyParam, setTrAplyParam] = useState({});   //TR입력현황 조회용
    const [aplyParam, setAplyParam] = useState({});       //결재 신청 현황 조회용
    const [atrzParam, setAtrzParam] = useState({});       //결재리스트 조회용
    const [noticeValues, setNoticeValues] = useState([]);   //공지사항 데이터
    const [trAplyValues, setTrAplyValues] = useState([]);   //TR입력현황 데이터
    const [aplyValues, setAplyValues] = useState([]);       //결재 신청 현황 데이터
    const [atrzValues, setAtrzValues] = useState([]);       //결재리스트 데이터
    const {
        noticeQueryId,noticeTableColumns ,      //공지
        trAplyTotQueryId, trAplyKeyColumn,trAplyTableColumns,     //TR입력현황
        atrzSttsQueryId,atrzSttsTableColumns,   //결제 신청현황,결재 리스트
        } = MainJson; 

    const [cookies, setCookie] = useCookies(["userInfo", "userAuth","deptInfo"]);
    const empId = cookies.userInfo.empId;
    const empno = cookies.userInfo.empno;
    const empNm = cookies.userInfo.empNm;
    const deptNm = cookies.deptInfo.deptId;
    const navigate = useNavigate ();
    const [dataSession,setDataSession] = useState([]);
    const nowDate = moment().format('YYYYMM') //현재 년월
    const [currentPhase, setCurrentPhase] = useState(''); //차수설정용
//------------------------ 초기 설정 --------------------------------------
        useEffect(()=> {
            setDataSession([
                {
                empId : empId,
                empno : empno,
                empNm : empNm,
                deptNm : deptNm
                }   
             ]);
             setNoticeParam({queryId : noticeQueryId ,type: 'notice'});
             setTrAplyParam({queryId : trAplyTotQueryId, empId:empId ,aplyYm:nowDate ,aplyOdr: currentPhase});
             setAplyParam({queryId : atrzSttsQueryId, empId:empId , sttsCd:"VTW037"});
             setAtrzParam({queryId : atrzSttsQueryId, empId:empId , sttsCd:"VTW008" });
        },[])

        useEffect(()=> {
            pageHandle();
        },[dataSession])

        useEffect(() => {
            // 현재 날짜를 가져오는 함수
            const getCurrentDate = () => {
            const now = new Date();
            const dayOfMonth = now.getDate();
            return dayOfMonth;
            };
            // 현재 날짜를 가져오기
            const dayOfMonth = getCurrentDate();
            // 15일을 기준으로 차수를 결정
            if (dayOfMonth <= 15) {
              setCurrentPhase('1');
            } else {
              setCurrentPhase('2');
            }
          }, []);

//{*-------------------------- 차수 및 날짜 설정 구간 -----------------------------------*}

// 차수별 시작, 종료일자 
let flagOrder = new Date().getDate() > 15 ? 1 : 2;
let orderWorkBgngYmd = flagOrder == 1 ? String(Moment(startOfMonth(new Date())).format("YYYYMMDD")) : String(Moment(new Date()).format("YYYYMM") - 1 + "16")
let orderWorkEndYmd = flagOrder == 1 ? String(Moment(new Date()).format("YYYYMM") + "15") : Moment(endOfMonth(new Date(Moment(Moment(new Date()).format("YYYYMM") - 1 + "15").format("YYYY-MM-DD")))).format("YYYYMMDD")
let orderWorkBgngMm = flagOrder == 1 ? String(Moment(startOfMonth(new Date())).format("YYYYMM")) : String(Moment(new Date()).format("YYYYMM") - 1)


//{*-------------------------- 이벤트 영역 -----------------------------------*}

  const pageHandle = async () => { 
    try {
      const responseNotice = await ApiRequest("/boot/common/queryIdSearch", noticeParam);
      const responseTrAply = await ApiRequest("/boot/common/queryIdSearch", trAplyParam);
      const responseAply = await ApiRequest("/boot/common/queryIdSearch", aplyParam);
      const responseAtrz = await ApiRequest("/boot/common/queryIdSearch", atrzParam);
      setNoticeValues(responseNotice);
      setTrAplyValues(responseTrAply);
      setAplyValues(responseAply);
      setAtrzValues(responseAtrz);
    } catch (error) {
      console.log(error);
    }
  };
//========================버튼 이벤트 ==============================================
    const goReference = (e) => {  //자료실이동
        navigate("/infoInq/ReferenceList", 
                { state: { 
                        empId: empId,
                        } 
                });
    }
    const goNotice = (e) => {     //공지사항이동
        navigate("/infoInq/NoticeList", 
                { state: { 
                        empId: empId,
                        } 
                });
    }
    const goKms = (e) => {       //지식관리시스템이동
      window.open("http://kms.vtw.co.kr/#/login");
    }
    const goConference = (e) => {  //회의실예약이동(화면 미구현 추후 설정예정)
        navigate("/infoInq/EmpDetailInfo", 
                { state: { 
                        empId: empId,
                        } 
                });
    }

//========================테이블 클릭 이벤트 ==============================================
    const onRowClick = (e) => { //공지사항 테이블 클릭
        navigate("/infoInq/NoticeDetail", 
                {state: { id: e.key }})
    };

    const onCellClick = (e) => {  //TR 입력 현황 테이블 클릭
        if(0 <= e.columnIndex && e.columnIndex < 4 ){  //근무시간페이지로 이동
            navigate("/indvdlClm/EmpWorkTime", 
                    {state: { id: e.key }})
        }else{                      //프로젝트비용페이지로 이동
            navigate("/indvdlClm/ProjectExpense", 
                    {state: { id: e.key }})
        }
        
    };

    const onAplyRowClick = (e) => {   //결재 신청 현황 테이블 클릭 (전자결재 상세화면 개발 후 설정 예정)
          if(e.data.elctrnAtrzTySeCd === "VTW04901"){ //휴가결재
                  navigate("/elecAtrz/ElecAtrzDetail", 
                 {state: { id: e.key ,elctrnAtrzId : e.data.elctrnAtrzId  }})
          }else if(e.data.elctrnAtrzTySeCd === "VTW04902"){ //일반결재
            navigate("/indvdlClm/EmpWorkTime", 
            {state: { id: e.key }})
          }else if(e.data.elctrnAtrzTySeCd === "VTW04903"){ //청구결재
            navigate("/infoInq/NoticeDetail", 
            {state: { id: e.key }})
          }else if(e.data.elctrnAtrzTySeCd === "VTW04904"){ //계약결재
            navigate("/infoInq/NoticeDetail", 
            {state: { id: e.key }})
          }else if(e.data.elctrnAtrzTySeCd === "VTW04905"){ //계약지급결재
            navigate("/infoInq/NoticeDetail", 
            {state: { id: e.key }})
          }
    };

    const onAtrzRowClick = (e) => {   //결재 리스트 테이블 클릭
        navigate("/infoInq/NoticeDetail", 
                {state: { id: e.key }})
    };
//============================기타 이벤트=====================================


//============================화면그리는부분===================================
  return (
    <div className="container" style={{ width : "80%"}}>    
      <div style={{ marginBottom: "20px" }}>
      </div>
      <div className="mainContainer" style={mainContainerStyle}>

        <div className="mainLeftContainer" style={mainLeftContainerStyle}>
{/* --------------------------------사용자정보 --------------------------------------------------*/}
          <div className="empInfoContainer" style={empInfoStyle}>
          <div><p><strong> 사용자 정보 </strong></p></div>
          </div>
          <TableContainer >
          <Table size="small" aria-label="a dense table" style={ {borderStyle : "solid",borderWidth:"thin", borderColor: "rgb(200, 200, 200)"}}>
            <TableRow style={ {borderStyle : "solid"}}>
                <TableCell align="center" component="th" style={ { backgroundColor:"rgb(221, 221, 221)" ,width: "90px",fontWeight:"bold"}}>사번</TableCell>
                <TableCell align="center" component="th" style={ {borderWidth: "1px" , textAlign:"left"}}>{empno}</TableCell>
            </TableRow>
            <TableRow style={ {borderStyle : "solid"}}>
                <TableCell align="center" component="th" style={ { backgroundColor:"rgb(221, 221, 221)",fontWeight:"bold"}}>성명</TableCell>
                <TableCell align="center" component="th" style={ {borderWidth: "1px" , textAlign:"left"}}>{empNm}</TableCell>
            </TableRow>
            <TableRow style={ {borderStyle : "solid"}}>
                <TableCell align="center" component="th" style={ {backgroundColor:"rgb(221, 221, 221)",fontWeight:"bold"}}>소속</TableCell>
                <TableCell align="center" component="th" style={ {borderWidth: "1px" , textAlign:"left"}}>{deptNm}</TableCell>
            </TableRow>
          </Table>
          </TableContainer>

{/* ----------------------------------공지사항 --------------------------------------------------*/}        
          <div className="noticeContainer" style={{ marginTop: "20px", marginBottom: "10px" }}>
          <div><p><strong> 공지사항 </strong></p></div>
          <CustomEditTable
            noDataText="공지사항이 없습니다."
            noEdit={true}
            keyColumn="noticeId"
            columns={noticeTableColumns}
            values={noticeValues}
            onRowClick={onRowClick}
            paging={true}
          />
{/* ----------------------------------버튼그룹 --------------------------------------------------*/}
          <div classNmae="buttonContainer" style={buttonContainerStyle}>
          <Button style={ButtonStyle} onClick={goReference} text="자료실" name="jaryu" type="default"/>
          <Button style={ButtonStyle} onClick={goNotice} text="공지사항" type="default"/>
          <Button style={ButtonStyle} onClick={goKms} text="지식관리시스템" type="default"/>
          <Button style={ButtonStyle} onClick={goConference} text="회의실예약" type="default"/>
          </div>
          </div>
        </div>

{/* ----------------------------------TR입력 현황 ------------------------------------------------*/}
        <div className="mainRightContainer" style={mainRightContainerStyle}>
          <div className="tableDetailTable" style={tableDetailStyle}>
            <p><strong>{orderWorkBgngMm}-{flagOrder}차수 TR입력 현황 </strong></p>
            <CustomTable  keyColumn={trAplyKeyColumn}  columns={trAplyTableColumns}  values={trAplyValues}  onCellClick={onCellClick} />
          </div>
          
{/* ----------------------------------결제 신청 현황 ------------------------------------------------*/}
            <div className="aplyTableList" style={{marginLeft:"20px",flex:"1",}}>
            <p> <strong>결재 신청 현황 </strong> </p>
            <CustomTable  keyColumn="elctrnAtrzId"  columns={atrzSttsTableColumns}  values={aplyValues} onRowClick={onAplyRowClick} noDataText='진행중인 결재가 없습니다.'/>
            </div>

{/* -----------------------------------결제리스트---------------------------------------------------*/}
            <div className="aplyTableList" style={{marginLeft:"20px",flex:"1",}}>
            <p> <strong>결재 리스트 </strong> </p>
            <CustomTable  keyColumn="elctrnAtrzId"  columns={atrzSttsTableColumns}  values={atrzValues} onRowClick={onAtrzRowClick} noDataText="진행중인 결재가 없습니다."/>
            </div>
        </div>
      </div>
    </div>
  );
};

  //화면 전체 배치
  const mainContainerStyle = {
    display: "flex",
  };

  //메인 좌측 스타일
  const mainLeftContainerStyle = {
    width: "35%", // 왼쪽 영역의 너비를 반으로 설정
    marginTop: "40px",
  };

  const empInfoStyle = {
    minWidth: "480px",
  };

  //메인 우측 전체 배치
  const mainRightContainerStyle = {
    width: "65%", // 오른쪽 영역의 너비를 반으로 설정
    display: "flex",
    flexDirection: "column",
    marginBottom: "50px",
  };

  //각 테이블 배치
  const tableDetailStyle = {
    flex: "1",
    marginLeft: "20px", // 각 div 사이의 간격을 조절합니다.
    marginTop: "40px",
  };

  //버튼 배치
  const buttonContainerStyle = {
    display: "flex",
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: "20px",
  };
  
  //버튼
  const ButtonStyle={
    fontSize:"10px",
    marginRight:"10px",
    marginBottom:"10px",
  }


export default Main;
