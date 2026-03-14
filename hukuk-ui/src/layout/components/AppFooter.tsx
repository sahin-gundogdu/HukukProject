'use client';
import React, { useContext } from 'react';
import { LayoutContext } from '@/layout/context/layoutcontext';

const AppFooter = () => {
    const { layoutConfig } = useContext(LayoutContext);

    return (
        <div className="layout-footer">
            <span className="font-medium ml-2">Hukuk ve Uyum Başkanlığı</span>
            <span className="mx-2">|</span>
            <span>Görev Yönetim Sistemi</span>
        </div>
    );
};

export default AppFooter;
