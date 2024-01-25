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
    element: React.lazy(() => import("../pages/common/LoginFrom")),
  },
  // 프로젝트
  {
    path: "/project/ProjectList",
    name: "ProjectList",
    element: React.lazy(() => import("../pages/project/ProjectList")),
  },
  // 프로젝트 승인
  {
    path: "/project/ProjectAprv",
    name: "ProjectAprv",
    element: React.lazy(() => import("../pages/project/ProjectAprv")),
  },
  {
    path: "/project/ProjectHrCtAprv",
    name: "ProjectHrCtAprv",
    element: React.lazy(() => import("../pages/project/ProjectHrCtAprv")),
  },
];

export default TreRoutes;
