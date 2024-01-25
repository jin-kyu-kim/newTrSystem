import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Header from "./components/composite/Header.js";
import TreRoutes from "./utils/TrsRoutes.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { Suspense } from "react";

import 'devextreme/dist/css/dx.common.css'
import 'devextreme/dist/css/dx.light.css'

function App() {
  const loading = (
    <div style={{ backgroundColor: "white", height: "1000px" }}></div>
  );
  return (
    <div>
      <Suspense fallback={loading}>
        <Router>
          <Header />
          <Routes>
            {TreRoutes.map((route, idx) => {
              return (
                <Route
                  key={idx}
                  name={route.name}
                  path={route.path}
                  element={<route.element />}
                />
              );
            })}
          </Routes>
        </Router>
      </Suspense>
    </div>
  );
}

export default App;
