import { Routes, Route, Navigate } from 'react-router-dom';
import routes from './app-routes';
import { SideNavInnerToolbar as SideNavBarLayout } from './layouts';
import { Footer } from './components';
import React, {useTransition} from 'react';
import { useScreenSizeClass } from './utils/media-query';

const checkAuth = () => {
    // 토큰이 저장된 상태를 검사하는 로직
    const token = localStorage.getItem('token');
    return token != null;
};

const PrivateRoute = ({ children }) => {
    const isAuthenticated = checkAuth();
    // 인증이 안 된 경우 로그인 페이지로 리다이렉트
    return isAuthenticated ? children : <Navigate to="/LoginFrom" />;
};
const PublicRoute = ({ children }) => {
    const isAuthenticated = checkAuth();
    // 인증이 안 된 경우 로그인 페이지로 리다이렉트
    return isAuthenticated ? <Navigate to="/home" />:children;
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
                        <PrivateRoute>
                          <div className={`app ${screenSizeClass}`} style={{opacity: isPending ? 0.2 : 1}}>
                            <SideNavBarLayout>
                              {React.createElement(element)}
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
    {/*<Footer>*/}
    {/*    Copyright © 2024 VTW Inc TRSystem.*/}
    {/*    <br />*/}
    {/*    All trademarks or registered trademarks are property of their respective owners.*/}
    {/*</Footer>*/}
</>
  );
}

