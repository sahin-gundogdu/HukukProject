'use client';
import React, { useState } from 'react';
import { useKullanicilar } from '@/layout/hooks/useApi';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { KullaniciDto, KullaniciRolu } from '@/types';
import { ROL_LABELS, ROL_SEVERITY } from '@/utils/formatters';
import KullaniciForm from './KullaniciForm';

export default function KullanicilarPage() {
    const [showForm, setShowForm] = useState(false);
    const { data: kullanicilar, isLoading } = useKullanicilar();

    const rolTemplate = (row: KullaniciDto) => (
        <Tag value={ROL_LABELS[row.rol]} severity={ROL_SEVERITY[row.rol] as any} />
    );

    const durumTemplate = (row: KullaniciDto) => (
        <Tag value={row.aktif ? 'Aktif' : 'Pasif'} severity={row.aktif ? 'success' : 'danger'} />
    );

    const adSoyadTemplate = (row: KullaniciDto) => (
        <div className="flex align-items-center gap-2">
            <div className="flex flex-column">
                <span className="font-bold">{row.ad} {row.soyad}</span>
            </div>
        </div>
    );

    const emailTemplate = (row: KullaniciDto) => (
        <span className="text-secondary">{row.email}</span>
    );

    const grupTemplate = (row: KullaniciDto) => (
        <div className="flex gap-1 flex-wrap">
            {row.gruplar && row.gruplar.length > 0 ? (
                row.gruplar.map((g, i) => (
                    <Tag key={i} value={g} style={{ fontSize: '0.7rem', background: 'var(--surface-200)', color: 'var(--surface-700)' }} />
                ))
            ) : (
                <span className="text-secondary" style={{ fontSize: '0.8rem' }}>-</span>
            )}
        </div>
    );

    if (isLoading) return <div className="page-loading"><ProgressSpinner /></div>;

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title"><i className="pi pi-users" /> Kullanıcılar</h1>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <Button label="Yeni Kullanıcı" icon="pi pi-plus" onClick={() => setShowForm(true)} />
                </div>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <DataTable 
                    value={kullanicilar} 
                    paginator 
                    rows={10} 
                    stripedRows
                    emptyMessage="Kullanıcı bulunamadı." 
                    rowHover 
                    style={{ borderRadius: 'var(--radius)' }}
                >
                    <Column body={adSoyadTemplate} header="Ad Soyad" sortField="ad" sortable style={{ minWidth: '200px' }} />
                    <Column body={emailTemplate} header="E-posta" sortField="email" sortable style={{ minWidth: '200px' }} />
                    <Column body={rolTemplate} header="Rol" sortField="rol" sortable style={{ width: '120px' }} />
                    <Column body={grupTemplate} header="Gruplar" style={{ minWidth: '150px' }} />
                    <Column body={durumTemplate} header="Durum" sortField="aktif" sortable style={{ width: '120px' }} />
                </DataTable>
            </div>

            <Dialog header="Yeni Kullanıcı" visible={showForm} style={{ width: '500px' }} modal blockScroll onHide={() => setShowForm(false)}>
                <KullaniciForm onClose={() => setShowForm(false)} />
            </Dialog>
        </div>
    );
}
