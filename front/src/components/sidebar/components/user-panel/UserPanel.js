import React, { useMemo, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import ContextMenu, { Position } from 'devextreme-react/context-menu';
import List from 'devextreme-react/list';
import './UserPanel.scss';
import { useCookies } from "react-cookie";
import {signOut} from "../../../../utils/AuthMng"

export default function UserPanel({ menuMode }) {
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["userInfo", "userAuth"]);
  const empno = cookies.userInfo.empno;
  const empNm = cookies.userInfo.empNm;
  
  const navigateToProfile = useCallback(() => {
    navigate("/infoInq/empDetailInfo");
  }, [navigate]);
  


  const menuItems = useMemo(() => ([
    {
      text: 'Profile',
      icon: 'user',
      onClick: navigateToProfile
    },
    {
      text: 'Logout',
      icon: 'runner',
      onClick: signOut
    }
  ]), [navigateToProfile, signOut]);



  return (
    <div className={'user-panel'}>
      <div className={'user-info'}>
        <div className={'user-name'}>[ {empno} ]{empNm}</div>
      </div>

      {menuMode === 'context' && (
        <ContextMenu
          items={menuItems}
          target={'.user-button'}
          showEvent={'dxclick'}
          width={210}
          cssClass={'user-menu'}
        >
          <Position my={{ x: 'center', y: 'top' }} at={{ x: 'center', y: 'bottom' }} />
        </ContextMenu>
      )}
      {menuMode === 'list' && (
        <List className={'dx-toolbar-menu-action'} items={menuItems} />
      )}
    </div>
  );
}
