import React, { useEffect, useRef, useCallback, useMemo, useState } from 'react';
import TreeView from 'devextreme-react/tree-view';
import { navigation } from '../../app-navigation';
import { useNavigation } from '../../contexts/navigation';
import { useScreenSize } from '../../utils/media-query';
import './SideNavigationMenu.scss';
import * as events from 'devextreme/events';

export default function SideNavigationMenu(props) {
  const [userAuths, setUserAuths] = useState(() => {
    return JSON.parse(localStorage.getItem("userAuth")) || [];
  });

  const isAdmin = useMemo(() => userAuths.includes('VTW04801'), [userAuths]);

  function setVisiblePropertyBasedOnAuthArray(navigation, userAuths, isAdmin) {
    return navigation.map(item => {
      const hasItems = item.items && item.items.length > 0;

      return {
        ...item,
        visible: isAdmin || !item.auth || userAuths.includes(item.auth),
        items: hasItems ? setVisiblePropertyBasedOnAuthArray(item.items, userAuths, isAdmin) : [],
      };
    });
  }

  const {
    children,
    selectedItemChanged,
    openMenu,
    compactMode,
    onMenuReady,
  } = props;

  const { isLarge } = useScreenSize();

  const visibleNavigation = useMemo(() => {
    return setVisiblePropertyBasedOnAuthArray(navigation, userAuths, isAdmin);
  }, [userAuths, isAdmin]);

  const { navigationData: { currentPath } } = useNavigation();

  const treeViewRef = useRef(null);
  const wrapperRef = useRef();
  const getWrapperRef = useCallback((element) => {
    const prevElement = wrapperRef.current;
    if (prevElement) {
      events.off(prevElement, 'dxclick');
    }

    wrapperRef.current = element;
    if (element) {
      events.on(element, 'dxclick', openMenu);
    }
  }, [openMenu]);

  useEffect(() => {
    const handleStorageChange = () => {
      setUserAuths(JSON.parse(localStorage.getItem("userAuth")) || []);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

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

  useEffect(() => {
    const treeView = treeViewRef.current && treeViewRef.current.instance;
    if (treeView) {
      treeView.collapseAll();
    }
  }, []);

  return (
    <div className={'dx-swatch-additional side-navigation-menu'} ref={getWrapperRef}>
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
