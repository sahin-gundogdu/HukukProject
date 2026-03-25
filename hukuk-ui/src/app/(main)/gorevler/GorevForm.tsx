'use client';
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { MultiSelect } from 'primereact/multiselect';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import { useCreateGorev, useUpdateGorev, useGorevTipleri, useGruplar, useKullanicilar, useEtiketler, useCreateAltGorev } from '@/layout/hooks/useApi';
import { GorevDto, OncelikSeviyesi, AtamaTipi, GorevDurumu, CreateGorevRequest, UpdateGorevRequest, CreateAltGorevRequest } from '@/types';
import { ONCELIK_LABELS, DURUM_LABELS } from '@/utils/formatters';
import { useAuth } from '@/layout/context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import AltGorevForm from './AltGorevForm';

interface Props {
    gorev: GorevDto | null;
    onClose: () => void;
}

interface LocalAltGorev {
    tempId: number;
    baslik: string;
    aciklama?: string;
    atamaTipi: AtamaTipi;
    atananKullaniciId?: number;
    atananKullaniciAdi?: string;
    atananGrupId?: number;
    atananGrupAdi?: string;
    baslangicTarihi?: string;
    tahminibitisTarihi?: string;
}

export default function GorevForm({ gorev, onClose }: Props) {
    const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<any>({
        defaultValues: gorev ? {
            baslik: gorev.baslik,
            aciklama: gorev.aciklama,
            oncelik: gorev.oncelik,
            durum: gorev.durum,
            atamaTipi: gorev.atamaTipi,
            baslangicTarihi: gorev.baslangicTarihi ? new Date(gorev.baslangicTarihi) : null,
            bitisTarihi: gorev.bitisTarihi ? new Date(gorev.bitisTarihi) : null,
            gorevTipiId: gorev.gorevTipiId,
            atananKullaniciId: gorev.atananKullaniciId,
            atananGrupId: gorev.atananGrupId,
            etiketIds: [],
        } : {
            oncelik: OncelikSeviyesi.Orta,
            atamaTipi: AtamaTipi.Kisi,
        },
    });

    const [localAltGorevler, setLocalAltGorevler] = useState<LocalAltGorev[]>([]);
    const [showAltGorevDialog, setShowAltGorevDialog] = useState(false);
    const [localCounter, setLocalCounter] = useState(0);

    const createGorev = useCreateGorev();
    const updateGorev = useUpdateGorev();
    const createAltGorev = useCreateAltGorev();
    const { data: gorevTipleri } = useGorevTipleri();
    const { data: gruplar } = useGruplar();
    const { data: kullanicilar } = useKullanicilar();
    const { data: etiketler } = useEtiketler();
    const { user: currentUser } = useAuth();

    const atamaTipi = watch('atamaTipi');
    const gorevTipiId = watch('gorevTipiId');

    const oncelikOptions = Object.values(OncelikSeviyesi).filter(v => typeof v === 'number').map(v => ({
        label: ONCELIK_LABELS[v as OncelikSeviyesi], value: v,
    }));

    const durumOptions = Object.values(GorevDurumu).filter(v => typeof v === 'number').map(v => ({
        label: DURUM_LABELS[v as GorevDurumu], value: v,
    }));

    const queryClient = useQueryClient();

    const handleAddLocalAltGorev = (data: any) => {
        const kullanici = kullanicilar?.find(k => k.id === data.atananKullaniciId);
        const grup = gruplar?.find(g => g.id === data.atananGrupId);
        const newItem: LocalAltGorev = {
            tempId: localCounter,
            baslik: data.baslik,
            aciklama: data.aciklama,
            atamaTipi: data.atamaTipi,
            atananKullaniciId: data.atamaTipi === AtamaTipi.Kisi ? data.atananKullaniciId : undefined,
            atananKullaniciAdi: data.atamaTipi === AtamaTipi.Kisi && kullanici ? `${kullanici.ad} ${kullanici.soyad}` : undefined,
            atananGrupId: data.atamaTipi === AtamaTipi.Grup ? data.atananGrupId : undefined,
            atananGrupAdi: data.atamaTipi === AtamaTipi.Grup && grup ? grup.ad : undefined,
            baslangicTarihi: data.baslangicTarihi ? new Date(data.baslangicTarihi).toISOString() : undefined,
            tahminibitisTarihi: data.tahminibitisTarihi ? new Date(data.tahminibitisTarihi).toISOString() : undefined,
        };
        setLocalAltGorevler(prev => [...prev, newItem]);
        setLocalCounter(c => c + 1);
        setShowAltGorevDialog(false);
    };

    const handleRemoveLocalAltGorev = (tempId: number) => {
        setLocalAltGorevler(prev => prev.filter(a => a.tempId !== tempId));
    };

    const onSubmit = async (data: any) => {
        const baslangicTarihi = data.baslangicTarihi ? new Date(data.baslangicTarihi).toISOString() : undefined;
        const bitisTarihi = data.bitisTarihi ? new Date(data.bitisTarihi).toISOString() : undefined;
        let gorevId: number | null = null;

        if (gorev) {
            await updateGorev.mutateAsync({
                id: gorev.id,
                ...data,
                baslangicTarihi,
                bitisTarihi,
            } as UpdateGorevRequest);
            gorevId = gorev.id;
        } else {
            const result = await createGorev.mutateAsync({
                ...data,
                baslangicTarihi,
                bitisTarihi,
            } as CreateGorevRequest);
            gorevId = result.id ?? null;
        }

        // Yeni görev için local alt görevleri kaydet
        if (gorevId && !gorev && localAltGorevler.length > 0) {
            for (const ag of localAltGorevler) {
                await createAltGorev.mutateAsync({
                    baslik: ag.baslik,
                    aciklama: ag.aciklama,
                    gorevId,
                    atamaTipi: ag.atamaTipi,
                    atananKullaniciId: ag.atananKullaniciId,
                    atananGrupId: ag.atananGrupId,
                    baslangicTarihi: ag.baslangicTarihi,
                    tahminibitisTarihi: ag.tahminibitisTarihi,
                } as CreateAltGorevRequest);
            }
        }

        // Listeyi anında güncelle
        queryClient.invalidateQueries({ queryKey: ['gorevler'] });

        onClose();
    };

    const isPending = createGorev.isPending || updateGorev.isPending;

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Başlık *</label>
                    <InputText {...register('baslik', { required: true })} placeholder="Görev başlığı" style={{ width: '100%' }}
                        className={errors.baslik ? 'p-invalid' : ''} />
                </div>

                <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Açıklama</label>
                    <InputTextarea {...register('aciklama')} rows={3} placeholder="Görev açıklaması..." style={{ width: '100%' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Öncelik</label>
                        <Controller name="oncelik" control={control}
                            render={({ field }) => <Dropdown {...field} options={oncelikOptions} style={{ width: '100%' }} />} />
                    </div>

                    {gorev && (
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Durum</label>
                            <Controller name="durum" control={control}
                                render={({ field }) => <Dropdown {...field} options={durumOptions} style={{ width: '100%' }} />} />
                        </div>
                    )}

                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Görev Tipi</label>
                        <Dropdown
                            value={gorevTipiId}
                            options={gorevTipleri?.map(t => ({ label: t.ad, value: t.id })) ?? []}
                            onChange={e => setValue('gorevTipiId', e.value)}
                            placeholder="Seçiniz" showClear style={{ width: '100%' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Başlangıç Tarihi</label>
                        <Controller name="baslangicTarihi" control={control}
                            render={({ field }) => (
                                <Calendar {...field} dateFormat="dd/mm/yy" placeholder="Başlangıç seçin" showIcon
                                    icon={() => <i className="pi pi-calendar" style={{ color: 'white' }} />} style={{ width: '100%' }} />
                            )} />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Bitiş Tarihi</label>
                        <Controller name="bitisTarihi" control={control}
                            render={({ field }) => (
                                <Calendar {...field} dateFormat="dd/mm/yy" placeholder="Bitiş seçin" showIcon
                                    icon={() => <i className="pi pi-calendar" style={{ color: 'white' }} />} style={{ width: '100%' }} />
                            )} />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Atama Tipi</label>
                        <Controller name="atamaTipi" control={control}
                            render={({ field }) => (
                                <Dropdown {...field} options={[
                                    { label: 'Kişi', value: AtamaTipi.Kisi },
                                    { label: 'Grup', value: AtamaTipi.Grup },
                                ]} style={{ width: '100%' }} />
                            )} />
                    </div>

                    {atamaTipi === AtamaTipi.Kisi ? (
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Atanacak Kişi</label>
                            <Controller name="atananKullaniciId" control={control}
                                render={({ field }) => (
                                    <Dropdown {...field} 
                                        options={kullanicilar?.map(k => ({ label: `${k.ad} ${k.soyad}`, value: k.id })) ?? []}
                                            placeholder="Kişi seçin" showClear filter style={{ width: '100%' }} />
                                    )} />
                        </div>
                    ) : (
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Atanacak Grup</label>
                            <Controller name="atananGrupId" control={control}
                                render={({ field }) => (
                                    <Dropdown {...field} options={gruplar?.map(g => ({ label: g.ad, value: g.id })) ?? []}
                                        placeholder="Grup seçin" showClear style={{ width: '100%' }} />
                                )} />
                        </div>
                    )}
                </div>

                <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Etiketler</label>
                    <Controller name="etiketIds" control={control}
                        render={({ field }) => (
                            <MultiSelect {...field} options={etiketler?.map(e => ({ label: e.ad, value: e.id })) ?? []}
                                placeholder="Etiket seçin" display="chip" style={{ width: '100%' }} />
                        )} />
                </div>

                {/* Alt Görevler — sadece yeni görev oluştururken */}
                {!gorev && (
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                                <i className="pi pi-list" style={{ marginRight: '6px' }} />
                                Alt Görevler {localAltGorevler.length > 0 && `(${localAltGorevler.length})`}
                            </label>
                            <Button
                                type="button"
                                label="Alt Görev Ekle"
                                icon="pi pi-plus"
                                className="p-button-outlined p-button-sm"
                                onClick={() => setShowAltGorevDialog(true)}
                            />
                        </div>

                        {localAltGorevler.length > 0 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                {localAltGorevler.map(ag => (
                                    <div key={ag.tempId} style={{
                                        display: 'flex', alignItems: 'center', gap: '10px',
                                        padding: '8px 12px',
                                        background: 'var(--surface-50)',
                                        borderRadius: '6px',
                                        border: '1px solid var(--border-color)',
                                    }}>
                                        <i className="pi pi-circle" style={{ color: 'var(--surface-400)', fontSize: '0.9rem' }} />
                                        <div style={{ flex: 1 }}>
                                            <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{ag.baslik}</span>
                                            {(ag.atananKullaniciAdi || ag.atananGrupAdi) && (
                                                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginLeft: '8px' }}>
                                                    <i className={ag.atamaTipi === AtamaTipi.Grup ? 'pi pi-users' : 'pi pi-user'} style={{ marginRight: '3px' }} />
                                                    {ag.atananKullaniciAdi ?? ag.atananGrupAdi}
                                                </span>
                                            )}
                                        </div>
                                        <Button
                                            type="button"
                                            icon="pi pi-times"
                                            className="p-button-text p-button-sm p-button-danger"
                                            onClick={() => handleRemoveLocalAltGorev(ag.tempId)}
                                            style={{ padding: '4px' }}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                    <Button type="button" label="İptal" className="p-button-outlined" onClick={onClose} />
                    <Button type="submit" label={gorev ? 'Güncelle' : 'Oluştur'} icon="pi pi-check" loading={isPending} />
                </div>
            </form>

            {/* Alt görev ekleme dialog'u (yeni görev için local liste) */}
            <Dialog
                header="Alt Görev Ekle"
                visible={showAltGorevDialog}
                onHide={() => setShowAltGorevDialog(false)}
                style={{ width: '500px' }}
                modal
                blockScroll
            >
                <AltGorevFormLocal
                    gruplar={gruplar ?? []}
                    kullanicilar={kullanicilar ?? []}
                    onSubmit={handleAddLocalAltGorev}
                    onClose={() => setShowAltGorevDialog(false)}
                />
            </Dialog>
        </>
    );
}

// Yerel (local) alt görev formu — sadece GorevForm içinde kullanılır, API çağrısı yapmaz
function AltGorevFormLocal({ gruplar, kullanicilar, onSubmit, onClose }: {
    gruplar: any[];
    kullanicilar: any[];
    onSubmit: (data: any) => void;
    onClose: () => void;
}) {
    const { register, handleSubmit, control, watch, formState: { errors } } = useForm<any>({
        defaultValues: { atamaTipi: AtamaTipi.Kisi },
    });
    const atamaTipi = watch('atamaTipi');

    return (
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Başlık *</label>
                <InputText {...register('baslik', { required: true })} placeholder="Alt görev başlığı" style={{ width: '100%' }}
                    className={errors.baslik ? 'p-invalid' : ''} />
                {errors.baslik && <small className="p-error">Başlık zorunludur.</small>}
            </div>

            <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Açıklama</label>
                <InputTextarea {...register('aciklama')} rows={2} placeholder="Açıklama..." style={{ width: '100%' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Atama Tipi</label>
                    <Controller name="atamaTipi" control={control}
                        render={({ field }) => (
                            <Dropdown {...field} options={[
                                { label: 'Kişi', value: AtamaTipi.Kisi },
                                { label: 'Grup', value: AtamaTipi.Grup },
                            ]} style={{ width: '100%' }} />
                        )} />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Başlangıç</label>
                    <Controller name="baslangicTarihi" control={control}
                        render={({ field }) => (
                            <Calendar {...field} dateFormat="dd/mm/yy" placeholder="Başlangıç" showIcon
                                icon={() => <i className="pi pi-calendar" style={{ color: 'white' }} />}
                                style={{ width: '100%' }} />
                        )} />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Tahmini Bitiş</label>
                    <Controller name="tahminibitisTarihi" control={control}
                        render={({ field }) => (
                            <Calendar {...field} dateFormat="dd/mm/yy" placeholder="Bitiş" showIcon
                                icon={() => <i className="pi pi-calendar" style={{ color: 'white' }} />}
                                style={{ width: '100%' }} />
                        )} />
                </div>
                {atamaTipi === AtamaTipi.Kisi ? (
                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Atanacak Kişi</label>
                        <Controller name="atananKullaniciId" control={control}
                            render={({ field }) => (
                                <Dropdown {...field}
                                    options={kullanicilar.map(k => ({ label: `${k.ad} ${k.soyad}`, value: k.id }))}
                                    placeholder="Kişi seçin" showClear filter style={{ width: '100%' }} />
                            )} />
                    </div>
                ) : (
                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Atanacak Grup</label>
                        <Controller name="atananGrupId" control={control}
                            render={({ field }) => (
                                <Dropdown {...field}
                                    options={gruplar.map(g => ({ label: g.ad, value: g.id }))}
                                    placeholder="Grup seçin" showClear style={{ width: '100%' }} />
                            )} />
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <Button type="button" label="İptal" className="p-button-outlined" onClick={onClose} />
                <Button type="submit" label="Listeye Ekle" icon="pi pi-plus" />
            </div>
        </form>
    );
}
