import { Routes, Route, Navigate } from 'react-router-dom';
import routes from './app-routes';
import { SideNavInnerToolbar as SideNavBarLayout } from './layouts';
import { Footer } from './components';
import React, { useState } from 'react';

export default function Content() {
  const [menuStatus, setMenuStatus] = useState(  MenuStatus.Closed );
  return (
    <SideNavBarLayout status ={menuStatus}>
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

const MenuStatus = {
  Closed: 1,
  Opened: 2,
  TemporaryOpened: 3
};

