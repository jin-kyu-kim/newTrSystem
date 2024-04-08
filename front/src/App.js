// import "bootstrap/dist/css/bootstrap.min.css";
// import "./assets/css/Style.css";
// import Header from "./components/composite/Header.js";
// import TreRoutes from "./utils/TrsRoutes.js";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import React, { Suspense, useState, useEffect } from "react";
// import LoginForm from "./pages/login/LoginFrom.jsx";
// import { CookiesProvider } from "react-cookie";

// function App() {
//   const [isLoggedIn, setLoggedIn] = useState(() => {
//     const storedLoginStatus = localStorage.getItem("isLoggedIn"); //sessionStorage
//     return storedLoginStatus ? JSON.parse(storedLoginStatus) : false;
//   });

//   useEffect(() => {
//     localStorage.setItem("isLoggedIn", JSON.stringify(isLoggedIn));
//   }, [localStorage]);
//   const loading = (
//     <div style={{ backgroundColor: "white", height: "1000px" }}></div>
//   );

//   const handleLogin = (isOk) => {
//     console.log(isOk)
//     setLoggedIn(isOk);
//   };

//   const renderRoutes = () => {
//     if (isLoggedIn) {
//       return (
//         <Router>
//           <CookiesProvider>
//             <Header />
//             <Routes>
//               {TreRoutes.map((route, idx) => (
//                 <Route
//                   key={idx}
//                   name={route.name}
//                   path={route.path}
//                   element={<route.element />}
//                 />
//               ))}
//             </Routes>
//           </CookiesProvider>
//         </Router>
//       );
//     } else {
//       return (
//         <Router>
//           <LoginForm handleLogin={handleLogin} />;
//         </Router>
//       );
//     }
//   };

//   return (
//     <div>
//       <Suspense fallback={loading}>{renderRoutes()}</Suspense>
//     </div>
//   );
// }

// export default App;


import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/Style.css";
import 'devextreme/dist/css/dx.common.css';
import './components/sidebar/themes/generated/theme.base.css';
import './components/sidebar/themes/generated/theme.additional.css';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './dx-styles.scss';
import LoadPanel from 'devextreme-react/load-panel';
import { NavigationProvider } from './components/sidebar/contexts/navigation';
import { AuthProvider, useAuth } from './components/sidebar/contexts/auth';
import { useScreenSizeClass } from './components/sidebar/utils/media-query';
import Content from './components/sidebar/Content';
import { Suspense, useState, useEffect, useTransition } from "react";
import LoginForm from "./pages/login/LoginFrom.jsx";
import { CookiesProvider } from "react-cookie";
import {locale} from 'devextreme/localization';

function App() {

        locale(getLocale());

      function getLocale() {
        const locale = sessionStorage.getItem('locale');
        return locale != null ? locale : 'ko';
      }

      const screenSizeClass = useScreenSizeClass();

      const [isPending,startTransition] = useTransition();

      const [isLoggedIn, setLoggedIn] = useState(() => {
        const storedLoginStatus = localStorage.getItem("isLoggedIn"); //sessionStorage
        return storedLoginStatus ? JSON.parse(storedLoginStatus) : false;
      });
    

      useEffect(() => {
        localStorage.setItem("isLoggedIn", JSON.stringify(isLoggedIn));
      }, [localStorage]);

      // const loading = (
      //   <div style={{ backgroundColor: "white", height: "1000px" }}> <LoadPanel visible={true} />;</div>
      // );
    
      const handleLogin = (isOk) => {
        console.log(isOk)
        setLoggedIn(isOk);
      };

      const { user, loading } = useAuth();

      if (loading) {
        return <LoadPanel visible={true} />;
      }

      if (user) {
        return <Content/>;
      }

  const renderRoutes = () => {
        if (isLoggedIn) {
          return (
              <Router>
              <CookiesProvider>
                <AuthProvider>
                <NavigationProvider>
                  <div className={`app ${screenSizeClass}`}  style ={ {opacity: isPending ? 0.2 : 1 }}>
                    <App/>
                  </div>
                </NavigationProvider>
              </AuthProvider>
              </CookiesProvider>
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
          <Suspense fallback={loading}>{renderRoutes()}</Suspense>
      );

}

export default App;

