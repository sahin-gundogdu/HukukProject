'use client';
import React from 'react';
import { useDashboard, useGorevler } from '@/layout/hooks/useApi';
import { ProgressSpinner } from 'primereact/progressspinner';
import { DURUM_LABELS, ONCELIK_LABELS, formatDate, isOverdue } from '@/utils/formatters';
import { GorevDurumu, OncelikSeviyesi } from '@/types';
import Link from 'next/link';

export default function DashboardPage() {
    const { data: dashboard, isLoading } = useDashboard();
    const { data: gecikenGorevler } = useGorevler({ sadeceGecikenler: true });

    if (isLoading) {
        return <div className="page-loading"><ProgressSpinner /></div>;
    }

    if (!dashboard) return null;

    const tamamlanmaOrani = dashboard.toplamGorev > 0
        ? Math.round((dashboard.tamamlananGorev / dashboard.toplamGorev) * 100) : 0;

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title"><i className="pi pi-home" /> Dashboard</h1>
            </div>

            {/* KPI Cards */}
            <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                <div className="stat-card stat-primary">
                    <div className="stat-card-header">
                        <span className="stat-card-label">Toplam Görev</span>
                        <div className="stat-card-icon"><i className="pi pi-list" /></div>
                    </div>
                    <div className="stat-card-value">{dashboard.toplamGorev}</div>
                    <div className="stat-card-footer">Tüm görevler</div>
                </div>

                <div className="stat-card stat-accent">
                    <div className="stat-card-header">
                        <span className="stat-card-label">Yeni / Açık</span>
                        <div className="stat-card-icon"><i className="pi pi-inbox" /></div>
                    </div>
                    <div className="stat-card-value">{dashboard.acikGorev}</div>
                    <div className="stat-card-footer">Henüz başlanmamış</div>
                </div>

                <div className="stat-card stat-warning">
                    <div className="stat-card-header">
                        <span className="stat-card-label">Devam Eden</span>
                        <div className="stat-card-icon"><i className="pi pi-spinner" /></div>
                    </div>
                    <div className="stat-card-value">{dashboard.devamEdenGorev}</div>
                    <div className="stat-card-footer">İşlemde</div>
                </div>

                <div className="stat-card stat-success">
                    <div className="stat-card-header">
                        <span className="stat-card-label">Tamamlanan</span>
                        <div className="stat-card-icon"><i className="pi pi-check-circle" /></div>
                    </div>
                    <div className="stat-card-value">{dashboard.tamamlananGorev}</div>
                    <div className="stat-card-footer">%{tamamlanmaOrani} tamamlanma</div>
                </div>

                <div className="stat-card stat-danger">
                    <div className="stat-card-header">
                        <span className="stat-card-label">Geciken</span>
                        <div className="stat-card-icon"><i className="pi pi-exclamation-triangle" /></div>
                    </div>
                    <div className="stat-card-value">{dashboard.gecikenGorev}</div>
                    <div className="stat-card-footer">Süresi geçmiş</div>
                </div>

                <div className="stat-card stat-primary">
                    <div className="stat-card-header">
                        <span className="stat-card-label">Ort. Kapanma</span>
                        <div className="stat-card-icon"><i className="pi pi-clock" /></div>
                    </div>
                    <div className="stat-card-value">{dashboard.ortalamaKapanmaSuresiGun}</div>
                    <div className="stat-card-footer">Gün</div>
                </div>
            </div>

            {/* Two Column Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {/* Grup İstatistikleri */}
                <div className="glass-panel">
                    <h3 style={{ marginBottom: '16px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="pi pi-users" /> Grup İstatistikleri
                    </h3>
                    {dashboard.grupIstatistikleri.length === 0 ? (
                        <p style={{ color: 'var(--text-secondary)' }}>Henüz veri yok</p>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                                    <th style={{ textAlign: 'left', padding: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>GRUP</th>
                                    <th style={{ textAlign: 'center', padding: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>TOPLAM</th>
                                    <th style={{ textAlign: 'center', padding: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>DEVAM</th>
                                    <th style={{ textAlign: 'center', padding: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>TAMAMLANAN</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dashboard.grupIstatistikleri.map((g, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '10px 8px', fontWeight: 500 }}>{g.grupAdi}</td>
                                        <td style={{ padding: '10px 8px', textAlign: 'center' }}>{g.toplamGorev}</td>
                                        <td style={{ padding: '10px 8px', textAlign: 'center', color: 'var(--warning)' }}>{g.devamEdenGorev}</td>
                                        <td style={{ padding: '10px 8px', textAlign: 'center', color: 'var(--success)' }}>{g.tamamlananGorev}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Geciken Görevler */}
                <div className="glass-panel">
                    <h3 style={{ marginBottom: '16px', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="pi pi-exclamation-triangle" /> Geciken Görevler
                    </h3>
                    {!gecikenGorevler || gecikenGorevler.length === 0 ? (
                        <div className="empty-state" style={{ padding: '30px' }}>
                            <i className="pi pi-check-circle" style={{ color: 'var(--success)' }} />
                            <p>Geciken görev yok 🎉</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {gecikenGorevler.slice(0, 5).map(g => (
                                <Link key={g.id} href={`/gorevler/${g.id}`}
                                    style={{ textDecoration: 'none', color: 'inherit', padding: '12px', background: 'var(--surface-50)', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'var(--transition)' }}>
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{g.baslik}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                            {g.atananKullaniciAdi ?? g.atananGrupAdi} • {ONCELIK_LABELS[g.oncelik as OncelikSeviyesi]}
                                        </div>
                                    </div>
                                    <span className="overdue-badge">
                                        <i className="pi pi-clock" /> {formatDate(g.bitisTarihi)}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Kişi İstatistikleri */}
            {dashboard.kisiIstatistikleri.length > 0 && (
                <div className="glass-panel" style={{ marginTop: '24px' }}>
                    <h3 style={{ marginBottom: '16px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="pi pi-user" /> Kişi Bazlı İstatistikler
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '12px' }}>
                        {dashboard.kisiIstatistikleri.map((k, i) => {
                            const oran = k.toplamGorev > 0 ? Math.round((k.tamamlananGorev / k.toplamGorev) * 100) : 0;
                            return (
                                <div key={i} style={{ padding: '16px', background: 'var(--surface-50)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                    <div style={{ fontWeight: 600, marginBottom: '8px' }}>{k.kullaniciAdi}</div>
                                    <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem' }}>
                                        <span>Toplam: <strong>{k.toplamGorev}</strong></span>
                                        <span style={{ color: 'var(--success)' }}>Tamamlanan: <strong>{k.tamamlananGorev}</strong></span>
                                        <span style={{ color: 'var(--warning)' }}>Devam: <strong>{k.devamEdenGorev}</strong></span>
                                    </div>
                                    <div style={{ marginTop: '8px', background: 'var(--surface-200)', borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
                                        <div style={{ width: `${oran}%`, height: '100%', background: 'linear-gradient(90deg, var(--success), #34d399)', borderRadius: '4px', transition: 'width 0.5s ease' }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
