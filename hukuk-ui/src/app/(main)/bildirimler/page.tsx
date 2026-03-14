'use client';
import React from 'react';
import { useBildirimler, useMarkBildirimOkundu } from '@/layout/hooks/useApi';
import { useAuth } from '@/layout/context/AuthContext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Button } from 'primereact/button';
import { BILDIRIM_ICONS, formatDateTime } from '@/utils/formatters';
import type { BildirimDto } from '@/types';
import Link from 'next/link';

export default function BildirimlerPage() {
    const { user } = useAuth();
    const { data: bildirimler, isLoading } = useBildirimler(user?.id ?? 0);
    const markOkundu = useMarkBildirimOkundu();

    if (isLoading) return <div className="page-loading"><ProgressSpinner /></div>;

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title"><i className="pi pi-bell" /> Bildirimler</h1>
            </div>

            {!bildirimler || bildirimler.length === 0 ? (
                <div className="empty-state glass-panel">
                    <i className="pi pi-bell-slash" />
                    <p>Bildirim bulunamadı</p>
                </div>
            ) : (
                <div className="notification-list">
                    {bildirimler.map((b: BildirimDto) => (
                        <div key={b.id} className={`notification-item ${!b.okundu ? 'unread' : ''}`}>
                            <i className={`notification-icon ${BILDIRIM_ICONS[b.tip]}`} />
                            <div className="notification-content">
                                <div className="notification-title">{b.baslik}</div>
                                <div className="notification-message">{b.mesaj}</div>
                                <div className="notification-time">{formatDateTime(b.createdAt)}</div>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                {b.gorevId && (
                                    <Link href={`/gorevler/${b.gorevId}`}>
                                        <Button icon="pi pi-external-link" className="p-button-text p-button-sm" tooltip="Göreve Git" />
                                    </Link>
                                )}
                                {!b.okundu && (
                                    <Button icon="pi pi-check" className="p-button-text p-button-sm p-button-success" tooltip="Okundu İşaretle"
                                        onClick={() => markOkundu.mutate(b.id)} />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
