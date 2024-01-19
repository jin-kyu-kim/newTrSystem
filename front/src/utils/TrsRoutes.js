import React, { lazy } from "react";

const TreRoutes = [
  // 로그인
  {
    path: "/",
    name: "main",
    element: React.lazy(() =>
      import("../pages/infoInq/person/personDetail/DetailMain")
    ),
  },
  // 프로젝트
  {
    path: "/project/*",
    name: "ProjectList",
    element: React.lazy(() => import("../pages/project/ProjectList")),
  },
];

export default TreRoutes;
