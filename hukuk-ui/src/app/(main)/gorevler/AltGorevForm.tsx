'use client';
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { useCreateAltGorev, useUpdateAltGorev, useKullanicilar, useGruplar } from '@/layout/hooks/useApi';
import { AltGorevDto, AtamaTipi, GorevDurumu, CreateAltGorevRequest, UpdateAltGorevRequest } from '@/types';
import { DURUM_LABELS } from '@/utils/formatters';

interface Props {
    gorevId: number;
    altGorev?: AltGorevDto | null;   // null=oluştur, dolu=düzenle
    onClose: () => void;
}

export default function AltGorevForm({ gorevId, altGorev, onClose }: Props) {
    const isEdit = !!altGorev;

    const { register, handleSubmit, control, watch, formState: { errors } } = useForm<any>({
        defaultValues: altGorev ? {
            baslik: altGorev.baslik,
            aciklama: altGorev.aciklama,
            durum: altGorev.durum,
            atamaTipi: altGorev.atamaTipi ?? AtamaTipi.Kisi,
            atananKullaniciId: altGorev.atananKullaniciId,
            atananGrupId: altGorev.atananGrupId,
            baslangicTarihi: altGorev.baslangicTarihi ? new Date(altGorev.baslangicTarihi) : null,
            tahminibitisTarihi: altGorev.tahminibitisTarihi ? new Date(altGorev.tahminibitisTarihi) : null,
        } : {
            atamaTipi: AtamaTipi.Kisi,
            durum: GorevDurumu.YeniAtandi,
        },
    });

    const createAltGorev = useCreateAltGorev();
    const updateAltGorev = useUpdateAltGorev();
    const { data: kullanicilar } = useKullanicilar();
    const { data: gruplar } = useGruplar();

    const atamaTipi = watch('atamaTipi');

    const durumOptions = Object.values(GorevDurumu)
        .filter(v => typeof v === 'number')
        .map(v => ({ label: DURUM_LABELS[v as GorevDurumu], value: v }));

    const onSubmit = async (data: any) => {
        const baslangicTarihi = data.baslangicTarihi
            ? new Date(data.baslangicTarihi).toISOString()
            : undefined;
        const tahminibitisTarihi = data.tahminibitisTarihi
            ? new Date(data.tahminibitisTarihi).toISOString()
            : undefined;

        if (isEdit && altGorev) {
            await updateAltGorev.mutateAsync({
                id: altGorev.id,
                gorevId,
                baslik: data.baslik,
                aciklama: data.aciklama,
                durum: data.durum,
                atamaTipi: data.atamaTipi,
                atananKullaniciId: data.atamaTipi === AtamaTipi.Kisi ? data.atananKullaniciId : undefined,
                atananGrupId: data.atamaTipi === AtamaTipi.Grup ? data.atananGrupId : undefined,
                baslangicTarihi,
                tahminibitisTarihi,
            } as UpdateAltGorevRequest);
        } else {
            await createAltGorev.mutateAsync({
                baslik: data.baslik,
                aciklama: data.aciklama,
                gorevId,
                atamaTipi: data.atamaTipi,
                atananKullaniciId: data.atamaTipi === AtamaTipi.Kisi ? data.atananKullaniciId : undefined,
                atananGrupId: data.atamaTipi === AtamaTipi.Grup ? data.atananGrupId : undefined,
                baslangicTarihi,
                tahminibitisTarihi,
            } as CreateAltGorevRequest);
        }
        onClose();
    };

    const isPending = createAltGorev.isPending || updateAltGorev.isPending;

    return (
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Başlık *</label>
                <InputText
                    {...register('baslik', { required: true })}
                    placeholder="Alt görev başlığı"
                    style={{ width: '100%' }}
                    className={errors.baslik ? 'p-invalid' : ''}
                />
                {errors.baslik && <small className="p-error">Başlık zorunludur.</small>}
            </div>

            <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Açıklama</label>
                <InputTextarea {...register('aciklama')} rows={3} placeholder="Alt görev açıklaması..." style={{ width: '100%' }} />
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
                                    options={kullanicilar?.map(k => ({ label: `${k.ad} ${k.soyad}`, value: k.id })) ?? []}
                                    placeholder="Kişi seçin" showClear filter style={{ width: '100%' }} />
                            )} />
                    </div>
                ) : (
                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Atanacak Grup</label>
                        <Controller name="atananGrupId" control={control}
                            render={({ field }) => (
                                <Dropdown {...field}
                                    options={gruplar?.map(g => ({ label: g.ad, value: g.id })) ?? []}
                                    placeholder="Grup seçin" showClear style={{ width: '100%' }} />
                            )} />
                    </div>
                )}

                {isEdit && (
                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Durum</label>
                        <Controller name="durum" control={control}
                            render={({ field }) => (
                                <Dropdown {...field} options={durumOptions} style={{ width: '100%' }} />
                            )} />
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '4px' }}>
                <Button type="button" label="İptal" className="p-button-outlined" onClick={onClose} />
                <Button type="submit" label={isEdit ? 'Güncelle' : 'Ekle'} icon="pi pi-check" loading={isPending} />
            </div>
        </form>
    );
}
