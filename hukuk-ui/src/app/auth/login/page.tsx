'use client';
import React, { useState } from 'react';
import { useAuth } from '@/layout/context/AuthContext';
import { Button } from 'primereact/button';
import type { LoginRequest } from '@/types';

export default function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [sifre, setSifre] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login({ email, sifre } as LoginRequest);
        } catch {
            setError('Geçersiz e-posta veya şifre.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-title">
                    <div style={{ fontSize: '3rem', marginBottom: '12px', color: 'var(--primary)' }}>
                        <i className="pi pi-briefcase" />
                    </div>
                    <h1>Hukuk Görev Yönetim</h1>
                    <p>Hukuk ve Uyum Başkanlığı</p>
                </div>
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="login-field">
                        <label>E-posta</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                            placeholder="ornek@sirket.com" required />
                    </div>
                    <div className="login-field">
                        <label>Şifre</label>
                        <input type="password" value={sifre} onChange={e => setSifre(e.target.value)}
                            placeholder="••••••••" required />
                    </div>
                    {error && <p className="login-error">{error}</p>}
                    <Button type="submit" label={loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                        icon="pi pi-sign-in" loading={loading}
                        className="w-full" style={{ padding: '14px', fontSize: '1rem', fontWeight: 600 }} />
                </form>
            </div>
        </div>
    );
}
