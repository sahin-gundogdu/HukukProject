'use client';
import React from 'react';
import { useDashboard, useGorevler } from '@/layout/hooks/useApi';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Chart } from 'primereact/chart';
import { DURUM_LABELS, ONCELIK_LABELS, formatDate } from '@/utils/formatters';
import { OncelikSeviyesi } from '@/types';
import Link from 'next/link';

export default function DashboardPage() {
    const { data: dashboard, isLoading } = useDashboard();
    const { data: gecikenGorevler } = useGorevler({ sadeceGecikenler: true });

    if (isLoading) {
        return <div className="page-loading"><ProgressSpinner /></div>;
    }

    if (!dashboard) return null;

    // --- Chart Data Helpers ---
    
    // Status Distribution (Pie)
    const statusChartData = {
        labels: ['Açık', 'Devam Eden', 'Tamamlanan', 'Geciken'],
        datasets: [{
            data: [dashboard.acikGorev, dashboard.devamEdenGorev, dashboard.tamamlananGorev, dashboard.gecikenGorev],
            backgroundColor: ['#3b82f6', '#f59e0b', '#10b981', '#ef4444'],
            hoverBackgroundColor: ['#60a5fa', '#fbbf24', '#34d399', '#f87171'],
            borderWidth: 0
        }]
    };

    // Group Tasks (Bar)
    const groupChartData = {
        labels: dashboard.grupIstatistikleri.map(g => g.grupAdi),
        datasets: [
            {
                label: 'Toplam',
                backgroundColor: '#6366f1',
                data: dashboard.grupIstatistikleri.map(g => g.toplamGorev)
            },
            {
                label: 'Tamamlanan',
                backgroundColor: '#10b981',
                data: dashboard.grupIstatistikleri.map(g => g.tamamlananGorev)
            }
        ]
    };

    // Trend (Line)
    const trendChartData = {
        labels: dashboard.gunlukGorevIstatistikleri.map(d => d.tarih),
        datasets: [
            {
                label: 'Yeni Görevler',
                data: dashboard.gunlukGorevIstatistikleri.map(d => d.olusturulan),
                fill: false,
                borderColor: '#3b82f6',
                tension: 0.4
            },
            {
                label: 'Tamamlananlar',
                data: dashboard.gunlukGorevIstatistikleri.map(d => d.tamamlanan),
                fill: true,
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4
            }
        ]
    };

    // Priority (Doughnut)
    const priorityChartData = {
        labels: dashboard.oncelikIstatistikleri.map(p => {
            const labelMap: Record<string, string> = {
                'Dusuk': 'Düşük',
                'Orta': 'Orta',
                'Yuksek': 'Yüksek',
                'Kritik': 'Kritik'
            };
            return labelMap[p.oncelikAdi] || p.oncelikAdi;
        }),
        datasets: [{
            data: dashboard.oncelikIstatistikleri.map(p => p.adet),
            backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'],
            borderWidth: 0
        }]
    };

    const chartOptions = {
        plugins: {
            legend: {
                position: 'bottom',
                labels: { color: '#ffffff', font: { size: 12 } }
            }
        },
        maintainAspectRatio: false
    };

    const barOptions = {
        ...chartOptions,
        scales: {
            x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
            y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } }
        }
    };

    const tamamlanmaOrani = dashboard.toplamGorev > 0
        ? Math.round((dashboard.tamamlananGorev / dashboard.toplamGorev) * 100) : 0;

    return (
        <div style={{ paddingBottom: '40px' }}>
            <div className="page-header">
                <h1 className="page-title"><i className="pi pi-home" /> Dashboard</h1>
            </div>

            {/* KPI Cards */}
            <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '32px' }}>
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
                        <span className="stat-card-label">Aktif Görevler</span>
                        <div className="stat-card-icon"><i className="pi pi-inbox" /></div>
                    </div>
                    <div className="stat-card-value">{dashboard.acikGorev + dashboard.devamEdenGorev}</div>
                    <div className="stat-card-footer">İşlemdeki görevler</div>
                </div>

                <div className="stat-card stat-success">
                    <div className="stat-card-header">
                        <span className="stat-card-label">Tamamlanan</span>
                        <div className="stat-card-icon"><i className="pi pi-check-circle" /></div>
                    </div>
                    <div className="stat-card-value">{dashboard.tamamlananGorev}</div>
                    <div className="stat-card-footer">%{tamamlanmaOrani} oran</div>
                </div>

                <div className="stat-card stat-danger">
                    <div className="stat-card-header">
                        <span className="stat-card-label">Geciken</span>
                        <div className="stat-card-icon"><i className="pi pi-exclamation-triangle" /></div>
                    </div>
                    <div className="stat-card-value">{dashboard.gecikenGorev}</div>
                    <div className="stat-card-footer">Süresi geçmiş</div>
                </div>

                <div className="stat-card stat-warning">
                    <div className="stat-card-header">
                        <span className="stat-card-label">Ort. Kapanma</span>
                        <div className="stat-card-icon"><i className="pi pi-clock" /></div>
                    </div>
                    <div className="stat-card-value">{dashboard.ortalamaKapanmaSuresiGun}</div>
                    <div className="stat-card-footer">Gün</div>
                </div>
            </div>

            {/* Charts Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                {/* Line Trend */}
                <div className="glass-panel" style={{ gridColumn: '1 / -1' }}>
                    <h3 className="section-title"><i className="pi pi-chart-line" /> Haftalık Görev Trendi</h3>
                    <div style={{ height: '300px' }}>
                        <Chart type="line" data={trendChartData} options={barOptions} />
                    </div>
                </div>

                {/* Status Pie */}
                <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
                    <h3 className="section-title"><i className="pi pi-chart-pie" /> Durum Dağılımı</h3>
                    <div style={{ height: '250px', flex: 1 }}>
                        <Chart type="pie" data={statusChartData} options={chartOptions} />
                    </div>
                </div>

                {/* Priority Doughnut */}
                <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
                    <h3 className="section-title"><i className="pi pi-chart-doughnut" /> Öncelik Dağılımı</h3>
                    <div style={{ height: '250px', flex: 1 }}>
                        <Chart type="doughnut" data={priorityChartData} options={chartOptions} />
                    </div>
                </div>

                {/* Group Bar */}
                <div className="glass-panel" style={{ gridColumn: '1 / -1' }}>
                    <h3 className="section-title"><i className="pi pi-chart-bar" /> Grup Bazlı Performans</h3>
                    <div style={{ height: '300px' }}>
                        <Chart type="bar" data={groupChartData} options={barOptions} />
                    </div>
                </div>
            </div>

            {/* Tables & Lists */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                 {/* Geciken Görevler */}
                 <div className="glass-panel">
                    <h3 className="section-title" style={{ color: 'var(--danger)' }}><i className="pi pi-exclamation-triangle" /> Kritik Gecikmeler</h3>
                    {!gecikenGorevler || gecikenGorevler.length === 0 ? (
                        <div className="empty-state">Geciken görev yok 🎉</div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {gecikenGorevler.slice(0, 5).map(g => (
                                <Link key={g.id} href={`/gorevler/${g.id}`} className="hover-list-item">
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 600 }}>{g.baslik}</div>
                                        <small style={{ color: 'var(--text-secondary)' }}>{g.atananKullaniciAdi ?? g.atananGrupAdi}</small>
                                    </div>
                                    <span className="overdue-badge"><i className="pi pi-clock" /> {formatDate(g.bitisTarihi)}</span>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Kişi İstatistikleri */}
                <div className="glass-panel">
                    <h3 className="section-title"><i className="pi pi-user" /> En Aktif Kişiler</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {dashboard.kisiIstatistikleri.slice(0, 5).map((k, i) => {
                            const oran = k.toplamGorev > 0 ? Math.round((k.tamamlananGorev / k.toplamGorev) * 100) : 0;
                            return (
                                <div key={i}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                        <span style={{ fontWeight: 500 }}>{k.kullaniciAdi}</span>
                                        <small>{k.tamamlananGorev} / {k.toplamGorev} Bitti</small>
                                    </div>
                                    <div style={{ background: 'var(--surface-200)', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
                                        <div style={{ width: `${oran}%`, height: '100%', background: 'var(--success)', transition: 'width 0.8s ease' }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .section-title {
                    margin-bottom: 20px;
                    color: var(--primary);
                    font-size: 1.1rem;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .hover-list-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px;
                    background: rgba(255,255,255,0.03);
                    border-radius: 8px;
                    border: 1px solid var(--border-color);
                    text-decoration: none;
                    color: inherit;
                    transition: all 0.2s;
                }
                .hover-list-item:hover {
                    background: rgba(255,255,255,0.08);
                    transform: translateX(4px);
                    border-color: var(--primary);
                }
                .empty-state {
                    padding: 40px;
                    text-align: center;
                    color: var(--text-secondary);
                    font-style: italic;
                }
            `}</style>
        </div>
    );
}
