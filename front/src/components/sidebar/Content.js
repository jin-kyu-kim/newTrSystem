import { Routes, Route, Navigate } from 'react-router-dom';
import routes from './app-routes';
import { SideNavInnerToolbar as SideNavBarLayout } from './layouts';
import { Footer } from './components';
import React, {useTransition} from 'react';
import { useScreenSizeClass } from './utils/media-query';
import {useCookies} from "react-cookie";

function CheckAuth(isPrivate){
    // 토큰이 저장된 상태를 검사하는 로직
    const token = localStorage.getItem('token');
    const [cookies] = useCookies(["userInfo", "userAuth","deptInfo"]);

    if(token && isPrivate && cookies.userAuth !== undefined){
        if(cookies.userAuth.find(item => item === "VTW04801")){
            return "TRUE";
        }

        const isPrivateFound = cookies.userAuth.some(item => item === isPrivate);
        if(isPrivateFound){
            return "TRUE";
        }else{
            return "HOME";
        }
    }else{
        return "FALSE";
    }
}

const PrivateRoute = ({ children,isPrivate }) => {
    const isAuthenticated = CheckAuth(isPrivate);
    // 인증이 안 된 경우 로그인 페이지로 리다이렉트
    if(isAuthenticated === "TRUE"){
        return children
    }else if(isAuthenticated === "HOME"){
        return <Navigate to="/home" />
    }else{
        return <Navigate to="/LoginFrom" />
    }
};

const PublicRoute = ({ children }) => {
    const isAuthenticated = CheckAuth();
    // 인증이 안 된 경우 로그인 페이지로 리다이렉트
    if(isAuthenticated === "FALSE"){
        return children
    }else{
        return <Navigate to="/home" />
    }
};

export default function Content() {
    const screenSizeClass = useScreenSizeClass();
    const [isPending,startTransition] = useTransition();

  return (
<>
      <Routes>
          {routes.map(({ path, element, isPrivate }) => (
              <Route
                  key={path}
                  path={path}
                  element={
                      isPrivate ? (
                        <PrivateRoute isPrivate={isPrivate}>
                          <div className={`app ${screenSizeClass}`} style={{opacity: isPending ? 0.2 : 1}}>
                            <SideNavBarLayout>
                            <div className={'content-block'}>
                                <div className={'dx-card responsive-paddings'}> 
                                {React.createElement(element)}
                                </div>
                                <div style={{paddingBottom:"20px" }}>
                                <Footer>
                                    Copyright © 2024 VTW Inc TRSystem.
                                        <br />
                                        All trademarks or registered trademarks are property of their respective owners.
                                 </Footer>
                                </div>
                              </div>
                            </SideNavBarLayout>
                          </div>
                        </PrivateRoute>
                      ) : (
                        <PublicRoute>
                          {React.createElement(element)}
                        </PublicRoute>
                      )
                  }
              />
          ))}
          <Route path="*" element={<Navigate to="/home"/>} />
      </Routes>
</>
  );
}

