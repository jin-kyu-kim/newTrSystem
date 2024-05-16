import { withNavigationWatcher } from './contexts/navigation';
import React from "react";

const routes = [
  // 홈
  {
    path: "/home",
    name: "main",
    element: React.lazy(() => import("../../pages/sysMng/Main")),
    isPrivate:"USER"
  },
  // 로그인
  {
    path: "/LoginFrom",
    name: "LoginFrom",
    element: React.lazy(() => import("../../pages/login/LoginFrom"))
  },
  // 프로젝트
  {
    path: "/project/ProjectList",
    name: "ProjectList",
    element: React.lazy(() => import("../../pages/project/manage/ProjectList")),
    isPrivate:"VTW04807"
  },
  // 프로젝트 승인
  {
    path: "/project/ProjectAprv",
    name: "ProjectAprv",
    element: React.lazy(() => import("../../pages/project/approval/ProjectAprv")),
    isPrivate:"VTW04807"
  },
  // 프로젝트 시간비용승인
  {
    path: "/project/ProjectHrCtAprv",
    name: "ProjectHrCtAprv",
    element: React.lazy(() => import("../../pages/project/approval/ProjectHrCtAprv")),
    isPrivate:"VTW04807"
  },
  // 프로젝트 시간비용승인상세
  {
    path: "/project/ProjectHrCtAprvDetail",
    name: "ProjectHrCtAprvDetail",
    element: React.lazy(() => import("../../pages/project/approval/ProjectHrCtAprvDetail")),
    isPrivate:"VTW04807"
  },
  // 프로젝트 외주비용승인
  {
    path: "/project/ProjectOutordAprv",
    name: "ProjectOutordAprv",
    element: React.lazy(() => import("../../pages/project/approval/ProjectOutordAprv")),
    isPrivate:"VTW04807"
  },
  // 프로젝트 외주비용승인 상세
  {
    path: "/project/ProjectOutordAprvDetail",
    name: "ProjectOutordAprvDetail",
    element: React.lazy(() => import("../../pages/project/approval/ProjectOutordAprvDetail")),
    isPrivate:"VTW04807"
  },
  // 프로젝트 디테일
  {
    path: "/project/ProjectDetail",
    name: "ProjectDetail",
    element: React.lazy(() => import("../../pages/project/manage/ProjectDetail")),
    isPrivate:"VTW04807"
  },
  // 프로젝트 변경
  {
    path: "/project/ProjectChange",
    name: "ProjectChange",
    element: React.lazy(() => import("../../pages/project/manage/ProjectChange")),
    isPrivate:"VTW04807"
  },
  // 프로젝트 승인 상세
  {
    path: "/project/ProjectAprvDetail",
    name: "ProjectAprvDetail",
    element: React.lazy(() => import("../../pages/project/approval/ProjectAprvDetail")),
    isPrivate:"VTW04807"
  },
  // 프로젝트 외주업체 관리 - 업체목록
  {
    path: "/project/ProjectOutordCompany",
    name: "ProjectOutordCompany",
    element: React.lazy(() => import("../../pages/project/manage/ProjectOutordCompany")),
    isPrivate:true
  },
  // 프로젝트 외주업체 관리 - 직원목록
  {
    path: "/project/ProjectOutordEmp",
    name: "ProjectOutordEmp",
    element: React.lazy(() => import("../../pages/project/manage/ProjectOutordEmp")),
    isPrivate:true
  },
  // 권한관리
  {
    path: "/sysMng/EmpAuth",
    name: "EmpAuth",
    element: React.lazy(() => import("../../pages/sysMng/EmpAuth")),
    isPrivate:"VTW04801"
  },
  // 고객사관리
  {
    path: "/sysMng/CustomersList",
    name: "CustomersList",
    element: React.lazy(() => import("../../pages/sysMng/CustomersList")),
    isPrivate:"VTW04803"
  },
  // 코드 관리
  {
    path: "/sysMng/TrsCode",
    name: "TrsCode",
    element: React.lazy(() => import("../../pages/sysMng/TrsCode")),
    isPrivate:"VTW04803"
  },
  // 공지사항
  {
    path: "/infoInq/NoticeList",
    name: "NoticeList",
    element: React.lazy(() => import("../../pages/infoInq/NoticeList")),
    isPrivate:"USER"
  },
  // 공지사항 디테일
  {
    path: "/infoInq/NoticeDetail",
    name: "NoticeDetail",
    element: React.lazy(() => import("../../pages/infoInq/NoticeDetail")),
    isPrivate:"USER"
  },
  // 공지사항 등록
  {
    path: "/infoInq/NoticeInput",
    name: "NoticeInput",
    element: React.lazy(() => import("../../pages/infoInq/NoticeInput")),
    isPrivate:"USER"
  },
  // 자료실
  {
    path: "/infoInq/ReferenceList",
    name: "NoticeList",
    element: React.lazy(() => import("../../pages/infoInq/ReferenceList")),
    isPrivate:"USER"
  },
  // 자료실 상세
  {
    path: "/infoInq/ReferenceDetail",
    name: "NoticeDetail",
    element: React.lazy(() => import("../../pages/infoInq/ReferenceDetail")),
    isPrivate:"USER"
  },
  // 자료실 등록
  {
    path: "/infoInq/ReferenceInput",
    name: "NoticeInput",
    element: React.lazy(() => import("../../pages/infoInq/ReferenceInput")),
    isPrivate:"USER"
  },
  //직원조회
  {
    path: "/infoInq/EmpList",
    name: "EmpList",
    element: React.lazy(() => import("../../pages/infoInq/EmpList")),
    isPrivate:"USER"
  },
  // 월별휴가정보
  {
    path: "/humanResourceMng/EmpMonthVacInfo",
    name: "EmpMonthVacInfo",
    element: React.lazy(() => import("../../pages/humanResourceMng/EmpMonthVacInfo")),
    isPrivate:"VTW04805"
  },
  // 회의실예약관리
  {
    path: "/humanResourceMng/MeetingRoomManage",
    name: "MeetingRoomManage",
    element: React.lazy(() => import("../../pages/humanResourceMng/MeetingRoomManage")),
    isPrivate:"VTW04805"
  },
  // 인사관리 휴가사용내역
  {
    path: "/humanResourceMng/EmpVacUseList",
    name: "EmpVacUseList",
    element: React.lazy(() => import("../../pages/humanResourceMng/EmpVacUseList")),
    isPrivate:"VTW04805"
  },
  //부서 관리
  {
    path: "/humanResourceMng/DeptManage",
    name: "DeptManage",
    element: React.lazy(() => import("../../pages/humanResourceMng/DeptManage")),
    isPrivate:"VTW04805"
  },
  //휴가배정관리
  {
    path: "/humanResourceMng/EmpVcatnAltmntMng",
    name: "EmpVcatnAltmntMng",
    element: React.lazy(() => import("../../pages/humanResourceMng/EmpVcatnAltmntMng")),
    isPrivate:"VTW04805"
  },
  //직원 관리
  {
    path: "/humanResourceMng/EmpManage",
    name: "EmpManage",
    element: React.lazy(() => import("../../pages/humanResourceMng/EmpManage")),
    isPrivate:"VTW04805"
  },
  // 법제도
  // {
  //   path: "/infoInq/LawRules",
  //   name: "LawRules",
  //   element: React.lazy(() => import("../../pages/infoInq/LawRules")),
  //   isPrivate:"USER"
  // },
  //개인정보
  {
    path: "/infoInq/EmpDetailInfo",
    name: "EmpDetailInfo",
    element: React.lazy(() => import("../../pages/infoInq/EmpDetailInfo")),
    isPrivate:"USER"
  },
  // 재무 관리 > 프로젝트비용청구현황
  {
    path: "/fnnrMng/ProjectClaimCost",
    name: "ProjectClaimCost",
    element: React.lazy(() => import("../../pages/fnnrMng/ProjectClaimCost")),
    isPrivate:"VTW04804"
  },
  // 재무 관리 > 프로젝트비용청구현황 상세조회
  {
    path: "/fnnrMng/ProjectClaimCostDetail",
    name: "ProjectClaimCostDetail",
    element: React.lazy(() => import("../../pages/fnnrMng/ProjectClaimCostDetail")),
    isPrivate:"VTW04804"
  },
  // 개인청구 > 근무시간
  {
    path: "/indvdlClm/EmpWorkTime",
    name: "EmpWorkTime",
    element: React.lazy(() => import("../../pages/indvdlClm/EmpWorkTime")),
    isPrivate:"USER"
  },
  // 개인청구 > 휴가
  {
    path: "/indvdlClm/EmpVacation",
    name: "EmpVacation",
    element: React.lazy(() => import("../../pages/indvdlClm/EmpVacation")),
    isPrivate:"USER"
  },
  // 재무 관리 > 근무시간비용 입력현황
  {
    path: "/fnnrMng/TimeExpenseInsertSttus",
    name: "TimeExpenseInsertSttus",
    element: React.lazy(() => import("../../pages/fnnrMng/TimeExpenseInsertSttus")),
    isPrivate:"VTW04804"
  },
  // 재무 관리 > 근무시간비용 입력현황 > 마감 화면
  {
    path: "/fnnrMng/TimeExpenseClosingList",
    name: "TimeExpenseClosingList",
    element: React.lazy(() => import("../../pages/fnnrMng/TimeExpenseClosingList")),
    isPrivate:"VTW04804"
  },
  // 재무 관리 > 비용엑셀 업로드
  {
    path: "/fnnrMng/CorpCardCtUld",
    name: "CorpCardCtUld",
    element: React.lazy(() => import("../../pages/fnnrMng/CorpCardCtUld")),
    isPrivate:"VTW04804"
  },
  // 개인 청구 > 문화체력비용
  {
    path: "/indvdlClm/CultureHealthCost",
    name: "CultureHealthCost",
    element: React.lazy(() => import("../../pages/indvdlClm/CultureHealthCost")),
    isPrivate:"USER"
  },
  // 개인 청구 > 프로젝트비용
  {
    path: "/indvdlClm/ProjectExpense",
    name: "ProjectExpense",
    element: React.lazy(() => import("../../pages/indvdlClm/ProjectExpense")),
    isPrivate:"USER"
  },
  // 재무 관리 > 근무시간 승인내역
  {
    path: "/fnnrMng/EmpTimeAprvList",
    name: "EmpTimeAprvList",
    element: React.lazy(() => import("../../pages/fnnrMng/EmpTimeAprvList")),
    isPrivate:"VTW04804"
  },

  // 재무 관리 > 근무시간, 경비통합
  {
    path: "/fnnrMng/EmpTRCostTotal",
    name: "EmpTRCostTotal",
    element: React.lazy(() => import("../../pages/fnnrMng/EmpTRCostTotal")),
    isPrivate:"VTW04804"
  },
  // 재무 관리 > 경비승인내역
  {
    path: "/fnnrMng/EmpExpenseAprvList",
    name: "EmpExpenseAprvList",
    element: React.lazy(() => import("../../pages/fnnrMng/EmpExpenseAprvList")),
    isPrivate:"VTW04804"
  },
  // 관리자메뉴 > 전자결재서식관리
  {
    path: "/mngrMenu/ElecAtrzFormManage",
    name: "ElecAtrzFormManage",
    element: React.lazy(() => import("../../pages/mngrMenu/ElecAtrzFormManage")),
    isPrivate:"VTW04801"
  },
  // 관리자메뉴 > 전자결재서식관리 > 신규서식작성
  {
    path: "/mngrMenu/ElecAtrzNewForm",
    name: "ElecAtrzNewForm",
    element: React.lazy(() => import("../../pages/mngrMenu/ElecAtrzNewForm")),
    isPrivate:"VTW04801"
  },
  // 관리자메뉴 > 전자결재(관리자)
  {
    path: "/mngrMenu/ElecAtrzManage",
    name: "ElecAtrzManage",
    element: React.lazy(() => import("../../pages/mngrMenu/ElecAtrzManage")),
    isPrivate:"VTW04801"
  },
  // 전자결재 
  {
    path: "/elecAtrz/ElecAtrz",
    name: "ElecAtrz",
    element: React.lazy(() => import("../../pages/elecAtrz/ElecAtrz")),
    isPrivate:"USER"
  },
  // 전자결재 신규기안 작성 
  {
    path: "/elecAtrz/ElecAtrzNewReq",
    name: "ElecAtrzNewReq",
    element: React.lazy(() => import("../../pages/elecAtrz/ElecAtrzNewReq")),
    isPrivate:"USER"
  },
  // 전자결재 지급 목록 
  {
    path: "/elecAtrz/ElecGiveAtrz",
    name: "ElecGiveAtrz",
    element: React.lazy(() => import("../../pages/elecAtrz/ElecGiveAtrz")),
    isPrivate:"USER"
  },
  // 전자결재 서식
  {
    path: "/elecAtrz/ElecAtrzForm",
    name: "ElecAtrzForm",
    element: React.lazy(() => import("../../pages/elecAtrz/ElecAtrzForm")),
    isPrivate:"USER"
  },// 전자결재 상세
  {
    path: "/elecAtrz/ElecAtrzDetail",
    name: "ElecAtrzDetail",
    element: React.lazy(() => import("../../pages/elecAtrz/ElecAtrzDetail")),
    isPrivate:"USER"
  },
  {// 재무 관리 > 문화체련비 관리
    path: "/fnnrMng/EmpCultHealthCostManage",
    name: "EmpCultHealthCostManage",
    element: React.lazy(() => import("../../pages/fnnrMng/EmpCultHealthCostManage")),
    isPrivate:"VTW04804"
  },
  {// 재무 관리 > 문화체련비 관리 > 문화체련비 관리 마감 목록
    path: "/fnnrMng/EmpCultHealthCostManageDeadLine",
    name: "EmpCultHealthCostManageDeadLine",
    element: React.lazy(() => import("../../pages/fnnrMng/EmpCultHealthCostManageDeadLine")),
    isPrivate:"VTW04804"
  },
  {// 회의실 예약
    path: "/humanResourceMng/MeetingRoomManage2",
    name: "MeetingRoomManage2",
    element: React.lazy(() => import("../../pages/humanResourceMng/MeetingRoomManage")),
    isPrivate:"VTW04805"
  }
];

export default routes.map(route => {
  return {
    ...route,
    element: withNavigationWatcher(route.element, route.path)
  };
});
