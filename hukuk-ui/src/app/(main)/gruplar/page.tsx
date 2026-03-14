'use client';
import React, { useState } from 'react';
import { useGruplar, useCreateGrup, useUpdateGrup, useDeleteGrup } from '@/layout/hooks/useApi';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { ProgressSpinner } from 'primereact/progressspinner';
import type { GrupDto } from '@/types';

export default function GruplarPage() {
    const { data: gruplar, isLoading } = useGruplar();
    const createGrup = useCreateGrup();
    const updateGrup = useUpdateGrup();
    const deleteGrup = useDeleteGrup();
    const [showForm, setShowForm] = useState(false);
    const [editingGrup, setEditingGrup] = useState<GrupDto | null>(null);
    const [ad, setAd] = useState('');
    const [aciklama, setAciklama] = useState('');

    const openForm = (grup?: GrupDto) => {
        setEditingGrup(grup ?? null);
        setAd(grup?.ad ?? '');
        setAciklama(grup?.aciklama ?? '');
        setShowForm(true);
    };

    const handleSubmit = async () => {
        if (!ad.trim()) return;
        if (editingGrup) {
            await updateGrup.mutateAsync({ id: editingGrup.id, ad, aciklama });
        } else {
            await createGrup.mutateAsync({ ad, aciklama });
        }
        setShowForm(false);
    };

    const handleDelete = (id: number) => {
        confirmDialog({
            message: 'Bu grubu silmek istediğinizden emin misiniz?',
            header: 'Silme Onayı',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Evet, Sil',
            rejectLabel: 'İptal',
            accept: () => deleteGrup.mutate(id),
        });
    };

    if (isLoading) return <div className="page-loading"><ProgressSpinner /></div>;

    return (
        <div>
            <ConfirmDialog />
            <div className="page-header">
                <h1 className="page-title"><i className="pi pi-users" /> Gruplar</h1>
                <Button label="Yeni Grup" icon="pi pi-plus" onClick={() => openForm()} />
            </div>

            <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
                <DataTable value={gruplar} paginator rows={10} stripedRows emptyMessage="Grup bulunamadı." rowHover>
                    <Column field="ad" header="Grup Adı" sortable style={{ fontWeight: 600 }} />
                    <Column field="aciklama" header="Açıklama" />
                    <Column field="uyeSayisi" header="Üye Sayısı" sortable style={{ width: '120px', textAlign: 'center' }} />
                    <Column body={(row: GrupDto) => (
                        <div style={{ display: 'flex', gap: '4px' }}>
                            <Button icon="pi pi-pencil" className="p-button-text p-button-sm" tooltip="Düzenle" onClick={() => openForm(row)} />
                            <Button icon="pi pi-trash" className="p-button-text p-button-sm p-button-danger" tooltip="Sil" onClick={() => handleDelete(row.id)} />
                        </div>
                    )} header="" style={{ width: '90px' }} />
                </DataTable>
            </div>

            <Dialog header={editingGrup ? 'Grup Düzenle' : 'Yeni Grup'} visible={showForm}
                onHide={() => setShowForm(false)} style={{ width: '450px' }} modal>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Grup Adı *</label>
                        <InputText value={ad} onChange={e => setAd(e.target.value)} style={{ width: '100%' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Açıklama</label>
                        <InputTextarea value={aciklama} onChange={e => setAciklama(e.target.value)} rows={3} style={{ width: '100%' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <Button label="İptal" className="p-button-outlined" onClick={() => setShowForm(false)} />
                        <Button label={editingGrup ? 'Güncelle' : 'Oluştur'} icon="pi pi-check" onClick={handleSubmit}
                            loading={createGrup.isPending || updateGrup.isPending} />
                    </div>
                </div>
            </Dialog>
        </div>
    );
}
