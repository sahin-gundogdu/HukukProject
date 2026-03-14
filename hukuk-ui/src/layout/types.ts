import { ReactNode, Dispatch, SetStateAction, HTMLAttributeAnchorTarget } from 'react';

/* Layout State */
export type LayoutState = {
    staticMenuDesktopInactive: boolean;
    overlayMenuActive: boolean;
    profileSidebarVisible: boolean;
    configSidebarVisible: boolean;
    staticMenuMobileActive: boolean;
    menuHoverActive: boolean;
};

/* Layout Config */
export type LayoutConfig = {
    ripple: boolean;
    inputStyle: string;
    menuMode: string;
    colorScheme: string;
    theme: string;
    scale: number;
};

/* Layout Context */
export interface LayoutContextProps {
    layoutConfig: LayoutConfig;
    setLayoutConfig: Dispatch<SetStateAction<LayoutConfig>>;
    layoutState: LayoutState;
    setLayoutState: Dispatch<SetStateAction<LayoutState>>;
    onMenuToggle: () => void;
    showProfileSidebar: () => void;
}

/* Menu Context */
export interface MenuContextProps {
    activeMenu: string;
    setActiveMenu: Dispatch<SetStateAction<string>>;
}

/* Topbar Ref */
export interface AppTopbarRef {
    menubutton?: HTMLButtonElement | null;
    topbarmenu?: HTMLDivElement | null;
    topbarmenubutton?: HTMLButtonElement | null;
}

/* Child Container */
export interface ChildContainerProps {
    children: ReactNode;
}

/* Menu Types */
export interface AppMenuItem {
    label: string;
    icon?: string;
    items?: AppMenuItem[];
    to?: string;
    url?: string;
    target?: HTMLAttributeAnchorTarget;
    separator?: boolean;
    badge?: string;
    badgeClass?: string;
    class?: string;
    preventExact?: boolean;
    visible?: boolean;
    disabled?: boolean;
    replaceUrl?: boolean;
    command?: (args: { originalEvent: React.MouseEvent; item: AppMenuItem }) => void;
}

export interface AppMenuItemProps {
    item?: AppMenuItem;
    parentKey?: string;
    index?: number;
    root?: boolean;
    className?: string;
}
