'use client';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { Button } from 'primereact/button';
import { useRegisterKullanici, useGruplar, useKullanicilar } from '@/layout/hooks/useApi';
import { KullaniciDto, KullaniciRolu } from '@/types';
import { ROL_LABELS } from '@/utils/formatters';

interface Props {
    onClose: () => void;
}

export default function KullaniciForm({ onClose }: Props) {
    const { register, handleSubmit, control, formState: { errors } } = useForm<any>({
        defaultValues: {
            ad: '',
            soyad: '',
            email: '',
            sifre: '',
            rol: KullaniciRolu.Kullanici,
            grupIds: []
        }
    });

    const registerKullanici = useRegisterKullanici();
    const { data: gruplar } = useGruplar();
    const { data: kullanicilar } = useKullanicilar();

    const rolOptions = Object.values(KullaniciRolu).filter(v => typeof v === 'number').map(v => ({
        label: ROL_LABELS[v as KullaniciRolu], value: v,
    }));

    const onSubmit = async (data: any) => {
        await registerKullanici.mutateAsync(data);
        onClose();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="p-fluid flex flex-column gap-3">
            <div className="flex gap-3">
                <div className="flex-1">
                    <label className="block text-900 font-medium mb-2">Ad *</label>
                    <InputText {...register('ad', { required: true })} placeholder="Ad" 
                        className={errors.ad ? 'p-invalid' : ''} />
                </div>
                <div className="flex-1">
                    <label className="block text-900 font-medium mb-2">Soyad *</label>
                    <InputText {...register('soyad', { required: true })} placeholder="Soyad"
                        className={errors.soyad ? 'p-invalid' : ''} />
                </div>
            </div>

            <div>
                <label className="block text-900 font-medium mb-2">E-posta *</label>
                <InputText {...register('email', { required: true, pattern: /^\S+@\S+$/i })} placeholder="E-posta adresi"
                    className={errors.email ? 'p-invalid' : ''} />
            </div>

            <div>
                <label className="block text-900 font-medium mb-2">Şifre *</label>
                <Controller name="sifre" control={control} rules={{ required: true }}
                    render={({ field }) => (
                        <Password {...field} toggleMask placeholder="Şifre" feedback={false}
                            className={errors.sifre ? 'p-invalid' : ''} />
                    )} />
            </div>

            <div className="flex gap-3">
                <div className="flex-1">
                    <label className="block text-900 font-medium mb-2">Rol</label>
                    <Controller name="rol" control={control}
                        render={({ field }) => <Dropdown {...field} options={rolOptions} appendTo="self" />} />
                </div>
                <div className="flex-1">
                    <label className="block text-900 font-medium mb-2">Gruplar</label>
                    <Controller name="grupIds" control={control}
                        render={({ field }) => (
                            <MultiSelect {...field} options={gruplar?.map(g => ({ label: g.ad, value: g.id })) ?? []}
                                placeholder="Grup seçiniz" display="chip" appendTo="self" />
                        )} />
                </div>
            </div>

            <div>
                <label className="block text-900 font-medium mb-2">Yönetici</label>
                <Controller name="yoneticiId" control={control}
                    render={({ field }) => (
                        <Dropdown {...field} options={kullanicilar?.map(k => ({ label: `${k.ad} ${k.soyad}`, value: k.id })) ?? []}
                            placeholder="Yönetici seçiniz" showClear filter appendTo="self" />
                    )} />
            </div>

            <div className="flex justify-content-end gap-2 mt-4">
                <Button type="button" label="İptal" icon="pi pi-times" className="p-button-text" onClick={onClose} />
                <Button type="submit" label="Kaydet" icon="pi pi-check" loading={registerKullanici.isPending} />
            </div>
        </form>
    );
}
