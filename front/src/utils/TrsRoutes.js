import React, { lazy } from "react";

const TreRoutes = [
  // 홈
  {
    path: "/",
    name: "main",
    element: React.lazy(() =>
      import("../pages/infoInq/person/personDetail/DetailMain")
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
];

export default TreRoutes;
