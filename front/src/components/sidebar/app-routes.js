import { withNavigationWatcher } from './contexts/navigation';
import React from "react";

const routes = [
  // 홈
  {
    path: "/home",
    name: "main",
    element: React.lazy(() => import("../../pages/sysMng/Main")),
    isPrivate:true
  },
  // 로그인
  {
    path: "/LoginFrom",
    name: "LoginFrom",
    element: React.lazy(() => import("../../pages/login/LoginFrom")),
    isPrivate:false
  },
  // 프로젝트
  {
    path: "/project/ProjectList",
    name: "ProjectList",
    element: React.lazy(() => import("../../pages/project/manage/ProjectList")),
    isPrivate:true
  },
  // 프로젝트 승인
  {
    path: "/project/ProjectAprv",
    name: "ProjectAprv",
    element: React.lazy(() => import("../../pages/project/approval/ProjectAprv")),
    isPrivate:true
  },
  // 프로젝트 시간비용승인
  {
    path: "/project/ProjectHrCtAprv",
    name: "ProjectHrCtAprv",
    element: React.lazy(() => import("../../pages/project/approval/ProjectHrCtAprv")),
    isPrivate:true
  },
  // 프로젝트 시간비용승인상세
  {
    path: "/project/ProjectHrCtAprvDetail",
    name: "ProjectHrCtAprvDetail",
    element: React.lazy(() => import("../../pages/project/approval/ProjectHrCtAprvDetail")),
    isPrivate:true
  },
  // 프로젝트 외주비용승인
  {
    path: "/project/ProjectOutordAprv",
    name: "ProjectOutordAprv",
    element: React.lazy(() => import("../../pages/project/approval/ProjectOutordAprv")),
    isPrivate:true
  },
  // 프로젝트 외주비용승인 상세
  {
    path: "/project/ProjectOutordAprvDetail",
    name: "ProjectOutordAprvDetail",
    element: React.lazy(() => import("../../pages/project/approval/ProjectOutordAprvDetail")),
    isPrivate:true
  },
  // 프로젝트 디테일
  {
    path: "/project/ProjectDetail",
    name: "ProjectDetail",
    element: React.lazy(() => import("../../pages/project/manage/ProjectDetail")),
    isPrivate:true
  },
  // 프로젝트 변경
  {
    path: "/project/ProjectChange",
    name: "ProjectChange",
    element: React.lazy(() => import("../../pages/project/manage/ProjectChange")),
    isPrivate:true
  },
  // 프로젝트 승인 상세
  {
    path: "/project/ProjectAprvDetail",
    name: "ProjectAprvDetail",
    element: React.lazy(() => import("../../pages/project/approval/ProjectAprvDetail")),
    isPrivate:true
  },
  // 권한관리
  {
    path: "/sysMng/EmpAuth",
    name: "EmpAuth",
    element: React.lazy(() => import("../../pages/sysMng/EmpAuth")),
    isPrivate:true
  },
  // 권한부여관리
  {
    path: "/sysMng/EmpAuthorization",
    name: "EmpAuth",
    element: React.lazy(() => import("../../pages/sysMng/EmpAuthorization")),
    isPrivate:true
  },
  // 고객사관리
  {
    path: "/sysMng/CustomersList",
    name: "CustomersList",
    element: React.lazy(() => import("../../pages/sysMng/CustomersList")),
    isPrivate:true
  },
  // 코드 관리
  {
    path: "/sysMng/TrsCode",
    name: "TrsCode",
    element: React.lazy(() => import("../../pages/sysMng/TrsCode")),
    isPrivate:true
  },
  // 공지사항
  {
    path: "/infoInq/NoticeList",
    name: "NoticeList",
    element: React.lazy(() => import("../../pages/infoInq/NoticeList")),
    isPrivate:true
  },
  // 공지사항 디테일
  {
    path: "/infoInq/NoticeDetail",
    name: "NoticeDetail",
    element: React.lazy(() => import("../../pages/infoInq/NoticeDetail")),
    isPrivate:true
  },
  // 공지사항 등록
  {
    path: "/infoInq/NoticeInput",
    name: "NoticeInput",
    element: React.lazy(() => import("../../pages/infoInq/NoticeInput")),
    isPrivate:true
  },
  // 자료실
  {
    path: "/infoInq/ReferenceList",
    name: "NoticeList",
    element: React.lazy(() => import("../../pages/infoInq/ReferenceList")),
    isPrivate:true
  },
  // 자료실 상세
  {
    path: "/infoInq/ReferenceDetail",
    name: "NoticeDetail",
    element: React.lazy(() => import("../../pages/infoInq/ReferenceDetail")),
    isPrivate:true
  },
  // 자료실 등록
  {
    path: "/infoInq/ReferenceInput",
    name: "NoticeInput",
    element: React.lazy(() => import("../../pages/infoInq/ReferenceInput")),
    isPrivate:true
  },
  //직원조회
  {
    path: "/infoInq/EmpList",
    name: "EmpList",
    element: React.lazy(() => import("../../pages/infoInq/EmpList")),
    isPrivate:true
  },
  // 월별휴가정보
  {
    path: "/humanResourceMng/EmpMonthVacInfo",
    name: "EmpMonthVacInfo",
    element: React.lazy(() => import("../../pages/humanResourceMng/EmpMonthVacInfo")),
    isPrivate:true
  },
  // 회의실예약관리
  {
    path: "/humanResourceMng/MeetingRoomManage",
    name: "MeetingRoomManage",
    element: React.lazy(() => import("../../pages/humanResourceMng/MeetingRoomManage")),
    isPrivate:true
  },
  // 인사관리 휴가사용내역
  {
    path: "/humanResourceMng/EmpVacUseList",
    name: "EmpVacUseList",
    element: React.lazy(() => import("../../pages/humanResourceMng/EmpVacUseList")),
    isPrivate:true
  },
  //부서 관리
  {
    path: "/humanResourceMng/DeptManage",
    name: "DeptManage",
    element: React.lazy(() => import("../../pages/humanResourceMng/DeptManage")),
    isPrivate:true
  },
  //휴가배정관리
  {
    path: "/humanResourceMng/EmpVcatnAltmntMng",
    name: "EmpVcatnAltmntMng",
    element: React.lazy(() => import("../../pages/humanResourceMng/EmpVcatnAltmntMng")),
    isPrivate:true
  },
  //직원 관리
  {
    path: "/humanResourceMng/EmpManage",
    name: "EmpManage",
    element: React.lazy(() => import("../../pages/humanResourceMng/EmpManage")),
    isPrivate:true
  },
  // 법제도
  {
    path: "/infoInq/LawRules",
    name: "LawRules",
    element: React.lazy(() => import("../../pages/infoInq/LawRules")),
    isPrivate:true
  },
  //개인정보
  {
    path: "/infoInq/EmpDetailInfo",
    name: "EmpDetailInfo",
    element: React.lazy(() => import("../../pages/infoInq/EmpDetailInfo")),
    isPrivate:true
  },
  // 재무 관리 > 프로젝트비용청구현황
  {
    path: "/fnnrMng/ProjectClaimCost",
    name: "ProjectClaimCost",
    element: React.lazy(() => import("../../pages/fnnrMng/ProjectClaimCost")),
    isPrivate:true
  },
  // 재무 관리 > 프로젝트비용청구현황 상세조회
  {
    path: "/fnnrMng/ProjectClaimCostDetail",
    name: "ProjectClaimCostDetail",
    element: React.lazy(() => import("../../pages/fnnrMng/ProjectClaimCostDetail")),
    isPrivate:true
  },
  // 개인청구 > 근무시간
  {
    path: "/indvdlClm/EmpWorkTime",
    name: "EmpWorkTime",
    element: React.lazy(() => import("../../pages/indvdlClm/EmpWorkTime")),
    isPrivate:true
  },
  // 개인청구 > 휴가
  {
    path: "/indvdlClm/EmpVacation",
    name: "EmpVacation",
    element: React.lazy(() => import("../../pages/indvdlClm/EmpVacation")),
    isPrivate:true
  },
  // 재무 관리 > 근무시간비용 입력현황
  {
    path: "/fnnrMng/TimeExpenseInsertSttus",
    name: "TimeExpenseInsertSttus",
    element: React.lazy(() => import("../../pages/fnnrMng/TimeExpenseInsertSttus")),
    isPrivate:true
   },
  // 개인 청구 > 문화체력비용
  {
    path: "/indvdlClm/CultureHealthCost",
    name: "CultureHealthCost",
    element: React.lazy(() => import("../../pages/indvdlClm/CultureHealthCost")),
    isPrivate:true
  },
  // 개인 청구 > 프로젝트비용
  {
    path: "/indvdlClm/ProjectExpense",
    name: "ProjectExpense",
    element: React.lazy(() => import("../../pages/indvdlClm/ProjectExpense")),
    isPrivate:true
  },
  // 재무 관리 > 근무시간 승인내역
  {
    path: "/fnnrMng/EmpTimeAprvList",
    name: "EmpTimeAprvList",
    element: React.lazy(() => import("../../pages/fnnrMng/EmpTimeAprvList")),
    isPrivate:true
  },

  // 재무 관리 > 근무시간, 경비통합
  {
    path: "/fnnrMng/EmpTRCostTotal",
    name: "EmpTRCostTotal",
    element: React.lazy(() => import("../../pages/fnnrMng/EmpTRCostTotal")),
    isPrivate:true
  },
  // 재무 관리 > 경비승인내역
  {
    path: "/fnnrMng/EmpExpenseAprvList",
    name: "EmpExpenseAprvList",
    element: React.lazy(() => import("../../pages/fnnrMng/EmpExpenseAprvList")),
    isPrivate:true
  },
  // 관리자메뉴 > 전자결재서식관리
  {
    path: "/mngrMenu/ElecAtrzFormManage",
    name: "ElecAtrzFormManage",
    element: React.lazy(() => import("../../pages/mngrMenu/ElecAtrzFormManage")),
    isPrivate:true
  },
  // 관리자메뉴 > 전자결재서식관리 > 신규서식작성
  {
    path: "/mngrMenu/ElecAtrzNewForm",
    name: "ElecAtrzNewForm",
    element: React.lazy(() => import("../../pages/mngrMenu/ElecAtrzNewForm")),
    isPrivate:true
  },
  // 관리자메뉴 > 전자결재(관리자)
  {
    path: "/mngrMenu/ElecAtrzManage",
    name: "ElecAtrzManage",
    element: React.lazy(() => import("../../pages/mngrMenu/ElecAtrzManage")),
    isPrivate:true
  },
  // 전자결재 
  {
    path: "/elecAtrz/ElecAtrz",
    name: "ElecAtrz",
    element: React.lazy(() => import("../../pages/elecAtrz/ElecAtrz")),
    isPrivate:true
  },
  // 전자결재 신규기안 작성 
  {
    path: "/elecAtrz/ElecAtrzNewReq",
    name: "ElecAtrzNewReq",
    element: React.lazy(() => import("../../pages/elecAtrz/ElecAtrzNewReq")),
    isPrivate:true
  },
  // 전자결재 지급 목록 
  {
    path: "/elecAtrz/ElecGiveAtrz",
    name: "ElecGiveAtrz",
    element: React.lazy(() => import("../../pages/elecAtrz/ElecGiveAtrz")),
    isPrivate:true
  },
  // 전자결재 서식
  {
    path: "/elecAtrz/ElecAtrzForm",
    name: "ElecAtrzForm",
    element: React.lazy(() => import("../../pages/elecAtrz/ElecAtrzForm")),
    isPrivate:true
  },// 전자결재 상세
  {
    path: "/elecAtrz/ElecAtrzDetail",
    name: "ElecAtrzDetail",
    element: React.lazy(() => import("../../pages/elecAtrz/ElecAtrzDetail")),
    isPrivate:true
  },
  {// 재무 관리 > 문화체련비 관리
    path: "/fnnrMng/EmpCultHealthCostManage",
    name: "EmpCultHealthCostManage",
    element: React.lazy(() => import("../../pages/fnnrMng/EmpCultHealthCostManage")),
    isPrivate:true
  },
  {// 재무 관리 > 문화체련비 관리 > 문화체련비 관리 마감 목록
    path: "/fnnrMng/EmpCultHealthCostManageDeadLine",
    name: "EmpCultHealthCostManageDeadLine",
    element: React.lazy(() => import("../../pages/fnnrMng/EmpCultHealthCostManageDeadLine")),
    isPrivate:true
  },
  {// 회의실 예약
    path: "/infoInq/MeetingRoomReserv",
    name: "MeetingRoomReserv",
    element: React.lazy(() => import("../../pages/infoInq/MeetingRoomReserv")) ,
    isPrivate:true
  }
];

export default routes.map(route => {
  return {
    ...route,
    element: withNavigationWatcher(route.element, route.path)
  };
});
