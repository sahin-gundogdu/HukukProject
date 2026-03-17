'use client';
import React, { useState } from 'react';
import { useGorev, useGorevUzerineAl, useCreateGorevYorum, useDeleteAltGorev, useUpdateAltGorev } from '@/layout/hooks/useApi';
import { useAuth } from '@/layout/context/AuthContext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { InputTextarea } from 'primereact/inputtextarea';
import { TabView, TabPanel } from 'primereact/tabview';
import { Dialog } from 'primereact/dialog';
import { DURUM_LABELS, DURUM_SEVERITY, ONCELIK_LABELS, ONCELIK_SEVERITY, formatDate, formatDateTime, isOverdue } from '@/utils/formatters';
import { GorevDurumu, AltGorevDto, AtamaTipi } from '@/types';
import { useParams, useRouter } from 'next/navigation';
import AltGorevForm from '../AltGorevForm';
import { confirmDialog } from 'primereact/confirmdialog';

export default function GorevDetayPage() {
    const params = useParams();
    const router = useRouter();
    const id = Number(params.id);
    const { user } = useAuth();

    const { data: gorev, isLoading } = useGorev(id);
    const uzerineAl = useGorevUzerineAl();
    const createYorum = useCreateGorevYorum();
    const deleteAltGorev = useDeleteAltGorev(id);
    const updateAltGorev = useUpdateAltGorev();

    const [yorumIcerik, setYorumIcerik] = useState('');
    const [showAltGorevForm, setShowAltGorevForm] = useState(false);
    const [selectedAltGorev, setSelectedAltGorev] = useState<AltGorevDto | null>(null);

    if (isLoading) return <div className="page-loading"><ProgressSpinner /></div>;
    if (!gorev) return <div className="empty-state"><i className="pi pi-search" /><p>Görev bulunamadı</p></div>;

    const handleYorumEkle = async () => {
        if (!yorumIcerik.trim() || !user) return;
        await createYorum.mutateAsync({ gorevId: id, icerik: yorumIcerik, kullaniciId: user.id });
        setYorumIcerik('');
    };

    const handleUzerineAl = async () => {
        if (!user) return;
        await uzerineAl.mutateAsync({ gorevId: id, kullaniciId: user.id });
    };

    const handleDeleteAltGorev = (agId: number) => {
        confirmDialog({
            message: 'Bu alt görevi silmek istediğinizden emin misiniz?',
            header: 'Alt Görev Silme',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Evet, Sil',
            rejectLabel: 'İptal',
            accept: () => deleteAltGorev.mutate(agId),
        });
    };

    const handleToggleAltGorevDurum = async (ag: AltGorevDto) => {
        const yeniDurum = ag.durum === GorevDurumu.Tamamlandi ? GorevDurumu.YeniAtandi : GorevDurumu.Tamamlandi;
        await updateAltGorev.mutateAsync({
            id: ag.id,
            gorevId: id,
            baslik: ag.baslik,
            durum: yeniDurum,
            atamaTipi: ag.atamaTipi,
            atananKullaniciId: ag.atananKullaniciId,
            atananGrupId: ag.atananGrupId,
            tamamlanmaTarihi: yeniDurum === GorevDurumu.Tamamlandi ? new Date().toISOString() : undefined,
        });
    };

    return (
        <div>
            <div className="page-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Button icon="pi pi-arrow-left" className="p-button-text" onClick={() => router.push('/gorevler')} />
                    <h1 className="page-title" style={{ margin: 0 }}>{gorev.baslik}</h1>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {gorev.durum === GorevDurumu.YeniAtandi && (
                        <Button label="Üzerime Al" icon="pi pi-user-plus" className="p-button-outlined"
                            onClick={handleUzerineAl} loading={uzerineAl.isPending} />
                    )}
                </div>
            </div>

            {/* Header Info */}
            <div className="detail-header">
                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <Tag value={DURUM_LABELS[gorev.durum]} severity={DURUM_SEVERITY[gorev.durum] as any} style={{ fontSize: '0.9rem', padding: '6px 14px' }} />
                    <Tag value={ONCELIK_LABELS[gorev.oncelik]} severity={ONCELIK_SEVERITY[gorev.oncelik] as any} />
                    {isOverdue(gorev.bitisTarihi, gorev.durum) && <span className="overdue-badge"><i className="pi pi-clock" /> Gecikmiş</span>}
                    {gorev.etiketler?.map((e, i) => (
                        <Tag key={i} value={e} style={{ background: 'var(--surface-200)', color: 'var(--surface-700)' }} />
                    ))}
                </div>
                {gorev.aciklama && <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '16px' }}>{gorev.aciklama}</p>}
                <div className="detail-grid">
                    <div className="detail-field"><span className="detail-field-label">Görev Tipi</span><span className="detail-field-value">{gorev.gorevTipiAdi ?? '-'}</span></div>
                    <div className="detail-field"><span className="detail-field-label">Atanan</span><span className="detail-field-value">{gorev.atananKullaniciAdi ?? gorev.atananGrupAdi ?? '-'}</span></div>
                    <div className="detail-field"><span className="detail-field-label">Oluşturan</span><span className="detail-field-value">{gorev.olusturanKullaniciAdi ?? '-'}</span></div>
                    <div className="detail-field"><span className="detail-field-label">Üzerine Alan</span><span className="detail-field-value">{gorev.uzerineAlanKullaniciAdi ?? '-'}</span></div>
                    <div className="detail-field"><span className="detail-field-label">Oluşturma</span><span className="detail-field-value">{formatDate(gorev.createdAt)}</span></div>
                    <div className="detail-field"><span className="detail-field-label">Bitiş Tarihi</span><span className="detail-field-value">{formatDate(gorev.bitisTarihi)}</span></div>
                    <div className="detail-field"><span className="detail-field-label">Tamamlanma</span><span className="detail-field-value">{formatDate(gorev.tamamlanmaTarihi)}</span></div>
                </div>
            </div>

            {/* Tabs */}
            <TabView>
                {/* Alt Görevler */}
                <TabPanel header={`Alt Görevler (${gorev.altGorevler?.length ?? 0})`} leftIcon="pi pi-list mr-2">
                    <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                        <Button label="Alt Görev Ekle" icon="pi pi-plus" onClick={() => { setSelectedAltGorev(null); setShowAltGorevForm(true); }} />
                    </div>

                    {gorev.altGorevler?.length === 0 ? (
                        <div className="empty-state" style={{ padding: '30px' }}><i className="pi pi-list" /><p>Alt görev yok</p></div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {gorev.altGorevler?.map(ag => (
                                <div key={ag.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: 'var(--surface-50)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                    <Button
                                        icon={ag.durum === GorevDurumu.Tamamlandi ? 'pi pi-check-circle' : 'pi pi-circle'}
                                        className="p-button-text p-button-sm"
                                        style={{ color: ag.durum === GorevDurumu.Tamamlandi ? 'var(--success)' : 'var(--surface-400)', padding: 0, minWidth: 'auto' }}
                                        onClick={() => handleToggleAltGorevDurum(ag)}
                                        loading={updateAltGorev.isPending}
                                    />
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontWeight: 500, textDecoration: ag.durum === GorevDurumu.Tamamlandi ? 'line-through' : 'none' }}>{ag.baslik}</span>
                                        {ag.aciklama && <small style={{ color: 'var(--text-secondary)' }}>{ag.aciklama}</small>}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Tag value={DURUM_LABELS[ag.durum]} severity={DURUM_SEVERITY[ag.durum] as any} style={{ fontSize: '0.75rem' }} />
                                        {(ag.atananKullaniciAdi || ag.atananGrupAdi) && (
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <i className={ag.atamaTipi === AtamaTipi.Grup ? 'pi pi-users' : 'pi pi-user'} />
                                                {ag.atananKullaniciAdi ?? ag.atananGrupAdi}
                                            </span>
                                        )}
                                        {ag.baslangicTarihi && (
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <i className="pi pi-calendar" />
                                                {formatDate(ag.baslangicTarihi)}
                                            </span>
                                        )}
                                        {ag.tahminibitisTarihi && (
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <i className="pi pi-calendar-times" />
                                                {formatDate(ag.tahminibitisTarihi)}
                                            </span>
                                        )}
                                        <div style={{ display: 'flex', gap: '4px' }}>
                                            <Button icon="pi pi-pencil" className="p-button-text p-button-sm p-button-secondary"
                                                onClick={() => { setSelectedAltGorev(ag); setShowAltGorevForm(true); }} />
                                            <Button icon="pi pi-trash" className="p-button-text p-button-sm p-button-danger"
                                                onClick={() => handleDeleteAltGorev(ag.id)} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </TabPanel>

                {/* Yorumlar */}
                <TabPanel header={`Yorumlar (${gorev.yorumlar?.length ?? 0})`} leftIcon="pi pi-comments mr-2">
                    <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
                        <InputTextarea value={yorumIcerik} onChange={e => setYorumIcerik(e.target.value)}
                            placeholder="Yorum yazın..." rows={2} style={{ flex: 1 }} />
                        <Button label="Gönder" icon="pi pi-send" onClick={handleYorumEkle}
                            loading={createYorum.isPending} disabled={!yorumIcerik.trim()}
                            style={{ alignSelf: 'flex-end' }} />
                    </div>
                    <div className="comment-list">
                        {gorev.yorumlar?.length === 0 ? (
                            <div className="empty-state" style={{ padding: '30px' }}><i className="pi pi-comments" /><p>Henüz yorum yok</p></div>
                        ) : gorev.yorumlar?.map(y => (
                            <div key={y.id} className="comment-item">
                                <div className="comment-header">
                                    <span className="comment-author"><i className="pi pi-user" style={{ marginRight: '4px' }} />{y.kullaniciAdi}</span>
                                    <span className="comment-date">{formatDateTime(y.createdAt)}</span>
                                </div>
                                <div className="comment-body">{y.icerik}</div>
                            </div>
                        ))}
                    </div>
                </TabPanel>

                {/* Dosyalar */}
                <TabPanel header={`Dosyalar (${gorev.dosyalar?.length ?? 0})`} leftIcon="pi pi-paperclip mr-2">
                    {gorev.dosyalar?.length === 0 ? (
                        <div className="empty-state" style={{ padding: '30px' }}><i className="pi pi-paperclip" /><p>Dosya eki yok</p></div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {gorev.dosyalar?.map(d => (
                                <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--surface-50)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                    <i className="pi pi-file" style={{ fontSize: '1.5rem', color: 'var(--accent)' }} />
                                    <div>
                                        <div style={{ fontWeight: 500 }}>{d.dosyaAdi}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{d.dosyaTipi} • {formatDate(d.createdAt)}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </TabPanel>

                {/* Atama Geçmişi */}
                <TabPanel header={`Atama Geçmişi (${gorev.atamaLoglari?.length ?? 0})`} leftIcon="pi pi-history mr-2">
                    {gorev.atamaLoglari?.length === 0 ? (
                        <div className="empty-state" style={{ padding: '30px' }}><i className="pi pi-history" /><p>Atama logu yok</p></div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {gorev.atamaLoglari?.map(al => (
                                <div key={al.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px', background: 'var(--surface-50)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                    <i className="pi pi-arrow-right-arrow-left" style={{ marginTop: '4px', color: 'var(--accent)' }} />
                                    <div>
                                        <div style={{ fontWeight: 500 }}>{al.aciklama}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                            {al.atayanKullaniciAdi} → {al.atananKullaniciAdi ?? al.atananGrupAdi ?? '-'} • {formatDateTime(al.atamaTarihi)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </TabPanel>
            </TabView>

            <Dialog header={selectedAltGorev ? 'Alt Görev Düzenle' : 'Yeni Alt Görev'} visible={showAltGorevForm}
                onHide={() => { setShowAltGorevForm(false); setSelectedAltGorev(null); }} style={{ width: '500px' }} modal blockScroll>
                <AltGorevForm gorevId={id} altGorev={selectedAltGorev} onClose={() => { setShowAltGorevForm(false); setSelectedAltGorev(null); }} />
            </Dialog>
        </div>
    );
}
