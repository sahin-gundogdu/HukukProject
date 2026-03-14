'use client';
import React, { useState } from 'react';
import { useGorevler, useGruplar, useKullanicilar } from '@/layout/hooks/useApi';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Tag } from 'primereact/tag';
import { ProgressSpinner } from 'primereact/progressspinner';
import { GorevDurumu, OncelikSeviyesi, GorevDto } from '@/types';
import { DURUM_LABELS, DURUM_SEVERITY, ONCELIK_LABELS, ONCELIK_SEVERITY, formatDate, isOverdue } from '@/utils/formatters';
import Link from 'next/link';

export default function RaporlarPage() {
    const [aramaMetni, setAramaMetni] = useState('');
    const [durum, setDurum] = useState<GorevDurumu | undefined>();
    const [oncelik, setOncelik] = useState<OncelikSeviyesi | undefined>();
    const [grupId, setGrupId] = useState<number | undefined>();
    const [kullaniciId, setKullaniciId] = useState<number | undefined>();
    const [sadeceGecikenler, setSadeceGecikenler] = useState(false);

    const { data: gorevler, isLoading } = useGorevler({
        aramaMetni: aramaMetni || undefined, durum, oncelik,
        atananGrupId: grupId, atananKullaniciId: kullaniciId,
        sadeceGecikenler: sadeceGecikenler || undefined,
    });
    const { data: gruplar } = useGruplar();
    const { data: kullanicilar } = useKullanicilar();

    const durumOptions = Object.values(GorevDurumu).filter(v => typeof v === 'number').map(v => ({ label: DURUM_LABELS[v as GorevDurumu], value: v }));
    const oncelikOptions = Object.values(OncelikSeviyesi).filter(v => typeof v === 'number').map(v => ({ label: ONCELIK_LABELS[v as OncelikSeviyesi], value: v }));

    const clearFilters = () => {
        setAramaMetni(''); setDurum(undefined); setOncelik(undefined);
        setGrupId(undefined); setKullaniciId(undefined); setSadeceGecikenler(false);
    };

    const exportCSV = () => {
        if (!gorevler?.length) return;
        const headers = ['Başlık', 'Durum', 'Öncelik', 'Atanan', 'Bitiş Tarihi', 'Etiketler'];
        const rows = gorevler.map(g => [
            g.baslik, DURUM_LABELS[g.durum], ONCELIK_LABELS[g.oncelik],
            g.atananKullaniciAdi ?? g.atananGrupAdi ?? '-', formatDate(g.bitisTarihi), g.etiketler?.join(', ') ?? '',
        ]);
        const csv = [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
        const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `gorev_rapor_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click(); URL.revokeObjectURL(url);
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title"><i className="pi pi-chart-bar" /> Raporlar</h1>
                <Button label="CSV İndir" icon="pi pi-download" className="p-button-outlined"
                    onClick={exportCSV} disabled={!gorevler?.length} />
            </div>

            {/* Advanced Filters */}
            <div className="glass-panel" style={{ marginBottom: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px', alignItems: 'end' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: 'var(--text-secondary)' }}>Arama</label>
                        <InputText value={aramaMetni} onChange={e => setAramaMetni(e.target.value)} placeholder="Görev ara..." style={{ width: '100%' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: 'var(--text-secondary)' }}>Durum</label>
                        <Dropdown value={durum} options={durumOptions} onChange={e => setDurum(e.value)} placeholder="Tümü" showClear style={{ width: '100%' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: 'var(--text-secondary)' }}>Öncelik</label>
                        <Dropdown value={oncelik} options={oncelikOptions} onChange={e => setOncelik(e.value)} placeholder="Tümü" showClear style={{ width: '100%' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: 'var(--text-secondary)' }}>Grup</label>
                        <Dropdown value={grupId} options={gruplar?.map(g => ({ label: g.ad, value: g.id })) ?? []}
                            onChange={e => setGrupId(e.value)} placeholder="Tümü" showClear style={{ width: '100%' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: 'var(--text-secondary)' }}>Kişi</label>
                        <Dropdown value={kullaniciId} options={kullanicilar?.map(k => ({ label: `${k.ad} ${k.soyad}`, value: k.id })) ?? []}
                            onChange={e => setKullaniciId(e.value)} placeholder="Tümü" showClear filter style={{ width: '100%' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <label style={{ display: 'flex', gap: '6px', alignItems: 'center', cursor: 'pointer', fontSize: '0.85rem' }}>
                            <input type="checkbox" checked={sadeceGecikenler} onChange={e => setSadeceGecikenler(e.target.checked)} />
                            Sadece Gecikenler
                        </label>
                        <Button icon="pi pi-filter-slash" className="p-button-outlined p-button-sm" tooltip="Temizle" onClick={clearFilters} />
                    </div>
                </div>
            </div>

            {/* Summary */}
            {gorevler && (
                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
                    <Tag value={`Toplam: ${gorevler.length}`} style={{ padding: '6px 14px', fontSize: '0.85rem' }} />
                    <Tag value={`Geciken: ${gorevler.filter(g => isOverdue(g.bitisTarihi, g.durum)).length}`} severity="danger" style={{ padding: '6px 14px', fontSize: '0.85rem' }} />
                    <Tag value={`Tamamlanan: ${gorevler.filter(g => g.durum === GorevDurumu.Tamamlandi).length}`} severity="success" style={{ padding: '6px 14px', fontSize: '0.85rem' }} />
                </div>
            )}

            {/* Results Table */}
            <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
                {isLoading ? (
                    <div className="page-loading"><ProgressSpinner /></div>
                ) : (
                    <DataTable value={gorevler} paginator rows={20} stripedRows rowHover
                        emptyMessage="Görev bulunamadı." sortField="createdAt" sortOrder={-1}>
                        <Column body={(row: GorevDto) => (
                            <Link href={`/gorevler/${row.id}`} style={{ textDecoration: 'none', color: 'var(--primary)', fontWeight: 600 }}>
                                {row.baslik}
                            </Link>
                        )} header="Başlık" sortField="baslik" sortable style={{ minWidth: '200px' }} />
                        <Column body={(row: GorevDto) => <Tag value={DURUM_LABELS[row.durum]} severity={DURUM_SEVERITY[row.durum] as any} />} header="Durum" sortField="durum" sortable style={{ width: '120px' }} />
                        <Column body={(row: GorevDto) => <Tag value={ONCELIK_LABELS[row.oncelik]} severity={ONCELIK_SEVERITY[row.oncelik] as any} />} header="Öncelik" style={{ width: '100px' }} />
                        <Column body={(row: GorevDto) => row.atananKullaniciAdi ?? row.atananGrupAdi ?? '-'} header="Atanan" style={{ width: '150px' }} />
                        <Column field="gorevTipiAdi" header="Tip" style={{ width: '120px' }} />
                        <Column body={(row: GorevDto) => (
                            <span>{formatDate(row.bitisTarihi)} {isOverdue(row.bitisTarihi, row.durum) && <i className="pi pi-exclamation-triangle" style={{ color: 'var(--danger)' }} />}</span>
                        )} header="Bitiş" sortField="bitisTarihi" sortable style={{ width: '120px' }} />
                    </DataTable>
                )}
            </div>
        </div>
    );
}
