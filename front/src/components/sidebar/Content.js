import { Routes, Route, Navigate } from 'react-router-dom';
import routes from './app-routes';
import { SideNavInnerToolbar as SideNavBarLayout } from './layouts';
import React, {useTransition} from 'react';
import { useScreenSizeClass } from './utils/media-query';

function CheckAuth(isPrivate){
    // 토큰이 저장된 상태를 검사하는 로직
    const token = localStorage.getItem('token');
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const userAuth = JSON.parse(localStorage.getItem("userAuth"));

    if(token && isPrivate && userInfo){
        if(userAuth.find(item => item === "VTW04801")){
            return "TRUE";
        }

        const isPrivateFound = userAuth.some(item => item === isPrivate);
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
                                <div className={'dx-card responsive-paddings'}>
                                    <div className="mainContainerStyle">
                                    <div className="container">
                                {React.createElement(element)}
                                        </div>
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

const mainContainerStyle = {
    display: "flex",
    alignItems: "flex-start",
    flexWrap: "wrap",
    justifyContent: "center",
};

