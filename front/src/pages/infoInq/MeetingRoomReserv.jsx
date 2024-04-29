import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import  EmpListJson from "../infoInq/EmpListJson.json";
import ApiRequest from "../../utils/ApiRequest";
import CustomTable from "components/unit/CustomTable";
import { BackgroundColor } from "devextreme-react/cjs/chart";
import { CheckBox } from "devextreme-react";
import Calandar from '../../components/unit/CustomScheduler';

function MeetingRoomReserv() {
  const [values, setValues] = useState([]);
  const [param, setParam] = useState({});

  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const { keyColumn, queryId, tableColumns, popup, searchInfo } = EmpListJson;

  useEffect(() => {
    if (!Object.values(param).every((value) => value === "")) {
      pageHandle();
    }
  }, [param]);

  // 검색으로 조회할 때
  const searchHandle = async (initParam) => {
    setParam({
      ...initParam,
      queryId: queryId,
    });
  };

  const pageHandle = async () => {
    try {
      const response = await ApiRequest("/boot/common/queryIdSearch", param);
      setValues(response);
      if (response.length !== 0) {
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDayRender = (info) => {
    // info.date로 현재 렌더링되는 날짜에 접근 가능
    // info.el로 현재 날짜의 HTML 요소에 접근 가능
    info.el.style.cursor = 'pointer'; // 마우스를 올렸을 때 커서 변경
  };


  return (
    <div className="container" >
      <div
        className="title p-1"
        style={{ marginTop: "20px", marginBottom: "10px" }}
      >
        <h1 style={{ fontSize: "40px" }}>회의실 예약</h1>
      </div>
      <div className="col-md-10 mx-auto" style={{ marginBottom: "10px" }}>
      <span >* 회의실 예약 내역 조회, 예약 및 예약수정이 가능합니다.</span><br></br>
        <span>* 회의실 예약 시작 시간이 지난경우 예약 수정 및 취소는 불가합니다.</span> <br></br><br></br>
        <span>* 소회의실 - <span style={{backgroundColor: "#ffb88a" ,color:"#fff"}}>4인실</span> | 중회의실 - 
        <span style={{backgroundColor: "#767BF7", color:"#fff"}}>10인실</span>  | 대회의실 -    
        <span style={{backgroundColor: "#81d468", color:"#fff"}}>16인실</span>   </span><br></br>
        <CheckBox style={{marginTop :"30px"}}
              text="내 예약만 보기"
            />   
      </div>
      
      <div style={{ marginTop: "20px" }}>
      <Calandar
       // values={calendarData}
        headerToolbar={{
          left : "today prev next",
          center: "title",
          right: "dayGridMonth,timeGridWeek",
          locale:"ko"
        }}
        initialView="timeGridWeek"
        initCssBoolean={true}
        locale="ko"
        dayRender={handleDayRender} 
        // locales={[koLocale]}
       // initCssMenu={/* your menu configuration */}
      />
      </div>

      
     
    </div>
  );
};

export default MeetingRoomReserv;