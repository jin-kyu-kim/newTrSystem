import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import TreeView from 'devextreme-react/tree-view';
import { navigation } from '../../app-navigation';
import { useNavigation } from '../../contexts/navigation';
import { useScreenSize } from '../../utils/media-query';
import './SideNavigationMenu.scss';


import * as events from 'devextreme/events';
import {useCookies} from "react-cookie";


export default function SideNavigationMenu(props) {

  const [cookies, setCookie] = useCookies(["userAuth"]);
  // const userAuths = cookies.userAuth;
  const userAuths = JSON.parse(localStorage.getItem("userAuth"));

  const isAdmin = userAuths.includes('VTW04801');
  function setVisiblePropertyBasedOnAuthArray(navigation, userAuths, isAdmin) {
    return navigation.map(item => {
      // 하위 항목이 있는지 확인
      const hasItems = item.items && item.items.length > 0;

      return {
        ...item,
        visible: isAdmin || !item.auth || userAuths.includes(item.auth),
        items: hasItems ? setVisiblePropertyBasedOnAuthArray(item.items, userAuths) : [],
      };
    });
  }

  const {
    children,
    selectedItemChanged,
    openMenu,
    compactMode,
    onMenuReady,
    status
  } = props;

  const { isLarge } = useScreenSize();
  // function normalizePath () {
  //   return navigation.map((item) => (
  //     { ...item, expanded: isLarge, path: item.path && !(/^\//.test(item.path)) ? `/${item.path}` : item.path }
  //   ))
  // }
  //
  // const items = useMemo(
  //   normalizePath,
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   []
  // );
  const visibleNavigation = useMemo(
      () => setVisiblePropertyBasedOnAuthArray(navigation, userAuths, isAdmin),
      [userAuths]
  );

  const { navigationData: { currentPath } } = useNavigation();

  const treeViewRef = useRef(null);
  const wrapperRef = useRef();
  const getWrapperRef = useCallback((element) => {
    const prevElement = wrapperRef.current;
    if (prevElement) {
      events.off(prevElement, 'dxclick');
    }

    wrapperRef.current = element;
    events.on(element, 'dxclick', (e) => {
      openMenu(e);
    });
  }, [openMenu]);

  useEffect(() => {
    const treeView = treeViewRef.current && treeViewRef.current.instance;
    if (!treeView) {
      return;
    }

    if (currentPath !== undefined) {
      treeView.selectItem(currentPath);
      treeView.expandItem(currentPath);
    }

    if (compactMode) {
      
      treeView.collapseAll();
    }
  }, [currentPath, compactMode]);

    useEffect(()=>{ //초기 렌더링시 메뉴 닫아두기
      const treeView = treeViewRef.current && treeViewRef.current.instance;
      treeView.collapseAll();
    },[])
  
  return (
    <div
      className={'dx-swatch-additional side-navigation-menu'}
      ref={getWrapperRef}
    >
      {children}
      <div className={'menu-container'}>
        <TreeView
          ref={treeViewRef}
          items={visibleNavigation}
          keyExpr={'path'}
          selectionMode={'single'}
          focusStateEnabled={false}
          expandEvent={'click'}
          onItemClick={selectedItemChanged}
          onContentReady={onMenuReady}
          width={'100%'}
        />
      </div>
    </div>
  );
}
