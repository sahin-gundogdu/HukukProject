'use client';
import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { MenuProvider } from '@/layout/context/menucontext';
import { AppMenuItem } from '@/layout/types';

const AppMenu = () => {
    const model: AppMenuItem[] = [
        {
            label: 'Ana Menü',
            items: [
                { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/dashboard' },
                { label: 'Görevler', icon: 'pi pi-fw pi-list', to: '/gorevler' },
                { label: 'Kanban', icon: 'pi pi-fw pi-th-large', to: '/kanban' },
            ],
        },
        {
            label: 'Yönetim',
            items: [
                { label: 'Kullanıcılar', icon: 'pi pi-fw pi-users', to: '/kullanicilar' },
                { label: 'Gruplar', icon: 'pi pi-fw pi-sitemap', to: '/gruplar' },
                { label: 'Etiketler', icon: 'pi pi-fw pi-tags', to: '/etiketler' },
            ],
        },
        {
            label: 'Raporlar',
            items: [
                { label: 'İstatistikler', icon: 'pi pi-fw pi-chart-bar', to: '/raporlar' },
            ],
        },
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item.separator ? (
                        <AppMenuitem item={item} root={true} index={i} key={item.label} />
                    ) : (
                        <li className="menu-separator" key={`sep-${i}`} />
                    );
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
