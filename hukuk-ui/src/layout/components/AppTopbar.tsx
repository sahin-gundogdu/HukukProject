'use client';
import React, { forwardRef, useContext, useRef, useImperativeHandle } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { useAuth } from '@/layout/context/AuthContext';
import { AppTopbarRef } from '@/layout/types';
import { classNames } from 'primereact/utils';

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } = useContext(LayoutContext);
    const { user, logout } = useAuth();
    const menubuttonRef = useRef<HTMLButtonElement>(null);
    const topbarmenuRef = useRef<HTMLDivElement>(null);
    const topbarmenubuttonRef = useRef<HTMLButtonElement>(null);
    const router = useRouter();

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current,
    }));

    const handleLogout = () => {
        logout();
        router.push('/auth/login');
    };

    return (
        <div className="layout-topbar">
            <Link href="/dashboard" className="layout-topbar-logo">
                <i className="pi pi-briefcase" style={{ fontSize: '2rem', marginRight: '0.5rem', color: 'var(--primary-color)' }} />
                <span>Hukuk Görev</span>
            </Link>

            <button
                ref={menubuttonRef}
                type="button"
                className="layout-menu-button layout-topbar-button"
                onClick={onMenuToggle}
            >
                <i className="pi pi-bars" />
            </button>

            <button
                ref={topbarmenubuttonRef}
                type="button"
                className="layout-topbar-menu-button layout-topbar-button"
                onClick={showProfileSidebar}
            >
                <i className="pi pi-ellipsis-v" />
            </button>

            <div
                ref={topbarmenuRef}
                className={classNames('layout-topbar-menu', {
                    'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible,
                })}
            >
                {user && (
                    <div className="layout-topbar-button" style={{ cursor: 'default', gap: '0.5rem' }}>
                        <i className="pi pi-user" />
                        <span style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500 }}>{user.ad} {user.soyad}</span>
                    </div>
                )}
                <button type="button" className="layout-topbar-button" onClick={handleLogout} title="Çıkış Yap">
                    <i className="pi pi-sign-out" />
                    <span>Çıkış</span>
                </button>
            </div>
        </div>
    );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
