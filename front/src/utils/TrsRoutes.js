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
  {
    path: "/project/ProjectHrCtAprv",
    name: "ProjectHrCtAprv",
    element: React.lazy(() => import("../pages/project/approval/ProjectHrCtAprv")),
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
    path: "/humanResourceMng/dept/DeptManage",
    name: "DeptManage",
<<<<<<< HEAD
    element: React.lazy(() => import("../pages/humanResourceMng/dept/DeptManage")),
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
=======
    element: React.lazy(() => import("../pages/humanResourceMng/DeptManage")),
>>>>>>> 01ec1f79fdfb53f452807a6e29f95cfcad190040
  }
  
];

export default TreRoutes;
