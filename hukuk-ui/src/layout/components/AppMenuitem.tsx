'use client';
import React, { useContext, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Ripple } from 'primereact/ripple';
import { classNames } from 'primereact/utils';
import { CSSTransition } from 'react-transition-group';
import { MenuContext } from '@/layout/context/menucontext';
import { AppMenuItemProps } from '@/layout/types';

const AppMenuitem = (props: AppMenuItemProps) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { activeMenu, setActiveMenu } = useContext(MenuContext);
    const item = props.item;
    const key = props.parentKey ? props.parentKey + '-' + props.index : String(props.index);
    const isActiveRoute = item?.to && pathname === item.to;
    const active = activeMenu === key || activeMenu.startsWith(key + '-');
    const nodeRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        if (item?.to && pathname === item.to) {
            setActiveMenu(key);
        }
    }, [pathname, searchParams]);

    const itemClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        if (item?.disabled) {
            event.preventDefault();
            return;
        }

        if (item?.command) {
            item.command({ originalEvent: event, item });
        }

        if (item?.items) {
            setActiveMenu(active ? (props.parentKey || '') : key);
        } else {
            setActiveMenu(key);
        }
    };

    const subMenu = item?.items && item.visible !== false && (
        <CSSTransition
            nodeRef={nodeRef}
            timeout={{ enter: 1000, exit: 450 }}
            classNames="layout-submenu"
            in={props.root ? true : active}
            key={item.label}
        >
            <ul ref={nodeRef}>
                {item.items.map((child, i) => (
                    <AppMenuitem item={child} index={i} className={child.class} parentKey={key} key={child.label} />
                ))}
            </ul>
        </CSSTransition>
    );

    if (!item) return null;

    return (
        <li className={classNames({ 'layout-root-menuitem': props.root, 'active-menuitem': active })}>
            {props.root && item.visible !== false && <div className="layout-menuitem-root-text">{item.label}</div>}
            {(!item.to || item.items) && item.visible !== false ? (
                <a
                    href={item.url}
                    onClick={(e) => itemClick(e)}
                    className={classNames(item.class, 'p-ripple')}
                    target={item.target}
                    tabIndex={0}
                >
                    <i className={classNames('layout-menuitem-icon', item.icon)} />
                    <span className="layout-menuitem-text">{item.label}</span>
                    {item.items && <i className="pi pi-fw pi-angle-down layout-submenu-toggler" />}
                    <Ripple />
                </a>
            ) : null}
            {item.to && !item.items && item.visible !== false ? (
                <Link
                    href={item.to}
                    replace={item.replaceUrl}
                    onClick={(e) => itemClick(e)}
                    className={classNames(item.class, 'p-ripple', { 'active-route': isActiveRoute })}
                    target={item.target}
                    tabIndex={0}
                >
                    <i className={classNames('layout-menuitem-icon', item.icon)} />
                    <span className="layout-menuitem-text">{item.label}</span>
                    {item.items && <i className="pi pi-fw pi-angle-down layout-submenu-toggler" />}
                    <Ripple />
                </Link>
            ) : null}
            {subMenu}
        </li>
    );
};

export default AppMenuitem;
