'use client';
import React, { useState, createContext, useContext } from 'react';
import { MenuContextProps, ChildContainerProps } from '@/layout/types';

export const MenuContext = createContext({} as MenuContextProps);

export const useMenuContext = () => useContext(MenuContext);

export const MenuProvider = ({ children }: ChildContainerProps) => {
    const [activeMenu, setActiveMenu] = useState('');

    const value = { activeMenu, setActiveMenu };

    return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
};
