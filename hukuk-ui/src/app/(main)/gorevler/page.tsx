'use client';
import React, { useState } from 'react';
import { useGorevler, useDeleteGorev, useGorevTipleri, useGruplar, useKullanicilar, useEtiketler } from '@/layout/hooks/useApi';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { SelectButton } from 'primereact/selectbutton';
import { GorevDurumu, OncelikSeviyesi, GorevDto } from '@/types';
import { DURUM_LABELS, DURUM_SEVERITY, ONCELIK_LABELS, ONCELIK_SEVERITY, formatDate, isOverdue } from '@/utils/formatters';
import GorevForm from './GorevForm';
import KanbanBoard from './KanbanBoard';
import Link from 'next/link';

type ViewMode = 'liste' | 'kanban';

const VIEW_OPTIONS = [
    { label: 'Liste', value: 'liste', icon: 'pi pi-list' },
    { label: 'Kanban', value: 'kanban', icon: 'pi pi-th-large' },
];

export default function GorevlerPage() {
    const [viewMode, setViewMode] = useState<ViewMode>('liste');
    const [filters, setFilters] = useState<any>({});
    const [aramaMetni, setAramaMetni] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [selectedGorev, setSelectedGorev] = useState<GorevDto | null>(null);

    const { data: gorevler, isLoading } = useGorevler({ ...filters, aramaMetni: aramaMetni || undefined });
    const deleteGorev = useDeleteGorev();

    const durumOptions = Object.values(GorevDurumu).filter(v => typeof v === 'number').map(v => ({
        label: DURUM_LABELS[v as GorevDurumu], value: v,
    }));
    const oncelikOptions = Object.values(OncelikSeviyesi).filter(v => typeof v === 'number').map(v => ({
        label: ONCELIK_LABELS[v as OncelikSeviyesi], value: v,
    }));

    const handleDelete = (id: number) => {
        confirmDialog({
            message: 'Bu görevi silmek istediğinizden emin misiniz?',
            header: 'Silme Onayı',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Evet, Sil',
            rejectLabel: 'İptal',
            accept: () => deleteGorev.mutate(id),
        });
    };

    const oncelikTemplate = (row: GorevDto) => (
        <Tag value={ONCELIK_LABELS[row.oncelik]} severity={ONCELIK_SEVERITY[row.oncelik] as any} />
    );

    const durumTemplate = (row: GorevDto) => (
        <Tag value={DURUM_LABELS[row.durum]} severity={DURUM_SEVERITY[row.durum] as any} style={{ whiteSpace: 'nowrap' }} />
    );

    const baslikTemplate = (row: GorevDto) => (
        <div>
            <Link href={`/gorevler/${row.id}`} style={{ textDecoration: 'none', color: 'var(--primary)', fontWeight: 600 }}>
                {row.baslik}
            </Link>
            {isOverdue(row.bitisTarihi, row.durum) && (
                <span className="overdue-badge" style={{ marginLeft: '8px', fontSize: '0.7rem' }}>
                    <i className="pi pi-clock" /> Gecikmiş
                </span>
            )}
        </div>
    );

    const atananTemplate = (row: GorevDto) => (
        <span>{row.atananKullaniciAdi ?? row.atananGrupAdi ?? '-'}</span>
    );

    const etiketTemplate = (row: GorevDto) => (
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {row.etiketler?.map((e, i) => (
                <Tag key={i} value={e} style={{ fontSize: '0.7rem', background: 'var(--surface-200)', color: 'var(--surface-700)' }} />
            ))}
        </div>
    );

    const actionTemplate = (row: GorevDto) => (
        <div style={{ display: 'flex', gap: '4px' }}>
            <Button icon="pi pi-pencil" className="p-button-text p-button-sm" tooltip="Düzenle"
                onClick={() => { setSelectedGorev(row); setShowForm(true); }} />
            <Button icon="pi pi-trash" className="p-button-text p-button-sm p-button-danger" tooltip="Sil"
                onClick={() => handleDelete(row.id)} />
        </div>
    );

    const viewOptionTemplate = (option: any) => (
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <i className={option.icon} />
            {option.label}
        </span>
    );

    if (isLoading) return <div className="page-loading"><ProgressSpinner /></div>;

    return (
        <div>
            <ConfirmDialog />
            <div className="page-header">
                <h1 className="page-title"><i className="pi pi-list-check" /> Görevler</h1>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <SelectButton
                        value={viewMode}
                        onChange={(e) => setViewMode(e.value)}
                        options={VIEW_OPTIONS}
                        itemTemplate={viewOptionTemplate}
                        className="view-toggle"
                    />
                    <Button label="Yeni Görev" icon="pi pi-plus" onClick={() => { setSelectedGorev(null); setShowForm(true); }} />
                </div>
            </div>

            {/* Filters */}
            <div className="card" style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'end' }}>
                    <div style={{ flex: '1 1 200px' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: 'var(--text-secondary)' }}>Arama</label>
                        <InputText value={aramaMetni} onChange={e => setAramaMetni(e.target.value)}
                            placeholder="Görev ara..." style={{ width: '100%' }} />
                    </div>
                    {viewMode === 'liste' && (
                        <>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: 'var(--text-secondary)' }}>Durum</label>
                                <Dropdown value={filters.durum} options={durumOptions}
                                    onChange={e => setFilters({ ...filters, durum: e.value })}
                                    placeholder="Tümü" showClear style={{ minWidth: '160px' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: 'var(--text-secondary)' }}>Öncelik</label>
                                <Dropdown value={filters.oncelik} options={oncelikOptions}
                                    onChange={e => setFilters({ ...filters, oncelik: e.value })}
                                    placeholder="Tümü" showClear style={{ minWidth: '160px' }} />
                            </div>
                        </>
                    )}
                    <Button icon="pi pi-filter-slash" className="p-button-outlined p-button-sm" tooltip="Filtreleri Temizle"
                        onClick={() => { setFilters({}); setAramaMetni(''); }} />
                </div>
            </div>

            {/* Content */}
            {viewMode === 'liste' ? (
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <DataTable value={gorevler} paginator rows={15} stripedRows
                        emptyMessage="Görev bulunamadı." rowHover sortField="createdAt" sortOrder={-1}
                        style={{ borderRadius: 'var(--radius)' }}>
                        <Column body={baslikTemplate} header="Başlık" sortField="baslik" sortable style={{ minWidth: '250px' }} />
                        <Column body={durumTemplate} header="Durum" sortField="durum" sortable style={{ width: '130px' }} />
                        <Column body={oncelikTemplate} header="Öncelik" sortField="oncelik" sortable style={{ width: '110px' }} />
                        <Column body={atananTemplate} header="Atanan" style={{ width: '160px' }} />
                        <Column field="gorevTipiAdi" header="Tip" style={{ width: '120px' }} />
                        <Column body={etiketTemplate} header="Etiketler" style={{ width: '180px' }} />
                        <Column body={(row: GorevDto) => formatDate(row.bitisTarihi)} header="Bitiş" sortField="bitisTarihi" sortable style={{ width: '110px' }} />
                        <Column body={actionTemplate} header="" style={{ width: '90px' }} />
                    </DataTable>
                </div>
            ) : (
                <KanbanBoard gorevler={gorevler || []} />
            )}

            {/* Create/Edit Dialog */}
            <Dialog header={selectedGorev ? 'Görev Düzenle' : 'Yeni Görev'} visible={showForm}
                onHide={() => setShowForm(false)} style={{ width: '700px' }} modal blockScroll>
                <GorevForm gorev={selectedGorev} onClose={() => setShowForm(false)} />
            </Dialog>
        </div>
    );
}
