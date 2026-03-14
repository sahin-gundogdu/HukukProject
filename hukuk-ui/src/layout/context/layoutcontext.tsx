'use client';
import React, { useState, createContext, useContext } from 'react';
import { LayoutState, LayoutConfig, LayoutContextProps, ChildContainerProps } from '@/layout/types';

export const LayoutContext = createContext({} as LayoutContextProps);

export const useLayout = () => useContext(LayoutContext);

export const LayoutProvider = ({ children }: ChildContainerProps) => {
    const [layoutConfig, setLayoutConfig] = useState<LayoutConfig>({
        ripple: false,
        inputStyle: 'outlined',
        menuMode: 'static',
        colorScheme: 'light',
        theme: 'lara-light-indigo',
        scale: 14,
    });

    const [layoutState, setLayoutState] = useState<LayoutState>({
        staticMenuDesktopInactive: false,
        overlayMenuActive: false,
        profileSidebarVisible: false,
        configSidebarVisible: false,
        staticMenuMobileActive: false,
        menuHoverActive: false,
    });

    const onMenuToggle = () => {
        if (isOverlay()) {
            setLayoutState((prev) => ({ ...prev, overlayMenuActive: !prev.overlayMenuActive }));
        }

        if (isDesktop()) {
            setLayoutState((prev) => ({ ...prev, staticMenuDesktopInactive: !prev.staticMenuDesktopInactive }));
        } else {
            setLayoutState((prev) => ({ ...prev, staticMenuMobileActive: !prev.staticMenuMobileActive }));
        }
    };

    const showProfileSidebar = () => {
        setLayoutState((prev) => ({ ...prev, profileSidebarVisible: !prev.profileSidebarVisible }));
    };

    const isOverlay = () => layoutConfig.menuMode === 'overlay';
    const isDesktop = () => window.innerWidth > 991;

    const value: LayoutContextProps = {
        layoutConfig,
        setLayoutConfig,
        layoutState,
        setLayoutState,
        onMenuToggle,
        showProfileSidebar,
    };

    return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>;
};
