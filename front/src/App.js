import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/Style.css";
import Header from "./components/composite/Header.js";
import TreRoutes from "./utils/TrsRoutes.js";
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import React, { Suspense, useState, useEffect } from "react";
import LoginForm from "./pages/login/LoginFrom.jsx";
import { CookiesProvider } from "react-cookie";

function App() {
  const [isLoggedIn, setLoggedIn] = useState(() => {
    const storedLoginStatus = localStorage.getItem("isLoggedIn"); //sessionStorage
    return storedLoginStatus ? JSON.parse(storedLoginStatus) : false;
  });

  useEffect(() => {
    localStorage.setItem("isLoggedIn", JSON.stringify(isLoggedIn));
  }, [localStorage]);
  const loading = (
    <div style={{ backgroundColor: "white", height: "1000px" }}></div>
  );

  const handleLogin = (isOk) => {
    console.log(isOk)
    setLoggedIn(isOk);
  };

  const renderRoutes = () => {
    if (isLoggedIn) {
      return (
        <Router>
          <CookiesProvider>
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
          </CookiesProvider>
        </Router>
      );
    } else {
      return (
        <Router>
          <Navigate to="/" />
          <LoginForm handleLogin={handleLogin} />;
        </Router>
      );
    }
  };

  return (
    <div>
      <Suspense fallback={loading}>{renderRoutes()}</Suspense>
    </div>
  );
}

export default App;
