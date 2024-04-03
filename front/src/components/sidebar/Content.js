import { Routes, Route, Navigate } from 'react-router-dom';
import routes from './app-routes';
import { SideNavInnerToolbar as SideNavBarLayout } from './layouts';
import { Footer } from './components';

export default function Content() {

  return (
    <SideNavBarLayout >
      <Routes>
        {routes.map(({ path, element }) => (
          <Route
            key={path}
            path={path}
            element={element}
          />
        ))}
        <Route
          path='*'
          element={<Navigate to='/home' />}
        />
      </Routes>
      <Footer>
        Copyright © 2024 VTW Inc TRSystem .
        <br />
        All trademarks or registered trademarks are property of their
        respective owners.
      </Footer>
    </SideNavBarLayout>
  );
}

