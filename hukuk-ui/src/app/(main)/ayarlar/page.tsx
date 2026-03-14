'use client';
import React, { useState } from 'react';
import { useAyarlar, useUpdateAyar, useGorevTipleri, useCreateGorevTipi, useEtiketler, useCreateEtiket } from '@/layout/hooks/useApi';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { TabView, TabPanel } from 'primereact/tabview';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Tag } from 'primereact/tag';
import type { AyarDto } from '@/types';

export default function AyarlarPage() {
    const { data: ayarlar, isLoading: ayarLoading } = useAyarlar();
    const updateAyar = useUpdateAyar();
    const { data: gorevTipleri, isLoading: tipLoading } = useGorevTipleri();
    const createGorevTipi = useCreateGorevTipi();
    const { data: etiketler, isLoading: etiketLoading } = useEtiketler();
    const createEtiket = useCreateEtiket();

    const [editingAyar, setEditingAyar] = useState<AyarDto | null>(null);
    const [editValue, setEditValue] = useState('');
    const [yeniTipAd, setYeniTipAd] = useState('');
    const [yeniEtiketAd, setYeniEtiketAd] = useState('');
    const [yeniEtiketRenk, setYeniEtiketRenk] = useState('#1e3a5f');

    const handleAyarUpdate = async () => {
        if (!editingAyar) return;
        await updateAyar.mutateAsync({ id: editingAyar.id, deger: editValue });
        setEditingAyar(null);
    };

    const handleCreateTip = async () => {
        if (!yeniTipAd.trim()) return;
        await createGorevTipi.mutateAsync({ ad: yeniTipAd });
        setYeniTipAd('');
    };

    const handleCreateEtiket = async () => {
        if (!yeniEtiketAd.trim()) return;
        await createEtiket.mutateAsync({ ad: yeniEtiketAd, renk: yeniEtiketRenk });
        setYeniEtiketAd('');
    };

    if (ayarLoading) return <div className="page-loading"><ProgressSpinner /></div>;

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title"><i className="pi pi-cog" /> Ayarlar</h1>
            </div>

            <TabView>
                {/* Genel Ayarlar */}
                <TabPanel header="Genel Ayarlar" leftIcon="pi pi-sliders-h mr-2">
                    <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
                        <DataTable value={ayarlar} stripedRows emptyMessage="Ayar bulunamadı." rowHover>
                            <Column field="anahtar" header="Ayar" sortable style={{ fontWeight: 600 }} />
                            <Column field="deger" header="Değer" />
                            <Column field="aciklama" header="Açıklama" />
                            <Column body={(row: AyarDto) => (
                                <Button icon="pi pi-pencil" className="p-button-text p-button-sm"
                                    onClick={() => { setEditingAyar(row); setEditValue(row.deger); }} />
                            )} header="" style={{ width: '60px' }} />
                        </DataTable>
                    </div>
                </TabPanel>

                {/* Görev Tipleri */}
                <TabPanel header="Görev Tipleri" leftIcon="pi pi-tags mr-2">
                    <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
                        <InputText value={yeniTipAd} onChange={e => setYeniTipAd(e.target.value)}
                            placeholder="Yeni görev tipi adı..." style={{ flex: 1 }} />
                        <Button label="Ekle" icon="pi pi-plus" onClick={handleCreateTip}
                            loading={createGorevTipi.isPending} disabled={!yeniTipAd.trim()} />
                    </div>
                    <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
                        <DataTable value={gorevTipleri} stripedRows emptyMessage="Görev tipi bulunamadı." rowHover loading={tipLoading}>
                            <Column field="ad" header="Görev Tipi" sortable style={{ fontWeight: 600 }} />
                            <Column field="aciklama" header="Açıklama" />
                        </DataTable>
                    </div>
                </TabPanel>

                {/* Etiketler */}
                <TabPanel header="Etiketler" leftIcon="pi pi-bookmark mr-2">
                    <div style={{ marginBottom: '16px', display: 'flex', gap: '8px', alignItems: 'end' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px' }}>Etiket Adı</label>
                            <InputText value={yeniEtiketAd} onChange={e => setYeniEtiketAd(e.target.value)}
                                placeholder="Yeni etiket adı..." style={{ width: '100%' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px' }}>Renk</label>
                            <input type="color" value={yeniEtiketRenk} onChange={e => setYeniEtiketRenk(e.target.value)}
                                style={{ width: '40px', height: '38px', border: 'none', cursor: 'pointer' }} />
                        </div>
                        <Button label="Ekle" icon="pi pi-plus" onClick={handleCreateEtiket}
                            loading={createEtiket.isPending} disabled={!yeniEtiketAd.trim()} />
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {etiketler?.map(e => (
                            <Tag key={e.id} value={e.ad} style={{
                                background: e.renk ?? 'var(--primary)', color: 'white',
                                fontSize: '0.9rem', padding: '8px 16px', borderRadius: '20px',
                            }} />
                        ))}
                    </div>
                </TabPanel>
            </TabView>

            {/* Ayar Edit Dialog */}
            <Dialog header="Ayar Düzenle" visible={!!editingAyar} onHide={() => setEditingAyar(null)}
                style={{ width: '400px' }} modal>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
                            {editingAyar?.anahtar}
                        </label>
                        <InputText value={editValue} onChange={e => setEditValue(e.target.value)} style={{ width: '100%' }} />
                        {editingAyar?.aciklama && (
                            <small style={{ color: 'var(--text-secondary)', marginTop: '4px', display: 'block' }}>{editingAyar.aciklama}</small>
                        )}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <Button label="İptal" className="p-button-outlined" onClick={() => setEditingAyar(null)} />
                        <Button label="Kaydet" icon="pi pi-check" onClick={handleAyarUpdate} loading={updateAyar.isPending} />
                    </div>
                </div>
            </Dialog>
        </div>
    );
}
