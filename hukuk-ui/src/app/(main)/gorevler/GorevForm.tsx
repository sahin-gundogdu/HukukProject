'use client';
import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { MultiSelect } from 'primereact/multiselect';
import { Button } from 'primereact/button';
import { useCreateGorev, useUpdateGorev, useGorevTipleri, useGruplar, useKullanicilar, useEtiketler } from '@/layout/hooks/useApi';
import { GorevDto, OncelikSeviyesi, AtamaTipi, GorevDurumu, CreateGorevRequest, UpdateGorevRequest, KullaniciRolu } from '@/types';
import { ONCELIK_LABELS, DURUM_LABELS } from '@/utils/formatters';
import { useAuth } from '@/layout/context/AuthContext';

interface Props {
    gorev: GorevDto | null;
    onClose: () => void;
}

export default function GorevForm({ gorev, onClose }: Props) {
    const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<any>({
        defaultValues: gorev ? {
            baslik: gorev.baslik,
            aciklama: gorev.aciklama,
            oncelik: gorev.oncelik,
            durum: gorev.durum,
            atamaTipi: gorev.atamaTipi,
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

    const createGorev = useCreateGorev();
    const updateGorev = useUpdateGorev();
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

    const onSubmit = async (data: any) => {
        const bitisTarihi = data.bitisTarihi ? new Date(data.bitisTarihi).toISOString() : undefined;
        if (gorev) {
            await updateGorev.mutateAsync({
                id: gorev.id,
                ...data,
                bitisTarihi,
            } as UpdateGorevRequest);
        } else {
            await createGorev.mutateAsync({
                ...data,
                bitisTarihi,
            } as CreateGorevRequest);
        }
        onClose();
    };

    return (
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
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Bitiş Tarihi</label>
                    <Controller name="bitisTarihi" control={control}
                        render={({ field }) => (
                            <Calendar {...field} dateFormat="dd/mm/yy" placeholder="Tarih seçin" showIcon
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
                            render={({ field }) => {
                                const assignableUsers = kullanicilar?.filter(k => 
                                    currentUser?.rol === KullaniciRolu.Admin || 
                                    k.id === currentUser?.id || 
                                    k.yoneticiId === currentUser?.id
                                ) ?? [];

                                return (
                                    <Dropdown {...field} options={assignableUsers.map(k => ({ label: `${k.ad} ${k.soyad}`, value: k.id }))}
                                        placeholder="Kişi seçin" showClear filter style={{ width: '100%' }} />
                                );
                            }} />
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

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                <Button type="button" label="İptal" className="p-button-outlined" onClick={onClose} />
                <Button type="submit" label={gorev ? 'Güncelle' : 'Oluştur'} icon="pi pi-check"
                    loading={createGorev.isPending || updateGorev.isPending} />
            </div>
        </form>
    );
}
