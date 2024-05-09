import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/Style.css";
import 'devextreme/dist/css/dx.common.css';
import './components/sidebar/themes/generated/theme.base.css';
import './components/sidebar/themes/generated/theme.additional.css';
import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import './dx-styles.scss';
import LoadPanel from 'devextreme-react/load-panel';
import { NavigationProvider } from './components/sidebar/contexts/navigation';
import { AuthProvider, useAuth } from './components/sidebar/contexts/auth';
import Content from './components/sidebar/Content';
import { Suspense } from "react";
import { CookiesProvider } from "react-cookie";
import {locale} from 'devextreme/localization';
import ErrorBoundary from "./utils/ErrorBoundary";
import { ModalProvider } from 'components/unit/ModalContext';

function App() {
      const { loading } = useAuth();

      locale(getLocale());
      function getLocale() {
        const locale = sessionStorage.getItem('locale');
        return locale != null ? locale : 'ko';
      }

      if (loading) {
        return <LoadPanel visible={true} />;
      }

  const renderRoutes = () => {
          return (
            <Router>
              <ErrorBoundary>
                <CookiesProvider>
                  <NavigationProvider>
                    <AuthProvider>
                      <ModalProvider>
                        <Content/>
                      </ModalProvider>
                    </AuthProvider>
                  </NavigationProvider>
                </CookiesProvider>
              </ErrorBoundary>
            </Router>
          );
      };

      return (
          <Suspense fallback={loading}>{renderRoutes()}</Suspense>
      );

}

export default App;

