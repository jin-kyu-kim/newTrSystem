import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/Style.css";
import Header from "./components/composite/Header.js";
import TreRoutes from "./utils/TrsRoutes.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { Suspense, useState, useEffect } from "react";
import LoginForm from "./pages/login/LoginFrom.js";
import { CookiesProvider, useCookies } from "react-cookie";

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
