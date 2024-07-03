import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "devextreme-react";
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material";
import { startOfMonth } from 'date-fns'
import { useAuth } from "../../components/sidebar/contexts/auth";
import CustomEditTable from "components/unit/CustomEditTable";
import CustomTable from "components/unit/CustomTable";
import ApiRequest from "utils/ApiRequest";
import MainJson from "./MainJson"
import Moment from "moment"
import "../../assets/css/Style.css"

const Main = ({ }) => {
  const [ isLoading, setIsLoading ]= useState(false);
  const [ noticeValues, setNoticeValues ] = useState([]);   //공지사항 데이터
  const [ trAplyValues, setTrAplyValues ] = useState([]);   //TR입력현황 데이터
  const [ aplyValues, setAplyValues ] = useState([]);       //결재 신청 현황 데이터
  const [ atrzValues, setAtrzValues ] = useState([]);       //결재리스트 데이터
  const { noticeQueryId, noticeTableColumns, //공지
    trAplyTotQueryId, trAplyTableColumns,    //TR입력현황
    atrzSttsQueryId, atrzSttsTableColumns,   //결재 신청현황
    atrzListQueryId, atrzListTableColumns    //결재 리스트
  } = MainJson;

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const deptInfo = JSON.parse(localStorage.getItem("deptInfo"));
  if (!userInfo) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { signOut } = useAuth();
    signOut();
  }

  const empId = userInfo.empId;
  const empno = userInfo.empno;
  const empNm = userInfo.empNm;
  const jbpsNm = userInfo.jbpsNm;
  let deptNm = "";
  deptInfo.map((item, index) => {
    if (index != 0) {
      deptNm += ","
    }
    deptNm += item.deptNm
  })

  const navigate = useNavigate();
  const [dataSession, setDataSession] = useState([]);

  useEffect(() => {
    setDataSession([{
      empId: empId,
      empno: empno,
      empNm: empNm,
      deptNm: deptNm
    }]);
  }, [])

  useEffect(() => {
    if (!Object.values(dataSession).every((value) => value === "")) {
      pageHandle();
    }
  }, [dataSession])

  // 차수별 시작, 종료일자 
  let flagOrder = new Date().getDate() > 15 ? 1 : 2;
  let orderWorkBgngMm = flagOrder == 1 ? String(Moment(startOfMonth(new Date())).format("YYYYMM")) : String(Moment(new Date()).format("YYYYMM") - 1)

  const pageHandle = async () => {
    setIsLoading(true);
    const params = [
      { queryId: noticeQueryId, type: 'notice' },
      { queryId: trAplyTotQueryId, empId: empId, aplyYm: orderWorkBgngMm, aplyOdr: flagOrder },
      { queryId: atrzSttsQueryId, empId: empId },
      { queryId: atrzListQueryId, empId: empId }
    ];

    try {
      const response = await ApiRequest('/boot/sysMng/mainSearch', params)
      if (response && Object.keys(response).length > 0) {
        setNoticeValues(response.retrieveNotice);
        setTrAplyValues(response.retrieveInptSttus);
        setAplyValues(response.retrieveAtrzAplySttus);
        setAtrzValues(response.retiveAtrzList);
        setIsLoading(false);
      } 
    } catch (error) {
      console.log(error);
    }
  };

  const goReference = () => { //자료실이동
    navigate("/infoInq/ReferenceList", { state: {  empId: empId } });
  };

  const goNotice = () => { //공지사항이동
    navigate("/infoInq/NoticeList", { state: { empId: empId } });
  };

  const goKms = () => { //지식관리시스템이동
    window.open("http://kms.vtw.co.kr/#/login");
  };

  const goConference = () => { //회의실예약이동
    navigate("/humanResourceMng/MeetingRoomManage",
      { state: { empId: empId } });
  };

  const onRowClick = (e) => { //공지사항 테이블 클릭
    navigate("/infoInq/NoticeDetail",
      { state: { id: e.key } })
  };

  const onCellClick = (e) => { //TR 입력 현황 테이블 클릭
    if (0 <= e.columnIndex && e.columnIndex < 4) {
      navigate("/indvdlClm/EmpWorkTime", //근무시간페이지로 이동
        { state: { id: e.key } })
    } else {
      navigate("/indvdlClm/ProjectExpense", //프로젝트비용페이지로 이동
        { state: { id: e.key } })
    }
  };

  //결재 신청 현황 테이블 클릭
  const onAplyRowClick = (e) => {
    if (e.data.tySe === "프로젝트 비용") { //프로젝트비용
      navigate("/indvdlClm/ProjectExpense", { state: { id: e.data.id } });
    } else if (e.data.tySe === "근무시간") { //근무시간 현황
      navigate("/indvdlClm/EmpWorkTime", { state: { id: e.data.id } });
    } else if (e.data.elctrnAtrzTySeCd.startsWith("VTW049")) { //기타 전자결재 내역
      navigate("/elecAtrz/ElecAtrzDetail", { state: { data: e.data, prjctId: e.data.prjctId, sttsCd: e.data.atrzDmndSttsCd } });
    }
  };

  //결재 리스트 테이블 클릭
  const onAtrzRowClick = (e) => {
    if (e.data.tySe === "프로젝트 비용") { //프로젝트비용 (프로젝트시간비용승인)
      navigate("/project/ProjectHrCtAprvDetail", { state: { prjctId: e.data.prjctId, prjctNm: e.data.atrzDmndSttsCd } });
    } else if (e.data.tySe === "근무시간") { //근무시간 현황 (프로젝트시간비용승인)
      navigate("/project/ProjectHrCtAprvDetail", { state: { prjctId: e.data.prjctId, prjctNm: e.data.atrzDmndSttsCd } });
    } else if (e.data.tySe === "프로젝트 승인") { //프로젝트 승인페이지(이동전 데이터 조회)
      projectSearch(e.data.id)
    } else if (e.data.elctrnAtrzTySeCd.startsWith("VTW049")) { //기타 전자결재 내역
      navigate("/elecAtrz/ElecAtrzDetail", { state: { data: e.data, prjctId: e.data.prjctId, sttsCd: e.data.atrzDmndSttsCd } });
    }
  };

  const projectSearch = async (data) => { //프로젝트 승인 상세 화면 이동을 위한 데이터 조회
    try {
      const response = await ApiRequest("/boot/common/queryIdSearch", { queryId: "projectMapper.retrievePrjctAprvList", prjctId: data, empId: empId });
      navigate("/project/ProjectAprvDetail",
        {
          state: {
            id: response[0].prjctId
            , prjctNm: response[0].prjctNm
            , bgtMngOdr: response[0].bgtMngOdr
            , atrzLnSn: response[0].atrzLnSn
            , atrzSttsCd: response[0].atrzSttsCd
            , atrzStepCd: response[0].atrzStepCd
            , nowAtrzStepCd: response[0].nowAtrzStepCd
            , aprvrEmpId: response[0].aprvrEmpId
            , ctrtYmd: response[0].ctrtYmd
            , stbleEndYmd: response[0].stbleEndYmd
          }
        })
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ marginLeft: "1%", marginRight: "1%", marginBottom: '5%' }}>
      {isLoading ? <></> :
      <div className="main-container">
        <div className="main-left-container">
          <div className="emp-info">
            <div><p><strong> 사용자 정보 </strong></p></div>
          </div>
          <TableContainer>
            <Table size="small" aria-label="a dense table" style={{ borderStyle: "solid", borderWidth: "thin", borderColor: "rgb(200, 200, 200)" }}>
              <TableHead>
                <TableRow style={{ borderStyle: "solid" }}>
                  <TableCell align="center" component="th" style={{ backgroundColor: "rgb(221, 221, 221)", width: "90px", fontWeight: "bold" }}>사번</TableCell>
                  <TableCell align="center" style={{ borderWidth: "1px", textAlign: "left" }}>{empno}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow style={{ borderStyle: "solid" }}>
                  <TableCell align="center" component="th" style={{ backgroundColor: "rgb(221, 221, 221)", fontWeight: "bold" }}>성명</TableCell>
                  <TableCell align="center" style={{ borderWidth: "1px", textAlign: "left" }}>{empNm}</TableCell>
                </TableRow>
                <TableRow style={{ borderStyle: "solid" }}>
                  <TableCell align="center" component="th" style={{ backgroundColor: "rgb(221, 221, 221)", fontWeight: "bold" }}>직위</TableCell>
                  <TableCell align="center" style={{ borderWidth: "1px", textAlign: "left" }}>{jbpsNm}</TableCell>
                </TableRow>
                <TableRow style={{ borderStyle: "solid" }}>
                  <TableCell align="center" component="th" style={{ backgroundColor: "rgb(221, 221, 221)", fontWeight: "bold" }}>소속</TableCell>
                  <TableCell align="center" style={{ borderWidth: "1px", textAlign: "left" }}>{deptNm}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <div className="notice-container" style={{ marginTop: "20px", marginBottom: "10px" }}>
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
            {/* 버튼 그룹 */}
            <div className="main-button-container">
              <Button className="main-button" onClick={goReference} text="자료실" name="jaryu" type="default" />
              <Button className="main-button" onClick={goNotice} text="공지사항" type="default" />
              <Button className="main-button" onClick={goKms} text="지식관리시스템" type="default" />
              <Button className="main-button" onClick={goConference} text="회의실예약" type="default" />
            </div>
          </div>
        </div>

        {/* TR입력 현황 */}
        <div className="main-right-container">
          <div className="container" >
            <p><strong>{orderWorkBgngMm}-{flagOrder}차수 TR입력 현황 </strong></p>
            <CustomTable keyColumn="mdSum" columns={trAplyTableColumns} values={trAplyValues} onCellClick={onCellClick} />
          </div>

          {/* 결재 신청 현황 */}
          <div className="container" style={{ marginTop: "25px" }}>
            <p><strong>결재 신청 현황 </strong></p>
            <CustomTable keyColumn="title" columns={atrzSttsTableColumns} values={aplyValues} onRowClick={onAplyRowClick} noDataText="신청한 결재가 없습니다." wordWrap={true} />
          </div>

          {/* 결재 리스트 */}
          <div className="container" style={{ marginTop: "20px" }}>
            <p><strong>결재 리스트 </strong></p>
            <CustomTable keyColumn="title" columns={atrzListTableColumns} values={atrzValues} onRowClick={onAtrzRowClick} noDataText="진행중인 결재가 없습니다." wordWrap={true} />
          </div>
        </div>
      </div>}
    </div>
  );
};
export default Main;