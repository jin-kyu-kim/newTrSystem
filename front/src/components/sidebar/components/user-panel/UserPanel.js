import React, { useMemo, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import ContextMenu, { Position } from 'devextreme-react/context-menu';
import List from 'devextreme-react/list';
import './UserPanel.scss';
import { useCookies } from "react-cookie";
import { useAuth } from "../../contexts/auth";
import TokenTimer from "../../../../utils/TokenTimer";
import { useModal } from "../../../unit/ModalContext";

export default function UserPanel({ menuMode }) {
  const navigate = useNavigate();
  const { signOut, tokenExtension } = useAuth();
  const [cookies] = useCookies(["userInfo", "userAuth"]);
  const empno = cookies.userInfo.empno;
  const empNm = cookies.userInfo.empNm;
  const { handleOpen } = useModal();
  
  const navigateToProfile = useCallback(() => {
    navigate("/infoInq/empDetailInfo");
  }, [navigate]);

  const pannelClick = useCallback((e) => {
    handleOpen(e.itemData.text + ' 하시겠습니까?', e.itemData.function, true);
  }, [handleOpen]);

  const menuItems = useMemo(() => ([
    {
      text: '개인정보',
      icon: 'user',
      onClick: navigateToProfile
    },
    {
      text: '로그인 연장',
      icon: 'clock',
      onClick: pannelClick,
      function:tokenExtension
    },
    {
      text: '로그아웃',
      icon: 'runner',
      onClick: pannelClick,
      function:signOut
    }
  ]), [navigateToProfile, signOut, tokenExtension, pannelClick]);

  return (
    <div className={'user-panel'}>
      <div className={'user-info'}>
        <div className={'user-name'}><TokenTimer/></div>
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
