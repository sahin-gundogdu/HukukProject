'use client';
import React, { useContext, useEffect, useRef, Suspense } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/layout/context/AuthContext';
import { LayoutContext } from '@/layout/context/layoutcontext';
import AppTopbar from '@/layout/components/AppTopbar';
import AppSidebar from '@/layout/components/AppSidebar';
import AppFooter from '@/layout/components/AppFooter';
import AppConfig from '@/layout/components/AppConfig';
import { classNames } from 'primereact/utils';
import { AppTopbarRef } from '@/layout/types';

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth();
    const { layoutConfig, layoutState, setLayoutState } = useContext(LayoutContext);
    const router = useRouter();
    const pathname = usePathname();
    const topbarRef = useRef<AppTopbarRef>(null);
    const sidebarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/auth/login');
        }
    }, [isLoading, isAuthenticated, router]);

    // Apply scale
    useEffect(() => {
        document.documentElement.style.fontSize = layoutConfig.scale + 'px';
    }, [layoutConfig.scale]);

    // Hide mobile menu on route change
    useEffect(() => {
        hideMenu();
    }, [pathname]);

    const hideMenu = () => {
        setLayoutState((prev) => ({
            ...prev,
            overlayMenuActive: false,
            staticMenuMobileActive: false,
            menuHoverActive: false,
        }));
    };

    const blockBodyScroll = () => {
        if (document.body.classList) {
            document.body.classList.add('blocked-scroll');
        } else {
            document.body.className += ' blocked-scroll';
        }
    };

    const unblockBodyScroll = () => {
        if (document.body.classList) {
            document.body.classList.remove('blocked-scroll');
        }
    };

    useEffect(() => {
        if (layoutState.overlayMenuActive || layoutState.staticMenuMobileActive) {
            blockBodyScroll();
        } else {
            unblockBodyScroll();
        }
    }, [layoutState.overlayMenuActive, layoutState.staticMenuMobileActive]);

    // Outside click handler
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            const isOutsideClicked = !(
                sidebarRef.current?.isSameNode(event.target as Node) ||
                sidebarRef.current?.contains(event.target as Node) ||
                topbarRef.current?.menubutton?.isSameNode(event.target as Node) ||
                topbarRef.current?.menubutton?.contains(event.target as Node)
            );

            if (isOutsideClicked) {
                hideMenu();
            }
        };

        document.addEventListener('click', handleOutsideClick);
        return () => document.removeEventListener('click', handleOutsideClick);
    }, []);

    const containerClass = classNames('layout-wrapper', {
        'layout-overlay': layoutConfig.menuMode === 'overlay',
        'layout-static': layoutConfig.menuMode === 'static',
        'layout-static-inactive': layoutState.staticMenuDesktopInactive && layoutConfig.menuMode === 'static',
        'layout-overlay-active': layoutState.overlayMenuActive,
        'layout-mobile-active': layoutState.staticMenuMobileActive,
        'p-input-filled': layoutConfig.inputStyle === 'filled',
        'p-ripple-disabled': !layoutConfig.ripple,
    });

    if (isLoading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                <i className="pi pi-spin pi-spinner" style={{ fontSize: '2.5rem', color: 'var(--primary-color)' }} />
            </div>
        );
    }

    if (!isAuthenticated) return null;

    return (
        <div className={containerClass}>
            <AppTopbar ref={topbarRef} />
            <div ref={sidebarRef} className="layout-sidebar">
                <AppSidebar />
            </div>
            <div className="layout-main-container">
                <div className="layout-main">
                    <Suspense>{children}</Suspense>
                </div>
                <AppFooter />
            </div>
            <AppConfig />
            <div className="layout-mask" />
        </div>
    );
}
