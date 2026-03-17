'use client';
import React, { useState } from 'react';
import { useDashboard, useGorevler } from '@/layout/hooks/useApi';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Chart } from 'primereact/chart';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { DURUM_LABELS, ONCELIK_LABELS, formatDate } from '@/utils/formatters';
import { OncelikSeviyesi, GorevDurumu } from '@/types';
import Link from 'next/link';
import { useAuth } from '@/layout/context/AuthContext';

export default function DashboardPage() {
    const { user } = useAuth();
    const { data: dashboard, isLoading } = useDashboard();
    const { data: gecikenGorevler } = useGorevler({ sadeceGecikenler: true });
    const { data: myGorevler } = useGorevler({ atananKullaniciId: user?.id });

    const [detailsVisible, setDetailsVisible] = useState(false);
    const [detailFilters, setDetailFilters] = useState<any>(null);
    const [detailTitle, setDetailTitle] = useState('');

    const { data: detailGorevler, isLoading: isDetailsLoading } = useGorevler(detailFilters || {});

    const onChartSelect = () => {
        // Developer updated: Removed as per user request, using "Details" button instead.
    };

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
    const sortedOncelikStats = [...dashboard.oncelikIstatistikleri].sort((a, b) => {
        const order = ['Dusuk', 'Orta', 'Yuksek', 'Kritik'];
        return order.indexOf(a.oncelikAdi) - order.indexOf(b.oncelikAdi);
    });

    const priorityChartData = {
        labels: sortedOncelikStats.map(p => {
            const labelMap: Record<string, string> = {
                'Dusuk': 'Düşük',
                'Orta': 'Orta',
                'Yuksek': 'Yüksek',
                'Kritik': 'Kritik'
            };
            return labelMap[p.oncelikAdi] || p.oncelikAdi;
        }),
        datasets: [{
            data: sortedOncelikStats.map(p => p.adet),
            backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'],
            borderWidth: 0
        }]
    };

    const chartOptions = {
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    color: '#475569', // Slate 600 for better readability
                    usePointStyle: true,
                    padding: 20,
                    font: {
                        size: 13,
                        family: 'inherit'
                    }
                }
            },
            tooltip: {
                enabled: true
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
        <div className="dashboard-container" style={{ paddingBottom: '40px' }}>
            <div className="page-header">
                <h1 className="page-title"><i className="pi pi-home" /> Dashboard Özeti</h1>
                <div className="current-date">
                    <i className="pi pi-calendar" /> {formatDate(new Date().toISOString())}
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '20px', marginBottom: '32px' }}>
                <div className="premium-card kpi-total">
                    <div className="card-inner">
                        <div className="card-top">
                            <span className="card-label">Toplam Görev</span>
                            <div className="card-icon"><i className="pi pi-list" /></div>
                        </div>
                        <div className="card-value">{dashboard.toplamGorev}</div>
                    </div>
                </div>

                <div className="premium-card kpi-active">
                    <div className="card-inner">
                        <div className="card-top">
                            <span className="card-label">Aktif Görevler</span>
                            <div className="card-icon"><i className="pi pi-inbox" /></div>
                        </div>
                        <div className="card-value">{dashboard.acikGorev + dashboard.devamEdenGorev}</div>
                    </div>
                </div>

                <div className="premium-card kpi-success">
                    <div className="card-inner">
                        <div className="card-top">
                            <span className="card-label">Tamamlanan</span>
                            <div className="card-icon"><i className="pi pi-check-circle" /></div>
                        </div>
                        <div className="card-value">{dashboard.tamamlananGorev}</div>
                        <div className="card-progress">
                            <div className="progress-bg shadow-sm"><div className="progress-bar" style={{ width: `${tamamlanmaOrani}%`, background: 'rgba(255,255,255,0.4)' }} /></div>
                        </div>
                        <div className="card-percent">%{tamamlanmaOrani} başarı oranı</div>
                    </div>
                </div>

                <div className="premium-card kpi-danger">
                    <div className="card-inner">
                        <div className="card-top">
                            <span className="card-label">Gecikenler</span>
                            <div className="card-icon"><i className="pi pi-exclamation-triangle" /></div>
                        </div>
                        <div className="card-value">{dashboard.gecikenGorev}</div>
                    </div>
                </div>

                <div className="premium-card kpi-warning">
                    <div className="card-inner">
                        <div className="card-top">
                            <span className="card-label">Ort. Kapanma</span>
                            <div className="card-icon"><i className="pi pi-clock" /></div>
                        </div>
                        <div className="card-value">{dashboard.ortalamaKapanmaSuresiGun} <small style={{ fontSize: '1rem', opacity: 0.8 }}>Gün</small></div>
                    </div>
                </div>
            </div>

            {/* Main Layout Grid */}
            <div className="dashboard-main-grid" style={{ display: 'grid', gridTemplateColumns: '0.6fr 1.4fr', gap: '24px', marginBottom: '24px' }}>
                {/* Left: Group Performance (Narrower & Taller) */}
                <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
                    <h3 className="section-title"><i className="pi pi-chart-bar" /> Grup Bazlı Performans</h3>
                    <div style={{ flex: 1, minHeight: '520px' }}>
                        <Chart type="bar" data={groupChartData} options={{...barOptions, maintainAspectRatio: false }} style={{ height: '100%' }} />
                    </div>
                </div>

                {/* Right Column: Mini Charts Grid + Lists */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Top Row: Pie and Doughnut yan yana */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
                            <div className="panel-header" style={{ marginBottom: '10px' }}>
                                <h3 className="section-title" style={{ marginBottom: 0 }}><i className="pi pi-chart-pie" /> Durum Dağılımı</h3>
                                <Button 
                                    label="Detaylar" 
                                    icon="pi pi-external-link" 
                                    className="p-button-outlined p-button-sm detail-btn-colored" 
                                    onClick={() => {
                                        setDetailTitle('Tüm Görevler (Durum)');
                                        setDetailFilters({});
                                        setDetailsVisible(true);
                                    }} 
                                />
                            </div>
                            <div style={{ flex: 1, minHeight: '200px', display: 'flex', justifyContent: 'center' }}>
                                <Chart type="pie" data={statusChartData} options={{...chartOptions, plugins: {...chartOptions.plugins, legend: { display: false }}}} />
                            </div>
                        </div>

                        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
                            <div className="panel-header" style={{ marginBottom: '10px' }}>
                                <h3 className="section-title" style={{ marginBottom: 0 }}><i className="pi pi-chart-doughnut" /> Öncelik Dağılımı</h3>
                                <Button 
                                    label="Detaylar" 
                                    icon="pi pi-external-link" 
                                    className="p-button-outlined p-button-sm detail-btn-colored" 
                                    onClick={() => {
                                        setDetailTitle('Tüm Görevler (Öncelik)');
                                        setDetailFilters({});
                                        setDetailsVisible(true);
                                    }} 
                                />
                            </div>
                            <div style={{ flex: 1, minHeight: '200px', display: 'flex', justifyContent: 'center' }}>
                                <Chart type="doughnut" data={priorityChartData} options={{...chartOptions, plugins: {...chartOptions.plugins, legend: { display: false }}}} />
                            </div>
                        </div>
                    </div>

                    {/* Middle Row: Critical List & Active Users Yan Yana */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', flex: 1 }}>
                        <div className="glass-panel critical-panel">
                            <h3 className="section-title" style={{ color: '#f87171' }}><i className="pi pi-exclamation-triangle" /> Kritik Gecikmeler</h3>
                            {!gecikenGorevler || gecikenGorevler.length === 0 ? (
                                <div className="empty-state">Geciken görev yok 🎉</div>
                            ) : (
                                <div className="active-users-list">
                                    {gecikenGorevler.slice(0, 4).map(g => (
                                        <Link key={g.id} href={`/gorevler/${g.id}`} className="premium-list-item">
                                            <div className="item-content">
                                                <div className="item-title">{g.baslik}</div>
                                                <div className="item-meta">
                                                    <span className="item-user"><i className="pi pi-user" /> {g.atananKullaniciAdi ?? g.atananGrupAdi}</span>
                                                    <span className="item-date overdue"><i className="pi pi-calendar-times" /> {formatDate(g.bitisTarihi)}</span>
                                                </div>
                                            </div>
                                            <i className="pi pi-chevron-right arrow" />
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="glass-panel">
                            <h3 className="section-title"><i className="pi pi-user" /> En Aktif Kişiler</h3>
                            <div className="active-users-list">
                                {dashboard.kisiIstatistikleri.slice(0, 4).map((k, i) => {
                                    const oran = k.toplamGorev > 0 ? Math.round((k.tamamlananGorev / k.toplamGorev) * 100) : 0;
                                    return (
                                        <div key={i} className="user-stat-row">
                                            <div className="user-info">
                                                <div className="user-avatar">{k.kullaniciAdi.charAt(0)}</div>
                                                <div className="user-details" style={{ overflow: 'hidden' }}>
                                                    <span className="user-name" style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{k.kullaniciAdi}</span>
                                                    <small className="user-subtext">{k.tamamlananGorev} / {k.toplamGorev}</small>
                                                </div>
                                                <div className="user-percentage">%{oran}</div>
                                            </div>
                                            <div className="user-progress-bar">
                                                <div className="progress-fill shadow-sm" style={{ width: `${oran}%` }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Row: Trend and My Tasks */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
                    <h3 className="section-title"><i className="pi pi-chart-line" /> Haftalık Görev Trendi</h3>
                    <div style={{ flex: 1, minHeight: '320px' }}>
                        <Chart type="line" data={trendChartData} options={{...barOptions, maintainAspectRatio: false}} style={{ height: '100%' }} />
                    </div>
                </div>

                <div className="glass-panel">
                    <h3 className="section-title"><i className="pi pi-list" /> Bana Atanan Görevler</h3>
                    {!myGorevler || myGorevler.length === 0 ? (
                        <div className="empty-state">Atanmış göreviniz yok ☕</div>
                    ) : (
                        <div className="active-users-list">
                            {myGorevler.slice(0, 5).map(g => (
                                <Link key={g.id} href={`/gorevler/${g.id}`} className="premium-list-item" style={{ background: 'rgba(59, 130, 246, 0.03)' }}>
                                    <div className="item-content">
                                        <div className="item-title">{g.baslik}</div>
                                        <div className="item-meta">
                                            <span className={`status-badge-mini status-${g.durum}`}>{DURUM_LABELS[g.durum as GorevDurumu]}</span>
                                            <span className="item-date"><i className="pi pi-calendar" /> {formatDate(g.bitisTarihi)}</span>
                                        </div>
                                    </div>
                                    <i className="pi pi-chevron-right arrow" />
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Details Dialog */}
            <Dialog 
                header={<div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><i className="pi pi-info-circle" /> {detailTitle}</div>} 
                visible={detailsVisible} 
                style={{ width: '85vw' }} 
                onHide={() => { setDetailsVisible(false); setDetailFilters(null); }}
                className="premium-dialog"
                maskClassName="premium-mask"
            >
                <DataTable 
                    value={detailGorevler || []} 
                    loading={isDetailsLoading}
                    paginator rows={10} 
                    className="p-datatable-modern"
                    emptyMessage="Bu kategoride görev bulunamadı."
                    stripedRows
                    responsiveLayout="stack"
                >
                    <Column field="baslik" header="Başlık" body={(rowData) => (
                        <Link href={`/gorevler/${rowData.id}`} className="table-link">
                            {rowData.baslik}
                        </Link>
                    )} />
                    <Column field="durum" header="Durum" body={(rowData) => <span className={`status-badge status-${rowData.durum}`}>{DURUM_LABELS[rowData.durum as GorevDurumu]}</span>} />
                    <Column field="oncelik" header="Öncelik" body={(rowData) => <span className={`priority-badge priority-${rowData.oncelik}`}>{ONCELIK_LABELS[rowData.oncelik as OncelikSeviyesi]}</span>} />
                    <Column field="atananKullaniciAdi" header="Atanan" body={(rowData) => (
                        <div className="atanan-col">
                            <i className="pi pi-user" style={{ fontSize: '0.8rem', opacity: 0.7 }} /> 
                            {rowData.atananKullaniciAdi ?? rowData.atananGrupAdi ?? '-'}
                        </div>
                    )} />
                    <Column field="bitisTarihi" header="Bitiş Tarihi" body={(rowData) => <span className="date-text">{formatDate(rowData.bitisTarihi)}</span>} />
                </DataTable>
            </Dialog>

            <style jsx>{`
                .dashboard-container {
                    background: radial-gradient(circle at top right, rgba(14, 165, 233, 0.05), transparent 400px),
                                radial-gradient(circle at bottom left, rgba(99, 102, 241, 0.05), transparent 400px);
                    min-height: 100%;
                }
                .current-date {
                    background: rgba(255,255,255,0.1);
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-size: 0.9rem;
                    color: var(--primary);
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    border: 1px solid var(--border-color);
                }
                .section-title {
                    margin-bottom: 20px;
                    color: var(--primary);
                    font-size: 1.35rem;
                    font-weight: 800;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .panel-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }
                
                /* Premium Cards */
                .premium-card {
                    padding: 24px;
                    border-radius: 20px;
                    color: white;
                    position: relative;
                    overflow: hidden;
                    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .premium-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 15px 30px rgba(0,0,0,0.15);
                }
                .premium-card::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%);
                    pointer-events: none;
                }
                
                .kpi-total { background: linear-gradient(135deg, #4f46e5, #818cf8); }
                .kpi-active { background: linear-gradient(135deg, #0ea5e9, #38bdf8); }
                .kpi-success { background: linear-gradient(135deg, #10b981, #34d399); }
                .kpi-danger { background: linear-gradient(135deg, #ef4444, #f87171); }
                .kpi-warning { background: linear-gradient(135deg, #f59e0b, #fbbf24); }

                .card-inner { position: relative; z-index: 1; }
                .card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
                .card-label { font-size: 0.85rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.9; }
                .card-icon { font-size: 1.4rem; opacity: 0.8; }
                .card-value { font-size: 2.2rem; font-weight: 800; margin-bottom: 5px; text-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                
                .card-progress { height: 3px; background: rgba(0,0,0,0.05); border-radius: 2px; overflow: hidden; margin-top: 10px; margin-bottom: 8px; }
                .card-percent { font-size: 0.75rem; font-weight: 500; opacity: 0.9; }

                .detail-btn-colored {
                    color: var(--primary) !important;
                    background: var(--primary-lighter) !important;
                    border-color: var(--primary) !important;
                    font-weight: 700 !important;
                    padding: 4px 12px !important;
                }
                .detail-btn-colored:hover {
                    background: var(--primary) !important;
                    color: white !important;
                }
                .status-badge-mini {
                    font-size: 0.7rem;
                    padding: 2px 8px;
                    border-radius: 10px;
                    font-weight: 600;
                }
                /* Glass Panels */
                .glass-panel {
                    background: rgba(255, 255, 255, 0.85);
                    backdrop-filter: blur(15px);
                    border: 1px solid rgba(255, 255, 255, 0.4);
                    border-radius: 20px;
                    padding: 24px;
                    box-shadow: 0 8px 32px rgba(31, 38, 135, 0.07);
                    transition: var(--transition);
                    position: relative;
                }
                .critical-panel {
                    background: linear-gradient(135deg, #1e293b, #334155) !important;
                    border: none !important;
                    color: white;
                }
                .critical-panel .section-title { color: #f87171 !important; }
                .critical-panel .premium-list-item { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1); color: white; }
                .critical-panel .premium-list-item:hover { background: rgba(255,255,255,0.1); border-color: #f87171; }
                .critical-panel .item-title { color: white; }
                .critical-panel .item-meta { color: rgba(255,255,255,0.6); }
                .critical-panel .arrow { color: rgba(255,255,255,0.4); }
                .critical-panel .empty-state { color: rgba(255,255,255,0.5); }
                .glass-panel:hover {
                    box-shadow: 0 8px 32px rgba(31, 38, 135, 0.12);
                    background: rgba(255, 255, 255, 0.95);
                    border-color: rgba(30, 58, 95, 0.15);
                }

                /* Lists */
                .active-users-list { display: flex; flex-direction: column; gap: 16px; }
                .user-stat-row { padding-bottom: 12px; border-bottom: 1px solid rgba(0,0,0,0.04); }
                .user-stat-row:last-child { border-bottom: none; }
                .user-info { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
                .user-avatar { width: 36px; height: 36px; background: var(--primary-lighter); color: var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; border: 2px solid white; }
                .user-details { flex: 1; display: flex; flex-direction: column; }
                .user-name { font-weight: 600; color: var(--primary); font-size: 0.95rem; }
                .user-subtext { color: var(--text-secondary); font-size: 0.8rem; }
                .user-percentage { font-weight: 700; color: var(--success); font-size: 1rem; }
                .user-progress-bar { height: 6px; background: #f1f5f9; border-radius: 3px; overflow: hidden; }
                .progress-fill { height: 100%; background: var(--success); border-radius: 3px; transition: width 0.8s ease; }

                /* Overdue Grid */
                .overdue-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; }
                .premium-list-item { 
                    display: flex; align-items: center; padding: 16px; background: white; border-radius: 12px; 
                    border: 1px solid var(--border-color); text-decoration: none; color: inherit; transition: all 0.25s; 
                    position: relative; overflow: hidden;
                }
                .premium-list-item:hover { transform: scale(1.02); border-color: var(--danger); box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
                .item-priority-indicator { display: none; }
                .item-content { flex: 1; margin-left: 0; }
                .item-title { font-weight: 700; color: var(--primary); font-size: 0.95rem; margin-bottom: 4px; }
                .item-meta { display: flex; gap: 12px; font-size: 0.8rem; color: var(--text-secondary); }
                .item-date.overdue { color: var(--danger); font-weight: 600; }
                .arrow { opacity: 0.3; transition: transform 0.2s; }
                .premium-list-item:hover .arrow { opacity: 1; transform: translateX(5px); color: var(--danger); }

                /* Table Styling */
                .table-link { color: var(--primary); font-weight: 700; text-decoration: none; }
                .table-link:hover { text-decoration: underline; color: var(--accent); }
                .status-badge { padding: 4px 12px; border-radius: 15px; font-size: 0.75rem; font-weight: 700; display: inline-block; }
                .status-0 { background: #e0f2fe; color: #0369a1; } /* Yeni */
                .status-1 { background: #fef3c7; color: #92400e; } /* Devam */
                .status-3 { background: #dcfce7; color: #166534; } /* Başarılı */
                
                .priority-badge { font-weight: 600; font-size: 0.8rem; display: flex; align-items: center; gap: 5px; }
                .priority-badge::before { content: ''; width: 8px; height: 8px; border-radius: 50%; }
                .priority-3::before { background: var(--danger); }
                .priority-2::before { background: var(--warning); }
                
                .date-text { font-family: monospace; font-size: 0.9rem; }
                
                .empty-state { padding: 40px; text-align: center; color: var(--text-secondary); font-style: italic; }
            `}</style>
        </div>
    );
}
