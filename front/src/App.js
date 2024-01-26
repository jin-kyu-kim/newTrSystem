import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/Style.css";
import Header from "./components/composite/Header.js";
import TreRoutes from "./utils/TrsRoutes.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { Suspense, useState, useEffect } from "react";
import LoginForm from "./pages/common/LoginFrom.js";
import { CookiesProvider, useCookies } from "react-cookie";

import 'devextreme/dist/css/dx.common.css'
import 'devextreme/dist/css/dx.light.css'

function App() {
  const [isLoggedIn, setLoggedIn] = useState(() => {
    const storedLoginStatus = localStorage.getItem("isLoggedIn");
    return storedLoginStatus ? JSON.parse(storedLoginStatus) : false;
  });

  const [cookies] = useCookies([]);

  useEffect(() => {
    localStorage.setItem("isLoggedIn", JSON.stringify(isLoggedIn));
  }, [isLoggedIn]);
  const loading = (
    <div style={{ backgroundColor: "white", height: "1000px" }}></div>
  );

  const handleLogin = () => {
    setLoggedIn(true);
    console.log(cookies.userInfo);
    console.log(cookies.userAuth);
  };

  // 로그인된 경우 라우트를 보여주고, 그렇지 않은 경우 로그인 페이지로 리디렉션
  const renderRoutes = () => {
    if (isLoggedIn) {
      return (
        <Router>
          <Header />
          <Routes>
            {TreRoutes.map((route, idx) => (
              <Route
                key={idx}
                name={route.name}
                path={route.path}
                element={<route.element />}
              />
            ))}
          </Routes>
        </Router>
      );
    } else {
      return (
        <Router>
          <LoginForm handleLogin={handleLogin} />;
        </Router>
      );
    }
  };

  return (
    <div>
      <CookiesProvider>
        <Suspense fallback={loading}>{renderRoutes()}</Suspense>
      </CookiesProvider>
    </div>
  );
}

export default App;
