import React, { lazy } from "react";

const TreRoutes = [
  // 홈
  {
    path: "/infoInq/EmpDetailInfo",
    name: "main",
    element: React.lazy(() =>
      import("../pages/infoInq/EmpDetailInfo")
    ),
  },
  // 로그인
  {
    path: "/LoginFrom",
    name: "LoginFrom",
    element: React.lazy(() => import("../pages/login/LoginFrom")),
  },
  // 프로젝트
  {
    path: "/project/ProjectList",
    name: "ProjectList",
    element: React.lazy(() => import("../pages/project/manage/ProjectList")),
  },
  // 프로젝트 승인
  {
    path: "/project/ProjectAprv",
    name: "ProjectAprv",
    element: React.lazy(() => import("../pages/project/approval/ProjectAprv")),
  },
  // 프로젝트 시간비용승인
  {
    path: "/project/ProjectHrCtAprv",
    name: "ProjectHrCtAprv",
    element: React.lazy(() => import("../pages/project/approval/ProjectHrCtAprv")),
  },
  // 프로젝트 시간비용승인상세
  {
    path: "/project/ProjectHrCtAprvDetail",
    name: "ProjectHrCtAprvDetail",
    element: React.lazy(() => import("../pages/project/approval/ProjectHrCtAprvDetail")),
  },
  // 프로젝트 외주비용승인
  {
    path: "/project/ProjectOutordPerson",
    name: "ProjectOutordPerson",
    element: React.lazy(() => import("../pages/project/approval/ProjectOutordPerson")),
  },
  // 프로젝트 디테일
  {
    path: "/project/ProjectDetail",
    name: "ProjectDetail",
    element: React.lazy(() => import("../pages/project/manage/ProjectDetail")),
  },
  // 프로젝트 변경
  {
    path: "/project/ProjectChange",
    name: "ProjectChange",
    element: React.lazy(() => import("../pages/project/manage/ProjectChange")),
  },
  // 프로젝트 승인 상세
  {
    path: "/project/ProjectAprvDetail",
    name: "ProjectAprvDetail",
    element: React.lazy(() => import("../pages/project/approval/ProjectAprvDetail")),
  },
   // 고객사관리
  {
    path: "/sysMng/CustomersList",
    name: "CustomersList",
    element: React.lazy(() => import("../pages/sysMng/CustomersList")),
  },
  // 코드 관리
  {
    path: "/sysMng/TrsCodeList",
    name: "TrsCodeList",
    element: React.lazy(() => import("../pages/sysMng/TrsCodeList")),
  },
  // 공지사항
  {
    path: "/infoInq/NoticeList",
    name: "NoticeList",
    element: React.lazy(() => import("../pages/infoInq/NoticeList")),
  },
  // 공지사항 디테일
  {
    path: "/infoInq/NoticeDetail",
    name: "NoticeDetail",
    element: React.lazy(() => import("../pages/infoInq/NoticeDetail"))
  },
  // 공지사항 등록
  {
    path: "/infoInq/NoticeInput",
    name: "NoticeInput",
    element: React.lazy(() => import("../pages/infoInq/NoticeInput"))
  },
  // 자료실
  {
    path: "/infoInq/ReferenceList",
    name: "NoticeList",
    element: React.lazy(() => import("../pages/infoInq/ReferenceList")),
  },
  // 자료실 상세
  {
    path: "/infoInq/ReferenceDetail",
    name: "NoticeDetail",
    element: React.lazy(() => import("../pages/infoInq/ReferenceDetail"))
  },
  // 자료실 등록
  {
    path: "/infoInq/ReferenceInput",
    name: "NoticeInput",
    element: React.lazy(() => import("../pages/infoInq/ReferenceInput"))
  },
  //직원조회
  {
    path: "/infoInq/EmpList",
    name: "EmpList",
    element: React.lazy(() => import("../pages/infoInq/EmpList")),
  },
  // 월별휴가정보
  {
    path: "/humanResourceMng/EmpMonthVacInfo",
    name: "EmpMonthVacInfo",
    element: React.lazy(() => import("../pages/humanResourceMng/EmpMonthVacInfo")),
  },
  // 회의실예약관리
  {
    path: "/humanResourceMng/MeetingRoomManage",
    name: "MeetingRoomManage",
    element: React.lazy(() => import("../pages/humanResourceMng/MeetingRoomManage")),
  },
   // 인사관리 휴가사용내역
   {
    path: "/humanResourceMng/EmpVacUseList",
    name: "EmpVacUseList",
    element: React.lazy(() => import("../pages/humanResourceMng/EmpVacUseList")),
  },
  //부서 관리
  {
    path: "/humanResourceMng/DeptManage",
    name: "DeptManage",
    element: React.lazy(() => import("../pages/humanResourceMng/DeptManage")),
  },
  //휴가배정관리
  {
    path: "/humanResourceMng/EmpVcatnAltmntMng",
    name: "EmpVcatnAltmntMng",
    element: React.lazy(() => import("../pages/humanResourceMng/EmpVcatnAltmntMng")),
  },
  //직원 관리
  {
    path: "humanResourceMng/EmpManage",
    name: "EmpManage",
    element: React.lazy(() => import("../pages/humanResourceMng/EmpManage")),
  },
 // 법제도
  {
    path: "/infoInq/LawRules",
    name: "LawRules",
    element: React.lazy(() => import("../pages/infoInq/LawRules")),
  },
  //개인정보
  {
    path: "/infoInq/EmpDetailInfo",
    name: "EmpDetailInfo",
    element: React.lazy(() => import("../pages/infoInq/EmpDetailInfo")),
  },
  // 재무 관리 > 프로젝트비용청구현황
  {
    path: "/fnnrMng/ProjectClaimCost",
    name: "ProjectClaimCost",
    element: React.lazy(() => import("../pages/fnnrMng/ProjectClaimCost")),
  },
  // 재무 관리 > 프로젝트비용청구현황 상세조회
  {
    path: "/fnnrMng/ProjectClaimCostDetail",
    name: "ProjectCostClaimDetail",
    element: React.lazy(() => import("../pages/fnnrMng/prjctCtClm/ProjectCostClaimDetail")),
  },
  // 개인청구 > 근무시간
  {
    path: "/indvdlClm/EmpWorkTime",
    name: "EmpWorkTime",
    element: React.lazy(() => import("../pages/indvdlClm/EmpWorkTime")),
  },
  // 개인청구 > 휴가
  {
    path: "/indvdlClm/EmpVacation",
    name: "EmpVacation",
    element: React.lazy(() => import("../pages/indvdlClm/EmpVacation")),
  },
   // 재무 관리 > 근무시간비용 입력현황
   {
    path: "/fnnrMng/TimeExpenseInsertSttus",
    name: "TimeExpenseInsertSttus",
    element: React.lazy(() => import("../pages/fnnrMng/TimeExpenseInsertSttus")),
   },
  // 개인 청구 > 문화체력비용
  {
    path: "/indvdlClm/CultureHealthCost",
    name: "ProjectClaimCostDetail",
    element: React.lazy(() => import("../pages/fnnrMng/ProjectClaimCostDetail")),
  },

  // 재무 관리 > 근무시간 승인내역
  {
    path: "/fnnrMng/EmpTimeAprvList",
    name: "EmpTimeAprvList",
    element: React.lazy(() => import("../pages/fnnrMng/EmpTimeAprvList")),
  },

   // 재무 관리 > 근무시간, 경비통합
   {
    path: "/fnnrMng/EmpTRCostTotal",
    name: "EmpTRCostTotal",
    element: React.lazy(() => import("../pages/fnnrMng/EmpTRCostTotal")),
  },
  // 개인 청구 > 문화체력비용
  {
    path: "/indvdlClm/CultureHealthCost",
    name: "CultureHealthCost",
    element: React.lazy(() => import("../pages/indvdlClm/CultureHealthCost")),
  }

];

export default TreRoutes;
